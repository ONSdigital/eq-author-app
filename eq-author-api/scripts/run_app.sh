#!/bin/bash

yarn install
yarn knex -- migrate:latest
yarn start
