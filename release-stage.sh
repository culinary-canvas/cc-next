#!/bin/bash

echo "Select (pre-) release level";
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
echo "Merge develop into stage..."
echo "------------------------"
git checkout stage
git merge develop --no-ff --no-edit

echo "--------------------------"
echo "Create ${level} release..."
echo "--------------------------"
standard-version --release-as ${LEVEL:-patch} --prerelease beta

echo "-------------------------"
echo "Push release to Github..."
echo "-------------------------"
git push --follow-tags origin stage

echo "-------------------------------"
echo "Merge stage back into develop..."
echo "-------------------------------"
git checkout develop
git merge stage --no-ff --no-edit
git push origin develop