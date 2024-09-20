import process from 'node:process';
export const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
export const url = (path: string) => BASE_URL + path;
