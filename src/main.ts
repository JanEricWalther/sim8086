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

const input_file = Deno.args[0];
const in_file = Deno.openSync(input_file);
const out_file = Deno.openSync('out.asm', { write: true, create: true, truncate: true});
const encoder = new TextEncoder();
const debug = false;

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
        
        debug_print('BYTE1', in_buff[0]);
        debug_print('BYTE2', in_buff[1]);
        debug_print('OPCODE', op_code);
        debug_print('D', d);
        debug_print('W', w);
        debug_print('MOD', mod);
        debug_print('REG', reg);
        debug_print('R/M', r_m);
        
        switch (op_code) {
        case Opcode.mov:
            write_line(parse_mov(d, w, mod, reg, r_m));
            break;
        default:
            console.error('Unknown Opcode.');
        }
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

    if (d) {
        [src, dest] = [dest, src];
    }
    
    if (debug) console.log('mov', dest, src);
    return `mov ${dest}, ${src}`;
}

function debug_print(name: string, bytes: number) {
    if (debug)
        console.log(name.padStart(8), (bytes >>> 0).toString(2).padStart(8, '0'));
}

main();