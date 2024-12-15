readme a compplété pour le rendu

Commande a executer avant de commencer : 
npm install
echo 'DATABASE_URL="file:./dev.db"' > .env
npx prisma migrate dev --name init
npm start