FROM  node:20.5.1 AS build

WORKDIR /app 

COPY package.json package-lock.json  ./ 

RUN npm install 

COPY . . 

RUN npm run build 

EXPOSE 3000

CMD [ "npm" , "start" ]





   #* Implement later 
# #  * Multistage Docker file 
 #* Stage 1: Base stage
# # *{ "scripts" :{
# # *    "npm ci" : "npm install --production"
# # *}}





#   #* {Stage 1 BASE}
#         FROM node:22 AS base
#          WORKDIR /app
       
#         COPY package*.json ./
#        RUN npm ci


# # #* {Stage 2 DEPS}
#                            FROM base AS deps 
#                            COPY . .
#                            RUN npm ci 

# # #* {Stage 3 BUILD}
#                         FROM base AS builder
#                         WORKDIR /app
#                         COPY . . 
#                         COPY --from=deps /app/node_modules /app/node_modules
#                         RUN npm run build


# # #* {Stage 4 RUNTIME}
#                         FROM gcr.io/distroless/nodejs20 AS runtime
#                         WORKDIR /app


#                         COPY --from=builder /app/public ./public
#                         COPY --from=builder /app/.next/standalone ./standalone
#                         COPY --from=builder /app/.next/static ./.next/static

#                         # Set environment variables
#                         # ENV NODE_ENV=production
#                         # ENV HOSTNAME="0.0.0.0"
#                         # ENV PORT=3000

#                         EXPOSE 3000

#                         USER 1000  # Run as a non-root user

#                         CMD [ "/app/.next/standalone/server.js"]

# */