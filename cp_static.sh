#!/bin/bash
# build frontend and copy result to backend/static

cp_static () {
    cp -r frontend/dist backend/static
}

if [ -d "backend/static" ]; then
    echo 'remove old backend/static...'
    rm -r "backend/static" 
fi

if [ -d "frontend/dist" ]; then
    cp_static
fi

cd frontend &&  npm run build
cd ../ && cp_static
