#!/bin/bash

cd backend && npm run start:dev &
cd frontend-vite && npm run dev &
wait