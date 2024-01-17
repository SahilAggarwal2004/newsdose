"use server"

import { sign } from "jssign"
import { expiresIn } from "@/constants"

export const newToken = async () => [sign(process.env.MESSAGE, process.env.SECRET, { expiresIn }), Date.now() + expiresIn - 60000]