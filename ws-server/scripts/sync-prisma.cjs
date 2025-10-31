#!/usr/bin/env node

const fs = require("fs")
const path = require("path")

const ROOT_SCHEMA = path.resolve(__dirname, "../../prisma/schema.prisma")
const TARGET_DIR = path.resolve(__dirname, "../prisma")
const TARGET_SCHEMA = path.join(TARGET_DIR, "schema.prisma")

if (!fs.existsSync(ROOT_SCHEMA)) {
    console.error("[ws-server] Unable to sync Prisma schema: root prisma/schema.prisma not found")
    process.exit(1)
}

fs.mkdirSync(TARGET_DIR, { recursive: true })

const source = fs.readFileSync(ROOT_SCHEMA, "utf8")
const banner = `// AUTO-GENERATED FILE. Run \"npm run prisma:sync\" in ws-server to refresh.\n` +
    `// Source: ../../prisma/schema.prisma\n\n`

fs.writeFileSync(TARGET_SCHEMA, banner + source, "utf8")
console.log("[ws-server] Synced Prisma schema to ws-server/prisma/schema.prisma")

