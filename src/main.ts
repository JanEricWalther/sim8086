enum Register {
    al,
    cl,
    dl,
    bl,
    ah,
    ch,
    dh,
    bh,
    ax,
    cx,
    dc,
    bx,
    sp,
    bp,
    si,
    di
}


function main() {
    const input_file = Deno.args[0];
    
    const file = Deno.openSync(input_file);

    const in_buff = new Uint8Array(1024);
    const bytesRead = file.readSync(in_buff) || 0;

    for (let i = 0; i < bytesRead; i++) {
        console.log(in_buff[i]);
    }
}

main();