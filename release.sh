#!/bin/bash
source colors.sh

echo ""
echo "${bold}Select release level";
echo "${green}1) Major"
echo "${cyan}2) Minor"
echo "${magenta}3) Patch (default)${normal}"

read ans
case $ans in
    1 )  level=major ;;
    2 )  level=minor ;;
    3 )  level=patch ;;
    "")  echo "${magenta}default - Patch"; level=patch ;;
    * )  level=$ans; echo "${red}${bold}Bad input ${normal}$level"; exit ;;
esac

echo "${darkblue}"
echo "------------------------"
echo "Merge stage into main..."
echo "------------------------"
echo "${gray}"
git checkout main
echo ""
git merge stage --no-ff --no-edit

echo "${darkblue}"
echo "--------------------------"
echo "Create ${level} release..."
echo "--------------------------"
echo "${gray}"
echo "npx standard-version --release-as $level"
npx standard-version --release-as $level

echo "${darkblue}"
echo "-------------------------"
echo "Push release to Github..."
echo "-------------------------"
echo "${gray}"
git push --follow-tags origin main

echo "${darkblue}"
echo "-----------------------------"
echo "Merge main back into stage..."
echo "-----------------------------"
echo "${gray}"
git checkout stage
echo ""
git merge main --no-ff --no-edit
echo ""
git push origin stage

echo "${darkblue}"
echo "-------------------------------"
echo "Merge main back into develop..."
echo "-------------------------------"
echo "${gray}"
git checkout develop
echo ""
git merge main --no-ff --no-edit
echo ""
git push origin develop