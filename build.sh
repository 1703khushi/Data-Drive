cd client
npm run build
rm -rf ../server/build
cp -r build/ ../server/build
cd ../server/build
mkdir dd
cp -r * dd/
cd dd/
rm -rf dd/
cd ../../../