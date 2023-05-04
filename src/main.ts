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

const reg_table = [
    'al',
    'cl',
    'dl',
    'bl',
    'ah',
    'ch',
    'dh',
    'bh',
    'ax',
    'cx',
    'dc',
    'bx',
    'sp',
    'bp',
    'si',
    'di'
];

enum Opcode {
    mov = 0b0100010,
}


function main() {
    const in_buff = new Uint8Array(1024);
    const bytesRead = in_file.readSync(in_buff) || 0;
    write_line(`; ${input_file} dissassembly:`);
    write_line('bits 16');

    for (let i = 0; i < bytesRead; i++) {
        const op_code = in_buff[i] >> 2;
        const d = in_buff[i] >> 1 & 0b01;
        const w = in_buff[i] & 0b01;
        i += 1;
        const mod = in_buff[i] >> 6;
        const reg = in_buff[i] >> 3 & 0b0111;
        const r_m = in_buff[i] & 0b0111;
        
        bin_print('BYTE1', in_buff[0]);
        bin_print('BYTE2', in_buff[1]);
        bin_print('OPCODE', op_code);
        bin_print('D', d);
        bin_print('W', w);
        bin_print('MOD', mod);
        bin_print('REG', reg);
        bin_print('R/M', r_m);
        if (op_code === Opcode.mov)
        write_line(parse_mov(d, w, mod, reg, r_m));
    }
    
    
    
    in_file.close();
    out_file.close();
}

function write_line(s: string) {
    const out = encoder.encode(s + '\n');
    out_file.writeSync(out);
}

function parse_mov(d: number, w: number, mod: number, reg: number, r_m: number): string{
    w = w << 3;
    
    let src = reg_table[w | reg];
    let dest = reg_table[w | r_m];

    if (d === 0b1) {
        [src, dest] = [dest, src];
    }
    
    console.log(dest, src);
    return `mov ${dest}, ${src}`;
}

function bin_print(name: string, bytes: number) {
    console.log(name.padStart(8), (bytes >>> 0).toString(2).padStart(8, '0'));
}

const input_file = Deno.args[0];
const in_file = Deno.openSync(input_file);
const out_file = Deno.openSync('out.asm', { write: true, create: true, truncate: true});
const encoder = new TextEncoder();

main();
