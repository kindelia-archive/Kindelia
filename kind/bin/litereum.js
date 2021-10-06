module.exports = (function() {
    function word_to_u16(w) {
        var u = 0;
        for (var i = 0; i < 16; ++i) {
            u = u | (w._ === 'Word.i' ? 1 << i : 0);
            w = w.pred;
        };
        return u;
    };

    function u16_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 16; ++i) {
            w = {
                _: (u >>> (16 - i - 1)) & 1 ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function u16_to_bits(x) {
        var s = '';
        for (var i = 0; i < 16; ++i) {
            s = (x & 1 ? '1' : '0') + s;
            x = x >>> 1;
        }
        return s;
    };

    function word_to_u32(w) {
        var u = 0;
        for (var i = 0; i < 32; ++i) {
            u = u | (w._ === 'Word.i' ? 1 << i : 0);
            w = w.pred;
        };
        return u;
    };

    function u32_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0; i < 32; ++i) {
            w = {
                _: (u >>> (32 - i - 1)) & 1 ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };

    function u32_for(state, from, til, func) {
        for (var i = from; i < til; ++i) {
            state = func(i)(state);
        }
        return state;
    };

    function word_to_u64(w) {
        var u = 0n;
        for (var i = 0n; i < 64n; i += 1n) {
            u = u | (w._ === 'Word.i' ? 1n << i : 0n);
            w = w.pred;
        };
        return u;
    };

    function u64_to_word(u) {
        var w = {
            _: 'Word.e'
        };
        for (var i = 0n; i < 64n; i += 1n) {
            w = {
                _: (u >> (64n - i - 1n)) & 1n ? 'Word.i' : 'Word.o',
                pred: w
            };
        };
        return w;
    };
    var list_for = list => nil => cons => {
        while (list._ !== 'List.nil') {
            nil = cons(list.head)(nil);
            list = list.tail;
        }
        return nil;
    };
    var list_length = list => {
        var len = 0;
        while (list._ === 'List.cons') {
            len += 1;
            list = list.tail;
        };
        return BigInt(len);
    };
    const inst_unit = x => x(null);
    const elim_unit = (x => {
        var $1 = (() => c0 => {
            var self = x;
            switch ("unit") {
                case 'unit':
                    var $0 = c0;
                    return $0;
            };
        })();
        return $1;
    });
    const inst_bool = x => x(true)(false);
    const elim_bool = (x => {
        var $4 = (() => c0 => c1 => {
            var self = x;
            if (self) {
                var $2 = c0;
                return $2;
            } else {
                var $3 = c1;
                return $3;
            };
        })();
        return $4;
    });
    const inst_nat = x => x(0n)(x0 => 1n + x0);
    const elim_nat = (x => {
        var $8 = (() => c0 => c1 => {
            var self = x;
            if (self === 0n) {
                var $5 = c0;
                return $5;
            } else {
                var $6 = (self - 1n);
                var $7 = c1($6);
                return $7;
            };
        })();
        return $8;
    });
    const inst_bits = x => x('')(x0 => x0 + '0')(x0 => x0 + '1');
    const elim_bits = (x => {
        var $14 = (() => c0 => c1 => c2 => {
            var self = x;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $9 = self.slice(0, -1);
                    var $10 = c1($9);
                    return $10;
                case 'i':
                    var $11 = self.slice(0, -1);
                    var $12 = c2($11);
                    return $12;
                case 'e':
                    var $13 = c0;
                    return $13;
            };
        })();
        return $14;
    });
    const inst_u16 = x => x(x0 => word_to_u16(x0));
    const elim_u16 = (x => {
        var $17 = (() => c0 => {
            var self = x;
            switch ('u16') {
                case 'u16':
                    var $15 = u16_to_word(self);
                    var $16 = c0($15);
                    return $16;
            };
        })();
        return $17;
    });
    const inst_u32 = x => x(x0 => word_to_u32(x0));
    const elim_u32 = (x => {
        var $20 = (() => c0 => {
            var self = x;
            switch ('u32') {
                case 'u32':
                    var $18 = u32_to_word(self);
                    var $19 = c0($18);
                    return $19;
            };
        })();
        return $20;
    });
    const inst_u64 = x => x(x0 => word_to_u64(x0));
    const elim_u64 = (x => {
        var $23 = (() => c0 => {
            var self = x;
            switch ('u64') {
                case 'u64':
                    var $21 = u64_to_word(self);
                    var $22 = c0($21);
                    return $22;
            };
        })();
        return $23;
    });
    const inst_string = x => x('')(x0 => x1 => (String.fromCharCode(x0) + x1));
    const elim_string = (x => {
        var $28 = (() => c0 => c1 => {
            var self = x;
            if (self.length === 0) {
                var $24 = c0;
                return $24;
            } else {
                var $25 = self.charCodeAt(0);
                var $26 = self.slice(1);
                var $27 = c1($25)($26);
                return $27;
            };
        })();
        return $28;
    });
    var run = (p) => {
        if (typeof window === 'undefined') {
            var rl = eval("require('readline')").createInterface({
                input: process.stdin,
                output: process.stdout,
                terminal: false
            });
            var fs = eval("require('fs')");
            var pc = eval("process");
            var ht = eval("require('http')");
            var hs = eval("require('https')");
            var dg = eval("require('dgram')");
        } else {
            var rl = {
                question: (x, f) => f(''),
                close: () => {}
            };
            var fs = {
                readFileSync: () => ''
            };
            var pc = {
                exit: () => {},
                argv: []
            };
            var ht = null;
            var hs = null;
            var dg = null;
        };
        var lib = {
            rl,
            fs,
            pc,
            ht,
            hs,
            dg
        };
        return run_io(lib, p)
            .then((x) => {
                rl.close();
                return x;
            })
            .catch((e) => {
                rl.close();
                throw e;
            });
    };
    var set_file = (lib, param) => {
        var path = '';
        for (var i = 0; i < param.length && param[i] !== '='; ++i) {
            path += param[i];
        };
        var data = param.slice(i + 1);
        lib.fs.mkdirSync(path.split('/').slice(0, -1).join('/'), {
            recursive: true
        });
        lib.fs.writeFileSync(path, data);
        return '';
    };
    var del_file = (lib, param) => {
        try {
            lib.fs.unlinkSync(param);
            return '';
        } catch (e) {
            if (e.message.indexOf('EPERM') !== -1) {
                lib.fs.rmdirSync(param);
                return '';
            } else {
                throw e;
            }
        }
    };
    var get_file = (lib, param) => {
        return lib.fs.readFileSync(param, 'utf8');
    }
    var get_dir = (lib, param) => {
        return lib.fs.readdirSync(param).join(';');
    };
    var get_file_mtime = (lib, param) => {
        return String(lib.fs.statSync(param).mtime.getTime());
    };
    var request = (lib, param) => {
        if (typeof fetch === 'undefined') {
            return new Promise((res, err) => {
                (/^https/.test(param) ? lib.hs : lib.ht).get(param, r => {
                    let data = '';
                    r.on('data', chunk => {
                        data += chunk;
                    });
                    r.on('end', () => res(data));
                }).on('error', e => res(''));
            });
        } else {
            return fetch(param).then(res => res.text()).catch(e => '');
        }
    }
    let PORTS = {};

    function init_udp(lib, port_num) {
        return new Promise((resolve, reject) => {
            if (!PORTS[port_num]) {
                PORTS[port_num] = {
                    socket: lib.dg.createSocket('udp4'),
                    mailbox: []
                };
                PORTS[port_num].socket.bind(port_num);
                PORTS[port_num].socket.on('listening', () => resolve(PORTS[port_num]));
                PORTS[port_num].socket.on('message', (data, peer) => {
                    var ip = peer.address;
                    var port = peer.port;
                    PORTS[port_num].mailbox.push({
                        ip: peer.address,
                        port: peer.port,
                        data: data.toString('hex')
                    });
                })
                PORTS[port_num].socket.on('error', (err) => {
                    console.log('err');
                    reject('UDP init error.');
                });
            } else {
                resolve(PORTS[port_num]);
            }
        });
    }
    async function send_udp(lib, port_num, to_ip, to_port_num, data) {
        var port = await init_udp(lib, port_num);
        port.socket.send(Buffer.from(data, 'hex'), to_port_num, to_ip);
        return null;
    }
    async function recv_udp(lib, port_num) {
        var port = await init_udp(lib, port_num);
        var mailbox = port.mailbox;
        port.mailbox = [];
        return mailbox;
    }
    async function stop_udp(lib, port_num) {
        PORTS[port_num].socket.close();
        delete PORTS[port_num];
    }
    var file_error = e => {
        if (e.message.indexOf('NOENT') !== -1) {
            return '';
        } else {
            throw e;
        }
    };
    var io_action = {
        print: async (lib, param) => {
            console.log(param);
            return '';
        },
        put_string: async (lib, param) => {
            process.stdout.write(param);
            return '';
        },
        get_file: async (lib, param) => {
            try {
                return get_file(lib, param);
            } catch (e) {
                return file_error(e);
            }
        },
        set_file: async (lib, param) => {
            try {
                return set_file(lib, param)
            } catch (e) {
                return file_error(e);
            }
        },
        del_file: async (lib, param) => {
            try {
                return del_file(lib, param);
            } catch (e) {
                return file_error(e);
            }
        },
        get_dir: async (lib, param) => {
            try {
                return get_dir(lib, param);
            } catch (e) {
                return file_error(e);
            }
        },
        get_file_mtime: async (lib, param) => {
            try {
                return get_file_mtime(lib, param);
            } catch (e) {
                return file_error(e);
            }
        },
        get_time: async (lib, param) => {
            return String(Date.now());
        },
        exit: async (lib, param) => {
            lib.pc.exit();
            return '';
        },
        request: async (lib, param) => {
            return request(lib, param);
        },
        get_time: async (lib, param) => {
            return String(Date.now());
        },
        get_line: async (lib, param) => {
            return await new Promise((res, err) => {
                lib.rl.question(param, (line) => res(line));
            });
        },
        get_args: async (lib, param) => {
            return lib.pc.argv[2] || '';
        },
        init_udp: async (lib, param) => {
            try {
                await init_udp(lib, Number(param));
                return '';
            } catch (e) {
                return '';
            }
        },
        send_udp: async (lib, param) => {
            let [port_num, to_ip, to_port_num, data] = param.split(';');
            await send_udp(lib, Number(port_num), to_ip, Number(to_port_num), data);
            return '';
        },
        recv_udp: async (lib, param) => {
            var mailbox = await recv_udp(lib, Number(param));
            var reply = mailbox.map(x => x.ip + ',' + x.port + ',' + x.data).join(';');
            return reply;
        },
        stop_udp: async (lib, param) => {
            await stop_udp(lib, Number(param));
            return '';
        },
        sleep: async (lib, param) => {
            return await new Promise((resolve, reject) => {
                setTimeout(() => resolve(''), Number(param));
            });
        },
    };
    var run_io = async (lib, io, depth = 0) => {
        switch (io._) {
            case 'IO.end':
                return Promise.resolve(io.value);
            case 'IO.ask':
                var action = io_action[io.query];
                var answer = await action(lib, io.param);
                return await run_io(lib, io.then(answer), depth + 1);
        }
    };

    function Litereum$World$new$(_name_count$1, _name_to_index$2, _index_to_name$3, _entry$4) {
        var $29 = ({
            _: 'Litereum.World.new',
            'name_count': _name_count$1,
            'name_to_index': _name_to_index$2,
            'index_to_name': _index_to_name$3,
            'entry': _entry$4
        });
        return $29;
    };
    const Litereum$World$new = x0 => x1 => x2 => x3 => Litereum$World$new$(x0, x1, x2, x3);

    function BBT$(_K$1, _V$2) {
        var $30 = null;
        return $30;
    };
    const BBT = x0 => x1 => BBT$(x0, x1);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $32 = self.fst;
                var $33 = $32;
                var $31 = $33;
                break;
        };
        return $31;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $35 = self.snd;
                var $36 = $35;
                var $34 = $36;
                break;
        };
        return $34;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

    function BBT$bin$(_size$3, _key$4, _val$5, _left$6, _right$7) {
        var $37 = ({
            _: 'BBT.bin',
            'size': _size$3,
            'key': _key$4,
            'val': _val$5,
            'left': _left$6,
            'right': _right$7
        });
        return $37;
    };
    const BBT$bin = x0 => x1 => x2 => x3 => x4 => BBT$bin$(x0, x1, x2, x3, x4);

    function U32$new$(_value$1) {
        var $38 = word_to_u32(_value$1);
        return $38;
    };
    const U32$new = x0 => U32$new$(x0);

    function Nat$apply$(_n$2, _f$3, _x$4) {
        var Nat$apply$ = (_n$2, _f$3, _x$4) => ({
            ctr: 'TCO',
            arg: [_n$2, _f$3, _x$4]
        });
        var Nat$apply = _n$2 => _f$3 => _x$4 => Nat$apply$(_n$2, _f$3, _x$4);
        var arg = [_n$2, _f$3, _x$4];
        while (true) {
            let [_n$2, _f$3, _x$4] = arg;
            var R = (() => {
                var self = _n$2;
                if (self === 0n) {
                    var $39 = _x$4;
                    return $39;
                } else {
                    var $40 = (self - 1n);
                    var $41 = Nat$apply$($40, _f$3, _f$3(_x$4));
                    return $41;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$(_size$1) {
        var $42 = null;
        return $42;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$i$(_pred$2) {
        var $43 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $43;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$o$(_pred$2) {
        var $44 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $44;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $46 = self.pred;
                var $47 = Word$i$($46);
                var $45 = $47;
                break;
            case 'Word.i':
                var $48 = self.pred;
                var $49 = Word$o$(Word$inc$($48));
                var $45 = $49;
                break;
            case 'Word.e':
                var $50 = Word$e;
                var $45 = $50;
                break;
        };
        return $45;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $52 = Word$e;
            var $51 = $52;
        } else {
            var $53 = (self - 1n);
            var $54 = Word$o$(Word$zero$($53));
            var $51 = $54;
        };
        return $51;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $55 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $55;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);

    function Nat$succ$(_pred$1) {
        var $56 = 1n + _pred$1;
        return $56;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);
    const BBT$tip = ({
        _: 'BBT.tip'
    });

    function BBT$singleton$(_key$3, _val$4) {
        var $57 = BBT$bin$(1, _key$3, _val$4, BBT$tip, BBT$tip);
        return $57;
    };
    const BBT$singleton = x0 => x1 => BBT$singleton$(x0, x1);

    function BBT$size$(_map$3) {
        var self = _map$3;
        switch (self._) {
            case 'BBT.bin':
                var $59 = self.size;
                var $60 = $59;
                var $58 = $60;
                break;
            case 'BBT.tip':
                var $61 = 0;
                var $58 = $61;
                break;
        };
        return $58;
    };
    const BBT$size = x0 => BBT$size$(x0);
    const Bool$false = false;
    const Bool$true = true;

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $63 = self.pred;
                var $64 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $66 = self.pred;
                            var $67 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $69 = Word$i$(Word$adder$(_a$pred$10, $66, Bool$false));
                                    var $68 = $69;
                                } else {
                                    var $70 = Word$o$(Word$adder$(_a$pred$10, $66, Bool$false));
                                    var $68 = $70;
                                };
                                return $68;
                            });
                            var $65 = $67;
                            break;
                        case 'Word.i':
                            var $71 = self.pred;
                            var $72 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $74 = Word$o$(Word$adder$(_a$pred$10, $71, Bool$true));
                                    var $73 = $74;
                                } else {
                                    var $75 = Word$i$(Word$adder$(_a$pred$10, $71, Bool$false));
                                    var $73 = $75;
                                };
                                return $73;
                            });
                            var $65 = $72;
                            break;
                        case 'Word.e':
                            var $76 = (_a$pred$8 => {
                                var $77 = Word$e;
                                return $77;
                            });
                            var $65 = $76;
                            break;
                    };
                    var $65 = $65($63);
                    return $65;
                });
                var $62 = $64;
                break;
            case 'Word.i':
                var $78 = self.pred;
                var $79 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $81 = self.pred;
                            var $82 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $84 = Word$o$(Word$adder$(_a$pred$10, $81, Bool$true));
                                    var $83 = $84;
                                } else {
                                    var $85 = Word$i$(Word$adder$(_a$pred$10, $81, Bool$false));
                                    var $83 = $85;
                                };
                                return $83;
                            });
                            var $80 = $82;
                            break;
                        case 'Word.i':
                            var $86 = self.pred;
                            var $87 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $89 = Word$i$(Word$adder$(_a$pred$10, $86, Bool$true));
                                    var $88 = $89;
                                } else {
                                    var $90 = Word$o$(Word$adder$(_a$pred$10, $86, Bool$true));
                                    var $88 = $90;
                                };
                                return $88;
                            });
                            var $80 = $87;
                            break;
                        case 'Word.e':
                            var $91 = (_a$pred$8 => {
                                var $92 = Word$e;
                                return $92;
                            });
                            var $80 = $91;
                            break;
                    };
                    var $80 = $80($78);
                    return $80;
                });
                var $62 = $79;
                break;
            case 'Word.e':
                var $93 = (_b$5 => {
                    var $94 = Word$e;
                    return $94;
                });
                var $62 = $93;
                break;
        };
        var $62 = $62(_b$3);
        return $62;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $95 = Word$adder$(_a$2, _b$3, Bool$false);
        return $95;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);

    function Word$shift_left$one$go$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $97 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $99 = Word$i$(Word$shift_left$one$go$($97, Bool$false));
                    var $98 = $99;
                } else {
                    var $100 = Word$o$(Word$shift_left$one$go$($97, Bool$false));
                    var $98 = $100;
                };
                var $96 = $98;
                break;
            case 'Word.i':
                var $101 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $103 = Word$i$(Word$shift_left$one$go$($101, Bool$true));
                    var $102 = $103;
                } else {
                    var $104 = Word$o$(Word$shift_left$one$go$($101, Bool$true));
                    var $102 = $104;
                };
                var $96 = $102;
                break;
            case 'Word.e':
                var $105 = Word$e;
                var $96 = $105;
                break;
        };
        return $96;
    };
    const Word$shift_left$one$go = x0 => x1 => Word$shift_left$one$go$(x0, x1);

    function Word$shift_left$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $107 = self.pred;
                var $108 = Word$o$(Word$shift_left$one$go$($107, Bool$false));
                var $106 = $108;
                break;
            case 'Word.i':
                var $109 = self.pred;
                var $110 = Word$o$(Word$shift_left$one$go$($109, Bool$true));
                var $106 = $110;
                break;
            case 'Word.e':
                var $111 = Word$e;
                var $106 = $111;
                break;
        };
        return $106;
    };
    const Word$shift_left$one = x0 => Word$shift_left$one$(x0);

    function Word$shift_left$(_value$2, _n$3) {
        var Word$shift_left$ = (_value$2, _n$3) => ({
            ctr: 'TCO',
            arg: [_value$2, _n$3]
        });
        var Word$shift_left = _value$2 => _n$3 => Word$shift_left$(_value$2, _n$3);
        var arg = [_value$2, _n$3];
        while (true) {
            let [_value$2, _n$3] = arg;
            var R = (() => {
                var self = _n$3;
                if (self === 0n) {
                    var $112 = _value$2;
                    return $112;
                } else {
                    var $113 = (self - 1n);
                    var $114 = Word$shift_left$(Word$shift_left$one$(_value$2), $113);
                    return $114;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$shift_left = x0 => x1 => Word$shift_left$(x0, x1);

    function Word$mul$go$(_a$3, _b$4, _acc$5) {
        var Word$mul$go$ = (_a$3, _b$4, _acc$5) => ({
            ctr: 'TCO',
            arg: [_a$3, _b$4, _acc$5]
        });
        var Word$mul$go = _a$3 => _b$4 => _acc$5 => Word$mul$go$(_a$3, _b$4, _acc$5);
        var arg = [_a$3, _b$4, _acc$5];
        while (true) {
            let [_a$3, _b$4, _acc$5] = arg;
            var R = (() => {
                var self = _a$3;
                switch (self._) {
                    case 'Word.o':
                        var $115 = self.pred;
                        var $116 = Word$mul$go$($115, Word$shift_left$(_b$4, 1n), _acc$5);
                        return $116;
                    case 'Word.i':
                        var $117 = self.pred;
                        var $118 = Word$mul$go$($117, Word$shift_left$(_b$4, 1n), Word$add$(_b$4, _acc$5));
                        return $118;
                    case 'Word.e':
                        var $119 = _acc$5;
                        return $119;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$mul$go = x0 => x1 => x2 => Word$mul$go$(x0, x1, x2);

    function Word$to_zero$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $121 = self.pred;
                var $122 = Word$o$(Word$to_zero$($121));
                var $120 = $122;
                break;
            case 'Word.i':
                var $123 = self.pred;
                var $124 = Word$o$(Word$to_zero$($123));
                var $120 = $124;
                break;
            case 'Word.e':
                var $125 = Word$e;
                var $120 = $125;
                break;
        };
        return $120;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $126 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $126;
    };
    const Word$mul = x0 => x1 => Word$mul$(x0, x1);
    const U32$mul = a0 => a1 => ((a0 * a1) >>> 0);
    const BBT$w = 3;

    function Cmp$as_ltn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $128 = Bool$true;
                var $127 = $128;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $129 = Bool$false;
                var $127 = $129;
                break;
        };
        return $127;
    };
    const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);
    const Cmp$ltn = ({
        _: 'Cmp.ltn'
    });
    const Cmp$gtn = ({
        _: 'Cmp.gtn'
    });

    function Word$cmp$go$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $131 = self.pred;
                var $132 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $134 = self.pred;
                            var $135 = (_a$pred$10 => {
                                var $136 = Word$cmp$go$(_a$pred$10, $134, _c$4);
                                return $136;
                            });
                            var $133 = $135;
                            break;
                        case 'Word.i':
                            var $137 = self.pred;
                            var $138 = (_a$pred$10 => {
                                var $139 = Word$cmp$go$(_a$pred$10, $137, Cmp$ltn);
                                return $139;
                            });
                            var $133 = $138;
                            break;
                        case 'Word.e':
                            var $140 = (_a$pred$8 => {
                                var $141 = _c$4;
                                return $141;
                            });
                            var $133 = $140;
                            break;
                    };
                    var $133 = $133($131);
                    return $133;
                });
                var $130 = $132;
                break;
            case 'Word.i':
                var $142 = self.pred;
                var $143 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $145 = self.pred;
                            var $146 = (_a$pred$10 => {
                                var $147 = Word$cmp$go$(_a$pred$10, $145, Cmp$gtn);
                                return $147;
                            });
                            var $144 = $146;
                            break;
                        case 'Word.i':
                            var $148 = self.pred;
                            var $149 = (_a$pred$10 => {
                                var $150 = Word$cmp$go$(_a$pred$10, $148, _c$4);
                                return $150;
                            });
                            var $144 = $149;
                            break;
                        case 'Word.e':
                            var $151 = (_a$pred$8 => {
                                var $152 = _c$4;
                                return $152;
                            });
                            var $144 = $151;
                            break;
                    };
                    var $144 = $144($142);
                    return $144;
                });
                var $130 = $143;
                break;
            case 'Word.e':
                var $153 = (_b$5 => {
                    var $154 = _c$4;
                    return $154;
                });
                var $130 = $153;
                break;
        };
        var $130 = $130(_b$3);
        return $130;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $155 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $155;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$ltn$(_a$2, _b$3) {
        var $156 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
        return $156;
    };
    const Word$ltn = x0 => x1 => Word$ltn$(x0, x1);
    const U32$ltn = a0 => a1 => (a0 < a1);
    const U32$from_nat = a0 => (Number(a0) >>> 0);

    function BBT$node$(_key$3, _val$4, _left$5, _right$6) {
        var _size_left$7 = BBT$size$(_left$5);
        var _size_right$8 = BBT$size$(_right$6);
        var _new_size$9 = ((1 + ((_size_left$7 + _size_right$8) >>> 0)) >>> 0);
        var $157 = BBT$bin$(_new_size$9, _key$3, _val$4, _left$5, _right$6);
        return $157;
    };
    const BBT$node = x0 => x1 => x2 => x3 => BBT$node$(x0, x1, x2, x3);

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $159 = Bool$false;
                var $158 = $159;
                break;
            case 'Cmp.gtn':
                var $160 = Bool$true;
                var $158 = $160;
                break;
        };
        return $158;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Word$gtn$(_a$2, _b$3) {
        var $161 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $161;
    };
    const Word$gtn = x0 => x1 => Word$gtn$(x0, x1);
    const U32$gtn = a0 => a1 => (a0 > a1);

    function BBT$balance$(_k$3, _v$4, _l$5, _r$6) {
        var _size_l$7 = BBT$size$(_l$5);
        var _size_r$8 = BBT$size$(_r$6);
        var _size_l_plus_size_r$9 = ((_size_l$7 + _size_r$8) >>> 0);
        var _w_x_size_l$10 = ((BBT$w * _size_l$7) >>> 0);
        var _w_x_size_r$11 = ((BBT$w * _size_r$8) >>> 0);
        var self = (_size_l_plus_size_r$9 < 2);
        if (self) {
            var $163 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
            var $162 = $163;
        } else {
            var self = (_size_r$8 > _w_x_size_l$10);
            if (self) {
                var self = _r$6;
                switch (self._) {
                    case 'BBT.bin':
                        var $166 = self.key;
                        var $167 = self.val;
                        var $168 = self.left;
                        var $169 = self.right;
                        var _size_rl$17 = BBT$size$($168);
                        var _size_rr$18 = BBT$size$($169);
                        var self = (_size_rl$17 < _size_rr$18);
                        if (self) {
                            var _new_key$19 = $166;
                            var _new_val$20 = $167;
                            var _new_left$21 = BBT$node$(_k$3, _v$4, _l$5, $168);
                            var _new_right$22 = $169;
                            var $171 = BBT$node$(_new_key$19, _new_val$20, _new_left$21, _new_right$22);
                            var $170 = $171;
                        } else {
                            var self = $168;
                            switch (self._) {
                                case 'BBT.bin':
                                    var $173 = self.key;
                                    var $174 = self.val;
                                    var $175 = self.left;
                                    var $176 = self.right;
                                    var _new_key$24 = $173;
                                    var _new_val$25 = $174;
                                    var _new_left$26 = BBT$node$(_k$3, _v$4, _l$5, $175);
                                    var _new_right$27 = BBT$node$($166, $167, $176, $169);
                                    var $177 = BBT$node$(_new_key$24, _new_val$25, _new_left$26, _new_right$27);
                                    var $172 = $177;
                                    break;
                                case 'BBT.tip':
                                    var $178 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
                                    var $172 = $178;
                                    break;
                            };
                            var $170 = $172;
                        };
                        var $165 = $170;
                        break;
                    case 'BBT.tip':
                        var $179 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
                        var $165 = $179;
                        break;
                };
                var $164 = $165;
            } else {
                var self = (_size_l$7 > _w_x_size_r$11);
                if (self) {
                    var self = _l$5;
                    switch (self._) {
                        case 'BBT.bin':
                            var $182 = self.key;
                            var $183 = self.val;
                            var $184 = self.left;
                            var $185 = self.right;
                            var _size_ll$17 = BBT$size$($184);
                            var _size_lr$18 = BBT$size$($185);
                            var self = (_size_lr$18 < _size_ll$17);
                            if (self) {
                                var _new_key$19 = $182;
                                var _new_val$20 = $183;
                                var _new_left$21 = $184;
                                var _new_right$22 = BBT$node$(_k$3, _v$4, $185, _r$6);
                                var $187 = BBT$node$(_new_key$19, _new_val$20, _new_left$21, _new_right$22);
                                var $186 = $187;
                            } else {
                                var self = $185;
                                switch (self._) {
                                    case 'BBT.bin':
                                        var $189 = self.key;
                                        var $190 = self.val;
                                        var $191 = self.left;
                                        var $192 = self.right;
                                        var _new_key$24 = $189;
                                        var _new_val$25 = $190;
                                        var _new_left$26 = BBT$node$($182, $183, $184, $191);
                                        var _new_right$27 = BBT$node$(_k$3, _v$4, $192, _r$6);
                                        var $193 = BBT$node$(_new_key$24, _new_val$25, _new_left$26, _new_right$27);
                                        var $188 = $193;
                                        break;
                                    case 'BBT.tip':
                                        var $194 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
                                        var $188 = $194;
                                        break;
                                };
                                var $186 = $188;
                            };
                            var $181 = $186;
                            break;
                        case 'BBT.tip':
                            var $195 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
                            var $181 = $195;
                            break;
                    };
                    var $180 = $181;
                } else {
                    var $196 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
                    var $180 = $196;
                };
                var $164 = $180;
            };
            var $162 = $164;
        };
        return $162;
    };
    const BBT$balance = x0 => x1 => x2 => x3 => BBT$balance$(x0, x1, x2, x3);

    function BBT$insert$(_cmp$3, _key$4, _val$5, _map$6) {
        var self = _map$6;
        switch (self._) {
            case 'BBT.bin':
                var $198 = self.key;
                var $199 = self.val;
                var $200 = self.left;
                var $201 = self.right;
                var self = _cmp$3(_key$4)($198);
                switch (self._) {
                    case 'Cmp.ltn':
                        var _new_key$12 = $198;
                        var _new_val$13 = $199;
                        var _new_left$14 = BBT$insert$(_cmp$3, _key$4, _val$5, $200);
                        var _new_right$15 = $201;
                        var $203 = BBT$balance$(_new_key$12, _new_val$13, _new_left$14, _new_right$15);
                        var $202 = $203;
                        break;
                    case 'Cmp.eql':
                        var $204 = BBT$node$(_key$4, _val$5, $200, $201);
                        var $202 = $204;
                        break;
                    case 'Cmp.gtn':
                        var _new_key$12 = $198;
                        var _new_val$13 = $199;
                        var _new_left$14 = $200;
                        var _new_right$15 = BBT$insert$(_cmp$3, _key$4, _val$5, $201);
                        var $205 = BBT$balance$(_new_key$12, _new_val$13, _new_left$14, _new_right$15);
                        var $202 = $205;
                        break;
                };
                var $197 = $202;
                break;
            case 'BBT.tip':
                var $206 = BBT$singleton$(_key$4, _val$5);
                var $197 = $206;
                break;
        };
        return $197;
    };
    const BBT$insert = x0 => x1 => x2 => x3 => BBT$insert$(x0, x1, x2, x3);

    function BBT$from_list$go$(_cmp$3, _acc$4, _xs$5) {
        var BBT$from_list$go$ = (_cmp$3, _acc$4, _xs$5) => ({
            ctr: 'TCO',
            arg: [_cmp$3, _acc$4, _xs$5]
        });
        var BBT$from_list$go = _cmp$3 => _acc$4 => _xs$5 => BBT$from_list$go$(_cmp$3, _acc$4, _xs$5);
        var arg = [_cmp$3, _acc$4, _xs$5];
        while (true) {
            let [_cmp$3, _acc$4, _xs$5] = arg;
            var R = (() => {
                var self = _xs$5;
                switch (self._) {
                    case 'List.cons':
                        var $207 = self.head;
                        var $208 = self.tail;
                        var _key$8 = Pair$fst$($207);
                        var _val$9 = Pair$snd$($207);
                        var _new_acc$10 = BBT$insert$(_cmp$3, _key$8, _val$9, _acc$4);
                        var $209 = BBT$from_list$go$(_cmp$3, _new_acc$10, $208);
                        return $209;
                    case 'List.nil':
                        var $210 = _acc$4;
                        return $210;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BBT$from_list$go = x0 => x1 => x2 => BBT$from_list$go$(x0, x1, x2);

    function BBT$from_list$(_cmp$3, _xs$4) {
        var $211 = BBT$from_list$go$(_cmp$3, BBT$tip, _xs$4);
        return $211;
    };
    const BBT$from_list = x0 => x1 => BBT$from_list$(x0, x1);
    const U16$ltn = a0 => a1 => (a0 < a1);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $213 = Bool$false;
                var $212 = $213;
                break;
            case 'Cmp.eql':
                var $214 = Bool$true;
                var $212 = $214;
                break;
        };
        return $212;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);

    function Word$eql$(_a$2, _b$3) {
        var $215 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $215;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);
    const U16$eql = a0 => a1 => (a0 === a1);

    function U16$cmp$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $217 = Cmp$ltn;
            var $216 = $217;
        } else {
            var self = (_a$1 === _b$2);
            if (self) {
                var $219 = Cmp$eql;
                var $218 = $219;
            } else {
                var $220 = Cmp$gtn;
                var $218 = $220;
            };
            var $216 = $218;
        };
        return $216;
    };
    const U16$cmp = x0 => x1 => U16$cmp$(x0, x1);

    function String$cmp$(_a$1, _b$2) {
        var String$cmp$ = (_a$1, _b$2) => ({
            ctr: 'TCO',
            arg: [_a$1, _b$2]
        });
        var String$cmp = _a$1 => _b$2 => String$cmp$(_a$1, _b$2);
        var arg = [_a$1, _b$2];
        while (true) {
            let [_a$1, _b$2] = arg;
            var R = (() => {
                var self = _a$1;
                if (self.length === 0) {
                    var self = _b$2;
                    if (self.length === 0) {
                        var $222 = Cmp$eql;
                        var $221 = $222;
                    } else {
                        var $223 = self.charCodeAt(0);
                        var $224 = self.slice(1);
                        var $225 = Cmp$ltn;
                        var $221 = $225;
                    };
                    return $221;
                } else {
                    var $226 = self.charCodeAt(0);
                    var $227 = self.slice(1);
                    var self = _b$2;
                    if (self.length === 0) {
                        var $229 = Cmp$gtn;
                        var $228 = $229;
                    } else {
                        var $230 = self.charCodeAt(0);
                        var $231 = self.slice(1);
                        var self = U16$cmp$($226, $230);
                        switch (self._) {
                            case 'Cmp.ltn':
                                var $233 = Cmp$ltn;
                                var $232 = $233;
                                break;
                            case 'Cmp.eql':
                                var $234 = String$cmp$($227, $231);
                                var $232 = $234;
                                break;
                            case 'Cmp.gtn':
                                var $235 = Cmp$gtn;
                                var $232 = $235;
                                break;
                        };
                        var $228 = $232;
                    };
                    return $228;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$cmp = x0 => x1 => String$cmp$(x0, x1);

    function Map$from_list$(_xs$2) {
        var $236 = BBT$from_list$(String$cmp, _xs$2);
        return $236;
    };
    const Map$from_list = x0 => Map$from_list$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

    function Pair$(_A$1, _B$2) {
        var $237 = null;
        return $237;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);
    const Litereum$genesis = Litereum$World$new$(0n, Map$from_list$(List$nil), Map$from_list$(List$nil), Map$from_list$(List$nil));

    function Parser$State$new$(_err$1, _nam$2, _ini$3, _idx$4, _str$5) {
        var $238 = ({
            _: 'Parser.State.new',
            'err': _err$1,
            'nam': _nam$2,
            'ini': _ini$3,
            'idx': _idx$4,
            'str': _str$5
        });
        return $238;
    };
    const Parser$State$new = x0 => x1 => x2 => x3 => x4 => Parser$State$new$(x0, x1, x2, x3, x4);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function Maybe$(_A$1) {
        var $239 = null;
        return $239;
    };
    const Maybe = x0 => Maybe$(x0);

    function Maybe$some$(_value$2) {
        var $240 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $240;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

    function Parser$run$(_parser$2, _code$3) {
        var self = _parser$2(Parser$State$new$(Maybe$none, "", 0n, 0n, _code$3));
        switch (self._) {
            case 'Parser.Reply.value':
                var $242 = self.val;
                var $243 = Maybe$some$($242);
                var $241 = $243;
                break;
            case 'Parser.Reply.error':
                var $244 = Maybe$none;
                var $241 = $244;
                break;
        };
        return $241;
    };
    const Parser$run = x0 => x1 => Parser$run$(x0, x1);

    function List$(_A$1) {
        var $245 = null;
        return $245;
    };
    const List = x0 => List$(x0);

    function Parser$Reply$(_V$1) {
        var $246 = null;
        return $246;
    };
    const Parser$Reply = x0 => Parser$Reply$(x0);

    function Parser$Reply$error$(_err$2) {
        var $247 = ({
            _: 'Parser.Reply.error',
            'err': _err$2
        });
        return $247;
    };
    const Parser$Reply$error = x0 => Parser$Reply$error$(x0);

    function Parser$Error$new$(_nam$1, _ini$2, _idx$3, _msg$4) {
        var $248 = ({
            _: 'Parser.Error.new',
            'nam': _nam$1,
            'ini': _ini$2,
            'idx': _idx$3,
            'msg': _msg$4
        });
        return $248;
    };
    const Parser$Error$new = x0 => x1 => x2 => x3 => Parser$Error$new$(x0, x1, x2, x3);

    function Parser$Reply$fail$(_nam$2, _ini$3, _idx$4, _msg$5) {
        var $249 = Parser$Reply$error$(Parser$Error$new$(_nam$2, _ini$3, _idx$4, _msg$5));
        return $249;
    };
    const Parser$Reply$fail = x0 => x1 => x2 => x3 => Parser$Reply$fail$(x0, x1, x2, x3);
    const Nat$gtn = a0 => a1 => (a0 > a1);

    function Parser$Error$combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Parser.Error.new':
                var $251 = self.idx;
                var self = _b$2;
                switch (self._) {
                    case 'Parser.Error.new':
                        var $253 = self.idx;
                        var self = ($251 > $253);
                        if (self) {
                            var $255 = _a$1;
                            var $254 = $255;
                        } else {
                            var $256 = _b$2;
                            var $254 = $256;
                        };
                        var $252 = $254;
                        break;
                };
                var $250 = $252;
                break;
        };
        return $250;
    };
    const Parser$Error$combine = x0 => x1 => Parser$Error$combine$(x0, x1);

    function Parser$Error$maybe_combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Maybe.some':
                var $258 = self.value;
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.some':
                        var $260 = self.value;
                        var $261 = Maybe$some$(Parser$Error$combine$($258, $260));
                        var $259 = $261;
                        break;
                    case 'Maybe.none':
                        var $262 = _a$1;
                        var $259 = $262;
                        break;
                };
                var $257 = $259;
                break;
            case 'Maybe.none':
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.none':
                        var $264 = Maybe$none;
                        var $263 = $264;
                        break;
                    case 'Maybe.some':
                        var $265 = _b$2;
                        var $263 = $265;
                        break;
                };
                var $257 = $263;
                break;
        };
        return $257;
    };
    const Parser$Error$maybe_combine = x0 => x1 => Parser$Error$maybe_combine$(x0, x1);

    function Parser$Reply$value$(_pst$2, _val$3) {
        var $266 = ({
            _: 'Parser.Reply.value',
            'pst': _pst$2,
            'val': _val$3
        });
        return $266;
    };
    const Parser$Reply$value = x0 => x1 => Parser$Reply$value$(x0, x1);

    function Parser$choice$(_pars$2, _pst$3) {
        var Parser$choice$ = (_pars$2, _pst$3) => ({
            ctr: 'TCO',
            arg: [_pars$2, _pst$3]
        });
        var Parser$choice = _pars$2 => _pst$3 => Parser$choice$(_pars$2, _pst$3);
        var arg = [_pars$2, _pst$3];
        while (true) {
            let [_pars$2, _pst$3] = arg;
            var R = (() => {
                var self = _pst$3;
                switch (self._) {
                    case 'Parser.State.new':
                        var $267 = self.err;
                        var $268 = self.nam;
                        var $269 = self.ini;
                        var $270 = self.idx;
                        var $271 = self.str;
                        var self = _pars$2;
                        switch (self._) {
                            case 'List.cons':
                                var $273 = self.head;
                                var $274 = self.tail;
                                var _parsed$11 = $273(_pst$3);
                                var self = _parsed$11;
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $276 = self.err;
                                        var _cur_err$13 = Maybe$some$($276);
                                        var _far_err$14 = Parser$Error$maybe_combine$($267, _cur_err$13);
                                        var _new_pst$15 = Parser$State$new$(_far_err$14, $268, $269, $270, $271);
                                        var $277 = Parser$choice$($274, _new_pst$15);
                                        var $275 = $277;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $278 = self.pst;
                                        var $279 = self.val;
                                        var $280 = Parser$Reply$value$($278, $279);
                                        var $275 = $280;
                                        break;
                                };
                                var $272 = $275;
                                break;
                            case 'List.nil':
                                var self = $267;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $282 = self.value;
                                        var $283 = Parser$Reply$error$($282);
                                        var $281 = $283;
                                        break;
                                    case 'Maybe.none':
                                        var $284 = Parser$Reply$fail$($268, $269, $270, "No parse.");
                                        var $281 = $284;
                                        break;
                                };
                                var $272 = $281;
                                break;
                        };
                        return $272;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$choice = x0 => x1 => Parser$choice$(x0, x1);

    function List$cons$(_head$2, _tail$3) {
        var $285 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $285;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function Parser$(_V$1) {
        var $286 = null;
        return $286;
    };
    const Parser = x0 => Parser$(x0);

    function Parser$many$go$(_parse$2, _values$3, _pst$4) {
        var Parser$many$go$ = (_parse$2, _values$3, _pst$4) => ({
            ctr: 'TCO',
            arg: [_parse$2, _values$3, _pst$4]
        });
        var Parser$many$go = _parse$2 => _values$3 => _pst$4 => Parser$many$go$(_parse$2, _values$3, _pst$4);
        var arg = [_parse$2, _values$3, _pst$4];
        while (true) {
            let [_parse$2, _values$3, _pst$4] = arg;
            var R = (() => {
                var self = _pst$4;
                switch (self._) {
                    case 'Parser.State.new':
                        var self = _parse$2(_pst$4);
                        switch (self._) {
                            case 'Parser.Reply.value':
                                var $288 = self.pst;
                                var $289 = self.val;
                                var $290 = Parser$many$go$(_parse$2, (_xs$12 => {
                                    var $291 = _values$3(List$cons$($289, _xs$12));
                                    return $291;
                                }), $288);
                                var $287 = $290;
                                break;
                            case 'Parser.Reply.error':
                                var $292 = Parser$Reply$value$(_pst$4, _values$3(List$nil));
                                var $287 = $292;
                                break;
                        };
                        return $287;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$many$go = x0 => x1 => x2 => Parser$many$go$(x0, x1, x2);

    function Parser$many$(_parser$2) {
        var $293 = Parser$many$go(_parser$2)((_x$3 => {
            var $294 = _x$3;
            return $294;
        }));
        return $293;
    };
    const Parser$many = x0 => Parser$many$(x0);
    const Unit$new = null;

    function String$cons$(_head$1, _tail$2) {
        var $295 = (String.fromCharCode(_head$1) + _tail$2);
        return $295;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);
    const String$nil = '';

    function Parser$text$go$(_ini_idx$1, _ini_txt$2, _text$3, _pst$4) {
        var Parser$text$go$ = (_ini_idx$1, _ini_txt$2, _text$3, _pst$4) => ({
            ctr: 'TCO',
            arg: [_ini_idx$1, _ini_txt$2, _text$3, _pst$4]
        });
        var Parser$text$go = _ini_idx$1 => _ini_txt$2 => _text$3 => _pst$4 => Parser$text$go$(_ini_idx$1, _ini_txt$2, _text$3, _pst$4);
        var arg = [_ini_idx$1, _ini_txt$2, _text$3, _pst$4];
        while (true) {
            let [_ini_idx$1, _ini_txt$2, _text$3, _pst$4] = arg;
            var R = (() => {
                var self = _pst$4;
                switch (self._) {
                    case 'Parser.State.new':
                        var $296 = self.err;
                        var $297 = self.nam;
                        var $298 = self.ini;
                        var $299 = self.idx;
                        var $300 = self.str;
                        var self = _text$3;
                        if (self.length === 0) {
                            var $302 = Parser$Reply$value$(_pst$4, Unit$new);
                            var $301 = $302;
                        } else {
                            var $303 = self.charCodeAt(0);
                            var $304 = self.slice(1);
                            var self = $300;
                            if (self.length === 0) {
                                var _error_msg$12 = ("Expected \'" + (_ini_txt$2 + "\', found end of file."));
                                var $306 = Parser$Reply$fail$($297, $298, _ini_idx$1, _error_msg$12);
                                var $305 = $306;
                            } else {
                                var $307 = self.charCodeAt(0);
                                var $308 = self.slice(1);
                                var self = ($303 === $307);
                                if (self) {
                                    var _pst$14 = Parser$State$new$($296, $297, $298, Nat$succ$($299), $308);
                                    var $310 = Parser$text$go$(_ini_idx$1, _ini_txt$2, $304, _pst$14);
                                    var $309 = $310;
                                } else {
                                    var _chr$14 = String$cons$($307, String$nil);
                                    var _err$15 = ("Expected \'" + (_ini_txt$2 + ("\', found \'" + (_chr$14 + "\'."))));
                                    var $311 = Parser$Reply$fail$($297, $298, _ini_idx$1, _err$15);
                                    var $309 = $311;
                                };
                                var $305 = $309;
                            };
                            var $301 = $305;
                        };
                        return $301;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$text$go = x0 => x1 => x2 => x3 => Parser$text$go$(x0, x1, x2, x3);

    function Parser$text$(_text$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $313 = self.idx;
                var self = Parser$text$go$($313, _text$1, _text$1, _pst$2);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $315 = self.err;
                        var $316 = Parser$Reply$error$($315);
                        var $314 = $316;
                        break;
                    case 'Parser.Reply.value':
                        var $317 = self.pst;
                        var $318 = self.val;
                        var $319 = Parser$Reply$value$($317, $318);
                        var $314 = $319;
                        break;
                };
                var $312 = $314;
                break;
        };
        return $312;
    };
    const Parser$text = x0 => x1 => Parser$text$(x0, x1);

    function Parser$eof$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $321 = self.nam;
                var $322 = self.ini;
                var $323 = self.idx;
                var $324 = self.str;
                var self = $324;
                if (self.length === 0) {
                    var $326 = Parser$Reply$value$(_pst$1, Unit$new);
                    var $325 = $326;
                } else {
                    var $327 = self.charCodeAt(0);
                    var $328 = self.slice(1);
                    var $329 = Parser$Reply$fail$($321, $322, $323, "Expected end-of-file.");
                    var $325 = $329;
                };
                var $320 = $325;
                break;
        };
        return $320;
    };
    const Parser$eof = x0 => Parser$eof$(x0);

    function List$reverse$go$(_xs$2, _res$3) {
        var List$reverse$go$ = (_xs$2, _res$3) => ({
            ctr: 'TCO',
            arg: [_xs$2, _res$3]
        });
        var List$reverse$go = _xs$2 => _res$3 => List$reverse$go$(_xs$2, _res$3);
        var arg = [_xs$2, _res$3];
        while (true) {
            let [_xs$2, _res$3] = arg;
            var R = (() => {
                var self = _xs$2;
                switch (self._) {
                    case 'List.cons':
                        var $330 = self.head;
                        var $331 = self.tail;
                        var $332 = List$reverse$go$($331, List$cons$($330, _res$3));
                        return $332;
                    case 'List.nil':
                        var $333 = _res$3;
                        return $333;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $334 = List$reverse$go$(_xs$2, List$nil);
        return $334;
    };
    const List$reverse = x0 => List$reverse$(x0);

    function Parser$until$go$(_until$2, _parse$3, _values$4, _pst$5) {
        var Parser$until$go$ = (_until$2, _parse$3, _values$4, _pst$5) => ({
            ctr: 'TCO',
            arg: [_until$2, _parse$3, _values$4, _pst$5]
        });
        var Parser$until$go = _until$2 => _parse$3 => _values$4 => _pst$5 => Parser$until$go$(_until$2, _parse$3, _values$4, _pst$5);
        var arg = [_until$2, _parse$3, _values$4, _pst$5];
        while (true) {
            let [_until$2, _parse$3, _values$4, _pst$5] = arg;
            var R = (() => {
                var _until_reply$6 = _until$2(_pst$5);
                var self = _until_reply$6;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $336 = self.err;
                        var _reply$8 = _parse$3(_pst$5);
                        var self = _reply$8;
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $338 = self.err;
                                var $339 = Parser$Reply$error$(Parser$Error$combine$($338, $336));
                                var $337 = $339;
                                break;
                            case 'Parser.Reply.value':
                                var $340 = self.pst;
                                var $341 = self.val;
                                var $342 = Parser$until$go$(_until$2, _parse$3, List$cons$($341, _values$4), $340);
                                var $337 = $342;
                                break;
                        };
                        var $335 = $337;
                        break;
                    case 'Parser.Reply.value':
                        var $343 = self.pst;
                        var $344 = Parser$Reply$value$($343, List$reverse$(_values$4));
                        var $335 = $344;
                        break;
                };
                return $335;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$until$go = x0 => x1 => x2 => x3 => Parser$until$go$(x0, x1, x2, x3);

    function Parser$until$(_until$2, _parse$3) {
        var $345 = Parser$until$go(_until$2)(_parse$3)(List$nil);
        return $345;
    };
    const Parser$until = x0 => x1 => Parser$until$(x0, x1);

    function Parser$one$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $347 = self.err;
                var $348 = self.nam;
                var $349 = self.ini;
                var $350 = self.idx;
                var $351 = self.str;
                var self = $351;
                if (self.length === 0) {
                    var $353 = Parser$Reply$fail$($348, $349, $350, "Unexpected end of file.");
                    var $352 = $353;
                } else {
                    var $354 = self.charCodeAt(0);
                    var $355 = self.slice(1);
                    var _pst$9 = Parser$State$new$($347, $348, $349, Nat$succ$($350), $355);
                    var $356 = Parser$Reply$value$(_pst$9, $354);
                    var $352 = $356;
                };
                var $346 = $352;
                break;
        };
        return $346;
    };
    const Parser$one = x0 => Parser$one$(x0);
    const Litereum$parse$ignore = Parser$many$(Parser$choice(List$cons$(Parser$text(" "), List$cons$(Parser$text("\u{9}"), List$cons$(Parser$text("\u{d}"), List$cons$(Parser$text("\u{a}"), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $358 = self.err;
                var _reply$7 = Parser$text$("//", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $360 = self.err;
                        var self = $358;
                        switch (self._) {
                            case 'Maybe.some':
                                var $362 = self.value;
                                var $363 = Parser$Reply$error$(Parser$Error$combine$($362, $360));
                                var $361 = $363;
                                break;
                            case 'Maybe.none':
                                var $364 = Parser$Reply$error$($360);
                                var $361 = $364;
                                break;
                        };
                        var $359 = $361;
                        break;
                    case 'Parser.Reply.value':
                        var $365 = self.pst;
                        var self = $365;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $367 = self.err;
                                var $368 = self.nam;
                                var $369 = self.ini;
                                var $370 = self.idx;
                                var $371 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($358, $367), $368, $369, $370, $371);
                                var _end$16 = Parser$choice(List$cons$(Parser$text("\u{a}"), List$cons$(Parser$eof, List$nil)));
                                var self = _reply$pst$15;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $373 = self.err;
                                        var _reply$22 = Parser$until$(_end$16, Parser$one)(_reply$pst$15);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $375 = self.err;
                                                var self = $373;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $377 = self.value;
                                                        var $378 = Parser$Reply$error$(Parser$Error$combine$($377, $375));
                                                        var $376 = $378;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $379 = Parser$Reply$error$($375);
                                                        var $376 = $379;
                                                        break;
                                                };
                                                var $374 = $376;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $380 = self.pst;
                                                var self = $380;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $382 = self.err;
                                                        var $383 = self.nam;
                                                        var $384 = self.ini;
                                                        var $385 = self.idx;
                                                        var $386 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($373, $382), $383, $384, $385, $386);
                                                        var $387 = Parser$Reply$value$(_reply$pst$30, Unit$new);
                                                        var $381 = $387;
                                                        break;
                                                };
                                                var $374 = $381;
                                                break;
                                        };
                                        var $372 = $374;
                                        break;
                                };
                                var $366 = $372;
                                break;
                        };
                        var $359 = $366;
                        break;
                };
                var $357 = $359;
                break;
        };
        return $357;
    }), List$nil)))))));

    function Litereum$parse$text$(_text$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $389 = self.err;
                var _reply$8 = Litereum$parse$ignore(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $391 = self.err;
                        var self = $389;
                        switch (self._) {
                            case 'Maybe.some':
                                var $393 = self.value;
                                var $394 = Parser$Reply$error$(Parser$Error$combine$($393, $391));
                                var $392 = $394;
                                break;
                            case 'Maybe.none':
                                var $395 = Parser$Reply$error$($391);
                                var $392 = $395;
                                break;
                        };
                        var $390 = $392;
                        break;
                    case 'Parser.Reply.value':
                        var $396 = self.pst;
                        var self = $396;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $398 = self.err;
                                var $399 = self.nam;
                                var $400 = self.ini;
                                var $401 = self.idx;
                                var $402 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($389, $398), $399, $400, $401, $402);
                                var $403 = Parser$text$(_text$1, _reply$pst$16);
                                var $397 = $403;
                                break;
                        };
                        var $390 = $397;
                        break;
                };
                var $388 = $390;
                break;
        };
        return $388;
    };
    const Litereum$parse$text = x0 => x1 => Litereum$parse$text$(x0, x1);

    function Parser$letter$(_is_letter$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $405 = self.err;
                var $406 = self.nam;
                var $407 = self.ini;
                var $408 = self.idx;
                var $409 = self.str;
                var self = $409;
                if (self.length === 0) {
                    var $411 = Parser$Reply$fail$($406, $407, $408, "Unexpected eof.");
                    var $410 = $411;
                } else {
                    var $412 = self.charCodeAt(0);
                    var $413 = self.slice(1);
                    var self = _is_letter$1($412);
                    if (self) {
                        var $415 = Parser$Reply$value$(Parser$State$new$($405, $406, $407, Nat$succ$($408), $413), $412);
                        var $414 = $415;
                    } else {
                        var $416 = Parser$Reply$fail$($406, $407, $408, "Expected letter.");
                        var $414 = $416;
                    };
                    var $410 = $414;
                };
                var $404 = $410;
                break;
        };
        return $404;
    };
    const Parser$letter = x0 => x1 => Parser$letter$(x0, x1);
    const Bool$and = a0 => a1 => (a0 && a1);

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $418 = Bool$true;
                var $417 = $418;
                break;
            case 'Cmp.gtn':
                var $419 = Bool$false;
                var $417 = $419;
                break;
        };
        return $417;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $420 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $420;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U16$lte = a0 => a1 => (a0 <= a1);

    function U16$btw$(_a$1, _b$2, _c$3) {
        var $421 = ((_a$1 <= _b$2) && (_b$2 <= _c$3));
        return $421;
    };
    const U16$btw = x0 => x1 => x2 => U16$btw$(x0, x1, x2);
    const Litereum$parse$letter = Parser$letter((_chr$1 => {
        var self = U16$btw$(65, _chr$1, 90);
        if (self) {
            var $423 = Bool$true;
            var $422 = $423;
        } else {
            var self = U16$btw$(97, _chr$1, 122);
            if (self) {
                var $425 = Bool$true;
                var $424 = $425;
            } else {
                var self = U16$btw$(48, _chr$1, 57);
                if (self) {
                    var $427 = Bool$true;
                    var $426 = $427;
                } else {
                    var self = (46 === _chr$1);
                    if (self) {
                        var $429 = Bool$true;
                        var $428 = $429;
                    } else {
                        var self = (95 === _chr$1);
                        if (self) {
                            var $431 = Bool$true;
                            var $430 = $431;
                        } else {
                            var self = (94 === _chr$1);
                            if (self) {
                                var $433 = Bool$true;
                                var $432 = $433;
                            } else {
                                var $434 = Bool$false;
                                var $432 = $434;
                            };
                            var $430 = $432;
                        };
                        var $428 = $430;
                    };
                    var $426 = $428;
                };
                var $424 = $426;
            };
            var $422 = $424;
        };
        return $422;
    }));

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $436 = self.head;
                var $437 = self.tail;
                var $438 = _cons$5($436)(List$fold$($437, _nil$4, _cons$5));
                var $435 = $438;
                break;
            case 'List.nil':
                var $439 = _nil$4;
                var $435 = $439;
                break;
        };
        return $435;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Litereum$parse$name$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $441 = self.err;
                var _reply$7 = Litereum$parse$ignore(_pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $443 = self.err;
                        var self = $441;
                        switch (self._) {
                            case 'Maybe.some':
                                var $445 = self.value;
                                var $446 = Parser$Reply$error$(Parser$Error$combine$($445, $443));
                                var $444 = $446;
                                break;
                            case 'Maybe.none':
                                var $447 = Parser$Reply$error$($443);
                                var $444 = $447;
                                break;
                        };
                        var $442 = $444;
                        break;
                    case 'Parser.Reply.value':
                        var $448 = self.pst;
                        var self = $448;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $450 = self.err;
                                var $451 = self.nam;
                                var $452 = self.ini;
                                var $453 = self.idx;
                                var $454 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($441, $450), $451, $452, $453, $454);
                                var self = _reply$pst$15;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $456 = self.err;
                                        var _reply$21 = Litereum$parse$letter(_reply$pst$15);
                                        var self = _reply$21;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $458 = self.err;
                                                var self = $456;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $460 = self.value;
                                                        var $461 = Parser$Reply$error$(Parser$Error$combine$($460, $458));
                                                        var $459 = $461;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $462 = Parser$Reply$error$($458);
                                                        var $459 = $462;
                                                        break;
                                                };
                                                var $457 = $459;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $463 = self.pst;
                                                var $464 = self.val;
                                                var self = $463;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $466 = self.err;
                                                        var $467 = self.nam;
                                                        var $468 = self.ini;
                                                        var $469 = self.idx;
                                                        var $470 = self.str;
                                                        var _reply$pst$29 = Parser$State$new$(Parser$Error$maybe_combine$($456, $466), $467, $468, $469, $470);
                                                        var self = _reply$pst$29;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $472 = self.err;
                                                                var _reply$35 = Parser$many$(Litereum$parse$letter)(_reply$pst$29);
                                                                var self = _reply$35;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $474 = self.err;
                                                                        var self = $472;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $476 = self.value;
                                                                                var $477 = Parser$Reply$error$(Parser$Error$combine$($476, $474));
                                                                                var $475 = $477;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $478 = Parser$Reply$error$($474);
                                                                                var $475 = $478;
                                                                                break;
                                                                        };
                                                                        var $473 = $475;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $479 = self.pst;
                                                                        var $480 = self.val;
                                                                        var self = $479;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $482 = self.err;
                                                                                var $483 = self.nam;
                                                                                var $484 = self.ini;
                                                                                var $485 = self.idx;
                                                                                var $486 = self.str;
                                                                                var _reply$pst$43 = Parser$State$new$(Parser$Error$maybe_combine$($472, $482), $483, $484, $485, $486);
                                                                                var $487 = Parser$Reply$value$(_reply$pst$43, String$cons$($464, List$fold$($480, String$nil, String$cons)));
                                                                                var $481 = $487;
                                                                                break;
                                                                        };
                                                                        var $473 = $481;
                                                                        break;
                                                                };
                                                                var $471 = $473;
                                                                break;
                                                        };
                                                        var $465 = $471;
                                                        break;
                                                };
                                                var $457 = $465;
                                                break;
                                        };
                                        var $455 = $457;
                                        break;
                                };
                                var $449 = $455;
                                break;
                        };
                        var $442 = $449;
                        break;
                };
                var $440 = $442;
                break;
        };
        return $440;
    };
    const Litereum$parse$name = x0 => Litereum$parse$name$(x0);

    function Litereum$Transaction$new_name$(_name$1) {
        var $488 = ({
            _: 'Litereum.Transaction.new_name',
            'name': _name$1
        });
        return $488;
    };
    const Litereum$Transaction$new_name = x0 => Litereum$Transaction$new_name$(x0);

    function Parser$wrap$(_opens$2, _parse$3, _close$4, _pst$5) {
        var self = _pst$5;
        switch (self._) {
            case 'Parser.State.new':
                var $490 = self.err;
                var _reply$11 = _opens$2(_pst$5);
                var self = _reply$11;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $492 = self.err;
                        var self = $490;
                        switch (self._) {
                            case 'Maybe.some':
                                var $494 = self.value;
                                var $495 = Parser$Reply$error$(Parser$Error$combine$($494, $492));
                                var $493 = $495;
                                break;
                            case 'Maybe.none':
                                var $496 = Parser$Reply$error$($492);
                                var $493 = $496;
                                break;
                        };
                        var $491 = $493;
                        break;
                    case 'Parser.Reply.value':
                        var $497 = self.pst;
                        var self = $497;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $499 = self.err;
                                var $500 = self.nam;
                                var $501 = self.ini;
                                var $502 = self.idx;
                                var $503 = self.str;
                                var _reply$pst$19 = Parser$State$new$(Parser$Error$maybe_combine$($490, $499), $500, $501, $502, $503);
                                var $504 = Parser$until$(_close$4, _parse$3)(_reply$pst$19);
                                var $498 = $504;
                                break;
                        };
                        var $491 = $498;
                        break;
                };
                var $489 = $491;
                break;
        };
        return $489;
    };
    const Parser$wrap = x0 => x1 => x2 => x3 => Parser$wrap$(x0, x1, x2, x3);

    function Parser$maybe$(_parse$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var self = _parse$2(_pst$3);
                switch (self._) {
                    case 'Parser.Reply.value':
                        var $507 = self.pst;
                        var $508 = self.val;
                        var $509 = Parser$Reply$value$($507, Maybe$some$($508));
                        var $506 = $509;
                        break;
                    case 'Parser.Reply.error':
                        var $510 = Parser$Reply$value$(_pst$3, Maybe$none);
                        var $506 = $510;
                        break;
                };
                var $505 = $506;
                break;
        };
        return $505;
    };
    const Parser$maybe = x0 => x1 => Parser$maybe$(x0, x1);
    const Litereum$Type$word = ({
        _: 'Litereum.Type.word'
    });

    function Litereum$Type$data$(_name$1) {
        var $511 = ({
            _: 'Litereum.Type.data',
            'name': _name$1
        });
        return $511;
    };
    const Litereum$Type$data = x0 => Litereum$Type$data$(x0);

    function Litereum$parse$type$(_world$1) {
        var $512 = Parser$choice(List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $514 = self.err;
                    var _reply$8 = Litereum$parse$text$("#word", _pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $516 = self.err;
                            var self = $514;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $518 = self.value;
                                    var $519 = Parser$Reply$error$(Parser$Error$combine$($518, $516));
                                    var $517 = $519;
                                    break;
                                case 'Maybe.none':
                                    var $520 = Parser$Reply$error$($516);
                                    var $517 = $520;
                                    break;
                            };
                            var $515 = $517;
                            break;
                        case 'Parser.Reply.value':
                            var $521 = self.pst;
                            var self = $521;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $523 = self.err;
                                    var $524 = self.nam;
                                    var $525 = self.ini;
                                    var $526 = self.idx;
                                    var $527 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($514, $523), $524, $525, $526, $527);
                                    var $528 = Parser$Reply$value$(_reply$pst$16, Litereum$Type$word);
                                    var $522 = $528;
                                    break;
                            };
                            var $515 = $522;
                            break;
                    };
                    var $513 = $515;
                    break;
            };
            return $513;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $530 = self.err;
                    var _reply$8 = Litereum$parse$name$(_pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $532 = self.err;
                            var self = $530;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $534 = self.value;
                                    var $535 = Parser$Reply$error$(Parser$Error$combine$($534, $532));
                                    var $533 = $535;
                                    break;
                                case 'Maybe.none':
                                    var $536 = Parser$Reply$error$($532);
                                    var $533 = $536;
                                    break;
                            };
                            var $531 = $533;
                            break;
                        case 'Parser.Reply.value':
                            var $537 = self.pst;
                            var $538 = self.val;
                            var self = $537;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $540 = self.err;
                                    var $541 = self.nam;
                                    var $542 = self.ini;
                                    var $543 = self.idx;
                                    var $544 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($530, $540), $541, $542, $543, $544);
                                    var $545 = Parser$Reply$value$(_reply$pst$16, Litereum$Type$data$($538));
                                    var $539 = $545;
                                    break;
                            };
                            var $531 = $539;
                            break;
                    };
                    var $529 = $531;
                    break;
            };
            return $529;
        }), List$nil)));
        return $512;
    };
    const Litereum$parse$type = x0 => Litereum$parse$type$(x0);

    function Pair$new$(_fst$3, _snd$4) {
        var $546 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $546;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Litereum$parse$ann$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $548 = self.err;
                var _reply$8 = Parser$maybe$(Litereum$parse$text(","), _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $550 = self.err;
                        var self = $548;
                        switch (self._) {
                            case 'Maybe.some':
                                var $552 = self.value;
                                var $553 = Parser$Reply$error$(Parser$Error$combine$($552, $550));
                                var $551 = $553;
                                break;
                            case 'Maybe.none':
                                var $554 = Parser$Reply$error$($550);
                                var $551 = $554;
                                break;
                        };
                        var $549 = $551;
                        break;
                    case 'Parser.Reply.value':
                        var $555 = self.pst;
                        var self = $555;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $557 = self.err;
                                var $558 = self.nam;
                                var $559 = self.ini;
                                var $560 = self.idx;
                                var $561 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($548, $557), $558, $559, $560, $561);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $563 = self.err;
                                        var _reply$22 = Litereum$parse$name$(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $565 = self.err;
                                                var self = $563;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $567 = self.value;
                                                        var $568 = Parser$Reply$error$(Parser$Error$combine$($567, $565));
                                                        var $566 = $568;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $569 = Parser$Reply$error$($565);
                                                        var $566 = $569;
                                                        break;
                                                };
                                                var $564 = $566;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $570 = self.pst;
                                                var $571 = self.val;
                                                var self = $570;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $573 = self.err;
                                                        var $574 = self.nam;
                                                        var $575 = self.ini;
                                                        var $576 = self.idx;
                                                        var $577 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($563, $573), $574, $575, $576, $577);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $579 = self.err;
                                                                var _reply$36 = Litereum$parse$text$(":", _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $581 = self.err;
                                                                        var self = $579;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $583 = self.value;
                                                                                var $584 = Parser$Reply$error$(Parser$Error$combine$($583, $581));
                                                                                var $582 = $584;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $585 = Parser$Reply$error$($581);
                                                                                var $582 = $585;
                                                                                break;
                                                                        };
                                                                        var $580 = $582;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $586 = self.pst;
                                                                        var self = $586;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $588 = self.err;
                                                                                var $589 = self.nam;
                                                                                var $590 = self.ini;
                                                                                var $591 = self.idx;
                                                                                var $592 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($579, $588), $589, $590, $591, $592);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $594 = self.err;
                                                                                        var _reply$50 = Litereum$parse$type$(_world$1)(_reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $596 = self.err;
                                                                                                var self = $594;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $598 = self.value;
                                                                                                        var $599 = Parser$Reply$error$(Parser$Error$combine$($598, $596));
                                                                                                        var $597 = $599;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $600 = Parser$Reply$error$($596);
                                                                                                        var $597 = $600;
                                                                                                        break;
                                                                                                };
                                                                                                var $595 = $597;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $601 = self.pst;
                                                                                                var $602 = self.val;
                                                                                                var self = $601;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $604 = self.err;
                                                                                                        var $605 = self.nam;
                                                                                                        var $606 = self.ini;
                                                                                                        var $607 = self.idx;
                                                                                                        var $608 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($594, $604), $605, $606, $607, $608);
                                                                                                        var $609 = Parser$Reply$value$(_reply$pst$58, Pair$new$($571, $602));
                                                                                                        var $603 = $609;
                                                                                                        break;
                                                                                                };
                                                                                                var $595 = $603;
                                                                                                break;
                                                                                        };
                                                                                        var $593 = $595;
                                                                                        break;
                                                                                };
                                                                                var $587 = $593;
                                                                                break;
                                                                        };
                                                                        var $580 = $587;
                                                                        break;
                                                                };
                                                                var $578 = $580;
                                                                break;
                                                        };
                                                        var $572 = $578;
                                                        break;
                                                };
                                                var $564 = $572;
                                                break;
                                        };
                                        var $562 = $564;
                                        break;
                                };
                                var $556 = $562;
                                break;
                        };
                        var $549 = $556;
                        break;
                };
                var $547 = $549;
                break;
        };
        return $547;
    };
    const Litereum$parse$ann = x0 => x1 => Litereum$parse$ann$(x0, x1);

    function List$mapped$(_as$2, _f$4) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $611 = self.head;
                var $612 = self.tail;
                var $613 = List$cons$(_f$4($611), List$mapped$($612, _f$4));
                var $610 = $613;
                break;
            case 'List.nil':
                var $614 = List$nil;
                var $610 = $614;
                break;
        };
        return $610;
    };
    const List$mapped = x0 => x1 => List$mapped$(x0, x1);

    function Litereum$Constructor$new$(_name$1, _field_names$2, _field_types$3) {
        var $615 = ({
            _: 'Litereum.Constructor.new',
            'name': _name$1,
            'field_names': _field_names$2,
            'field_types': _field_types$3
        });
        return $615;
    };
    const Litereum$Constructor$new = x0 => x1 => x2 => Litereum$Constructor$new$(x0, x1, x2);

    function Litereum$parse$constructor$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $617 = self.err;
                var _reply$8 = Litereum$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $619 = self.err;
                        var self = $617;
                        switch (self._) {
                            case 'Maybe.some':
                                var $621 = self.value;
                                var $622 = Parser$Reply$error$(Parser$Error$combine$($621, $619));
                                var $620 = $622;
                                break;
                            case 'Maybe.none':
                                var $623 = Parser$Reply$error$($619);
                                var $620 = $623;
                                break;
                        };
                        var $618 = $620;
                        break;
                    case 'Parser.Reply.value':
                        var $624 = self.pst;
                        var $625 = self.val;
                        var self = $624;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $627 = self.err;
                                var $628 = self.nam;
                                var $629 = self.ini;
                                var $630 = self.idx;
                                var $631 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($617, $627), $628, $629, $630, $631);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $633 = self.err;
                                        var _reply$22 = Parser$wrap$(Litereum$parse$text("{"), Litereum$parse$ann(_world$1), Litereum$parse$text("}"), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $635 = self.err;
                                                var self = $633;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $637 = self.value;
                                                        var $638 = Parser$Reply$error$(Parser$Error$combine$($637, $635));
                                                        var $636 = $638;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $639 = Parser$Reply$error$($635);
                                                        var $636 = $639;
                                                        break;
                                                };
                                                var $634 = $636;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $640 = self.pst;
                                                var $641 = self.val;
                                                var self = $640;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $643 = self.err;
                                                        var $644 = self.nam;
                                                        var $645 = self.ini;
                                                        var $646 = self.idx;
                                                        var $647 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($633, $643), $644, $645, $646, $647);
                                                        var _nams$31 = List$mapped$($641, (_x$31 => {
                                                            var self = _x$31;
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $650 = self.fst;
                                                                    var $651 = $650;
                                                                    var $649 = $651;
                                                                    break;
                                                            };
                                                            return $649;
                                                        }));
                                                        var _typs$32 = List$mapped$($641, (_x$32 => {
                                                            var self = _x$32;
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $653 = self.snd;
                                                                    var $654 = $653;
                                                                    var $652 = $654;
                                                                    break;
                                                            };
                                                            return $652;
                                                        }));
                                                        var $648 = Parser$Reply$value$(_reply$pst$30, Litereum$Constructor$new$($625, _nams$31, _typs$32));
                                                        var $642 = $648;
                                                        break;
                                                };
                                                var $634 = $642;
                                                break;
                                        };
                                        var $632 = $634;
                                        break;
                                };
                                var $626 = $632;
                                break;
                        };
                        var $618 = $626;
                        break;
                };
                var $616 = $618;
                break;
        };
        return $616;
    };
    const Litereum$parse$constructor = x0 => x1 => Litereum$parse$constructor$(x0, x1);

    function Litereum$Data$new$(_name$1, _constructors$2) {
        var $655 = ({
            _: 'Litereum.Data.new',
            'name': _name$1,
            'constructors': _constructors$2
        });
        return $655;
    };
    const Litereum$Data$new = x0 => x1 => Litereum$Data$new$(x0, x1);

    function Litereum$parse$data$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $657 = self.err;
                var _reply$8 = Litereum$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $659 = self.err;
                        var self = $657;
                        switch (self._) {
                            case 'Maybe.some':
                                var $661 = self.value;
                                var $662 = Parser$Reply$error$(Parser$Error$combine$($661, $659));
                                var $660 = $662;
                                break;
                            case 'Maybe.none':
                                var $663 = Parser$Reply$error$($659);
                                var $660 = $663;
                                break;
                        };
                        var $658 = $660;
                        break;
                    case 'Parser.Reply.value':
                        var $664 = self.pst;
                        var $665 = self.val;
                        var self = $664;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $667 = self.err;
                                var $668 = self.nam;
                                var $669 = self.ini;
                                var $670 = self.idx;
                                var $671 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($657, $667), $668, $669, $670, $671);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $673 = self.err;
                                        var _reply$22 = Parser$wrap$(Litereum$parse$text("{"), (_pst$22 => {
                                            var self = _pst$22;
                                            switch (self._) {
                                                case 'Parser.State.new':
                                                    var $676 = self.err;
                                                    var _reply$28 = Parser$maybe$(Litereum$parse$text(","), _pst$22);
                                                    var self = _reply$28;
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $678 = self.err;
                                                            var self = $676;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $680 = self.value;
                                                                    var $681 = Parser$Reply$error$(Parser$Error$combine$($680, $678));
                                                                    var $679 = $681;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $682 = Parser$Reply$error$($678);
                                                                    var $679 = $682;
                                                                    break;
                                                            };
                                                            var $677 = $679;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $683 = self.pst;
                                                            var self = $683;
                                                            switch (self._) {
                                                                case 'Parser.State.new':
                                                                    var $685 = self.err;
                                                                    var $686 = self.nam;
                                                                    var $687 = self.ini;
                                                                    var $688 = self.idx;
                                                                    var $689 = self.str;
                                                                    var _reply$pst$36 = Parser$State$new$(Parser$Error$maybe_combine$($676, $685), $686, $687, $688, $689);
                                                                    var $690 = Litereum$parse$constructor$(_world$1, _reply$pst$36);
                                                                    var $684 = $690;
                                                                    break;
                                                            };
                                                            var $677 = $684;
                                                            break;
                                                    };
                                                    var $675 = $677;
                                                    break;
                                            };
                                            return $675;
                                        }), Litereum$parse$text("}"), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $691 = self.err;
                                                var self = $673;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $693 = self.value;
                                                        var $694 = Parser$Reply$error$(Parser$Error$combine$($693, $691));
                                                        var $692 = $694;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $695 = Parser$Reply$error$($691);
                                                        var $692 = $695;
                                                        break;
                                                };
                                                var $674 = $692;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $696 = self.pst;
                                                var $697 = self.val;
                                                var self = $696;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $699 = self.err;
                                                        var $700 = self.nam;
                                                        var $701 = self.ini;
                                                        var $702 = self.idx;
                                                        var $703 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($673, $699), $700, $701, $702, $703);
                                                        var $704 = Parser$Reply$value$(_reply$pst$30, Litereum$Data$new$($665, $697));
                                                        var $698 = $704;
                                                        break;
                                                };
                                                var $674 = $698;
                                                break;
                                        };
                                        var $672 = $674;
                                        break;
                                };
                                var $666 = $672;
                                break;
                        };
                        var $658 = $666;
                        break;
                };
                var $656 = $658;
                break;
        };
        return $656;
    };
    const Litereum$parse$data = x0 => x1 => Litereum$parse$data$(x0, x1);

    function Litereum$Transaction$new_data$(_data$1) {
        var $705 = ({
            _: 'Litereum.Transaction.new_data',
            'data': _data$1
        });
        return $705;
    };
    const Litereum$Transaction$new_data = x0 => Litereum$Transaction$new_data$(x0);

    function Litereum$Term$let$(_name$1, _type$2, _expr$3, _body$4) {
        var $706 = ({
            _: 'Litereum.Term.let',
            'name': _name$1,
            'type': _type$2,
            'expr': _expr$3,
            'body': _body$4
        });
        return $706;
    };
    const Litereum$Term$let = x0 => x1 => x2 => x3 => Litereum$Term$let$(x0, x1, x2, x3);

    function Litereum$parse$term$let$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $708 = self.err;
                var _reply$8 = Litereum$parse$text$("let", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $710 = self.err;
                        var self = $708;
                        switch (self._) {
                            case 'Maybe.some':
                                var $712 = self.value;
                                var $713 = Parser$Reply$error$(Parser$Error$combine$($712, $710));
                                var $711 = $713;
                                break;
                            case 'Maybe.none':
                                var $714 = Parser$Reply$error$($710);
                                var $711 = $714;
                                break;
                        };
                        var $709 = $711;
                        break;
                    case 'Parser.Reply.value':
                        var $715 = self.pst;
                        var self = $715;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $717 = self.err;
                                var $718 = self.nam;
                                var $719 = self.ini;
                                var $720 = self.idx;
                                var $721 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($708, $717), $718, $719, $720, $721);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $723 = self.err;
                                        var _reply$22 = Litereum$parse$name$(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $725 = self.err;
                                                var self = $723;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $727 = self.value;
                                                        var $728 = Parser$Reply$error$(Parser$Error$combine$($727, $725));
                                                        var $726 = $728;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $729 = Parser$Reply$error$($725);
                                                        var $726 = $729;
                                                        break;
                                                };
                                                var $724 = $726;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $730 = self.pst;
                                                var $731 = self.val;
                                                var self = $730;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $733 = self.err;
                                                        var $734 = self.nam;
                                                        var $735 = self.ini;
                                                        var $736 = self.idx;
                                                        var $737 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($723, $733), $734, $735, $736, $737);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $739 = self.err;
                                                                var _reply$36 = Litereum$parse$text$(":", _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $741 = self.err;
                                                                        var self = $739;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $743 = self.value;
                                                                                var $744 = Parser$Reply$error$(Parser$Error$combine$($743, $741));
                                                                                var $742 = $744;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $745 = Parser$Reply$error$($741);
                                                                                var $742 = $745;
                                                                                break;
                                                                        };
                                                                        var $740 = $742;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $746 = self.pst;
                                                                        var self = $746;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $748 = self.err;
                                                                                var $749 = self.nam;
                                                                                var $750 = self.ini;
                                                                                var $751 = self.idx;
                                                                                var $752 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($739, $748), $749, $750, $751, $752);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $754 = self.err;
                                                                                        var _reply$50 = Litereum$parse$type$(_world$1)(_reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $756 = self.err;
                                                                                                var self = $754;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $758 = self.value;
                                                                                                        var $759 = Parser$Reply$error$(Parser$Error$combine$($758, $756));
                                                                                                        var $757 = $759;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $760 = Parser$Reply$error$($756);
                                                                                                        var $757 = $760;
                                                                                                        break;
                                                                                                };
                                                                                                var $755 = $757;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $761 = self.pst;
                                                                                                var $762 = self.val;
                                                                                                var self = $761;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $764 = self.err;
                                                                                                        var $765 = self.nam;
                                                                                                        var $766 = self.ini;
                                                                                                        var $767 = self.idx;
                                                                                                        var $768 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($754, $764), $765, $766, $767, $768);
                                                                                                        var self = _reply$pst$58;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $770 = self.err;
                                                                                                                var _reply$64 = Litereum$parse$text$("=", _reply$pst$58);
                                                                                                                var self = _reply$64;
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $772 = self.err;
                                                                                                                        var self = $770;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Maybe.some':
                                                                                                                                var $774 = self.value;
                                                                                                                                var $775 = Parser$Reply$error$(Parser$Error$combine$($774, $772));
                                                                                                                                var $773 = $775;
                                                                                                                                break;
                                                                                                                            case 'Maybe.none':
                                                                                                                                var $776 = Parser$Reply$error$($772);
                                                                                                                                var $773 = $776;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $771 = $773;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $777 = self.pst;
                                                                                                                        var self = $777;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $779 = self.err;
                                                                                                                                var $780 = self.nam;
                                                                                                                                var $781 = self.ini;
                                                                                                                                var $782 = self.idx;
                                                                                                                                var $783 = self.str;
                                                                                                                                var _reply$pst$72 = Parser$State$new$(Parser$Error$maybe_combine$($770, $779), $780, $781, $782, $783);
                                                                                                                                var self = _reply$pst$72;
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.State.new':
                                                                                                                                        var $785 = self.err;
                                                                                                                                        var _reply$78 = Litereum$parse$term$(_world$1)(_reply$pst$72);
                                                                                                                                        var self = _reply$78;
                                                                                                                                        switch (self._) {
                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                var $787 = self.err;
                                                                                                                                                var self = $785;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                        var $789 = self.value;
                                                                                                                                                        var $790 = Parser$Reply$error$(Parser$Error$combine$($789, $787));
                                                                                                                                                        var $788 = $790;
                                                                                                                                                        break;
                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                        var $791 = Parser$Reply$error$($787);
                                                                                                                                                        var $788 = $791;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $786 = $788;
                                                                                                                                                break;
                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                var $792 = self.pst;
                                                                                                                                                var $793 = self.val;
                                                                                                                                                var self = $792;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                        var $795 = self.err;
                                                                                                                                                        var $796 = self.nam;
                                                                                                                                                        var $797 = self.ini;
                                                                                                                                                        var $798 = self.idx;
                                                                                                                                                        var $799 = self.str;
                                                                                                                                                        var _reply$pst$86 = Parser$State$new$(Parser$Error$maybe_combine$($785, $795), $796, $797, $798, $799);
                                                                                                                                                        var self = _reply$pst$86;
                                                                                                                                                        switch (self._) {
                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                var $801 = self.err;
                                                                                                                                                                var _reply$92 = Parser$maybe$(Litereum$parse$text(";"), _reply$pst$86);
                                                                                                                                                                var self = _reply$92;
                                                                                                                                                                switch (self._) {
                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                        var $803 = self.err;
                                                                                                                                                                        var self = $801;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                var $805 = self.value;
                                                                                                                                                                                var $806 = Parser$Reply$error$(Parser$Error$combine$($805, $803));
                                                                                                                                                                                var $804 = $806;
                                                                                                                                                                                break;
                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                var $807 = Parser$Reply$error$($803);
                                                                                                                                                                                var $804 = $807;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $802 = $804;
                                                                                                                                                                        break;
                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                        var $808 = self.pst;
                                                                                                                                                                        var self = $808;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                var $810 = self.err;
                                                                                                                                                                                var $811 = self.nam;
                                                                                                                                                                                var $812 = self.ini;
                                                                                                                                                                                var $813 = self.idx;
                                                                                                                                                                                var $814 = self.str;
                                                                                                                                                                                var _reply$pst$100 = Parser$State$new$(Parser$Error$maybe_combine$($801, $810), $811, $812, $813, $814);
                                                                                                                                                                                var self = _reply$pst$100;
                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                        var $816 = self.err;
                                                                                                                                                                                        var _reply$106 = Litereum$parse$term$(_world$1)(_reply$pst$100);
                                                                                                                                                                                        var self = _reply$106;
                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                                                                var $818 = self.err;
                                                                                                                                                                                                var self = $816;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                                                                        var $820 = self.value;
                                                                                                                                                                                                        var $821 = Parser$Reply$error$(Parser$Error$combine$($820, $818));
                                                                                                                                                                                                        var $819 = $821;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                                                                        var $822 = Parser$Reply$error$($818);
                                                                                                                                                                                                        var $819 = $822;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $817 = $819;
                                                                                                                                                                                                break;
                                                                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                                                                var $823 = self.pst;
                                                                                                                                                                                                var $824 = self.val;
                                                                                                                                                                                                var self = $823;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                        var $826 = self.err;
                                                                                                                                                                                                        var $827 = self.nam;
                                                                                                                                                                                                        var $828 = self.ini;
                                                                                                                                                                                                        var $829 = self.idx;
                                                                                                                                                                                                        var $830 = self.str;
                                                                                                                                                                                                        var _reply$pst$114 = Parser$State$new$(Parser$Error$maybe_combine$($816, $826), $827, $828, $829, $830);
                                                                                                                                                                                                        var $831 = Parser$Reply$value$(_reply$pst$114, Litereum$Term$let$($731, $762, $793, $824));
                                                                                                                                                                                                        var $825 = $831;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $817 = $825;
                                                                                                                                                                                                break;
                                                                                                                                                                                        };
                                                                                                                                                                                        var $815 = $817;
                                                                                                                                                                                        break;
                                                                                                                                                                                };
                                                                                                                                                                                var $809 = $815;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $802 = $809;
                                                                                                                                                                        break;
                                                                                                                                                                };
                                                                                                                                                                var $800 = $802;
                                                                                                                                                                break;
                                                                                                                                                        };
                                                                                                                                                        var $794 = $800;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $786 = $794;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $784 = $786;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $778 = $784;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $771 = $778;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $769 = $771;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $763 = $769;
                                                                                                        break;
                                                                                                };
                                                                                                var $755 = $763;
                                                                                                break;
                                                                                        };
                                                                                        var $753 = $755;
                                                                                        break;
                                                                                };
                                                                                var $747 = $753;
                                                                                break;
                                                                        };
                                                                        var $740 = $747;
                                                                        break;
                                                                };
                                                                var $738 = $740;
                                                                break;
                                                        };
                                                        var $732 = $738;
                                                        break;
                                                };
                                                var $724 = $732;
                                                break;
                                        };
                                        var $722 = $724;
                                        break;
                                };
                                var $716 = $722;
                                break;
                        };
                        var $709 = $716;
                        break;
                };
                var $707 = $709;
                break;
        };
        return $707;
    };
    const Litereum$parse$term$let = x0 => x1 => Litereum$parse$term$let$(x0, x1);

    function Litereum$Term$create$(_ctor$1, _vals$2) {
        var $832 = ({
            _: 'Litereum.Term.create',
            'ctor': _ctor$1,
            'vals': _vals$2
        });
        return $832;
    };
    const Litereum$Term$create = x0 => x1 => Litereum$Term$create$(x0, x1);

    function Litereum$parse$term$create$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $834 = self.err;
                var _reply$8 = Litereum$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $836 = self.err;
                        var self = $834;
                        switch (self._) {
                            case 'Maybe.some':
                                var $838 = self.value;
                                var $839 = Parser$Reply$error$(Parser$Error$combine$($838, $836));
                                var $837 = $839;
                                break;
                            case 'Maybe.none':
                                var $840 = Parser$Reply$error$($836);
                                var $837 = $840;
                                break;
                        };
                        var $835 = $837;
                        break;
                    case 'Parser.Reply.value':
                        var $841 = self.pst;
                        var $842 = self.val;
                        var self = $841;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $844 = self.err;
                                var $845 = self.nam;
                                var $846 = self.ini;
                                var $847 = self.idx;
                                var $848 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($834, $844), $845, $846, $847, $848);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $850 = self.err;
                                        var _reply$22 = Parser$wrap$(Litereum$parse$text("{"), Litereum$parse$term$(_world$1), Litereum$parse$text("}"), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $852 = self.err;
                                                var self = $850;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $854 = self.value;
                                                        var $855 = Parser$Reply$error$(Parser$Error$combine$($854, $852));
                                                        var $853 = $855;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $856 = Parser$Reply$error$($852);
                                                        var $853 = $856;
                                                        break;
                                                };
                                                var $851 = $853;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $857 = self.pst;
                                                var $858 = self.val;
                                                var self = $857;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $860 = self.err;
                                                        var $861 = self.nam;
                                                        var $862 = self.ini;
                                                        var $863 = self.idx;
                                                        var $864 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($850, $860), $861, $862, $863, $864);
                                                        var $865 = Parser$Reply$value$(_reply$pst$30, Litereum$Term$create$($842, $858));
                                                        var $859 = $865;
                                                        break;
                                                };
                                                var $851 = $859;
                                                break;
                                        };
                                        var $849 = $851;
                                        break;
                                };
                                var $843 = $849;
                                break;
                        };
                        var $835 = $843;
                        break;
                };
                var $833 = $835;
                break;
        };
        return $833;
    };
    const Litereum$parse$term$create = x0 => x1 => Litereum$parse$term$create$(x0, x1);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $867 = self.value;
                var $868 = _f$4($867);
                var $866 = $868;
                break;
            case 'Maybe.none':
                var $869 = Maybe$none;
                var $866 = $869;
                break;
        };
        return $866;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);

    function Maybe$monad$(_new$2) {
        var $870 = _new$2(Maybe$bind)(Maybe$some);
        return $870;
    };
    const Maybe$monad = x0 => Maybe$monad$(x0);

    function BBT$lookup$(_cmp$3, _key$4, _map$5) {
        var BBT$lookup$ = (_cmp$3, _key$4, _map$5) => ({
            ctr: 'TCO',
            arg: [_cmp$3, _key$4, _map$5]
        });
        var BBT$lookup = _cmp$3 => _key$4 => _map$5 => BBT$lookup$(_cmp$3, _key$4, _map$5);
        var arg = [_cmp$3, _key$4, _map$5];
        while (true) {
            let [_cmp$3, _key$4, _map$5] = arg;
            var R = (() => {
                var self = _map$5;
                switch (self._) {
                    case 'BBT.bin':
                        var $871 = self.key;
                        var $872 = self.val;
                        var $873 = self.left;
                        var $874 = self.right;
                        var self = _cmp$3(_key$4)($871);
                        switch (self._) {
                            case 'Cmp.ltn':
                                var $876 = BBT$lookup$(_cmp$3, _key$4, $873);
                                var $875 = $876;
                                break;
                            case 'Cmp.eql':
                                var $877 = Maybe$some$($872);
                                var $875 = $877;
                                break;
                            case 'Cmp.gtn':
                                var $878 = BBT$lookup$(_cmp$3, _key$4, $874);
                                var $875 = $878;
                                break;
                        };
                        return $875;
                    case 'BBT.tip':
                        var $879 = Maybe$none;
                        return $879;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BBT$lookup = x0 => x1 => x2 => BBT$lookup$(x0, x1, x2);

    function Map$get$(_key$2, _map$3) {
        var $880 = BBT$lookup$(String$cmp, _key$2, _map$3);
        return $880;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function Litereum$get_data$(_world$1, _name$2) {
        var self = _world$1;
        switch (self._) {
            case 'Litereum.World.new':
                var $882 = self.entry;
                var $883 = Maybe$monad$((_m$bind$7 => _m$pure$8 => {
                    var $884 = _m$bind$7;
                    return $884;
                }))(Map$get$(_name$2, $882))((_entry$7 => {
                    var self = _entry$7;
                    switch (self._) {
                        case 'Litereum.Entry.data':
                            var $886 = self.value;
                            var $887 = Maybe$some$($886);
                            var $885 = $887;
                            break;
                        case 'Litereum.Entry.bond':
                            var $888 = Maybe$none;
                            var $885 = $888;
                            break;
                    };
                    return $885;
                }));
                var $881 = $883;
                break;
        };
        return $881;
    };
    const Litereum$get_data = x0 => x1 => Litereum$get_data$(x0, x1);

    function Parser$fail$(_error$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var $890 = self.nam;
                var $891 = self.ini;
                var $892 = self.idx;
                var $893 = Parser$Reply$fail$($890, $891, $892, _error$2);
                var $889 = $893;
                break;
        };
        return $889;
    };
    const Parser$fail = x0 => x1 => Parser$fail$(x0, x1);

    function Litereum$parse$term$match$cases$(_world$1, _constructors$2) {
        var self = _constructors$2;
        switch (self._) {
            case 'List.cons':
                var $895 = self.head;
                var $896 = self.tail;
                var _ctor$5 = $895;
                var self = _ctor$5;
                switch (self._) {
                    case 'Litereum.Constructor.new':
                        var $898 = self.name;
                        var $899 = (_pst$9 => {
                            var self = _pst$9;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $901 = self.err;
                                    var _reply$15 = Litereum$parse$text$($898, _pst$9);
                                    var self = _reply$15;
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $903 = self.err;
                                            var self = $901;
                                            switch (self._) {
                                                case 'Maybe.some':
                                                    var $905 = self.value;
                                                    var $906 = Parser$Reply$error$(Parser$Error$combine$($905, $903));
                                                    var $904 = $906;
                                                    break;
                                                case 'Maybe.none':
                                                    var $907 = Parser$Reply$error$($903);
                                                    var $904 = $907;
                                                    break;
                                            };
                                            var $902 = $904;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $908 = self.pst;
                                            var self = $908;
                                            switch (self._) {
                                                case 'Parser.State.new':
                                                    var $910 = self.err;
                                                    var $911 = self.nam;
                                                    var $912 = self.ini;
                                                    var $913 = self.idx;
                                                    var $914 = self.str;
                                                    var _reply$pst$23 = Parser$State$new$(Parser$Error$maybe_combine$($901, $910), $911, $912, $913, $914);
                                                    var self = _reply$pst$23;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $916 = self.err;
                                                            var _reply$29 = Litereum$parse$text$(":", _reply$pst$23);
                                                            var self = _reply$29;
                                                            switch (self._) {
                                                                case 'Parser.Reply.error':
                                                                    var $918 = self.err;
                                                                    var self = $916;
                                                                    switch (self._) {
                                                                        case 'Maybe.some':
                                                                            var $920 = self.value;
                                                                            var $921 = Parser$Reply$error$(Parser$Error$combine$($920, $918));
                                                                            var $919 = $921;
                                                                            break;
                                                                        case 'Maybe.none':
                                                                            var $922 = Parser$Reply$error$($918);
                                                                            var $919 = $922;
                                                                            break;
                                                                    };
                                                                    var $917 = $919;
                                                                    break;
                                                                case 'Parser.Reply.value':
                                                                    var $923 = self.pst;
                                                                    var self = $923;
                                                                    switch (self._) {
                                                                        case 'Parser.State.new':
                                                                            var $925 = self.err;
                                                                            var $926 = self.nam;
                                                                            var $927 = self.ini;
                                                                            var $928 = self.idx;
                                                                            var $929 = self.str;
                                                                            var _reply$pst$37 = Parser$State$new$(Parser$Error$maybe_combine$($916, $925), $926, $927, $928, $929);
                                                                            var self = _reply$pst$37;
                                                                            switch (self._) {
                                                                                case 'Parser.State.new':
                                                                                    var $931 = self.err;
                                                                                    var _reply$43 = Litereum$parse$term$(_world$1)(_reply$pst$37);
                                                                                    var self = _reply$43;
                                                                                    switch (self._) {
                                                                                        case 'Parser.Reply.error':
                                                                                            var $933 = self.err;
                                                                                            var self = $931;
                                                                                            switch (self._) {
                                                                                                case 'Maybe.some':
                                                                                                    var $935 = self.value;
                                                                                                    var $936 = Parser$Reply$error$(Parser$Error$combine$($935, $933));
                                                                                                    var $934 = $936;
                                                                                                    break;
                                                                                                case 'Maybe.none':
                                                                                                    var $937 = Parser$Reply$error$($933);
                                                                                                    var $934 = $937;
                                                                                                    break;
                                                                                            };
                                                                                            var $932 = $934;
                                                                                            break;
                                                                                        case 'Parser.Reply.value':
                                                                                            var $938 = self.pst;
                                                                                            var $939 = self.val;
                                                                                            var self = $938;
                                                                                            switch (self._) {
                                                                                                case 'Parser.State.new':
                                                                                                    var $941 = self.err;
                                                                                                    var $942 = self.nam;
                                                                                                    var $943 = self.ini;
                                                                                                    var $944 = self.idx;
                                                                                                    var $945 = self.str;
                                                                                                    var _reply$pst$51 = Parser$State$new$(Parser$Error$maybe_combine$($931, $941), $942, $943, $944, $945);
                                                                                                    var self = _reply$pst$51;
                                                                                                    switch (self._) {
                                                                                                        case 'Parser.State.new':
                                                                                                            var $947 = self.err;
                                                                                                            var _reply$57 = Parser$maybe$(Litereum$parse$text(","), _reply$pst$51);
                                                                                                            var self = _reply$57;
                                                                                                            switch (self._) {
                                                                                                                case 'Parser.Reply.error':
                                                                                                                    var $949 = self.err;
                                                                                                                    var self = $947;
                                                                                                                    switch (self._) {
                                                                                                                        case 'Maybe.some':
                                                                                                                            var $951 = self.value;
                                                                                                                            var $952 = Parser$Reply$error$(Parser$Error$combine$($951, $949));
                                                                                                                            var $950 = $952;
                                                                                                                            break;
                                                                                                                        case 'Maybe.none':
                                                                                                                            var $953 = Parser$Reply$error$($949);
                                                                                                                            var $950 = $953;
                                                                                                                            break;
                                                                                                                    };
                                                                                                                    var $948 = $950;
                                                                                                                    break;
                                                                                                                case 'Parser.Reply.value':
                                                                                                                    var $954 = self.pst;
                                                                                                                    var self = $954;
                                                                                                                    switch (self._) {
                                                                                                                        case 'Parser.State.new':
                                                                                                                            var $956 = self.err;
                                                                                                                            var $957 = self.nam;
                                                                                                                            var $958 = self.ini;
                                                                                                                            var $959 = self.idx;
                                                                                                                            var $960 = self.str;
                                                                                                                            var _reply$pst$65 = Parser$State$new$(Parser$Error$maybe_combine$($947, $956), $957, $958, $959, $960);
                                                                                                                            var self = _reply$pst$65;
                                                                                                                            switch (self._) {
                                                                                                                                case 'Parser.State.new':
                                                                                                                                    var $962 = self.err;
                                                                                                                                    var _reply$71 = Litereum$parse$term$match$cases$(_world$1, $896)(_reply$pst$65);
                                                                                                                                    var self = _reply$71;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Parser.Reply.error':
                                                                                                                                            var $964 = self.err;
                                                                                                                                            var self = $962;
                                                                                                                                            switch (self._) {
                                                                                                                                                case 'Maybe.some':
                                                                                                                                                    var $966 = self.value;
                                                                                                                                                    var $967 = Parser$Reply$error$(Parser$Error$combine$($966, $964));
                                                                                                                                                    var $965 = $967;
                                                                                                                                                    break;
                                                                                                                                                case 'Maybe.none':
                                                                                                                                                    var $968 = Parser$Reply$error$($964);
                                                                                                                                                    var $965 = $968;
                                                                                                                                                    break;
                                                                                                                                            };
                                                                                                                                            var $963 = $965;
                                                                                                                                            break;
                                                                                                                                        case 'Parser.Reply.value':
                                                                                                                                            var $969 = self.pst;
                                                                                                                                            var $970 = self.val;
                                                                                                                                            var self = $969;
                                                                                                                                            switch (self._) {
                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                    var $972 = self.err;
                                                                                                                                                    var $973 = self.nam;
                                                                                                                                                    var $974 = self.ini;
                                                                                                                                                    var $975 = self.idx;
                                                                                                                                                    var $976 = self.str;
                                                                                                                                                    var _reply$pst$79 = Parser$State$new$(Parser$Error$maybe_combine$($962, $972), $973, $974, $975, $976);
                                                                                                                                                    var $977 = Parser$Reply$value$(_reply$pst$79, List$cons$($939, $970));
                                                                                                                                                    var $971 = $977;
                                                                                                                                                    break;
                                                                                                                                            };
                                                                                                                                            var $963 = $971;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $961 = $963;
                                                                                                                                    break;
                                                                                                                            };
                                                                                                                            var $955 = $961;
                                                                                                                            break;
                                                                                                                    };
                                                                                                                    var $948 = $955;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $946 = $948;
                                                                                                            break;
                                                                                                    };
                                                                                                    var $940 = $946;
                                                                                                    break;
                                                                                            };
                                                                                            var $932 = $940;
                                                                                            break;
                                                                                    };
                                                                                    var $930 = $932;
                                                                                    break;
                                                                            };
                                                                            var $924 = $930;
                                                                            break;
                                                                    };
                                                                    var $917 = $924;
                                                                    break;
                                                            };
                                                            var $915 = $917;
                                                            break;
                                                    };
                                                    var $909 = $915;
                                                    break;
                                            };
                                            var $902 = $909;
                                            break;
                                    };
                                    var $900 = $902;
                                    break;
                            };
                            return $900;
                        });
                        var $897 = $899;
                        break;
                };
                var $894 = $897;
                break;
            case 'List.nil':
                var $978 = (_pst$3 => {
                    var $979 = Parser$Reply$value$(_pst$3, List$nil);
                    return $979;
                });
                var $894 = $978;
                break;
        };
        return $894;
    };
    const Litereum$parse$term$match$cases = x0 => x1 => Litereum$parse$term$match$cases$(x0, x1);

    function Litereum$Term$match$(_name$1, _data$2, _cses$3) {
        var $980 = ({
            _: 'Litereum.Term.match',
            'name': _name$1,
            'data': _data$2,
            'cses': _cses$3
        });
        return $980;
    };
    const Litereum$Term$match = x0 => x1 => x2 => Litereum$Term$match$(x0, x1, x2);

    function Litereum$parse$term$match$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $982 = self.err;
                var _reply$8 = Litereum$parse$text$("case ", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $984 = self.err;
                        var self = $982;
                        switch (self._) {
                            case 'Maybe.some':
                                var $986 = self.value;
                                var $987 = Parser$Reply$error$(Parser$Error$combine$($986, $984));
                                var $985 = $987;
                                break;
                            case 'Maybe.none':
                                var $988 = Parser$Reply$error$($984);
                                var $985 = $988;
                                break;
                        };
                        var $983 = $985;
                        break;
                    case 'Parser.Reply.value':
                        var $989 = self.pst;
                        var self = $989;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $991 = self.err;
                                var $992 = self.nam;
                                var $993 = self.ini;
                                var $994 = self.idx;
                                var $995 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($982, $991), $992, $993, $994, $995);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $997 = self.err;
                                        var _reply$22 = Litereum$parse$name$(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $999 = self.err;
                                                var self = $997;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1001 = self.value;
                                                        var $1002 = Parser$Reply$error$(Parser$Error$combine$($1001, $999));
                                                        var $1000 = $1002;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1003 = Parser$Reply$error$($999);
                                                        var $1000 = $1003;
                                                        break;
                                                };
                                                var $998 = $1000;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1004 = self.pst;
                                                var $1005 = self.val;
                                                var self = $1004;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1007 = self.err;
                                                        var $1008 = self.nam;
                                                        var $1009 = self.ini;
                                                        var $1010 = self.idx;
                                                        var $1011 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($997, $1007), $1008, $1009, $1010, $1011);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $1013 = self.err;
                                                                var _reply$36 = Litereum$parse$text$(":", _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1015 = self.err;
                                                                        var self = $1013;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $1017 = self.value;
                                                                                var $1018 = Parser$Reply$error$(Parser$Error$combine$($1017, $1015));
                                                                                var $1016 = $1018;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $1019 = Parser$Reply$error$($1015);
                                                                                var $1016 = $1019;
                                                                                break;
                                                                        };
                                                                        var $1014 = $1016;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1020 = self.pst;
                                                                        var self = $1020;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $1022 = self.err;
                                                                                var $1023 = self.nam;
                                                                                var $1024 = self.ini;
                                                                                var $1025 = self.idx;
                                                                                var $1026 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($1013, $1022), $1023, $1024, $1025, $1026);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $1028 = self.err;
                                                                                        var _reply$50 = Litereum$parse$name$(_reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1030 = self.err;
                                                                                                var self = $1028;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $1032 = self.value;
                                                                                                        var $1033 = Parser$Reply$error$(Parser$Error$combine$($1032, $1030));
                                                                                                        var $1031 = $1033;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $1034 = Parser$Reply$error$($1030);
                                                                                                        var $1031 = $1034;
                                                                                                        break;
                                                                                                };
                                                                                                var $1029 = $1031;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1035 = self.pst;
                                                                                                var $1036 = self.val;
                                                                                                var self = $1035;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $1038 = self.err;
                                                                                                        var $1039 = self.nam;
                                                                                                        var $1040 = self.ini;
                                                                                                        var $1041 = self.idx;
                                                                                                        var $1042 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($1028, $1038), $1039, $1040, $1041, $1042);
                                                                                                        var self = Litereum$get_data$(_world$1, $1036);
                                                                                                        switch (self._) {
                                                                                                            case 'Maybe.some':
                                                                                                                var $1044 = self.value;
                                                                                                                var _data$60 = $1044;
                                                                                                                var self = _data$60;
                                                                                                                switch (self._) {
                                                                                                                    case 'Litereum.Data.new':
                                                                                                                        var $1046 = self.constructors;
                                                                                                                        var $1047 = (_pst$63 => {
                                                                                                                            var self = _pst$63;
                                                                                                                            switch (self._) {
                                                                                                                                case 'Parser.State.new':
                                                                                                                                    var $1049 = self.err;
                                                                                                                                    var _reply$69 = Litereum$parse$text$("{", _pst$63);
                                                                                                                                    var self = _reply$69;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Parser.Reply.error':
                                                                                                                                            var $1051 = self.err;
                                                                                                                                            var self = $1049;
                                                                                                                                            switch (self._) {
                                                                                                                                                case 'Maybe.some':
                                                                                                                                                    var $1053 = self.value;
                                                                                                                                                    var $1054 = Parser$Reply$error$(Parser$Error$combine$($1053, $1051));
                                                                                                                                                    var $1052 = $1054;
                                                                                                                                                    break;
                                                                                                                                                case 'Maybe.none':
                                                                                                                                                    var $1055 = Parser$Reply$error$($1051);
                                                                                                                                                    var $1052 = $1055;
                                                                                                                                                    break;
                                                                                                                                            };
                                                                                                                                            var $1050 = $1052;
                                                                                                                                            break;
                                                                                                                                        case 'Parser.Reply.value':
                                                                                                                                            var $1056 = self.pst;
                                                                                                                                            var self = $1056;
                                                                                                                                            switch (self._) {
                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                    var $1058 = self.err;
                                                                                                                                                    var $1059 = self.nam;
                                                                                                                                                    var $1060 = self.ini;
                                                                                                                                                    var $1061 = self.idx;
                                                                                                                                                    var $1062 = self.str;
                                                                                                                                                    var _reply$pst$77 = Parser$State$new$(Parser$Error$maybe_combine$($1049, $1058), $1059, $1060, $1061, $1062);
                                                                                                                                                    var self = _reply$pst$77;
                                                                                                                                                    switch (self._) {
                                                                                                                                                        case 'Parser.State.new':
                                                                                                                                                            var $1064 = self.err;
                                                                                                                                                            var _reply$83 = Litereum$parse$term$match$cases$(_world$1, $1046)(_reply$pst$77);
                                                                                                                                                            var self = _reply$83;
                                                                                                                                                            switch (self._) {
                                                                                                                                                                case 'Parser.Reply.error':
                                                                                                                                                                    var $1066 = self.err;
                                                                                                                                                                    var self = $1064;
                                                                                                                                                                    switch (self._) {
                                                                                                                                                                        case 'Maybe.some':
                                                                                                                                                                            var $1068 = self.value;
                                                                                                                                                                            var $1069 = Parser$Reply$error$(Parser$Error$combine$($1068, $1066));
                                                                                                                                                                            var $1067 = $1069;
                                                                                                                                                                            break;
                                                                                                                                                                        case 'Maybe.none':
                                                                                                                                                                            var $1070 = Parser$Reply$error$($1066);
                                                                                                                                                                            var $1067 = $1070;
                                                                                                                                                                            break;
                                                                                                                                                                    };
                                                                                                                                                                    var $1065 = $1067;
                                                                                                                                                                    break;
                                                                                                                                                                case 'Parser.Reply.value':
                                                                                                                                                                    var $1071 = self.pst;
                                                                                                                                                                    var $1072 = self.val;
                                                                                                                                                                    var self = $1071;
                                                                                                                                                                    switch (self._) {
                                                                                                                                                                        case 'Parser.State.new':
                                                                                                                                                                            var $1074 = self.err;
                                                                                                                                                                            var $1075 = self.nam;
                                                                                                                                                                            var $1076 = self.ini;
                                                                                                                                                                            var $1077 = self.idx;
                                                                                                                                                                            var $1078 = self.str;
                                                                                                                                                                            var _reply$pst$91 = Parser$State$new$(Parser$Error$maybe_combine$($1064, $1074), $1075, $1076, $1077, $1078);
                                                                                                                                                                            var self = _reply$pst$91;
                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                                                    var $1080 = self.err;
                                                                                                                                                                                    var _reply$97 = Litereum$parse$text$("}", _reply$pst$91);
                                                                                                                                                                                    var self = _reply$97;
                                                                                                                                                                                    switch (self._) {
                                                                                                                                                                                        case 'Parser.Reply.error':
                                                                                                                                                                                            var $1082 = self.err;
                                                                                                                                                                                            var self = $1080;
                                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                                case 'Maybe.some':
                                                                                                                                                                                                    var $1084 = self.value;
                                                                                                                                                                                                    var $1085 = Parser$Reply$error$(Parser$Error$combine$($1084, $1082));
                                                                                                                                                                                                    var $1083 = $1085;
                                                                                                                                                                                                    break;
                                                                                                                                                                                                case 'Maybe.none':
                                                                                                                                                                                                    var $1086 = Parser$Reply$error$($1082);
                                                                                                                                                                                                    var $1083 = $1086;
                                                                                                                                                                                                    break;
                                                                                                                                                                                            };
                                                                                                                                                                                            var $1081 = $1083;
                                                                                                                                                                                            break;
                                                                                                                                                                                        case 'Parser.Reply.value':
                                                                                                                                                                                            var $1087 = self.pst;
                                                                                                                                                                                            var self = $1087;
                                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                                                                    var $1089 = self.err;
                                                                                                                                                                                                    var $1090 = self.nam;
                                                                                                                                                                                                    var $1091 = self.ini;
                                                                                                                                                                                                    var $1092 = self.idx;
                                                                                                                                                                                                    var $1093 = self.str;
                                                                                                                                                                                                    var _reply$pst$105 = Parser$State$new$(Parser$Error$maybe_combine$($1080, $1089), $1090, $1091, $1092, $1093);
                                                                                                                                                                                                    var $1094 = Parser$Reply$value$(_reply$pst$105, Litereum$Term$match$($1005, $1036, $1072));
                                                                                                                                                                                                    var $1088 = $1094;
                                                                                                                                                                                                    break;
                                                                                                                                                                                            };
                                                                                                                                                                                            var $1081 = $1088;
                                                                                                                                                                                            break;
                                                                                                                                                                                    };
                                                                                                                                                                                    var $1079 = $1081;
                                                                                                                                                                                    break;
                                                                                                                                                                            };
                                                                                                                                                                            var $1073 = $1079;
                                                                                                                                                                            break;
                                                                                                                                                                    };
                                                                                                                                                                    var $1065 = $1073;
                                                                                                                                                                    break;
                                                                                                                                                            };
                                                                                                                                                            var $1063 = $1065;
                                                                                                                                                            break;
                                                                                                                                                    };
                                                                                                                                                    var $1057 = $1063;
                                                                                                                                                    break;
                                                                                                                                            };
                                                                                                                                            var $1050 = $1057;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1048 = $1050;
                                                                                                                                    break;
                                                                                                                            };
                                                                                                                            return $1048;
                                                                                                                        });
                                                                                                                        var $1045 = $1047;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $1043 = $1045;
                                                                                                                break;
                                                                                                            case 'Maybe.none':
                                                                                                                var $1095 = Parser$fail("Type not found.");
                                                                                                                var $1043 = $1095;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1043 = $1043(_reply$pst$58);
                                                                                                        var $1037 = $1043;
                                                                                                        break;
                                                                                                };
                                                                                                var $1029 = $1037;
                                                                                                break;
                                                                                        };
                                                                                        var $1027 = $1029;
                                                                                        break;
                                                                                };
                                                                                var $1021 = $1027;
                                                                                break;
                                                                        };
                                                                        var $1014 = $1021;
                                                                        break;
                                                                };
                                                                var $1012 = $1014;
                                                                break;
                                                        };
                                                        var $1006 = $1012;
                                                        break;
                                                };
                                                var $998 = $1006;
                                                break;
                                        };
                                        var $996 = $998;
                                        break;
                                };
                                var $990 = $996;
                                break;
                        };
                        var $983 = $990;
                        break;
                };
                var $981 = $983;
                break;
        };
        return $981;
    };
    const Litereum$parse$term$match = x0 => x1 => Litereum$parse$term$match$(x0, x1);

    function Parser$many1$(_parser$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var $1097 = self.err;
                var _reply$9 = _parser$2(_pst$3);
                var self = _reply$9;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1099 = self.err;
                        var self = $1097;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1101 = self.value;
                                var $1102 = Parser$Reply$error$(Parser$Error$combine$($1101, $1099));
                                var $1100 = $1102;
                                break;
                            case 'Maybe.none':
                                var $1103 = Parser$Reply$error$($1099);
                                var $1100 = $1103;
                                break;
                        };
                        var $1098 = $1100;
                        break;
                    case 'Parser.Reply.value':
                        var $1104 = self.pst;
                        var $1105 = self.val;
                        var self = $1104;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1107 = self.err;
                                var $1108 = self.nam;
                                var $1109 = self.ini;
                                var $1110 = self.idx;
                                var $1111 = self.str;
                                var _reply$pst$17 = Parser$State$new$(Parser$Error$maybe_combine$($1097, $1107), $1108, $1109, $1110, $1111);
                                var self = _reply$pst$17;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1113 = self.err;
                                        var _reply$23 = Parser$many$(_parser$2)(_reply$pst$17);
                                        var self = _reply$23;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1115 = self.err;
                                                var self = $1113;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1117 = self.value;
                                                        var $1118 = Parser$Reply$error$(Parser$Error$combine$($1117, $1115));
                                                        var $1116 = $1118;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1119 = Parser$Reply$error$($1115);
                                                        var $1116 = $1119;
                                                        break;
                                                };
                                                var $1114 = $1116;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1120 = self.pst;
                                                var $1121 = self.val;
                                                var self = $1120;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1123 = self.err;
                                                        var $1124 = self.nam;
                                                        var $1125 = self.ini;
                                                        var $1126 = self.idx;
                                                        var $1127 = self.str;
                                                        var _reply$pst$31 = Parser$State$new$(Parser$Error$maybe_combine$($1113, $1123), $1124, $1125, $1126, $1127);
                                                        var $1128 = Parser$Reply$value$(_reply$pst$31, List$cons$($1105, $1121));
                                                        var $1122 = $1128;
                                                        break;
                                                };
                                                var $1114 = $1122;
                                                break;
                                        };
                                        var $1112 = $1114;
                                        break;
                                };
                                var $1106 = $1112;
                                break;
                        };
                        var $1098 = $1106;
                        break;
                };
                var $1096 = $1098;
                break;
        };
        return $1096;
    };
    const Parser$many1 = x0 => x1 => Parser$many1$(x0, x1);

    function Parser$digit$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1130 = self.err;
                var $1131 = self.nam;
                var $1132 = self.ini;
                var $1133 = self.idx;
                var $1134 = self.str;
                var self = $1134;
                if (self.length === 0) {
                    var $1136 = Parser$Reply$fail$($1131, $1132, $1133, "Not a digit.");
                    var $1135 = $1136;
                } else {
                    var $1137 = self.charCodeAt(0);
                    var $1138 = self.slice(1);
                    var _pst$9 = Parser$State$new$($1130, $1131, $1132, Nat$succ$($1133), $1138);
                    var self = ($1137 === 48);
                    if (self) {
                        var $1140 = Parser$Reply$value$(_pst$9, 0n);
                        var $1139 = $1140;
                    } else {
                        var self = ($1137 === 49);
                        if (self) {
                            var $1142 = Parser$Reply$value$(_pst$9, 1n);
                            var $1141 = $1142;
                        } else {
                            var self = ($1137 === 50);
                            if (self) {
                                var $1144 = Parser$Reply$value$(_pst$9, 2n);
                                var $1143 = $1144;
                            } else {
                                var self = ($1137 === 51);
                                if (self) {
                                    var $1146 = Parser$Reply$value$(_pst$9, 3n);
                                    var $1145 = $1146;
                                } else {
                                    var self = ($1137 === 52);
                                    if (self) {
                                        var $1148 = Parser$Reply$value$(_pst$9, 4n);
                                        var $1147 = $1148;
                                    } else {
                                        var self = ($1137 === 53);
                                        if (self) {
                                            var $1150 = Parser$Reply$value$(_pst$9, 5n);
                                            var $1149 = $1150;
                                        } else {
                                            var self = ($1137 === 54);
                                            if (self) {
                                                var $1152 = Parser$Reply$value$(_pst$9, 6n);
                                                var $1151 = $1152;
                                            } else {
                                                var self = ($1137 === 55);
                                                if (self) {
                                                    var $1154 = Parser$Reply$value$(_pst$9, 7n);
                                                    var $1153 = $1154;
                                                } else {
                                                    var self = ($1137 === 56);
                                                    if (self) {
                                                        var $1156 = Parser$Reply$value$(_pst$9, 8n);
                                                        var $1155 = $1156;
                                                    } else {
                                                        var self = ($1137 === 57);
                                                        if (self) {
                                                            var $1158 = Parser$Reply$value$(_pst$9, 9n);
                                                            var $1157 = $1158;
                                                        } else {
                                                            var $1159 = Parser$Reply$fail$($1131, $1132, $1133, "Not a digit.");
                                                            var $1157 = $1159;
                                                        };
                                                        var $1155 = $1157;
                                                    };
                                                    var $1153 = $1155;
                                                };
                                                var $1151 = $1153;
                                            };
                                            var $1149 = $1151;
                                        };
                                        var $1147 = $1149;
                                    };
                                    var $1145 = $1147;
                                };
                                var $1143 = $1145;
                            };
                            var $1141 = $1143;
                        };
                        var $1139 = $1141;
                    };
                    var $1135 = $1139;
                };
                var $1129 = $1135;
                break;
        };
        return $1129;
    };
    const Parser$digit = x0 => Parser$digit$(x0);
    const Nat$add = a0 => a1 => (a0 + a1);
    const Nat$mul = a0 => a1 => (a0 * a1);

    function Nat$from_base$go$(_b$1, _ds$2, _p$3, _res$4) {
        var Nat$from_base$go$ = (_b$1, _ds$2, _p$3, _res$4) => ({
            ctr: 'TCO',
            arg: [_b$1, _ds$2, _p$3, _res$4]
        });
        var Nat$from_base$go = _b$1 => _ds$2 => _p$3 => _res$4 => Nat$from_base$go$(_b$1, _ds$2, _p$3, _res$4);
        var arg = [_b$1, _ds$2, _p$3, _res$4];
        while (true) {
            let [_b$1, _ds$2, _p$3, _res$4] = arg;
            var R = (() => {
                var self = _ds$2;
                switch (self._) {
                    case 'List.cons':
                        var $1160 = self.head;
                        var $1161 = self.tail;
                        var $1162 = Nat$from_base$go$(_b$1, $1161, (_b$1 * _p$3), (($1160 * _p$3) + _res$4));
                        return $1162;
                    case 'List.nil':
                        var $1163 = _res$4;
                        return $1163;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$from_base$go = x0 => x1 => x2 => x3 => Nat$from_base$go$(x0, x1, x2, x3);

    function Nat$from_base$(_base$1, _ds$2) {
        var $1164 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $1164;
    };
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);

    function Parser$nat$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1166 = self.err;
                var _reply$7 = Parser$many1$(Parser$digit, _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1168 = self.err;
                        var self = $1166;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1170 = self.value;
                                var $1171 = Parser$Reply$error$(Parser$Error$combine$($1170, $1168));
                                var $1169 = $1171;
                                break;
                            case 'Maybe.none':
                                var $1172 = Parser$Reply$error$($1168);
                                var $1169 = $1172;
                                break;
                        };
                        var $1167 = $1169;
                        break;
                    case 'Parser.Reply.value':
                        var $1173 = self.pst;
                        var $1174 = self.val;
                        var self = $1173;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1176 = self.err;
                                var $1177 = self.nam;
                                var $1178 = self.ini;
                                var $1179 = self.idx;
                                var $1180 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1166, $1176), $1177, $1178, $1179, $1180);
                                var $1181 = Parser$Reply$value$(_reply$pst$15, Nat$from_base$(10n, $1174));
                                var $1175 = $1181;
                                break;
                        };
                        var $1167 = $1175;
                        break;
                };
                var $1165 = $1167;
                break;
        };
        return $1165;
    };
    const Parser$nat = x0 => Parser$nat$(x0);
    const Nat$gte = a0 => a1 => (a0 >= a1);

    function Nat$pow$aux$(_x$1, _y$2, _aux$3) {
        var Nat$pow$aux$ = (_x$1, _y$2, _aux$3) => ({
            ctr: 'TCO',
            arg: [_x$1, _y$2, _aux$3]
        });
        var Nat$pow$aux = _x$1 => _y$2 => _aux$3 => Nat$pow$aux$(_x$1, _y$2, _aux$3);
        var arg = [_x$1, _y$2, _aux$3];
        while (true) {
            let [_x$1, _y$2, _aux$3] = arg;
            var R = (() => {
                var self = _y$2;
                if (self === 0n) {
                    var $1182 = _x$1;
                    return $1182;
                } else {
                    var $1183 = (self - 1n);
                    var $1184 = Nat$pow$aux$(_x$1, $1183, (_aux$3 * 2n));
                    return $1184;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$pow$aux = x0 => x1 => x2 => Nat$pow$aux$(x0, x1, x2);
    const Nat$pow = a0 => a1 => (a0 ** a1);

    function Litereum$Term$word$(_numb$1) {
        var $1185 = ({
            _: 'Litereum.Term.word',
            'numb': _numb$1
        });
        return $1185;
    };
    const Litereum$Term$word = x0 => Litereum$Term$word$(x0);

    function U64$new$(_value$1) {
        var $1186 = word_to_u64(_value$1);
        return $1186;
    };
    const U64$new = x0 => U64$new$(x0);
    const Nat$to_u64 = a0 => (a0 & 0xFFFFFFFFFFFFFFFFn);

    function Litereum$parse$term$word$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1188 = self.err;
                var _reply$8 = Litereum$parse$text$("#", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1190 = self.err;
                        var self = $1188;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1192 = self.value;
                                var $1193 = Parser$Reply$error$(Parser$Error$combine$($1192, $1190));
                                var $1191 = $1193;
                                break;
                            case 'Maybe.none':
                                var $1194 = Parser$Reply$error$($1190);
                                var $1191 = $1194;
                                break;
                        };
                        var $1189 = $1191;
                        break;
                    case 'Parser.Reply.value':
                        var $1195 = self.pst;
                        var self = $1195;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1197 = self.err;
                                var $1198 = self.nam;
                                var $1199 = self.ini;
                                var $1200 = self.idx;
                                var $1201 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1188, $1197), $1198, $1199, $1200, $1201);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1203 = self.err;
                                        var _reply$22 = Parser$nat$(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1205 = self.err;
                                                var self = $1203;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1207 = self.value;
                                                        var $1208 = Parser$Reply$error$(Parser$Error$combine$($1207, $1205));
                                                        var $1206 = $1208;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1209 = Parser$Reply$error$($1205);
                                                        var $1206 = $1209;
                                                        break;
                                                };
                                                var $1204 = $1206;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1210 = self.pst;
                                                var $1211 = self.val;
                                                var self = $1210;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1213 = self.err;
                                                        var $1214 = self.nam;
                                                        var $1215 = self.ini;
                                                        var $1216 = self.idx;
                                                        var $1217 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1203, $1213), $1214, $1215, $1216, $1217);
                                                        var self = ($1211 >= (2n ** 64n));
                                                        if (self) {
                                                            var $1219 = Parser$fail("Number out of bound");
                                                            var $1218 = $1219;
                                                        } else {
                                                            var $1220 = (_pst$31 => {
                                                                var $1221 = Parser$Reply$value$(_pst$31, Litereum$Term$word$(($1211 & 0xFFFFFFFFFFFFFFFFn)));
                                                                return $1221;
                                                            });
                                                            var $1218 = $1220;
                                                        };
                                                        var $1218 = $1218(_reply$pst$30);
                                                        var $1212 = $1218;
                                                        break;
                                                };
                                                var $1204 = $1212;
                                                break;
                                        };
                                        var $1202 = $1204;
                                        break;
                                };
                                var $1196 = $1202;
                                break;
                        };
                        var $1189 = $1196;
                        break;
                };
                var $1187 = $1189;
                break;
        };
        return $1187;
    };
    const Litereum$parse$term$word = x0 => x1 => Litereum$parse$term$word$(x0, x1);

    function Litereum$Term$compare$(_val0$1, _val1$2, _iflt$3, _ifeq$4, _ifgt$5) {
        var $1222 = ({
            _: 'Litereum.Term.compare',
            'val0': _val0$1,
            'val1': _val1$2,
            'iflt': _iflt$3,
            'ifeq': _ifeq$4,
            'ifgt': _ifgt$5
        });
        return $1222;
    };
    const Litereum$Term$compare = x0 => x1 => x2 => x3 => x4 => Litereum$Term$compare$(x0, x1, x2, x3, x4);

    function Litereum$parse$term$compare$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1224 = self.err;
                var _reply$8 = Litereum$parse$text$("compare", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1226 = self.err;
                        var self = $1224;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1228 = self.value;
                                var $1229 = Parser$Reply$error$(Parser$Error$combine$($1228, $1226));
                                var $1227 = $1229;
                                break;
                            case 'Maybe.none':
                                var $1230 = Parser$Reply$error$($1226);
                                var $1227 = $1230;
                                break;
                        };
                        var $1225 = $1227;
                        break;
                    case 'Parser.Reply.value':
                        var $1231 = self.pst;
                        var self = $1231;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1233 = self.err;
                                var $1234 = self.nam;
                                var $1235 = self.ini;
                                var $1236 = self.idx;
                                var $1237 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1224, $1233), $1234, $1235, $1236, $1237);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1239 = self.err;
                                        var _reply$22 = Litereum$parse$term$(_world$1)(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1241 = self.err;
                                                var self = $1239;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1243 = self.value;
                                                        var $1244 = Parser$Reply$error$(Parser$Error$combine$($1243, $1241));
                                                        var $1242 = $1244;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1245 = Parser$Reply$error$($1241);
                                                        var $1242 = $1245;
                                                        break;
                                                };
                                                var $1240 = $1242;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1246 = self.pst;
                                                var $1247 = self.val;
                                                var self = $1246;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1249 = self.err;
                                                        var $1250 = self.nam;
                                                        var $1251 = self.ini;
                                                        var $1252 = self.idx;
                                                        var $1253 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1239, $1249), $1250, $1251, $1252, $1253);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $1255 = self.err;
                                                                var _reply$36 = Litereum$parse$term$(_world$1)(_reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1257 = self.err;
                                                                        var self = $1255;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $1259 = self.value;
                                                                                var $1260 = Parser$Reply$error$(Parser$Error$combine$($1259, $1257));
                                                                                var $1258 = $1260;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $1261 = Parser$Reply$error$($1257);
                                                                                var $1258 = $1261;
                                                                                break;
                                                                        };
                                                                        var $1256 = $1258;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1262 = self.pst;
                                                                        var $1263 = self.val;
                                                                        var self = $1262;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $1265 = self.err;
                                                                                var $1266 = self.nam;
                                                                                var $1267 = self.ini;
                                                                                var $1268 = self.idx;
                                                                                var $1269 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($1255, $1265), $1266, $1267, $1268, $1269);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $1271 = self.err;
                                                                                        var _reply$50 = Litereum$parse$text$("{", _reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1273 = self.err;
                                                                                                var self = $1271;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $1275 = self.value;
                                                                                                        var $1276 = Parser$Reply$error$(Parser$Error$combine$($1275, $1273));
                                                                                                        var $1274 = $1276;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $1277 = Parser$Reply$error$($1273);
                                                                                                        var $1274 = $1277;
                                                                                                        break;
                                                                                                };
                                                                                                var $1272 = $1274;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1278 = self.pst;
                                                                                                var self = $1278;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $1280 = self.err;
                                                                                                        var $1281 = self.nam;
                                                                                                        var $1282 = self.ini;
                                                                                                        var $1283 = self.idx;
                                                                                                        var $1284 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($1271, $1280), $1281, $1282, $1283, $1284);
                                                                                                        var self = _reply$pst$58;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $1286 = self.err;
                                                                                                                var _reply$64 = Litereum$parse$text$("_<_:", _reply$pst$58);
                                                                                                                var self = _reply$64;
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $1288 = self.err;
                                                                                                                        var self = $1286;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Maybe.some':
                                                                                                                                var $1290 = self.value;
                                                                                                                                var $1291 = Parser$Reply$error$(Parser$Error$combine$($1290, $1288));
                                                                                                                                var $1289 = $1291;
                                                                                                                                break;
                                                                                                                            case 'Maybe.none':
                                                                                                                                var $1292 = Parser$Reply$error$($1288);
                                                                                                                                var $1289 = $1292;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1287 = $1289;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $1293 = self.pst;
                                                                                                                        var self = $1293;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $1295 = self.err;
                                                                                                                                var $1296 = self.nam;
                                                                                                                                var $1297 = self.ini;
                                                                                                                                var $1298 = self.idx;
                                                                                                                                var $1299 = self.str;
                                                                                                                                var _reply$pst$72 = Parser$State$new$(Parser$Error$maybe_combine$($1286, $1295), $1296, $1297, $1298, $1299);
                                                                                                                                var self = _reply$pst$72;
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.State.new':
                                                                                                                                        var $1301 = self.err;
                                                                                                                                        var _reply$78 = Litereum$parse$term$(_world$1)(_reply$pst$72);
                                                                                                                                        var self = _reply$78;
                                                                                                                                        switch (self._) {
                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                var $1303 = self.err;
                                                                                                                                                var self = $1301;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                        var $1305 = self.value;
                                                                                                                                                        var $1306 = Parser$Reply$error$(Parser$Error$combine$($1305, $1303));
                                                                                                                                                        var $1304 = $1306;
                                                                                                                                                        break;
                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                        var $1307 = Parser$Reply$error$($1303);
                                                                                                                                                        var $1304 = $1307;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1302 = $1304;
                                                                                                                                                break;
                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                var $1308 = self.pst;
                                                                                                                                                var $1309 = self.val;
                                                                                                                                                var self = $1308;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                        var $1311 = self.err;
                                                                                                                                                        var $1312 = self.nam;
                                                                                                                                                        var $1313 = self.ini;
                                                                                                                                                        var $1314 = self.idx;
                                                                                                                                                        var $1315 = self.str;
                                                                                                                                                        var _reply$pst$86 = Parser$State$new$(Parser$Error$maybe_combine$($1301, $1311), $1312, $1313, $1314, $1315);
                                                                                                                                                        var self = _reply$pst$86;
                                                                                                                                                        switch (self._) {
                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                var $1317 = self.err;
                                                                                                                                                                var _reply$92 = Litereum$parse$text$("_=_:", _reply$pst$86);
                                                                                                                                                                var self = _reply$92;
                                                                                                                                                                switch (self._) {
                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                        var $1319 = self.err;
                                                                                                                                                                        var self = $1317;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                var $1321 = self.value;
                                                                                                                                                                                var $1322 = Parser$Reply$error$(Parser$Error$combine$($1321, $1319));
                                                                                                                                                                                var $1320 = $1322;
                                                                                                                                                                                break;
                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                var $1323 = Parser$Reply$error$($1319);
                                                                                                                                                                                var $1320 = $1323;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $1318 = $1320;
                                                                                                                                                                        break;
                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                        var $1324 = self.pst;
                                                                                                                                                                        var self = $1324;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                var $1326 = self.err;
                                                                                                                                                                                var $1327 = self.nam;
                                                                                                                                                                                var $1328 = self.ini;
                                                                                                                                                                                var $1329 = self.idx;
                                                                                                                                                                                var $1330 = self.str;
                                                                                                                                                                                var _reply$pst$100 = Parser$State$new$(Parser$Error$maybe_combine$($1317, $1326), $1327, $1328, $1329, $1330);
                                                                                                                                                                                var self = _reply$pst$100;
                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                        var $1332 = self.err;
                                                                                                                                                                                        var _reply$106 = Litereum$parse$term$(_world$1)(_reply$pst$100);
                                                                                                                                                                                        var self = _reply$106;
                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                                                                var $1334 = self.err;
                                                                                                                                                                                                var self = $1332;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                                                                        var $1336 = self.value;
                                                                                                                                                                                                        var $1337 = Parser$Reply$error$(Parser$Error$combine$($1336, $1334));
                                                                                                                                                                                                        var $1335 = $1337;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                                                                        var $1338 = Parser$Reply$error$($1334);
                                                                                                                                                                                                        var $1335 = $1338;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $1333 = $1335;
                                                                                                                                                                                                break;
                                                                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                                                                var $1339 = self.pst;
                                                                                                                                                                                                var $1340 = self.val;
                                                                                                                                                                                                var self = $1339;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                        var $1342 = self.err;
                                                                                                                                                                                                        var $1343 = self.nam;
                                                                                                                                                                                                        var $1344 = self.ini;
                                                                                                                                                                                                        var $1345 = self.idx;
                                                                                                                                                                                                        var $1346 = self.str;
                                                                                                                                                                                                        var _reply$pst$114 = Parser$State$new$(Parser$Error$maybe_combine$($1332, $1342), $1343, $1344, $1345, $1346);
                                                                                                                                                                                                        var self = _reply$pst$114;
                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                                                var $1348 = self.err;
                                                                                                                                                                                                                var _reply$120 = Litereum$parse$text$("_>_:", _reply$pst$114);
                                                                                                                                                                                                                var self = _reply$120;
                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                                                                        var $1350 = self.err;
                                                                                                                                                                                                                        var self = $1348;
                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                                                                var $1352 = self.value;
                                                                                                                                                                                                                                var $1353 = Parser$Reply$error$(Parser$Error$combine$($1352, $1350));
                                                                                                                                                                                                                                var $1351 = $1353;
                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                                                                var $1354 = Parser$Reply$error$($1350);
                                                                                                                                                                                                                                var $1351 = $1354;
                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                        };
                                                                                                                                                                                                                        var $1349 = $1351;
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                                                                        var $1355 = self.pst;
                                                                                                                                                                                                                        var self = $1355;
                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                                                                var $1357 = self.err;
                                                                                                                                                                                                                                var $1358 = self.nam;
                                                                                                                                                                                                                                var $1359 = self.ini;
                                                                                                                                                                                                                                var $1360 = self.idx;
                                                                                                                                                                                                                                var $1361 = self.str;
                                                                                                                                                                                                                                var _reply$pst$128 = Parser$State$new$(Parser$Error$maybe_combine$($1348, $1357), $1358, $1359, $1360, $1361);
                                                                                                                                                                                                                                var self = _reply$pst$128;
                                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                                                        var $1363 = self.err;
                                                                                                                                                                                                                                        var _reply$134 = Litereum$parse$term$(_world$1)(_reply$pst$128);
                                                                                                                                                                                                                                        var self = _reply$134;
                                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                                                                                                                var $1365 = self.err;
                                                                                                                                                                                                                                                var self = $1363;
                                                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                                                                                                                        var $1367 = self.value;
                                                                                                                                                                                                                                                        var $1368 = Parser$Reply$error$(Parser$Error$combine$($1367, $1365));
                                                                                                                                                                                                                                                        var $1366 = $1368;
                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                                                                                                                        var $1369 = Parser$Reply$error$($1365);
                                                                                                                                                                                                                                                        var $1366 = $1369;
                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                var $1364 = $1366;
                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                                                                                                                var $1370 = self.pst;
                                                                                                                                                                                                                                                var $1371 = self.val;
                                                                                                                                                                                                                                                var self = $1370;
                                                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                                                                        var $1373 = self.err;
                                                                                                                                                                                                                                                        var $1374 = self.nam;
                                                                                                                                                                                                                                                        var $1375 = self.ini;
                                                                                                                                                                                                                                                        var $1376 = self.idx;
                                                                                                                                                                                                                                                        var $1377 = self.str;
                                                                                                                                                                                                                                                        var _reply$pst$142 = Parser$State$new$(Parser$Error$maybe_combine$($1363, $1373), $1374, $1375, $1376, $1377);
                                                                                                                                                                                                                                                        var self = _reply$pst$142;
                                                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                                                                                                var $1379 = self.err;
                                                                                                                                                                                                                                                                var _reply$148 = Litereum$parse$text$("}", _reply$pst$142);
                                                                                                                                                                                                                                                                var self = _reply$148;
                                                                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                                                                                                                        var $1381 = self.err;
                                                                                                                                                                                                                                                                        var self = $1379;
                                                                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                                                                                                                var $1383 = self.value;
                                                                                                                                                                                                                                                                                var $1384 = Parser$Reply$error$(Parser$Error$combine$($1383, $1381));
                                                                                                                                                                                                                                                                                var $1382 = $1384;
                                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                                                                                                                var $1385 = Parser$Reply$error$($1381);
                                                                                                                                                                                                                                                                                var $1382 = $1385;
                                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                                                        var $1380 = $1382;
                                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                                                                                                                        var $1386 = self.pst;
                                                                                                                                                                                                                                                                        var self = $1386;
                                                                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                                                                                                                var $1388 = self.err;
                                                                                                                                                                                                                                                                                var $1389 = self.nam;
                                                                                                                                                                                                                                                                                var $1390 = self.ini;
                                                                                                                                                                                                                                                                                var $1391 = self.idx;
                                                                                                                                                                                                                                                                                var $1392 = self.str;
                                                                                                                                                                                                                                                                                var _reply$pst$156 = Parser$State$new$(Parser$Error$maybe_combine$($1379, $1388), $1389, $1390, $1391, $1392);
                                                                                                                                                                                                                                                                                var $1393 = Parser$Reply$value$(_reply$pst$156, Litereum$Term$compare$($1247, $1263, $1309, $1340, $1371));
                                                                                                                                                                                                                                                                                var $1387 = $1393;
                                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                                                        var $1380 = $1387;
                                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                                var $1378 = $1380;
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                                        var $1372 = $1378;
                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                var $1364 = $1372;
                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                        var $1362 = $1364;
                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                var $1356 = $1362;
                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                        };
                                                                                                                                                                                                                        var $1349 = $1356;
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                };
                                                                                                                                                                                                                var $1347 = $1349;
                                                                                                                                                                                                                break;
                                                                                                                                                                                                        };
                                                                                                                                                                                                        var $1341 = $1347;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $1333 = $1341;
                                                                                                                                                                                                break;
                                                                                                                                                                                        };
                                                                                                                                                                                        var $1331 = $1333;
                                                                                                                                                                                        break;
                                                                                                                                                                                };
                                                                                                                                                                                var $1325 = $1331;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $1318 = $1325;
                                                                                                                                                                        break;
                                                                                                                                                                };
                                                                                                                                                                var $1316 = $1318;
                                                                                                                                                                break;
                                                                                                                                                        };
                                                                                                                                                        var $1310 = $1316;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1302 = $1310;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $1300 = $1302;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $1294 = $1300;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1287 = $1294;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $1285 = $1287;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1279 = $1285;
                                                                                                        break;
                                                                                                };
                                                                                                var $1272 = $1279;
                                                                                                break;
                                                                                        };
                                                                                        var $1270 = $1272;
                                                                                        break;
                                                                                };
                                                                                var $1264 = $1270;
                                                                                break;
                                                                        };
                                                                        var $1256 = $1264;
                                                                        break;
                                                                };
                                                                var $1254 = $1256;
                                                                break;
                                                        };
                                                        var $1248 = $1254;
                                                        break;
                                                };
                                                var $1240 = $1248;
                                                break;
                                        };
                                        var $1238 = $1240;
                                        break;
                                };
                                var $1232 = $1238;
                                break;
                        };
                        var $1225 = $1232;
                        break;
                };
                var $1223 = $1225;
                break;
        };
        return $1223;
    };
    const Litereum$parse$term$compare = x0 => x1 => Litereum$parse$term$compare$(x0, x1);
    const Litereum$Operation$add = ({
        _: 'Litereum.Operation.add'
    });
    const Litereum$Operation$sub = ({
        _: 'Litereum.Operation.sub'
    });
    const Litereum$Operation$mul = ({
        _: 'Litereum.Operation.mul'
    });
    const Litereum$Operation$div = ({
        _: 'Litereum.Operation.div'
    });
    const Litereum$Operation$mod = ({
        _: 'Litereum.Operation.mod'
    });
    const Litereum$Operation$or = ({
        _: 'Litereum.Operation.or'
    });
    const Litereum$Operation$and = ({
        _: 'Litereum.Operation.and'
    });
    const Litereum$Operation$xor = ({
        _: 'Litereum.Operation.xor'
    });
    const Litereum$parse$term$operation = Parser$choice(List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1395 = self.err;
                var _reply$7 = Litereum$parse$text$("+", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1397 = self.err;
                        var self = $1395;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1399 = self.value;
                                var $1400 = Parser$Reply$error$(Parser$Error$combine$($1399, $1397));
                                var $1398 = $1400;
                                break;
                            case 'Maybe.none':
                                var $1401 = Parser$Reply$error$($1397);
                                var $1398 = $1401;
                                break;
                        };
                        var $1396 = $1398;
                        break;
                    case 'Parser.Reply.value':
                        var $1402 = self.pst;
                        var self = $1402;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1404 = self.err;
                                var $1405 = self.nam;
                                var $1406 = self.ini;
                                var $1407 = self.idx;
                                var $1408 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1395, $1404), $1405, $1406, $1407, $1408);
                                var $1409 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$add));
                                var $1403 = $1409;
                                break;
                        };
                        var $1396 = $1403;
                        break;
                };
                var $1394 = $1396;
                break;
        };
        return $1394;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1411 = self.err;
                var _reply$7 = Litereum$parse$text$("-", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1413 = self.err;
                        var self = $1411;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1415 = self.value;
                                var $1416 = Parser$Reply$error$(Parser$Error$combine$($1415, $1413));
                                var $1414 = $1416;
                                break;
                            case 'Maybe.none':
                                var $1417 = Parser$Reply$error$($1413);
                                var $1414 = $1417;
                                break;
                        };
                        var $1412 = $1414;
                        break;
                    case 'Parser.Reply.value':
                        var $1418 = self.pst;
                        var self = $1418;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1420 = self.err;
                                var $1421 = self.nam;
                                var $1422 = self.ini;
                                var $1423 = self.idx;
                                var $1424 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1411, $1420), $1421, $1422, $1423, $1424);
                                var $1425 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$sub));
                                var $1419 = $1425;
                                break;
                        };
                        var $1412 = $1419;
                        break;
                };
                var $1410 = $1412;
                break;
        };
        return $1410;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1427 = self.err;
                var _reply$7 = Litereum$parse$text$("*", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1429 = self.err;
                        var self = $1427;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1431 = self.value;
                                var $1432 = Parser$Reply$error$(Parser$Error$combine$($1431, $1429));
                                var $1430 = $1432;
                                break;
                            case 'Maybe.none':
                                var $1433 = Parser$Reply$error$($1429);
                                var $1430 = $1433;
                                break;
                        };
                        var $1428 = $1430;
                        break;
                    case 'Parser.Reply.value':
                        var $1434 = self.pst;
                        var self = $1434;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1436 = self.err;
                                var $1437 = self.nam;
                                var $1438 = self.ini;
                                var $1439 = self.idx;
                                var $1440 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1427, $1436), $1437, $1438, $1439, $1440);
                                var $1441 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$mul));
                                var $1435 = $1441;
                                break;
                        };
                        var $1428 = $1435;
                        break;
                };
                var $1426 = $1428;
                break;
        };
        return $1426;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1443 = self.err;
                var _reply$7 = Litereum$parse$text$("/", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1445 = self.err;
                        var self = $1443;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1447 = self.value;
                                var $1448 = Parser$Reply$error$(Parser$Error$combine$($1447, $1445));
                                var $1446 = $1448;
                                break;
                            case 'Maybe.none':
                                var $1449 = Parser$Reply$error$($1445);
                                var $1446 = $1449;
                                break;
                        };
                        var $1444 = $1446;
                        break;
                    case 'Parser.Reply.value':
                        var $1450 = self.pst;
                        var self = $1450;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1452 = self.err;
                                var $1453 = self.nam;
                                var $1454 = self.ini;
                                var $1455 = self.idx;
                                var $1456 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1443, $1452), $1453, $1454, $1455, $1456);
                                var $1457 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$div));
                                var $1451 = $1457;
                                break;
                        };
                        var $1444 = $1451;
                        break;
                };
                var $1442 = $1444;
                break;
        };
        return $1442;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1459 = self.err;
                var _reply$7 = Litereum$parse$text$("%", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1461 = self.err;
                        var self = $1459;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1463 = self.value;
                                var $1464 = Parser$Reply$error$(Parser$Error$combine$($1463, $1461));
                                var $1462 = $1464;
                                break;
                            case 'Maybe.none':
                                var $1465 = Parser$Reply$error$($1461);
                                var $1462 = $1465;
                                break;
                        };
                        var $1460 = $1462;
                        break;
                    case 'Parser.Reply.value':
                        var $1466 = self.pst;
                        var self = $1466;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1468 = self.err;
                                var $1469 = self.nam;
                                var $1470 = self.ini;
                                var $1471 = self.idx;
                                var $1472 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1459, $1468), $1469, $1470, $1471, $1472);
                                var $1473 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$mod));
                                var $1467 = $1473;
                                break;
                        };
                        var $1460 = $1467;
                        break;
                };
                var $1458 = $1460;
                break;
        };
        return $1458;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1475 = self.err;
                var _reply$7 = Litereum$parse$text$("|", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1477 = self.err;
                        var self = $1475;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1479 = self.value;
                                var $1480 = Parser$Reply$error$(Parser$Error$combine$($1479, $1477));
                                var $1478 = $1480;
                                break;
                            case 'Maybe.none':
                                var $1481 = Parser$Reply$error$($1477);
                                var $1478 = $1481;
                                break;
                        };
                        var $1476 = $1478;
                        break;
                    case 'Parser.Reply.value':
                        var $1482 = self.pst;
                        var self = $1482;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1484 = self.err;
                                var $1485 = self.nam;
                                var $1486 = self.ini;
                                var $1487 = self.idx;
                                var $1488 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1475, $1484), $1485, $1486, $1487, $1488);
                                var $1489 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$or));
                                var $1483 = $1489;
                                break;
                        };
                        var $1476 = $1483;
                        break;
                };
                var $1474 = $1476;
                break;
        };
        return $1474;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1491 = self.err;
                var _reply$7 = Litereum$parse$text$("&", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1493 = self.err;
                        var self = $1491;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1495 = self.value;
                                var $1496 = Parser$Reply$error$(Parser$Error$combine$($1495, $1493));
                                var $1494 = $1496;
                                break;
                            case 'Maybe.none':
                                var $1497 = Parser$Reply$error$($1493);
                                var $1494 = $1497;
                                break;
                        };
                        var $1492 = $1494;
                        break;
                    case 'Parser.Reply.value':
                        var $1498 = self.pst;
                        var self = $1498;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1500 = self.err;
                                var $1501 = self.nam;
                                var $1502 = self.ini;
                                var $1503 = self.idx;
                                var $1504 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1491, $1500), $1501, $1502, $1503, $1504);
                                var $1505 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$and));
                                var $1499 = $1505;
                                break;
                        };
                        var $1492 = $1499;
                        break;
                };
                var $1490 = $1492;
                break;
        };
        return $1490;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1507 = self.err;
                var _reply$7 = Litereum$parse$text$("^", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1509 = self.err;
                        var self = $1507;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1511 = self.value;
                                var $1512 = Parser$Reply$error$(Parser$Error$combine$($1511, $1509));
                                var $1510 = $1512;
                                break;
                            case 'Maybe.none':
                                var $1513 = Parser$Reply$error$($1509);
                                var $1510 = $1513;
                                break;
                        };
                        var $1508 = $1510;
                        break;
                    case 'Parser.Reply.value':
                        var $1514 = self.pst;
                        var self = $1514;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1516 = self.err;
                                var $1517 = self.nam;
                                var $1518 = self.ini;
                                var $1519 = self.idx;
                                var $1520 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1507, $1516), $1517, $1518, $1519, $1520);
                                var $1521 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$xor));
                                var $1515 = $1521;
                                break;
                        };
                        var $1508 = $1515;
                        break;
                };
                var $1506 = $1508;
                break;
        };
        return $1506;
    }), List$cons$((_pst$1 => {
        var $1522 = Parser$Reply$value$(_pst$1, Maybe$none);
        return $1522;
    }), List$nil))))))))));

    function Litereum$Term$operate$(_oper$1, _val0$2, _val1$3) {
        var $1523 = ({
            _: 'Litereum.Term.operate',
            'oper': _oper$1,
            'val0': _val0$2,
            'val1': _val1$3
        });
        return $1523;
    };
    const Litereum$Term$operate = x0 => x1 => x2 => Litereum$Term$operate$(x0, x1, x2);

    function Litereum$parse$term$operate$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1525 = self.err;
                var _reply$8 = Litereum$parse$term$operation(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1527 = self.err;
                        var self = $1525;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1529 = self.value;
                                var $1530 = Parser$Reply$error$(Parser$Error$combine$($1529, $1527));
                                var $1528 = $1530;
                                break;
                            case 'Maybe.none':
                                var $1531 = Parser$Reply$error$($1527);
                                var $1528 = $1531;
                                break;
                        };
                        var $1526 = $1528;
                        break;
                    case 'Parser.Reply.value':
                        var $1532 = self.pst;
                        var $1533 = self.val;
                        var self = $1532;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1535 = self.err;
                                var $1536 = self.nam;
                                var $1537 = self.ini;
                                var $1538 = self.idx;
                                var $1539 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1525, $1535), $1536, $1537, $1538, $1539);
                                var self = $1533;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $1541 = self.value;
                                        var $1542 = (_pst$18 => {
                                            var self = _pst$18;
                                            switch (self._) {
                                                case 'Parser.State.new':
                                                    var $1544 = self.err;
                                                    var _reply$24 = Litereum$parse$text$("(", _pst$18);
                                                    var self = _reply$24;
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $1546 = self.err;
                                                            var self = $1544;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $1548 = self.value;
                                                                    var $1549 = Parser$Reply$error$(Parser$Error$combine$($1548, $1546));
                                                                    var $1547 = $1549;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $1550 = Parser$Reply$error$($1546);
                                                                    var $1547 = $1550;
                                                                    break;
                                                            };
                                                            var $1545 = $1547;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $1551 = self.pst;
                                                            var self = $1551;
                                                            switch (self._) {
                                                                case 'Parser.State.new':
                                                                    var $1553 = self.err;
                                                                    var $1554 = self.nam;
                                                                    var $1555 = self.ini;
                                                                    var $1556 = self.idx;
                                                                    var $1557 = self.str;
                                                                    var _reply$pst$32 = Parser$State$new$(Parser$Error$maybe_combine$($1544, $1553), $1554, $1555, $1556, $1557);
                                                                    var self = _reply$pst$32;
                                                                    switch (self._) {
                                                                        case 'Parser.State.new':
                                                                            var $1559 = self.err;
                                                                            var _reply$38 = Litereum$parse$term$(_world$1)(_reply$pst$32);
                                                                            var self = _reply$38;
                                                                            switch (self._) {
                                                                                case 'Parser.Reply.error':
                                                                                    var $1561 = self.err;
                                                                                    var self = $1559;
                                                                                    switch (self._) {
                                                                                        case 'Maybe.some':
                                                                                            var $1563 = self.value;
                                                                                            var $1564 = Parser$Reply$error$(Parser$Error$combine$($1563, $1561));
                                                                                            var $1562 = $1564;
                                                                                            break;
                                                                                        case 'Maybe.none':
                                                                                            var $1565 = Parser$Reply$error$($1561);
                                                                                            var $1562 = $1565;
                                                                                            break;
                                                                                    };
                                                                                    var $1560 = $1562;
                                                                                    break;
                                                                                case 'Parser.Reply.value':
                                                                                    var $1566 = self.pst;
                                                                                    var $1567 = self.val;
                                                                                    var self = $1566;
                                                                                    switch (self._) {
                                                                                        case 'Parser.State.new':
                                                                                            var $1569 = self.err;
                                                                                            var $1570 = self.nam;
                                                                                            var $1571 = self.ini;
                                                                                            var $1572 = self.idx;
                                                                                            var $1573 = self.str;
                                                                                            var _reply$pst$46 = Parser$State$new$(Parser$Error$maybe_combine$($1559, $1569), $1570, $1571, $1572, $1573);
                                                                                            var self = _reply$pst$46;
                                                                                            switch (self._) {
                                                                                                case 'Parser.State.new':
                                                                                                    var $1575 = self.err;
                                                                                                    var _reply$52 = Parser$maybe$(Litereum$parse$text(","), _reply$pst$46);
                                                                                                    var self = _reply$52;
                                                                                                    switch (self._) {
                                                                                                        case 'Parser.Reply.error':
                                                                                                            var $1577 = self.err;
                                                                                                            var self = $1575;
                                                                                                            switch (self._) {
                                                                                                                case 'Maybe.some':
                                                                                                                    var $1579 = self.value;
                                                                                                                    var $1580 = Parser$Reply$error$(Parser$Error$combine$($1579, $1577));
                                                                                                                    var $1578 = $1580;
                                                                                                                    break;
                                                                                                                case 'Maybe.none':
                                                                                                                    var $1581 = Parser$Reply$error$($1577);
                                                                                                                    var $1578 = $1581;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $1576 = $1578;
                                                                                                            break;
                                                                                                        case 'Parser.Reply.value':
                                                                                                            var $1582 = self.pst;
                                                                                                            var self = $1582;
                                                                                                            switch (self._) {
                                                                                                                case 'Parser.State.new':
                                                                                                                    var $1584 = self.err;
                                                                                                                    var $1585 = self.nam;
                                                                                                                    var $1586 = self.ini;
                                                                                                                    var $1587 = self.idx;
                                                                                                                    var $1588 = self.str;
                                                                                                                    var _reply$pst$60 = Parser$State$new$(Parser$Error$maybe_combine$($1575, $1584), $1585, $1586, $1587, $1588);
                                                                                                                    var self = _reply$pst$60;
                                                                                                                    switch (self._) {
                                                                                                                        case 'Parser.State.new':
                                                                                                                            var $1590 = self.err;
                                                                                                                            var _reply$66 = Litereum$parse$term$(_world$1)(_reply$pst$60);
                                                                                                                            var self = _reply$66;
                                                                                                                            switch (self._) {
                                                                                                                                case 'Parser.Reply.error':
                                                                                                                                    var $1592 = self.err;
                                                                                                                                    var self = $1590;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Maybe.some':
                                                                                                                                            var $1594 = self.value;
                                                                                                                                            var $1595 = Parser$Reply$error$(Parser$Error$combine$($1594, $1592));
                                                                                                                                            var $1593 = $1595;
                                                                                                                                            break;
                                                                                                                                        case 'Maybe.none':
                                                                                                                                            var $1596 = Parser$Reply$error$($1592);
                                                                                                                                            var $1593 = $1596;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1591 = $1593;
                                                                                                                                    break;
                                                                                                                                case 'Parser.Reply.value':
                                                                                                                                    var $1597 = self.pst;
                                                                                                                                    var $1598 = self.val;
                                                                                                                                    var self = $1597;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Parser.State.new':
                                                                                                                                            var $1600 = self.err;
                                                                                                                                            var $1601 = self.nam;
                                                                                                                                            var $1602 = self.ini;
                                                                                                                                            var $1603 = self.idx;
                                                                                                                                            var $1604 = self.str;
                                                                                                                                            var _reply$pst$74 = Parser$State$new$(Parser$Error$maybe_combine$($1590, $1600), $1601, $1602, $1603, $1604);
                                                                                                                                            var self = _reply$pst$74;
                                                                                                                                            switch (self._) {
                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                    var $1606 = self.err;
                                                                                                                                                    var _reply$80 = Litereum$parse$text$(")", _reply$pst$74);
                                                                                                                                                    var self = _reply$80;
                                                                                                                                                    switch (self._) {
                                                                                                                                                        case 'Parser.Reply.error':
                                                                                                                                                            var $1608 = self.err;
                                                                                                                                                            var self = $1606;
                                                                                                                                                            switch (self._) {
                                                                                                                                                                case 'Maybe.some':
                                                                                                                                                                    var $1610 = self.value;
                                                                                                                                                                    var $1611 = Parser$Reply$error$(Parser$Error$combine$($1610, $1608));
                                                                                                                                                                    var $1609 = $1611;
                                                                                                                                                                    break;
                                                                                                                                                                case 'Maybe.none':
                                                                                                                                                                    var $1612 = Parser$Reply$error$($1608);
                                                                                                                                                                    var $1609 = $1612;
                                                                                                                                                                    break;
                                                                                                                                                            };
                                                                                                                                                            var $1607 = $1609;
                                                                                                                                                            break;
                                                                                                                                                        case 'Parser.Reply.value':
                                                                                                                                                            var $1613 = self.pst;
                                                                                                                                                            var self = $1613;
                                                                                                                                                            switch (self._) {
                                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                                    var $1615 = self.err;
                                                                                                                                                                    var $1616 = self.nam;
                                                                                                                                                                    var $1617 = self.ini;
                                                                                                                                                                    var $1618 = self.idx;
                                                                                                                                                                    var $1619 = self.str;
                                                                                                                                                                    var _reply$pst$88 = Parser$State$new$(Parser$Error$maybe_combine$($1606, $1615), $1616, $1617, $1618, $1619);
                                                                                                                                                                    var $1620 = Parser$Reply$value$(_reply$pst$88, Litereum$Term$operate$($1541, $1567, $1598));
                                                                                                                                                                    var $1614 = $1620;
                                                                                                                                                                    break;
                                                                                                                                                            };
                                                                                                                                                            var $1607 = $1614;
                                                                                                                                                            break;
                                                                                                                                                    };
                                                                                                                                                    var $1605 = $1607;
                                                                                                                                                    break;
                                                                                                                                            };
                                                                                                                                            var $1599 = $1605;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1591 = $1599;
                                                                                                                                    break;
                                                                                                                            };
                                                                                                                            var $1589 = $1591;
                                                                                                                            break;
                                                                                                                    };
                                                                                                                    var $1583 = $1589;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $1576 = $1583;
                                                                                                            break;
                                                                                                    };
                                                                                                    var $1574 = $1576;
                                                                                                    break;
                                                                                            };
                                                                                            var $1568 = $1574;
                                                                                            break;
                                                                                    };
                                                                                    var $1560 = $1568;
                                                                                    break;
                                                                            };
                                                                            var $1558 = $1560;
                                                                            break;
                                                                    };
                                                                    var $1552 = $1558;
                                                                    break;
                                                            };
                                                            var $1545 = $1552;
                                                            break;
                                                    };
                                                    var $1543 = $1545;
                                                    break;
                                            };
                                            return $1543;
                                        });
                                        var $1540 = $1542;
                                        break;
                                    case 'Maybe.none':
                                        var $1621 = Parser$fail("Not an operation.");
                                        var $1540 = $1621;
                                        break;
                                };
                                var $1540 = $1540(_reply$pst$16);
                                var $1534 = $1540;
                                break;
                        };
                        var $1526 = $1534;
                        break;
                };
                var $1524 = $1526;
                break;
        };
        return $1524;
    };
    const Litereum$parse$term$operate = x0 => x1 => Litereum$parse$term$operate$(x0, x1);

    function Litereum$Term$bind$(_name$1, _main$2, _body$3) {
        var $1622 = ({
            _: 'Litereum.Term.bind',
            'name': _name$1,
            'main': _main$2,
            'body': _body$3
        });
        return $1622;
    };
    const Litereum$Term$bind = x0 => x1 => x2 => Litereum$Term$bind$(x0, x1, x2);

    function Litereum$parse$term$bind$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1624 = self.err;
                var _reply$8 = Litereum$parse$text$("bind", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1626 = self.err;
                        var self = $1624;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1628 = self.value;
                                var $1629 = Parser$Reply$error$(Parser$Error$combine$($1628, $1626));
                                var $1627 = $1629;
                                break;
                            case 'Maybe.none':
                                var $1630 = Parser$Reply$error$($1626);
                                var $1627 = $1630;
                                break;
                        };
                        var $1625 = $1627;
                        break;
                    case 'Parser.Reply.value':
                        var $1631 = self.pst;
                        var self = $1631;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1633 = self.err;
                                var $1634 = self.nam;
                                var $1635 = self.ini;
                                var $1636 = self.idx;
                                var $1637 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1624, $1633), $1634, $1635, $1636, $1637);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1639 = self.err;
                                        var _reply$22 = Litereum$parse$name$(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1641 = self.err;
                                                var self = $1639;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1643 = self.value;
                                                        var $1644 = Parser$Reply$error$(Parser$Error$combine$($1643, $1641));
                                                        var $1642 = $1644;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1645 = Parser$Reply$error$($1641);
                                                        var $1642 = $1645;
                                                        break;
                                                };
                                                var $1640 = $1642;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1646 = self.pst;
                                                var $1647 = self.val;
                                                var self = $1646;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1649 = self.err;
                                                        var $1650 = self.nam;
                                                        var $1651 = self.ini;
                                                        var $1652 = self.idx;
                                                        var $1653 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1639, $1649), $1650, $1651, $1652, $1653);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $1655 = self.err;
                                                                var _reply$36 = Litereum$parse$text$("{", _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1657 = self.err;
                                                                        var self = $1655;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $1659 = self.value;
                                                                                var $1660 = Parser$Reply$error$(Parser$Error$combine$($1659, $1657));
                                                                                var $1658 = $1660;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $1661 = Parser$Reply$error$($1657);
                                                                                var $1658 = $1661;
                                                                                break;
                                                                        };
                                                                        var $1656 = $1658;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1662 = self.pst;
                                                                        var self = $1662;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $1664 = self.err;
                                                                                var $1665 = self.nam;
                                                                                var $1666 = self.ini;
                                                                                var $1667 = self.idx;
                                                                                var $1668 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($1655, $1664), $1665, $1666, $1667, $1668);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $1670 = self.err;
                                                                                        var _reply$50 = Litereum$parse$term$(_world$1)(_reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1672 = self.err;
                                                                                                var self = $1670;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $1674 = self.value;
                                                                                                        var $1675 = Parser$Reply$error$(Parser$Error$combine$($1674, $1672));
                                                                                                        var $1673 = $1675;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $1676 = Parser$Reply$error$($1672);
                                                                                                        var $1673 = $1676;
                                                                                                        break;
                                                                                                };
                                                                                                var $1671 = $1673;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1677 = self.pst;
                                                                                                var $1678 = self.val;
                                                                                                var self = $1677;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $1680 = self.err;
                                                                                                        var $1681 = self.nam;
                                                                                                        var $1682 = self.ini;
                                                                                                        var $1683 = self.idx;
                                                                                                        var $1684 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($1670, $1680), $1681, $1682, $1683, $1684);
                                                                                                        var self = _reply$pst$58;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $1686 = self.err;
                                                                                                                var _reply$64 = Litereum$parse$text$("}", _reply$pst$58);
                                                                                                                var self = _reply$64;
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $1688 = self.err;
                                                                                                                        var self = $1686;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Maybe.some':
                                                                                                                                var $1690 = self.value;
                                                                                                                                var $1691 = Parser$Reply$error$(Parser$Error$combine$($1690, $1688));
                                                                                                                                var $1689 = $1691;
                                                                                                                                break;
                                                                                                                            case 'Maybe.none':
                                                                                                                                var $1692 = Parser$Reply$error$($1688);
                                                                                                                                var $1689 = $1692;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1687 = $1689;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $1693 = self.pst;
                                                                                                                        var self = $1693;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $1695 = self.err;
                                                                                                                                var $1696 = self.nam;
                                                                                                                                var $1697 = self.ini;
                                                                                                                                var $1698 = self.idx;
                                                                                                                                var $1699 = self.str;
                                                                                                                                var _reply$pst$72 = Parser$State$new$(Parser$Error$maybe_combine$($1686, $1695), $1696, $1697, $1698, $1699);
                                                                                                                                var self = _reply$pst$72;
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.State.new':
                                                                                                                                        var $1701 = self.err;
                                                                                                                                        var _reply$78 = Litereum$parse$term$(_world$1)(_reply$pst$72);
                                                                                                                                        var self = _reply$78;
                                                                                                                                        switch (self._) {
                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                var $1703 = self.err;
                                                                                                                                                var self = $1701;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                        var $1705 = self.value;
                                                                                                                                                        var $1706 = Parser$Reply$error$(Parser$Error$combine$($1705, $1703));
                                                                                                                                                        var $1704 = $1706;
                                                                                                                                                        break;
                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                        var $1707 = Parser$Reply$error$($1703);
                                                                                                                                                        var $1704 = $1707;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1702 = $1704;
                                                                                                                                                break;
                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                var $1708 = self.pst;
                                                                                                                                                var $1709 = self.val;
                                                                                                                                                var self = $1708;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                        var $1711 = self.err;
                                                                                                                                                        var $1712 = self.nam;
                                                                                                                                                        var $1713 = self.ini;
                                                                                                                                                        var $1714 = self.idx;
                                                                                                                                                        var $1715 = self.str;
                                                                                                                                                        var _reply$pst$86 = Parser$State$new$(Parser$Error$maybe_combine$($1701, $1711), $1712, $1713, $1714, $1715);
                                                                                                                                                        var $1716 = Parser$Reply$value$(_reply$pst$86, Litereum$Term$bind$($1647, $1678, $1709));
                                                                                                                                                        var $1710 = $1716;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1702 = $1710;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $1700 = $1702;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $1694 = $1700;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1687 = $1694;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $1685 = $1687;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1679 = $1685;
                                                                                                        break;
                                                                                                };
                                                                                                var $1671 = $1679;
                                                                                                break;
                                                                                        };
                                                                                        var $1669 = $1671;
                                                                                        break;
                                                                                };
                                                                                var $1663 = $1669;
                                                                                break;
                                                                        };
                                                                        var $1656 = $1663;
                                                                        break;
                                                                };
                                                                var $1654 = $1656;
                                                                break;
                                                        };
                                                        var $1648 = $1654;
                                                        break;
                                                };
                                                var $1640 = $1648;
                                                break;
                                        };
                                        var $1638 = $1640;
                                        break;
                                };
                                var $1632 = $1638;
                                break;
                        };
                        var $1625 = $1632;
                        break;
                };
                var $1623 = $1625;
                break;
        };
        return $1623;
    };
    const Litereum$parse$term$bind = x0 => x1 => Litereum$parse$term$bind$(x0, x1);

    function Litereum$Term$call$(_bond$1, _args$2) {
        var $1717 = ({
            _: 'Litereum.Term.call',
            'bond': _bond$1,
            'args': _args$2
        });
        return $1717;
    };
    const Litereum$Term$call = x0 => x1 => Litereum$Term$call$(x0, x1);

    function Litereum$parse$term$call$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1719 = self.err;
                var _reply$8 = Litereum$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1721 = self.err;
                        var self = $1719;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1723 = self.value;
                                var $1724 = Parser$Reply$error$(Parser$Error$combine$($1723, $1721));
                                var $1722 = $1724;
                                break;
                            case 'Maybe.none':
                                var $1725 = Parser$Reply$error$($1721);
                                var $1722 = $1725;
                                break;
                        };
                        var $1720 = $1722;
                        break;
                    case 'Parser.Reply.value':
                        var $1726 = self.pst;
                        var $1727 = self.val;
                        var self = $1726;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1729 = self.err;
                                var $1730 = self.nam;
                                var $1731 = self.ini;
                                var $1732 = self.idx;
                                var $1733 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1719, $1729), $1730, $1731, $1732, $1733);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1735 = self.err;
                                        var _reply$22 = Parser$wrap$(Litereum$parse$text("("), (_pst$22 => {
                                            var self = _pst$22;
                                            switch (self._) {
                                                case 'Parser.State.new':
                                                    var $1738 = self.err;
                                                    var _reply$28 = Parser$maybe$(Litereum$parse$text(","), _pst$22);
                                                    var self = _reply$28;
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $1740 = self.err;
                                                            var self = $1738;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $1742 = self.value;
                                                                    var $1743 = Parser$Reply$error$(Parser$Error$combine$($1742, $1740));
                                                                    var $1741 = $1743;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $1744 = Parser$Reply$error$($1740);
                                                                    var $1741 = $1744;
                                                                    break;
                                                            };
                                                            var $1739 = $1741;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $1745 = self.pst;
                                                            var self = $1745;
                                                            switch (self._) {
                                                                case 'Parser.State.new':
                                                                    var $1747 = self.err;
                                                                    var $1748 = self.nam;
                                                                    var $1749 = self.ini;
                                                                    var $1750 = self.idx;
                                                                    var $1751 = self.str;
                                                                    var _reply$pst$36 = Parser$State$new$(Parser$Error$maybe_combine$($1738, $1747), $1748, $1749, $1750, $1751);
                                                                    var $1752 = Litereum$parse$term$(_world$1)(_reply$pst$36);
                                                                    var $1746 = $1752;
                                                                    break;
                                                            };
                                                            var $1739 = $1746;
                                                            break;
                                                    };
                                                    var $1737 = $1739;
                                                    break;
                                            };
                                            return $1737;
                                        }), Litereum$parse$text(")"), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1753 = self.err;
                                                var self = $1735;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1755 = self.value;
                                                        var $1756 = Parser$Reply$error$(Parser$Error$combine$($1755, $1753));
                                                        var $1754 = $1756;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1757 = Parser$Reply$error$($1753);
                                                        var $1754 = $1757;
                                                        break;
                                                };
                                                var $1736 = $1754;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1758 = self.pst;
                                                var $1759 = self.val;
                                                var self = $1758;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1761 = self.err;
                                                        var $1762 = self.nam;
                                                        var $1763 = self.ini;
                                                        var $1764 = self.idx;
                                                        var $1765 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1735, $1761), $1762, $1763, $1764, $1765);
                                                        var $1766 = Parser$Reply$value$(_reply$pst$30, Litereum$Term$call$($1727, $1759));
                                                        var $1760 = $1766;
                                                        break;
                                                };
                                                var $1736 = $1760;
                                                break;
                                        };
                                        var $1734 = $1736;
                                        break;
                                };
                                var $1728 = $1734;
                                break;
                        };
                        var $1720 = $1728;
                        break;
                };
                var $1718 = $1720;
                break;
        };
        return $1718;
    };
    const Litereum$parse$term$call = x0 => x1 => Litereum$parse$term$call$(x0, x1);

    function Litereum$Term$var$(_name$1) {
        var $1767 = ({
            _: 'Litereum.Term.var',
            'name': _name$1
        });
        return $1767;
    };
    const Litereum$Term$var = x0 => Litereum$Term$var$(x0);

    function Litereum$parse$term$var$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1769 = self.err;
                var _reply$8 = Litereum$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1771 = self.err;
                        var self = $1769;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1773 = self.value;
                                var $1774 = Parser$Reply$error$(Parser$Error$combine$($1773, $1771));
                                var $1772 = $1774;
                                break;
                            case 'Maybe.none':
                                var $1775 = Parser$Reply$error$($1771);
                                var $1772 = $1775;
                                break;
                        };
                        var $1770 = $1772;
                        break;
                    case 'Parser.Reply.value':
                        var $1776 = self.pst;
                        var $1777 = self.val;
                        var self = $1776;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1779 = self.err;
                                var $1780 = self.nam;
                                var $1781 = self.ini;
                                var $1782 = self.idx;
                                var $1783 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1769, $1779), $1780, $1781, $1782, $1783);
                                var $1784 = Parser$Reply$value$(_reply$pst$16, Litereum$Term$var$($1777));
                                var $1778 = $1784;
                                break;
                        };
                        var $1770 = $1778;
                        break;
                };
                var $1768 = $1770;
                break;
        };
        return $1768;
    };
    const Litereum$parse$term$var = x0 => x1 => Litereum$parse$term$var$(x0, x1);

    function Litereum$parse$term$(_world$1) {
        var $1785 = Parser$choice(List$cons$(Litereum$parse$term$let(_world$1), List$cons$(Litereum$parse$term$create(_world$1), List$cons$(Litereum$parse$term$match(_world$1), List$cons$(Litereum$parse$term$word(_world$1), List$cons$(Litereum$parse$term$compare(_world$1), List$cons$(Litereum$parse$term$operate(_world$1), List$cons$(Litereum$parse$term$bind(_world$1), List$cons$(Litereum$parse$term$call(_world$1), List$cons$(Litereum$parse$term$var(_world$1), List$nil))))))))));
        return $1785;
    };
    const Litereum$parse$term = x0 => Litereum$parse$term$(x0);

    function Litereum$Bond$new$(_name$1, _input_names$2, _input_types$3, _output_type$4, _main$5, _owners$6) {
        var $1786 = ({
            _: 'Litereum.Bond.new',
            'name': _name$1,
            'input_names': _input_names$2,
            'input_types': _input_types$3,
            'output_type': _output_type$4,
            'main': _main$5,
            'owners': _owners$6
        });
        return $1786;
    };
    const Litereum$Bond$new = x0 => x1 => x2 => x3 => x4 => x5 => Litereum$Bond$new$(x0, x1, x2, x3, x4, x5);

    function Litereum$parse$bond$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1788 = self.err;
                var _reply$8 = Litereum$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1790 = self.err;
                        var self = $1788;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1792 = self.value;
                                var $1793 = Parser$Reply$error$(Parser$Error$combine$($1792, $1790));
                                var $1791 = $1793;
                                break;
                            case 'Maybe.none':
                                var $1794 = Parser$Reply$error$($1790);
                                var $1791 = $1794;
                                break;
                        };
                        var $1789 = $1791;
                        break;
                    case 'Parser.Reply.value':
                        var $1795 = self.pst;
                        var $1796 = self.val;
                        var self = $1795;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1798 = self.err;
                                var $1799 = self.nam;
                                var $1800 = self.ini;
                                var $1801 = self.idx;
                                var $1802 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1788, $1798), $1799, $1800, $1801, $1802);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1804 = self.err;
                                        var _reply$22 = Parser$wrap$(Litereum$parse$text("("), Litereum$parse$ann(_world$1), Litereum$parse$text(")"), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1806 = self.err;
                                                var self = $1804;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1808 = self.value;
                                                        var $1809 = Parser$Reply$error$(Parser$Error$combine$($1808, $1806));
                                                        var $1807 = $1809;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1810 = Parser$Reply$error$($1806);
                                                        var $1807 = $1810;
                                                        break;
                                                };
                                                var $1805 = $1807;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1811 = self.pst;
                                                var $1812 = self.val;
                                                var self = $1811;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1814 = self.err;
                                                        var $1815 = self.nam;
                                                        var $1816 = self.ini;
                                                        var $1817 = self.idx;
                                                        var $1818 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1804, $1814), $1815, $1816, $1817, $1818);
                                                        var _iarg$31 = List$mapped$($1812, (_x$31 => {
                                                            var self = _x$31;
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $1821 = self.fst;
                                                                    var $1822 = $1821;
                                                                    var $1820 = $1822;
                                                                    break;
                                                            };
                                                            return $1820;
                                                        }));
                                                        var _ityp$32 = List$mapped$($1812, (_x$32 => {
                                                            var self = _x$32;
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $1824 = self.snd;
                                                                    var $1825 = $1824;
                                                                    var $1823 = $1825;
                                                                    break;
                                                            };
                                                            return $1823;
                                                        }));
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $1826 = self.err;
                                                                var _reply$38 = Litereum$parse$text$(":", _reply$pst$30);
                                                                var self = _reply$38;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1828 = self.err;
                                                                        var self = $1826;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $1830 = self.value;
                                                                                var $1831 = Parser$Reply$error$(Parser$Error$combine$($1830, $1828));
                                                                                var $1829 = $1831;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $1832 = Parser$Reply$error$($1828);
                                                                                var $1829 = $1832;
                                                                                break;
                                                                        };
                                                                        var $1827 = $1829;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1833 = self.pst;
                                                                        var self = $1833;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $1835 = self.err;
                                                                                var $1836 = self.nam;
                                                                                var $1837 = self.ini;
                                                                                var $1838 = self.idx;
                                                                                var $1839 = self.str;
                                                                                var _reply$pst$46 = Parser$State$new$(Parser$Error$maybe_combine$($1826, $1835), $1836, $1837, $1838, $1839);
                                                                                var self = _reply$pst$46;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $1841 = self.err;
                                                                                        var _reply$52 = Litereum$parse$type$(_world$1)(_reply$pst$46);
                                                                                        var self = _reply$52;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1843 = self.err;
                                                                                                var self = $1841;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $1845 = self.value;
                                                                                                        var $1846 = Parser$Reply$error$(Parser$Error$combine$($1845, $1843));
                                                                                                        var $1844 = $1846;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $1847 = Parser$Reply$error$($1843);
                                                                                                        var $1844 = $1847;
                                                                                                        break;
                                                                                                };
                                                                                                var $1842 = $1844;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1848 = self.pst;
                                                                                                var $1849 = self.val;
                                                                                                var self = $1848;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $1851 = self.err;
                                                                                                        var $1852 = self.nam;
                                                                                                        var $1853 = self.ini;
                                                                                                        var $1854 = self.idx;
                                                                                                        var $1855 = self.str;
                                                                                                        var _reply$pst$60 = Parser$State$new$(Parser$Error$maybe_combine$($1841, $1851), $1852, $1853, $1854, $1855);
                                                                                                        var self = _reply$pst$60;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $1857 = self.err;
                                                                                                                var _reply$66 = Litereum$parse$text$("{", _reply$pst$60);
                                                                                                                var self = _reply$66;
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $1859 = self.err;
                                                                                                                        var self = $1857;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Maybe.some':
                                                                                                                                var $1861 = self.value;
                                                                                                                                var $1862 = Parser$Reply$error$(Parser$Error$combine$($1861, $1859));
                                                                                                                                var $1860 = $1862;
                                                                                                                                break;
                                                                                                                            case 'Maybe.none':
                                                                                                                                var $1863 = Parser$Reply$error$($1859);
                                                                                                                                var $1860 = $1863;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1858 = $1860;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $1864 = self.pst;
                                                                                                                        var self = $1864;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $1866 = self.err;
                                                                                                                                var $1867 = self.nam;
                                                                                                                                var $1868 = self.ini;
                                                                                                                                var $1869 = self.idx;
                                                                                                                                var $1870 = self.str;
                                                                                                                                var _reply$pst$74 = Parser$State$new$(Parser$Error$maybe_combine$($1857, $1866), $1867, $1868, $1869, $1870);
                                                                                                                                var self = _reply$pst$74;
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.State.new':
                                                                                                                                        var $1872 = self.err;
                                                                                                                                        var _reply$80 = Litereum$parse$term$(_world$1)(_reply$pst$74);
                                                                                                                                        var self = _reply$80;
                                                                                                                                        switch (self._) {
                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                var $1874 = self.err;
                                                                                                                                                var self = $1872;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                        var $1876 = self.value;
                                                                                                                                                        var $1877 = Parser$Reply$error$(Parser$Error$combine$($1876, $1874));
                                                                                                                                                        var $1875 = $1877;
                                                                                                                                                        break;
                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                        var $1878 = Parser$Reply$error$($1874);
                                                                                                                                                        var $1875 = $1878;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1873 = $1875;
                                                                                                                                                break;
                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                var $1879 = self.pst;
                                                                                                                                                var $1880 = self.val;
                                                                                                                                                var self = $1879;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                        var $1882 = self.err;
                                                                                                                                                        var $1883 = self.nam;
                                                                                                                                                        var $1884 = self.ini;
                                                                                                                                                        var $1885 = self.idx;
                                                                                                                                                        var $1886 = self.str;
                                                                                                                                                        var _reply$pst$88 = Parser$State$new$(Parser$Error$maybe_combine$($1872, $1882), $1883, $1884, $1885, $1886);
                                                                                                                                                        var self = _reply$pst$88;
                                                                                                                                                        switch (self._) {
                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                var $1888 = self.err;
                                                                                                                                                                var _reply$94 = Litereum$parse$text$("}", _reply$pst$88);
                                                                                                                                                                var self = _reply$94;
                                                                                                                                                                switch (self._) {
                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                        var $1890 = self.err;
                                                                                                                                                                        var self = $1888;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                var $1892 = self.value;
                                                                                                                                                                                var $1893 = Parser$Reply$error$(Parser$Error$combine$($1892, $1890));
                                                                                                                                                                                var $1891 = $1893;
                                                                                                                                                                                break;
                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                var $1894 = Parser$Reply$error$($1890);
                                                                                                                                                                                var $1891 = $1894;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $1889 = $1891;
                                                                                                                                                                        break;
                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                        var $1895 = self.pst;
                                                                                                                                                                        var self = $1895;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                var $1897 = self.err;
                                                                                                                                                                                var $1898 = self.nam;
                                                                                                                                                                                var $1899 = self.ini;
                                                                                                                                                                                var $1900 = self.idx;
                                                                                                                                                                                var $1901 = self.str;
                                                                                                                                                                                var _reply$pst$102 = Parser$State$new$(Parser$Error$maybe_combine$($1888, $1897), $1898, $1899, $1900, $1901);
                                                                                                                                                                                var self = _reply$pst$102;
                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                        var $1903 = self.err;
                                                                                                                                                                                        var _reply$108 = Parser$many$((_pst$108 => {
                                                                                                                                                                                            var self = _pst$108;
                                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                                                                    var $1906 = self.err;
                                                                                                                                                                                                    var _reply$114 = Litereum$parse$text$("@", _pst$108);
                                                                                                                                                                                                    var self = _reply$114;
                                                                                                                                                                                                    switch (self._) {
                                                                                                                                                                                                        case 'Parser.Reply.error':
                                                                                                                                                                                                            var $1908 = self.err;
                                                                                                                                                                                                            var self = $1906;
                                                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                                                case 'Maybe.some':
                                                                                                                                                                                                                    var $1910 = self.value;
                                                                                                                                                                                                                    var $1911 = Parser$Reply$error$(Parser$Error$combine$($1910, $1908));
                                                                                                                                                                                                                    var $1909 = $1911;
                                                                                                                                                                                                                    break;
                                                                                                                                                                                                                case 'Maybe.none':
                                                                                                                                                                                                                    var $1912 = Parser$Reply$error$($1908);
                                                                                                                                                                                                                    var $1909 = $1912;
                                                                                                                                                                                                                    break;
                                                                                                                                                                                                            };
                                                                                                                                                                                                            var $1907 = $1909;
                                                                                                                                                                                                            break;
                                                                                                                                                                                                        case 'Parser.Reply.value':
                                                                                                                                                                                                            var $1913 = self.pst;
                                                                                                                                                                                                            var self = $1913;
                                                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                                                                                    var $1915 = self.err;
                                                                                                                                                                                                                    var $1916 = self.nam;
                                                                                                                                                                                                                    var $1917 = self.ini;
                                                                                                                                                                                                                    var $1918 = self.idx;
                                                                                                                                                                                                                    var $1919 = self.str;
                                                                                                                                                                                                                    var _reply$pst$122 = Parser$State$new$(Parser$Error$maybe_combine$($1906, $1915), $1916, $1917, $1918, $1919);
                                                                                                                                                                                                                    var self = _reply$pst$122;
                                                                                                                                                                                                                    switch (self._) {
                                                                                                                                                                                                                        case 'Parser.State.new':
                                                                                                                                                                                                                            var $1921 = self.err;
                                                                                                                                                                                                                            var _reply$128 = Litereum$parse$name$(_reply$pst$122);
                                                                                                                                                                                                                            var self = _reply$128;
                                                                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                                                                case 'Parser.Reply.error':
                                                                                                                                                                                                                                    var $1923 = self.err;
                                                                                                                                                                                                                                    var self = $1921;
                                                                                                                                                                                                                                    switch (self._) {
                                                                                                                                                                                                                                        case 'Maybe.some':
                                                                                                                                                                                                                                            var $1925 = self.value;
                                                                                                                                                                                                                                            var $1926 = Parser$Reply$error$(Parser$Error$combine$($1925, $1923));
                                                                                                                                                                                                                                            var $1924 = $1926;
                                                                                                                                                                                                                                            break;
                                                                                                                                                                                                                                        case 'Maybe.none':
                                                                                                                                                                                                                                            var $1927 = Parser$Reply$error$($1923);
                                                                                                                                                                                                                                            var $1924 = $1927;
                                                                                                                                                                                                                                            break;
                                                                                                                                                                                                                                    };
                                                                                                                                                                                                                                    var $1922 = $1924;
                                                                                                                                                                                                                                    break;
                                                                                                                                                                                                                                case 'Parser.Reply.value':
                                                                                                                                                                                                                                    var $1928 = self.pst;
                                                                                                                                                                                                                                    var $1929 = self.val;
                                                                                                                                                                                                                                    var self = $1928;
                                                                                                                                                                                                                                    switch (self._) {
                                                                                                                                                                                                                                        case 'Parser.State.new':
                                                                                                                                                                                                                                            var $1931 = self.err;
                                                                                                                                                                                                                                            var $1932 = self.nam;
                                                                                                                                                                                                                                            var $1933 = self.ini;
                                                                                                                                                                                                                                            var $1934 = self.idx;
                                                                                                                                                                                                                                            var $1935 = self.str;
                                                                                                                                                                                                                                            var _reply$pst$136 = Parser$State$new$(Parser$Error$maybe_combine$($1921, $1931), $1932, $1933, $1934, $1935);
                                                                                                                                                                                                                                            var $1936 = Parser$Reply$value$(_reply$pst$136, $1929);
                                                                                                                                                                                                                                            var $1930 = $1936;
                                                                                                                                                                                                                                            break;
                                                                                                                                                                                                                                    };
                                                                                                                                                                                                                                    var $1922 = $1930;
                                                                                                                                                                                                                                    break;
                                                                                                                                                                                                                            };
                                                                                                                                                                                                                            var $1920 = $1922;
                                                                                                                                                                                                                            break;
                                                                                                                                                                                                                    };
                                                                                                                                                                                                                    var $1914 = $1920;
                                                                                                                                                                                                                    break;
                                                                                                                                                                                                            };
                                                                                                                                                                                                            var $1907 = $1914;
                                                                                                                                                                                                            break;
                                                                                                                                                                                                    };
                                                                                                                                                                                                    var $1905 = $1907;
                                                                                                                                                                                                    break;
                                                                                                                                                                                            };
                                                                                                                                                                                            return $1905;
                                                                                                                                                                                        }))(_reply$pst$102);
                                                                                                                                                                                        var self = _reply$108;
                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                                                                var $1937 = self.err;
                                                                                                                                                                                                var self = $1903;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                                                                        var $1939 = self.value;
                                                                                                                                                                                                        var $1940 = Parser$Reply$error$(Parser$Error$combine$($1939, $1937));
                                                                                                                                                                                                        var $1938 = $1940;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                                                                        var $1941 = Parser$Reply$error$($1937);
                                                                                                                                                                                                        var $1938 = $1941;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $1904 = $1938;
                                                                                                                                                                                                break;
                                                                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                                                                var $1942 = self.pst;
                                                                                                                                                                                                var $1943 = self.val;
                                                                                                                                                                                                var self = $1942;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                        var $1945 = self.err;
                                                                                                                                                                                                        var $1946 = self.nam;
                                                                                                                                                                                                        var $1947 = self.ini;
                                                                                                                                                                                                        var $1948 = self.idx;
                                                                                                                                                                                                        var $1949 = self.str;
                                                                                                                                                                                                        var _reply$pst$116 = Parser$State$new$(Parser$Error$maybe_combine$($1903, $1945), $1946, $1947, $1948, $1949);
                                                                                                                                                                                                        var $1950 = Parser$Reply$value$(_reply$pst$116, Litereum$Bond$new$($1796, _iarg$31, _ityp$32, $1849, $1880, $1943));
                                                                                                                                                                                                        var $1944 = $1950;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $1904 = $1944;
                                                                                                                                                                                                break;
                                                                                                                                                                                        };
                                                                                                                                                                                        var $1902 = $1904;
                                                                                                                                                                                        break;
                                                                                                                                                                                };
                                                                                                                                                                                var $1896 = $1902;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $1889 = $1896;
                                                                                                                                                                        break;
                                                                                                                                                                };
                                                                                                                                                                var $1887 = $1889;
                                                                                                                                                                break;
                                                                                                                                                        };
                                                                                                                                                        var $1881 = $1887;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1873 = $1881;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $1871 = $1873;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $1865 = $1871;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1858 = $1865;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $1856 = $1858;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1850 = $1856;
                                                                                                        break;
                                                                                                };
                                                                                                var $1842 = $1850;
                                                                                                break;
                                                                                        };
                                                                                        var $1840 = $1842;
                                                                                        break;
                                                                                };
                                                                                var $1834 = $1840;
                                                                                break;
                                                                        };
                                                                        var $1827 = $1834;
                                                                        break;
                                                                };
                                                                var $1819 = $1827;
                                                                break;
                                                        };
                                                        var $1813 = $1819;
                                                        break;
                                                };
                                                var $1805 = $1813;
                                                break;
                                        };
                                        var $1803 = $1805;
                                        break;
                                };
                                var $1797 = $1803;
                                break;
                        };
                        var $1789 = $1797;
                        break;
                };
                var $1787 = $1789;
                break;
        };
        return $1787;
    };
    const Litereum$parse$bond = x0 => x1 => Litereum$parse$bond$(x0, x1);

    function Litereum$Transaction$new_bond$(_bond$1) {
        var $1951 = ({
            _: 'Litereum.Transaction.new_bond',
            'bond': _bond$1
        });
        return $1951;
    };
    const Litereum$Transaction$new_bond = x0 => Litereum$Transaction$new_bond$(x0);

    function Litereum$Eval$new$(_term$1, _type$2) {
        var $1952 = ({
            _: 'Litereum.Eval.new',
            'term': _term$1,
            'type': _type$2
        });
        return $1952;
    };
    const Litereum$Eval$new = x0 => x1 => Litereum$Eval$new$(x0, x1);

    function Litereum$parse$eval$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1954 = self.err;
                var _reply$8 = Litereum$parse$text$("{", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1956 = self.err;
                        var self = $1954;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1958 = self.value;
                                var $1959 = Parser$Reply$error$(Parser$Error$combine$($1958, $1956));
                                var $1957 = $1959;
                                break;
                            case 'Maybe.none':
                                var $1960 = Parser$Reply$error$($1956);
                                var $1957 = $1960;
                                break;
                        };
                        var $1955 = $1957;
                        break;
                    case 'Parser.Reply.value':
                        var $1961 = self.pst;
                        var self = $1961;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1963 = self.err;
                                var $1964 = self.nam;
                                var $1965 = self.ini;
                                var $1966 = self.idx;
                                var $1967 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1954, $1963), $1964, $1965, $1966, $1967);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1969 = self.err;
                                        var _reply$22 = Litereum$parse$term$(_world$1)(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1971 = self.err;
                                                var self = $1969;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1973 = self.value;
                                                        var $1974 = Parser$Reply$error$(Parser$Error$combine$($1973, $1971));
                                                        var $1972 = $1974;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1975 = Parser$Reply$error$($1971);
                                                        var $1972 = $1975;
                                                        break;
                                                };
                                                var $1970 = $1972;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1976 = self.pst;
                                                var $1977 = self.val;
                                                var self = $1976;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1979 = self.err;
                                                        var $1980 = self.nam;
                                                        var $1981 = self.ini;
                                                        var $1982 = self.idx;
                                                        var $1983 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1969, $1979), $1980, $1981, $1982, $1983);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $1985 = self.err;
                                                                var _reply$36 = Litereum$parse$text$("}", _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1987 = self.err;
                                                                        var self = $1985;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $1989 = self.value;
                                                                                var $1990 = Parser$Reply$error$(Parser$Error$combine$($1989, $1987));
                                                                                var $1988 = $1990;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $1991 = Parser$Reply$error$($1987);
                                                                                var $1988 = $1991;
                                                                                break;
                                                                        };
                                                                        var $1986 = $1988;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1992 = self.pst;
                                                                        var self = $1992;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $1994 = self.err;
                                                                                var $1995 = self.nam;
                                                                                var $1996 = self.ini;
                                                                                var $1997 = self.idx;
                                                                                var $1998 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($1985, $1994), $1995, $1996, $1997, $1998);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $2000 = self.err;
                                                                                        var _reply$50 = Litereum$parse$text$(":", _reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $2002 = self.err;
                                                                                                var self = $2000;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $2004 = self.value;
                                                                                                        var $2005 = Parser$Reply$error$(Parser$Error$combine$($2004, $2002));
                                                                                                        var $2003 = $2005;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $2006 = Parser$Reply$error$($2002);
                                                                                                        var $2003 = $2006;
                                                                                                        break;
                                                                                                };
                                                                                                var $2001 = $2003;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $2007 = self.pst;
                                                                                                var self = $2007;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $2009 = self.err;
                                                                                                        var $2010 = self.nam;
                                                                                                        var $2011 = self.ini;
                                                                                                        var $2012 = self.idx;
                                                                                                        var $2013 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($2000, $2009), $2010, $2011, $2012, $2013);
                                                                                                        var self = _reply$pst$58;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $2015 = self.err;
                                                                                                                var _reply$64 = Litereum$parse$type$(_world$1)(_reply$pst$58);
                                                                                                                var self = _reply$64;
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $2017 = self.err;
                                                                                                                        var self = $2015;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Maybe.some':
                                                                                                                                var $2019 = self.value;
                                                                                                                                var $2020 = Parser$Reply$error$(Parser$Error$combine$($2019, $2017));
                                                                                                                                var $2018 = $2020;
                                                                                                                                break;
                                                                                                                            case 'Maybe.none':
                                                                                                                                var $2021 = Parser$Reply$error$($2017);
                                                                                                                                var $2018 = $2021;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $2016 = $2018;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $2022 = self.pst;
                                                                                                                        var $2023 = self.val;
                                                                                                                        var self = $2022;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $2025 = self.err;
                                                                                                                                var $2026 = self.nam;
                                                                                                                                var $2027 = self.ini;
                                                                                                                                var $2028 = self.idx;
                                                                                                                                var $2029 = self.str;
                                                                                                                                var _reply$pst$72 = Parser$State$new$(Parser$Error$maybe_combine$($2015, $2025), $2026, $2027, $2028, $2029);
                                                                                                                                var $2030 = Parser$Reply$value$(_reply$pst$72, Litereum$Eval$new$($1977, $2023));
                                                                                                                                var $2024 = $2030;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $2016 = $2024;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $2014 = $2016;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $2008 = $2014;
                                                                                                        break;
                                                                                                };
                                                                                                var $2001 = $2008;
                                                                                                break;
                                                                                        };
                                                                                        var $1999 = $2001;
                                                                                        break;
                                                                                };
                                                                                var $1993 = $1999;
                                                                                break;
                                                                        };
                                                                        var $1986 = $1993;
                                                                        break;
                                                                };
                                                                var $1984 = $1986;
                                                                break;
                                                        };
                                                        var $1978 = $1984;
                                                        break;
                                                };
                                                var $1970 = $1978;
                                                break;
                                        };
                                        var $1968 = $1970;
                                        break;
                                };
                                var $1962 = $1968;
                                break;
                        };
                        var $1955 = $1962;
                        break;
                };
                var $1953 = $1955;
                break;
        };
        return $1953;
    };
    const Litereum$parse$eval = x0 => x1 => Litereum$parse$eval$(x0, x1);

    function Litereum$Transaction$new_eval$(_eval$1) {
        var $2031 = ({
            _: 'Litereum.Transaction.new_eval',
            'eval': _eval$1
        });
        return $2031;
    };
    const Litereum$Transaction$new_eval = x0 => Litereum$Transaction$new_eval$(x0);

    function Litereum$parse$transaction$(_world$1) {
        var $2032 = Parser$choice(List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2034 = self.err;
                    var _reply$8 = Litereum$parse$text$("name", _pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2036 = self.err;
                            var self = $2034;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2038 = self.value;
                                    var $2039 = Parser$Reply$error$(Parser$Error$combine$($2038, $2036));
                                    var $2037 = $2039;
                                    break;
                                case 'Maybe.none':
                                    var $2040 = Parser$Reply$error$($2036);
                                    var $2037 = $2040;
                                    break;
                            };
                            var $2035 = $2037;
                            break;
                        case 'Parser.Reply.value':
                            var $2041 = self.pst;
                            var self = $2041;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2043 = self.err;
                                    var $2044 = self.nam;
                                    var $2045 = self.ini;
                                    var $2046 = self.idx;
                                    var $2047 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2034, $2043), $2044, $2045, $2046, $2047);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $2049 = self.err;
                                            var _reply$22 = Litereum$parse$name$(_reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2051 = self.err;
                                                    var self = $2049;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $2053 = self.value;
                                                            var $2054 = Parser$Reply$error$(Parser$Error$combine$($2053, $2051));
                                                            var $2052 = $2054;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $2055 = Parser$Reply$error$($2051);
                                                            var $2052 = $2055;
                                                            break;
                                                    };
                                                    var $2050 = $2052;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2056 = self.pst;
                                                    var $2057 = self.val;
                                                    var self = $2056;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $2059 = self.err;
                                                            var $2060 = self.nam;
                                                            var $2061 = self.ini;
                                                            var $2062 = self.idx;
                                                            var $2063 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2049, $2059), $2060, $2061, $2062, $2063);
                                                            var $2064 = Parser$Reply$value$(_reply$pst$30, Litereum$Transaction$new_name$($2057));
                                                            var $2058 = $2064;
                                                            break;
                                                    };
                                                    var $2050 = $2058;
                                                    break;
                                            };
                                            var $2048 = $2050;
                                            break;
                                    };
                                    var $2042 = $2048;
                                    break;
                            };
                            var $2035 = $2042;
                            break;
                    };
                    var $2033 = $2035;
                    break;
            };
            return $2033;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2066 = self.err;
                    var _reply$8 = Litereum$parse$text$("type", _pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2068 = self.err;
                            var self = $2066;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2070 = self.value;
                                    var $2071 = Parser$Reply$error$(Parser$Error$combine$($2070, $2068));
                                    var $2069 = $2071;
                                    break;
                                case 'Maybe.none':
                                    var $2072 = Parser$Reply$error$($2068);
                                    var $2069 = $2072;
                                    break;
                            };
                            var $2067 = $2069;
                            break;
                        case 'Parser.Reply.value':
                            var $2073 = self.pst;
                            var self = $2073;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2075 = self.err;
                                    var $2076 = self.nam;
                                    var $2077 = self.ini;
                                    var $2078 = self.idx;
                                    var $2079 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2066, $2075), $2076, $2077, $2078, $2079);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $2081 = self.err;
                                            var _reply$22 = Litereum$parse$data$(_world$1, _reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2083 = self.err;
                                                    var self = $2081;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $2085 = self.value;
                                                            var $2086 = Parser$Reply$error$(Parser$Error$combine$($2085, $2083));
                                                            var $2084 = $2086;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $2087 = Parser$Reply$error$($2083);
                                                            var $2084 = $2087;
                                                            break;
                                                    };
                                                    var $2082 = $2084;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2088 = self.pst;
                                                    var $2089 = self.val;
                                                    var self = $2088;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $2091 = self.err;
                                                            var $2092 = self.nam;
                                                            var $2093 = self.ini;
                                                            var $2094 = self.idx;
                                                            var $2095 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2081, $2091), $2092, $2093, $2094, $2095);
                                                            var $2096 = Parser$Reply$value$(_reply$pst$30, Litereum$Transaction$new_data$($2089));
                                                            var $2090 = $2096;
                                                            break;
                                                    };
                                                    var $2082 = $2090;
                                                    break;
                                            };
                                            var $2080 = $2082;
                                            break;
                                    };
                                    var $2074 = $2080;
                                    break;
                            };
                            var $2067 = $2074;
                            break;
                    };
                    var $2065 = $2067;
                    break;
            };
            return $2065;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2098 = self.err;
                    var _reply$8 = Litereum$parse$text$("bond", _pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2100 = self.err;
                            var self = $2098;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2102 = self.value;
                                    var $2103 = Parser$Reply$error$(Parser$Error$combine$($2102, $2100));
                                    var $2101 = $2103;
                                    break;
                                case 'Maybe.none':
                                    var $2104 = Parser$Reply$error$($2100);
                                    var $2101 = $2104;
                                    break;
                            };
                            var $2099 = $2101;
                            break;
                        case 'Parser.Reply.value':
                            var $2105 = self.pst;
                            var self = $2105;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2107 = self.err;
                                    var $2108 = self.nam;
                                    var $2109 = self.ini;
                                    var $2110 = self.idx;
                                    var $2111 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2098, $2107), $2108, $2109, $2110, $2111);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $2113 = self.err;
                                            var _reply$22 = Litereum$parse$bond$(_world$1, _reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2115 = self.err;
                                                    var self = $2113;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $2117 = self.value;
                                                            var $2118 = Parser$Reply$error$(Parser$Error$combine$($2117, $2115));
                                                            var $2116 = $2118;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $2119 = Parser$Reply$error$($2115);
                                                            var $2116 = $2119;
                                                            break;
                                                    };
                                                    var $2114 = $2116;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2120 = self.pst;
                                                    var $2121 = self.val;
                                                    var self = $2120;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $2123 = self.err;
                                                            var $2124 = self.nam;
                                                            var $2125 = self.ini;
                                                            var $2126 = self.idx;
                                                            var $2127 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2113, $2123), $2124, $2125, $2126, $2127);
                                                            var $2128 = Parser$Reply$value$(_reply$pst$30, Litereum$Transaction$new_bond$($2121));
                                                            var $2122 = $2128;
                                                            break;
                                                    };
                                                    var $2114 = $2122;
                                                    break;
                                            };
                                            var $2112 = $2114;
                                            break;
                                    };
                                    var $2106 = $2112;
                                    break;
                            };
                            var $2099 = $2106;
                            break;
                    };
                    var $2097 = $2099;
                    break;
            };
            return $2097;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2130 = self.err;
                    var _reply$8 = Litereum$parse$text$("eval", _pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2132 = self.err;
                            var self = $2130;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2134 = self.value;
                                    var $2135 = Parser$Reply$error$(Parser$Error$combine$($2134, $2132));
                                    var $2133 = $2135;
                                    break;
                                case 'Maybe.none':
                                    var $2136 = Parser$Reply$error$($2132);
                                    var $2133 = $2136;
                                    break;
                            };
                            var $2131 = $2133;
                            break;
                        case 'Parser.Reply.value':
                            var $2137 = self.pst;
                            var self = $2137;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2139 = self.err;
                                    var $2140 = self.nam;
                                    var $2141 = self.ini;
                                    var $2142 = self.idx;
                                    var $2143 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2130, $2139), $2140, $2141, $2142, $2143);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $2145 = self.err;
                                            var _reply$22 = Litereum$parse$eval$(_world$1, _reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2147 = self.err;
                                                    var self = $2145;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $2149 = self.value;
                                                            var $2150 = Parser$Reply$error$(Parser$Error$combine$($2149, $2147));
                                                            var $2148 = $2150;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $2151 = Parser$Reply$error$($2147);
                                                            var $2148 = $2151;
                                                            break;
                                                    };
                                                    var $2146 = $2148;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2152 = self.pst;
                                                    var $2153 = self.val;
                                                    var self = $2152;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $2155 = self.err;
                                                            var $2156 = self.nam;
                                                            var $2157 = self.ini;
                                                            var $2158 = self.idx;
                                                            var $2159 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2145, $2155), $2156, $2157, $2158, $2159);
                                                            var $2160 = Parser$Reply$value$(_reply$pst$30, Litereum$Transaction$new_eval$($2153));
                                                            var $2154 = $2160;
                                                            break;
                                                    };
                                                    var $2146 = $2154;
                                                    break;
                                            };
                                            var $2144 = $2146;
                                            break;
                                    };
                                    var $2138 = $2144;
                                    break;
                            };
                            var $2131 = $2138;
                            break;
                    };
                    var $2129 = $2131;
                    break;
            };
            return $2129;
        }), List$nil)))));
        return $2032;
    };
    const Litereum$parse$transaction = x0 => Litereum$parse$transaction$(x0);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $2162 = self.value;
                var $2163 = $2162;
                var $2161 = $2163;
                break;
            case 'Maybe.none':
                var $2164 = _a$3;
                var $2161 = $2164;
                break;
        };
        return $2161;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Map$(_V$1) {
        var $2165 = null;
        return $2165;
    };
    const Map = x0 => Map$(x0);

    function Map$set$(_key$2, _val$3, _map$4) {
        var $2166 = BBT$insert$(String$cmp, _key$2, _val$3, _map$4);
        return $2166;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $2167 = null;
        return $2167;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $2168 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $2168;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $2169 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $2169;
    };
    const Either$right = x0 => Either$right$(x0);

    function Nat$sub_rem$(_n$1, _m$2) {
        var Nat$sub_rem$ = (_n$1, _m$2) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2]
        });
        var Nat$sub_rem = _n$1 => _m$2 => Nat$sub_rem$(_n$1, _m$2);
        var arg = [_n$1, _m$2];
        while (true) {
            let [_n$1, _m$2] = arg;
            var R = (() => {
                var self = _m$2;
                if (self === 0n) {
                    var $2170 = Either$left$(_n$1);
                    return $2170;
                } else {
                    var $2171 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $2173 = Either$right$(Nat$succ$($2171));
                        var $2172 = $2173;
                    } else {
                        var $2174 = (self - 1n);
                        var $2175 = Nat$sub_rem$($2174, $2171);
                        var $2172 = $2175;
                    };
                    return $2172;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$sub_rem = x0 => x1 => Nat$sub_rem$(x0, x1);

    function Nat$div_mod$go$(_n$1, _m$2, _d$3) {
        var Nat$div_mod$go$ = (_n$1, _m$2, _d$3) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2, _d$3]
        });
        var Nat$div_mod$go = _n$1 => _m$2 => _d$3 => Nat$div_mod$go$(_n$1, _m$2, _d$3);
        var arg = [_n$1, _m$2, _d$3];
        while (true) {
            let [_n$1, _m$2, _d$3] = arg;
            var R = (() => {
                var self = Nat$sub_rem$(_n$1, _m$2);
                switch (self._) {
                    case 'Either.left':
                        var $2176 = self.value;
                        var $2177 = Nat$div_mod$go$($2176, _m$2, Nat$succ$(_d$3));
                        return $2177;
                    case 'Either.right':
                        var $2178 = Pair$new$(_d$3, _n$1);
                        return $2178;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$div_mod$go = x0 => x1 => x2 => Nat$div_mod$go$(x0, x1, x2);
    const Nat$div_mod = a0 => a1 => (({
        _: 'Pair.new',
        'fst': a0 / a1,
        'snd': a0 % a1
    }));

    function Nat$to_base$go$(_base$1, _nat$2, _res$3) {
        var Nat$to_base$go$ = (_base$1, _nat$2, _res$3) => ({
            ctr: 'TCO',
            arg: [_base$1, _nat$2, _res$3]
        });
        var Nat$to_base$go = _base$1 => _nat$2 => _res$3 => Nat$to_base$go$(_base$1, _nat$2, _res$3);
        var arg = [_base$1, _nat$2, _res$3];
        while (true) {
            let [_base$1, _nat$2, _res$3] = arg;
            var R = (() => {
                var self = (({
                    _: 'Pair.new',
                    'fst': _nat$2 / _base$1,
                    'snd': _nat$2 % _base$1
                }));
                switch (self._) {
                    case 'Pair.new':
                        var $2179 = self.fst;
                        var $2180 = self.snd;
                        var self = $2179;
                        if (self === 0n) {
                            var $2182 = List$cons$($2180, _res$3);
                            var $2181 = $2182;
                        } else {
                            var $2183 = (self - 1n);
                            var $2184 = Nat$to_base$go$(_base$1, $2179, List$cons$($2180, _res$3));
                            var $2181 = $2184;
                        };
                        return $2181;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $2185 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $2185;
    };
    const Nat$to_base = x0 => x1 => Nat$to_base$(x0, x1);

    function Nat$mod$go$(_n$1, _m$2, _r$3) {
        var Nat$mod$go$ = (_n$1, _m$2, _r$3) => ({
            ctr: 'TCO',
            arg: [_n$1, _m$2, _r$3]
        });
        var Nat$mod$go = _n$1 => _m$2 => _r$3 => Nat$mod$go$(_n$1, _m$2, _r$3);
        var arg = [_n$1, _m$2, _r$3];
        while (true) {
            let [_n$1, _m$2, _r$3] = arg;
            var R = (() => {
                var self = _m$2;
                if (self === 0n) {
                    var $2186 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $2186;
                } else {
                    var $2187 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $2189 = _r$3;
                        var $2188 = $2189;
                    } else {
                        var $2190 = (self - 1n);
                        var $2191 = Nat$mod$go$($2190, $2187, Nat$succ$(_r$3));
                        var $2188 = $2191;
                    };
                    return $2188;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$mod$go = x0 => x1 => x2 => Nat$mod$go$(x0, x1, x2);
    const Nat$mod = a0 => a1 => (a0 % a1);
    const Nat$lte = a0 => a1 => (a0 <= a1);

    function List$at$(_index$2, _list$3) {
        var List$at$ = (_index$2, _list$3) => ({
            ctr: 'TCO',
            arg: [_index$2, _list$3]
        });
        var List$at = _index$2 => _list$3 => List$at$(_index$2, _list$3);
        var arg = [_index$2, _list$3];
        while (true) {
            let [_index$2, _list$3] = arg;
            var R = (() => {
                var self = _list$3;
                switch (self._) {
                    case 'List.cons':
                        var $2192 = self.head;
                        var $2193 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $2195 = Maybe$some$($2192);
                            var $2194 = $2195;
                        } else {
                            var $2196 = (self - 1n);
                            var $2197 = List$at$($2196, $2193);
                            var $2194 = $2197;
                        };
                        return $2194;
                    case 'List.nil':
                        var $2198 = Maybe$none;
                        return $2198;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$at = x0 => x1 => List$at$(x0, x1);

    function Nat$show_digit$(_base$1, _n$2) {
        var _m$3 = (_n$2 % _base$1);
        var _base64$4 = List$cons$(48, List$cons$(49, List$cons$(50, List$cons$(51, List$cons$(52, List$cons$(53, List$cons$(54, List$cons$(55, List$cons$(56, List$cons$(57, List$cons$(97, List$cons$(98, List$cons$(99, List$cons$(100, List$cons$(101, List$cons$(102, List$cons$(103, List$cons$(104, List$cons$(105, List$cons$(106, List$cons$(107, List$cons$(108, List$cons$(109, List$cons$(110, List$cons$(111, List$cons$(112, List$cons$(113, List$cons$(114, List$cons$(115, List$cons$(116, List$cons$(117, List$cons$(118, List$cons$(119, List$cons$(120, List$cons$(121, List$cons$(122, List$cons$(65, List$cons$(66, List$cons$(67, List$cons$(68, List$cons$(69, List$cons$(70, List$cons$(71, List$cons$(72, List$cons$(73, List$cons$(74, List$cons$(75, List$cons$(76, List$cons$(77, List$cons$(78, List$cons$(79, List$cons$(80, List$cons$(81, List$cons$(82, List$cons$(83, List$cons$(84, List$cons$(85, List$cons$(86, List$cons$(87, List$cons$(88, List$cons$(89, List$cons$(90, List$cons$(43, List$cons$(47, List$nil))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))))));
        var self = ((_base$1 > 0n) && (_base$1 <= 64n));
        if (self) {
            var self = List$at$(_m$3, _base64$4);
            switch (self._) {
                case 'Maybe.some':
                    var $2201 = self.value;
                    var $2202 = $2201;
                    var $2200 = $2202;
                    break;
                case 'Maybe.none':
                    var $2203 = 35;
                    var $2200 = $2203;
                    break;
            };
            var $2199 = $2200;
        } else {
            var $2204 = 35;
            var $2199 = $2204;
        };
        return $2199;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $2205 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $2206 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $2206;
        }));
        return $2205;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $2207 = Nat$to_string_base$(10n, _n$1);
        return $2207;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const Debug$log = a0 => a1 => ((console.log(a0), a1()));

    function Litereum$Entry$data$(_value$1) {
        var $2208 = ({
            _: 'Litereum.Entry.data',
            'value': _value$1
        });
        return $2208;
    };
    const Litereum$Entry$data = x0 => Litereum$Entry$data$(x0);

    function Litereum$Entry$bond$(_value$1) {
        var $2209 = ({
            _: 'Litereum.Entry.bond',
            'value': _value$1
        });
        return $2209;
    };
    const Litereum$Entry$bond = x0 => Litereum$Entry$bond$(x0);

    function Litereum$extend$(_map$2, _keys$3, _vals$4) {
        var Litereum$extend$ = (_map$2, _keys$3, _vals$4) => ({
            ctr: 'TCO',
            arg: [_map$2, _keys$3, _vals$4]
        });
        var Litereum$extend = _map$2 => _keys$3 => _vals$4 => Litereum$extend$(_map$2, _keys$3, _vals$4);
        var arg = [_map$2, _keys$3, _vals$4];
        while (true) {
            let [_map$2, _keys$3, _vals$4] = arg;
            var R = (() => {
                var self = _keys$3;
                switch (self._) {
                    case 'List.cons':
                        var $2210 = self.head;
                        var $2211 = self.tail;
                        var self = _vals$4;
                        switch (self._) {
                            case 'List.cons':
                                var $2213 = self.head;
                                var $2214 = self.tail;
                                var $2215 = Litereum$extend$(Map$set$($2210, $2213, _map$2), $2211, $2214);
                                var $2212 = $2215;
                                break;
                            case 'List.nil':
                                var $2216 = _map$2;
                                var $2212 = $2216;
                                break;
                        };
                        return $2212;
                    case 'List.nil':
                        var self = _vals$4;
                        switch (self._) {
                            case 'List.nil':
                            case 'List.cons':
                                var $2218 = _map$2;
                                var $2217 = $2218;
                                break;
                        };
                        return $2217;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Litereum$extend = x0 => x1 => x2 => Litereum$extend$(x0, x1, x2);
    const String$eql = a0 => a1 => (a0 === a1);

    function Litereum$equal$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Litereum.Type.data':
                var $2220 = self.name;
                var self = _b$2;
                switch (self._) {
                    case 'Litereum.Type.data':
                        var $2222 = self.name;
                        var $2223 = ($2220 === $2222);
                        var $2221 = $2223;
                        break;
                    case 'Litereum.Type.word':
                        var $2224 = Bool$false;
                        var $2221 = $2224;
                        break;
                };
                var $2219 = $2221;
                break;
            case 'Litereum.Type.word':
                var self = _b$2;
                switch (self._) {
                    case 'Litereum.Type.word':
                        var $2226 = Bool$true;
                        var $2225 = $2226;
                        break;
                    case 'Litereum.Type.data':
                        var $2227 = Bool$false;
                        var $2225 = $2227;
                        break;
                };
                var $2219 = $2225;
                break;
        };
        return $2219;
    };
    const Litereum$equal = x0 => x1 => Litereum$equal$(x0, x1);

    function Maybe$is_some$(_m$2) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $2229 = Bool$false;
                var $2228 = $2229;
                break;
            case 'Maybe.some':
                var $2230 = Bool$true;
                var $2228 = $2230;
                break;
        };
        return $2228;
    };
    const Maybe$is_some = x0 => Maybe$is_some$(x0);

    function Litereum$get_bond$(_world$1, _name$2) {
        var self = _world$1;
        switch (self._) {
            case 'Litereum.World.new':
                var $2232 = self.entry;
                var $2233 = Maybe$monad$((_m$bind$7 => _m$pure$8 => {
                    var $2234 = _m$bind$7;
                    return $2234;
                }))(Map$get$(_name$2, $2232))((_entry$7 => {
                    var self = _entry$7;
                    switch (self._) {
                        case 'Litereum.Entry.bond':
                            var $2236 = self.value;
                            var $2237 = Maybe$some$($2236);
                            var $2235 = $2237;
                            break;
                        case 'Litereum.Entry.data':
                            var $2238 = Maybe$none;
                            var $2235 = $2238;
                            break;
                    };
                    return $2235;
                }));
                var $2231 = $2233;
                break;
        };
        return $2231;
    };
    const Litereum$get_bond = x0 => x1 => Litereum$get_bond$(x0, x1);

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.cons':
                var $2240 = self.head;
                var $2241 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.cons':
                        var $2243 = self.head;
                        var $2244 = self.tail;
                        var $2245 = List$cons$(Pair$new$($2240, $2243), List$zip$($2241, $2244));
                        var $2242 = $2245;
                        break;
                    case 'List.nil':
                        var $2246 = List$nil;
                        var $2242 = $2246;
                        break;
                };
                var $2239 = $2242;
                break;
            case 'List.nil':
                var $2247 = List$nil;
                var $2239 = $2247;
                break;
        };
        return $2239;
    };
    const List$zip = x0 => x1 => List$zip$(x0, x1);

    function List$all$(_cond$2, _list$3) {
        var List$all$ = (_cond$2, _list$3) => ({
            ctr: 'TCO',
            arg: [_cond$2, _list$3]
        });
        var List$all = _cond$2 => _list$3 => List$all$(_cond$2, _list$3);
        var arg = [_cond$2, _list$3];
        while (true) {
            let [_cond$2, _list$3] = arg;
            var R = (() => {
                var self = _list$3;
                switch (self._) {
                    case 'List.cons':
                        var $2248 = self.head;
                        var $2249 = self.tail;
                        var self = _cond$2($2248);
                        if (self) {
                            var $2251 = List$all$(_cond$2, $2249);
                            var $2250 = $2251;
                        } else {
                            var $2252 = Bool$false;
                            var $2250 = $2252;
                        };
                        return $2250;
                    case 'List.nil':
                        var $2253 = Bool$true;
                        return $2253;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$all = x0 => x1 => List$all$(x0, x1);

    function Maybe$mapped$(_m$2, _f$4) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $2255 = self.value;
                var $2256 = Maybe$some$(_f$4($2255));
                var $2254 = $2256;
                break;
            case 'Maybe.none':
                var $2257 = Maybe$none;
                var $2254 = $2257;
                break;
        };
        return $2254;
    };
    const Maybe$mapped = x0 => x1 => Maybe$mapped$(x0, x1);

    function List$ifind$go$(_xs$2, _f$3, _i$4) {
        var List$ifind$go$ = (_xs$2, _f$3, _i$4) => ({
            ctr: 'TCO',
            arg: [_xs$2, _f$3, _i$4]
        });
        var List$ifind$go = _xs$2 => _f$3 => _i$4 => List$ifind$go$(_xs$2, _f$3, _i$4);
        var arg = [_xs$2, _f$3, _i$4];
        while (true) {
            let [_xs$2, _f$3, _i$4] = arg;
            var R = (() => {
                var self = _xs$2;
                switch (self._) {
                    case 'List.cons':
                        var $2258 = self.head;
                        var $2259 = self.tail;
                        var self = _f$3(_i$4)($2258);
                        if (self) {
                            var $2261 = Maybe$some$(Pair$new$(_i$4, $2258));
                            var $2260 = $2261;
                        } else {
                            var $2262 = List$ifind$go$($2259, _f$3, Nat$succ$(_i$4));
                            var $2260 = $2262;
                        };
                        return $2260;
                    case 'List.nil':
                        var $2263 = Maybe$none;
                        return $2263;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$ifind$go = x0 => x1 => x2 => List$ifind$go$(x0, x1, x2);

    function List$ifind$(_f$2, _xs$3) {
        var $2264 = List$ifind$go$(_xs$3, _f$2, Nat$zero);
        return $2264;
    };
    const List$ifind = x0 => x1 => List$ifind$(x0, x1);

    function Litereum$get_constructor_value$(_data$1, _name$2) {
        var $2265 = Maybe$mapped$(List$ifind$((_i$3 => _ctr$4 => {
            var $2266 = ((() => {
                var self = _ctr$4;
                switch (self._) {
                    case 'Litereum.Constructor.new':
                        var $2267 = self.name;
                        var $2268 = $2267;
                        return $2268;
                };
            })() === _name$2);
            return $2266;
        }), (() => {
            var self = _data$1;
            switch (self._) {
                case 'Litereum.Data.new':
                    var $2269 = self.constructors;
                    var $2270 = $2269;
                    return $2270;
            };
        })()), (_x$3 => {
            var self = _x$3;
            switch (self._) {
                case 'Pair.new':
                    var $2272 = self.snd;
                    var $2273 = $2272;
                    var $2271 = $2273;
                    break;
            };
            return $2271;
        }));
        return $2265;
    };
    const Litereum$get_constructor_value = x0 => x1 => Litereum$get_constructor_value$(x0, x1);
    const Nat$eql = a0 => a1 => (a0 === a1);
    const List$length = a0 => (list_length(a0));

    function List$zip_with$(_f$4, _as$5, _bs$6) {
        var self = _as$5;
        switch (self._) {
            case 'List.cons':
                var $2275 = self.head;
                var $2276 = self.tail;
                var self = _bs$6;
                switch (self._) {
                    case 'List.cons':
                        var $2278 = self.head;
                        var $2279 = self.tail;
                        var $2280 = List$cons$(_f$4($2275)($2278), List$zip_with$(_f$4, $2276, $2279));
                        var $2277 = $2280;
                        break;
                    case 'List.nil':
                        var $2281 = List$nil;
                        var $2277 = $2281;
                        break;
                };
                var $2274 = $2277;
                break;
            case 'List.nil':
                var $2282 = List$nil;
                var $2274 = $2282;
                break;
        };
        return $2274;
    };
    const List$zip_with = x0 => x1 => x2 => List$zip_with$(x0, x1, x2);

    function List$zipped_with$(_as$3, _bs$4, _f$6) {
        var $2283 = List$zip_with$(_f$6, _as$3, _bs$4);
        return $2283;
    };
    const List$zipped_with = x0 => x1 => x2 => List$zipped_with$(x0, x1, x2);

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $2285 = self.head;
                var $2286 = self.tail;
                var $2287 = List$cons$(_f$3($2285), List$map$(_f$3, $2286));
                var $2284 = $2287;
                break;
            case 'List.nil':
                var $2288 = List$nil;
                var $2284 = $2288;
                break;
        };
        return $2284;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function List$and$(_list$1) {
        var $2289 = List$all$((_x$2 => {
            var $2290 = _x$2;
            return $2290;
        }), _list$1);
        return $2289;
    };
    const List$and = x0 => List$and$(x0);

    function Litereum$check$(_context$1, _world$2, _term$3, _type$4) {
        var self = _context$1;
        switch (self._) {
            case 'BBT.tip':
                var self = _world$2;
                switch (self._) {
                    case 'Litereum.World.new':
                        var $2293 = self.name_to_index;
                        var self = _term$3;
                        switch (self._) {
                            case 'Litereum.Term.var':
                                var $2295 = self.name;
                                var self = Map$get$($2295, _context$1);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2297 = self.value;
                                        var $2298 = Litereum$equal$($2297, _type$4);
                                        var $2296 = $2298;
                                        break;
                                    case 'Maybe.none':
                                        var $2299 = Bool$false;
                                        var $2296 = $2299;
                                        break;
                                };
                                var $2294 = $2296;
                                break;
                            case 'Litereum.Term.call':
                                var $2300 = self.bond;
                                var $2301 = self.args;
                                var _def0$11 = Maybe$is_some$(Map$get$($2300, $2293));
                                var self = Litereum$get_bond$(_world$2, $2300);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2303 = self.value;
                                        var _bond$13 = $2303;
                                        var self = _bond$13;
                                        switch (self._) {
                                            case 'Litereum.Bond.new':
                                                var $2305 = self.input_types;
                                                var $2306 = self.output_type;
                                                var _otyp$20 = Litereum$equal$($2306, _type$4);
                                                var _args$21 = List$zip$($2301, $2305);
                                                var _args$22 = List$all$((_x$22 => {
                                                    var $2308 = Litereum$check$(_context$1, _world$2, (() => {
                                                        var self = _x$22;
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $2309 = self.fst;
                                                                var $2310 = $2309;
                                                                return $2310;
                                                        };
                                                    })(), (() => {
                                                        var self = _x$22;
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $2311 = self.snd;
                                                                var $2312 = $2311;
                                                                return $2312;
                                                        };
                                                    })());
                                                    return $2308;
                                                }), _args$21);
                                                var $2307 = (_def0$11 && (_otyp$20 && _args$22));
                                                var $2304 = $2307;
                                                break;
                                        };
                                        var $2302 = $2304;
                                        break;
                                    case 'Maybe.none':
                                        var $2313 = Bool$false;
                                        var $2302 = $2313;
                                        break;
                                };
                                var $2294 = $2302;
                                break;
                            case 'Litereum.Term.let':
                                var $2314 = self.name;
                                var $2315 = self.type;
                                var $2316 = self.expr;
                                var $2317 = self.body;
                                var _def0$13 = Maybe$is_some$(Map$get$($2314, $2293));
                                var _expr$14 = Litereum$check$(_context$1, _world$2, $2316, $2315);
                                var _ctx2$15 = Map$set$($2314, $2315, _context$1);
                                var _cont$16 = Litereum$check$(_ctx2$15, _world$2, $2317, _type$4);
                                var $2318 = (_def0$13 && (_expr$14 && _cont$16));
                                var $2294 = $2318;
                                break;
                            case 'Litereum.Term.create':
                                var $2319 = self.ctor;
                                var $2320 = self.vals;
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.data':
                                        var $2322 = self.name;
                                        var self = Litereum$get_data$(_world$2, $2322);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $2324 = self.value;
                                                var _data$13 = $2324;
                                                var self = _data$13;
                                                switch (self._) {
                                                    case 'Litereum.Data.new':
                                                        var self = Litereum$get_constructor_value$(_data$13, $2319);
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $2327 = self.value;
                                                                var _ctor$17 = $2327;
                                                                var self = _ctor$17;
                                                                switch (self._) {
                                                                    case 'Litereum.Constructor.new':
                                                                        var $2329 = self.field_types;
                                                                        var _size$21 = ((list_length($2320)) === (list_length($2329)));
                                                                        var _vals$22 = List$zip$($2320, $2329);
                                                                        var _vals$23 = List$all$((_x$23 => {
                                                                            var $2331 = Litereum$check$(_context$1, _world$2, (() => {
                                                                                var self = _x$23;
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $2332 = self.fst;
                                                                                        var $2333 = $2332;
                                                                                        return $2333;
                                                                                };
                                                                            })(), (() => {
                                                                                var self = _x$23;
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $2334 = self.snd;
                                                                                        var $2335 = $2334;
                                                                                        return $2335;
                                                                                };
                                                                            })());
                                                                            return $2331;
                                                                        }), _vals$22);
                                                                        var $2330 = (_size$21 && _vals$23);
                                                                        var $2328 = $2330;
                                                                        break;
                                                                };
                                                                var $2326 = $2328;
                                                                break;
                                                            case 'Maybe.none':
                                                                var $2336 = Bool$false;
                                                                var $2326 = $2336;
                                                                break;
                                                        };
                                                        var $2325 = $2326;
                                                        break;
                                                };
                                                var $2323 = $2325;
                                                break;
                                            case 'Maybe.none':
                                                var $2337 = Bool$false;
                                                var $2323 = $2337;
                                                break;
                                        };
                                        var $2321 = $2323;
                                        break;
                                    case 'Litereum.Type.word':
                                        var $2338 = Bool$false;
                                        var $2321 = $2338;
                                        break;
                                };
                                var $2294 = $2321;
                                break;
                            case 'Litereum.Term.match':
                                var $2339 = self.name;
                                var $2340 = self.data;
                                var $2341 = self.cses;
                                var self = Litereum$get_data$(_world$2, $2340);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2343 = self.value;
                                        var _data$13 = $2343;
                                        var self = _data$13;
                                        switch (self._) {
                                            case 'Litereum.Data.new':
                                                var $2345 = self.constructors;
                                                var _def0$16 = Maybe$is_some$(Map$get$($2340, $2293));
                                                var self = Map$get$($2339, _context$1);
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $2347 = self.value;
                                                        var _size$18 = ((list_length($2341)) === (list_length($2345)));
                                                        var _expr$19 = Litereum$check$(_context$1, _world$2, Litereum$Term$var$($2339), Litereum$Type$data$($2340));
                                                        var _cses$20 = List$zipped_with$($2341, $2345, (_case_body$20 => _case_ctor$21 => {
                                                            var _nams$22 = List$map$(a1 => (($2339 + ".") + a1), (() => {
                                                                var self = _case_ctor$21;
                                                                switch (self._) {
                                                                    case 'Litereum.Constructor.new':
                                                                        var $2350 = self.field_names;
                                                                        var $2351 = $2350;
                                                                        return $2351;
                                                                };
                                                            })());
                                                            var self = _case_ctor$21;
                                                            switch (self._) {
                                                                case 'Litereum.Constructor.new':
                                                                    var $2352 = self.field_types;
                                                                    var $2353 = $2352;
                                                                    var _typs$23 = $2353;
                                                                    break;
                                                            };
                                                            var _ctx2$24 = Litereum$extend$(_context$1, _nams$22, _typs$23);
                                                            var $2349 = Litereum$check$(_ctx2$24, _world$2, _case_body$20, $2347);
                                                            return $2349;
                                                        }));
                                                        var $2348 = (_def0$16 && (_size$18 && List$and$(_cses$20)));
                                                        var $2346 = $2348;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $2354 = Bool$false;
                                                        var $2346 = $2354;
                                                        break;
                                                };
                                                var $2344 = $2346;
                                                break;
                                        };
                                        var $2342 = $2344;
                                        break;
                                    case 'Maybe.none':
                                        var $2355 = Bool$false;
                                        var $2342 = $2355;
                                        break;
                                };
                                var $2294 = $2342;
                                break;
                            case 'Litereum.Term.compare':
                                var $2356 = self.val0;
                                var $2357 = self.iflt;
                                var $2358 = self.ifeq;
                                var $2359 = self.ifgt;
                                var _val0$14 = Litereum$check$(_context$1, _world$2, $2356, Litereum$Type$word);
                                var _val1$15 = Litereum$check$(_context$1, _world$2, $2356, Litereum$Type$word);
                                var _iflt$16 = Litereum$check$(_context$1, _world$2, $2357, _type$4);
                                var _ifeq$17 = Litereum$check$(_context$1, _world$2, $2358, _type$4);
                                var _ifgt$18 = Litereum$check$(_context$1, _world$2, $2359, _type$4);
                                var $2360 = (_val0$14 && (_val1$15 && (_iflt$16 && (_ifeq$17 && _ifgt$18))));
                                var $2294 = $2360;
                                break;
                            case 'Litereum.Term.operate':
                                var $2361 = self.val0;
                                var $2362 = self.val1;
                                var _val0$12 = Litereum$check$(_context$1, _world$2, $2361, Litereum$Type$word);
                                var _val1$13 = Litereum$check$(_context$1, _world$2, $2362, Litereum$Type$word);
                                var $2363 = (_val0$12 && _val1$13);
                                var $2294 = $2363;
                                break;
                            case 'Litereum.Term.bind':
                                var $2364 = self.name;
                                var $2365 = self.main;
                                var $2366 = self.body;
                                var self = Litereum$get_bond$(_world$2, $2364);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2368 = self.value;
                                        var _bond$13 = $2368;
                                        var self = _bond$13;
                                        switch (self._) {
                                            case 'Litereum.Bond.new':
                                                var $2370 = self.input_names;
                                                var $2371 = self.input_types;
                                                var $2372 = self.output_type;
                                                var _ctx2$20 = Litereum$extend$(_context$1, $2370, $2371);
                                                var _main$21 = Litereum$check$(_ctx2$20, _world$2, $2365, $2372);
                                                var _body$22 = Litereum$check$(_context$1, _world$2, $2366, _type$4);
                                                var $2373 = (_main$21 && _body$22);
                                                var $2369 = $2373;
                                                break;
                                        };
                                        var $2367 = $2369;
                                        break;
                                    case 'Maybe.none':
                                        var $2374 = Bool$false;
                                        var $2367 = $2374;
                                        break;
                                };
                                var $2294 = $2367;
                                break;
                            case 'Litereum.Term.word':
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.word':
                                        var $2376 = Bool$true;
                                        var $2375 = $2376;
                                        break;
                                    case 'Litereum.Type.data':
                                        var $2377 = Bool$false;
                                        var $2375 = $2377;
                                        break;
                                };
                                var $2294 = $2375;
                                break;
                        };
                        var $2292 = $2294;
                        break;
                };
                var $2291 = $2292;
                break;
            case 'BBT.bin':
                var self = _world$2;
                switch (self._) {
                    case 'Litereum.World.new':
                        var $2379 = self.name_to_index;
                        var self = _term$3;
                        switch (self._) {
                            case 'Litereum.Term.var':
                                var $2381 = self.name;
                                var self = Map$get$($2381, _context$1);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2383 = self.value;
                                        var $2384 = Litereum$equal$($2383, _type$4);
                                        var $2382 = $2384;
                                        break;
                                    case 'Maybe.none':
                                        var $2385 = Bool$false;
                                        var $2382 = $2385;
                                        break;
                                };
                                var $2380 = $2382;
                                break;
                            case 'Litereum.Term.call':
                                var $2386 = self.bond;
                                var $2387 = self.args;
                                var _def0$16 = Maybe$is_some$(Map$get$($2386, $2379));
                                var self = Litereum$get_bond$(_world$2, $2386);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2389 = self.value;
                                        var _bond$18 = $2389;
                                        var self = _bond$18;
                                        switch (self._) {
                                            case 'Litereum.Bond.new':
                                                var $2391 = self.input_types;
                                                var $2392 = self.output_type;
                                                var _otyp$25 = Litereum$equal$($2392, _type$4);
                                                var _args$26 = List$zip$($2387, $2391);
                                                var _args$27 = List$all$((_x$27 => {
                                                    var $2394 = Litereum$check$(_context$1, _world$2, (() => {
                                                        var self = _x$27;
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $2395 = self.fst;
                                                                var $2396 = $2395;
                                                                return $2396;
                                                        };
                                                    })(), (() => {
                                                        var self = _x$27;
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $2397 = self.snd;
                                                                var $2398 = $2397;
                                                                return $2398;
                                                        };
                                                    })());
                                                    return $2394;
                                                }), _args$26);
                                                var $2393 = (_def0$16 && (_otyp$25 && _args$27));
                                                var $2390 = $2393;
                                                break;
                                        };
                                        var $2388 = $2390;
                                        break;
                                    case 'Maybe.none':
                                        var $2399 = Bool$false;
                                        var $2388 = $2399;
                                        break;
                                };
                                var $2380 = $2388;
                                break;
                            case 'Litereum.Term.let':
                                var $2400 = self.name;
                                var $2401 = self.type;
                                var $2402 = self.expr;
                                var $2403 = self.body;
                                var _def0$18 = Maybe$is_some$(Map$get$($2400, $2379));
                                var _expr$19 = Litereum$check$(_context$1, _world$2, $2402, $2401);
                                var _ctx2$20 = Map$set$($2400, $2401, _context$1);
                                var _cont$21 = Litereum$check$(_ctx2$20, _world$2, $2403, _type$4);
                                var $2404 = (_def0$18 && (_expr$19 && _cont$21));
                                var $2380 = $2404;
                                break;
                            case 'Litereum.Term.create':
                                var $2405 = self.ctor;
                                var $2406 = self.vals;
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.data':
                                        var $2408 = self.name;
                                        var self = Litereum$get_data$(_world$2, $2408);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $2410 = self.value;
                                                var _data$18 = $2410;
                                                var self = _data$18;
                                                switch (self._) {
                                                    case 'Litereum.Data.new':
                                                        var self = Litereum$get_constructor_value$(_data$18, $2405);
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $2413 = self.value;
                                                                var _ctor$22 = $2413;
                                                                var self = _ctor$22;
                                                                switch (self._) {
                                                                    case 'Litereum.Constructor.new':
                                                                        var $2415 = self.field_types;
                                                                        var _size$26 = ((list_length($2406)) === (list_length($2415)));
                                                                        var _vals$27 = List$zip$($2406, $2415);
                                                                        var _vals$28 = List$all$((_x$28 => {
                                                                            var $2417 = Litereum$check$(_context$1, _world$2, (() => {
                                                                                var self = _x$28;
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $2418 = self.fst;
                                                                                        var $2419 = $2418;
                                                                                        return $2419;
                                                                                };
                                                                            })(), (() => {
                                                                                var self = _x$28;
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $2420 = self.snd;
                                                                                        var $2421 = $2420;
                                                                                        return $2421;
                                                                                };
                                                                            })());
                                                                            return $2417;
                                                                        }), _vals$27);
                                                                        var $2416 = (_size$26 && _vals$28);
                                                                        var $2414 = $2416;
                                                                        break;
                                                                };
                                                                var $2412 = $2414;
                                                                break;
                                                            case 'Maybe.none':
                                                                var $2422 = Bool$false;
                                                                var $2412 = $2422;
                                                                break;
                                                        };
                                                        var $2411 = $2412;
                                                        break;
                                                };
                                                var $2409 = $2411;
                                                break;
                                            case 'Maybe.none':
                                                var $2423 = Bool$false;
                                                var $2409 = $2423;
                                                break;
                                        };
                                        var $2407 = $2409;
                                        break;
                                    case 'Litereum.Type.word':
                                        var $2424 = Bool$false;
                                        var $2407 = $2424;
                                        break;
                                };
                                var $2380 = $2407;
                                break;
                            case 'Litereum.Term.match':
                                var $2425 = self.name;
                                var $2426 = self.data;
                                var $2427 = self.cses;
                                var self = Litereum$get_data$(_world$2, $2426);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2429 = self.value;
                                        var _data$18 = $2429;
                                        var self = _data$18;
                                        switch (self._) {
                                            case 'Litereum.Data.new':
                                                var $2431 = self.constructors;
                                                var _def0$21 = Maybe$is_some$(Map$get$($2426, $2379));
                                                var self = Map$get$($2425, _context$1);
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $2433 = self.value;
                                                        var _size$23 = ((list_length($2427)) === (list_length($2431)));
                                                        var _expr$24 = Litereum$check$(_context$1, _world$2, Litereum$Term$var$($2425), Litereum$Type$data$($2426));
                                                        var _cses$25 = List$zipped_with$($2427, $2431, (_case_body$25 => _case_ctor$26 => {
                                                            var _nams$27 = List$map$(a1 => (($2425 + ".") + a1), (() => {
                                                                var self = _case_ctor$26;
                                                                switch (self._) {
                                                                    case 'Litereum.Constructor.new':
                                                                        var $2436 = self.field_names;
                                                                        var $2437 = $2436;
                                                                        return $2437;
                                                                };
                                                            })());
                                                            var self = _case_ctor$26;
                                                            switch (self._) {
                                                                case 'Litereum.Constructor.new':
                                                                    var $2438 = self.field_types;
                                                                    var $2439 = $2438;
                                                                    var _typs$28 = $2439;
                                                                    break;
                                                            };
                                                            var _ctx2$29 = Litereum$extend$(_context$1, _nams$27, _typs$28);
                                                            var $2435 = Litereum$check$(_ctx2$29, _world$2, _case_body$25, $2433);
                                                            return $2435;
                                                        }));
                                                        var $2434 = (_def0$21 && (_size$23 && List$and$(_cses$25)));
                                                        var $2432 = $2434;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $2440 = Bool$false;
                                                        var $2432 = $2440;
                                                        break;
                                                };
                                                var $2430 = $2432;
                                                break;
                                        };
                                        var $2428 = $2430;
                                        break;
                                    case 'Maybe.none':
                                        var $2441 = Bool$false;
                                        var $2428 = $2441;
                                        break;
                                };
                                var $2380 = $2428;
                                break;
                            case 'Litereum.Term.compare':
                                var $2442 = self.val0;
                                var $2443 = self.iflt;
                                var $2444 = self.ifeq;
                                var $2445 = self.ifgt;
                                var _val0$19 = Litereum$check$(_context$1, _world$2, $2442, Litereum$Type$word);
                                var _val1$20 = Litereum$check$(_context$1, _world$2, $2442, Litereum$Type$word);
                                var _iflt$21 = Litereum$check$(_context$1, _world$2, $2443, _type$4);
                                var _ifeq$22 = Litereum$check$(_context$1, _world$2, $2444, _type$4);
                                var _ifgt$23 = Litereum$check$(_context$1, _world$2, $2445, _type$4);
                                var $2446 = (_val0$19 && (_val1$20 && (_iflt$21 && (_ifeq$22 && _ifgt$23))));
                                var $2380 = $2446;
                                break;
                            case 'Litereum.Term.operate':
                                var $2447 = self.val0;
                                var $2448 = self.val1;
                                var _val0$17 = Litereum$check$(_context$1, _world$2, $2447, Litereum$Type$word);
                                var _val1$18 = Litereum$check$(_context$1, _world$2, $2448, Litereum$Type$word);
                                var $2449 = (_val0$17 && _val1$18);
                                var $2380 = $2449;
                                break;
                            case 'Litereum.Term.bind':
                                var $2450 = self.name;
                                var $2451 = self.main;
                                var $2452 = self.body;
                                var self = Litereum$get_bond$(_world$2, $2450);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2454 = self.value;
                                        var _bond$18 = $2454;
                                        var self = _bond$18;
                                        switch (self._) {
                                            case 'Litereum.Bond.new':
                                                var $2456 = self.input_names;
                                                var $2457 = self.input_types;
                                                var $2458 = self.output_type;
                                                var _ctx2$25 = Litereum$extend$(_context$1, $2456, $2457);
                                                var _main$26 = Litereum$check$(_ctx2$25, _world$2, $2451, $2458);
                                                var _body$27 = Litereum$check$(_context$1, _world$2, $2452, _type$4);
                                                var $2459 = (_main$26 && _body$27);
                                                var $2455 = $2459;
                                                break;
                                        };
                                        var $2453 = $2455;
                                        break;
                                    case 'Maybe.none':
                                        var $2460 = Bool$false;
                                        var $2453 = $2460;
                                        break;
                                };
                                var $2380 = $2453;
                                break;
                            case 'Litereum.Term.word':
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.word':
                                        var $2462 = Bool$true;
                                        var $2461 = $2462;
                                        break;
                                    case 'Litereum.Type.data':
                                        var $2463 = Bool$false;
                                        var $2461 = $2463;
                                        break;
                                };
                                var $2380 = $2461;
                                break;
                        };
                        var $2378 = $2380;
                        break;
                };
                var $2291 = $2378;
                break;
        };
        return $2291;
    };
    const Litereum$check = x0 => x1 => x2 => x3 => Litereum$check$(x0, x1, x2, x3);

    function Litereum$Runtime$(_A$1) {
        var $2464 = null;
        return $2464;
    };
    const Litereum$Runtime = x0 => Litereum$Runtime$(x0);

    function Litereum$Runtime$new$(_world$2, _subst$3, _fresh$4, _gas$5, _term$6) {
        var $2465 = ({
            _: 'Litereum.Runtime.new',
            'world': _world$2,
            'subst': _subst$3,
            'fresh': _fresh$4,
            'gas': _gas$5,
            'term': _term$6
        });
        return $2465;
    };
    const Litereum$Runtime$new = x0 => x1 => x2 => x3 => x4 => Litereum$Runtime$new$(x0, x1, x2, x3, x4);

    function Triple$(_A$1, _B$2, _C$3) {
        var $2466 = null;
        return $2466;
    };
    const Triple = x0 => x1 => x2 => Triple$(x0, x1, x2);

    function Triple$new$(_fst$4, _snd$5, _trd$6) {
        var $2467 = ({
            _: 'Triple.new',
            'fst': _fst$4,
            'snd': _snd$5,
            'trd': _trd$6
        });
        return $2467;
    };
    const Triple$new = x0 => x1 => x2 => Triple$new$(x0, x1, x2);

    function Litereum$rename$(_table$1, _fresh$2, _old_name$3) {
        var _new_name$4 = ("$" + Nat$show$(_fresh$2));
        var _table$5 = Map$set$(_old_name$3, _new_name$4, _table$1);
        var _fresh$6 = Nat$succ$(_fresh$2);
        var $2468 = Triple$new$(_table$5, _fresh$6, _new_name$4);
        return $2468;
    };
    const Litereum$rename = x0 => x1 => x2 => Litereum$rename$(x0, x1, x2);

    function Litereum$rename$many$(_table$1, _fresh$2, _names$3) {
        var self = _names$3;
        switch (self._) {
            case 'List.cons':
                var $2470 = self.head;
                var $2471 = self.tail;
                var self = Litereum$rename$(_table$1, _fresh$2, $2470);
                switch (self._) {
                    case 'Triple.new':
                        var $2473 = self.fst;
                        var $2474 = self.snd;
                        var $2475 = self.trd;
                        var self = Litereum$rename$many$($2473, $2474, $2471);
                        switch (self._) {
                            case 'Triple.new':
                                var $2477 = self.fst;
                                var $2478 = self.snd;
                                var $2479 = self.trd;
                                var $2480 = Triple$new$($2477, $2478, List$cons$($2475, $2479));
                                var $2476 = $2480;
                                break;
                        };
                        var $2472 = $2476;
                        break;
                };
                var $2469 = $2472;
                break;
            case 'List.nil':
                var $2481 = Triple$new$(_table$1, _fresh$2, List$nil);
                var $2469 = $2481;
                break;
        };
        return $2469;
    };
    const Litereum$rename$many = x0 => x1 => x2 => Litereum$rename$many$(x0, x1, x2);

    function Litereum$sanitize$many$(_world$1, _table$2, _fresh$3, _terms$4) {
        var self = _terms$4;
        switch (self._) {
            case 'List.cons':
                var $2483 = self.head;
                var $2484 = self.tail;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $2483);
                switch (self._) {
                    case 'Pair.new':
                        var $2486 = self.fst;
                        var $2487 = self.snd;
                        var self = Litereum$sanitize$many$(_world$1, _table$2, $2486, $2484);
                        switch (self._) {
                            case 'Pair.new':
                                var $2489 = self.fst;
                                var $2490 = self.snd;
                                var $2491 = Pair$new$($2489, List$cons$($2487, $2490));
                                var $2488 = $2491;
                                break;
                        };
                        var $2485 = $2488;
                        break;
                };
                var $2482 = $2485;
                break;
            case 'List.nil':
                var $2492 = Pair$new$(_fresh$3, List$nil);
                var $2482 = $2492;
                break;
        };
        return $2482;
    };
    const Litereum$sanitize$many = x0 => x1 => x2 => x3 => Litereum$sanitize$many$(x0, x1, x2, x3);

    function Litereum$get_constructors$(_world$1, _name$2) {
        var self = Litereum$get_data$(_world$1, _name$2);
        switch (self._) {
            case 'Maybe.some':
                var $2494 = self.value;
                var $2495 = Maybe$some$((() => {
                    var self = $2494;
                    switch (self._) {
                        case 'Litereum.Data.new':
                            var $2496 = self.constructors;
                            var $2497 = $2496;
                            return $2497;
                    };
                })());
                var $2493 = $2495;
                break;
            case 'Maybe.none':
                var $2498 = Maybe$none;
                var $2493 = $2498;
                break;
        };
        return $2493;
    };
    const Litereum$get_constructors = x0 => x1 => Litereum$get_constructors$(x0, x1);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Litereum$sanitize$cases$(_world$1, _table$2, _fresh$3, _old_name$4, _new_name$5, _ctrs$6, _cses$7) {
        var self = _ctrs$6;
        switch (self._) {
            case 'List.cons':
                var $2500 = self.head;
                var $2501 = self.tail;
                var self = _cses$7;
                switch (self._) {
                    case 'List.cons':
                        var $2503 = self.head;
                        var $2504 = self.tail;
                        var _new_table$12 = _table$2;
                        var _new_table$13 = (() => {
                            var $2507 = _new_table$12;
                            var self = $2500;
                            switch (self._) {
                                case 'Litereum.Constructor.new':
                                    var $2509 = self.field_names;
                                    var $2510 = $2509;
                                    var $2508 = $2510;
                                    break;
                            };
                            let _new_table$14 = $2507;
                            let _field$13;
                            while ($2508._ === 'List.cons') {
                                _field$13 = $2508.head;
                                var $2507 = Map$set$((_old_name$4 + ("." + _field$13)), (_new_name$5 + ("." + _field$13)), _new_table$14);
                                _new_table$14 = $2507;
                                $2508 = $2508.tail;
                            }
                            return _new_table$14;
                        })();
                        var self = Litereum$sanitize$(_world$1, _new_table$13, _fresh$3, $2503);
                        switch (self._) {
                            case 'Pair.new':
                                var $2511 = self.fst;
                                var $2512 = self.snd;
                                var self = Litereum$sanitize$cases$(_world$1, _table$2, $2511, _old_name$4, _new_name$5, $2501, $2504);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2514 = self.fst;
                                        var $2515 = self.snd;
                                        var $2516 = Pair$new$($2514, List$cons$($2512, $2515));
                                        var $2513 = $2516;
                                        break;
                                };
                                var $2505 = $2513;
                                break;
                        };
                        var $2502 = $2505;
                        break;
                    case 'List.nil':
                        var $2517 = Pair$new$(_fresh$3, List$nil);
                        var $2502 = $2517;
                        break;
                };
                var $2499 = $2502;
                break;
            case 'List.nil':
                var self = _cses$7;
                switch (self._) {
                    case 'List.nil':
                    case 'List.cons':
                        var $2519 = Pair$new$(_fresh$3, List$nil);
                        var $2518 = $2519;
                        break;
                };
                var $2499 = $2518;
                break;
        };
        return $2499;
    };
    const Litereum$sanitize$cases = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Litereum$sanitize$cases$(x0, x1, x2, x3, x4, x5, x6);

    function Litereum$sanitize$(_world$1, _table$2, _fresh$3, _term$4) {
        var self = _term$4;
        switch (self._) {
            case 'Litereum.Term.var':
                var $2521 = self.name;
                var _term$6 = Litereum$Term$var$(Maybe$default$(Map$get$($2521, _table$2), $2521));
                var $2522 = Pair$new$(_fresh$3, _term$6);
                var $2520 = $2522;
                break;
            case 'Litereum.Term.call':
                var $2523 = self.bond;
                var $2524 = self.args;
                var self = Litereum$sanitize$many$(_world$1, _table$2, _fresh$3, $2524);
                switch (self._) {
                    case 'Pair.new':
                        var $2526 = self.fst;
                        var $2527 = self.snd;
                        var $2528 = Pair$new$($2526, Litereum$Term$call$($2523, $2527));
                        var $2525 = $2528;
                        break;
                };
                var $2520 = $2525;
                break;
            case 'Litereum.Term.let':
                var $2529 = self.name;
                var $2530 = self.type;
                var $2531 = self.expr;
                var $2532 = self.body;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $2531);
                switch (self._) {
                    case 'Pair.new':
                        var $2534 = self.fst;
                        var $2535 = self.snd;
                        var self = Litereum$rename$(_table$2, $2534, $2529);
                        switch (self._) {
                            case 'Triple.new':
                                var $2537 = self.fst;
                                var $2538 = self.snd;
                                var $2539 = self.trd;
                                var self = Litereum$sanitize$(_world$1, $2537, $2538, $2532);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2541 = self.fst;
                                        var $2542 = self.snd;
                                        var $2543 = Pair$new$($2541, Litereum$Term$let$($2539, $2530, $2535, $2542));
                                        var $2540 = $2543;
                                        break;
                                };
                                var $2536 = $2540;
                                break;
                        };
                        var $2533 = $2536;
                        break;
                };
                var $2520 = $2533;
                break;
            case 'Litereum.Term.create':
                var $2544 = self.ctor;
                var $2545 = self.vals;
                var self = Litereum$sanitize$many$(_world$1, _table$2, _fresh$3, $2545);
                switch (self._) {
                    case 'Pair.new':
                        var $2547 = self.fst;
                        var $2548 = self.snd;
                        var $2549 = Pair$new$($2547, Litereum$Term$create$($2544, $2548));
                        var $2546 = $2549;
                        break;
                };
                var $2520 = $2546;
                break;
            case 'Litereum.Term.match':
                var $2550 = self.name;
                var $2551 = self.data;
                var $2552 = self.cses;
                var _ctrs$8 = Maybe$default$(Litereum$get_constructors$(_world$1, $2551), List$nil);
                var _old_name$9 = $2550;
                var _new_name$10 = Maybe$default$(Map$get$($2550, _table$2), $2550);
                var self = Litereum$sanitize$cases$(_world$1, _table$2, _fresh$3, _old_name$9, _new_name$10, _ctrs$8, $2552);
                switch (self._) {
                    case 'Pair.new':
                        var $2554 = self.fst;
                        var $2555 = self.snd;
                        var $2556 = Pair$new$($2554, Litereum$Term$match$(_new_name$10, $2551, $2555));
                        var $2553 = $2556;
                        break;
                };
                var $2520 = $2553;
                break;
            case 'Litereum.Term.word':
                var $2557 = self.numb;
                var $2558 = Pair$new$(_fresh$3, Litereum$Term$word$($2557));
                var $2520 = $2558;
                break;
            case 'Litereum.Term.compare':
                var $2559 = self.val0;
                var $2560 = self.val1;
                var $2561 = self.iflt;
                var $2562 = self.ifeq;
                var $2563 = self.ifgt;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $2559);
                switch (self._) {
                    case 'Pair.new':
                        var $2565 = self.fst;
                        var $2566 = self.snd;
                        var self = Litereum$sanitize$(_world$1, _table$2, $2565, $2560);
                        switch (self._) {
                            case 'Pair.new':
                                var $2568 = self.fst;
                                var $2569 = self.snd;
                                var self = Litereum$sanitize$(_world$1, _table$2, $2568, $2561);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2571 = self.fst;
                                        var $2572 = self.snd;
                                        var self = Litereum$sanitize$(_world$1, _table$2, $2571, $2562);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $2574 = self.fst;
                                                var $2575 = self.snd;
                                                var self = Litereum$sanitize$(_world$1, _table$2, $2574, $2563);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $2577 = self.fst;
                                                        var $2578 = self.snd;
                                                        var $2579 = Pair$new$($2577, Litereum$Term$compare$($2566, $2569, $2572, $2575, $2578));
                                                        var $2576 = $2579;
                                                        break;
                                                };
                                                var $2573 = $2576;
                                                break;
                                        };
                                        var $2570 = $2573;
                                        break;
                                };
                                var $2567 = $2570;
                                break;
                        };
                        var $2564 = $2567;
                        break;
                };
                var $2520 = $2564;
                break;
            case 'Litereum.Term.operate':
                var $2580 = self.oper;
                var $2581 = self.val0;
                var $2582 = self.val1;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $2581);
                switch (self._) {
                    case 'Pair.new':
                        var $2584 = self.fst;
                        var $2585 = self.snd;
                        var self = Litereum$sanitize$(_world$1, _table$2, $2584, $2582);
                        switch (self._) {
                            case 'Pair.new':
                                var $2587 = self.fst;
                                var $2588 = self.snd;
                                var $2589 = Pair$new$($2587, Litereum$Term$operate$($2580, $2585, $2588));
                                var $2586 = $2589;
                                break;
                        };
                        var $2583 = $2586;
                        break;
                };
                var $2520 = $2583;
                break;
            case 'Litereum.Term.bind':
                var $2590 = self.name;
                var $2591 = self.main;
                var $2592 = self.body;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $2591);
                switch (self._) {
                    case 'Pair.new':
                        var $2594 = self.fst;
                        var $2595 = self.snd;
                        var self = Litereum$sanitize$(_world$1, _table$2, $2594, $2592);
                        switch (self._) {
                            case 'Pair.new':
                                var $2597 = self.fst;
                                var $2598 = self.snd;
                                var $2599 = Pair$new$($2597, Litereum$Term$bind$($2590, $2595, $2598));
                                var $2596 = $2599;
                                break;
                        };
                        var $2593 = $2596;
                        break;
                };
                var $2520 = $2593;
                break;
        };
        return $2520;
    };
    const Litereum$sanitize = x0 => x1 => x2 => x3 => Litereum$sanitize$(x0, x1, x2, x3);
    const U64$from_nat = a0 => (a0 & 0xFFFFFFFFFFFFFFFFn);

    function Litereum$get_constructor_index$(_data$1, _name$2) {
        var $2600 = Maybe$mapped$(List$ifind$((_i$3 => _ctr$4 => {
            var $2601 = ((() => {
                var self = _ctr$4;
                switch (self._) {
                    case 'Litereum.Constructor.new':
                        var $2602 = self.name;
                        var $2603 = $2602;
                        return $2603;
                };
            })() === _name$2);
            return $2601;
        }), (() => {
            var self = _data$1;
            switch (self._) {
                case 'Litereum.Data.new':
                    var $2604 = self.constructors;
                    var $2605 = $2604;
                    return $2605;
            };
        })()), (_x$3 => {
            var self = _x$3;
            switch (self._) {
                case 'Pair.new':
                    var $2607 = self.fst;
                    var $2608 = $2607;
                    var $2606 = $2608;
                    break;
            };
            return $2606;
        }));
        return $2600;
    };
    const Litereum$get_constructor_index = x0 => x1 => Litereum$get_constructor_index$(x0, x1);

    function List$get$(_index$2, _list$3) {
        var List$get$ = (_index$2, _list$3) => ({
            ctr: 'TCO',
            arg: [_index$2, _list$3]
        });
        var List$get = _index$2 => _list$3 => List$get$(_index$2, _list$3);
        var arg = [_index$2, _list$3];
        while (true) {
            let [_index$2, _list$3] = arg;
            var R = (() => {
                var self = _list$3;
                switch (self._) {
                    case 'List.cons':
                        var $2609 = self.head;
                        var $2610 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $2612 = Maybe$some$($2609);
                            var $2611 = $2612;
                        } else {
                            var $2613 = (self - 1n);
                            var $2614 = List$get$($2613, $2610);
                            var $2611 = $2614;
                        };
                        return $2611;
                    case 'List.nil':
                        var $2615 = Maybe$none;
                        return $2615;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$get = x0 => x1 => List$get$(x0, x1);
    const U64$ltn = a0 => a1 => (a0 < a1);
    const U64$eql = a0 => a1 => (a0 === a1);

    function U64$cmp$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $2617 = Cmp$ltn;
            var $2616 = $2617;
        } else {
            var self = (_a$1 === _b$2);
            if (self) {
                var $2619 = Cmp$eql;
                var $2618 = $2619;
            } else {
                var $2620 = Cmp$gtn;
                var $2618 = $2620;
            };
            var $2616 = $2618;
        };
        return $2616;
    };
    const U64$cmp = x0 => x1 => U64$cmp$(x0, x1);
    const U64$add = a0 => a1 => ((a0 + a1) & 0xFFFFFFFFFFFFFFFFn);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $2622 = self.pred;
                var $2623 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $2625 = self.pred;
                            var $2626 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2628 = Word$i$(Word$subber$(_a$pred$10, $2625, Bool$true));
                                    var $2627 = $2628;
                                } else {
                                    var $2629 = Word$o$(Word$subber$(_a$pred$10, $2625, Bool$false));
                                    var $2627 = $2629;
                                };
                                return $2627;
                            });
                            var $2624 = $2626;
                            break;
                        case 'Word.i':
                            var $2630 = self.pred;
                            var $2631 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2633 = Word$o$(Word$subber$(_a$pred$10, $2630, Bool$true));
                                    var $2632 = $2633;
                                } else {
                                    var $2634 = Word$i$(Word$subber$(_a$pred$10, $2630, Bool$true));
                                    var $2632 = $2634;
                                };
                                return $2632;
                            });
                            var $2624 = $2631;
                            break;
                        case 'Word.e':
                            var $2635 = (_a$pred$8 => {
                                var $2636 = Word$e;
                                return $2636;
                            });
                            var $2624 = $2635;
                            break;
                    };
                    var $2624 = $2624($2622);
                    return $2624;
                });
                var $2621 = $2623;
                break;
            case 'Word.i':
                var $2637 = self.pred;
                var $2638 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $2640 = self.pred;
                            var $2641 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2643 = Word$o$(Word$subber$(_a$pred$10, $2640, Bool$false));
                                    var $2642 = $2643;
                                } else {
                                    var $2644 = Word$i$(Word$subber$(_a$pred$10, $2640, Bool$false));
                                    var $2642 = $2644;
                                };
                                return $2642;
                            });
                            var $2639 = $2641;
                            break;
                        case 'Word.i':
                            var $2645 = self.pred;
                            var $2646 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2648 = Word$i$(Word$subber$(_a$pred$10, $2645, Bool$true));
                                    var $2647 = $2648;
                                } else {
                                    var $2649 = Word$o$(Word$subber$(_a$pred$10, $2645, Bool$false));
                                    var $2647 = $2649;
                                };
                                return $2647;
                            });
                            var $2639 = $2646;
                            break;
                        case 'Word.e':
                            var $2650 = (_a$pred$8 => {
                                var $2651 = Word$e;
                                return $2651;
                            });
                            var $2639 = $2650;
                            break;
                    };
                    var $2639 = $2639($2637);
                    return $2639;
                });
                var $2621 = $2638;
                break;
            case 'Word.e':
                var $2652 = (_b$5 => {
                    var $2653 = Word$e;
                    return $2653;
                });
                var $2621 = $2652;
                break;
        };
        var $2621 = $2621(_b$3);
        return $2621;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $2654 = Word$subber$(_a$2, _b$3, Bool$false);
        return $2654;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);
    const U64$sub = a0 => a1 => ((a0 - a1) & 0xFFFFFFFFFFFFFFFFn);
    const U64$mul = a0 => a1 => ((a0 * a1) & 0xFFFFFFFFFFFFFFFFn);

    function Word$bit_length$go$(_word$2, _c$3, _n$4) {
        var Word$bit_length$go$ = (_word$2, _c$3, _n$4) => ({
            ctr: 'TCO',
            arg: [_word$2, _c$3, _n$4]
        });
        var Word$bit_length$go = _word$2 => _c$3 => _n$4 => Word$bit_length$go$(_word$2, _c$3, _n$4);
        var arg = [_word$2, _c$3, _n$4];
        while (true) {
            let [_word$2, _c$3, _n$4] = arg;
            var R = (() => {
                var self = _word$2;
                switch (self._) {
                    case 'Word.o':
                        var $2655 = self.pred;
                        var $2656 = Word$bit_length$go$($2655, Nat$succ$(_c$3), _n$4);
                        return $2656;
                    case 'Word.i':
                        var $2657 = self.pred;
                        var $2658 = Word$bit_length$go$($2657, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $2658;
                    case 'Word.e':
                        var $2659 = _n$4;
                        return $2659;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $2660 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $2660;
    };
    const Word$bit_length = x0 => Word$bit_length$(x0);
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $2662 = Bool$false;
                var $2661 = $2662;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $2663 = Bool$true;
                var $2661 = $2663;
                break;
        };
        return $2661;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $2664 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $2664;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $2666 = self.pred;
                var $2667 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $2669 = self.pred;
                            var $2670 = (_a$pred$9 => {
                                var $2671 = Word$o$(Word$or$(_a$pred$9, $2669));
                                return $2671;
                            });
                            var $2668 = $2670;
                            break;
                        case 'Word.i':
                            var $2672 = self.pred;
                            var $2673 = (_a$pred$9 => {
                                var $2674 = Word$i$(Word$or$(_a$pred$9, $2672));
                                return $2674;
                            });
                            var $2668 = $2673;
                            break;
                        case 'Word.e':
                            var $2675 = (_a$pred$7 => {
                                var $2676 = Word$e;
                                return $2676;
                            });
                            var $2668 = $2675;
                            break;
                    };
                    var $2668 = $2668($2666);
                    return $2668;
                });
                var $2665 = $2667;
                break;
            case 'Word.i':
                var $2677 = self.pred;
                var $2678 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $2680 = self.pred;
                            var $2681 = (_a$pred$9 => {
                                var $2682 = Word$i$(Word$or$(_a$pred$9, $2680));
                                return $2682;
                            });
                            var $2679 = $2681;
                            break;
                        case 'Word.i':
                            var $2683 = self.pred;
                            var $2684 = (_a$pred$9 => {
                                var $2685 = Word$i$(Word$or$(_a$pred$9, $2683));
                                return $2685;
                            });
                            var $2679 = $2684;
                            break;
                        case 'Word.e':
                            var $2686 = (_a$pred$7 => {
                                var $2687 = Word$e;
                                return $2687;
                            });
                            var $2679 = $2686;
                            break;
                    };
                    var $2679 = $2679($2677);
                    return $2679;
                });
                var $2665 = $2678;
                break;
            case 'Word.e':
                var $2688 = (_b$4 => {
                    var $2689 = Word$e;
                    return $2689;
                });
                var $2665 = $2688;
                break;
        };
        var $2665 = $2665(_b$3);
        return $2665;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right$one$go$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $2691 = self.pred;
                var $2692 = Word$o$(Word$shift_right$one$go$($2691));
                var $2690 = $2692;
                break;
            case 'Word.i':
                var $2693 = self.pred;
                var $2694 = Word$i$(Word$shift_right$one$go$($2693));
                var $2690 = $2694;
                break;
            case 'Word.e':
                var $2695 = Word$o$(Word$e);
                var $2690 = $2695;
                break;
        };
        return $2690;
    };
    const Word$shift_right$one$go = x0 => Word$shift_right$one$go$(x0);

    function Word$shift_right$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $2697 = self.pred;
                var $2698 = Word$shift_right$one$go$($2697);
                var $2696 = $2698;
                break;
            case 'Word.i':
                var $2699 = self.pred;
                var $2700 = Word$shift_right$one$go$($2699);
                var $2696 = $2700;
                break;
            case 'Word.e':
                var $2701 = Word$e;
                var $2696 = $2701;
                break;
        };
        return $2696;
    };
    const Word$shift_right$one = x0 => Word$shift_right$one$(x0);

    function Word$shift_right$(_value$2, _n$3) {
        var Word$shift_right$ = (_value$2, _n$3) => ({
            ctr: 'TCO',
            arg: [_value$2, _n$3]
        });
        var Word$shift_right = _value$2 => _n$3 => Word$shift_right$(_value$2, _n$3);
        var arg = [_value$2, _n$3];
        while (true) {
            let [_value$2, _n$3] = arg;
            var R = (() => {
                var self = _n$3;
                if (self === 0n) {
                    var $2702 = _value$2;
                    return $2702;
                } else {
                    var $2703 = (self - 1n);
                    var $2704 = Word$shift_right$(Word$shift_right$one$(_value$2), $2703);
                    return $2704;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$shift_right = x0 => x1 => Word$shift_right$(x0, x1);

    function Word$div$go$(_shift$2, _sub_copy$3, _shift_copy$4, _value$5) {
        var Word$div$go$ = (_shift$2, _sub_copy$3, _shift_copy$4, _value$5) => ({
            ctr: 'TCO',
            arg: [_shift$2, _sub_copy$3, _shift_copy$4, _value$5]
        });
        var Word$div$go = _shift$2 => _sub_copy$3 => _shift_copy$4 => _value$5 => Word$div$go$(_shift$2, _sub_copy$3, _shift_copy$4, _value$5);
        var arg = [_shift$2, _sub_copy$3, _shift_copy$4, _value$5];
        while (true) {
            let [_shift$2, _sub_copy$3, _shift_copy$4, _value$5] = arg;
            var R = (() => {
                var self = Word$gte$(_sub_copy$3, _shift_copy$4);
                if (self) {
                    var _mask$6 = Word$shift_left$(Word$inc$(Word$to_zero$(_sub_copy$3)), _shift$2);
                    var $2705 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $2705;
                } else {
                    var $2706 = Pair$new$(Bool$false, _value$5);
                    var self = $2706;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $2707 = self.fst;
                        var $2708 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $2710 = $2708;
                            var $2709 = $2710;
                        } else {
                            var $2711 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right$(_shift_copy$4, 1n);
                            var self = $2707;
                            if (self) {
                                var $2713 = Word$div$go$($2711, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $2708);
                                var $2712 = $2713;
                            } else {
                                var $2714 = Word$div$go$($2711, _sub_copy$3, _new_shift_copy$9, $2708);
                                var $2712 = $2714;
                            };
                            var $2709 = $2712;
                        };
                        return $2709;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$div$go = x0 => x1 => x2 => x3 => Word$div$go$(x0, x1, x2, x3);

    function Word$div$(_a$2, _b$3) {
        var _a_bits$4 = Word$bit_length$(_a$2);
        var _b_bits$5 = Word$bit_length$(_b$3);
        var self = (_a_bits$4 < _b_bits$5);
        if (self) {
            var $2716 = Word$to_zero$(_a$2);
            var $2715 = $2716;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_b$3, _shift$6);
            var $2717 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $2715 = $2717;
        };
        return $2715;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U64$div = a0 => a1 => ((a0 / a1) & 0xFFFFFFFFFFFFFFFFn);

    function Word$mod$(_a$2, _b$3) {
        var _q$4 = Word$div$(_a$2, _b$3);
        var $2718 = Word$sub$(_a$2, Word$mul$(_b$3, _q$4));
        return $2718;
    };
    const Word$mod = x0 => x1 => Word$mod$(x0, x1);
    const U64$mod = a0 => a1 => (a0 % a1);
    const U64$or = a0 => a1 => (a0 | a1);

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $2720 = self.pred;
                var $2721 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $2723 = self.pred;
                            var $2724 = (_a$pred$9 => {
                                var $2725 = Word$o$(Word$and$(_a$pred$9, $2723));
                                return $2725;
                            });
                            var $2722 = $2724;
                            break;
                        case 'Word.i':
                            var $2726 = self.pred;
                            var $2727 = (_a$pred$9 => {
                                var $2728 = Word$o$(Word$and$(_a$pred$9, $2726));
                                return $2728;
                            });
                            var $2722 = $2727;
                            break;
                        case 'Word.e':
                            var $2729 = (_a$pred$7 => {
                                var $2730 = Word$e;
                                return $2730;
                            });
                            var $2722 = $2729;
                            break;
                    };
                    var $2722 = $2722($2720);
                    return $2722;
                });
                var $2719 = $2721;
                break;
            case 'Word.i':
                var $2731 = self.pred;
                var $2732 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $2734 = self.pred;
                            var $2735 = (_a$pred$9 => {
                                var $2736 = Word$o$(Word$and$(_a$pred$9, $2734));
                                return $2736;
                            });
                            var $2733 = $2735;
                            break;
                        case 'Word.i':
                            var $2737 = self.pred;
                            var $2738 = (_a$pred$9 => {
                                var $2739 = Word$i$(Word$and$(_a$pred$9, $2737));
                                return $2739;
                            });
                            var $2733 = $2738;
                            break;
                        case 'Word.e':
                            var $2740 = (_a$pred$7 => {
                                var $2741 = Word$e;
                                return $2741;
                            });
                            var $2733 = $2740;
                            break;
                    };
                    var $2733 = $2733($2731);
                    return $2733;
                });
                var $2719 = $2732;
                break;
            case 'Word.e':
                var $2742 = (_b$4 => {
                    var $2743 = Word$e;
                    return $2743;
                });
                var $2719 = $2742;
                break;
        };
        var $2719 = $2719(_b$3);
        return $2719;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U64$and = a0 => a1 => (a0 & a1);

    function Word$xor$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $2745 = self.pred;
                var $2746 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $2748 = self.pred;
                            var $2749 = (_a$pred$9 => {
                                var $2750 = Word$o$(Word$xor$(_a$pred$9, $2748));
                                return $2750;
                            });
                            var $2747 = $2749;
                            break;
                        case 'Word.i':
                            var $2751 = self.pred;
                            var $2752 = (_a$pred$9 => {
                                var $2753 = Word$i$(Word$xor$(_a$pred$9, $2751));
                                return $2753;
                            });
                            var $2747 = $2752;
                            break;
                        case 'Word.e':
                            var $2754 = (_a$pred$7 => {
                                var $2755 = Word$e;
                                return $2755;
                            });
                            var $2747 = $2754;
                            break;
                    };
                    var $2747 = $2747($2745);
                    return $2747;
                });
                var $2744 = $2746;
                break;
            case 'Word.i':
                var $2756 = self.pred;
                var $2757 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $2759 = self.pred;
                            var $2760 = (_a$pred$9 => {
                                var $2761 = Word$i$(Word$xor$(_a$pred$9, $2759));
                                return $2761;
                            });
                            var $2758 = $2760;
                            break;
                        case 'Word.i':
                            var $2762 = self.pred;
                            var $2763 = (_a$pred$9 => {
                                var $2764 = Word$o$(Word$xor$(_a$pred$9, $2762));
                                return $2764;
                            });
                            var $2758 = $2763;
                            break;
                        case 'Word.e':
                            var $2765 = (_a$pred$7 => {
                                var $2766 = Word$e;
                                return $2766;
                            });
                            var $2758 = $2765;
                            break;
                    };
                    var $2758 = $2758($2756);
                    return $2758;
                });
                var $2744 = $2757;
                break;
            case 'Word.e':
                var $2767 = (_b$4 => {
                    var $2768 = Word$e;
                    return $2768;
                });
                var $2744 = $2767;
                break;
        };
        var $2744 = $2744(_b$3);
        return $2744;
    };
    const Word$xor = x0 => x1 => Word$xor$(x0, x1);
    const U64$xor = a0 => a1 => (a0 ^ a1);

    function Litereum$reduce$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'Litereum.Runtime.new':
                var $2770 = self.world;
                var $2771 = self.subst;
                var $2772 = self.fresh;
                var $2773 = self.gas;
                var $2774 = self.term;
                var self = $2774;
                switch (self._) {
                    case 'Litereum.Term.var':
                        var $2776 = self.name;
                        var _term$8 = Maybe$default$(Map$get$($2776, $2771), $2774);
                        var $2777 = Litereum$reduce$(Litereum$Runtime$new$($2770, $2771, $2772, $2773, _term$8));
                        var $2775 = $2777;
                        break;
                    case 'Litereum.Term.call':
                        var $2778 = self.bond;
                        var $2779 = self.args;
                        var self = Litereum$get_bond$($2770, $2778);
                        switch (self._) {
                            case 'Maybe.some':
                                var $2781 = self.value;
                                var _bond$10 = $2781;
                                var self = _bond$10;
                                switch (self._) {
                                    case 'Litereum.Bond.new':
                                        var $2783 = self.input_names;
                                        var $2784 = self.main;
                                        var self = Litereum$rename$many$(Map$from_list$(List$nil), $2772, $2783);
                                        switch (self._) {
                                            case 'Triple.new':
                                                var $2786 = self.fst;
                                                var $2787 = self.snd;
                                                var $2788 = self.trd;
                                                var self = Litereum$sanitize$($2770, $2786, $2787, $2784);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $2790 = self.fst;
                                                        var $2791 = self.snd;
                                                        var _subst$22 = Litereum$extend$($2771, $2788, $2779);
                                                        var $2792 = Litereum$reduce$(Litereum$Runtime$new$($2770, _subst$22, $2790, $2773, $2791));
                                                        var $2789 = $2792;
                                                        break;
                                                };
                                                var $2785 = $2789;
                                                break;
                                        };
                                        var $2782 = $2785;
                                        break;
                                };
                                var $2780 = $2782;
                                break;
                            case 'Maybe.none':
                                var $2793 = _state$1;
                                var $2780 = $2793;
                                break;
                        };
                        var $2775 = $2780;
                        break;
                    case 'Litereum.Term.let':
                        var $2794 = self.name;
                        var $2795 = self.expr;
                        var $2796 = self.body;
                        var $2797 = Litereum$reduce$(Litereum$Runtime$new$($2770, Map$set$($2794, $2795, $2771), $2772, $2773, $2796));
                        var $2775 = $2797;
                        break;
                    case 'Litereum.Term.match':
                        var $2798 = self.name;
                        var $2799 = self.data;
                        var $2800 = self.cses;
                        var self = Litereum$reduce$(Litereum$Runtime$new$($2770, $2771, $2772, $2773, Maybe$default$(Map$get$($2798, $2771), Litereum$Term$word$(0n))));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $2802 = self.world;
                                var $2803 = self.subst;
                                var $2804 = self.fresh;
                                var $2805 = self.gas;
                                var $2806 = self.term;
                                var self = $2806;
                                switch (self._) {
                                    case 'Litereum.Term.create':
                                        var $2808 = self.ctor;
                                        var $2809 = self.vals;
                                        var self = Litereum$get_data$($2802, $2799);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $2811 = self.value;
                                                var _data$18 = $2811;
                                                var self = _data$18;
                                                switch (self._) {
                                                    case 'Litereum.Data.new':
                                                        var self = Litereum$get_constructor_value$(_data$18, $2808);
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $2814 = self.value;
                                                                var _ctor$22 = $2814;
                                                                var self = _ctor$22;
                                                                switch (self._) {
                                                                    case 'Litereum.Constructor.new':
                                                                        var self = Litereum$get_constructor_index$(_data$18, $2808);
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $2817 = self.value;
                                                                                var self = List$get$($2817, $2800);
                                                                                switch (self._) {
                                                                                    case 'Maybe.some':
                                                                                        var $2819 = self.value;
                                                                                        var _nams$28 = List$map$(a1 => (($2798 + ".") + a1), (() => {
                                                                                            var self = _ctor$22;
                                                                                            switch (self._) {
                                                                                                case 'Litereum.Constructor.new':
                                                                                                    var $2821 = self.field_names;
                                                                                                    var $2822 = $2821;
                                                                                                    return $2822;
                                                                                            };
                                                                                        })());
                                                                                        var _subst$29 = Litereum$extend$($2803, _nams$28, $2809);
                                                                                        var $2820 = Litereum$reduce$(Litereum$Runtime$new$($2802, _subst$29, $2804, $2805, $2819));
                                                                                        var $2818 = $2820;
                                                                                        break;
                                                                                    case 'Maybe.none':
                                                                                        var $2823 = _state$1;
                                                                                        var $2818 = $2823;
                                                                                        break;
                                                                                };
                                                                                var $2816 = $2818;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $2824 = _state$1;
                                                                                var $2816 = $2824;
                                                                                break;
                                                                        };
                                                                        var $2815 = $2816;
                                                                        break;
                                                                };
                                                                var $2813 = $2815;
                                                                break;
                                                            case 'Maybe.none':
                                                                var $2825 = _state$1;
                                                                var $2813 = $2825;
                                                                break;
                                                        };
                                                        var $2812 = $2813;
                                                        break;
                                                };
                                                var $2810 = $2812;
                                                break;
                                            case 'Maybe.none':
                                                var $2826 = _state$1;
                                                var $2810 = $2826;
                                                break;
                                        };
                                        var $2807 = $2810;
                                        break;
                                    case 'Litereum.Term.var':
                                    case 'Litereum.Term.call':
                                    case 'Litereum.Term.let':
                                    case 'Litereum.Term.match':
                                    case 'Litereum.Term.word':
                                    case 'Litereum.Term.compare':
                                    case 'Litereum.Term.operate':
                                    case 'Litereum.Term.bind':
                                        var $2827 = _state$1;
                                        var $2807 = $2827;
                                        break;
                                };
                                var $2801 = $2807;
                                break;
                        };
                        var $2775 = $2801;
                        break;
                    case 'Litereum.Term.compare':
                        var $2828 = self.val0;
                        var $2829 = self.val1;
                        var $2830 = self.iflt;
                        var $2831 = self.ifeq;
                        var $2832 = self.ifgt;
                        var self = Litereum$reduce$(Litereum$Runtime$new$($2770, $2771, $2772, $2773, $2828));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $2834 = self.world;
                                var $2835 = self.subst;
                                var $2836 = self.fresh;
                                var $2837 = self.gas;
                                var $2838 = self.term;
                                var self = Litereum$reduce$(Litereum$Runtime$new$($2834, $2835, $2836, $2837, $2829));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $2840 = self.world;
                                        var $2841 = self.subst;
                                        var $2842 = self.fresh;
                                        var $2843 = self.gas;
                                        var $2844 = self.term;
                                        var self = $2838;
                                        switch (self._) {
                                            case 'Litereum.Term.word':
                                                var $2846 = self.numb;
                                                var self = $2844;
                                                switch (self._) {
                                                    case 'Litereum.Term.word':
                                                        var $2848 = self.numb;
                                                        var self = U64$cmp$($2846, $2848);
                                                        switch (self._) {
                                                            case 'Cmp.ltn':
                                                                var $2850 = Litereum$reduce$(Litereum$Runtime$new$($2840, $2841, $2842, $2843, $2830));
                                                                var $2849 = $2850;
                                                                break;
                                                            case 'Cmp.eql':
                                                                var $2851 = Litereum$reduce$(Litereum$Runtime$new$($2840, $2841, $2842, $2843, $2831));
                                                                var $2849 = $2851;
                                                                break;
                                                            case 'Cmp.gtn':
                                                                var $2852 = Litereum$reduce$(Litereum$Runtime$new$($2840, $2841, $2842, $2843, $2832));
                                                                var $2849 = $2852;
                                                                break;
                                                        };
                                                        var $2847 = $2849;
                                                        break;
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.bind':
                                                        var $2853 = _state$1;
                                                        var $2847 = $2853;
                                                        break;
                                                };
                                                var $2845 = $2847;
                                                break;
                                            case 'Litereum.Term.var':
                                                var self = $2844;
                                                switch (self._) {
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.word':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.bind':
                                                        var $2855 = _state$1;
                                                        var $2854 = $2855;
                                                        break;
                                                };
                                                var $2845 = $2854;
                                                break;
                                            case 'Litereum.Term.call':
                                            case 'Litereum.Term.create':
                                                var self = $2844;
                                                switch (self._) {
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.word':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.bind':
                                                        var $2857 = _state$1;
                                                        var $2856 = $2857;
                                                        break;
                                                };
                                                var $2845 = $2856;
                                                break;
                                            case 'Litereum.Term.let':
                                                var self = $2844;
                                                switch (self._) {
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.word':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.bind':
                                                        var $2859 = _state$1;
                                                        var $2858 = $2859;
                                                        break;
                                                };
                                                var $2845 = $2858;
                                                break;
                                            case 'Litereum.Term.match':
                                            case 'Litereum.Term.operate':
                                            case 'Litereum.Term.bind':
                                                var self = $2844;
                                                switch (self._) {
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.word':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.bind':
                                                        var $2861 = _state$1;
                                                        var $2860 = $2861;
                                                        break;
                                                };
                                                var $2845 = $2860;
                                                break;
                                            case 'Litereum.Term.compare':
                                                var self = $2844;
                                                switch (self._) {
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.word':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.bind':
                                                        var $2863 = _state$1;
                                                        var $2862 = $2863;
                                                        break;
                                                };
                                                var $2845 = $2862;
                                                break;
                                        };
                                        var $2839 = $2845;
                                        break;
                                };
                                var $2833 = $2839;
                                break;
                        };
                        var $2775 = $2833;
                        break;
                    case 'Litereum.Term.operate':
                        var $2864 = self.oper;
                        var $2865 = self.val0;
                        var $2866 = self.val1;
                        var self = Litereum$reduce$(Litereum$Runtime$new$($2770, $2771, $2772, $2773, $2865));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $2868 = self.world;
                                var $2869 = self.subst;
                                var $2870 = self.fresh;
                                var $2871 = self.gas;
                                var $2872 = self.term;
                                var self = Litereum$reduce$(Litereum$Runtime$new$($2868, $2869, $2870, $2871, $2866));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $2874 = self.world;
                                        var $2875 = self.subst;
                                        var $2876 = self.fresh;
                                        var $2877 = self.gas;
                                        var $2878 = self.term;
                                        var self = $2872;
                                        switch (self._) {
                                            case 'Litereum.Term.word':
                                                var $2880 = self.numb;
                                                var self = $2878;
                                                switch (self._) {
                                                    case 'Litereum.Term.word':
                                                        var $2882 = self.numb;
                                                        var self = $2864;
                                                        switch (self._) {
                                                            case 'Litereum.Operation.add':
                                                                var $2884 = Litereum$Runtime$new$($2874, $2875, $2876, $2877, Litereum$Term$word$((($2880 + $2882) & 0xFFFFFFFFFFFFFFFFn)));
                                                                var $2883 = $2884;
                                                                break;
                                                            case 'Litereum.Operation.sub':
                                                                var $2885 = Litereum$Runtime$new$($2874, $2875, $2876, $2877, Litereum$Term$word$((($2880 - $2882) & 0xFFFFFFFFFFFFFFFFn)));
                                                                var $2883 = $2885;
                                                                break;
                                                            case 'Litereum.Operation.mul':
                                                                var $2886 = Litereum$Runtime$new$($2874, $2875, $2876, $2877, Litereum$Term$word$((($2880 * $2882) & 0xFFFFFFFFFFFFFFFFn)));
                                                                var $2883 = $2886;
                                                                break;
                                                            case 'Litereum.Operation.div':
                                                                var $2887 = Litereum$Runtime$new$($2874, $2875, $2876, $2877, Litereum$Term$word$((($2880 / $2882) & 0xFFFFFFFFFFFFFFFFn)));
                                                                var $2883 = $2887;
                                                                break;
                                                            case 'Litereum.Operation.mod':
                                                                var $2888 = Litereum$Runtime$new$($2874, $2875, $2876, $2877, Litereum$Term$word$(($2880 % $2882)));
                                                                var $2883 = $2888;
                                                                break;
                                                            case 'Litereum.Operation.or':
                                                                var $2889 = Litereum$Runtime$new$($2874, $2875, $2876, $2877, Litereum$Term$word$(($2880 | $2882)));
                                                                var $2883 = $2889;
                                                                break;
                                                            case 'Litereum.Operation.and':
                                                                var $2890 = Litereum$Runtime$new$($2874, $2875, $2876, $2877, Litereum$Term$word$(($2880 & $2882)));
                                                                var $2883 = $2890;
                                                                break;
                                                            case 'Litereum.Operation.xor':
                                                                var $2891 = Litereum$Runtime$new$($2874, $2875, $2876, $2877, Litereum$Term$word$(($2880 ^ $2882)));
                                                                var $2883 = $2891;
                                                                break;
                                                        };
                                                        var $2881 = $2883;
                                                        break;
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.bind':
                                                        var $2892 = _state$1;
                                                        var $2881 = $2892;
                                                        break;
                                                };
                                                var $2879 = $2881;
                                                break;
                                            case 'Litereum.Term.var':
                                                var self = $2878;
                                                switch (self._) {
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.word':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.bind':
                                                        var $2894 = _state$1;
                                                        var $2893 = $2894;
                                                        break;
                                                };
                                                var $2879 = $2893;
                                                break;
                                            case 'Litereum.Term.call':
                                            case 'Litereum.Term.create':
                                                var self = $2878;
                                                switch (self._) {
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.word':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.bind':
                                                        var $2896 = _state$1;
                                                        var $2895 = $2896;
                                                        break;
                                                };
                                                var $2879 = $2895;
                                                break;
                                            case 'Litereum.Term.let':
                                                var self = $2878;
                                                switch (self._) {
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.word':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.bind':
                                                        var $2898 = _state$1;
                                                        var $2897 = $2898;
                                                        break;
                                                };
                                                var $2879 = $2897;
                                                break;
                                            case 'Litereum.Term.match':
                                            case 'Litereum.Term.operate':
                                            case 'Litereum.Term.bind':
                                                var self = $2878;
                                                switch (self._) {
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.word':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.bind':
                                                        var $2900 = _state$1;
                                                        var $2899 = $2900;
                                                        break;
                                                };
                                                var $2879 = $2899;
                                                break;
                                            case 'Litereum.Term.compare':
                                                var self = $2878;
                                                switch (self._) {
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.word':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.bind':
                                                        var $2902 = _state$1;
                                                        var $2901 = $2902;
                                                        break;
                                                };
                                                var $2879 = $2901;
                                                break;
                                        };
                                        var $2873 = $2879;
                                        break;
                                };
                                var $2867 = $2873;
                                break;
                        };
                        var $2775 = $2867;
                        break;
                    case 'Litereum.Term.bind':
                        var $2903 = self.name;
                        var $2904 = self.main;
                        var $2905 = self.body;
                        var self = Litereum$get_bond$($2770, $2903);
                        switch (self._) {
                            case 'Maybe.some':
                                var $2907 = self.value;
                                var _bond$11 = $2907;
                                var self = _bond$11;
                                switch (self._) {
                                    case 'Litereum.Bond.new':
                                        var $2909 = self.input_names;
                                        var _nams$18 = $2909;
                                        var _vals$19 = List$map$(Litereum$Term$var, $2909);
                                        var self = _state$1;
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $2911 = self.world;
                                                var $2912 = self.subst;
                                                var $2913 = self.fresh;
                                                var $2914 = self.gas;
                                                var self = Litereum$normalize$(Litereum$Runtime$new$($2911, Litereum$extend$($2912, _nams$18, _vals$19), $2913, $2914, $2904));
                                                switch (self._) {
                                                    case 'Litereum.Runtime.new':
                                                        var $2916 = self.world;
                                                        var $2917 = self.fresh;
                                                        var $2918 = self.gas;
                                                        var $2919 = self.term;
                                                        var _new_entry$30 = Litereum$Entry$bond$((() => {
                                                            var self = _bond$11;
                                                            switch (self._) {
                                                                case 'Litereum.Bond.new':
                                                                    var $2921 = self.name;
                                                                    var $2922 = self.input_names;
                                                                    var $2923 = self.input_types;
                                                                    var $2924 = self.output_type;
                                                                    var $2925 = self.owners;
                                                                    var $2926 = Litereum$Bond$new$($2921, $2922, $2923, $2924, $2919, $2925);
                                                                    return $2926;
                                                            };
                                                        })());
                                                        var self = $2916;
                                                        switch (self._) {
                                                            case 'Litereum.World.new':
                                                                var $2927 = self.name_count;
                                                                var $2928 = self.name_to_index;
                                                                var $2929 = self.index_to_name;
                                                                var $2930 = Litereum$World$new$($2927, $2928, $2929, Map$set$($2903, _new_entry$30, (() => {
                                                                    var self = $2916;
                                                                    switch (self._) {
                                                                        case 'Litereum.World.new':
                                                                            var $2931 = self.entry;
                                                                            var $2932 = $2931;
                                                                            return $2932;
                                                                    };
                                                                })()));
                                                                var _new_world$31 = $2930;
                                                                break;
                                                        };
                                                        var $2920 = Litereum$reduce$(Litereum$Runtime$new$(_new_world$31, $2912, $2917, $2918, $2905));
                                                        var $2915 = $2920;
                                                        break;
                                                };
                                                var $2910 = $2915;
                                                break;
                                        };
                                        var $2908 = $2910;
                                        break;
                                };
                                var $2906 = $2908;
                                break;
                            case 'Maybe.none':
                                var $2933 = _state$1;
                                var $2906 = $2933;
                                break;
                        };
                        var $2775 = $2906;
                        break;
                    case 'Litereum.Term.create':
                    case 'Litereum.Term.word':
                        var $2934 = _state$1;
                        var $2775 = $2934;
                        break;
                };
                var $2769 = $2775;
                break;
        };
        return $2769;
    };
    const Litereum$reduce = x0 => Litereum$reduce$(x0);

    function Litereum$normalize$many$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'Litereum.Runtime.new':
                var $2936 = self.world;
                var $2937 = self.subst;
                var $2938 = self.fresh;
                var $2939 = self.gas;
                var $2940 = self.term;
                var self = $2940;
                switch (self._) {
                    case 'List.cons':
                        var $2942 = self.head;
                        var $2943 = self.tail;
                        var self = Litereum$normalize$(Litereum$Runtime$new$($2936, $2937, $2938, $2939, $2942));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $2945 = self.world;
                                var $2946 = self.subst;
                                var $2947 = self.fresh;
                                var $2948 = self.gas;
                                var $2949 = self.term;
                                var self = Litereum$normalize$many$(Litereum$Runtime$new$($2945, $2946, $2947, $2948, $2943));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $2951 = self.world;
                                        var $2952 = self.subst;
                                        var $2953 = self.fresh;
                                        var $2954 = self.gas;
                                        var $2955 = self.term;
                                        var $2956 = Litereum$Runtime$new$($2951, $2952, $2953, $2954, List$cons$($2949, $2955));
                                        var $2950 = $2956;
                                        break;
                                };
                                var $2944 = $2950;
                                break;
                        };
                        var $2941 = $2944;
                        break;
                    case 'List.nil':
                        var $2957 = _state$1;
                        var $2941 = $2957;
                        break;
                };
                var $2935 = $2941;
                break;
        };
        return $2935;
    };
    const Litereum$normalize$many = x0 => Litereum$normalize$many$(x0);

    function Litereum$normalize$cases$(_ctrs$1, _name$2, _state$3) {
        var self = _state$3;
        switch (self._) {
            case 'Litereum.Runtime.new':
                var $2959 = self.world;
                var $2960 = self.subst;
                var $2961 = self.fresh;
                var $2962 = self.gas;
                var $2963 = self.term;
                var self = _ctrs$1;
                switch (self._) {
                    case 'List.cons':
                        var $2965 = self.head;
                        var $2966 = self.tail;
                        var self = $2963;
                        switch (self._) {
                            case 'List.cons':
                                var $2968 = self.head;
                                var $2969 = self.tail;
                                var _nams$13 = List$map$(a1 => ((_name$2 + ".") + a1), (() => {
                                    var self = $2965;
                                    switch (self._) {
                                        case 'Litereum.Constructor.new':
                                            var $2971 = self.field_names;
                                            var $2972 = $2971;
                                            return $2972;
                                    };
                                })());
                                var _vals$14 = List$map$(Litereum$Term$var, _nams$13);
                                var _subst$15 = Litereum$extend$($2960, _nams$13, _vals$14);
                                var self = Litereum$normalize$(Litereum$Runtime$new$($2959, _subst$15, $2961, $2962, $2968));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $2973 = self.world;
                                        var $2974 = self.subst;
                                        var $2975 = self.fresh;
                                        var $2976 = self.gas;
                                        var $2977 = self.term;
                                        var self = Litereum$normalize$cases$($2966, _name$2, Litereum$Runtime$new$($2973, $2974, $2975, $2976, $2969));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $2979 = self.world;
                                                var $2980 = self.subst;
                                                var $2981 = self.fresh;
                                                var $2982 = self.gas;
                                                var $2983 = self.term;
                                                var $2984 = Litereum$Runtime$new$($2979, $2980, $2981, $2982, List$cons$($2977, $2983));
                                                var $2978 = $2984;
                                                break;
                                        };
                                        var $2970 = $2978;
                                        break;
                                };
                                var $2967 = $2970;
                                break;
                            case 'List.nil':
                                var $2985 = _state$3;
                                var $2967 = $2985;
                                break;
                        };
                        var $2964 = $2967;
                        break;
                    case 'List.nil':
                        var self = $2963;
                        switch (self._) {
                            case 'List.nil':
                            case 'List.cons':
                                var $2987 = _state$3;
                                var $2986 = $2987;
                                break;
                        };
                        var $2964 = $2986;
                        break;
                };
                var $2958 = $2964;
                break;
        };
        return $2958;
    };
    const Litereum$normalize$cases = x0 => x1 => x2 => Litereum$normalize$cases$(x0, x1, x2);

    function Litereum$normalize$(_state$1) {
        var self = Litereum$reduce$(_state$1);
        switch (self._) {
            case 'Litereum.Runtime.new':
                var $2989 = self.world;
                var $2990 = self.subst;
                var $2991 = self.fresh;
                var $2992 = self.gas;
                var $2993 = self.term;
                var self = $2993;
                switch (self._) {
                    case 'Litereum.Term.create':
                        var $2995 = self.ctor;
                        var $2996 = self.vals;
                        var self = Litereum$normalize$many$(Litereum$Runtime$new$($2989, $2990, $2991, $2992, $2996));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $2998 = self.world;
                                var $2999 = self.subst;
                                var $3000 = self.fresh;
                                var $3001 = self.gas;
                                var $3002 = self.term;
                                var $3003 = Litereum$Runtime$new$($2998, $2999, $3000, $3001, Litereum$Term$create$($2995, $3002));
                                var $2997 = $3003;
                                break;
                        };
                        var $2994 = $2997;
                        break;
                    case 'Litereum.Term.match':
                        var $3004 = self.name;
                        var $3005 = self.data;
                        var $3006 = self.cses;
                        var self = Litereum$get_constructors$($2989, $3005);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3008 = self.value;
                                var _ctrs$11 = $3008;
                                var self = _ctrs$11;
                                switch (self._) {
                                    case 'List.nil':
                                        var self = Litereum$normalize$cases$(_ctrs$11, $3004, Litereum$Runtime$new$($2989, $2990, $2991, $2992, $3006));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $3011 = self.world;
                                                var $3012 = self.subst;
                                                var $3013 = self.fresh;
                                                var $3014 = self.gas;
                                                var $3015 = self.term;
                                                var $3016 = Litereum$Runtime$new$($3011, $3012, $3013, $3014, Litereum$Term$match$($3004, $3005, $3015));
                                                var $3010 = $3016;
                                                break;
                                        };
                                        var $3009 = $3010;
                                        break;
                                    case 'List.cons':
                                        var self = Litereum$normalize$cases$(_ctrs$11, $3004, Litereum$Runtime$new$($2989, $2990, $2991, $2992, $3006));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $3018 = self.world;
                                                var $3019 = self.subst;
                                                var $3020 = self.fresh;
                                                var $3021 = self.gas;
                                                var $3022 = self.term;
                                                var $3023 = Litereum$Runtime$new$($3018, $3019, $3020, $3021, Litereum$Term$match$($3004, $3005, $3022));
                                                var $3017 = $3023;
                                                break;
                                        };
                                        var $3009 = $3017;
                                        break;
                                };
                                var $3007 = $3009;
                                break;
                            case 'Maybe.none':
                                var $3024 = Litereum$Runtime$new$($2989, $2990, $2991, $2992, $2993);
                                var $3007 = $3024;
                                break;
                        };
                        var $2994 = $3007;
                        break;
                    case 'Litereum.Term.compare':
                        var $3025 = self.val0;
                        var $3026 = self.val1;
                        var $3027 = self.iflt;
                        var $3028 = self.ifeq;
                        var $3029 = self.ifgt;
                        var self = Litereum$normalize$(Litereum$Runtime$new$($2989, $2990, $2991, $2992, $3025));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3031 = self.world;
                                var $3032 = self.subst;
                                var $3033 = self.fresh;
                                var $3034 = self.gas;
                                var $3035 = self.term;
                                var self = Litereum$normalize$(Litereum$Runtime$new$($3031, $3032, $3033, $3034, $3026));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $3037 = self.world;
                                        var $3038 = self.subst;
                                        var $3039 = self.fresh;
                                        var $3040 = self.gas;
                                        var $3041 = self.term;
                                        var self = Litereum$normalize$(Litereum$Runtime$new$($3037, $3038, $3039, $3040, $3027));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $3043 = self.world;
                                                var $3044 = self.subst;
                                                var $3045 = self.fresh;
                                                var $3046 = self.gas;
                                                var $3047 = self.term;
                                                var self = Litereum$normalize$(Litereum$Runtime$new$($3043, $3044, $3045, $3046, $3028));
                                                switch (self._) {
                                                    case 'Litereum.Runtime.new':
                                                        var $3049 = self.world;
                                                        var $3050 = self.subst;
                                                        var $3051 = self.fresh;
                                                        var $3052 = self.gas;
                                                        var $3053 = self.term;
                                                        var self = Litereum$normalize$(Litereum$Runtime$new$($3049, $3050, $3051, $3052, $3029));
                                                        switch (self._) {
                                                            case 'Litereum.Runtime.new':
                                                                var $3055 = self.world;
                                                                var $3056 = self.subst;
                                                                var $3057 = self.fresh;
                                                                var $3058 = self.gas;
                                                                var $3059 = self.term;
                                                                var $3060 = Litereum$Runtime$new$($3055, $3056, $3057, $3058, Litereum$Term$compare$($3035, $3041, $3047, $3053, $3059));
                                                                var $3054 = $3060;
                                                                break;
                                                        };
                                                        var $3048 = $3054;
                                                        break;
                                                };
                                                var $3042 = $3048;
                                                break;
                                        };
                                        var $3036 = $3042;
                                        break;
                                };
                                var $3030 = $3036;
                                break;
                        };
                        var $2994 = $3030;
                        break;
                    case 'Litereum.Term.operate':
                        var $3061 = self.oper;
                        var $3062 = self.val0;
                        var $3063 = self.val1;
                        var self = Litereum$normalize$(Litereum$Runtime$new$($2989, $2990, $2991, $2992, $3062));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3065 = self.world;
                                var $3066 = self.subst;
                                var $3067 = self.fresh;
                                var $3068 = self.gas;
                                var $3069 = self.term;
                                var self = Litereum$normalize$(Litereum$Runtime$new$($3065, $3066, $3067, $3068, $3063));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $3071 = self.world;
                                        var $3072 = self.subst;
                                        var $3073 = self.fresh;
                                        var $3074 = self.gas;
                                        var $3075 = self.term;
                                        var $3076 = Litereum$Runtime$new$($3071, $3072, $3073, $3074, Litereum$Term$operate$($3061, $3069, $3075));
                                        var $3070 = $3076;
                                        break;
                                };
                                var $3064 = $3070;
                                break;
                        };
                        var $2994 = $3064;
                        break;
                    case 'Litereum.Term.var':
                    case 'Litereum.Term.call':
                    case 'Litereum.Term.let':
                    case 'Litereum.Term.word':
                    case 'Litereum.Term.bind':
                        var $3077 = Litereum$Runtime$new$($2989, $2990, $2991, $2992, $2993);
                        var $2994 = $3077;
                        break;
                };
                var $2988 = $2994;
                break;
        };
        return $2988;
    };
    const Litereum$normalize = x0 => Litereum$normalize$(x0);

    function String$flatten$go$(_xs$1, _res$2) {
        var String$flatten$go$ = (_xs$1, _res$2) => ({
            ctr: 'TCO',
            arg: [_xs$1, _res$2]
        });
        var String$flatten$go = _xs$1 => _res$2 => String$flatten$go$(_xs$1, _res$2);
        var arg = [_xs$1, _res$2];
        while (true) {
            let [_xs$1, _res$2] = arg;
            var R = (() => {
                var self = _xs$1;
                switch (self._) {
                    case 'List.cons':
                        var $3078 = self.head;
                        var $3079 = self.tail;
                        var $3080 = String$flatten$go$($3079, (_res$2 + $3078));
                        return $3080;
                    case 'List.nil':
                        var $3081 = _res$2;
                        return $3081;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$flatten$go = x0 => x1 => String$flatten$go$(x0, x1);

    function String$flatten$(_xs$1) {
        var $3082 = String$flatten$go$(_xs$1, "");
        return $3082;
    };
    const String$flatten = x0 => String$flatten$(x0);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $3084 = self.head;
                var $3085 = self.tail;
                var $3086 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $3087 = "";
                        return $3087;
                    } else {
                        var $3088 = _sep$1;
                        return $3088;
                    };
                })(), List$cons$($3084, List$cons$(String$join$go$(_sep$1, $3085, Bool$false), List$nil))));
                var $3083 = $3086;
                break;
            case 'List.nil':
                var $3089 = "";
                var $3083 = $3089;
                break;
        };
        return $3083;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $3090 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $3090;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function Litereum$show$type$(_world$1, _type$2) {
        var self = _type$2;
        switch (self._) {
            case 'Litereum.Type.data':
                var $3092 = self.name;
                var $3093 = $3092;
                var $3091 = $3093;
                break;
            case 'Litereum.Type.word':
                var $3094 = "#word";
                var $3091 = $3094;
                break;
        };
        return $3091;
    };
    const Litereum$show$type = x0 => x1 => Litereum$show$type$(x0, x1);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $3096 = self.pred;
                var $3097 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $3096));
                var $3095 = $3097;
                break;
            case 'Word.i':
                var $3098 = self.pred;
                var $3099 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $3098));
                var $3095 = $3099;
                break;
            case 'Word.e':
                var $3100 = _nil$3;
                var $3095 = $3100;
                break;
        };
        return $3095;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);

    function Word$to_nat$(_word$2) {
        var $3101 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $3102 = Nat$succ$((2n * _x$4));
            return $3102;
        }), _word$2);
        return $3101;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function Word$show$(_size$1, _a$2) {
        var $3103 = Nat$show$(Word$to_nat$(_a$2));
        return $3103;
    };
    const Word$show = x0 => x1 => Word$show$(x0, x1);
    const U64$show = a0 => (String(a0));

    function Litereum$show$term$(_world$1, _term$2) {
        var self = _term$2;
        switch (self._) {
            case 'Litereum.Term.var':
                var $3105 = self.name;
                var $3106 = $3105;
                var $3104 = $3106;
                break;
            case 'Litereum.Term.call':
                var $3107 = self.bond;
                var $3108 = self.args;
                var _bond$5 = $3107;
                var _args$6 = List$map$(Litereum$show$term(_world$1), $3108);
                var $3109 = (_bond$5 + ("(" + (String$join$(",", _args$6) + ")")));
                var $3104 = $3109;
                break;
            case 'Litereum.Term.let':
                var $3110 = self.name;
                var $3111 = self.type;
                var $3112 = self.expr;
                var $3113 = self.body;
                var _name$7 = $3110;
                var _type$8 = Litereum$show$type$(_world$1, $3111);
                var _expr$9 = Litereum$show$term$(_world$1, $3112);
                var _body$10 = Litereum$show$term$(_world$1, $3113);
                var $3114 = ("let " + (_name$7 + (" : " + (_type$8 + (" = " + (_expr$9 + (" " + _body$10)))))));
                var $3104 = $3114;
                break;
            case 'Litereum.Term.create':
                var $3115 = self.ctor;
                var $3116 = self.vals;
                var _vals$5 = List$mapped$($3116, Litereum$show$term(_world$1));
                var $3117 = ($3115 + ("{" + (String$join$(",", _vals$5) + "}")));
                var $3104 = $3117;
                break;
            case 'Litereum.Term.match':
                var $3118 = self.name;
                var $3119 = self.data;
                var $3120 = self.cses;
                var self = Litereum$get_data$(_world$1, $3119);
                switch (self._) {
                    case 'Maybe.some':
                        var $3122 = self.value;
                        var _data$7 = $3122;
                        var self = _data$7;
                        switch (self._) {
                            case 'Litereum.Data.new':
                                var $3124 = self.constructors;
                                var _name$10 = $3118;
                                var _cses$11 = List$zipped_with$($3124, $3120, (_case_ctor$11 => _case_body$12 => {
                                    var $3126 = ((() => {
                                        var self = _case_ctor$11;
                                        switch (self._) {
                                            case 'Litereum.Constructor.new':
                                                var $3127 = self.name;
                                                var $3128 = $3127;
                                                return $3128;
                                        };
                                    })() + (": " + Litereum$show$term$(_world$1, _case_body$12)));
                                    return $3126;
                                }));
                                var $3125 = ("case " + (_name$10 + (" : " + ($3119 + (" { " + (String$join$(", ", _cses$11) + " }"))))));
                                var $3123 = $3125;
                                break;
                        };
                        var $3121 = $3123;
                        break;
                    case 'Maybe.none':
                        var $3129 = "?";
                        var $3121 = $3129;
                        break;
                };
                var $3104 = $3121;
                break;
            case 'Litereum.Term.word':
                var $3130 = self.numb;
                var $3131 = ("#" + (String($3130)));
                var $3104 = $3131;
                break;
            case 'Litereum.Term.compare':
                var $3132 = self.val0;
                var $3133 = self.val1;
                var $3134 = self.iflt;
                var $3135 = self.ifeq;
                var $3136 = self.ifgt;
                var _val0$8 = Litereum$show$term$(_world$1, $3132);
                var _val1$9 = Litereum$show$term$(_world$1, $3133);
                var _iflt$10 = Litereum$show$term$(_world$1, $3134);
                var _ifeq$11 = Litereum$show$term$(_world$1, $3135);
                var _ifgt$12 = Litereum$show$term$(_world$1, $3136);
                var $3137 = ("compare " + (_val0$8 + (" " + (_val1$9 + (" { _<_: " + (_iflt$10 + (" _=_: " + (_ifeq$11 + (" _>_: " + (_ifgt$12 + " }"))))))))));
                var $3104 = $3137;
                break;
            case 'Litereum.Term.operate':
                var $3138 = self.oper;
                var $3139 = self.val0;
                var $3140 = self.val1;
                var self = $3138;
                switch (self._) {
                    case 'Litereum.Operation.add':
                        var $3142 = "+";
                        var _oper$6 = $3142;
                        break;
                    case 'Litereum.Operation.sub':
                        var $3143 = "-";
                        var _oper$6 = $3143;
                        break;
                    case 'Litereum.Operation.mul':
                        var $3144 = "*";
                        var _oper$6 = $3144;
                        break;
                    case 'Litereum.Operation.div':
                        var $3145 = "/";
                        var _oper$6 = $3145;
                        break;
                    case 'Litereum.Operation.mod':
                        var $3146 = "%";
                        var _oper$6 = $3146;
                        break;
                    case 'Litereum.Operation.or':
                        var $3147 = "|";
                        var _oper$6 = $3147;
                        break;
                    case 'Litereum.Operation.and':
                        var $3148 = "&";
                        var _oper$6 = $3148;
                        break;
                    case 'Litereum.Operation.xor':
                        var $3149 = "^";
                        var _oper$6 = $3149;
                        break;
                };
                var _val0$7 = Litereum$show$term$(_world$1, $3139);
                var _val1$8 = Litereum$show$term$(_world$1, $3140);
                var $3141 = (_oper$6 + ("(" + (_val0$7 + ("," + (_val1$8 + ")")))));
                var $3104 = $3141;
                break;
            case 'Litereum.Term.bind':
                var $3150 = self.name;
                var $3151 = self.main;
                var $3152 = self.body;
                var _name$6 = $3150;
                var _main$7 = Litereum$show$term$(_world$1, $3151);
                var _body$8 = Litereum$show$term$(_world$1, $3152);
                var $3153 = ("bind " + (_name$6 + (" { " + (_main$7 + (" } " + _body$8)))));
                var $3104 = $3153;
                break;
        };
        return $3104;
    };
    const Litereum$show$term = x0 => x1 => Litereum$show$term$(x0, x1);

    function Litereum$run$(_world$1, _transaction$2, _bipass$3) {
        var self = _world$1;
        switch (self._) {
            case 'Litereum.World.new':
                var $3155 = self.name_count;
                var $3156 = self.name_to_index;
                var $3157 = self.index_to_name;
                var $3158 = self.entry;
                var self = _transaction$2;
                switch (self._) {
                    case 'Litereum.Transaction.new_name':
                        var $3160 = self.name;
                        var _name$9 = $3160;
                        var self = Map$get$(_name$9, (() => {
                            var self = _world$1;
                            switch (self._) {
                                case 'Litereum.World.new':
                                    var $3162 = self.name_to_index;
                                    var $3163 = $3162;
                                    return $3163;
                            };
                        })());
                        switch (self._) {
                            case 'Maybe.none':
                                var self = _world$1;
                                switch (self._) {
                                    case 'Litereum.World.new':
                                        var $3165 = self.name_to_index;
                                        var $3166 = self.index_to_name;
                                        var $3167 = self.entry;
                                        var $3168 = Litereum$World$new$(($3155 + 1n), $3165, $3166, $3167);
                                        var _world$10 = $3168;
                                        break;
                                };
                                var self = _world$10;
                                switch (self._) {
                                    case 'Litereum.World.new':
                                        var $3169 = self.name_count;
                                        var $3170 = self.index_to_name;
                                        var $3171 = self.entry;
                                        var $3172 = Litereum$World$new$($3169, Map$set$(_name$9, $3155, $3156), $3170, $3171);
                                        var _world$11 = $3172;
                                        break;
                                };
                                var self = _world$11;
                                switch (self._) {
                                    case 'Litereum.World.new':
                                        var $3173 = self.name_count;
                                        var $3174 = self.name_to_index;
                                        var $3175 = self.entry;
                                        var $3176 = Litereum$World$new$($3173, $3174, Map$set$(Nat$show$($3155), _name$9, $3157), $3175);
                                        var _world$12 = $3176;
                                        break;
                                };
                                var $3164 = Maybe$some$(_world$12);
                                var $3161 = $3164;
                                break;
                            case 'Maybe.some':
                                var $3177 = Maybe$none;
                                var $3161 = $3177;
                                break;
                        };
                        var $3159 = $3161;
                        break;
                    case 'Litereum.Transaction.new_data':
                        var $3178 = self.data;
                        var _data$9 = $3178;
                        var self = _data$9;
                        switch (self._) {
                            case 'Litereum.Data.new':
                                var $3180 = self.name;
                                var self = Map$get$($3180, $3158);
                                switch (self._) {
                                    case 'Maybe.none':
                                        var self = _bipass$3;
                                        if (self) {
                                            var $3183 = Unit$new;
                                            var _logger$12 = $3183;
                                        } else {
                                            var $3184 = ((console.log(("- data " + $3180)), (_$12 => {
                                                var $3185 = Unit$new;
                                                return $3185;
                                            })()));
                                            var _logger$12 = $3184;
                                        };
                                        var self = _world$1;
                                        switch (self._) {
                                            case 'Litereum.World.new':
                                                var $3186 = self.name_count;
                                                var $3187 = self.name_to_index;
                                                var $3188 = self.index_to_name;
                                                var $3189 = Litereum$World$new$($3186, $3187, $3188, Map$set$($3180, Litereum$Entry$data$(_data$9), $3158));
                                                var _world$13 = $3189;
                                                break;
                                        };
                                        var $3182 = Maybe$some$(_world$13);
                                        var $3181 = $3182;
                                        break;
                                    case 'Maybe.some':
                                        var $3190 = Maybe$none;
                                        var $3181 = $3190;
                                        break;
                                };
                                var $3179 = $3181;
                                break;
                        };
                        var $3159 = $3179;
                        break;
                    case 'Litereum.Transaction.new_bond':
                        var $3191 = self.bond;
                        var _bond$9 = $3191;
                        var self = _bond$9;
                        switch (self._) {
                            case 'Litereum.Bond.new':
                                var $3193 = self.name;
                                var $3194 = self.input_names;
                                var $3195 = self.input_types;
                                var $3196 = self.output_type;
                                var $3197 = self.main;
                                var self = Map$get$($3193, $3158);
                                switch (self._) {
                                    case 'Maybe.none':
                                        var self = _world$1;
                                        switch (self._) {
                                            case 'Litereum.World.new':
                                                var $3200 = self.name_count;
                                                var $3201 = self.name_to_index;
                                                var $3202 = self.index_to_name;
                                                var $3203 = Litereum$World$new$($3200, $3201, $3202, Map$set$($3193, Litereum$Entry$bond$(_bond$9), $3158));
                                                var _world$16 = $3203;
                                                break;
                                        };
                                        var _context$17 = Litereum$extend$(Map$from_list$(List$nil), $3194, $3195);
                                        var self = _bipass$3;
                                        if (self) {
                                            var $3204 = Maybe$some$(_world$16);
                                            var $3199 = $3204;
                                        } else {
                                            var self = Litereum$check$(_context$17, _world$16, $3197, $3196);
                                            if (self) {
                                                var self = _bipass$3;
                                                if (self) {
                                                    var $3207 = Unit$new;
                                                    var _logger$18 = $3207;
                                                } else {
                                                    var $3208 = ((console.log(("- bond " + $3193)), (_$18 => {
                                                        var $3209 = Unit$new;
                                                        return $3209;
                                                    })()));
                                                    var _logger$18 = $3208;
                                                };
                                                var $3206 = Maybe$some$(_world$16);
                                                var $3205 = $3206;
                                            } else {
                                                var self = _bipass$3;
                                                if (self) {
                                                    var $3211 = Unit$new;
                                                    var _logger$18 = $3211;
                                                } else {
                                                    var $3212 = ((console.log(("- bond error: ill-typed bond " + $3193)), (_$18 => {
                                                        var $3213 = Unit$new;
                                                        return $3213;
                                                    })()));
                                                    var _logger$18 = $3212;
                                                };
                                                var $3210 = Maybe$none;
                                                var $3205 = $3210;
                                            };
                                            var $3199 = $3205;
                                        };
                                        var $3198 = $3199;
                                        break;
                                    case 'Maybe.some':
                                        var self = _bipass$3;
                                        if (self) {
                                            var $3215 = Unit$new;
                                            var _logger$17 = $3215;
                                        } else {
                                            var $3216 = ((console.log(("- bond error: redefinition of " + $3193)), (_$17 => {
                                                var $3217 = Unit$new;
                                                return $3217;
                                            })()));
                                            var _logger$17 = $3216;
                                        };
                                        var $3214 = Maybe$none;
                                        var $3198 = $3214;
                                        break;
                                };
                                var $3192 = $3198;
                                break;
                        };
                        var $3159 = $3192;
                        break;
                    case 'Litereum.Transaction.new_eval':
                        var $3218 = self.eval;
                        var _eval$9 = $3218;
                        var self = _eval$9;
                        switch (self._) {
                            case 'Litereum.Eval.new':
                                var $3220 = self.term;
                                var $3221 = self.type;
                                var self = _bipass$3;
                                if (self) {
                                    var $3223 = Maybe$some$(_world$1);
                                    var $3222 = $3223;
                                } else {
                                    var self = Litereum$check$(Map$from_list$(List$nil), _world$1, $3220, $3221);
                                    if (self) {
                                        var self = Litereum$normalize$(Litereum$Runtime$new$(_world$1, Map$from_list$(List$nil), 0n, 0n, $3220));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $3226 = self.world;
                                                var $3227 = self.term;
                                                var self = _bipass$3;
                                                if (self) {
                                                    var $3229 = Unit$new;
                                                    var _logger$17 = $3229;
                                                } else {
                                                    var $3230 = ((console.log(("- eval " + Litereum$show$term$($3226, $3227))), (_$17 => {
                                                        var $3231 = Unit$new;
                                                        return $3231;
                                                    })()));
                                                    var _logger$17 = $3230;
                                                };
                                                var $3228 = Maybe$some$($3226);
                                                var $3225 = $3228;
                                                break;
                                        };
                                        var $3224 = $3225;
                                    } else {
                                        var self = _bipass$3;
                                        if (self) {
                                            var $3233 = Unit$new;
                                            var _logger$12 = $3233;
                                        } else {
                                            var $3234 = ((console.log("- eval error: ill-typed term"), (_$12 => {
                                                var $3235 = Unit$new;
                                                return $3235;
                                            })()));
                                            var _logger$12 = $3234;
                                        };
                                        var $3232 = Maybe$none;
                                        var $3224 = $3232;
                                    };
                                    var $3222 = $3224;
                                };
                                var $3219 = $3222;
                                break;
                        };
                        var $3159 = $3219;
                        break;
                };
                var $3154 = $3159;
                break;
        };
        return $3154;
    };
    const Litereum$run = x0 => x1 => x2 => Litereum$run$(x0, x1, x2);

    function Litereum$reg$(_world$1, _transaction$2) {
        var $3236 = Maybe$default$(Litereum$run$(_world$1, _transaction$2, Bool$true), _world$1);
        return $3236;
    };
    const Litereum$reg = x0 => x1 => Litereum$reg$(x0, x1);

    function Litereum$parse$block$(_world$1) {
        var $3237 = Parser$choice(List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $3239 = self.err;
                    var _reply$8 = Litereum$parse$transaction$(_world$1)(_pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $3241 = self.err;
                            var self = $3239;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $3243 = self.value;
                                    var $3244 = Parser$Reply$error$(Parser$Error$combine$($3243, $3241));
                                    var $3242 = $3244;
                                    break;
                                case 'Maybe.none':
                                    var $3245 = Parser$Reply$error$($3241);
                                    var $3242 = $3245;
                                    break;
                            };
                            var $3240 = $3242;
                            break;
                        case 'Parser.Reply.value':
                            var $3246 = self.pst;
                            var $3247 = self.val;
                            var self = $3246;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $3249 = self.err;
                                    var $3250 = self.nam;
                                    var $3251 = self.ini;
                                    var $3252 = self.idx;
                                    var $3253 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($3239, $3249), $3250, $3251, $3252, $3253);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $3255 = self.err;
                                            var _reply$22 = Litereum$parse$block$(Litereum$reg$(_world$1, $3247))(_reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $3257 = self.err;
                                                    var self = $3255;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $3259 = self.value;
                                                            var $3260 = Parser$Reply$error$(Parser$Error$combine$($3259, $3257));
                                                            var $3258 = $3260;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $3261 = Parser$Reply$error$($3257);
                                                            var $3258 = $3261;
                                                            break;
                                                    };
                                                    var $3256 = $3258;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $3262 = self.pst;
                                                    var $3263 = self.val;
                                                    var self = $3262;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $3265 = self.err;
                                                            var $3266 = self.nam;
                                                            var $3267 = self.ini;
                                                            var $3268 = self.idx;
                                                            var $3269 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($3255, $3265), $3266, $3267, $3268, $3269);
                                                            var $3270 = Parser$Reply$value$(_reply$pst$30, List$cons$($3247, $3263));
                                                            var $3264 = $3270;
                                                            break;
                                                    };
                                                    var $3256 = $3264;
                                                    break;
                                            };
                                            var $3254 = $3256;
                                            break;
                                    };
                                    var $3248 = $3254;
                                    break;
                            };
                            var $3240 = $3248;
                            break;
                    };
                    var $3238 = $3240;
                    break;
            };
            return $3238;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $3272 = self.err;
                    var _reply$8 = Litereum$parse$ignore(_pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $3274 = self.err;
                            var self = $3272;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $3276 = self.value;
                                    var $3277 = Parser$Reply$error$(Parser$Error$combine$($3276, $3274));
                                    var $3275 = $3277;
                                    break;
                                case 'Maybe.none':
                                    var $3278 = Parser$Reply$error$($3274);
                                    var $3275 = $3278;
                                    break;
                            };
                            var $3273 = $3275;
                            break;
                        case 'Parser.Reply.value':
                            var $3279 = self.pst;
                            var self = $3279;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $3281 = self.err;
                                    var $3282 = self.nam;
                                    var $3283 = self.ini;
                                    var $3284 = self.idx;
                                    var $3285 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($3272, $3281), $3282, $3283, $3284, $3285);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $3287 = self.err;
                                            var _reply$22 = Parser$eof$(_reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $3289 = self.err;
                                                    var self = $3287;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $3291 = self.value;
                                                            var $3292 = Parser$Reply$error$(Parser$Error$combine$($3291, $3289));
                                                            var $3290 = $3292;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $3293 = Parser$Reply$error$($3289);
                                                            var $3290 = $3293;
                                                            break;
                                                    };
                                                    var $3288 = $3290;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $3294 = self.pst;
                                                    var self = $3294;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $3296 = self.err;
                                                            var $3297 = self.nam;
                                                            var $3298 = self.ini;
                                                            var $3299 = self.idx;
                                                            var $3300 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($3287, $3296), $3297, $3298, $3299, $3300);
                                                            var $3301 = Parser$Reply$value$(_reply$pst$30, List$nil);
                                                            var $3295 = $3301;
                                                            break;
                                                    };
                                                    var $3288 = $3295;
                                                    break;
                                            };
                                            var $3286 = $3288;
                                            break;
                                    };
                                    var $3280 = $3286;
                                    break;
                            };
                            var $3273 = $3280;
                            break;
                    };
                    var $3271 = $3273;
                    break;
            };
            return $3271;
        }), List$nil)));
        return $3237;
    };
    const Litereum$parse$block = x0 => Litereum$parse$block$(x0);

    function IO$(_A$1) {
        var $3302 = null;
        return $3302;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $3303 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $3303;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$end$(_value$2) {
        var $3304 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $3304;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$put_string$(_text$1) {
        var $3305 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $3306 = IO$end$(Unit$new);
            return $3306;
        }));
        return $3305;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function IO$print$(_text$1) {
        var $3307 = IO$put_string$((_text$1 + "\u{a}"));
        return $3307;
    };
    const IO$print = x0 => IO$print$(x0);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $3309 = self.value;
                var $3310 = _f$4($3309);
                var $3308 = $3310;
                break;
            case 'IO.ask':
                var $3311 = self.query;
                var $3312 = self.param;
                var $3313 = self.then;
                var $3314 = IO$ask$($3311, $3312, (_x$8 => {
                    var $3315 = IO$bind$($3313(_x$8), _f$4);
                    return $3315;
                }));
                var $3308 = $3314;
                break;
        };
        return $3308;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$monad$(_new$2) {
        var $3316 = _new$2(IO$bind)(IO$end);
        return $3316;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Litereum$show$constructor$(_world$1, _constructor$2) {
        var self = _constructor$2;
        switch (self._) {
            case 'Litereum.Constructor.new':
                var $3318 = self.name;
                var $3319 = self.field_names;
                var $3320 = self.field_types;
                var _names$6 = $3319;
                var _types$7 = List$mapped$($3320, Litereum$show$type(_world$1));
                var _fields$8 = List$zip_with$((_name$8 => _type$9 => {
                    var $3322 = (_name$8 + (": " + _type$9));
                    return $3322;
                }), _names$6, _types$7);
                var $3321 = ($3318 + ("{" + (String$join$(", ", _fields$8) + "}")));
                var $3317 = $3321;
                break;
        };
        return $3317;
    };
    const Litereum$show$constructor = x0 => x1 => Litereum$show$constructor$(x0, x1);

    function Litereum$show$data$(_world$1, _data$2) {
        var self = _data$2;
        switch (self._) {
            case 'Litereum.Data.new':
                var $3324 = self.name;
                var $3325 = self.constructors;
                var $3326 = ($3324 + (" { " + (String$join$(", ", List$mapped$($3325, Litereum$show$constructor(_world$1))) + " }")));
                var $3323 = $3326;
                break;
        };
        return $3323;
    };
    const Litereum$show$data = x0 => x1 => Litereum$show$data$(x0, x1);

    function Litereum$show$bond$(_world$1, _bond$2) {
        var self = _bond$2;
        switch (self._) {
            case 'Litereum.Bond.new':
                var $3328 = self.name;
                var $3329 = self.input_names;
                var $3330 = self.input_types;
                var $3331 = self.output_type;
                var $3332 = self.main;
                var $3333 = self.owners;
                var $3334 = ($3328 + ("(" + (String$join$(",", List$zipped_with$($3329, $3330, (_name$9 => _type$10 => {
                    var $3335 = (_name$9 + (": " + Litereum$show$type$(_world$1, _type$10)));
                    return $3335;
                }))) + ("): " + (Litereum$show$type$(_world$1, $3331) + (" { " + (Litereum$show$term$(_world$1, $3332) + (" }" + (() => {
                    var self = $3333;
                    switch (self._) {
                        case 'List.nil':
                            var $3336 = "";
                            return $3336;
                        case 'List.cons':
                            var $3337 = (" " + String$join$(" ", List$map$(a1 => ("@" + a1), $3333)));
                            return $3337;
                    };
                })()))))))));
                var $3327 = $3334;
                break;
        };
        return $3327;
    };
    const Litereum$show$bond = x0 => x1 => Litereum$show$bond$(x0, x1);

    function Litereum$show$eval$(_world$1, _eval$2) {
        var self = _eval$2;
        switch (self._) {
            case 'Litereum.Eval.new':
                var $3339 = self.term;
                var $3340 = self.type;
                var _term$5 = Litereum$show$term$(_world$1, $3339);
                var _type$6 = Litereum$show$type$(_world$1, $3340);
                var $3341 = ("{" + (_term$5 + ("} : " + _type$6)));
                var $3338 = $3341;
                break;
        };
        return $3338;
    };
    const Litereum$show$eval = x0 => x1 => Litereum$show$eval$(x0, x1);

    function Litereum$show$transaction$(_world$1, _transaction$2) {
        var self = _transaction$2;
        switch (self._) {
            case 'Litereum.Transaction.new_name':
                var $3343 = self.name;
                var $3344 = ("name " + $3343);
                var $3342 = $3344;
                break;
            case 'Litereum.Transaction.new_data':
                var $3345 = self.data;
                var $3346 = ("type " + Litereum$show$data$(_world$1, $3345));
                var $3342 = $3346;
                break;
            case 'Litereum.Transaction.new_bond':
                var $3347 = self.bond;
                var $3348 = ("bond " + Litereum$show$bond$(_world$1, $3347));
                var $3342 = $3348;
                break;
            case 'Litereum.Transaction.new_eval':
                var $3349 = self.eval;
                var $3350 = ("eval " + Litereum$show$eval$(_world$1, $3349));
                var $3342 = $3350;
                break;
        };
        return $3342;
    };
    const Litereum$show$transaction = x0 => x1 => Litereum$show$transaction$(x0, x1);

    function Litereum$show$block$(_world$1, _block$2) {
        var self = _block$2;
        switch (self._) {
            case 'List.cons':
                var $3352 = self.head;
                var $3353 = self.tail;
                var _head$5 = Litereum$show$transaction$(_world$1, $3352);
                var _tail$6 = Litereum$show$block$(Litereum$reg$(_world$1, $3352), $3353);
                var $3354 = ("- " + (_head$5 + ("\u{a}" + _tail$6)));
                var $3351 = $3354;
                break;
            case 'List.nil':
                var $3355 = "";
                var $3351 = $3355;
                break;
        };
        return $3351;
    };
    const Litereum$show$block = x0 => x1 => Litereum$show$block$(x0, x1);
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');

    function U16$new$(_value$1) {
        var $3356 = word_to_u16(_value$1);
        return $3356;
    };
    const U16$new = x0 => U16$new$(x0);
    const U16$sub = a0 => a1 => ((a0 - a1) & 0xFFFF);
    const U16$add = a0 => a1 => ((a0 + a1) & 0xFFFF);
    const Nat$to_u16 = a0 => (Number(a0) & 0xFFFF);
    const Nat$div = a0 => a1 => (a0 / a1);
    const Bits$i = a0 => (a0 + '1');

    function Litereum$serialize$fixlen$(_size$1, _value$2) {
        var self = _size$1;
        if (self === 0n) {
            var $3358 = Bits$e;
            var $3357 = $3358;
        } else {
            var $3359 = (self - 1n);
            var self = ((_value$2 % 2n) === 0n);
            if (self) {
                var $3361 = (Litereum$serialize$fixlen$($3359, (_value$2 / 2n)) + '0');
                var $3360 = $3361;
            } else {
                var $3362 = (Litereum$serialize$fixlen$($3359, (_value$2 / 2n)) + '1');
                var $3360 = $3362;
            };
            var $3357 = $3360;
        };
        return $3357;
    };
    const Litereum$serialize$fixlen = x0 => x1 => Litereum$serialize$fixlen$(x0, x1);
    const U16$to_nat = a0 => (BigInt(a0));
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Litereum$serialize$name$new$(_name$1) {
        var self = _name$1;
        if (self.length === 0) {
            var $3364 = (Bits$e + '0');
            var $3363 = $3364;
        } else {
            var $3365 = self.charCodeAt(0);
            var $3366 = self.slice(1);
            var self = U16$btw$(48, $3365, 57);
            if (self) {
                var $3368 = (($3365 - 48) & 0xFFFF);
                var _numb$4 = $3368;
            } else {
                var self = U16$btw$(65, $3365, 90);
                if (self) {
                    var $3370 = (((($3365 - 65) & 0xFFFF) + 10) & 0xFFFF);
                    var $3369 = $3370;
                } else {
                    var self = U16$btw$(97, $3365, 122);
                    if (self) {
                        var $3372 = (((($3365 - 97) & 0xFFFF) + 36) & 0xFFFF);
                        var $3371 = $3372;
                    } else {
                        var self = U16$btw$(95, $3365, 95);
                        if (self) {
                            var $3374 = 62;
                            var $3373 = $3374;
                        } else {
                            var $3375 = 63;
                            var $3373 = $3375;
                        };
                        var $3371 = $3373;
                    };
                    var $3369 = $3371;
                };
                var _numb$4 = $3369;
            };
            var _head$5 = Litereum$serialize$fixlen$(6n, (BigInt(_numb$4)));
            var _tail$6 = Litereum$serialize$name$new$($3366);
            var $3367 = ((_tail$6 + _head$5) + '1');
            var $3363 = $3367;
        };
        return $3363;
    };
    const Litereum$serialize$name$new = x0 => Litereum$serialize$name$new$(x0);

    function Litereum$serialize$varlen$go$(_value$1) {
        var self = _value$1;
        if (self === 0n) {
            var $3377 = Bits$e;
            var $3376 = $3377;
        } else {
            var $3378 = (self - 1n);
            var self = (_value$1 === 1n);
            if (self) {
                var $3380 = (Bits$e + '0');
                var $3379 = $3380;
            } else {
                var self = ((_value$1 % 2n) === 0n);
                if (self) {
                    var $3382 = ((Litereum$serialize$varlen$go$((_value$1 / 2n)) + '0') + '1');
                    var $3381 = $3382;
                } else {
                    var $3383 = ((Litereum$serialize$varlen$go$((_value$1 / 2n)) + '1') + '1');
                    var $3381 = $3383;
                };
                var $3379 = $3381;
            };
            var $3376 = $3379;
        };
        return $3376;
    };
    const Litereum$serialize$varlen$go = x0 => Litereum$serialize$varlen$go$(x0);

    function Litereum$serialize$varlen$(_value$1) {
        var $3384 = Litereum$serialize$varlen$go$((_value$1 + 1n));
        return $3384;
    };
    const Litereum$serialize$varlen = x0 => Litereum$serialize$varlen$(x0);

    function Litereum$serialize$name$old$(_world$1, _name$2) {
        var self = _world$1;
        switch (self._) {
            case 'Litereum.World.new':
                var $3386 = self.name_to_index;
                var self = Map$get$(_name$2, $3386);
                switch (self._) {
                    case 'Maybe.some':
                        var $3388 = self.value;
                        var _bits$8 = Litereum$serialize$varlen$($3388);
                        var $3389 = _bits$8;
                        var $3387 = $3389;
                        break;
                    case 'Maybe.none':
                        var $3390 = Bits$e;
                        var $3387 = $3390;
                        break;
                };
                var $3385 = $3387;
                break;
        };
        return $3385;
    };
    const Litereum$serialize$name$old = x0 => x1 => Litereum$serialize$name$old$(x0, x1);

    function Litereum$serialize$list$(_item$2, _list$3) {
        var self = _list$3;
        switch (self._) {
            case 'List.cons':
                var $3392 = self.head;
                var $3393 = self.tail;
                var $3394 = ((Litereum$serialize$list$(_item$2, $3393) + _item$2($3392)) + '1');
                var $3391 = $3394;
                break;
            case 'List.nil':
                var $3395 = (Bits$e + '0');
                var $3391 = $3395;
                break;
        };
        return $3391;
    };
    const Litereum$serialize$list = x0 => x1 => Litereum$serialize$list$(x0, x1);

    function Litereum$serialize$type$(_world$1, _typ$2) {
        var self = _typ$2;
        switch (self._) {
            case 'Litereum.Type.data':
                var $3397 = self.name;
                var $3398 = (Litereum$serialize$name$old$(_world$1, $3397) + '1');
                var $3396 = $3398;
                break;
            case 'Litereum.Type.word':
                var $3399 = (Bits$e + '0');
                var $3396 = $3399;
                break;
        };
        return $3396;
    };
    const Litereum$serialize$type = x0 => x1 => Litereum$serialize$type$(x0, x1);

    function Litereum$serialize$constructor$(_world$1, _ctor$2) {
        var self = _ctor$2;
        switch (self._) {
            case 'Litereum.Constructor.new':
                var $3401 = self.name;
                var $3402 = self.field_names;
                var $3403 = self.field_types;
                var _name$6 = Litereum$serialize$name$old$(_world$1, $3401);
                var _nams$7 = Litereum$serialize$list$(Litereum$serialize$name$old(_world$1), $3402);
                var _typs$8 = Litereum$serialize$list$(Litereum$serialize$type(_world$1), $3403);
                var $3404 = ((_typs$8 + _nams$7) + _name$6);
                var $3400 = $3404;
                break;
        };
        return $3400;
    };
    const Litereum$serialize$constructor = x0 => x1 => Litereum$serialize$constructor$(x0, x1);

    function Litereum$serialize$data$(_world$1, _data$2) {
        var self = _data$2;
        switch (self._) {
            case 'Litereum.Data.new':
                var $3406 = self.name;
                var $3407 = self.constructors;
                var _name$5 = Litereum$serialize$name$old$(_world$1, $3406);
                var _ctrs$6 = Litereum$serialize$list$(Litereum$serialize$constructor(_world$1), $3407);
                var $3408 = (_ctrs$6 + _name$5);
                var $3405 = $3408;
                break;
        };
        return $3405;
    };
    const Litereum$serialize$data = x0 => x1 => Litereum$serialize$data$(x0, x1);

    function List$find_index$go$(_xs$2, _f$3, _i$4) {
        var List$find_index$go$ = (_xs$2, _f$3, _i$4) => ({
            ctr: 'TCO',
            arg: [_xs$2, _f$3, _i$4]
        });
        var List$find_index$go = _xs$2 => _f$3 => _i$4 => List$find_index$go$(_xs$2, _f$3, _i$4);
        var arg = [_xs$2, _f$3, _i$4];
        while (true) {
            let [_xs$2, _f$3, _i$4] = arg;
            var R = (() => {
                var self = _xs$2;
                switch (self._) {
                    case 'List.cons':
                        var $3409 = self.head;
                        var $3410 = self.tail;
                        var self = _f$3($3409);
                        if (self) {
                            var $3412 = Maybe$some$(_i$4);
                            var $3411 = $3412;
                        } else {
                            var $3413 = List$find_index$go$($3410, _f$3, Nat$succ$(_i$4));
                            var $3411 = $3413;
                        };
                        return $3411;
                    case 'List.nil':
                        var $3414 = Maybe$none;
                        return $3414;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$find_index$go = x0 => x1 => x2 => List$find_index$go$(x0, x1, x2);

    function List$find_index$(_xs$2, _f$3) {
        var $3415 = List$find_index$go$(_xs$2, _f$3, Nat$zero);
        return $3415;
    };
    const List$find_index = x0 => x1 => List$find_index$(x0, x1);

    function Litereum$serialize$name$local$(_world$1, _vars$2, _name$3) {
        var self = List$find_index$(_vars$2, a1 => (_name$3 === a1));
        switch (self._) {
            case 'Maybe.some':
                var $3417 = self.value;
                var $3418 = Litereum$serialize$varlen$($3417);
                var $3416 = $3418;
                break;
            case 'Maybe.none':
                var $3419 = Bits$e;
                var $3416 = $3419;
                break;
        };
        return $3416;
    };
    const Litereum$serialize$name$local = x0 => x1 => x2 => Litereum$serialize$name$local$(x0, x1, x2);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $3421 = self.head;
                var $3422 = self.tail;
                var $3423 = List$cons$($3421, List$concat$($3422, _bs$3));
                var $3420 = $3423;
                break;
            case 'List.nil':
                var $3424 = _bs$3;
                var $3420 = $3424;
                break;
        };
        return $3420;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function Litereum$serialize$cases$(_world$1, _vars$2, _name$3, _ctors$4, _cases$5) {
        var self = _ctors$4;
        switch (self._) {
            case 'List.cons':
                var $3426 = self.head;
                var $3427 = self.tail;
                var self = _cases$5;
                switch (self._) {
                    case 'List.cons':
                        var $3429 = self.head;
                        var $3430 = self.tail;
                        var _flds$10 = List$map$(a1 => ((_name$3 + ".") + a1), (() => {
                            var self = $3426;
                            switch (self._) {
                                case 'Litereum.Constructor.new':
                                    var $3432 = self.field_names;
                                    var $3433 = $3432;
                                    return $3433;
                            };
                        })());
                        var _head$11 = Litereum$serialize$term$(_world$1, List$concat$(List$reverse$(_flds$10), _vars$2), $3429);
                        var _tail$12 = Litereum$serialize$cases$(_world$1, _vars$2, _name$3, $3427, $3430);
                        var $3431 = (_tail$12 + _head$11);
                        var $3428 = $3431;
                        break;
                    case 'List.nil':
                        var $3434 = Bits$e;
                        var $3428 = $3434;
                        break;
                };
                var $3425 = $3428;
                break;
            case 'List.nil':
                var self = _cases$5;
                switch (self._) {
                    case 'List.nil':
                    case 'List.cons':
                        var $3436 = Bits$e;
                        var $3435 = $3436;
                        break;
                };
                var $3425 = $3435;
                break;
        };
        return $3425;
    };
    const Litereum$serialize$cases = x0 => x1 => x2 => x3 => x4 => Litereum$serialize$cases$(x0, x1, x2, x3, x4);
    const U64$to_nat = a0 => (a0);

    function Litereum$serialize$term$(_world$1, _vars$2, _term$3) {
        var self = _term$3;
        switch (self._) {
            case 'Litereum.Term.var':
                var $3438 = self.name;
                var $3439 = (Litereum$serialize$name$local$(_world$1, _vars$2, $3438) + '0');
                var $3437 = $3439;
                break;
            case 'Litereum.Term.call':
                var $3440 = self.bond;
                var $3441 = self.args;
                var _bond$6 = Litereum$serialize$name$old$(_world$1, $3440);
                var _args$7 = Litereum$serialize$list$(Litereum$serialize$term(_world$1)(_vars$2), $3441);
                var $3442 = (((((_args$7 + _bond$6) + '0') + '0') + '1') + '1');
                var $3437 = $3442;
                break;
            case 'Litereum.Term.let':
                var $3443 = self.name;
                var $3444 = self.type;
                var $3445 = self.expr;
                var $3446 = self.body;
                var _name$8 = Litereum$serialize$name$old$(_world$1, $3443);
                var _type$9 = Litereum$serialize$type$(_world$1, $3444);
                var _expr$10 = Litereum$serialize$term$(_world$1, _vars$2, $3445);
                var _body$11 = Litereum$serialize$term$(_world$1, List$cons$($3443, _vars$2), $3446);
                var $3447 = (((((((_body$11 + _expr$10) + _type$9) + _name$8) + '0') + '0') + '0') + '1');
                var $3437 = $3447;
                break;
            case 'Litereum.Term.create':
                var $3448 = self.ctor;
                var $3449 = self.vals;
                var _ctor$6 = Litereum$serialize$name$old$(_world$1, $3448);
                var _vals$7 = Litereum$serialize$list$(Litereum$serialize$term(_world$1)(_vars$2), $3449);
                var $3450 = (((((_vals$7 + _ctor$6) + '0') + '1') + '0') + '1');
                var $3437 = $3450;
                break;
            case 'Litereum.Term.match':
                var $3451 = self.name;
                var $3452 = self.data;
                var $3453 = self.cses;
                var _name$7 = Litereum$serialize$name$local$(_world$1, _vars$2, $3451);
                var _data$8 = Litereum$serialize$name$old$(_world$1, $3452);
                var _cses$9 = Litereum$serialize$cases$(_world$1, _vars$2, $3451, Maybe$default$(Litereum$get_constructors$(_world$1, $3452), List$nil), $3453);
                var $3454 = ((((((_cses$9 + _data$8) + _name$7) + '0') + '1') + '1') + '1');
                var $3437 = $3454;
                break;
            case 'Litereum.Term.word':
                var $3455 = self.numb;
                var _numb$5 = Litereum$serialize$fixlen$(64n, ($3455));
                var $3456 = ((((_numb$5 + '1') + '0') + '0') + '1');
                var $3437 = $3456;
                break;
            case 'Litereum.Term.compare':
                var $3457 = self.val0;
                var $3458 = self.val1;
                var $3459 = self.iflt;
                var $3460 = self.ifeq;
                var $3461 = self.ifgt;
                var _val0$9 = Litereum$serialize$term$(_world$1, _vars$2, $3457);
                var _val1$10 = Litereum$serialize$term$(_world$1, _vars$2, $3458);
                var _iflt$11 = Litereum$serialize$term$(_world$1, _vars$2, $3459);
                var _ifeq$12 = Litereum$serialize$term$(_world$1, _vars$2, $3460);
                var _ifgt$13 = Litereum$serialize$term$(_world$1, _vars$2, $3461);
                var $3462 = ((((((((_ifgt$13 + _ifeq$12) + _iflt$11) + _val1$10) + _val0$9) + '1') + '0') + '1') + '1');
                var $3437 = $3462;
                break;
            case 'Litereum.Term.operate':
                var $3463 = self.oper;
                var $3464 = self.val0;
                var $3465 = self.val1;
                var _oper$7 = Litereum$serialize$fixlen$(3n, (() => {
                    var self = $3463;
                    switch (self._) {
                        case 'Litereum.Operation.add':
                            var $3467 = 0n;
                            return $3467;
                        case 'Litereum.Operation.sub':
                            var $3468 = 1n;
                            return $3468;
                        case 'Litereum.Operation.mul':
                            var $3469 = 2n;
                            return $3469;
                        case 'Litereum.Operation.div':
                            var $3470 = 3n;
                            return $3470;
                        case 'Litereum.Operation.mod':
                            var $3471 = 4n;
                            return $3471;
                        case 'Litereum.Operation.or':
                            var $3472 = 5n;
                            return $3472;
                        case 'Litereum.Operation.and':
                            var $3473 = 6n;
                            return $3473;
                        case 'Litereum.Operation.xor':
                            var $3474 = 7n;
                            return $3474;
                    };
                })());
                var _val0$8 = Litereum$serialize$term$(_world$1, _vars$2, $3464);
                var _val1$9 = Litereum$serialize$term$(_world$1, _vars$2, $3465);
                var $3466 = ((((((_val1$9 + _val0$8) + _oper$7) + '1') + '1') + '0') + '1');
                var $3437 = $3466;
                break;
            case 'Litereum.Term.bind':
                var $3475 = self.name;
                var $3476 = self.main;
                var $3477 = self.body;
                var self = Litereum$get_bond$(_world$1, $3475);
                switch (self._) {
                    case 'Maybe.some':
                        var $3479 = self.value;
                        var _bond$8 = $3479;
                        var self = _bond$8;
                        switch (self._) {
                            case 'Litereum.Bond.new':
                                var $3481 = self.input_names;
                                var _name$15 = Litereum$serialize$name$old$(_world$1, $3475);
                                var _vrs2$16 = List$concat$(List$reverse$($3481), _vars$2);
                                var _main$17 = Litereum$serialize$term$(_world$1, _vrs2$16, $3476);
                                var _body$18 = Litereum$serialize$term$(_world$1, _vars$2, $3477);
                                var $3482 = ((((((_body$18 + _main$17) + _name$15) + '1') + '1') + '1') + '1');
                                var $3480 = $3482;
                                break;
                        };
                        var $3478 = $3480;
                        break;
                    case 'Maybe.none':
                        var $3483 = Bits$e;
                        var $3478 = $3483;
                        break;
                };
                var $3437 = $3478;
                break;
        };
        return $3437;
    };
    const Litereum$serialize$term = x0 => x1 => x2 => Litereum$serialize$term$(x0, x1, x2);

    function Litereum$serialize$bond$(_world$1, _bond$2) {
        var self = _bond$2;
        switch (self._) {
            case 'Litereum.Bond.new':
                var $3485 = self.name;
                var $3486 = self.input_names;
                var $3487 = self.input_types;
                var $3488 = self.output_type;
                var $3489 = self.main;
                var $3490 = self.owners;
                var _name$9 = Litereum$serialize$name$old$(_world$1, $3485);
                var _input_names$10 = Litereum$serialize$list$(Litereum$serialize$name$old(_world$1), $3486);
                var _input_types$11 = Litereum$serialize$list$(Litereum$serialize$type(_world$1), $3487);
                var _output_type$12 = Litereum$serialize$type$(_world$1, $3488);
                var _main$13 = Litereum$serialize$term$(_world$1, List$reverse$($3486), $3489);
                var _owners$14 = Litereum$serialize$list$(Litereum$serialize$name$old(_world$1), $3490);
                var $3491 = (((((_owners$14 + _main$13) + _output_type$12) + _input_types$11) + _input_names$10) + _name$9);
                var $3484 = $3491;
                break;
        };
        return $3484;
    };
    const Litereum$serialize$bond = x0 => x1 => Litereum$serialize$bond$(x0, x1);

    function Litereum$serialize$eval$(_world$1, _eval$2) {
        var self = _eval$2;
        switch (self._) {
            case 'Litereum.Eval.new':
                var $3493 = self.term;
                var $3494 = self.type;
                var _term$5 = Litereum$serialize$term$(_world$1, List$nil, $3493);
                var _type$6 = Litereum$serialize$type$(_world$1, $3494);
                var $3495 = (_type$6 + _term$5);
                var $3492 = $3495;
                break;
        };
        return $3492;
    };
    const Litereum$serialize$eval = x0 => x1 => Litereum$serialize$eval$(x0, x1);

    function Litereum$serialize$transaction$(_world$1, _transaction$2) {
        var self = _transaction$2;
        switch (self._) {
            case 'Litereum.Transaction.new_name':
                var $3497 = self.name;
                var _name$4 = Litereum$serialize$name$new$($3497);
                var $3498 = ((_name$4 + '0') + '0');
                var $3496 = $3498;
                break;
            case 'Litereum.Transaction.new_data':
                var $3499 = self.data;
                var _data$4 = Litereum$serialize$data$(_world$1, $3499);
                var $3500 = ((_data$4 + '0') + '1');
                var $3496 = $3500;
                break;
            case 'Litereum.Transaction.new_bond':
                var $3501 = self.bond;
                var _bond$4 = Litereum$serialize$bond$(_world$1, $3501);
                var $3502 = ((_bond$4 + '1') + '0');
                var $3496 = $3502;
                break;
            case 'Litereum.Transaction.new_eval':
                var $3503 = self.eval;
                var _term$4 = Litereum$serialize$eval$(_world$1, $3503);
                var $3504 = ((_term$4 + '1') + '1');
                var $3496 = $3504;
                break;
        };
        return $3496;
    };
    const Litereum$serialize$transaction = x0 => x1 => Litereum$serialize$transaction$(x0, x1);

    function Litereum$serialize$block$(_world$1, _block$2) {
        var self = _block$2;
        switch (self._) {
            case 'List.cons':
                var $3506 = self.head;
                var $3507 = self.tail;
                var _head$5 = Litereum$serialize$transaction$(_world$1, $3506);
                var _tail$6 = Litereum$serialize$block$(Litereum$reg$(_world$1, $3506), $3507);
                var $3508 = (_tail$6 + _head$5);
                var $3505 = $3508;
                break;
            case 'List.nil':
                var $3509 = Bits$e;
                var $3505 = $3509;
                break;
        };
        return $3505;
    };
    const Litereum$serialize$block = x0 => x1 => Litereum$serialize$block$(x0, x1);

    function Bits$hex$encode$(_x$1) {
        var self = _x$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $3511 = self.slice(0, -1);
                var self = $3511;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $3513 = self.slice(0, -1);
                        var self = $3513;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $3515 = self.slice(0, -1);
                                var self = $3515;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3517 = self.slice(0, -1);
                                        var $3518 = ("0" + Bits$hex$encode$($3517));
                                        var $3516 = $3518;
                                        break;
                                    case 'i':
                                        var $3519 = self.slice(0, -1);
                                        var $3520 = ("8" + Bits$hex$encode$($3519));
                                        var $3516 = $3520;
                                        break;
                                    case 'e':
                                        var $3521 = "0";
                                        var $3516 = $3521;
                                        break;
                                };
                                var $3514 = $3516;
                                break;
                            case 'i':
                                var $3522 = self.slice(0, -1);
                                var self = $3522;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3524 = self.slice(0, -1);
                                        var $3525 = ("4" + Bits$hex$encode$($3524));
                                        var $3523 = $3525;
                                        break;
                                    case 'i':
                                        var $3526 = self.slice(0, -1);
                                        var $3527 = ("c" + Bits$hex$encode$($3526));
                                        var $3523 = $3527;
                                        break;
                                    case 'e':
                                        var $3528 = "4";
                                        var $3523 = $3528;
                                        break;
                                };
                                var $3514 = $3523;
                                break;
                            case 'e':
                                var $3529 = "0";
                                var $3514 = $3529;
                                break;
                        };
                        var $3512 = $3514;
                        break;
                    case 'i':
                        var $3530 = self.slice(0, -1);
                        var self = $3530;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $3532 = self.slice(0, -1);
                                var self = $3532;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3534 = self.slice(0, -1);
                                        var $3535 = ("2" + Bits$hex$encode$($3534));
                                        var $3533 = $3535;
                                        break;
                                    case 'i':
                                        var $3536 = self.slice(0, -1);
                                        var $3537 = ("a" + Bits$hex$encode$($3536));
                                        var $3533 = $3537;
                                        break;
                                    case 'e':
                                        var $3538 = "2";
                                        var $3533 = $3538;
                                        break;
                                };
                                var $3531 = $3533;
                                break;
                            case 'i':
                                var $3539 = self.slice(0, -1);
                                var self = $3539;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3541 = self.slice(0, -1);
                                        var $3542 = ("6" + Bits$hex$encode$($3541));
                                        var $3540 = $3542;
                                        break;
                                    case 'i':
                                        var $3543 = self.slice(0, -1);
                                        var $3544 = ("e" + Bits$hex$encode$($3543));
                                        var $3540 = $3544;
                                        break;
                                    case 'e':
                                        var $3545 = "6";
                                        var $3540 = $3545;
                                        break;
                                };
                                var $3531 = $3540;
                                break;
                            case 'e':
                                var $3546 = "2";
                                var $3531 = $3546;
                                break;
                        };
                        var $3512 = $3531;
                        break;
                    case 'e':
                        var $3547 = "0";
                        var $3512 = $3547;
                        break;
                };
                var $3510 = $3512;
                break;
            case 'i':
                var $3548 = self.slice(0, -1);
                var self = $3548;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $3550 = self.slice(0, -1);
                        var self = $3550;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $3552 = self.slice(0, -1);
                                var self = $3552;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3554 = self.slice(0, -1);
                                        var $3555 = ("1" + Bits$hex$encode$($3554));
                                        var $3553 = $3555;
                                        break;
                                    case 'i':
                                        var $3556 = self.slice(0, -1);
                                        var $3557 = ("9" + Bits$hex$encode$($3556));
                                        var $3553 = $3557;
                                        break;
                                    case 'e':
                                        var $3558 = "1";
                                        var $3553 = $3558;
                                        break;
                                };
                                var $3551 = $3553;
                                break;
                            case 'i':
                                var $3559 = self.slice(0, -1);
                                var self = $3559;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3561 = self.slice(0, -1);
                                        var $3562 = ("5" + Bits$hex$encode$($3561));
                                        var $3560 = $3562;
                                        break;
                                    case 'i':
                                        var $3563 = self.slice(0, -1);
                                        var $3564 = ("d" + Bits$hex$encode$($3563));
                                        var $3560 = $3564;
                                        break;
                                    case 'e':
                                        var $3565 = "5";
                                        var $3560 = $3565;
                                        break;
                                };
                                var $3551 = $3560;
                                break;
                            case 'e':
                                var $3566 = "1";
                                var $3551 = $3566;
                                break;
                        };
                        var $3549 = $3551;
                        break;
                    case 'i':
                        var $3567 = self.slice(0, -1);
                        var self = $3567;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $3569 = self.slice(0, -1);
                                var self = $3569;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3571 = self.slice(0, -1);
                                        var $3572 = ("3" + Bits$hex$encode$($3571));
                                        var $3570 = $3572;
                                        break;
                                    case 'i':
                                        var $3573 = self.slice(0, -1);
                                        var $3574 = ("b" + Bits$hex$encode$($3573));
                                        var $3570 = $3574;
                                        break;
                                    case 'e':
                                        var $3575 = "3";
                                        var $3570 = $3575;
                                        break;
                                };
                                var $3568 = $3570;
                                break;
                            case 'i':
                                var $3576 = self.slice(0, -1);
                                var self = $3576;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3578 = self.slice(0, -1);
                                        var $3579 = ("7" + Bits$hex$encode$($3578));
                                        var $3577 = $3579;
                                        break;
                                    case 'i':
                                        var $3580 = self.slice(0, -1);
                                        var $3581 = ("f" + Bits$hex$encode$($3580));
                                        var $3577 = $3581;
                                        break;
                                    case 'e':
                                        var $3582 = "7";
                                        var $3577 = $3582;
                                        break;
                                };
                                var $3568 = $3577;
                                break;
                            case 'e':
                                var $3583 = "3";
                                var $3568 = $3583;
                                break;
                        };
                        var $3549 = $3568;
                        break;
                    case 'e':
                        var $3584 = "1";
                        var $3549 = $3584;
                        break;
                };
                var $3510 = $3549;
                break;
            case 'e':
                var $3585 = "";
                var $3510 = $3585;
                break;
        };
        return $3510;
    };
    const Bits$hex$encode = x0 => Bits$hex$encode$(x0);

    function Bits$is_empty$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $3587 = Bool$true;
                var $3586 = $3587;
                break;
            case 'o':
            case 'i':
                var $3588 = Bool$false;
                var $3586 = $3588;
                break;
        };
        return $3586;
    };
    const Bits$is_empty = x0 => Bits$is_empty$(x0);

    function Litereum$deserialize$fixlen$(_size$1, _bits$2) {
        var self = _size$1;
        if (self === 0n) {
            var $3590 = Pair$new$(_bits$2, 0n);
            var $3589 = $3590;
        } else {
            var $3591 = (self - 1n);
            var self = _bits$2;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $3593 = self.slice(0, -1);
                    var self = Litereum$deserialize$fixlen$($3591, $3593);
                    switch (self._) {
                        case 'Pair.new':
                            var $3595 = self.fst;
                            var $3596 = self.snd;
                            var $3597 = Pair$new$($3595, ($3596 * 2n));
                            var $3594 = $3597;
                            break;
                    };
                    var $3592 = $3594;
                    break;
                case 'i':
                    var $3598 = self.slice(0, -1);
                    var self = Litereum$deserialize$fixlen$($3591, $3598);
                    switch (self._) {
                        case 'Pair.new':
                            var $3600 = self.fst;
                            var $3601 = self.snd;
                            var $3602 = Pair$new$($3600, (($3601 * 2n) + 1n));
                            var $3599 = $3602;
                            break;
                    };
                    var $3592 = $3599;
                    break;
                case 'e':
                    var $3603 = Pair$new$(Bits$e, 0n);
                    var $3592 = $3603;
                    break;
            };
            var $3589 = $3592;
        };
        return $3589;
    };
    const Litereum$deserialize$fixlen = x0 => x1 => Litereum$deserialize$fixlen$(x0, x1);
    const U16$from_nat = a0 => (Number(a0) & 0xFFFF);

    function Litereum$deserialize$name$new$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $3605 = self.slice(0, -1);
                var $3606 = Pair$new$($3605, "");
                var $3604 = $3606;
                break;
            case 'i':
                var $3607 = self.slice(0, -1);
                var self = Litereum$deserialize$fixlen$(6n, $3607);
                switch (self._) {
                    case 'Pair.new':
                        var $3609 = self.fst;
                        var $3610 = self.snd;
                        var self = Litereum$deserialize$name$new$($3609);
                        switch (self._) {
                            case 'Pair.new':
                                var $3612 = self.fst;
                                var $3613 = self.snd;
                                var _numb$7 = (Number($3610) & 0xFFFF);
                                var self = U16$btw$(0, _numb$7, 9);
                                if (self) {
                                    var $3615 = ((_numb$7 + 48) & 0xFFFF);
                                    var _head$8 = $3615;
                                } else {
                                    var self = U16$btw$(10, _numb$7, 35);
                                    if (self) {
                                        var $3617 = ((((_numb$7 - 10) & 0xFFFF) + 65) & 0xFFFF);
                                        var $3616 = $3617;
                                    } else {
                                        var self = U16$btw$(36, _numb$7, 61);
                                        if (self) {
                                            var $3619 = ((((_numb$7 - 36) & 0xFFFF) + 97) & 0xFFFF);
                                            var $3618 = $3619;
                                        } else {
                                            var self = U16$btw$(62, _numb$7, 62);
                                            if (self) {
                                                var $3621 = 95;
                                                var $3620 = $3621;
                                            } else {
                                                var $3622 = 46;
                                                var $3620 = $3622;
                                            };
                                            var $3618 = $3620;
                                        };
                                        var $3616 = $3618;
                                    };
                                    var _head$8 = $3616;
                                };
                                var $3614 = Pair$new$($3612, String$cons$(_head$8, $3613));
                                var $3611 = $3614;
                                break;
                        };
                        var $3608 = $3611;
                        break;
                };
                var $3604 = $3608;
                break;
            case 'e':
                var $3623 = Pair$new$(Bits$e, "");
                var $3604 = $3623;
                break;
        };
        return $3604;
    };
    const Litereum$deserialize$name$new = x0 => Litereum$deserialize$name$new$(x0);

    function Litereum$deserialize$varlen$go$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $3625 = self.slice(0, -1);
                var $3626 = Pair$new$($3625, 1n);
                var $3624 = $3626;
                break;
            case 'i':
                var $3627 = self.slice(0, -1);
                var self = $3627;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $3629 = self.slice(0, -1);
                        var self = Litereum$deserialize$varlen$go$($3629);
                        switch (self._) {
                            case 'Pair.new':
                                var $3631 = self.fst;
                                var $3632 = self.snd;
                                var $3633 = Pair$new$($3631, ($3632 * 2n));
                                var $3630 = $3633;
                                break;
                        };
                        var $3628 = $3630;
                        break;
                    case 'i':
                        var $3634 = self.slice(0, -1);
                        var self = Litereum$deserialize$varlen$go$($3634);
                        switch (self._) {
                            case 'Pair.new':
                                var $3636 = self.fst;
                                var $3637 = self.snd;
                                var $3638 = Pair$new$($3636, (($3637 * 2n) + 1n));
                                var $3635 = $3638;
                                break;
                        };
                        var $3628 = $3635;
                        break;
                    case 'e':
                        var $3639 = Pair$new$($3627, 0n);
                        var $3628 = $3639;
                        break;
                };
                var $3624 = $3628;
                break;
            case 'e':
                var $3640 = Pair$new$(Bits$e, 0n);
                var $3624 = $3640;
                break;
        };
        return $3624;
    };
    const Litereum$deserialize$varlen$go = x0 => Litereum$deserialize$varlen$go$(x0);

    function Litereum$deserialize$varlen$(_bits$1) {
        var self = Litereum$deserialize$varlen$go$(_bits$1);
        switch (self._) {
            case 'Pair.new':
                var $3642 = self.fst;
                var $3643 = self.snd;
                var $3644 = Pair$new$($3642, ($3643 - 1n <= 0n ? 0n : $3643 - 1n));
                var $3641 = $3644;
                break;
        };
        return $3641;
    };
    const Litereum$deserialize$varlen = x0 => Litereum$deserialize$varlen$(x0);

    function Litereum$deserialize$name$old$(_world$1, _bits$2) {
        var self = _world$1;
        switch (self._) {
            case 'Litereum.World.new':
                var $3646 = self.index_to_name;
                var self = Litereum$deserialize$varlen$(_bits$2);
                switch (self._) {
                    case 'Pair.new':
                        var $3648 = self.fst;
                        var $3649 = self.snd;
                        var self = Map$get$(Nat$show$($3649), $3646);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3651 = self.value;
                                var $3652 = Pair$new$($3648, $3651);
                                var $3650 = $3652;
                                break;
                            case 'Maybe.none':
                                var $3653 = Pair$new$($3648, "");
                                var $3650 = $3653;
                                break;
                        };
                        var $3647 = $3650;
                        break;
                };
                var $3645 = $3647;
                break;
        };
        return $3645;
    };
    const Litereum$deserialize$name$old = x0 => x1 => Litereum$deserialize$name$old$(x0, x1);

    function Litereum$deserialize$list$(_item$2, _bits$3) {
        var self = _bits$3;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $3655 = self.slice(0, -1);
                var $3656 = Pair$new$($3655, List$nil);
                var $3654 = $3656;
                break;
            case 'i':
                var $3657 = self.slice(0, -1);
                var self = _item$2($3657);
                switch (self._) {
                    case 'Pair.new':
                        var $3659 = self.fst;
                        var $3660 = self.snd;
                        var self = Litereum$deserialize$list$(_item$2, $3659);
                        switch (self._) {
                            case 'Pair.new':
                                var $3662 = self.fst;
                                var $3663 = self.snd;
                                var $3664 = Pair$new$($3662, List$cons$($3660, $3663));
                                var $3661 = $3664;
                                break;
                        };
                        var $3658 = $3661;
                        break;
                };
                var $3654 = $3658;
                break;
            case 'e':
                var $3665 = Pair$new$(Bits$e, List$nil);
                var $3654 = $3665;
                break;
        };
        return $3654;
    };
    const Litereum$deserialize$list = x0 => x1 => Litereum$deserialize$list$(x0, x1);

    function Litereum$deserialize$type$(_world$1, _bits$2) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $3667 = self.slice(0, -1);
                var $3668 = Pair$new$($3667, Litereum$Type$word);
                var $3666 = $3668;
                break;
            case 'i':
                var $3669 = self.slice(0, -1);
                var self = Litereum$deserialize$name$old$(_world$1, $3669);
                switch (self._) {
                    case 'Pair.new':
                        var $3671 = self.fst;
                        var $3672 = self.snd;
                        var $3673 = Pair$new$($3671, Litereum$Type$data$($3672));
                        var $3670 = $3673;
                        break;
                };
                var $3666 = $3670;
                break;
            case 'e':
                var $3674 = Pair$new$(_bits$2, Litereum$Type$word);
                var $3666 = $3674;
                break;
        };
        return $3666;
    };
    const Litereum$deserialize$type = x0 => x1 => Litereum$deserialize$type$(x0, x1);

    function Litereum$deserialize$constructor$(_world$1, _bits$2) {
        var self = Litereum$deserialize$name$old$(_world$1, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $3676 = self.fst;
                var $3677 = self.snd;
                var self = Litereum$deserialize$list$(Litereum$deserialize$name$old(_world$1), $3676);
                switch (self._) {
                    case 'Pair.new':
                        var $3679 = self.fst;
                        var $3680 = self.snd;
                        var self = Litereum$deserialize$list$(Litereum$deserialize$type(_world$1), $3679);
                        switch (self._) {
                            case 'Pair.new':
                                var $3682 = self.fst;
                                var $3683 = self.snd;
                                var $3684 = Pair$new$($3682, Litereum$Constructor$new$($3677, $3680, $3683));
                                var $3681 = $3684;
                                break;
                        };
                        var $3678 = $3681;
                        break;
                };
                var $3675 = $3678;
                break;
        };
        return $3675;
    };
    const Litereum$deserialize$constructor = x0 => x1 => Litereum$deserialize$constructor$(x0, x1);

    function Litereum$deserialize$data$(_world$1, _bits$2) {
        var self = Litereum$deserialize$name$old$(_world$1, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $3686 = self.fst;
                var $3687 = self.snd;
                var self = Litereum$deserialize$list$(Litereum$deserialize$constructor(_world$1), $3686);
                switch (self._) {
                    case 'Pair.new':
                        var $3689 = self.fst;
                        var $3690 = self.snd;
                        var $3691 = Pair$new$($3689, Litereum$Data$new$($3687, $3690));
                        var $3688 = $3691;
                        break;
                };
                var $3685 = $3688;
                break;
        };
        return $3685;
    };
    const Litereum$deserialize$data = x0 => x1 => Litereum$deserialize$data$(x0, x1);

    function Litereum$deserialize$name$local$(_world$1, _vars$2, _bits$3) {
        var self = Litereum$deserialize$varlen$(_bits$3);
        switch (self._) {
            case 'Pair.new':
                var $3693 = self.fst;
                var $3694 = self.snd;
                var $3695 = Pair$new$($3693, Maybe$default$(List$get$($3694, _vars$2), ""));
                var $3692 = $3695;
                break;
        };
        return $3692;
    };
    const Litereum$deserialize$name$local = x0 => x1 => x2 => Litereum$deserialize$name$local$(x0, x1, x2);

    function Litereum$deserialize$cases$(_world$1, _vars$2, _name$3, _ctors$4, _bits$5) {
        var self = _ctors$4;
        switch (self._) {
            case 'List.cons':
                var $3697 = self.head;
                var $3698 = self.tail;
                var _flds$8 = List$map$(a1 => ((_name$3 + ".") + a1), (() => {
                    var self = $3697;
                    switch (self._) {
                        case 'Litereum.Constructor.new':
                            var $3700 = self.field_names;
                            var $3701 = $3700;
                            return $3701;
                    };
                })());
                var self = Litereum$deserialize$term$(_world$1, List$concat$(List$reverse$(_flds$8), _vars$2), _bits$5);
                switch (self._) {
                    case 'Pair.new':
                        var $3702 = self.fst;
                        var $3703 = self.snd;
                        var self = Litereum$deserialize$cases$(_world$1, _vars$2, _name$3, $3698, $3702);
                        switch (self._) {
                            case 'Pair.new':
                                var $3705 = self.fst;
                                var $3706 = self.snd;
                                var $3707 = Pair$new$($3705, List$cons$($3703, $3706));
                                var $3704 = $3707;
                                break;
                        };
                        var $3699 = $3704;
                        break;
                };
                var $3696 = $3699;
                break;
            case 'List.nil':
                var $3708 = Pair$new$(_bits$5, List$nil);
                var $3696 = $3708;
                break;
        };
        return $3696;
    };
    const Litereum$deserialize$cases = x0 => x1 => x2 => x3 => x4 => Litereum$deserialize$cases$(x0, x1, x2, x3, x4);

    function Litereum$deserialize$term$(_world$1, _vars$2, _bits$3) {
        var self = _bits$3;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $3710 = self.slice(0, -1);
                var self = Litereum$deserialize$name$local$(_world$1, _vars$2, $3710);
                switch (self._) {
                    case 'Pair.new':
                        var $3712 = self.fst;
                        var $3713 = self.snd;
                        var $3714 = Pair$new$($3712, Litereum$Term$var$($3713));
                        var $3711 = $3714;
                        break;
                };
                var $3709 = $3711;
                break;
            case 'i':
                var $3715 = self.slice(0, -1);
                var self = Litereum$deserialize$fixlen$(3n, $3715);
                switch (self._) {
                    case 'Pair.new':
                        var $3717 = self.fst;
                        var $3718 = self.snd;
                        var self = ($3718 === 0n);
                        if (self) {
                            var self = Litereum$deserialize$name$old$(_world$1, $3717);
                            switch (self._) {
                                case 'Pair.new':
                                    var $3721 = self.fst;
                                    var $3722 = self.snd;
                                    var self = Litereum$deserialize$type$(_world$1, $3721);
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $3724 = self.fst;
                                            var $3725 = self.snd;
                                            var self = Litereum$deserialize$term$(_world$1, _vars$2, $3724);
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $3727 = self.fst;
                                                    var $3728 = self.snd;
                                                    var self = Litereum$deserialize$term$(_world$1, List$cons$($3722, _vars$2), $3727);
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $3730 = self.fst;
                                                            var $3731 = self.snd;
                                                            var $3732 = Pair$new$($3730, Litereum$Term$let$($3722, $3725, $3728, $3731));
                                                            var $3729 = $3732;
                                                            break;
                                                    };
                                                    var $3726 = $3729;
                                                    break;
                                            };
                                            var $3723 = $3726;
                                            break;
                                    };
                                    var $3720 = $3723;
                                    break;
                            };
                            var $3719 = $3720;
                        } else {
                            var self = ($3718 === 1n);
                            if (self) {
                                var self = Litereum$deserialize$name$old$(_world$1, $3717);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $3735 = self.fst;
                                        var $3736 = self.snd;
                                        var self = Litereum$deserialize$list$(Litereum$deserialize$term(_world$1)(_vars$2), $3735);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $3738 = self.fst;
                                                var $3739 = self.snd;
                                                var $3740 = Pair$new$($3738, Litereum$Term$call$($3736, $3739));
                                                var $3737 = $3740;
                                                break;
                                        };
                                        var $3734 = $3737;
                                        break;
                                };
                                var $3733 = $3734;
                            } else {
                                var self = ($3718 === 2n);
                                if (self) {
                                    var self = Litereum$deserialize$name$old$(_world$1, $3717);
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $3743 = self.fst;
                                            var $3744 = self.snd;
                                            var self = Litereum$deserialize$list$(Litereum$deserialize$term(_world$1)(_vars$2), $3743);
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $3746 = self.fst;
                                                    var $3747 = self.snd;
                                                    var $3748 = Pair$new$($3746, Litereum$Term$create$($3744, $3747));
                                                    var $3745 = $3748;
                                                    break;
                                            };
                                            var $3742 = $3745;
                                            break;
                                    };
                                    var $3741 = $3742;
                                } else {
                                    var self = ($3718 === 3n);
                                    if (self) {
                                        var self = Litereum$deserialize$name$local$(_world$1, _vars$2, $3717);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $3751 = self.fst;
                                                var $3752 = self.snd;
                                                var self = Litereum$deserialize$name$old$(_world$1, $3751);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3754 = self.fst;
                                                        var $3755 = self.snd;
                                                        var self = Litereum$deserialize$cases$(_world$1, _vars$2, $3752, Maybe$default$(Litereum$get_constructors$(_world$1, $3755), List$nil), $3754);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $3757 = self.fst;
                                                                var $3758 = self.snd;
                                                                var $3759 = Pair$new$($3757, Litereum$Term$match$($3752, $3755, $3758));
                                                                var $3756 = $3759;
                                                                break;
                                                        };
                                                        var $3753 = $3756;
                                                        break;
                                                };
                                                var $3750 = $3753;
                                                break;
                                        };
                                        var $3749 = $3750;
                                    } else {
                                        var self = ($3718 === 4n);
                                        if (self) {
                                            var self = Litereum$deserialize$fixlen$(64n, $3717);
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $3762 = self.fst;
                                                    var $3763 = self.snd;
                                                    var $3764 = Pair$new$($3762, Litereum$Term$word$(($3763 & 0xFFFFFFFFFFFFFFFFn)));
                                                    var $3761 = $3764;
                                                    break;
                                            };
                                            var $3760 = $3761;
                                        } else {
                                            var self = ($3718 === 5n);
                                            if (self) {
                                                var self = Litereum$deserialize$term$(_world$1, _vars$2, $3717);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3767 = self.fst;
                                                        var $3768 = self.snd;
                                                        var self = Litereum$deserialize$term$(_world$1, _vars$2, $3767);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $3770 = self.fst;
                                                                var $3771 = self.snd;
                                                                var self = Litereum$deserialize$term$(_world$1, _vars$2, $3770);
                                                                switch (self._) {
                                                                    case 'Pair.new':
                                                                        var $3773 = self.fst;
                                                                        var $3774 = self.snd;
                                                                        var self = Litereum$deserialize$term$(_world$1, _vars$2, $3773);
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $3776 = self.fst;
                                                                                var $3777 = self.snd;
                                                                                var self = Litereum$deserialize$term$(_world$1, _vars$2, $3776);
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $3779 = self.fst;
                                                                                        var $3780 = self.snd;
                                                                                        var $3781 = Pair$new$($3779, Litereum$Term$compare$($3768, $3771, $3774, $3777, $3780));
                                                                                        var $3778 = $3781;
                                                                                        break;
                                                                                };
                                                                                var $3775 = $3778;
                                                                                break;
                                                                        };
                                                                        var $3772 = $3775;
                                                                        break;
                                                                };
                                                                var $3769 = $3772;
                                                                break;
                                                        };
                                                        var $3766 = $3769;
                                                        break;
                                                };
                                                var $3765 = $3766;
                                            } else {
                                                var self = ($3718 === 6n);
                                                if (self) {
                                                    var self = Litereum$deserialize$fixlen$(3n, $3717);
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $3784 = self.fst;
                                                            var $3785 = self.snd;
                                                            var self = Litereum$deserialize$term$(_world$1, _vars$2, $3784);
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $3787 = self.fst;
                                                                    var $3788 = self.snd;
                                                                    var self = Litereum$deserialize$term$(_world$1, _vars$2, $3787);
                                                                    switch (self._) {
                                                                        case 'Pair.new':
                                                                            var $3790 = self.fst;
                                                                            var $3791 = self.snd;
                                                                            var self = ($3785 === 0n);
                                                                            if (self) {
                                                                                var $3793 = Litereum$Operation$add;
                                                                                var _oper$13 = $3793;
                                                                            } else {
                                                                                var self = ($3785 === 1n);
                                                                                if (self) {
                                                                                    var $3795 = Litereum$Operation$sub;
                                                                                    var $3794 = $3795;
                                                                                } else {
                                                                                    var self = ($3785 === 2n);
                                                                                    if (self) {
                                                                                        var $3797 = Litereum$Operation$mul;
                                                                                        var $3796 = $3797;
                                                                                    } else {
                                                                                        var self = ($3785 === 3n);
                                                                                        if (self) {
                                                                                            var $3799 = Litereum$Operation$div;
                                                                                            var $3798 = $3799;
                                                                                        } else {
                                                                                            var self = ($3785 === 4n);
                                                                                            if (self) {
                                                                                                var $3801 = Litereum$Operation$mod;
                                                                                                var $3800 = $3801;
                                                                                            } else {
                                                                                                var self = ($3785 === 5n);
                                                                                                if (self) {
                                                                                                    var $3803 = Litereum$Operation$or;
                                                                                                    var $3802 = $3803;
                                                                                                } else {
                                                                                                    var self = ($3785 === 6n);
                                                                                                    if (self) {
                                                                                                        var $3805 = Litereum$Operation$and;
                                                                                                        var $3804 = $3805;
                                                                                                    } else {
                                                                                                        var self = ($3785 === 7n);
                                                                                                        if (self) {
                                                                                                            var $3807 = Litereum$Operation$xor;
                                                                                                            var $3806 = $3807;
                                                                                                        } else {
                                                                                                            var $3808 = Litereum$Operation$add;
                                                                                                            var $3806 = $3808;
                                                                                                        };
                                                                                                        var $3804 = $3806;
                                                                                                    };
                                                                                                    var $3802 = $3804;
                                                                                                };
                                                                                                var $3800 = $3802;
                                                                                            };
                                                                                            var $3798 = $3800;
                                                                                        };
                                                                                        var $3796 = $3798;
                                                                                    };
                                                                                    var $3794 = $3796;
                                                                                };
                                                                                var _oper$13 = $3794;
                                                                            };
                                                                            var $3792 = Pair$new$($3790, Litereum$Term$operate$(_oper$13, $3788, $3791));
                                                                            var $3789 = $3792;
                                                                            break;
                                                                    };
                                                                    var $3786 = $3789;
                                                                    break;
                                                            };
                                                            var $3783 = $3786;
                                                            break;
                                                    };
                                                    var $3782 = $3783;
                                                } else {
                                                    var self = ($3718 === 7n);
                                                    if (self) {
                                                        var self = Litereum$deserialize$name$old$(_world$1, $3717);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $3811 = self.fst;
                                                                var $3812 = self.snd;
                                                                var self = Litereum$get_bond$(_world$1, $3812);
                                                                switch (self._) {
                                                                    case 'Maybe.some':
                                                                        var $3814 = self.value;
                                                                        var _bond$10 = $3814;
                                                                        var self = _bond$10;
                                                                        switch (self._) {
                                                                            case 'Litereum.Bond.new':
                                                                                var $3816 = self.input_names;
                                                                                var _vrs2$17 = List$concat$(List$reverse$($3816), _vars$2);
                                                                                var self = Litereum$deserialize$term$(_world$1, _vrs2$17, $3811);
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $3818 = self.fst;
                                                                                        var $3819 = self.snd;
                                                                                        var self = Litereum$deserialize$term$(_world$1, _vars$2, $3818);
                                                                                        switch (self._) {
                                                                                            case 'Pair.new':
                                                                                                var $3821 = self.fst;
                                                                                                var $3822 = self.snd;
                                                                                                var $3823 = Pair$new$($3821, Litereum$Term$bind$($3812, $3819, $3822));
                                                                                                var $3820 = $3823;
                                                                                                break;
                                                                                        };
                                                                                        var $3817 = $3820;
                                                                                        break;
                                                                                };
                                                                                var $3815 = $3817;
                                                                                break;
                                                                        };
                                                                        var $3813 = $3815;
                                                                        break;
                                                                    case 'Maybe.none':
                                                                        var $3824 = Pair$new$($3811, Litereum$Term$word$(0n));
                                                                        var $3813 = $3824;
                                                                        break;
                                                                };
                                                                var $3810 = $3813;
                                                                break;
                                                        };
                                                        var $3809 = $3810;
                                                    } else {
                                                        var $3825 = Pair$new$($3717, Litereum$Term$word$(0n));
                                                        var $3809 = $3825;
                                                    };
                                                    var $3782 = $3809;
                                                };
                                                var $3765 = $3782;
                                            };
                                            var $3760 = $3765;
                                        };
                                        var $3749 = $3760;
                                    };
                                    var $3741 = $3749;
                                };
                                var $3733 = $3741;
                            };
                            var $3719 = $3733;
                        };
                        var $3716 = $3719;
                        break;
                };
                var $3709 = $3716;
                break;
            case 'e':
                var $3826 = Pair$new$(_bits$3, Litereum$Term$word$(0n));
                var $3709 = $3826;
                break;
        };
        return $3709;
    };
    const Litereum$deserialize$term = x0 => x1 => x2 => Litereum$deserialize$term$(x0, x1, x2);

    function Litereum$deserialize$bond$(_world$1, _bits$2) {
        var self = Litereum$deserialize$name$old$(_world$1, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $3828 = self.fst;
                var $3829 = self.snd;
                var self = Litereum$deserialize$list$(Litereum$deserialize$name$old(_world$1), $3828);
                switch (self._) {
                    case 'Pair.new':
                        var $3831 = self.fst;
                        var $3832 = self.snd;
                        var self = Litereum$deserialize$list$(Litereum$deserialize$type(_world$1), $3831);
                        switch (self._) {
                            case 'Pair.new':
                                var $3834 = self.fst;
                                var $3835 = self.snd;
                                var self = Litereum$deserialize$type$(_world$1, $3834);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $3837 = self.fst;
                                        var $3838 = self.snd;
                                        var self = Litereum$deserialize$term$(_world$1, List$reverse$($3832), $3837);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $3840 = self.fst;
                                                var $3841 = self.snd;
                                                var self = Litereum$deserialize$list$(Litereum$deserialize$name$old(_world$1), $3840);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3843 = self.fst;
                                                        var $3844 = self.snd;
                                                        var $3845 = Pair$new$($3843, Litereum$Bond$new$($3829, $3832, $3835, $3838, $3841, $3844));
                                                        var $3842 = $3845;
                                                        break;
                                                };
                                                var $3839 = $3842;
                                                break;
                                        };
                                        var $3836 = $3839;
                                        break;
                                };
                                var $3833 = $3836;
                                break;
                        };
                        var $3830 = $3833;
                        break;
                };
                var $3827 = $3830;
                break;
        };
        return $3827;
    };
    const Litereum$deserialize$bond = x0 => x1 => Litereum$deserialize$bond$(x0, x1);

    function Litereum$deserialize$eval$(_world$1, _bits$2) {
        var self = Litereum$deserialize$term$(_world$1, List$nil, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $3847 = self.fst;
                var $3848 = self.snd;
                var self = Litereum$deserialize$type$(_world$1, $3847);
                switch (self._) {
                    case 'Pair.new':
                        var $3850 = self.fst;
                        var $3851 = self.snd;
                        var $3852 = Pair$new$($3850, Litereum$Eval$new$($3848, $3851));
                        var $3849 = $3852;
                        break;
                };
                var $3846 = $3849;
                break;
        };
        return $3846;
    };
    const Litereum$deserialize$eval = x0 => x1 => Litereum$deserialize$eval$(x0, x1);

    function Litereum$deserialize$transaction$(_world$1, _bits$2) {
        var self = Litereum$deserialize$fixlen$(2n, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $3854 = self.fst;
                var $3855 = self.snd;
                var self = ($3855 === 0n);
                if (self) {
                    var self = Litereum$deserialize$name$new$($3854);
                    switch (self._) {
                        case 'Pair.new':
                            var $3858 = self.fst;
                            var $3859 = self.snd;
                            var $3860 = Pair$new$($3858, Litereum$Transaction$new_name$($3859));
                            var $3857 = $3860;
                            break;
                    };
                    var $3856 = $3857;
                } else {
                    var self = ($3855 === 1n);
                    if (self) {
                        var self = Litereum$deserialize$data$(_world$1, $3854);
                        switch (self._) {
                            case 'Pair.new':
                                var $3863 = self.fst;
                                var $3864 = self.snd;
                                var $3865 = Pair$new$($3863, Litereum$Transaction$new_data$($3864));
                                var $3862 = $3865;
                                break;
                        };
                        var $3861 = $3862;
                    } else {
                        var self = ($3855 === 2n);
                        if (self) {
                            var self = Litereum$deserialize$bond$(_world$1, $3854);
                            switch (self._) {
                                case 'Pair.new':
                                    var $3868 = self.fst;
                                    var $3869 = self.snd;
                                    var $3870 = Pair$new$($3868, Litereum$Transaction$new_bond$($3869));
                                    var $3867 = $3870;
                                    break;
                            };
                            var $3866 = $3867;
                        } else {
                            var self = ($3855 === 3n);
                            if (self) {
                                var self = Litereum$deserialize$eval$(_world$1, $3854);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $3873 = self.fst;
                                        var $3874 = self.snd;
                                        var $3875 = Pair$new$($3873, Litereum$Transaction$new_eval$($3874));
                                        var $3872 = $3875;
                                        break;
                                };
                                var $3871 = $3872;
                            } else {
                                var $3876 = Pair$new$($3854, Litereum$Transaction$new_name$(""));
                                var $3871 = $3876;
                            };
                            var $3866 = $3871;
                        };
                        var $3861 = $3866;
                    };
                    var $3856 = $3861;
                };
                var $3853 = $3856;
                break;
        };
        return $3853;
    };
    const Litereum$deserialize$transaction = x0 => x1 => Litereum$deserialize$transaction$(x0, x1);

    function Litereum$deserialize$block$(_world$1, _bits$2) {
        var self = Bits$is_empty$(_bits$2);
        if (self) {
            var $3878 = Pair$new$(Bits$e, List$nil);
            var $3877 = $3878;
        } else {
            var self = Litereum$deserialize$transaction$(_world$1, _bits$2);
            switch (self._) {
                case 'Pair.new':
                    var $3880 = self.fst;
                    var $3881 = self.snd;
                    var self = Litereum$deserialize$block$(Litereum$reg$(_world$1, $3881), $3880);
                    switch (self._) {
                        case 'Pair.new':
                            var $3883 = self.fst;
                            var $3884 = self.snd;
                            var $3885 = Pair$new$($3883, List$cons$($3881, $3884));
                            var $3882 = $3885;
                            break;
                    };
                    var $3879 = $3882;
                    break;
            };
            var $3877 = $3879;
        };
        return $3877;
    };
    const Litereum$deserialize$block = x0 => x1 => Litereum$deserialize$block$(x0, x1);

    function Litereum$run$block$(_world$1, _transactions$2) {
        var Litereum$run$block$ = (_world$1, _transactions$2) => ({
            ctr: 'TCO',
            arg: [_world$1, _transactions$2]
        });
        var Litereum$run$block = _world$1 => _transactions$2 => Litereum$run$block$(_world$1, _transactions$2);
        var arg = [_world$1, _transactions$2];
        while (true) {
            let [_world$1, _transactions$2] = arg;
            var R = (() => {
                var self = _transactions$2;
                switch (self._) {
                    case 'List.cons':
                        var $3886 = self.head;
                        var $3887 = self.tail;
                        var self = Litereum$run$(_world$1, $3886, Bool$false);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3889 = self.value;
                                var $3890 = Litereum$run$block$($3889, $3887);
                                var $3888 = $3890;
                                break;
                            case 'Maybe.none':
                                var $3891 = Maybe$none;
                                var $3888 = $3891;
                                break;
                        };
                        return $3888;
                    case 'List.nil':
                        var $3892 = Maybe$some$(_world$1);
                        return $3892;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Litereum$run$block = x0 => x1 => Litereum$run$block$(x0, x1);

    function Litereum$api$run_block$(_code$1) {
        var _world$2 = Litereum$genesis;
        var self = Parser$run$(Litereum$parse$block$(_world$2), _code$1);
        switch (self._) {
            case 'Maybe.some':
                var $3894 = self.value;
                var $3895 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                    var $3896 = _m$bind$4;
                    return $3896;
                }))(IO$print$("Block: "))((_$4 => {
                    var $3897 = IO$monad$((_m$bind$5 => _m$pure$6 => {
                        var $3898 = _m$bind$5;
                        return $3898;
                    }))(IO$print$(Litereum$show$block$(_world$2, $3894)))((_$5 => {
                        var $3899 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                            var $3900 = _m$bind$6;
                            return $3900;
                        }))(IO$print$("Serialization:"))((_$6 => {
                            var _bits$7 = Litereum$serialize$block$(Litereum$genesis, $3894);
                            var $3901 = IO$monad$((_m$bind$8 => _m$pure$9 => {
                                var $3902 = _m$bind$8;
                                return $3902;
                            }))(IO$print$(("- " + Bits$hex$encode$(_bits$7))))((_$8 => {
                                var $3903 = IO$monad$((_m$bind$9 => _m$pure$10 => {
                                    var $3904 = _m$bind$9;
                                    return $3904;
                                }))(IO$print$(""))((_$9 => {
                                    var $3905 = IO$monad$((_m$bind$10 => _m$pure$11 => {
                                        var $3906 = _m$bind$10;
                                        return $3906;
                                    }))(IO$print$("Deserialization:"))((_$10 => {
                                        var self = Litereum$deserialize$block$(Litereum$genesis, _bits$7);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $3908 = self.snd;
                                                var $3909 = IO$monad$((_m$bind$13 => _m$pure$14 => {
                                                    var $3910 = _m$bind$13;
                                                    return $3910;
                                                }))(IO$print$(Litereum$show$block$(Litereum$genesis, $3908)))((_$13 => {
                                                    var $3911 = ((console.log("Evaluation: "), (_$14 => {
                                                        var self = Litereum$run$block$(_world$2, $3908);
                                                        switch (self._) {
                                                            case 'Maybe.none':
                                                                var $3913 = IO$print$("failed execution");
                                                                var $3912 = $3913;
                                                                break;
                                                            case 'Maybe.some':
                                                                var $3914 = IO$monad$((_m$bind$16 => _m$pure$17 => {
                                                                    var $3915 = _m$bind$16;
                                                                    return $3915;
                                                                }))(IO$print$(""))((_$16 => {
                                                                    var $3916 = IO$print$("Done!");
                                                                    return $3916;
                                                                }));
                                                                var $3912 = $3914;
                                                                break;
                                                        };
                                                        return $3912;
                                                    })()));
                                                    return $3911;
                                                }));
                                                var $3907 = $3909;
                                                break;
                                        };
                                        return $3907;
                                    }));
                                    return $3905;
                                }));
                                return $3903;
                            }));
                            return $3901;
                        }));
                        return $3899;
                    }));
                    return $3897;
                }));
                var $3893 = $3895;
                break;
            case 'Maybe.none':
                var $3917 = IO$print$("Invalid block syntax.");
                var $3893 = $3917;
                break;
        };
        return $3893;
    };
    const Litereum$api$run_block = x0 => Litereum$api$run_block$(x0);
    const Litereum = (() => {
        var __$1 = Litereum$api$run_block$("eval { +(#21,#21) } : #word");
        var $3918 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $3919 = _m$pure$3;
            return $3919;
        }))(Unit$new);
        return $3918;
    })();
    return {
        '$main$': () => run(Litereum),
        'run': run,
        'Litereum.World.new': Litereum$World$new,
        'BBT': BBT,
        'Pair.fst': Pair$fst,
        'Pair.snd': Pair$snd,
        'BBT.bin': BBT$bin,
        'U32.new': U32$new,
        'Nat.apply': Nat$apply,
        'Word': Word,
        'Word.e': Word$e,
        'Word.i': Word$i,
        'Word.o': Word$o,
        'Word.inc': Word$inc,
        'Word.zero': Word$zero,
        'Nat.to_word': Nat$to_word,
        'Nat.succ': Nat$succ,
        'Nat.zero': Nat$zero,
        'Nat.to_u32': Nat$to_u32,
        'BBT.tip': BBT$tip,
        'BBT.singleton': BBT$singleton,
        'BBT.size': BBT$size,
        'Bool.false': Bool$false,
        'Bool.true': Bool$true,
        'Word.adder': Word$adder,
        'Word.add': Word$add,
        'U32.add': U32$add,
        'Word.shift_left.one.go': Word$shift_left$one$go,
        'Word.shift_left.one': Word$shift_left$one,
        'Word.shift_left': Word$shift_left,
        'Word.mul.go': Word$mul$go,
        'Word.to_zero': Word$to_zero,
        'Word.mul': Word$mul,
        'U32.mul': U32$mul,
        'BBT.w': BBT$w,
        'Cmp.as_ltn': Cmp$as_ltn,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.ltn': Word$ltn,
        'U32.ltn': U32$ltn,
        'U32.from_nat': U32$from_nat,
        'BBT.node': BBT$node,
        'Cmp.as_gtn': Cmp$as_gtn,
        'Word.gtn': Word$gtn,
        'U32.gtn': U32$gtn,
        'BBT.balance': BBT$balance,
        'BBT.insert': BBT$insert,
        'BBT.from_list.go': BBT$from_list$go,
        'BBT.from_list': BBT$from_list,
        'U16.ltn': U16$ltn,
        'Cmp.as_eql': Cmp$as_eql,
        'Word.eql': Word$eql,
        'U16.eql': U16$eql,
        'U16.cmp': U16$cmp,
        'String.cmp': String$cmp,
        'Map.from_list': Map$from_list,
        'List.nil': List$nil,
        'Pair': Pair,
        'Litereum.genesis': Litereum$genesis,
        'Parser.State.new': Parser$State$new,
        'Maybe.none': Maybe$none,
        'Maybe': Maybe,
        'Maybe.some': Maybe$some,
        'Parser.run': Parser$run,
        'List': List,
        'Parser.Reply': Parser$Reply,
        'Parser.Reply.error': Parser$Reply$error,
        'Parser.Error.new': Parser$Error$new,
        'Parser.Reply.fail': Parser$Reply$fail,
        'Nat.gtn': Nat$gtn,
        'Parser.Error.combine': Parser$Error$combine,
        'Parser.Error.maybe_combine': Parser$Error$maybe_combine,
        'Parser.Reply.value': Parser$Reply$value,
        'Parser.choice': Parser$choice,
        'List.cons': List$cons,
        'Parser': Parser,
        'Parser.many.go': Parser$many$go,
        'Parser.many': Parser$many,
        'Unit.new': Unit$new,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'String.nil': String$nil,
        'Parser.text.go': Parser$text$go,
        'Parser.text': Parser$text,
        'Parser.eof': Parser$eof,
        'List.reverse.go': List$reverse$go,
        'List.reverse': List$reverse,
        'Parser.until.go': Parser$until$go,
        'Parser.until': Parser$until,
        'Parser.one': Parser$one,
        'Litereum.parse.ignore': Litereum$parse$ignore,
        'Litereum.parse.text': Litereum$parse$text,
        'Parser.letter': Parser$letter,
        'Bool.and': Bool$and,
        'Cmp.as_lte': Cmp$as_lte,
        'Word.lte': Word$lte,
        'U16.lte': U16$lte,
        'U16.btw': U16$btw,
        'Litereum.parse.letter': Litereum$parse$letter,
        'List.fold': List$fold,
        'Litereum.parse.name': Litereum$parse$name,
        'Litereum.Transaction.new_name': Litereum$Transaction$new_name,
        'Parser.wrap': Parser$wrap,
        'Parser.maybe': Parser$maybe,
        'Litereum.Type.word': Litereum$Type$word,
        'Litereum.Type.data': Litereum$Type$data,
        'Litereum.parse.type': Litereum$parse$type,
        'Pair.new': Pair$new,
        'Litereum.parse.ann': Litereum$parse$ann,
        'List.mapped': List$mapped,
        'Litereum.Constructor.new': Litereum$Constructor$new,
        'Litereum.parse.constructor': Litereum$parse$constructor,
        'Litereum.Data.new': Litereum$Data$new,
        'Litereum.parse.data': Litereum$parse$data,
        'Litereum.Transaction.new_data': Litereum$Transaction$new_data,
        'Litereum.Term.let': Litereum$Term$let,
        'Litereum.parse.term.let': Litereum$parse$term$let,
        'Litereum.Term.create': Litereum$Term$create,
        'Litereum.parse.term.create': Litereum$parse$term$create,
        'Maybe.bind': Maybe$bind,
        'Maybe.monad': Maybe$monad,
        'BBT.lookup': BBT$lookup,
        'Map.get': Map$get,
        'Litereum.get_data': Litereum$get_data,
        'Parser.fail': Parser$fail,
        'Litereum.parse.term.match.cases': Litereum$parse$term$match$cases,
        'Litereum.Term.match': Litereum$Term$match,
        'Litereum.parse.term.match': Litereum$parse$term$match,
        'Parser.many1': Parser$many1,
        'Parser.digit': Parser$digit,
        'Nat.add': Nat$add,
        'Nat.mul': Nat$mul,
        'Nat.from_base.go': Nat$from_base$go,
        'Nat.from_base': Nat$from_base,
        'Parser.nat': Parser$nat,
        'Nat.gte': Nat$gte,
        'Nat.pow.aux': Nat$pow$aux,
        'Nat.pow': Nat$pow,
        'Litereum.Term.word': Litereum$Term$word,
        'U64.new': U64$new,
        'Nat.to_u64': Nat$to_u64,
        'Litereum.parse.term.word': Litereum$parse$term$word,
        'Litereum.Term.compare': Litereum$Term$compare,
        'Litereum.parse.term.compare': Litereum$parse$term$compare,
        'Litereum.Operation.add': Litereum$Operation$add,
        'Litereum.Operation.sub': Litereum$Operation$sub,
        'Litereum.Operation.mul': Litereum$Operation$mul,
        'Litereum.Operation.div': Litereum$Operation$div,
        'Litereum.Operation.mod': Litereum$Operation$mod,
        'Litereum.Operation.or': Litereum$Operation$or,
        'Litereum.Operation.and': Litereum$Operation$and,
        'Litereum.Operation.xor': Litereum$Operation$xor,
        'Litereum.parse.term.operation': Litereum$parse$term$operation,
        'Litereum.Term.operate': Litereum$Term$operate,
        'Litereum.parse.term.operate': Litereum$parse$term$operate,
        'Litereum.Term.bind': Litereum$Term$bind,
        'Litereum.parse.term.bind': Litereum$parse$term$bind,
        'Litereum.Term.call': Litereum$Term$call,
        'Litereum.parse.term.call': Litereum$parse$term$call,
        'Litereum.Term.var': Litereum$Term$var,
        'Litereum.parse.term.var': Litereum$parse$term$var,
        'Litereum.parse.term': Litereum$parse$term,
        'Litereum.Bond.new': Litereum$Bond$new,
        'Litereum.parse.bond': Litereum$parse$bond,
        'Litereum.Transaction.new_bond': Litereum$Transaction$new_bond,
        'Litereum.Eval.new': Litereum$Eval$new,
        'Litereum.parse.eval': Litereum$parse$eval,
        'Litereum.Transaction.new_eval': Litereum$Transaction$new_eval,
        'Litereum.parse.transaction': Litereum$parse$transaction,
        'Maybe.default': Maybe$default,
        'Map': Map,
        'Map.set': Map$set,
        'Either': Either,
        'Either.left': Either$left,
        'Either.right': Either$right,
        'Nat.sub_rem': Nat$sub_rem,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'Nat.to_base.go': Nat$to_base$go,
        'Nat.to_base': Nat$to_base,
        'Nat.mod.go': Nat$mod$go,
        'Nat.mod': Nat$mod,
        'Nat.lte': Nat$lte,
        'List.at': List$at,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Nat.show': Nat$show,
        'Debug.log': Debug$log,
        'Litereum.Entry.data': Litereum$Entry$data,
        'Litereum.Entry.bond': Litereum$Entry$bond,
        'Litereum.extend': Litereum$extend,
        'String.eql': String$eql,
        'Litereum.equal': Litereum$equal,
        'Maybe.is_some': Maybe$is_some,
        'Litereum.get_bond': Litereum$get_bond,
        'List.zip': List$zip,
        'List.all': List$all,
        'Maybe.mapped': Maybe$mapped,
        'List.ifind.go': List$ifind$go,
        'List.ifind': List$ifind,
        'Litereum.get_constructor_value': Litereum$get_constructor_value,
        'Nat.eql': Nat$eql,
        'List.length': List$length,
        'List.zip_with': List$zip_with,
        'List.zipped_with': List$zipped_with,
        'List.map': List$map,
        'List.and': List$and,
        'Litereum.check': Litereum$check,
        'Litereum.Runtime': Litereum$Runtime,
        'Litereum.Runtime.new': Litereum$Runtime$new,
        'Triple': Triple,
        'Triple.new': Triple$new,
        'Litereum.rename': Litereum$rename,
        'Litereum.rename.many': Litereum$rename$many,
        'Litereum.sanitize.many': Litereum$sanitize$many,
        'Litereum.get_constructors': Litereum$get_constructors,
        'List.for': List$for,
        'Litereum.sanitize.cases': Litereum$sanitize$cases,
        'Litereum.sanitize': Litereum$sanitize,
        'U64.from_nat': U64$from_nat,
        'Litereum.get_constructor_index': Litereum$get_constructor_index,
        'List.get': List$get,
        'U64.ltn': U64$ltn,
        'U64.eql': U64$eql,
        'U64.cmp': U64$cmp,
        'U64.add': U64$add,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'U64.sub': U64$sub,
        'U64.mul': U64$mul,
        'Word.bit_length.go': Word$bit_length$go,
        'Word.bit_length': Word$bit_length,
        'Nat.ltn': Nat$ltn,
        'Nat.sub': Nat$sub,
        'Cmp.as_gte': Cmp$as_gte,
        'Word.gte': Word$gte,
        'Word.or': Word$or,
        'Word.shift_right.one.go': Word$shift_right$one$go,
        'Word.shift_right.one': Word$shift_right$one,
        'Word.shift_right': Word$shift_right,
        'Word.div.go': Word$div$go,
        'Word.div': Word$div,
        'U64.div': U64$div,
        'Word.mod': Word$mod,
        'U64.mod': U64$mod,
        'U64.or': U64$or,
        'Word.and': Word$and,
        'U64.and': U64$and,
        'Word.xor': Word$xor,
        'U64.xor': U64$xor,
        'Litereum.reduce': Litereum$reduce,
        'Litereum.normalize.many': Litereum$normalize$many,
        'Litereum.normalize.cases': Litereum$normalize$cases,
        'Litereum.normalize': Litereum$normalize,
        'String.flatten.go': String$flatten$go,
        'String.flatten': String$flatten,
        'String.join.go': String$join$go,
        'String.join': String$join,
        'Litereum.show.type': Litereum$show$type,
        'Word.fold': Word$fold,
        'Word.to_nat': Word$to_nat,
        'Word.show': Word$show,
        'U64.show': U64$show,
        'Litereum.show.term': Litereum$show$term,
        'Litereum.run': Litereum$run,
        'Litereum.reg': Litereum$reg,
        'Litereum.parse.block': Litereum$parse$block,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.end': IO$end,
        'IO.put_string': IO$put_string,
        'IO.print': IO$print,
        'IO.bind': IO$bind,
        'IO.monad': IO$monad,
        'Litereum.show.constructor': Litereum$show$constructor,
        'Litereum.show.data': Litereum$show$data,
        'Litereum.show.bond': Litereum$show$bond,
        'Litereum.show.eval': Litereum$show$eval,
        'Litereum.show.transaction': Litereum$show$transaction,
        'Litereum.show.block': Litereum$show$block,
        'Bits.e': Bits$e,
        'Bits.o': Bits$o,
        'U16.new': U16$new,
        'U16.sub': U16$sub,
        'U16.add': U16$add,
        'Nat.to_u16': Nat$to_u16,
        'Nat.div': Nat$div,
        'Bits.i': Bits$i,
        'Litereum.serialize.fixlen': Litereum$serialize$fixlen,
        'U16.to_nat': U16$to_nat,
        'Bits.concat': Bits$concat,
        'Litereum.serialize.name.new': Litereum$serialize$name$new,
        'Litereum.serialize.varlen.go': Litereum$serialize$varlen$go,
        'Litereum.serialize.varlen': Litereum$serialize$varlen,
        'Litereum.serialize.name.old': Litereum$serialize$name$old,
        'Litereum.serialize.list': Litereum$serialize$list,
        'Litereum.serialize.type': Litereum$serialize$type,
        'Litereum.serialize.constructor': Litereum$serialize$constructor,
        'Litereum.serialize.data': Litereum$serialize$data,
        'List.find_index.go': List$find_index$go,
        'List.find_index': List$find_index,
        'Litereum.serialize.name.local': Litereum$serialize$name$local,
        'List.concat': List$concat,
        'Litereum.serialize.cases': Litereum$serialize$cases,
        'U64.to_nat': U64$to_nat,
        'Litereum.serialize.term': Litereum$serialize$term,
        'Litereum.serialize.bond': Litereum$serialize$bond,
        'Litereum.serialize.eval': Litereum$serialize$eval,
        'Litereum.serialize.transaction': Litereum$serialize$transaction,
        'Litereum.serialize.block': Litereum$serialize$block,
        'Bits.hex.encode': Bits$hex$encode,
        'Bits.is_empty': Bits$is_empty,
        'Litereum.deserialize.fixlen': Litereum$deserialize$fixlen,
        'U16.from_nat': U16$from_nat,
        'Litereum.deserialize.name.new': Litereum$deserialize$name$new,
        'Litereum.deserialize.varlen.go': Litereum$deserialize$varlen$go,
        'Litereum.deserialize.varlen': Litereum$deserialize$varlen,
        'Litereum.deserialize.name.old': Litereum$deserialize$name$old,
        'Litereum.deserialize.list': Litereum$deserialize$list,
        'Litereum.deserialize.type': Litereum$deserialize$type,
        'Litereum.deserialize.constructor': Litereum$deserialize$constructor,
        'Litereum.deserialize.data': Litereum$deserialize$data,
        'Litereum.deserialize.name.local': Litereum$deserialize$name$local,
        'Litereum.deserialize.cases': Litereum$deserialize$cases,
        'Litereum.deserialize.term': Litereum$deserialize$term,
        'Litereum.deserialize.bond': Litereum$deserialize$bond,
        'Litereum.deserialize.eval': Litereum$deserialize$eval,
        'Litereum.deserialize.transaction': Litereum$deserialize$transaction,
        'Litereum.deserialize.block': Litereum$deserialize$block,
        'Litereum.run.block': Litereum$run$block,
        'Litereum.api.run_block': Litereum$api$run_block,
        'Litereum': Litereum,
    };
})();
module.exports['$main$']();