#!/usr/bin/env node

const fs = require('fs-extra');
const c = require("child_process");

const title = 'Chrome Icon Update';
let total = 0;

const homedir = require('os').homedir();
const dirAplication = `${homedir}/.local/share/applications`;

fs.readdirSync(dirAplication).forEach(file => {
    if (file.endsWith('.desktop')) {
        const realFileName = dirAplication + '/' + file;
        let final = [];

        let content = fs.readFileSync(realFileName, 'utf8');
        content = content.replace(/(?:\r\n|\r|\n)/g, '\n');
        let lista = content.split("\n");

        let write = false;
        for (let i = 0; i < lista.length; i++) {
            let ln = lista[i];

            let [index, ...value] = ln.trim().split('=');
            value = value.join('=');

            if (index.trim() === 'Icon' && value.trim().startsWith('chrome-')) {
                ln = `${index}=${homedir}/.local/share/icons/hicolor/128x128/apps/${value}.png`;
                write = true;
            }

            final.push(ln);
        }

        if (write === true) {
            fs.writeFileSync(realFileName, final.join("\n"), 'utf-8');
            total++;
        }
    }
});

c.exec(`zenity --info --title="${title}" --text="${total} aplicativos atualizados" --width="200" height="50"`, {stdio: 'inherit'});
