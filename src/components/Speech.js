/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react'
import { HiVolumeOff, HiVolumeUp } from 'react-icons/hi';

export default function Speech({ id, text }) {
    const [speechIcon, setSpeechIcon] = useState(<HiVolumeUp className="scale me-4 p-1" />)
    const [speechId, setSpeechId] = useState()

    function newSpeech(clickId) {
        setSpeechId(clickId)
        setSpeechIcon(<HiVolumeOff className="scale me-4 p-1" />)
        const utterance = new SpeechSynthesisUtterance(text.replace(/\s/g, ' '))
        speechSynthesis.speak(utterance)
        utterance.onend = () => {
            setSpeechId()
            setSpeechIcon(<HiVolumeUp className="scale me-4 p-1" />)
        }
    }

    function speech(clickId) {
        const speaking = speechSynthesis.speaking;
        if (!speaking) return newSpeech(clickId)
        speechSynthesis.cancel()
        if (speechId !== clickId) return newSpeech(clickId)
        setSpeechId()
        setSpeechIcon(<HiVolumeUp className="scale me-4 p-1" />)
    }

    return <a role='button' onClick={() => speech(id)}>{speechIcon}</a>
}