import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

class logger {
    constructor() {
        this.logStream = fs.createWriteStream(path.join(__dirname, 'app.log'), { flags: "a" })

        this.color = {
            info: "\x1b[36m",
            error: "\x1b[31m",
            warn: "\x1b[33m"
        }
    }

    getTimeStamp() {
        return new Date().toISOString()
    }

    write(level, message) {
        const timeStamp = this.getTimeStamp()
        const formattedMessage = `[${timeStamp}] [${level.toUpperCase()}]: ${message}`

        this.logStream.write(formattedMessage + "\n")

        const color = this.color[level] || this.color.reset
        console.log(`${color}${formattedMessage}${this.color.reset}`)
    }

    info(message) { this.write("info", message) }
    error(message) { this.write("error", message) }
    warn(message) { this.write("warn", message) }
}

export default new logger()