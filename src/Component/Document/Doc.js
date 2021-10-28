import React from 'react'
import { useEffect, useState } from 'react';
import TextEditor from './TextEditor'
import Quill from "quill"
import "quill/dist/quill.snow.css"

export default function Doc() {
    useEffect(()=> {
        new Quill('#container', {theme : "snow"})
    }, [])

    return <div id="container"></div>
}