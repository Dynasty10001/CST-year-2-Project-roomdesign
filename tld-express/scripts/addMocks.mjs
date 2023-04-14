


import Neode from 'neode';
import dotenv from 'dotenv';
dotenv.config()
// console.log(process.env)
const Neo4jVars = [process.env.REACT_APP_BOLT_SERVERADDRESS, process.env.REACT_APP_NEO4J_USERNAME, process.env.REACT_APP_NEO4J_PASSWORD]
// console.log(Neo4jVars)
// const Neo4jVars = [
// "bolt://192.168.75.128:7687",
// "neo4j",
// "NWN7DoJDXDcJ"
// ]
// const instance instanc


//This will create an instance of neode to interact with the database
//https://www.npmjs.com/package/neode
// export function setupDB(){
const instance = new Neode(...Neo4jVars);

instance.writeCypher("MATCH (n) DETACH DELETE n")
import { readFileSync } from 'fs';
const cypherQuery = readFileSync('scripts/mocks.cypher', "utf-8");
await instance.writeCypher(cypherQuery)

process.exit()