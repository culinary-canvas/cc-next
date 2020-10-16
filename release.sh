#!/bin/bash

echo "Select release level";
echo "1) Major"
echo "2) Minor"
echo "3) Patch (default)"

read ans
case $ans in
    1 )  level=MAJOR ;;
    2 )  level=MINOR ;;
    3 )  level=PATCH ;;
    "")  echo "default - Patch"; level=PATCH ;;
    * )  echo "Whats that?"; exit ;;
esac

echo "------------------------"
echo "Merge stage into main..."
echo "------------------------"
git checkout main 
git merge stage --no-ff --no-edit 

echo "--------------------------"
echo "Create ${level} release..."
echo "--------------------------"
standard-version --release-as ${LEVEL:-patch} 

echo "-------------------------"
echo "Push release to Github..."
echo "-------------------------"
git push --follow-tags origin main

echo "-----------------------------"
echo "Merge main back into stage..."
echo "-----------------------------"
git checkout stage
git merge main --no-ff --no-edit
git push origin stage

echo "-------------------------------"
echo "Merge main back into develop..."
echo "-------------------------------"
git checkout develop
git merge main --no-ff --no-edit
git push origin develop