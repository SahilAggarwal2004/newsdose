"use server"

import { sign } from "jssign"
import { expiresIn } from "@/constants"

export const genToken = async data => [sign(data, process.env.SECRET, { expiresIn }), Date.now() + expiresIn - 60000]