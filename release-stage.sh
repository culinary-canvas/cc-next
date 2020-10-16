#!/bin/bash
source colors.sh

echo ""
echo "${bold}Select (pre-) release level";
echo "${green}1) Major"
echo "${cyan}2) Minor"
echo "${magenta}3) Patch (default)${normal}"

read ans
case $ans in
    1 )  level=MAJOR ;;
    2 )  level=MINOR ;;
    3 )  level=PATCH ;;
    "")  echo "${magenta}default - Patch"; level=PATCH ;;
    * )  echo "${red}${bold}Bad input"; exit ;;
esac

echo "${darkblue}"
echo "---------------------------"
echo "Merge develop into stage..."
echo "---------------------------"
echo "${gray}"
git checkout stage
echo ""
git merge develop --no-ff --no-edit

echo "${darkblue}"
echo "--------------------------"
echo "Create ${level} release..."
echo "--------------------------"
echo "${gray}"
./node_modules/standard-version/bin/cli.js --release-as $level --prerelease beta

echo "${darkblue}"
echo "-------------------------"
echo "Push release to Github..."
echo "-------------------------"
echo "${gray}"
git push --follow-tags origin stage

echo "${darkblue}"
echo "-------------------------------"
echo "Merge stage back into develop..."
echo "-------------------------------"
echo "${gray}"
git checkout develop
echo ""
git merge stage --no-ff --no-edit
echo ""
git push origin develop