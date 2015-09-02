# Bastide
The little engine that could (and does!) run KnightHacks.org and related services. Somehow.

## Running the full stack

```
# 1. Install Node 0.12+ or Iojs, MySQL server, bower
# 2. Create a database named `hack` and import structure.sql into it
# 3. Run:
./install
node --harmony index.js
```

## Running just the website with no API

```
# 1. Install Node, bower
cd frontend/
npm install
bower install
gulp
```
