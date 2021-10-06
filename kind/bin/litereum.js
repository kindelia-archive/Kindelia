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
                                                                var _reply$36 = Litereum$parse$text$(" ", _reply$pst$30);
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
                                                                        var self = $1262;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $1264 = self.err;
                                                                                var $1265 = self.nam;
                                                                                var $1266 = self.ini;
                                                                                var $1267 = self.idx;
                                                                                var $1268 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($1255, $1264), $1265, $1266, $1267, $1268);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $1270 = self.err;
                                                                                        var _reply$50 = Litereum$parse$term$(_world$1)(_reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1272 = self.err;
                                                                                                var self = $1270;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $1274 = self.value;
                                                                                                        var $1275 = Parser$Reply$error$(Parser$Error$combine$($1274, $1272));
                                                                                                        var $1273 = $1275;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $1276 = Parser$Reply$error$($1272);
                                                                                                        var $1273 = $1276;
                                                                                                        break;
                                                                                                };
                                                                                                var $1271 = $1273;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1277 = self.pst;
                                                                                                var $1278 = self.val;
                                                                                                var self = $1277;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $1280 = self.err;
                                                                                                        var $1281 = self.nam;
                                                                                                        var $1282 = self.ini;
                                                                                                        var $1283 = self.idx;
                                                                                                        var $1284 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($1270, $1280), $1281, $1282, $1283, $1284);
                                                                                                        var self = _reply$pst$58;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $1286 = self.err;
                                                                                                                var _reply$64 = Litereum$parse$text$("{", _reply$pst$58);
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
                                                                                                                                        var _reply$78 = Litereum$parse$text$("_<_:", _reply$pst$72);
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
                                                                                                                                                var self = $1308;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                        var $1310 = self.err;
                                                                                                                                                        var $1311 = self.nam;
                                                                                                                                                        var $1312 = self.ini;
                                                                                                                                                        var $1313 = self.idx;
                                                                                                                                                        var $1314 = self.str;
                                                                                                                                                        var _reply$pst$86 = Parser$State$new$(Parser$Error$maybe_combine$($1301, $1310), $1311, $1312, $1313, $1314);
                                                                                                                                                        var self = _reply$pst$86;
                                                                                                                                                        switch (self._) {
                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                var $1316 = self.err;
                                                                                                                                                                var _reply$92 = Litereum$parse$term$(_world$1)(_reply$pst$86);
                                                                                                                                                                var self = _reply$92;
                                                                                                                                                                switch (self._) {
                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                        var $1318 = self.err;
                                                                                                                                                                        var self = $1316;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                var $1320 = self.value;
                                                                                                                                                                                var $1321 = Parser$Reply$error$(Parser$Error$combine$($1320, $1318));
                                                                                                                                                                                var $1319 = $1321;
                                                                                                                                                                                break;
                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                var $1322 = Parser$Reply$error$($1318);
                                                                                                                                                                                var $1319 = $1322;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $1317 = $1319;
                                                                                                                                                                        break;
                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                        var $1323 = self.pst;
                                                                                                                                                                        var $1324 = self.val;
                                                                                                                                                                        var self = $1323;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                var $1326 = self.err;
                                                                                                                                                                                var $1327 = self.nam;
                                                                                                                                                                                var $1328 = self.ini;
                                                                                                                                                                                var $1329 = self.idx;
                                                                                                                                                                                var $1330 = self.str;
                                                                                                                                                                                var _reply$pst$100 = Parser$State$new$(Parser$Error$maybe_combine$($1316, $1326), $1327, $1328, $1329, $1330);
                                                                                                                                                                                var self = _reply$pst$100;
                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                        var $1332 = self.err;
                                                                                                                                                                                        var _reply$106 = Litereum$parse$text$("_=_:", _reply$pst$100);
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
                                                                                                                                                                                                var self = $1339;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                        var $1341 = self.err;
                                                                                                                                                                                                        var $1342 = self.nam;
                                                                                                                                                                                                        var $1343 = self.ini;
                                                                                                                                                                                                        var $1344 = self.idx;
                                                                                                                                                                                                        var $1345 = self.str;
                                                                                                                                                                                                        var _reply$pst$114 = Parser$State$new$(Parser$Error$maybe_combine$($1332, $1341), $1342, $1343, $1344, $1345);
                                                                                                                                                                                                        var self = _reply$pst$114;
                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                                                var $1347 = self.err;
                                                                                                                                                                                                                var _reply$120 = Litereum$parse$term$(_world$1)(_reply$pst$114);
                                                                                                                                                                                                                var self = _reply$120;
                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                                                                        var $1349 = self.err;
                                                                                                                                                                                                                        var self = $1347;
                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                                                                var $1351 = self.value;
                                                                                                                                                                                                                                var $1352 = Parser$Reply$error$(Parser$Error$combine$($1351, $1349));
                                                                                                                                                                                                                                var $1350 = $1352;
                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                                                                var $1353 = Parser$Reply$error$($1349);
                                                                                                                                                                                                                                var $1350 = $1353;
                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                        };
                                                                                                                                                                                                                        var $1348 = $1350;
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                                                                        var $1354 = self.pst;
                                                                                                                                                                                                                        var $1355 = self.val;
                                                                                                                                                                                                                        var self = $1354;
                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                                                                var $1357 = self.err;
                                                                                                                                                                                                                                var $1358 = self.nam;
                                                                                                                                                                                                                                var $1359 = self.ini;
                                                                                                                                                                                                                                var $1360 = self.idx;
                                                                                                                                                                                                                                var $1361 = self.str;
                                                                                                                                                                                                                                var _reply$pst$128 = Parser$State$new$(Parser$Error$maybe_combine$($1347, $1357), $1358, $1359, $1360, $1361);
                                                                                                                                                                                                                                var self = _reply$pst$128;
                                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                                                        var $1363 = self.err;
                                                                                                                                                                                                                                        var _reply$134 = Litereum$parse$text$("_>_:", _reply$pst$128);
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
                                                                                                                                                                                                                                                var self = $1370;
                                                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                                                                        var $1372 = self.err;
                                                                                                                                                                                                                                                        var $1373 = self.nam;
                                                                                                                                                                                                                                                        var $1374 = self.ini;
                                                                                                                                                                                                                                                        var $1375 = self.idx;
                                                                                                                                                                                                                                                        var $1376 = self.str;
                                                                                                                                                                                                                                                        var _reply$pst$142 = Parser$State$new$(Parser$Error$maybe_combine$($1363, $1372), $1373, $1374, $1375, $1376);
                                                                                                                                                                                                                                                        var self = _reply$pst$142;
                                                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                                                                                                var $1378 = self.err;
                                                                                                                                                                                                                                                                var _reply$148 = Litereum$parse$term$(_world$1)(_reply$pst$142);
                                                                                                                                                                                                                                                                var self = _reply$148;
                                                                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                                                                                                                        var $1380 = self.err;
                                                                                                                                                                                                                                                                        var self = $1378;
                                                                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                                                                                                                var $1382 = self.value;
                                                                                                                                                                                                                                                                                var $1383 = Parser$Reply$error$(Parser$Error$combine$($1382, $1380));
                                                                                                                                                                                                                                                                                var $1381 = $1383;
                                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                                                                                                                var $1384 = Parser$Reply$error$($1380);
                                                                                                                                                                                                                                                                                var $1381 = $1384;
                                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                                                        var $1379 = $1381;
                                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                                                                                                                        var $1385 = self.pst;
                                                                                                                                                                                                                                                                        var $1386 = self.val;
                                                                                                                                                                                                                                                                        var self = $1385;
                                                                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                                                                                                                var $1388 = self.err;
                                                                                                                                                                                                                                                                                var $1389 = self.nam;
                                                                                                                                                                                                                                                                                var $1390 = self.ini;
                                                                                                                                                                                                                                                                                var $1391 = self.idx;
                                                                                                                                                                                                                                                                                var $1392 = self.str;
                                                                                                                                                                                                                                                                                var _reply$pst$156 = Parser$State$new$(Parser$Error$maybe_combine$($1378, $1388), $1389, $1390, $1391, $1392);
                                                                                                                                                                                                                                                                                var self = _reply$pst$156;
                                                                                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                                                                                                        var $1394 = self.err;
                                                                                                                                                                                                                                                                                        var _reply$162 = Litereum$parse$text$("}", _reply$pst$156);
                                                                                                                                                                                                                                                                                        var self = _reply$162;
                                                                                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                                                                                                                                                                var $1396 = self.err;
                                                                                                                                                                                                                                                                                                var self = $1394;
                                                                                                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                                                                                                                                                                        var $1398 = self.value;
                                                                                                                                                                                                                                                                                                        var $1399 = Parser$Reply$error$(Parser$Error$combine$($1398, $1396));
                                                                                                                                                                                                                                                                                                        var $1397 = $1399;
                                                                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                                                                                                                                                                        var $1400 = Parser$Reply$error$($1396);
                                                                                                                                                                                                                                                                                                        var $1397 = $1400;
                                                                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                                                                var $1395 = $1397;
                                                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                                                                                                                                                                var $1401 = self.pst;
                                                                                                                                                                                                                                                                                                var self = $1401;
                                                                                                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                                                                                                                        var $1403 = self.err;
                                                                                                                                                                                                                                                                                                        var $1404 = self.nam;
                                                                                                                                                                                                                                                                                                        var $1405 = self.ini;
                                                                                                                                                                                                                                                                                                        var $1406 = self.idx;
                                                                                                                                                                                                                                                                                                        var $1407 = self.str;
                                                                                                                                                                                                                                                                                                        var _reply$pst$170 = Parser$State$new$(Parser$Error$maybe_combine$($1394, $1403), $1404, $1405, $1406, $1407);
                                                                                                                                                                                                                                                                                                        var $1408 = Parser$Reply$value$(_reply$pst$170, Litereum$Term$compare$($1247, $1278, $1324, $1355, $1386));
                                                                                                                                                                                                                                                                                                        var $1402 = $1408;
                                                                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                                                                var $1395 = $1402;
                                                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                                                                        var $1393 = $1395;
                                                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                                                var $1387 = $1393;
                                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                                                        var $1379 = $1387;
                                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                                var $1377 = $1379;
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                                        var $1371 = $1377;
                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                var $1364 = $1371;
                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                        var $1362 = $1364;
                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                var $1356 = $1362;
                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                        };
                                                                                                                                                                                                                        var $1348 = $1356;
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                };
                                                                                                                                                                                                                var $1346 = $1348;
                                                                                                                                                                                                                break;
                                                                                                                                                                                                        };
                                                                                                                                                                                                        var $1340 = $1346;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $1333 = $1340;
                                                                                                                                                                                                break;
                                                                                                                                                                                        };
                                                                                                                                                                                        var $1331 = $1333;
                                                                                                                                                                                        break;
                                                                                                                                                                                };
                                                                                                                                                                                var $1325 = $1331;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $1317 = $1325;
                                                                                                                                                                        break;
                                                                                                                                                                };
                                                                                                                                                                var $1315 = $1317;
                                                                                                                                                                break;
                                                                                                                                                        };
                                                                                                                                                        var $1309 = $1315;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1302 = $1309;
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
                                                                                                var $1271 = $1279;
                                                                                                break;
                                                                                        };
                                                                                        var $1269 = $1271;
                                                                                        break;
                                                                                };
                                                                                var $1263 = $1269;
                                                                                break;
                                                                        };
                                                                        var $1256 = $1263;
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
                var $1410 = self.err;
                var _reply$7 = Litereum$parse$text$("+", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1412 = self.err;
                        var self = $1410;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1414 = self.value;
                                var $1415 = Parser$Reply$error$(Parser$Error$combine$($1414, $1412));
                                var $1413 = $1415;
                                break;
                            case 'Maybe.none':
                                var $1416 = Parser$Reply$error$($1412);
                                var $1413 = $1416;
                                break;
                        };
                        var $1411 = $1413;
                        break;
                    case 'Parser.Reply.value':
                        var $1417 = self.pst;
                        var self = $1417;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1419 = self.err;
                                var $1420 = self.nam;
                                var $1421 = self.ini;
                                var $1422 = self.idx;
                                var $1423 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1410, $1419), $1420, $1421, $1422, $1423);
                                var $1424 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$add));
                                var $1418 = $1424;
                                break;
                        };
                        var $1411 = $1418;
                        break;
                };
                var $1409 = $1411;
                break;
        };
        return $1409;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1426 = self.err;
                var _reply$7 = Litereum$parse$text$("-", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1428 = self.err;
                        var self = $1426;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1430 = self.value;
                                var $1431 = Parser$Reply$error$(Parser$Error$combine$($1430, $1428));
                                var $1429 = $1431;
                                break;
                            case 'Maybe.none':
                                var $1432 = Parser$Reply$error$($1428);
                                var $1429 = $1432;
                                break;
                        };
                        var $1427 = $1429;
                        break;
                    case 'Parser.Reply.value':
                        var $1433 = self.pst;
                        var self = $1433;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1435 = self.err;
                                var $1436 = self.nam;
                                var $1437 = self.ini;
                                var $1438 = self.idx;
                                var $1439 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1426, $1435), $1436, $1437, $1438, $1439);
                                var $1440 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$sub));
                                var $1434 = $1440;
                                break;
                        };
                        var $1427 = $1434;
                        break;
                };
                var $1425 = $1427;
                break;
        };
        return $1425;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1442 = self.err;
                var _reply$7 = Litereum$parse$text$("*", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1444 = self.err;
                        var self = $1442;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1446 = self.value;
                                var $1447 = Parser$Reply$error$(Parser$Error$combine$($1446, $1444));
                                var $1445 = $1447;
                                break;
                            case 'Maybe.none':
                                var $1448 = Parser$Reply$error$($1444);
                                var $1445 = $1448;
                                break;
                        };
                        var $1443 = $1445;
                        break;
                    case 'Parser.Reply.value':
                        var $1449 = self.pst;
                        var self = $1449;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1451 = self.err;
                                var $1452 = self.nam;
                                var $1453 = self.ini;
                                var $1454 = self.idx;
                                var $1455 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1442, $1451), $1452, $1453, $1454, $1455);
                                var $1456 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$mul));
                                var $1450 = $1456;
                                break;
                        };
                        var $1443 = $1450;
                        break;
                };
                var $1441 = $1443;
                break;
        };
        return $1441;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1458 = self.err;
                var _reply$7 = Litereum$parse$text$("/", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1460 = self.err;
                        var self = $1458;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1462 = self.value;
                                var $1463 = Parser$Reply$error$(Parser$Error$combine$($1462, $1460));
                                var $1461 = $1463;
                                break;
                            case 'Maybe.none':
                                var $1464 = Parser$Reply$error$($1460);
                                var $1461 = $1464;
                                break;
                        };
                        var $1459 = $1461;
                        break;
                    case 'Parser.Reply.value':
                        var $1465 = self.pst;
                        var self = $1465;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1467 = self.err;
                                var $1468 = self.nam;
                                var $1469 = self.ini;
                                var $1470 = self.idx;
                                var $1471 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1458, $1467), $1468, $1469, $1470, $1471);
                                var $1472 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$div));
                                var $1466 = $1472;
                                break;
                        };
                        var $1459 = $1466;
                        break;
                };
                var $1457 = $1459;
                break;
        };
        return $1457;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1474 = self.err;
                var _reply$7 = Litereum$parse$text$("%", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1476 = self.err;
                        var self = $1474;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1478 = self.value;
                                var $1479 = Parser$Reply$error$(Parser$Error$combine$($1478, $1476));
                                var $1477 = $1479;
                                break;
                            case 'Maybe.none':
                                var $1480 = Parser$Reply$error$($1476);
                                var $1477 = $1480;
                                break;
                        };
                        var $1475 = $1477;
                        break;
                    case 'Parser.Reply.value':
                        var $1481 = self.pst;
                        var self = $1481;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1483 = self.err;
                                var $1484 = self.nam;
                                var $1485 = self.ini;
                                var $1486 = self.idx;
                                var $1487 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1474, $1483), $1484, $1485, $1486, $1487);
                                var $1488 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$mod));
                                var $1482 = $1488;
                                break;
                        };
                        var $1475 = $1482;
                        break;
                };
                var $1473 = $1475;
                break;
        };
        return $1473;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1490 = self.err;
                var _reply$7 = Litereum$parse$text$("|", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1492 = self.err;
                        var self = $1490;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1494 = self.value;
                                var $1495 = Parser$Reply$error$(Parser$Error$combine$($1494, $1492));
                                var $1493 = $1495;
                                break;
                            case 'Maybe.none':
                                var $1496 = Parser$Reply$error$($1492);
                                var $1493 = $1496;
                                break;
                        };
                        var $1491 = $1493;
                        break;
                    case 'Parser.Reply.value':
                        var $1497 = self.pst;
                        var self = $1497;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1499 = self.err;
                                var $1500 = self.nam;
                                var $1501 = self.ini;
                                var $1502 = self.idx;
                                var $1503 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1490, $1499), $1500, $1501, $1502, $1503);
                                var $1504 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$or));
                                var $1498 = $1504;
                                break;
                        };
                        var $1491 = $1498;
                        break;
                };
                var $1489 = $1491;
                break;
        };
        return $1489;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1506 = self.err;
                var _reply$7 = Litereum$parse$text$("&", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1508 = self.err;
                        var self = $1506;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1510 = self.value;
                                var $1511 = Parser$Reply$error$(Parser$Error$combine$($1510, $1508));
                                var $1509 = $1511;
                                break;
                            case 'Maybe.none':
                                var $1512 = Parser$Reply$error$($1508);
                                var $1509 = $1512;
                                break;
                        };
                        var $1507 = $1509;
                        break;
                    case 'Parser.Reply.value':
                        var $1513 = self.pst;
                        var self = $1513;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1515 = self.err;
                                var $1516 = self.nam;
                                var $1517 = self.ini;
                                var $1518 = self.idx;
                                var $1519 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1506, $1515), $1516, $1517, $1518, $1519);
                                var $1520 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$and));
                                var $1514 = $1520;
                                break;
                        };
                        var $1507 = $1514;
                        break;
                };
                var $1505 = $1507;
                break;
        };
        return $1505;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1522 = self.err;
                var _reply$7 = Litereum$parse$text$("^", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1524 = self.err;
                        var self = $1522;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1526 = self.value;
                                var $1527 = Parser$Reply$error$(Parser$Error$combine$($1526, $1524));
                                var $1525 = $1527;
                                break;
                            case 'Maybe.none':
                                var $1528 = Parser$Reply$error$($1524);
                                var $1525 = $1528;
                                break;
                        };
                        var $1523 = $1525;
                        break;
                    case 'Parser.Reply.value':
                        var $1529 = self.pst;
                        var self = $1529;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1531 = self.err;
                                var $1532 = self.nam;
                                var $1533 = self.ini;
                                var $1534 = self.idx;
                                var $1535 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1522, $1531), $1532, $1533, $1534, $1535);
                                var $1536 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$xor));
                                var $1530 = $1536;
                                break;
                        };
                        var $1523 = $1530;
                        break;
                };
                var $1521 = $1523;
                break;
        };
        return $1521;
    }), List$cons$((_pst$1 => {
        var $1537 = Parser$Reply$value$(_pst$1, Maybe$none);
        return $1537;
    }), List$nil))))))))));

    function Litereum$Term$operate$(_oper$1, _val0$2, _val1$3) {
        var $1538 = ({
            _: 'Litereum.Term.operate',
            'oper': _oper$1,
            'val0': _val0$2,
            'val1': _val1$3
        });
        return $1538;
    };
    const Litereum$Term$operate = x0 => x1 => x2 => Litereum$Term$operate$(x0, x1, x2);

    function Litereum$parse$term$operate$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1540 = self.err;
                var _reply$8 = Litereum$parse$term$operation(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1542 = self.err;
                        var self = $1540;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1544 = self.value;
                                var $1545 = Parser$Reply$error$(Parser$Error$combine$($1544, $1542));
                                var $1543 = $1545;
                                break;
                            case 'Maybe.none':
                                var $1546 = Parser$Reply$error$($1542);
                                var $1543 = $1546;
                                break;
                        };
                        var $1541 = $1543;
                        break;
                    case 'Parser.Reply.value':
                        var $1547 = self.pst;
                        var $1548 = self.val;
                        var self = $1547;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1550 = self.err;
                                var $1551 = self.nam;
                                var $1552 = self.ini;
                                var $1553 = self.idx;
                                var $1554 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1540, $1550), $1551, $1552, $1553, $1554);
                                var self = $1548;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $1556 = self.value;
                                        var $1557 = (_pst$18 => {
                                            var self = _pst$18;
                                            switch (self._) {
                                                case 'Parser.State.new':
                                                    var $1559 = self.err;
                                                    var _reply$24 = Litereum$parse$text$("(", _pst$18);
                                                    var self = _reply$24;
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
                                                            var self = $1566;
                                                            switch (self._) {
                                                                case 'Parser.State.new':
                                                                    var $1568 = self.err;
                                                                    var $1569 = self.nam;
                                                                    var $1570 = self.ini;
                                                                    var $1571 = self.idx;
                                                                    var $1572 = self.str;
                                                                    var _reply$pst$32 = Parser$State$new$(Parser$Error$maybe_combine$($1559, $1568), $1569, $1570, $1571, $1572);
                                                                    var self = _reply$pst$32;
                                                                    switch (self._) {
                                                                        case 'Parser.State.new':
                                                                            var $1574 = self.err;
                                                                            var _reply$38 = Litereum$parse$term$(_world$1)(_reply$pst$32);
                                                                            var self = _reply$38;
                                                                            switch (self._) {
                                                                                case 'Parser.Reply.error':
                                                                                    var $1576 = self.err;
                                                                                    var self = $1574;
                                                                                    switch (self._) {
                                                                                        case 'Maybe.some':
                                                                                            var $1578 = self.value;
                                                                                            var $1579 = Parser$Reply$error$(Parser$Error$combine$($1578, $1576));
                                                                                            var $1577 = $1579;
                                                                                            break;
                                                                                        case 'Maybe.none':
                                                                                            var $1580 = Parser$Reply$error$($1576);
                                                                                            var $1577 = $1580;
                                                                                            break;
                                                                                    };
                                                                                    var $1575 = $1577;
                                                                                    break;
                                                                                case 'Parser.Reply.value':
                                                                                    var $1581 = self.pst;
                                                                                    var $1582 = self.val;
                                                                                    var self = $1581;
                                                                                    switch (self._) {
                                                                                        case 'Parser.State.new':
                                                                                            var $1584 = self.err;
                                                                                            var $1585 = self.nam;
                                                                                            var $1586 = self.ini;
                                                                                            var $1587 = self.idx;
                                                                                            var $1588 = self.str;
                                                                                            var _reply$pst$46 = Parser$State$new$(Parser$Error$maybe_combine$($1574, $1584), $1585, $1586, $1587, $1588);
                                                                                            var self = _reply$pst$46;
                                                                                            switch (self._) {
                                                                                                case 'Parser.State.new':
                                                                                                    var $1590 = self.err;
                                                                                                    var _reply$52 = Parser$maybe$(Litereum$parse$text(","), _reply$pst$46);
                                                                                                    var self = _reply$52;
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
                                                                                                            var self = $1597;
                                                                                                            switch (self._) {
                                                                                                                case 'Parser.State.new':
                                                                                                                    var $1599 = self.err;
                                                                                                                    var $1600 = self.nam;
                                                                                                                    var $1601 = self.ini;
                                                                                                                    var $1602 = self.idx;
                                                                                                                    var $1603 = self.str;
                                                                                                                    var _reply$pst$60 = Parser$State$new$(Parser$Error$maybe_combine$($1590, $1599), $1600, $1601, $1602, $1603);
                                                                                                                    var self = _reply$pst$60;
                                                                                                                    switch (self._) {
                                                                                                                        case 'Parser.State.new':
                                                                                                                            var $1605 = self.err;
                                                                                                                            var _reply$66 = Litereum$parse$term$(_world$1)(_reply$pst$60);
                                                                                                                            var self = _reply$66;
                                                                                                                            switch (self._) {
                                                                                                                                case 'Parser.Reply.error':
                                                                                                                                    var $1607 = self.err;
                                                                                                                                    var self = $1605;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Maybe.some':
                                                                                                                                            var $1609 = self.value;
                                                                                                                                            var $1610 = Parser$Reply$error$(Parser$Error$combine$($1609, $1607));
                                                                                                                                            var $1608 = $1610;
                                                                                                                                            break;
                                                                                                                                        case 'Maybe.none':
                                                                                                                                            var $1611 = Parser$Reply$error$($1607);
                                                                                                                                            var $1608 = $1611;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1606 = $1608;
                                                                                                                                    break;
                                                                                                                                case 'Parser.Reply.value':
                                                                                                                                    var $1612 = self.pst;
                                                                                                                                    var $1613 = self.val;
                                                                                                                                    var self = $1612;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Parser.State.new':
                                                                                                                                            var $1615 = self.err;
                                                                                                                                            var $1616 = self.nam;
                                                                                                                                            var $1617 = self.ini;
                                                                                                                                            var $1618 = self.idx;
                                                                                                                                            var $1619 = self.str;
                                                                                                                                            var _reply$pst$74 = Parser$State$new$(Parser$Error$maybe_combine$($1605, $1615), $1616, $1617, $1618, $1619);
                                                                                                                                            var self = _reply$pst$74;
                                                                                                                                            switch (self._) {
                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                    var $1621 = self.err;
                                                                                                                                                    var _reply$80 = Litereum$parse$text$(")", _reply$pst$74);
                                                                                                                                                    var self = _reply$80;
                                                                                                                                                    switch (self._) {
                                                                                                                                                        case 'Parser.Reply.error':
                                                                                                                                                            var $1623 = self.err;
                                                                                                                                                            var self = $1621;
                                                                                                                                                            switch (self._) {
                                                                                                                                                                case 'Maybe.some':
                                                                                                                                                                    var $1625 = self.value;
                                                                                                                                                                    var $1626 = Parser$Reply$error$(Parser$Error$combine$($1625, $1623));
                                                                                                                                                                    var $1624 = $1626;
                                                                                                                                                                    break;
                                                                                                                                                                case 'Maybe.none':
                                                                                                                                                                    var $1627 = Parser$Reply$error$($1623);
                                                                                                                                                                    var $1624 = $1627;
                                                                                                                                                                    break;
                                                                                                                                                            };
                                                                                                                                                            var $1622 = $1624;
                                                                                                                                                            break;
                                                                                                                                                        case 'Parser.Reply.value':
                                                                                                                                                            var $1628 = self.pst;
                                                                                                                                                            var self = $1628;
                                                                                                                                                            switch (self._) {
                                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                                    var $1630 = self.err;
                                                                                                                                                                    var $1631 = self.nam;
                                                                                                                                                                    var $1632 = self.ini;
                                                                                                                                                                    var $1633 = self.idx;
                                                                                                                                                                    var $1634 = self.str;
                                                                                                                                                                    var _reply$pst$88 = Parser$State$new$(Parser$Error$maybe_combine$($1621, $1630), $1631, $1632, $1633, $1634);
                                                                                                                                                                    var $1635 = Parser$Reply$value$(_reply$pst$88, Litereum$Term$operate$($1556, $1582, $1613));
                                                                                                                                                                    var $1629 = $1635;
                                                                                                                                                                    break;
                                                                                                                                                            };
                                                                                                                                                            var $1622 = $1629;
                                                                                                                                                            break;
                                                                                                                                                    };
                                                                                                                                                    var $1620 = $1622;
                                                                                                                                                    break;
                                                                                                                                            };
                                                                                                                                            var $1614 = $1620;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1606 = $1614;
                                                                                                                                    break;
                                                                                                                            };
                                                                                                                            var $1604 = $1606;
                                                                                                                            break;
                                                                                                                    };
                                                                                                                    var $1598 = $1604;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $1591 = $1598;
                                                                                                            break;
                                                                                                    };
                                                                                                    var $1589 = $1591;
                                                                                                    break;
                                                                                            };
                                                                                            var $1583 = $1589;
                                                                                            break;
                                                                                    };
                                                                                    var $1575 = $1583;
                                                                                    break;
                                                                            };
                                                                            var $1573 = $1575;
                                                                            break;
                                                                    };
                                                                    var $1567 = $1573;
                                                                    break;
                                                            };
                                                            var $1560 = $1567;
                                                            break;
                                                    };
                                                    var $1558 = $1560;
                                                    break;
                                            };
                                            return $1558;
                                        });
                                        var $1555 = $1557;
                                        break;
                                    case 'Maybe.none':
                                        var $1636 = Parser$fail("Not an operation.");
                                        var $1555 = $1636;
                                        break;
                                };
                                var $1555 = $1555(_reply$pst$16);
                                var $1549 = $1555;
                                break;
                        };
                        var $1541 = $1549;
                        break;
                };
                var $1539 = $1541;
                break;
        };
        return $1539;
    };
    const Litereum$parse$term$operate = x0 => x1 => Litereum$parse$term$operate$(x0, x1);

    function Litereum$Term$bind$(_name$1, _main$2, _body$3) {
        var $1637 = ({
            _: 'Litereum.Term.bind',
            'name': _name$1,
            'main': _main$2,
            'body': _body$3
        });
        return $1637;
    };
    const Litereum$Term$bind = x0 => x1 => x2 => Litereum$Term$bind$(x0, x1, x2);

    function Litereum$parse$term$bind$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1639 = self.err;
                var _reply$8 = Litereum$parse$text$("bind", _pst$2);
                var self = _reply$8;
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
                        var self = $1646;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1648 = self.err;
                                var $1649 = self.nam;
                                var $1650 = self.ini;
                                var $1651 = self.idx;
                                var $1652 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1639, $1648), $1649, $1650, $1651, $1652);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1654 = self.err;
                                        var _reply$22 = Litereum$parse$name$(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1656 = self.err;
                                                var self = $1654;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1658 = self.value;
                                                        var $1659 = Parser$Reply$error$(Parser$Error$combine$($1658, $1656));
                                                        var $1657 = $1659;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1660 = Parser$Reply$error$($1656);
                                                        var $1657 = $1660;
                                                        break;
                                                };
                                                var $1655 = $1657;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1661 = self.pst;
                                                var $1662 = self.val;
                                                var self = $1661;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1664 = self.err;
                                                        var $1665 = self.nam;
                                                        var $1666 = self.ini;
                                                        var $1667 = self.idx;
                                                        var $1668 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1654, $1664), $1665, $1666, $1667, $1668);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $1670 = self.err;
                                                                var _reply$36 = Litereum$parse$text$("{", _reply$pst$30);
                                                                var self = _reply$36;
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
                                                                        var self = $1677;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $1679 = self.err;
                                                                                var $1680 = self.nam;
                                                                                var $1681 = self.ini;
                                                                                var $1682 = self.idx;
                                                                                var $1683 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($1670, $1679), $1680, $1681, $1682, $1683);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $1685 = self.err;
                                                                                        var _reply$50 = Litereum$parse$term$(_world$1)(_reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1687 = self.err;
                                                                                                var self = $1685;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $1689 = self.value;
                                                                                                        var $1690 = Parser$Reply$error$(Parser$Error$combine$($1689, $1687));
                                                                                                        var $1688 = $1690;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $1691 = Parser$Reply$error$($1687);
                                                                                                        var $1688 = $1691;
                                                                                                        break;
                                                                                                };
                                                                                                var $1686 = $1688;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1692 = self.pst;
                                                                                                var $1693 = self.val;
                                                                                                var self = $1692;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $1695 = self.err;
                                                                                                        var $1696 = self.nam;
                                                                                                        var $1697 = self.ini;
                                                                                                        var $1698 = self.idx;
                                                                                                        var $1699 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($1685, $1695), $1696, $1697, $1698, $1699);
                                                                                                        var self = _reply$pst$58;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $1701 = self.err;
                                                                                                                var _reply$64 = Litereum$parse$text$("}", _reply$pst$58);
                                                                                                                var self = _reply$64;
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
                                                                                                                        var self = $1708;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $1710 = self.err;
                                                                                                                                var $1711 = self.nam;
                                                                                                                                var $1712 = self.ini;
                                                                                                                                var $1713 = self.idx;
                                                                                                                                var $1714 = self.str;
                                                                                                                                var _reply$pst$72 = Parser$State$new$(Parser$Error$maybe_combine$($1701, $1710), $1711, $1712, $1713, $1714);
                                                                                                                                var self = _reply$pst$72;
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.State.new':
                                                                                                                                        var $1716 = self.err;
                                                                                                                                        var _reply$78 = Litereum$parse$term$(_world$1)(_reply$pst$72);
                                                                                                                                        var self = _reply$78;
                                                                                                                                        switch (self._) {
                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                var $1718 = self.err;
                                                                                                                                                var self = $1716;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                        var $1720 = self.value;
                                                                                                                                                        var $1721 = Parser$Reply$error$(Parser$Error$combine$($1720, $1718));
                                                                                                                                                        var $1719 = $1721;
                                                                                                                                                        break;
                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                        var $1722 = Parser$Reply$error$($1718);
                                                                                                                                                        var $1719 = $1722;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1717 = $1719;
                                                                                                                                                break;
                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                var $1723 = self.pst;
                                                                                                                                                var $1724 = self.val;
                                                                                                                                                var self = $1723;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                        var $1726 = self.err;
                                                                                                                                                        var $1727 = self.nam;
                                                                                                                                                        var $1728 = self.ini;
                                                                                                                                                        var $1729 = self.idx;
                                                                                                                                                        var $1730 = self.str;
                                                                                                                                                        var _reply$pst$86 = Parser$State$new$(Parser$Error$maybe_combine$($1716, $1726), $1727, $1728, $1729, $1730);
                                                                                                                                                        var $1731 = Parser$Reply$value$(_reply$pst$86, Litereum$Term$bind$($1662, $1693, $1724));
                                                                                                                                                        var $1725 = $1731;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1717 = $1725;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $1715 = $1717;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $1709 = $1715;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1702 = $1709;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $1700 = $1702;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1694 = $1700;
                                                                                                        break;
                                                                                                };
                                                                                                var $1686 = $1694;
                                                                                                break;
                                                                                        };
                                                                                        var $1684 = $1686;
                                                                                        break;
                                                                                };
                                                                                var $1678 = $1684;
                                                                                break;
                                                                        };
                                                                        var $1671 = $1678;
                                                                        break;
                                                                };
                                                                var $1669 = $1671;
                                                                break;
                                                        };
                                                        var $1663 = $1669;
                                                        break;
                                                };
                                                var $1655 = $1663;
                                                break;
                                        };
                                        var $1653 = $1655;
                                        break;
                                };
                                var $1647 = $1653;
                                break;
                        };
                        var $1640 = $1647;
                        break;
                };
                var $1638 = $1640;
                break;
        };
        return $1638;
    };
    const Litereum$parse$term$bind = x0 => x1 => Litereum$parse$term$bind$(x0, x1);

    function Litereum$Term$call$(_bond$1, _args$2) {
        var $1732 = ({
            _: 'Litereum.Term.call',
            'bond': _bond$1,
            'args': _args$2
        });
        return $1732;
    };
    const Litereum$Term$call = x0 => x1 => Litereum$Term$call$(x0, x1);

    function Litereum$parse$term$call$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1734 = self.err;
                var _reply$8 = Litereum$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1736 = self.err;
                        var self = $1734;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1738 = self.value;
                                var $1739 = Parser$Reply$error$(Parser$Error$combine$($1738, $1736));
                                var $1737 = $1739;
                                break;
                            case 'Maybe.none':
                                var $1740 = Parser$Reply$error$($1736);
                                var $1737 = $1740;
                                break;
                        };
                        var $1735 = $1737;
                        break;
                    case 'Parser.Reply.value':
                        var $1741 = self.pst;
                        var $1742 = self.val;
                        var self = $1741;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1744 = self.err;
                                var $1745 = self.nam;
                                var $1746 = self.ini;
                                var $1747 = self.idx;
                                var $1748 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1734, $1744), $1745, $1746, $1747, $1748);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1750 = self.err;
                                        var _reply$22 = Parser$wrap$(Litereum$parse$text("("), (_pst$22 => {
                                            var self = _pst$22;
                                            switch (self._) {
                                                case 'Parser.State.new':
                                                    var $1753 = self.err;
                                                    var _reply$28 = Parser$maybe$(Litereum$parse$text(","), _pst$22);
                                                    var self = _reply$28;
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $1755 = self.err;
                                                            var self = $1753;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $1757 = self.value;
                                                                    var $1758 = Parser$Reply$error$(Parser$Error$combine$($1757, $1755));
                                                                    var $1756 = $1758;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $1759 = Parser$Reply$error$($1755);
                                                                    var $1756 = $1759;
                                                                    break;
                                                            };
                                                            var $1754 = $1756;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $1760 = self.pst;
                                                            var self = $1760;
                                                            switch (self._) {
                                                                case 'Parser.State.new':
                                                                    var $1762 = self.err;
                                                                    var $1763 = self.nam;
                                                                    var $1764 = self.ini;
                                                                    var $1765 = self.idx;
                                                                    var $1766 = self.str;
                                                                    var _reply$pst$36 = Parser$State$new$(Parser$Error$maybe_combine$($1753, $1762), $1763, $1764, $1765, $1766);
                                                                    var $1767 = Litereum$parse$term$(_world$1)(_reply$pst$36);
                                                                    var $1761 = $1767;
                                                                    break;
                                                            };
                                                            var $1754 = $1761;
                                                            break;
                                                    };
                                                    var $1752 = $1754;
                                                    break;
                                            };
                                            return $1752;
                                        }), Litereum$parse$text(")"), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1768 = self.err;
                                                var self = $1750;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1770 = self.value;
                                                        var $1771 = Parser$Reply$error$(Parser$Error$combine$($1770, $1768));
                                                        var $1769 = $1771;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1772 = Parser$Reply$error$($1768);
                                                        var $1769 = $1772;
                                                        break;
                                                };
                                                var $1751 = $1769;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1773 = self.pst;
                                                var $1774 = self.val;
                                                var self = $1773;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1776 = self.err;
                                                        var $1777 = self.nam;
                                                        var $1778 = self.ini;
                                                        var $1779 = self.idx;
                                                        var $1780 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1750, $1776), $1777, $1778, $1779, $1780);
                                                        var $1781 = Parser$Reply$value$(_reply$pst$30, Litereum$Term$call$($1742, $1774));
                                                        var $1775 = $1781;
                                                        break;
                                                };
                                                var $1751 = $1775;
                                                break;
                                        };
                                        var $1749 = $1751;
                                        break;
                                };
                                var $1743 = $1749;
                                break;
                        };
                        var $1735 = $1743;
                        break;
                };
                var $1733 = $1735;
                break;
        };
        return $1733;
    };
    const Litereum$parse$term$call = x0 => x1 => Litereum$parse$term$call$(x0, x1);

    function Litereum$Term$var$(_name$1) {
        var $1782 = ({
            _: 'Litereum.Term.var',
            'name': _name$1
        });
        return $1782;
    };
    const Litereum$Term$var = x0 => Litereum$Term$var$(x0);

    function Litereum$parse$term$var$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1784 = self.err;
                var _reply$8 = Litereum$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1786 = self.err;
                        var self = $1784;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1788 = self.value;
                                var $1789 = Parser$Reply$error$(Parser$Error$combine$($1788, $1786));
                                var $1787 = $1789;
                                break;
                            case 'Maybe.none':
                                var $1790 = Parser$Reply$error$($1786);
                                var $1787 = $1790;
                                break;
                        };
                        var $1785 = $1787;
                        break;
                    case 'Parser.Reply.value':
                        var $1791 = self.pst;
                        var $1792 = self.val;
                        var self = $1791;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1794 = self.err;
                                var $1795 = self.nam;
                                var $1796 = self.ini;
                                var $1797 = self.idx;
                                var $1798 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1784, $1794), $1795, $1796, $1797, $1798);
                                var $1799 = Parser$Reply$value$(_reply$pst$16, Litereum$Term$var$($1792));
                                var $1793 = $1799;
                                break;
                        };
                        var $1785 = $1793;
                        break;
                };
                var $1783 = $1785;
                break;
        };
        return $1783;
    };
    const Litereum$parse$term$var = x0 => x1 => Litereum$parse$term$var$(x0, x1);

    function Litereum$parse$term$(_world$1) {
        var $1800 = Parser$choice(List$cons$(Litereum$parse$term$let(_world$1), List$cons$(Litereum$parse$term$create(_world$1), List$cons$(Litereum$parse$term$match(_world$1), List$cons$(Litereum$parse$term$word(_world$1), List$cons$(Litereum$parse$term$compare(_world$1), List$cons$(Litereum$parse$term$operate(_world$1), List$cons$(Litereum$parse$term$bind(_world$1), List$cons$(Litereum$parse$term$call(_world$1), List$cons$(Litereum$parse$term$var(_world$1), List$nil))))))))));
        return $1800;
    };
    const Litereum$parse$term = x0 => Litereum$parse$term$(x0);

    function Litereum$Bond$new$(_name$1, _input_names$2, _input_types$3, _output_type$4, _main$5, _owners$6) {
        var $1801 = ({
            _: 'Litereum.Bond.new',
            'name': _name$1,
            'input_names': _input_names$2,
            'input_types': _input_types$3,
            'output_type': _output_type$4,
            'main': _main$5,
            'owners': _owners$6
        });
        return $1801;
    };
    const Litereum$Bond$new = x0 => x1 => x2 => x3 => x4 => x5 => Litereum$Bond$new$(x0, x1, x2, x3, x4, x5);

    function Litereum$parse$bond$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1803 = self.err;
                var _reply$8 = Litereum$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1805 = self.err;
                        var self = $1803;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1807 = self.value;
                                var $1808 = Parser$Reply$error$(Parser$Error$combine$($1807, $1805));
                                var $1806 = $1808;
                                break;
                            case 'Maybe.none':
                                var $1809 = Parser$Reply$error$($1805);
                                var $1806 = $1809;
                                break;
                        };
                        var $1804 = $1806;
                        break;
                    case 'Parser.Reply.value':
                        var $1810 = self.pst;
                        var $1811 = self.val;
                        var self = $1810;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1813 = self.err;
                                var $1814 = self.nam;
                                var $1815 = self.ini;
                                var $1816 = self.idx;
                                var $1817 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1803, $1813), $1814, $1815, $1816, $1817);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1819 = self.err;
                                        var _reply$22 = Parser$wrap$(Litereum$parse$text("("), Litereum$parse$ann(_world$1), Litereum$parse$text(")"), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1821 = self.err;
                                                var self = $1819;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1823 = self.value;
                                                        var $1824 = Parser$Reply$error$(Parser$Error$combine$($1823, $1821));
                                                        var $1822 = $1824;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1825 = Parser$Reply$error$($1821);
                                                        var $1822 = $1825;
                                                        break;
                                                };
                                                var $1820 = $1822;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1826 = self.pst;
                                                var $1827 = self.val;
                                                var self = $1826;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1829 = self.err;
                                                        var $1830 = self.nam;
                                                        var $1831 = self.ini;
                                                        var $1832 = self.idx;
                                                        var $1833 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1819, $1829), $1830, $1831, $1832, $1833);
                                                        var _iarg$31 = List$mapped$($1827, (_x$31 => {
                                                            var self = _x$31;
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $1836 = self.fst;
                                                                    var $1837 = $1836;
                                                                    var $1835 = $1837;
                                                                    break;
                                                            };
                                                            return $1835;
                                                        }));
                                                        var _ityp$32 = List$mapped$($1827, (_x$32 => {
                                                            var self = _x$32;
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $1839 = self.snd;
                                                                    var $1840 = $1839;
                                                                    var $1838 = $1840;
                                                                    break;
                                                            };
                                                            return $1838;
                                                        }));
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $1841 = self.err;
                                                                var _reply$38 = Litereum$parse$text$(":", _reply$pst$30);
                                                                var self = _reply$38;
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
                                                                        var self = $1848;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $1850 = self.err;
                                                                                var $1851 = self.nam;
                                                                                var $1852 = self.ini;
                                                                                var $1853 = self.idx;
                                                                                var $1854 = self.str;
                                                                                var _reply$pst$46 = Parser$State$new$(Parser$Error$maybe_combine$($1841, $1850), $1851, $1852, $1853, $1854);
                                                                                var self = _reply$pst$46;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $1856 = self.err;
                                                                                        var _reply$52 = Litereum$parse$type$(_world$1)(_reply$pst$46);
                                                                                        var self = _reply$52;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1858 = self.err;
                                                                                                var self = $1856;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $1860 = self.value;
                                                                                                        var $1861 = Parser$Reply$error$(Parser$Error$combine$($1860, $1858));
                                                                                                        var $1859 = $1861;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $1862 = Parser$Reply$error$($1858);
                                                                                                        var $1859 = $1862;
                                                                                                        break;
                                                                                                };
                                                                                                var $1857 = $1859;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1863 = self.pst;
                                                                                                var $1864 = self.val;
                                                                                                var self = $1863;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $1866 = self.err;
                                                                                                        var $1867 = self.nam;
                                                                                                        var $1868 = self.ini;
                                                                                                        var $1869 = self.idx;
                                                                                                        var $1870 = self.str;
                                                                                                        var _reply$pst$60 = Parser$State$new$(Parser$Error$maybe_combine$($1856, $1866), $1867, $1868, $1869, $1870);
                                                                                                        var self = _reply$pst$60;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $1872 = self.err;
                                                                                                                var _reply$66 = Litereum$parse$text$("{", _reply$pst$60);
                                                                                                                var self = _reply$66;
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
                                                                                                                        var self = $1879;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $1881 = self.err;
                                                                                                                                var $1882 = self.nam;
                                                                                                                                var $1883 = self.ini;
                                                                                                                                var $1884 = self.idx;
                                                                                                                                var $1885 = self.str;
                                                                                                                                var _reply$pst$74 = Parser$State$new$(Parser$Error$maybe_combine$($1872, $1881), $1882, $1883, $1884, $1885);
                                                                                                                                var self = _reply$pst$74;
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.State.new':
                                                                                                                                        var $1887 = self.err;
                                                                                                                                        var _reply$80 = Litereum$parse$term$(_world$1)(_reply$pst$74);
                                                                                                                                        var self = _reply$80;
                                                                                                                                        switch (self._) {
                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                var $1889 = self.err;
                                                                                                                                                var self = $1887;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                        var $1891 = self.value;
                                                                                                                                                        var $1892 = Parser$Reply$error$(Parser$Error$combine$($1891, $1889));
                                                                                                                                                        var $1890 = $1892;
                                                                                                                                                        break;
                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                        var $1893 = Parser$Reply$error$($1889);
                                                                                                                                                        var $1890 = $1893;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1888 = $1890;
                                                                                                                                                break;
                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                var $1894 = self.pst;
                                                                                                                                                var $1895 = self.val;
                                                                                                                                                var self = $1894;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                        var $1897 = self.err;
                                                                                                                                                        var $1898 = self.nam;
                                                                                                                                                        var $1899 = self.ini;
                                                                                                                                                        var $1900 = self.idx;
                                                                                                                                                        var $1901 = self.str;
                                                                                                                                                        var _reply$pst$88 = Parser$State$new$(Parser$Error$maybe_combine$($1887, $1897), $1898, $1899, $1900, $1901);
                                                                                                                                                        var self = _reply$pst$88;
                                                                                                                                                        switch (self._) {
                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                var $1903 = self.err;
                                                                                                                                                                var _reply$94 = Litereum$parse$text$("}", _reply$pst$88);
                                                                                                                                                                var self = _reply$94;
                                                                                                                                                                switch (self._) {
                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                        var $1905 = self.err;
                                                                                                                                                                        var self = $1903;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                var $1907 = self.value;
                                                                                                                                                                                var $1908 = Parser$Reply$error$(Parser$Error$combine$($1907, $1905));
                                                                                                                                                                                var $1906 = $1908;
                                                                                                                                                                                break;
                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                var $1909 = Parser$Reply$error$($1905);
                                                                                                                                                                                var $1906 = $1909;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $1904 = $1906;
                                                                                                                                                                        break;
                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                        var $1910 = self.pst;
                                                                                                                                                                        var self = $1910;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                var $1912 = self.err;
                                                                                                                                                                                var $1913 = self.nam;
                                                                                                                                                                                var $1914 = self.ini;
                                                                                                                                                                                var $1915 = self.idx;
                                                                                                                                                                                var $1916 = self.str;
                                                                                                                                                                                var _reply$pst$102 = Parser$State$new$(Parser$Error$maybe_combine$($1903, $1912), $1913, $1914, $1915, $1916);
                                                                                                                                                                                var self = _reply$pst$102;
                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                        var $1918 = self.err;
                                                                                                                                                                                        var _reply$108 = Parser$many$((_pst$108 => {
                                                                                                                                                                                            var self = _pst$108;
                                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                                                                    var $1921 = self.err;
                                                                                                                                                                                                    var _reply$114 = Litereum$parse$text$("@", _pst$108);
                                                                                                                                                                                                    var self = _reply$114;
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
                                                                                                                                                                                                            var self = $1928;
                                                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                                                                                    var $1930 = self.err;
                                                                                                                                                                                                                    var $1931 = self.nam;
                                                                                                                                                                                                                    var $1932 = self.ini;
                                                                                                                                                                                                                    var $1933 = self.idx;
                                                                                                                                                                                                                    var $1934 = self.str;
                                                                                                                                                                                                                    var _reply$pst$122 = Parser$State$new$(Parser$Error$maybe_combine$($1921, $1930), $1931, $1932, $1933, $1934);
                                                                                                                                                                                                                    var self = _reply$pst$122;
                                                                                                                                                                                                                    switch (self._) {
                                                                                                                                                                                                                        case 'Parser.State.new':
                                                                                                                                                                                                                            var $1936 = self.err;
                                                                                                                                                                                                                            var _reply$128 = Litereum$parse$name$(_reply$pst$122);
                                                                                                                                                                                                                            var self = _reply$128;
                                                                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                                                                case 'Parser.Reply.error':
                                                                                                                                                                                                                                    var $1938 = self.err;
                                                                                                                                                                                                                                    var self = $1936;
                                                                                                                                                                                                                                    switch (self._) {
                                                                                                                                                                                                                                        case 'Maybe.some':
                                                                                                                                                                                                                                            var $1940 = self.value;
                                                                                                                                                                                                                                            var $1941 = Parser$Reply$error$(Parser$Error$combine$($1940, $1938));
                                                                                                                                                                                                                                            var $1939 = $1941;
                                                                                                                                                                                                                                            break;
                                                                                                                                                                                                                                        case 'Maybe.none':
                                                                                                                                                                                                                                            var $1942 = Parser$Reply$error$($1938);
                                                                                                                                                                                                                                            var $1939 = $1942;
                                                                                                                                                                                                                                            break;
                                                                                                                                                                                                                                    };
                                                                                                                                                                                                                                    var $1937 = $1939;
                                                                                                                                                                                                                                    break;
                                                                                                                                                                                                                                case 'Parser.Reply.value':
                                                                                                                                                                                                                                    var $1943 = self.pst;
                                                                                                                                                                                                                                    var $1944 = self.val;
                                                                                                                                                                                                                                    var self = $1943;
                                                                                                                                                                                                                                    switch (self._) {
                                                                                                                                                                                                                                        case 'Parser.State.new':
                                                                                                                                                                                                                                            var $1946 = self.err;
                                                                                                                                                                                                                                            var $1947 = self.nam;
                                                                                                                                                                                                                                            var $1948 = self.ini;
                                                                                                                                                                                                                                            var $1949 = self.idx;
                                                                                                                                                                                                                                            var $1950 = self.str;
                                                                                                                                                                                                                                            var _reply$pst$136 = Parser$State$new$(Parser$Error$maybe_combine$($1936, $1946), $1947, $1948, $1949, $1950);
                                                                                                                                                                                                                                            var $1951 = Parser$Reply$value$(_reply$pst$136, $1944);
                                                                                                                                                                                                                                            var $1945 = $1951;
                                                                                                                                                                                                                                            break;
                                                                                                                                                                                                                                    };
                                                                                                                                                                                                                                    var $1937 = $1945;
                                                                                                                                                                                                                                    break;
                                                                                                                                                                                                                            };
                                                                                                                                                                                                                            var $1935 = $1937;
                                                                                                                                                                                                                            break;
                                                                                                                                                                                                                    };
                                                                                                                                                                                                                    var $1929 = $1935;
                                                                                                                                                                                                                    break;
                                                                                                                                                                                                            };
                                                                                                                                                                                                            var $1922 = $1929;
                                                                                                                                                                                                            break;
                                                                                                                                                                                                    };
                                                                                                                                                                                                    var $1920 = $1922;
                                                                                                                                                                                                    break;
                                                                                                                                                                                            };
                                                                                                                                                                                            return $1920;
                                                                                                                                                                                        }))(_reply$pst$102);
                                                                                                                                                                                        var self = _reply$108;
                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                                                                var $1952 = self.err;
                                                                                                                                                                                                var self = $1918;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                                                                        var $1954 = self.value;
                                                                                                                                                                                                        var $1955 = Parser$Reply$error$(Parser$Error$combine$($1954, $1952));
                                                                                                                                                                                                        var $1953 = $1955;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                                                                        var $1956 = Parser$Reply$error$($1952);
                                                                                                                                                                                                        var $1953 = $1956;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $1919 = $1953;
                                                                                                                                                                                                break;
                                                                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                                                                var $1957 = self.pst;
                                                                                                                                                                                                var $1958 = self.val;
                                                                                                                                                                                                var self = $1957;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                        var $1960 = self.err;
                                                                                                                                                                                                        var $1961 = self.nam;
                                                                                                                                                                                                        var $1962 = self.ini;
                                                                                                                                                                                                        var $1963 = self.idx;
                                                                                                                                                                                                        var $1964 = self.str;
                                                                                                                                                                                                        var _reply$pst$116 = Parser$State$new$(Parser$Error$maybe_combine$($1918, $1960), $1961, $1962, $1963, $1964);
                                                                                                                                                                                                        var $1965 = Parser$Reply$value$(_reply$pst$116, Litereum$Bond$new$($1811, _iarg$31, _ityp$32, $1864, $1895, $1958));
                                                                                                                                                                                                        var $1959 = $1965;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $1919 = $1959;
                                                                                                                                                                                                break;
                                                                                                                                                                                        };
                                                                                                                                                                                        var $1917 = $1919;
                                                                                                                                                                                        break;
                                                                                                                                                                                };
                                                                                                                                                                                var $1911 = $1917;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $1904 = $1911;
                                                                                                                                                                        break;
                                                                                                                                                                };
                                                                                                                                                                var $1902 = $1904;
                                                                                                                                                                break;
                                                                                                                                                        };
                                                                                                                                                        var $1896 = $1902;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1888 = $1896;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $1886 = $1888;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $1880 = $1886;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1873 = $1880;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $1871 = $1873;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1865 = $1871;
                                                                                                        break;
                                                                                                };
                                                                                                var $1857 = $1865;
                                                                                                break;
                                                                                        };
                                                                                        var $1855 = $1857;
                                                                                        break;
                                                                                };
                                                                                var $1849 = $1855;
                                                                                break;
                                                                        };
                                                                        var $1842 = $1849;
                                                                        break;
                                                                };
                                                                var $1834 = $1842;
                                                                break;
                                                        };
                                                        var $1828 = $1834;
                                                        break;
                                                };
                                                var $1820 = $1828;
                                                break;
                                        };
                                        var $1818 = $1820;
                                        break;
                                };
                                var $1812 = $1818;
                                break;
                        };
                        var $1804 = $1812;
                        break;
                };
                var $1802 = $1804;
                break;
        };
        return $1802;
    };
    const Litereum$parse$bond = x0 => x1 => Litereum$parse$bond$(x0, x1);

    function Litereum$Transaction$new_bond$(_bond$1) {
        var $1966 = ({
            _: 'Litereum.Transaction.new_bond',
            'bond': _bond$1
        });
        return $1966;
    };
    const Litereum$Transaction$new_bond = x0 => Litereum$Transaction$new_bond$(x0);

    function Litereum$Eval$new$(_term$1, _type$2) {
        var $1967 = ({
            _: 'Litereum.Eval.new',
            'term': _term$1,
            'type': _type$2
        });
        return $1967;
    };
    const Litereum$Eval$new = x0 => x1 => Litereum$Eval$new$(x0, x1);

    function Litereum$parse$eval$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1969 = self.err;
                var _reply$8 = Litereum$parse$text$("{", _pst$2);
                var self = _reply$8;
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
                        var self = $1976;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1978 = self.err;
                                var $1979 = self.nam;
                                var $1980 = self.ini;
                                var $1981 = self.idx;
                                var $1982 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1969, $1978), $1979, $1980, $1981, $1982);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1984 = self.err;
                                        var _reply$22 = Litereum$parse$term$(_world$1)(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1986 = self.err;
                                                var self = $1984;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1988 = self.value;
                                                        var $1989 = Parser$Reply$error$(Parser$Error$combine$($1988, $1986));
                                                        var $1987 = $1989;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1990 = Parser$Reply$error$($1986);
                                                        var $1987 = $1990;
                                                        break;
                                                };
                                                var $1985 = $1987;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1991 = self.pst;
                                                var $1992 = self.val;
                                                var self = $1991;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1994 = self.err;
                                                        var $1995 = self.nam;
                                                        var $1996 = self.ini;
                                                        var $1997 = self.idx;
                                                        var $1998 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1984, $1994), $1995, $1996, $1997, $1998);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $2000 = self.err;
                                                                var _reply$36 = Litereum$parse$text$("}", _reply$pst$30);
                                                                var self = _reply$36;
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
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($2000, $2009), $2010, $2011, $2012, $2013);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $2015 = self.err;
                                                                                        var _reply$50 = Litereum$parse$text$(":", _reply$pst$44);
                                                                                        var self = _reply$50;
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
                                                                                                var self = $2022;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $2024 = self.err;
                                                                                                        var $2025 = self.nam;
                                                                                                        var $2026 = self.ini;
                                                                                                        var $2027 = self.idx;
                                                                                                        var $2028 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($2015, $2024), $2025, $2026, $2027, $2028);
                                                                                                        var self = _reply$pst$58;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $2030 = self.err;
                                                                                                                var _reply$64 = Litereum$parse$type$(_world$1)(_reply$pst$58);
                                                                                                                var self = _reply$64;
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $2032 = self.err;
                                                                                                                        var self = $2030;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Maybe.some':
                                                                                                                                var $2034 = self.value;
                                                                                                                                var $2035 = Parser$Reply$error$(Parser$Error$combine$($2034, $2032));
                                                                                                                                var $2033 = $2035;
                                                                                                                                break;
                                                                                                                            case 'Maybe.none':
                                                                                                                                var $2036 = Parser$Reply$error$($2032);
                                                                                                                                var $2033 = $2036;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $2031 = $2033;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $2037 = self.pst;
                                                                                                                        var $2038 = self.val;
                                                                                                                        var self = $2037;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $2040 = self.err;
                                                                                                                                var $2041 = self.nam;
                                                                                                                                var $2042 = self.ini;
                                                                                                                                var $2043 = self.idx;
                                                                                                                                var $2044 = self.str;
                                                                                                                                var _reply$pst$72 = Parser$State$new$(Parser$Error$maybe_combine$($2030, $2040), $2041, $2042, $2043, $2044);
                                                                                                                                var $2045 = Parser$Reply$value$(_reply$pst$72, Litereum$Eval$new$($1992, $2038));
                                                                                                                                var $2039 = $2045;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $2031 = $2039;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $2029 = $2031;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $2023 = $2029;
                                                                                                        break;
                                                                                                };
                                                                                                var $2016 = $2023;
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
                                                var $1985 = $1993;
                                                break;
                                        };
                                        var $1983 = $1985;
                                        break;
                                };
                                var $1977 = $1983;
                                break;
                        };
                        var $1970 = $1977;
                        break;
                };
                var $1968 = $1970;
                break;
        };
        return $1968;
    };
    const Litereum$parse$eval = x0 => x1 => Litereum$parse$eval$(x0, x1);

    function Litereum$Transaction$new_eval$(_eval$1) {
        var $2046 = ({
            _: 'Litereum.Transaction.new_eval',
            'eval': _eval$1
        });
        return $2046;
    };
    const Litereum$Transaction$new_eval = x0 => Litereum$Transaction$new_eval$(x0);

    function Litereum$parse$transaction$(_world$1) {
        var $2047 = Parser$choice(List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2049 = self.err;
                    var _reply$8 = Litereum$parse$text$("name", _pst$2);
                    var self = _reply$8;
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
                            var self = $2056;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2058 = self.err;
                                    var $2059 = self.nam;
                                    var $2060 = self.ini;
                                    var $2061 = self.idx;
                                    var $2062 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2049, $2058), $2059, $2060, $2061, $2062);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $2064 = self.err;
                                            var _reply$22 = Litereum$parse$name$(_reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2066 = self.err;
                                                    var self = $2064;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $2068 = self.value;
                                                            var $2069 = Parser$Reply$error$(Parser$Error$combine$($2068, $2066));
                                                            var $2067 = $2069;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $2070 = Parser$Reply$error$($2066);
                                                            var $2067 = $2070;
                                                            break;
                                                    };
                                                    var $2065 = $2067;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2071 = self.pst;
                                                    var $2072 = self.val;
                                                    var self = $2071;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $2074 = self.err;
                                                            var $2075 = self.nam;
                                                            var $2076 = self.ini;
                                                            var $2077 = self.idx;
                                                            var $2078 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2064, $2074), $2075, $2076, $2077, $2078);
                                                            var $2079 = Parser$Reply$value$(_reply$pst$30, Litereum$Transaction$new_name$($2072));
                                                            var $2073 = $2079;
                                                            break;
                                                    };
                                                    var $2065 = $2073;
                                                    break;
                                            };
                                            var $2063 = $2065;
                                            break;
                                    };
                                    var $2057 = $2063;
                                    break;
                            };
                            var $2050 = $2057;
                            break;
                    };
                    var $2048 = $2050;
                    break;
            };
            return $2048;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2081 = self.err;
                    var _reply$8 = Litereum$parse$text$("type", _pst$2);
                    var self = _reply$8;
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
                            var self = $2088;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2090 = self.err;
                                    var $2091 = self.nam;
                                    var $2092 = self.ini;
                                    var $2093 = self.idx;
                                    var $2094 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2081, $2090), $2091, $2092, $2093, $2094);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $2096 = self.err;
                                            var _reply$22 = Litereum$parse$data$(_world$1, _reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2098 = self.err;
                                                    var self = $2096;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $2100 = self.value;
                                                            var $2101 = Parser$Reply$error$(Parser$Error$combine$($2100, $2098));
                                                            var $2099 = $2101;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $2102 = Parser$Reply$error$($2098);
                                                            var $2099 = $2102;
                                                            break;
                                                    };
                                                    var $2097 = $2099;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2103 = self.pst;
                                                    var $2104 = self.val;
                                                    var self = $2103;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $2106 = self.err;
                                                            var $2107 = self.nam;
                                                            var $2108 = self.ini;
                                                            var $2109 = self.idx;
                                                            var $2110 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2096, $2106), $2107, $2108, $2109, $2110);
                                                            var $2111 = Parser$Reply$value$(_reply$pst$30, Litereum$Transaction$new_data$($2104));
                                                            var $2105 = $2111;
                                                            break;
                                                    };
                                                    var $2097 = $2105;
                                                    break;
                                            };
                                            var $2095 = $2097;
                                            break;
                                    };
                                    var $2089 = $2095;
                                    break;
                            };
                            var $2082 = $2089;
                            break;
                    };
                    var $2080 = $2082;
                    break;
            };
            return $2080;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2113 = self.err;
                    var _reply$8 = Litereum$parse$text$("bond", _pst$2);
                    var self = _reply$8;
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
                            var self = $2120;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2122 = self.err;
                                    var $2123 = self.nam;
                                    var $2124 = self.ini;
                                    var $2125 = self.idx;
                                    var $2126 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2113, $2122), $2123, $2124, $2125, $2126);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $2128 = self.err;
                                            var _reply$22 = Litereum$parse$bond$(_world$1, _reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2130 = self.err;
                                                    var self = $2128;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $2132 = self.value;
                                                            var $2133 = Parser$Reply$error$(Parser$Error$combine$($2132, $2130));
                                                            var $2131 = $2133;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $2134 = Parser$Reply$error$($2130);
                                                            var $2131 = $2134;
                                                            break;
                                                    };
                                                    var $2129 = $2131;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2135 = self.pst;
                                                    var $2136 = self.val;
                                                    var self = $2135;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $2138 = self.err;
                                                            var $2139 = self.nam;
                                                            var $2140 = self.ini;
                                                            var $2141 = self.idx;
                                                            var $2142 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2128, $2138), $2139, $2140, $2141, $2142);
                                                            var $2143 = Parser$Reply$value$(_reply$pst$30, Litereum$Transaction$new_bond$($2136));
                                                            var $2137 = $2143;
                                                            break;
                                                    };
                                                    var $2129 = $2137;
                                                    break;
                                            };
                                            var $2127 = $2129;
                                            break;
                                    };
                                    var $2121 = $2127;
                                    break;
                            };
                            var $2114 = $2121;
                            break;
                    };
                    var $2112 = $2114;
                    break;
            };
            return $2112;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2145 = self.err;
                    var _reply$8 = Litereum$parse$text$("eval", _pst$2);
                    var self = _reply$8;
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
                            var self = $2152;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2154 = self.err;
                                    var $2155 = self.nam;
                                    var $2156 = self.ini;
                                    var $2157 = self.idx;
                                    var $2158 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2145, $2154), $2155, $2156, $2157, $2158);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $2160 = self.err;
                                            var _reply$22 = Litereum$parse$eval$(_world$1, _reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2162 = self.err;
                                                    var self = $2160;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $2164 = self.value;
                                                            var $2165 = Parser$Reply$error$(Parser$Error$combine$($2164, $2162));
                                                            var $2163 = $2165;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $2166 = Parser$Reply$error$($2162);
                                                            var $2163 = $2166;
                                                            break;
                                                    };
                                                    var $2161 = $2163;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2167 = self.pst;
                                                    var $2168 = self.val;
                                                    var self = $2167;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $2170 = self.err;
                                                            var $2171 = self.nam;
                                                            var $2172 = self.ini;
                                                            var $2173 = self.idx;
                                                            var $2174 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2160, $2170), $2171, $2172, $2173, $2174);
                                                            var $2175 = Parser$Reply$value$(_reply$pst$30, Litereum$Transaction$new_eval$($2168));
                                                            var $2169 = $2175;
                                                            break;
                                                    };
                                                    var $2161 = $2169;
                                                    break;
                                            };
                                            var $2159 = $2161;
                                            break;
                                    };
                                    var $2153 = $2159;
                                    break;
                            };
                            var $2146 = $2153;
                            break;
                    };
                    var $2144 = $2146;
                    break;
            };
            return $2144;
        }), List$nil)))));
        return $2047;
    };
    const Litereum$parse$transaction = x0 => Litereum$parse$transaction$(x0);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $2177 = self.value;
                var $2178 = $2177;
                var $2176 = $2178;
                break;
            case 'Maybe.none':
                var $2179 = _a$3;
                var $2176 = $2179;
                break;
        };
        return $2176;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Map$(_V$1) {
        var $2180 = null;
        return $2180;
    };
    const Map = x0 => Map$(x0);

    function Map$set$(_key$2, _val$3, _map$4) {
        var $2181 = BBT$insert$(String$cmp, _key$2, _val$3, _map$4);
        return $2181;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $2182 = null;
        return $2182;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $2183 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $2183;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $2184 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $2184;
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
                    var $2185 = Either$left$(_n$1);
                    return $2185;
                } else {
                    var $2186 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $2188 = Either$right$(Nat$succ$($2186));
                        var $2187 = $2188;
                    } else {
                        var $2189 = (self - 1n);
                        var $2190 = Nat$sub_rem$($2189, $2186);
                        var $2187 = $2190;
                    };
                    return $2187;
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
                        var $2191 = self.value;
                        var $2192 = Nat$div_mod$go$($2191, _m$2, Nat$succ$(_d$3));
                        return $2192;
                    case 'Either.right':
                        var $2193 = Pair$new$(_d$3, _n$1);
                        return $2193;
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
                        var $2194 = self.fst;
                        var $2195 = self.snd;
                        var self = $2194;
                        if (self === 0n) {
                            var $2197 = List$cons$($2195, _res$3);
                            var $2196 = $2197;
                        } else {
                            var $2198 = (self - 1n);
                            var $2199 = Nat$to_base$go$(_base$1, $2194, List$cons$($2195, _res$3));
                            var $2196 = $2199;
                        };
                        return $2196;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $2200 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $2200;
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
                    var $2201 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $2201;
                } else {
                    var $2202 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $2204 = _r$3;
                        var $2203 = $2204;
                    } else {
                        var $2205 = (self - 1n);
                        var $2206 = Nat$mod$go$($2205, $2202, Nat$succ$(_r$3));
                        var $2203 = $2206;
                    };
                    return $2203;
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
                        var $2207 = self.head;
                        var $2208 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $2210 = Maybe$some$($2207);
                            var $2209 = $2210;
                        } else {
                            var $2211 = (self - 1n);
                            var $2212 = List$at$($2211, $2208);
                            var $2209 = $2212;
                        };
                        return $2209;
                    case 'List.nil':
                        var $2213 = Maybe$none;
                        return $2213;
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
                    var $2216 = self.value;
                    var $2217 = $2216;
                    var $2215 = $2217;
                    break;
                case 'Maybe.none':
                    var $2218 = 35;
                    var $2215 = $2218;
                    break;
            };
            var $2214 = $2215;
        } else {
            var $2219 = 35;
            var $2214 = $2219;
        };
        return $2214;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $2220 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $2221 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $2221;
        }));
        return $2220;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $2222 = Nat$to_string_base$(10n, _n$1);
        return $2222;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const Debug$log = a0 => a1 => ((console.log(a0), a1()));

    function Litereum$Entry$data$(_value$1) {
        var $2223 = ({
            _: 'Litereum.Entry.data',
            'value': _value$1
        });
        return $2223;
    };
    const Litereum$Entry$data = x0 => Litereum$Entry$data$(x0);

    function Litereum$Entry$bond$(_value$1) {
        var $2224 = ({
            _: 'Litereum.Entry.bond',
            'value': _value$1
        });
        return $2224;
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
                        var $2225 = self.head;
                        var $2226 = self.tail;
                        var self = _vals$4;
                        switch (self._) {
                            case 'List.cons':
                                var $2228 = self.head;
                                var $2229 = self.tail;
                                var $2230 = Litereum$extend$(Map$set$($2225, $2228, _map$2), $2226, $2229);
                                var $2227 = $2230;
                                break;
                            case 'List.nil':
                                var $2231 = _map$2;
                                var $2227 = $2231;
                                break;
                        };
                        return $2227;
                    case 'List.nil':
                        var self = _vals$4;
                        switch (self._) {
                            case 'List.nil':
                            case 'List.cons':
                                var $2233 = _map$2;
                                var $2232 = $2233;
                                break;
                        };
                        return $2232;
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
                var $2235 = self.name;
                var self = _b$2;
                switch (self._) {
                    case 'Litereum.Type.data':
                        var $2237 = self.name;
                        var $2238 = ($2235 === $2237);
                        var $2236 = $2238;
                        break;
                    case 'Litereum.Type.word':
                        var $2239 = Bool$false;
                        var $2236 = $2239;
                        break;
                };
                var $2234 = $2236;
                break;
            case 'Litereum.Type.word':
                var self = _b$2;
                switch (self._) {
                    case 'Litereum.Type.word':
                        var $2241 = Bool$true;
                        var $2240 = $2241;
                        break;
                    case 'Litereum.Type.data':
                        var $2242 = Bool$false;
                        var $2240 = $2242;
                        break;
                };
                var $2234 = $2240;
                break;
        };
        return $2234;
    };
    const Litereum$equal = x0 => x1 => Litereum$equal$(x0, x1);

    function Maybe$is_some$(_m$2) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $2244 = Bool$false;
                var $2243 = $2244;
                break;
            case 'Maybe.some':
                var $2245 = Bool$true;
                var $2243 = $2245;
                break;
        };
        return $2243;
    };
    const Maybe$is_some = x0 => Maybe$is_some$(x0);

    function Litereum$get_bond$(_world$1, _name$2) {
        var self = _world$1;
        switch (self._) {
            case 'Litereum.World.new':
                var $2247 = self.entry;
                var $2248 = Maybe$monad$((_m$bind$7 => _m$pure$8 => {
                    var $2249 = _m$bind$7;
                    return $2249;
                }))(Map$get$(_name$2, $2247))((_entry$7 => {
                    var self = _entry$7;
                    switch (self._) {
                        case 'Litereum.Entry.bond':
                            var $2251 = self.value;
                            var $2252 = Maybe$some$($2251);
                            var $2250 = $2252;
                            break;
                        case 'Litereum.Entry.data':
                            var $2253 = Maybe$none;
                            var $2250 = $2253;
                            break;
                    };
                    return $2250;
                }));
                var $2246 = $2248;
                break;
        };
        return $2246;
    };
    const Litereum$get_bond = x0 => x1 => Litereum$get_bond$(x0, x1);

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.cons':
                var $2255 = self.head;
                var $2256 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.cons':
                        var $2258 = self.head;
                        var $2259 = self.tail;
                        var $2260 = List$cons$(Pair$new$($2255, $2258), List$zip$($2256, $2259));
                        var $2257 = $2260;
                        break;
                    case 'List.nil':
                        var $2261 = List$nil;
                        var $2257 = $2261;
                        break;
                };
                var $2254 = $2257;
                break;
            case 'List.nil':
                var $2262 = List$nil;
                var $2254 = $2262;
                break;
        };
        return $2254;
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
                        var $2263 = self.head;
                        var $2264 = self.tail;
                        var self = _cond$2($2263);
                        if (self) {
                            var $2266 = List$all$(_cond$2, $2264);
                            var $2265 = $2266;
                        } else {
                            var $2267 = Bool$false;
                            var $2265 = $2267;
                        };
                        return $2265;
                    case 'List.nil':
                        var $2268 = Bool$true;
                        return $2268;
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
                var $2270 = self.value;
                var $2271 = Maybe$some$(_f$4($2270));
                var $2269 = $2271;
                break;
            case 'Maybe.none':
                var $2272 = Maybe$none;
                var $2269 = $2272;
                break;
        };
        return $2269;
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
                        var $2273 = self.head;
                        var $2274 = self.tail;
                        var self = _f$3(_i$4)($2273);
                        if (self) {
                            var $2276 = Maybe$some$(Pair$new$(_i$4, $2273));
                            var $2275 = $2276;
                        } else {
                            var $2277 = List$ifind$go$($2274, _f$3, Nat$succ$(_i$4));
                            var $2275 = $2277;
                        };
                        return $2275;
                    case 'List.nil':
                        var $2278 = Maybe$none;
                        return $2278;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$ifind$go = x0 => x1 => x2 => List$ifind$go$(x0, x1, x2);

    function List$ifind$(_f$2, _xs$3) {
        var $2279 = List$ifind$go$(_xs$3, _f$2, Nat$zero);
        return $2279;
    };
    const List$ifind = x0 => x1 => List$ifind$(x0, x1);

    function Litereum$get_constructor_value$(_data$1, _name$2) {
        var $2280 = Maybe$mapped$(List$ifind$((_i$3 => _ctr$4 => {
            var $2281 = ((() => {
                var self = _ctr$4;
                switch (self._) {
                    case 'Litereum.Constructor.new':
                        var $2282 = self.name;
                        var $2283 = $2282;
                        return $2283;
                };
            })() === _name$2);
            return $2281;
        }), (() => {
            var self = _data$1;
            switch (self._) {
                case 'Litereum.Data.new':
                    var $2284 = self.constructors;
                    var $2285 = $2284;
                    return $2285;
            };
        })()), (_x$3 => {
            var self = _x$3;
            switch (self._) {
                case 'Pair.new':
                    var $2287 = self.snd;
                    var $2288 = $2287;
                    var $2286 = $2288;
                    break;
            };
            return $2286;
        }));
        return $2280;
    };
    const Litereum$get_constructor_value = x0 => x1 => Litereum$get_constructor_value$(x0, x1);
    const Nat$eql = a0 => a1 => (a0 === a1);
    const List$length = a0 => (list_length(a0));

    function List$zip_with$(_f$4, _as$5, _bs$6) {
        var self = _as$5;
        switch (self._) {
            case 'List.cons':
                var $2290 = self.head;
                var $2291 = self.tail;
                var self = _bs$6;
                switch (self._) {
                    case 'List.cons':
                        var $2293 = self.head;
                        var $2294 = self.tail;
                        var $2295 = List$cons$(_f$4($2290)($2293), List$zip_with$(_f$4, $2291, $2294));
                        var $2292 = $2295;
                        break;
                    case 'List.nil':
                        var $2296 = List$nil;
                        var $2292 = $2296;
                        break;
                };
                var $2289 = $2292;
                break;
            case 'List.nil':
                var $2297 = List$nil;
                var $2289 = $2297;
                break;
        };
        return $2289;
    };
    const List$zip_with = x0 => x1 => x2 => List$zip_with$(x0, x1, x2);

    function List$zipped_with$(_as$3, _bs$4, _f$6) {
        var $2298 = List$zip_with$(_f$6, _as$3, _bs$4);
        return $2298;
    };
    const List$zipped_with = x0 => x1 => x2 => List$zipped_with$(x0, x1, x2);

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $2300 = self.head;
                var $2301 = self.tail;
                var $2302 = List$cons$(_f$3($2300), List$map$(_f$3, $2301));
                var $2299 = $2302;
                break;
            case 'List.nil':
                var $2303 = List$nil;
                var $2299 = $2303;
                break;
        };
        return $2299;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function List$and$(_list$1) {
        var $2304 = List$all$((_x$2 => {
            var $2305 = _x$2;
            return $2305;
        }), _list$1);
        return $2304;
    };
    const List$and = x0 => List$and$(x0);

    function Litereum$check$(_context$1, _world$2, _term$3, _type$4) {
        var self = _context$1;
        switch (self._) {
            case 'BBT.tip':
                var self = _world$2;
                switch (self._) {
                    case 'Litereum.World.new':
                        var $2308 = self.name_to_index;
                        var self = _term$3;
                        switch (self._) {
                            case 'Litereum.Term.var':
                                var $2310 = self.name;
                                var self = Map$get$($2310, _context$1);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2312 = self.value;
                                        var $2313 = Litereum$equal$($2312, _type$4);
                                        var $2311 = $2313;
                                        break;
                                    case 'Maybe.none':
                                        var $2314 = Bool$false;
                                        var $2311 = $2314;
                                        break;
                                };
                                var $2309 = $2311;
                                break;
                            case 'Litereum.Term.call':
                                var $2315 = self.bond;
                                var $2316 = self.args;
                                var _def0$11 = Maybe$is_some$(Map$get$($2315, $2308));
                                var self = Litereum$get_bond$(_world$2, $2315);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2318 = self.value;
                                        var _bond$13 = $2318;
                                        var self = _bond$13;
                                        switch (self._) {
                                            case 'Litereum.Bond.new':
                                                var $2320 = self.input_types;
                                                var $2321 = self.output_type;
                                                var _otyp$20 = Litereum$equal$($2321, _type$4);
                                                var _args$21 = List$zip$($2316, $2320);
                                                var _args$22 = List$all$((_x$22 => {
                                                    var $2323 = Litereum$check$(_context$1, _world$2, (() => {
                                                        var self = _x$22;
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $2324 = self.fst;
                                                                var $2325 = $2324;
                                                                return $2325;
                                                        };
                                                    })(), (() => {
                                                        var self = _x$22;
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $2326 = self.snd;
                                                                var $2327 = $2326;
                                                                return $2327;
                                                        };
                                                    })());
                                                    return $2323;
                                                }), _args$21);
                                                var $2322 = (_def0$11 && (_otyp$20 && _args$22));
                                                var $2319 = $2322;
                                                break;
                                        };
                                        var $2317 = $2319;
                                        break;
                                    case 'Maybe.none':
                                        var $2328 = Bool$false;
                                        var $2317 = $2328;
                                        break;
                                };
                                var $2309 = $2317;
                                break;
                            case 'Litereum.Term.let':
                                var $2329 = self.name;
                                var $2330 = self.type;
                                var $2331 = self.expr;
                                var $2332 = self.body;
                                var _def0$13 = Maybe$is_some$(Map$get$($2329, $2308));
                                var _expr$14 = Litereum$check$(_context$1, _world$2, $2331, $2330);
                                var _ctx2$15 = Map$set$($2329, $2330, _context$1);
                                var _cont$16 = Litereum$check$(_ctx2$15, _world$2, $2332, _type$4);
                                var $2333 = (_def0$13 && (_expr$14 && _cont$16));
                                var $2309 = $2333;
                                break;
                            case 'Litereum.Term.create':
                                var $2334 = self.ctor;
                                var $2335 = self.vals;
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.data':
                                        var $2337 = self.name;
                                        var self = Litereum$get_data$(_world$2, $2337);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $2339 = self.value;
                                                var _data$13 = $2339;
                                                var self = _data$13;
                                                switch (self._) {
                                                    case 'Litereum.Data.new':
                                                        var self = Litereum$get_constructor_value$(_data$13, $2334);
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $2342 = self.value;
                                                                var _ctor$17 = $2342;
                                                                var self = _ctor$17;
                                                                switch (self._) {
                                                                    case 'Litereum.Constructor.new':
                                                                        var $2344 = self.field_types;
                                                                        var _size$21 = ((list_length($2335)) === (list_length($2344)));
                                                                        var _vals$22 = List$zip$($2335, $2344);
                                                                        var _vals$23 = List$all$((_x$23 => {
                                                                            var $2346 = Litereum$check$(_context$1, _world$2, (() => {
                                                                                var self = _x$23;
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $2347 = self.fst;
                                                                                        var $2348 = $2347;
                                                                                        return $2348;
                                                                                };
                                                                            })(), (() => {
                                                                                var self = _x$23;
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $2349 = self.snd;
                                                                                        var $2350 = $2349;
                                                                                        return $2350;
                                                                                };
                                                                            })());
                                                                            return $2346;
                                                                        }), _vals$22);
                                                                        var $2345 = (_size$21 && _vals$23);
                                                                        var $2343 = $2345;
                                                                        break;
                                                                };
                                                                var $2341 = $2343;
                                                                break;
                                                            case 'Maybe.none':
                                                                var $2351 = Bool$false;
                                                                var $2341 = $2351;
                                                                break;
                                                        };
                                                        var $2340 = $2341;
                                                        break;
                                                };
                                                var $2338 = $2340;
                                                break;
                                            case 'Maybe.none':
                                                var $2352 = Bool$false;
                                                var $2338 = $2352;
                                                break;
                                        };
                                        var $2336 = $2338;
                                        break;
                                    case 'Litereum.Type.word':
                                        var $2353 = Bool$false;
                                        var $2336 = $2353;
                                        break;
                                };
                                var $2309 = $2336;
                                break;
                            case 'Litereum.Term.match':
                                var $2354 = self.name;
                                var $2355 = self.data;
                                var $2356 = self.cses;
                                var self = Litereum$get_data$(_world$2, $2355);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2358 = self.value;
                                        var _data$13 = $2358;
                                        var self = _data$13;
                                        switch (self._) {
                                            case 'Litereum.Data.new':
                                                var $2360 = self.constructors;
                                                var _def0$16 = Maybe$is_some$(Map$get$($2355, $2308));
                                                var self = Map$get$($2354, _context$1);
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $2362 = self.value;
                                                        var _size$18 = ((list_length($2356)) === (list_length($2360)));
                                                        var _expr$19 = Litereum$check$(_context$1, _world$2, Litereum$Term$var$($2354), Litereum$Type$data$($2355));
                                                        var _cses$20 = List$zipped_with$($2356, $2360, (_case_body$20 => _case_ctor$21 => {
                                                            var _nams$22 = List$map$(a1 => (($2354 + ".") + a1), (() => {
                                                                var self = _case_ctor$21;
                                                                switch (self._) {
                                                                    case 'Litereum.Constructor.new':
                                                                        var $2365 = self.field_names;
                                                                        var $2366 = $2365;
                                                                        return $2366;
                                                                };
                                                            })());
                                                            var self = _case_ctor$21;
                                                            switch (self._) {
                                                                case 'Litereum.Constructor.new':
                                                                    var $2367 = self.field_types;
                                                                    var $2368 = $2367;
                                                                    var _typs$23 = $2368;
                                                                    break;
                                                            };
                                                            var _ctx2$24 = Litereum$extend$(_context$1, _nams$22, _typs$23);
                                                            var $2364 = Litereum$check$(_ctx2$24, _world$2, _case_body$20, $2362);
                                                            return $2364;
                                                        }));
                                                        var $2363 = (_def0$16 && (_size$18 && List$and$(_cses$20)));
                                                        var $2361 = $2363;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $2369 = Bool$false;
                                                        var $2361 = $2369;
                                                        break;
                                                };
                                                var $2359 = $2361;
                                                break;
                                        };
                                        var $2357 = $2359;
                                        break;
                                    case 'Maybe.none':
                                        var $2370 = Bool$false;
                                        var $2357 = $2370;
                                        break;
                                };
                                var $2309 = $2357;
                                break;
                            case 'Litereum.Term.compare':
                                var $2371 = self.val0;
                                var $2372 = self.iflt;
                                var $2373 = self.ifeq;
                                var $2374 = self.ifgt;
                                var _val0$14 = Litereum$check$(_context$1, _world$2, $2371, Litereum$Type$word);
                                var _val1$15 = Litereum$check$(_context$1, _world$2, $2371, Litereum$Type$word);
                                var _iflt$16 = Litereum$check$(_context$1, _world$2, $2372, _type$4);
                                var _ifeq$17 = Litereum$check$(_context$1, _world$2, $2373, _type$4);
                                var _ifgt$18 = Litereum$check$(_context$1, _world$2, $2374, _type$4);
                                var $2375 = (_val0$14 && (_val1$15 && (_iflt$16 && (_ifeq$17 && _ifgt$18))));
                                var $2309 = $2375;
                                break;
                            case 'Litereum.Term.operate':
                                var $2376 = self.val0;
                                var $2377 = self.val1;
                                var _val0$12 = Litereum$check$(_context$1, _world$2, $2376, Litereum$Type$word);
                                var _val1$13 = Litereum$check$(_context$1, _world$2, $2377, Litereum$Type$word);
                                var $2378 = (_val0$12 && _val1$13);
                                var $2309 = $2378;
                                break;
                            case 'Litereum.Term.bind':
                                var $2379 = self.name;
                                var $2380 = self.main;
                                var $2381 = self.body;
                                var self = Litereum$get_bond$(_world$2, $2379);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2383 = self.value;
                                        var _bond$13 = $2383;
                                        var self = _bond$13;
                                        switch (self._) {
                                            case 'Litereum.Bond.new':
                                                var $2385 = self.input_names;
                                                var $2386 = self.input_types;
                                                var $2387 = self.output_type;
                                                var _ctx2$20 = Litereum$extend$(_context$1, $2385, $2386);
                                                var _main$21 = Litereum$check$(_ctx2$20, _world$2, $2380, $2387);
                                                var _body$22 = Litereum$check$(_context$1, _world$2, $2381, _type$4);
                                                var $2388 = (_main$21 && _body$22);
                                                var $2384 = $2388;
                                                break;
                                        };
                                        var $2382 = $2384;
                                        break;
                                    case 'Maybe.none':
                                        var $2389 = Bool$false;
                                        var $2382 = $2389;
                                        break;
                                };
                                var $2309 = $2382;
                                break;
                            case 'Litereum.Term.word':
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.word':
                                        var $2391 = Bool$true;
                                        var $2390 = $2391;
                                        break;
                                    case 'Litereum.Type.data':
                                        var $2392 = Bool$false;
                                        var $2390 = $2392;
                                        break;
                                };
                                var $2309 = $2390;
                                break;
                        };
                        var $2307 = $2309;
                        break;
                };
                var $2306 = $2307;
                break;
            case 'BBT.bin':
                var self = _world$2;
                switch (self._) {
                    case 'Litereum.World.new':
                        var $2394 = self.name_to_index;
                        var self = _term$3;
                        switch (self._) {
                            case 'Litereum.Term.var':
                                var $2396 = self.name;
                                var self = Map$get$($2396, _context$1);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2398 = self.value;
                                        var $2399 = Litereum$equal$($2398, _type$4);
                                        var $2397 = $2399;
                                        break;
                                    case 'Maybe.none':
                                        var $2400 = Bool$false;
                                        var $2397 = $2400;
                                        break;
                                };
                                var $2395 = $2397;
                                break;
                            case 'Litereum.Term.call':
                                var $2401 = self.bond;
                                var $2402 = self.args;
                                var _def0$16 = Maybe$is_some$(Map$get$($2401, $2394));
                                var self = Litereum$get_bond$(_world$2, $2401);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2404 = self.value;
                                        var _bond$18 = $2404;
                                        var self = _bond$18;
                                        switch (self._) {
                                            case 'Litereum.Bond.new':
                                                var $2406 = self.input_types;
                                                var $2407 = self.output_type;
                                                var _otyp$25 = Litereum$equal$($2407, _type$4);
                                                var _args$26 = List$zip$($2402, $2406);
                                                var _args$27 = List$all$((_x$27 => {
                                                    var $2409 = Litereum$check$(_context$1, _world$2, (() => {
                                                        var self = _x$27;
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $2410 = self.fst;
                                                                var $2411 = $2410;
                                                                return $2411;
                                                        };
                                                    })(), (() => {
                                                        var self = _x$27;
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $2412 = self.snd;
                                                                var $2413 = $2412;
                                                                return $2413;
                                                        };
                                                    })());
                                                    return $2409;
                                                }), _args$26);
                                                var $2408 = (_def0$16 && (_otyp$25 && _args$27));
                                                var $2405 = $2408;
                                                break;
                                        };
                                        var $2403 = $2405;
                                        break;
                                    case 'Maybe.none':
                                        var $2414 = Bool$false;
                                        var $2403 = $2414;
                                        break;
                                };
                                var $2395 = $2403;
                                break;
                            case 'Litereum.Term.let':
                                var $2415 = self.name;
                                var $2416 = self.type;
                                var $2417 = self.expr;
                                var $2418 = self.body;
                                var _def0$18 = Maybe$is_some$(Map$get$($2415, $2394));
                                var _expr$19 = Litereum$check$(_context$1, _world$2, $2417, $2416);
                                var _ctx2$20 = Map$set$($2415, $2416, _context$1);
                                var _cont$21 = Litereum$check$(_ctx2$20, _world$2, $2418, _type$4);
                                var $2419 = (_def0$18 && (_expr$19 && _cont$21));
                                var $2395 = $2419;
                                break;
                            case 'Litereum.Term.create':
                                var $2420 = self.ctor;
                                var $2421 = self.vals;
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.data':
                                        var $2423 = self.name;
                                        var self = Litereum$get_data$(_world$2, $2423);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $2425 = self.value;
                                                var _data$18 = $2425;
                                                var self = _data$18;
                                                switch (self._) {
                                                    case 'Litereum.Data.new':
                                                        var self = Litereum$get_constructor_value$(_data$18, $2420);
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $2428 = self.value;
                                                                var _ctor$22 = $2428;
                                                                var self = _ctor$22;
                                                                switch (self._) {
                                                                    case 'Litereum.Constructor.new':
                                                                        var $2430 = self.field_types;
                                                                        var _size$26 = ((list_length($2421)) === (list_length($2430)));
                                                                        var _vals$27 = List$zip$($2421, $2430);
                                                                        var _vals$28 = List$all$((_x$28 => {
                                                                            var $2432 = Litereum$check$(_context$1, _world$2, (() => {
                                                                                var self = _x$28;
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $2433 = self.fst;
                                                                                        var $2434 = $2433;
                                                                                        return $2434;
                                                                                };
                                                                            })(), (() => {
                                                                                var self = _x$28;
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $2435 = self.snd;
                                                                                        var $2436 = $2435;
                                                                                        return $2436;
                                                                                };
                                                                            })());
                                                                            return $2432;
                                                                        }), _vals$27);
                                                                        var $2431 = (_size$26 && _vals$28);
                                                                        var $2429 = $2431;
                                                                        break;
                                                                };
                                                                var $2427 = $2429;
                                                                break;
                                                            case 'Maybe.none':
                                                                var $2437 = Bool$false;
                                                                var $2427 = $2437;
                                                                break;
                                                        };
                                                        var $2426 = $2427;
                                                        break;
                                                };
                                                var $2424 = $2426;
                                                break;
                                            case 'Maybe.none':
                                                var $2438 = Bool$false;
                                                var $2424 = $2438;
                                                break;
                                        };
                                        var $2422 = $2424;
                                        break;
                                    case 'Litereum.Type.word':
                                        var $2439 = Bool$false;
                                        var $2422 = $2439;
                                        break;
                                };
                                var $2395 = $2422;
                                break;
                            case 'Litereum.Term.match':
                                var $2440 = self.name;
                                var $2441 = self.data;
                                var $2442 = self.cses;
                                var self = Litereum$get_data$(_world$2, $2441);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2444 = self.value;
                                        var _data$18 = $2444;
                                        var self = _data$18;
                                        switch (self._) {
                                            case 'Litereum.Data.new':
                                                var $2446 = self.constructors;
                                                var _def0$21 = Maybe$is_some$(Map$get$($2441, $2394));
                                                var self = Map$get$($2440, _context$1);
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $2448 = self.value;
                                                        var _size$23 = ((list_length($2442)) === (list_length($2446)));
                                                        var _expr$24 = Litereum$check$(_context$1, _world$2, Litereum$Term$var$($2440), Litereum$Type$data$($2441));
                                                        var _cses$25 = List$zipped_with$($2442, $2446, (_case_body$25 => _case_ctor$26 => {
                                                            var _nams$27 = List$map$(a1 => (($2440 + ".") + a1), (() => {
                                                                var self = _case_ctor$26;
                                                                switch (self._) {
                                                                    case 'Litereum.Constructor.new':
                                                                        var $2451 = self.field_names;
                                                                        var $2452 = $2451;
                                                                        return $2452;
                                                                };
                                                            })());
                                                            var self = _case_ctor$26;
                                                            switch (self._) {
                                                                case 'Litereum.Constructor.new':
                                                                    var $2453 = self.field_types;
                                                                    var $2454 = $2453;
                                                                    var _typs$28 = $2454;
                                                                    break;
                                                            };
                                                            var _ctx2$29 = Litereum$extend$(_context$1, _nams$27, _typs$28);
                                                            var $2450 = Litereum$check$(_ctx2$29, _world$2, _case_body$25, $2448);
                                                            return $2450;
                                                        }));
                                                        var $2449 = (_def0$21 && (_size$23 && List$and$(_cses$25)));
                                                        var $2447 = $2449;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $2455 = Bool$false;
                                                        var $2447 = $2455;
                                                        break;
                                                };
                                                var $2445 = $2447;
                                                break;
                                        };
                                        var $2443 = $2445;
                                        break;
                                    case 'Maybe.none':
                                        var $2456 = Bool$false;
                                        var $2443 = $2456;
                                        break;
                                };
                                var $2395 = $2443;
                                break;
                            case 'Litereum.Term.compare':
                                var $2457 = self.val0;
                                var $2458 = self.iflt;
                                var $2459 = self.ifeq;
                                var $2460 = self.ifgt;
                                var _val0$19 = Litereum$check$(_context$1, _world$2, $2457, Litereum$Type$word);
                                var _val1$20 = Litereum$check$(_context$1, _world$2, $2457, Litereum$Type$word);
                                var _iflt$21 = Litereum$check$(_context$1, _world$2, $2458, _type$4);
                                var _ifeq$22 = Litereum$check$(_context$1, _world$2, $2459, _type$4);
                                var _ifgt$23 = Litereum$check$(_context$1, _world$2, $2460, _type$4);
                                var $2461 = (_val0$19 && (_val1$20 && (_iflt$21 && (_ifeq$22 && _ifgt$23))));
                                var $2395 = $2461;
                                break;
                            case 'Litereum.Term.operate':
                                var $2462 = self.val0;
                                var $2463 = self.val1;
                                var _val0$17 = Litereum$check$(_context$1, _world$2, $2462, Litereum$Type$word);
                                var _val1$18 = Litereum$check$(_context$1, _world$2, $2463, Litereum$Type$word);
                                var $2464 = (_val0$17 && _val1$18);
                                var $2395 = $2464;
                                break;
                            case 'Litereum.Term.bind':
                                var $2465 = self.name;
                                var $2466 = self.main;
                                var $2467 = self.body;
                                var self = Litereum$get_bond$(_world$2, $2465);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2469 = self.value;
                                        var _bond$18 = $2469;
                                        var self = _bond$18;
                                        switch (self._) {
                                            case 'Litereum.Bond.new':
                                                var $2471 = self.input_names;
                                                var $2472 = self.input_types;
                                                var $2473 = self.output_type;
                                                var _ctx2$25 = Litereum$extend$(_context$1, $2471, $2472);
                                                var _main$26 = Litereum$check$(_ctx2$25, _world$2, $2466, $2473);
                                                var _body$27 = Litereum$check$(_context$1, _world$2, $2467, _type$4);
                                                var $2474 = (_main$26 && _body$27);
                                                var $2470 = $2474;
                                                break;
                                        };
                                        var $2468 = $2470;
                                        break;
                                    case 'Maybe.none':
                                        var $2475 = Bool$false;
                                        var $2468 = $2475;
                                        break;
                                };
                                var $2395 = $2468;
                                break;
                            case 'Litereum.Term.word':
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.word':
                                        var $2477 = Bool$true;
                                        var $2476 = $2477;
                                        break;
                                    case 'Litereum.Type.data':
                                        var $2478 = Bool$false;
                                        var $2476 = $2478;
                                        break;
                                };
                                var $2395 = $2476;
                                break;
                        };
                        var $2393 = $2395;
                        break;
                };
                var $2306 = $2393;
                break;
        };
        return $2306;
    };
    const Litereum$check = x0 => x1 => x2 => x3 => Litereum$check$(x0, x1, x2, x3);

    function Litereum$Runtime$(_A$1) {
        var $2479 = null;
        return $2479;
    };
    const Litereum$Runtime = x0 => Litereum$Runtime$(x0);

    function Litereum$Runtime$new$(_world$2, _subst$3, _fresh$4, _gas$5, _term$6) {
        var $2480 = ({
            _: 'Litereum.Runtime.new',
            'world': _world$2,
            'subst': _subst$3,
            'fresh': _fresh$4,
            'gas': _gas$5,
            'term': _term$6
        });
        return $2480;
    };
    const Litereum$Runtime$new = x0 => x1 => x2 => x3 => x4 => Litereum$Runtime$new$(x0, x1, x2, x3, x4);

    function Triple$(_A$1, _B$2, _C$3) {
        var $2481 = null;
        return $2481;
    };
    const Triple = x0 => x1 => x2 => Triple$(x0, x1, x2);

    function Triple$new$(_fst$4, _snd$5, _trd$6) {
        var $2482 = ({
            _: 'Triple.new',
            'fst': _fst$4,
            'snd': _snd$5,
            'trd': _trd$6
        });
        return $2482;
    };
    const Triple$new = x0 => x1 => x2 => Triple$new$(x0, x1, x2);

    function Litereum$rename$(_table$1, _fresh$2, _old_name$3) {
        var _new_name$4 = ("$" + Nat$show$(_fresh$2));
        var _table$5 = Map$set$(_old_name$3, _new_name$4, _table$1);
        var _fresh$6 = Nat$succ$(_fresh$2);
        var $2483 = Triple$new$(_table$5, _fresh$6, _new_name$4);
        return $2483;
    };
    const Litereum$rename = x0 => x1 => x2 => Litereum$rename$(x0, x1, x2);

    function Litereum$rename$many$(_table$1, _fresh$2, _names$3) {
        var self = _names$3;
        switch (self._) {
            case 'List.cons':
                var $2485 = self.head;
                var $2486 = self.tail;
                var self = Litereum$rename$(_table$1, _fresh$2, $2485);
                switch (self._) {
                    case 'Triple.new':
                        var $2488 = self.fst;
                        var $2489 = self.snd;
                        var $2490 = self.trd;
                        var self = Litereum$rename$many$($2488, $2489, $2486);
                        switch (self._) {
                            case 'Triple.new':
                                var $2492 = self.fst;
                                var $2493 = self.snd;
                                var $2494 = self.trd;
                                var $2495 = Triple$new$($2492, $2493, List$cons$($2490, $2494));
                                var $2491 = $2495;
                                break;
                        };
                        var $2487 = $2491;
                        break;
                };
                var $2484 = $2487;
                break;
            case 'List.nil':
                var $2496 = Triple$new$(_table$1, _fresh$2, List$nil);
                var $2484 = $2496;
                break;
        };
        return $2484;
    };
    const Litereum$rename$many = x0 => x1 => x2 => Litereum$rename$many$(x0, x1, x2);

    function Litereum$sanitize$many$(_world$1, _table$2, _fresh$3, _terms$4) {
        var self = _terms$4;
        switch (self._) {
            case 'List.cons':
                var $2498 = self.head;
                var $2499 = self.tail;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $2498);
                switch (self._) {
                    case 'Pair.new':
                        var $2501 = self.fst;
                        var $2502 = self.snd;
                        var self = Litereum$sanitize$many$(_world$1, _table$2, $2501, $2499);
                        switch (self._) {
                            case 'Pair.new':
                                var $2504 = self.fst;
                                var $2505 = self.snd;
                                var $2506 = Pair$new$($2504, List$cons$($2502, $2505));
                                var $2503 = $2506;
                                break;
                        };
                        var $2500 = $2503;
                        break;
                };
                var $2497 = $2500;
                break;
            case 'List.nil':
                var $2507 = Pair$new$(_fresh$3, List$nil);
                var $2497 = $2507;
                break;
        };
        return $2497;
    };
    const Litereum$sanitize$many = x0 => x1 => x2 => x3 => Litereum$sanitize$many$(x0, x1, x2, x3);

    function Litereum$get_constructors$(_world$1, _name$2) {
        var self = Litereum$get_data$(_world$1, _name$2);
        switch (self._) {
            case 'Maybe.some':
                var $2509 = self.value;
                var $2510 = Maybe$some$((() => {
                    var self = $2509;
                    switch (self._) {
                        case 'Litereum.Data.new':
                            var $2511 = self.constructors;
                            var $2512 = $2511;
                            return $2512;
                    };
                })());
                var $2508 = $2510;
                break;
            case 'Maybe.none':
                var $2513 = Maybe$none;
                var $2508 = $2513;
                break;
        };
        return $2508;
    };
    const Litereum$get_constructors = x0 => x1 => Litereum$get_constructors$(x0, x1);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Litereum$sanitize$cases$(_world$1, _table$2, _fresh$3, _old_name$4, _new_name$5, _ctrs$6, _cses$7) {
        var self = _ctrs$6;
        switch (self._) {
            case 'List.cons':
                var $2515 = self.head;
                var $2516 = self.tail;
                var self = _cses$7;
                switch (self._) {
                    case 'List.cons':
                        var $2518 = self.head;
                        var $2519 = self.tail;
                        var _new_table$12 = _table$2;
                        var _new_table$13 = (() => {
                            var $2522 = _new_table$12;
                            var self = $2515;
                            switch (self._) {
                                case 'Litereum.Constructor.new':
                                    var $2524 = self.field_names;
                                    var $2525 = $2524;
                                    var $2523 = $2525;
                                    break;
                            };
                            let _new_table$14 = $2522;
                            let _field$13;
                            while ($2523._ === 'List.cons') {
                                _field$13 = $2523.head;
                                var $2522 = Map$set$((_old_name$4 + ("." + _field$13)), (_new_name$5 + ("." + _field$13)), _new_table$14);
                                _new_table$14 = $2522;
                                $2523 = $2523.tail;
                            }
                            return _new_table$14;
                        })();
                        var self = Litereum$sanitize$(_world$1, _new_table$13, _fresh$3, $2518);
                        switch (self._) {
                            case 'Pair.new':
                                var $2526 = self.fst;
                                var $2527 = self.snd;
                                var self = Litereum$sanitize$cases$(_world$1, _table$2, $2526, _old_name$4, _new_name$5, $2516, $2519);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2529 = self.fst;
                                        var $2530 = self.snd;
                                        var $2531 = Pair$new$($2529, List$cons$($2527, $2530));
                                        var $2528 = $2531;
                                        break;
                                };
                                var $2520 = $2528;
                                break;
                        };
                        var $2517 = $2520;
                        break;
                    case 'List.nil':
                        var $2532 = Pair$new$(_fresh$3, List$nil);
                        var $2517 = $2532;
                        break;
                };
                var $2514 = $2517;
                break;
            case 'List.nil':
                var self = _cses$7;
                switch (self._) {
                    case 'List.nil':
                    case 'List.cons':
                        var $2534 = Pair$new$(_fresh$3, List$nil);
                        var $2533 = $2534;
                        break;
                };
                var $2514 = $2533;
                break;
        };
        return $2514;
    };
    const Litereum$sanitize$cases = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Litereum$sanitize$cases$(x0, x1, x2, x3, x4, x5, x6);

    function Litereum$sanitize$(_world$1, _table$2, _fresh$3, _term$4) {
        var self = _term$4;
        switch (self._) {
            case 'Litereum.Term.var':
                var $2536 = self.name;
                var _term$6 = Litereum$Term$var$(Maybe$default$(Map$get$($2536, _table$2), $2536));
                var $2537 = Pair$new$(_fresh$3, _term$6);
                var $2535 = $2537;
                break;
            case 'Litereum.Term.call':
                var $2538 = self.bond;
                var $2539 = self.args;
                var self = Litereum$sanitize$many$(_world$1, _table$2, _fresh$3, $2539);
                switch (self._) {
                    case 'Pair.new':
                        var $2541 = self.fst;
                        var $2542 = self.snd;
                        var $2543 = Pair$new$($2541, Litereum$Term$call$($2538, $2542));
                        var $2540 = $2543;
                        break;
                };
                var $2535 = $2540;
                break;
            case 'Litereum.Term.let':
                var $2544 = self.name;
                var $2545 = self.type;
                var $2546 = self.expr;
                var $2547 = self.body;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $2546);
                switch (self._) {
                    case 'Pair.new':
                        var $2549 = self.fst;
                        var $2550 = self.snd;
                        var self = Litereum$rename$(_table$2, $2549, $2544);
                        switch (self._) {
                            case 'Triple.new':
                                var $2552 = self.fst;
                                var $2553 = self.snd;
                                var $2554 = self.trd;
                                var self = Litereum$sanitize$(_world$1, $2552, $2553, $2547);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2556 = self.fst;
                                        var $2557 = self.snd;
                                        var $2558 = Pair$new$($2556, Litereum$Term$let$($2554, $2545, $2550, $2557));
                                        var $2555 = $2558;
                                        break;
                                };
                                var $2551 = $2555;
                                break;
                        };
                        var $2548 = $2551;
                        break;
                };
                var $2535 = $2548;
                break;
            case 'Litereum.Term.create':
                var $2559 = self.ctor;
                var $2560 = self.vals;
                var self = Litereum$sanitize$many$(_world$1, _table$2, _fresh$3, $2560);
                switch (self._) {
                    case 'Pair.new':
                        var $2562 = self.fst;
                        var $2563 = self.snd;
                        var $2564 = Pair$new$($2562, Litereum$Term$create$($2559, $2563));
                        var $2561 = $2564;
                        break;
                };
                var $2535 = $2561;
                break;
            case 'Litereum.Term.match':
                var $2565 = self.name;
                var $2566 = self.data;
                var $2567 = self.cses;
                var _ctrs$8 = Maybe$default$(Litereum$get_constructors$(_world$1, $2566), List$nil);
                var _old_name$9 = $2565;
                var _new_name$10 = Maybe$default$(Map$get$($2565, _table$2), $2565);
                var self = Litereum$sanitize$cases$(_world$1, _table$2, _fresh$3, _old_name$9, _new_name$10, _ctrs$8, $2567);
                switch (self._) {
                    case 'Pair.new':
                        var $2569 = self.fst;
                        var $2570 = self.snd;
                        var $2571 = Pair$new$($2569, Litereum$Term$match$(_new_name$10, $2566, $2570));
                        var $2568 = $2571;
                        break;
                };
                var $2535 = $2568;
                break;
            case 'Litereum.Term.word':
                var $2572 = self.numb;
                var $2573 = Pair$new$(_fresh$3, Litereum$Term$word$($2572));
                var $2535 = $2573;
                break;
            case 'Litereum.Term.compare':
                var $2574 = self.val0;
                var $2575 = self.val1;
                var $2576 = self.iflt;
                var $2577 = self.ifeq;
                var $2578 = self.ifgt;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $2574);
                switch (self._) {
                    case 'Pair.new':
                        var $2580 = self.fst;
                        var $2581 = self.snd;
                        var self = Litereum$sanitize$(_world$1, _table$2, $2580, $2575);
                        switch (self._) {
                            case 'Pair.new':
                                var $2583 = self.fst;
                                var $2584 = self.snd;
                                var self = Litereum$sanitize$(_world$1, _table$2, $2583, $2576);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2586 = self.fst;
                                        var $2587 = self.snd;
                                        var self = Litereum$sanitize$(_world$1, _table$2, $2586, $2577);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $2589 = self.fst;
                                                var $2590 = self.snd;
                                                var self = Litereum$sanitize$(_world$1, _table$2, $2589, $2578);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $2592 = self.fst;
                                                        var $2593 = self.snd;
                                                        var $2594 = Pair$new$($2592, Litereum$Term$compare$($2581, $2584, $2587, $2590, $2593));
                                                        var $2591 = $2594;
                                                        break;
                                                };
                                                var $2588 = $2591;
                                                break;
                                        };
                                        var $2585 = $2588;
                                        break;
                                };
                                var $2582 = $2585;
                                break;
                        };
                        var $2579 = $2582;
                        break;
                };
                var $2535 = $2579;
                break;
            case 'Litereum.Term.operate':
                var $2595 = self.oper;
                var $2596 = self.val0;
                var $2597 = self.val1;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $2596);
                switch (self._) {
                    case 'Pair.new':
                        var $2599 = self.fst;
                        var $2600 = self.snd;
                        var self = Litereum$sanitize$(_world$1, _table$2, $2599, $2597);
                        switch (self._) {
                            case 'Pair.new':
                                var $2602 = self.fst;
                                var $2603 = self.snd;
                                var $2604 = Pair$new$($2602, Litereum$Term$operate$($2595, $2600, $2603));
                                var $2601 = $2604;
                                break;
                        };
                        var $2598 = $2601;
                        break;
                };
                var $2535 = $2598;
                break;
            case 'Litereum.Term.bind':
                var $2605 = self.name;
                var $2606 = self.main;
                var $2607 = self.body;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $2606);
                switch (self._) {
                    case 'Pair.new':
                        var $2609 = self.fst;
                        var $2610 = self.snd;
                        var self = Litereum$sanitize$(_world$1, _table$2, $2609, $2607);
                        switch (self._) {
                            case 'Pair.new':
                                var $2612 = self.fst;
                                var $2613 = self.snd;
                                var $2614 = Pair$new$($2612, Litereum$Term$bind$($2605, $2610, $2613));
                                var $2611 = $2614;
                                break;
                        };
                        var $2608 = $2611;
                        break;
                };
                var $2535 = $2608;
                break;
        };
        return $2535;
    };
    const Litereum$sanitize = x0 => x1 => x2 => x3 => Litereum$sanitize$(x0, x1, x2, x3);
    const U64$from_nat = a0 => (a0 & 0xFFFFFFFFFFFFFFFFn);

    function Litereum$get_constructor_index$(_data$1, _name$2) {
        var $2615 = Maybe$mapped$(List$ifind$((_i$3 => _ctr$4 => {
            var $2616 = ((() => {
                var self = _ctr$4;
                switch (self._) {
                    case 'Litereum.Constructor.new':
                        var $2617 = self.name;
                        var $2618 = $2617;
                        return $2618;
                };
            })() === _name$2);
            return $2616;
        }), (() => {
            var self = _data$1;
            switch (self._) {
                case 'Litereum.Data.new':
                    var $2619 = self.constructors;
                    var $2620 = $2619;
                    return $2620;
            };
        })()), (_x$3 => {
            var self = _x$3;
            switch (self._) {
                case 'Pair.new':
                    var $2622 = self.fst;
                    var $2623 = $2622;
                    var $2621 = $2623;
                    break;
            };
            return $2621;
        }));
        return $2615;
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
                        var $2624 = self.head;
                        var $2625 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $2627 = Maybe$some$($2624);
                            var $2626 = $2627;
                        } else {
                            var $2628 = (self - 1n);
                            var $2629 = List$get$($2628, $2625);
                            var $2626 = $2629;
                        };
                        return $2626;
                    case 'List.nil':
                        var $2630 = Maybe$none;
                        return $2630;
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
            var $2632 = Cmp$ltn;
            var $2631 = $2632;
        } else {
            var self = (_a$1 === _b$2);
            if (self) {
                var $2634 = Cmp$eql;
                var $2633 = $2634;
            } else {
                var $2635 = Cmp$gtn;
                var $2633 = $2635;
            };
            var $2631 = $2633;
        };
        return $2631;
    };
    const U64$cmp = x0 => x1 => U64$cmp$(x0, x1);
    const U64$add = a0 => a1 => ((a0 + a1) & 0xFFFFFFFFFFFFFFFFn);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $2637 = self.pred;
                var $2638 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $2640 = self.pred;
                            var $2641 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2643 = Word$i$(Word$subber$(_a$pred$10, $2640, Bool$true));
                                    var $2642 = $2643;
                                } else {
                                    var $2644 = Word$o$(Word$subber$(_a$pred$10, $2640, Bool$false));
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
                                    var $2648 = Word$o$(Word$subber$(_a$pred$10, $2645, Bool$true));
                                    var $2647 = $2648;
                                } else {
                                    var $2649 = Word$i$(Word$subber$(_a$pred$10, $2645, Bool$true));
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
                var $2636 = $2638;
                break;
            case 'Word.i':
                var $2652 = self.pred;
                var $2653 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $2655 = self.pred;
                            var $2656 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2658 = Word$o$(Word$subber$(_a$pred$10, $2655, Bool$false));
                                    var $2657 = $2658;
                                } else {
                                    var $2659 = Word$i$(Word$subber$(_a$pred$10, $2655, Bool$false));
                                    var $2657 = $2659;
                                };
                                return $2657;
                            });
                            var $2654 = $2656;
                            break;
                        case 'Word.i':
                            var $2660 = self.pred;
                            var $2661 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2663 = Word$i$(Word$subber$(_a$pred$10, $2660, Bool$true));
                                    var $2662 = $2663;
                                } else {
                                    var $2664 = Word$o$(Word$subber$(_a$pred$10, $2660, Bool$false));
                                    var $2662 = $2664;
                                };
                                return $2662;
                            });
                            var $2654 = $2661;
                            break;
                        case 'Word.e':
                            var $2665 = (_a$pred$8 => {
                                var $2666 = Word$e;
                                return $2666;
                            });
                            var $2654 = $2665;
                            break;
                    };
                    var $2654 = $2654($2652);
                    return $2654;
                });
                var $2636 = $2653;
                break;
            case 'Word.e':
                var $2667 = (_b$5 => {
                    var $2668 = Word$e;
                    return $2668;
                });
                var $2636 = $2667;
                break;
        };
        var $2636 = $2636(_b$3);
        return $2636;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $2669 = Word$subber$(_a$2, _b$3, Bool$false);
        return $2669;
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
                        var $2670 = self.pred;
                        var $2671 = Word$bit_length$go$($2670, Nat$succ$(_c$3), _n$4);
                        return $2671;
                    case 'Word.i':
                        var $2672 = self.pred;
                        var $2673 = Word$bit_length$go$($2672, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $2673;
                    case 'Word.e':
                        var $2674 = _n$4;
                        return $2674;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $2675 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $2675;
    };
    const Word$bit_length = x0 => Word$bit_length$(x0);
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $2677 = Bool$false;
                var $2676 = $2677;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $2678 = Bool$true;
                var $2676 = $2678;
                break;
        };
        return $2676;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $2679 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $2679;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $2681 = self.pred;
                var $2682 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $2684 = self.pred;
                            var $2685 = (_a$pred$9 => {
                                var $2686 = Word$o$(Word$or$(_a$pred$9, $2684));
                                return $2686;
                            });
                            var $2683 = $2685;
                            break;
                        case 'Word.i':
                            var $2687 = self.pred;
                            var $2688 = (_a$pred$9 => {
                                var $2689 = Word$i$(Word$or$(_a$pred$9, $2687));
                                return $2689;
                            });
                            var $2683 = $2688;
                            break;
                        case 'Word.e':
                            var $2690 = (_a$pred$7 => {
                                var $2691 = Word$e;
                                return $2691;
                            });
                            var $2683 = $2690;
                            break;
                    };
                    var $2683 = $2683($2681);
                    return $2683;
                });
                var $2680 = $2682;
                break;
            case 'Word.i':
                var $2692 = self.pred;
                var $2693 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $2695 = self.pred;
                            var $2696 = (_a$pred$9 => {
                                var $2697 = Word$i$(Word$or$(_a$pred$9, $2695));
                                return $2697;
                            });
                            var $2694 = $2696;
                            break;
                        case 'Word.i':
                            var $2698 = self.pred;
                            var $2699 = (_a$pred$9 => {
                                var $2700 = Word$i$(Word$or$(_a$pred$9, $2698));
                                return $2700;
                            });
                            var $2694 = $2699;
                            break;
                        case 'Word.e':
                            var $2701 = (_a$pred$7 => {
                                var $2702 = Word$e;
                                return $2702;
                            });
                            var $2694 = $2701;
                            break;
                    };
                    var $2694 = $2694($2692);
                    return $2694;
                });
                var $2680 = $2693;
                break;
            case 'Word.e':
                var $2703 = (_b$4 => {
                    var $2704 = Word$e;
                    return $2704;
                });
                var $2680 = $2703;
                break;
        };
        var $2680 = $2680(_b$3);
        return $2680;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right$one$go$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $2706 = self.pred;
                var $2707 = Word$o$(Word$shift_right$one$go$($2706));
                var $2705 = $2707;
                break;
            case 'Word.i':
                var $2708 = self.pred;
                var $2709 = Word$i$(Word$shift_right$one$go$($2708));
                var $2705 = $2709;
                break;
            case 'Word.e':
                var $2710 = Word$o$(Word$e);
                var $2705 = $2710;
                break;
        };
        return $2705;
    };
    const Word$shift_right$one$go = x0 => Word$shift_right$one$go$(x0);

    function Word$shift_right$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $2712 = self.pred;
                var $2713 = Word$shift_right$one$go$($2712);
                var $2711 = $2713;
                break;
            case 'Word.i':
                var $2714 = self.pred;
                var $2715 = Word$shift_right$one$go$($2714);
                var $2711 = $2715;
                break;
            case 'Word.e':
                var $2716 = Word$e;
                var $2711 = $2716;
                break;
        };
        return $2711;
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
                    var $2717 = _value$2;
                    return $2717;
                } else {
                    var $2718 = (self - 1n);
                    var $2719 = Word$shift_right$(Word$shift_right$one$(_value$2), $2718);
                    return $2719;
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
                    var $2720 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $2720;
                } else {
                    var $2721 = Pair$new$(Bool$false, _value$5);
                    var self = $2721;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $2722 = self.fst;
                        var $2723 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $2725 = $2723;
                            var $2724 = $2725;
                        } else {
                            var $2726 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right$(_shift_copy$4, 1n);
                            var self = $2722;
                            if (self) {
                                var $2728 = Word$div$go$($2726, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $2723);
                                var $2727 = $2728;
                            } else {
                                var $2729 = Word$div$go$($2726, _sub_copy$3, _new_shift_copy$9, $2723);
                                var $2727 = $2729;
                            };
                            var $2724 = $2727;
                        };
                        return $2724;
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
            var $2731 = Word$to_zero$(_a$2);
            var $2730 = $2731;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_b$3, _shift$6);
            var $2732 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $2730 = $2732;
        };
        return $2730;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U64$div = a0 => a1 => ((a0 / a1) & 0xFFFFFFFFFFFFFFFFn);

    function Word$mod$(_a$2, _b$3) {
        var _q$4 = Word$div$(_a$2, _b$3);
        var $2733 = Word$sub$(_a$2, Word$mul$(_b$3, _q$4));
        return $2733;
    };
    const Word$mod = x0 => x1 => Word$mod$(x0, x1);
    const U64$mod = a0 => a1 => (a0 % a1);
    const U64$or = a0 => a1 => (a0 | a1);

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $2735 = self.pred;
                var $2736 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $2738 = self.pred;
                            var $2739 = (_a$pred$9 => {
                                var $2740 = Word$o$(Word$and$(_a$pred$9, $2738));
                                return $2740;
                            });
                            var $2737 = $2739;
                            break;
                        case 'Word.i':
                            var $2741 = self.pred;
                            var $2742 = (_a$pred$9 => {
                                var $2743 = Word$o$(Word$and$(_a$pred$9, $2741));
                                return $2743;
                            });
                            var $2737 = $2742;
                            break;
                        case 'Word.e':
                            var $2744 = (_a$pred$7 => {
                                var $2745 = Word$e;
                                return $2745;
                            });
                            var $2737 = $2744;
                            break;
                    };
                    var $2737 = $2737($2735);
                    return $2737;
                });
                var $2734 = $2736;
                break;
            case 'Word.i':
                var $2746 = self.pred;
                var $2747 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $2749 = self.pred;
                            var $2750 = (_a$pred$9 => {
                                var $2751 = Word$o$(Word$and$(_a$pred$9, $2749));
                                return $2751;
                            });
                            var $2748 = $2750;
                            break;
                        case 'Word.i':
                            var $2752 = self.pred;
                            var $2753 = (_a$pred$9 => {
                                var $2754 = Word$i$(Word$and$(_a$pred$9, $2752));
                                return $2754;
                            });
                            var $2748 = $2753;
                            break;
                        case 'Word.e':
                            var $2755 = (_a$pred$7 => {
                                var $2756 = Word$e;
                                return $2756;
                            });
                            var $2748 = $2755;
                            break;
                    };
                    var $2748 = $2748($2746);
                    return $2748;
                });
                var $2734 = $2747;
                break;
            case 'Word.e':
                var $2757 = (_b$4 => {
                    var $2758 = Word$e;
                    return $2758;
                });
                var $2734 = $2757;
                break;
        };
        var $2734 = $2734(_b$3);
        return $2734;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U64$and = a0 => a1 => (a0 & a1);

    function Word$xor$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $2760 = self.pred;
                var $2761 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $2763 = self.pred;
                            var $2764 = (_a$pred$9 => {
                                var $2765 = Word$o$(Word$xor$(_a$pred$9, $2763));
                                return $2765;
                            });
                            var $2762 = $2764;
                            break;
                        case 'Word.i':
                            var $2766 = self.pred;
                            var $2767 = (_a$pred$9 => {
                                var $2768 = Word$i$(Word$xor$(_a$pred$9, $2766));
                                return $2768;
                            });
                            var $2762 = $2767;
                            break;
                        case 'Word.e':
                            var $2769 = (_a$pred$7 => {
                                var $2770 = Word$e;
                                return $2770;
                            });
                            var $2762 = $2769;
                            break;
                    };
                    var $2762 = $2762($2760);
                    return $2762;
                });
                var $2759 = $2761;
                break;
            case 'Word.i':
                var $2771 = self.pred;
                var $2772 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $2774 = self.pred;
                            var $2775 = (_a$pred$9 => {
                                var $2776 = Word$i$(Word$xor$(_a$pred$9, $2774));
                                return $2776;
                            });
                            var $2773 = $2775;
                            break;
                        case 'Word.i':
                            var $2777 = self.pred;
                            var $2778 = (_a$pred$9 => {
                                var $2779 = Word$o$(Word$xor$(_a$pred$9, $2777));
                                return $2779;
                            });
                            var $2773 = $2778;
                            break;
                        case 'Word.e':
                            var $2780 = (_a$pred$7 => {
                                var $2781 = Word$e;
                                return $2781;
                            });
                            var $2773 = $2780;
                            break;
                    };
                    var $2773 = $2773($2771);
                    return $2773;
                });
                var $2759 = $2772;
                break;
            case 'Word.e':
                var $2782 = (_b$4 => {
                    var $2783 = Word$e;
                    return $2783;
                });
                var $2759 = $2782;
                break;
        };
        var $2759 = $2759(_b$3);
        return $2759;
    };
    const Word$xor = x0 => x1 => Word$xor$(x0, x1);
    const U64$xor = a0 => a1 => (a0 ^ a1);

    function Litereum$reduce$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'Litereum.Runtime.new':
                var $2785 = self.world;
                var $2786 = self.subst;
                var $2787 = self.fresh;
                var $2788 = self.gas;
                var $2789 = self.term;
                var self = $2789;
                switch (self._) {
                    case 'Litereum.Term.var':
                        var $2791 = self.name;
                        var _term$8 = Maybe$default$(Map$get$($2791, $2786), $2789);
                        var $2792 = Litereum$reduce$(Litereum$Runtime$new$($2785, $2786, $2787, $2788, _term$8));
                        var $2790 = $2792;
                        break;
                    case 'Litereum.Term.call':
                        var $2793 = self.bond;
                        var $2794 = self.args;
                        var self = Litereum$get_bond$($2785, $2793);
                        switch (self._) {
                            case 'Maybe.some':
                                var $2796 = self.value;
                                var _bond$10 = $2796;
                                var self = _bond$10;
                                switch (self._) {
                                    case 'Litereum.Bond.new':
                                        var $2798 = self.input_names;
                                        var $2799 = self.main;
                                        var self = Litereum$rename$many$(Map$from_list$(List$nil), $2787, $2798);
                                        switch (self._) {
                                            case 'Triple.new':
                                                var $2801 = self.fst;
                                                var $2802 = self.snd;
                                                var $2803 = self.trd;
                                                var self = Litereum$sanitize$($2785, $2801, $2802, $2799);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $2805 = self.fst;
                                                        var $2806 = self.snd;
                                                        var _subst$22 = Litereum$extend$($2786, $2803, $2794);
                                                        var $2807 = Litereum$reduce$(Litereum$Runtime$new$($2785, _subst$22, $2805, $2788, $2806));
                                                        var $2804 = $2807;
                                                        break;
                                                };
                                                var $2800 = $2804;
                                                break;
                                        };
                                        var $2797 = $2800;
                                        break;
                                };
                                var $2795 = $2797;
                                break;
                            case 'Maybe.none':
                                var $2808 = _state$1;
                                var $2795 = $2808;
                                break;
                        };
                        var $2790 = $2795;
                        break;
                    case 'Litereum.Term.let':
                        var $2809 = self.name;
                        var $2810 = self.expr;
                        var $2811 = self.body;
                        var $2812 = Litereum$reduce$(Litereum$Runtime$new$($2785, Map$set$($2809, $2810, $2786), $2787, $2788, $2811));
                        var $2790 = $2812;
                        break;
                    case 'Litereum.Term.match':
                        var $2813 = self.name;
                        var $2814 = self.data;
                        var $2815 = self.cses;
                        var self = Litereum$reduce$(Litereum$Runtime$new$($2785, $2786, $2787, $2788, Maybe$default$(Map$get$($2813, $2786), Litereum$Term$word$(0n))));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $2817 = self.world;
                                var $2818 = self.subst;
                                var $2819 = self.fresh;
                                var $2820 = self.gas;
                                var $2821 = self.term;
                                var self = $2821;
                                switch (self._) {
                                    case 'Litereum.Term.create':
                                        var $2823 = self.ctor;
                                        var $2824 = self.vals;
                                        var self = Litereum$get_data$($2817, $2814);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $2826 = self.value;
                                                var _data$18 = $2826;
                                                var self = _data$18;
                                                switch (self._) {
                                                    case 'Litereum.Data.new':
                                                        var self = Litereum$get_constructor_value$(_data$18, $2823);
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $2829 = self.value;
                                                                var _ctor$22 = $2829;
                                                                var self = _ctor$22;
                                                                switch (self._) {
                                                                    case 'Litereum.Constructor.new':
                                                                        var self = Litereum$get_constructor_index$(_data$18, $2823);
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $2832 = self.value;
                                                                                var self = List$get$($2832, $2815);
                                                                                switch (self._) {
                                                                                    case 'Maybe.some':
                                                                                        var $2834 = self.value;
                                                                                        var _nams$28 = List$map$(a1 => (($2813 + ".") + a1), (() => {
                                                                                            var self = _ctor$22;
                                                                                            switch (self._) {
                                                                                                case 'Litereum.Constructor.new':
                                                                                                    var $2836 = self.field_names;
                                                                                                    var $2837 = $2836;
                                                                                                    return $2837;
                                                                                            };
                                                                                        })());
                                                                                        var _subst$29 = Litereum$extend$($2818, _nams$28, $2824);
                                                                                        var $2835 = Litereum$reduce$(Litereum$Runtime$new$($2817, _subst$29, $2819, $2820, $2834));
                                                                                        var $2833 = $2835;
                                                                                        break;
                                                                                    case 'Maybe.none':
                                                                                        var $2838 = _state$1;
                                                                                        var $2833 = $2838;
                                                                                        break;
                                                                                };
                                                                                var $2831 = $2833;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $2839 = _state$1;
                                                                                var $2831 = $2839;
                                                                                break;
                                                                        };
                                                                        var $2830 = $2831;
                                                                        break;
                                                                };
                                                                var $2828 = $2830;
                                                                break;
                                                            case 'Maybe.none':
                                                                var $2840 = _state$1;
                                                                var $2828 = $2840;
                                                                break;
                                                        };
                                                        var $2827 = $2828;
                                                        break;
                                                };
                                                var $2825 = $2827;
                                                break;
                                            case 'Maybe.none':
                                                var $2841 = _state$1;
                                                var $2825 = $2841;
                                                break;
                                        };
                                        var $2822 = $2825;
                                        break;
                                    case 'Litereum.Term.var':
                                    case 'Litereum.Term.call':
                                    case 'Litereum.Term.let':
                                    case 'Litereum.Term.match':
                                    case 'Litereum.Term.word':
                                    case 'Litereum.Term.compare':
                                    case 'Litereum.Term.operate':
                                    case 'Litereum.Term.bind':
                                        var $2842 = _state$1;
                                        var $2822 = $2842;
                                        break;
                                };
                                var $2816 = $2822;
                                break;
                        };
                        var $2790 = $2816;
                        break;
                    case 'Litereum.Term.compare':
                        var $2843 = self.val0;
                        var $2844 = self.val1;
                        var $2845 = self.iflt;
                        var $2846 = self.ifeq;
                        var $2847 = self.ifgt;
                        var self = Litereum$reduce$(Litereum$Runtime$new$($2785, $2786, $2787, $2788, $2843));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $2849 = self.world;
                                var $2850 = self.subst;
                                var $2851 = self.fresh;
                                var $2852 = self.gas;
                                var $2853 = self.term;
                                var self = Litereum$reduce$(Litereum$Runtime$new$($2849, $2850, $2851, $2852, $2844));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $2855 = self.world;
                                        var $2856 = self.subst;
                                        var $2857 = self.fresh;
                                        var $2858 = self.gas;
                                        var $2859 = self.term;
                                        var self = $2853;
                                        switch (self._) {
                                            case 'Litereum.Term.word':
                                                var $2861 = self.numb;
                                                var self = $2859;
                                                switch (self._) {
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.bind':
                                                        var $2863 = _state$1;
                                                        var $2862 = $2863;
                                                        break;
                                                    case 'Litereum.Term.word':
                                                        var self = U64$cmp$($2861, $2861);
                                                        switch (self._) {
                                                            case 'Cmp.ltn':
                                                                var $2865 = Litereum$reduce$(Litereum$Runtime$new$($2855, $2856, $2857, $2858, $2845));
                                                                var $2864 = $2865;
                                                                break;
                                                            case 'Cmp.eql':
                                                                var $2866 = Litereum$reduce$(Litereum$Runtime$new$($2855, $2856, $2857, $2858, $2846));
                                                                var $2864 = $2866;
                                                                break;
                                                            case 'Cmp.gtn':
                                                                var $2867 = Litereum$reduce$(Litereum$Runtime$new$($2855, $2856, $2857, $2858, $2847));
                                                                var $2864 = $2867;
                                                                break;
                                                        };
                                                        var $2862 = $2864;
                                                        break;
                                                };
                                                var $2860 = $2862;
                                                break;
                                            case 'Litereum.Term.var':
                                                var self = $2859;
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
                                                        var $2869 = _state$1;
                                                        var $2868 = $2869;
                                                        break;
                                                };
                                                var $2860 = $2868;
                                                break;
                                            case 'Litereum.Term.call':
                                            case 'Litereum.Term.create':
                                                var self = $2859;
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
                                                        var $2871 = _state$1;
                                                        var $2870 = $2871;
                                                        break;
                                                };
                                                var $2860 = $2870;
                                                break;
                                            case 'Litereum.Term.let':
                                                var self = $2859;
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
                                                        var $2873 = _state$1;
                                                        var $2872 = $2873;
                                                        break;
                                                };
                                                var $2860 = $2872;
                                                break;
                                            case 'Litereum.Term.match':
                                            case 'Litereum.Term.operate':
                                            case 'Litereum.Term.bind':
                                                var self = $2859;
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
                                                        var $2875 = _state$1;
                                                        var $2874 = $2875;
                                                        break;
                                                };
                                                var $2860 = $2874;
                                                break;
                                            case 'Litereum.Term.compare':
                                                var self = $2859;
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
                                                        var $2877 = _state$1;
                                                        var $2876 = $2877;
                                                        break;
                                                };
                                                var $2860 = $2876;
                                                break;
                                        };
                                        var $2854 = $2860;
                                        break;
                                };
                                var $2848 = $2854;
                                break;
                        };
                        var $2790 = $2848;
                        break;
                    case 'Litereum.Term.operate':
                        var $2878 = self.oper;
                        var $2879 = self.val0;
                        var $2880 = self.val1;
                        var self = Litereum$reduce$(Litereum$Runtime$new$($2785, $2786, $2787, $2788, $2879));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $2882 = self.world;
                                var $2883 = self.subst;
                                var $2884 = self.fresh;
                                var $2885 = self.gas;
                                var $2886 = self.term;
                                var self = Litereum$reduce$(Litereum$Runtime$new$($2882, $2883, $2884, $2885, $2880));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $2888 = self.world;
                                        var $2889 = self.subst;
                                        var $2890 = self.fresh;
                                        var $2891 = self.gas;
                                        var $2892 = self.term;
                                        var self = $2886;
                                        switch (self._) {
                                            case 'Litereum.Term.word':
                                                var $2894 = self.numb;
                                                var self = $2892;
                                                switch (self._) {
                                                    case 'Litereum.Term.word':
                                                        var $2896 = self.numb;
                                                        var self = $2878;
                                                        switch (self._) {
                                                            case 'Litereum.Operation.add':
                                                                var $2898 = Litereum$Runtime$new$($2888, $2889, $2890, $2891, Litereum$Term$word$((($2894 + $2896) & 0xFFFFFFFFFFFFFFFFn)));
                                                                var $2897 = $2898;
                                                                break;
                                                            case 'Litereum.Operation.sub':
                                                                var $2899 = Litereum$Runtime$new$($2888, $2889, $2890, $2891, Litereum$Term$word$((($2894 - $2896) & 0xFFFFFFFFFFFFFFFFn)));
                                                                var $2897 = $2899;
                                                                break;
                                                            case 'Litereum.Operation.mul':
                                                                var $2900 = Litereum$Runtime$new$($2888, $2889, $2890, $2891, Litereum$Term$word$((($2894 * $2896) & 0xFFFFFFFFFFFFFFFFn)));
                                                                var $2897 = $2900;
                                                                break;
                                                            case 'Litereum.Operation.div':
                                                                var $2901 = Litereum$Runtime$new$($2888, $2889, $2890, $2891, Litereum$Term$word$((($2894 / $2896) & 0xFFFFFFFFFFFFFFFFn)));
                                                                var $2897 = $2901;
                                                                break;
                                                            case 'Litereum.Operation.mod':
                                                                var $2902 = Litereum$Runtime$new$($2888, $2889, $2890, $2891, Litereum$Term$word$(($2894 % $2896)));
                                                                var $2897 = $2902;
                                                                break;
                                                            case 'Litereum.Operation.or':
                                                                var $2903 = Litereum$Runtime$new$($2888, $2889, $2890, $2891, Litereum$Term$word$(($2894 | $2896)));
                                                                var $2897 = $2903;
                                                                break;
                                                            case 'Litereum.Operation.and':
                                                                var $2904 = Litereum$Runtime$new$($2888, $2889, $2890, $2891, Litereum$Term$word$(($2894 & $2896)));
                                                                var $2897 = $2904;
                                                                break;
                                                            case 'Litereum.Operation.xor':
                                                                var $2905 = Litereum$Runtime$new$($2888, $2889, $2890, $2891, Litereum$Term$word$(($2894 ^ $2896)));
                                                                var $2897 = $2905;
                                                                break;
                                                        };
                                                        var $2895 = $2897;
                                                        break;
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.bind':
                                                        var $2906 = _state$1;
                                                        var $2895 = $2906;
                                                        break;
                                                };
                                                var $2893 = $2895;
                                                break;
                                            case 'Litereum.Term.var':
                                                var self = $2892;
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
                                                        var $2908 = _state$1;
                                                        var $2907 = $2908;
                                                        break;
                                                };
                                                var $2893 = $2907;
                                                break;
                                            case 'Litereum.Term.call':
                                            case 'Litereum.Term.create':
                                                var self = $2892;
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
                                                        var $2910 = _state$1;
                                                        var $2909 = $2910;
                                                        break;
                                                };
                                                var $2893 = $2909;
                                                break;
                                            case 'Litereum.Term.let':
                                                var self = $2892;
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
                                                        var $2912 = _state$1;
                                                        var $2911 = $2912;
                                                        break;
                                                };
                                                var $2893 = $2911;
                                                break;
                                            case 'Litereum.Term.match':
                                            case 'Litereum.Term.operate':
                                            case 'Litereum.Term.bind':
                                                var self = $2892;
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
                                                        var $2914 = _state$1;
                                                        var $2913 = $2914;
                                                        break;
                                                };
                                                var $2893 = $2913;
                                                break;
                                            case 'Litereum.Term.compare':
                                                var self = $2892;
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
                                                        var $2916 = _state$1;
                                                        var $2915 = $2916;
                                                        break;
                                                };
                                                var $2893 = $2915;
                                                break;
                                        };
                                        var $2887 = $2893;
                                        break;
                                };
                                var $2881 = $2887;
                                break;
                        };
                        var $2790 = $2881;
                        break;
                    case 'Litereum.Term.bind':
                        var $2917 = self.name;
                        var $2918 = self.main;
                        var $2919 = self.body;
                        var self = Litereum$get_bond$($2785, $2917);
                        switch (self._) {
                            case 'Maybe.some':
                                var $2921 = self.value;
                                var _bond$11 = $2921;
                                var self = _bond$11;
                                switch (self._) {
                                    case 'Litereum.Bond.new':
                                        var $2923 = self.input_names;
                                        var _nams$18 = $2923;
                                        var _vals$19 = List$map$(Litereum$Term$var, $2923);
                                        var self = _state$1;
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $2925 = self.world;
                                                var $2926 = self.subst;
                                                var $2927 = self.fresh;
                                                var $2928 = self.gas;
                                                var self = Litereum$normalize$(Litereum$Runtime$new$($2925, Litereum$extend$($2926, _nams$18, _vals$19), $2927, $2928, $2918));
                                                switch (self._) {
                                                    case 'Litereum.Runtime.new':
                                                        var $2930 = self.world;
                                                        var $2931 = self.fresh;
                                                        var $2932 = self.gas;
                                                        var $2933 = self.term;
                                                        var _new_entry$30 = Litereum$Entry$bond$((() => {
                                                            var self = _bond$11;
                                                            switch (self._) {
                                                                case 'Litereum.Bond.new':
                                                                    var $2935 = self.name;
                                                                    var $2936 = self.input_names;
                                                                    var $2937 = self.input_types;
                                                                    var $2938 = self.output_type;
                                                                    var $2939 = self.owners;
                                                                    var $2940 = Litereum$Bond$new$($2935, $2936, $2937, $2938, $2933, $2939);
                                                                    return $2940;
                                                            };
                                                        })());
                                                        var self = $2930;
                                                        switch (self._) {
                                                            case 'Litereum.World.new':
                                                                var $2941 = self.name_count;
                                                                var $2942 = self.name_to_index;
                                                                var $2943 = self.index_to_name;
                                                                var $2944 = Litereum$World$new$($2941, $2942, $2943, Map$set$($2917, _new_entry$30, (() => {
                                                                    var self = $2930;
                                                                    switch (self._) {
                                                                        case 'Litereum.World.new':
                                                                            var $2945 = self.entry;
                                                                            var $2946 = $2945;
                                                                            return $2946;
                                                                    };
                                                                })()));
                                                                var _new_world$31 = $2944;
                                                                break;
                                                        };
                                                        var $2934 = Litereum$reduce$(Litereum$Runtime$new$(_new_world$31, $2926, $2931, $2932, $2919));
                                                        var $2929 = $2934;
                                                        break;
                                                };
                                                var $2924 = $2929;
                                                break;
                                        };
                                        var $2922 = $2924;
                                        break;
                                };
                                var $2920 = $2922;
                                break;
                            case 'Maybe.none':
                                var $2947 = _state$1;
                                var $2920 = $2947;
                                break;
                        };
                        var $2790 = $2920;
                        break;
                    case 'Litereum.Term.create':
                    case 'Litereum.Term.word':
                        var $2948 = _state$1;
                        var $2790 = $2948;
                        break;
                };
                var $2784 = $2790;
                break;
        };
        return $2784;
    };
    const Litereum$reduce = x0 => Litereum$reduce$(x0);

    function Litereum$normalize$many$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'Litereum.Runtime.new':
                var $2950 = self.world;
                var $2951 = self.subst;
                var $2952 = self.fresh;
                var $2953 = self.gas;
                var $2954 = self.term;
                var self = $2954;
                switch (self._) {
                    case 'List.cons':
                        var $2956 = self.head;
                        var $2957 = self.tail;
                        var self = Litereum$normalize$(Litereum$Runtime$new$($2950, $2951, $2952, $2953, $2956));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $2959 = self.world;
                                var $2960 = self.subst;
                                var $2961 = self.fresh;
                                var $2962 = self.gas;
                                var $2963 = self.term;
                                var self = Litereum$normalize$many$(Litereum$Runtime$new$($2959, $2960, $2961, $2962, $2957));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $2965 = self.world;
                                        var $2966 = self.subst;
                                        var $2967 = self.fresh;
                                        var $2968 = self.gas;
                                        var $2969 = self.term;
                                        var $2970 = Litereum$Runtime$new$($2965, $2966, $2967, $2968, List$cons$($2963, $2969));
                                        var $2964 = $2970;
                                        break;
                                };
                                var $2958 = $2964;
                                break;
                        };
                        var $2955 = $2958;
                        break;
                    case 'List.nil':
                        var $2971 = _state$1;
                        var $2955 = $2971;
                        break;
                };
                var $2949 = $2955;
                break;
        };
        return $2949;
    };
    const Litereum$normalize$many = x0 => Litereum$normalize$many$(x0);

    function Litereum$normalize$cases$(_ctrs$1, _name$2, _state$3) {
        var self = _state$3;
        switch (self._) {
            case 'Litereum.Runtime.new':
                var $2973 = self.world;
                var $2974 = self.subst;
                var $2975 = self.fresh;
                var $2976 = self.gas;
                var $2977 = self.term;
                var self = _ctrs$1;
                switch (self._) {
                    case 'List.cons':
                        var $2979 = self.head;
                        var $2980 = self.tail;
                        var self = $2977;
                        switch (self._) {
                            case 'List.cons':
                                var $2982 = self.head;
                                var $2983 = self.tail;
                                var _nams$13 = List$map$(a1 => ((_name$2 + ".") + a1), (() => {
                                    var self = $2979;
                                    switch (self._) {
                                        case 'Litereum.Constructor.new':
                                            var $2985 = self.field_names;
                                            var $2986 = $2985;
                                            return $2986;
                                    };
                                })());
                                var _vals$14 = List$map$(Litereum$Term$var, _nams$13);
                                var _subst$15 = Litereum$extend$($2974, _nams$13, _vals$14);
                                var self = Litereum$normalize$(Litereum$Runtime$new$($2973, _subst$15, $2975, $2976, $2982));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $2987 = self.world;
                                        var $2988 = self.subst;
                                        var $2989 = self.fresh;
                                        var $2990 = self.gas;
                                        var $2991 = self.term;
                                        var self = Litereum$normalize$cases$($2980, _name$2, Litereum$Runtime$new$($2987, $2988, $2989, $2990, $2983));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $2993 = self.world;
                                                var $2994 = self.subst;
                                                var $2995 = self.fresh;
                                                var $2996 = self.gas;
                                                var $2997 = self.term;
                                                var $2998 = Litereum$Runtime$new$($2993, $2994, $2995, $2996, List$cons$($2991, $2997));
                                                var $2992 = $2998;
                                                break;
                                        };
                                        var $2984 = $2992;
                                        break;
                                };
                                var $2981 = $2984;
                                break;
                            case 'List.nil':
                                var $2999 = _state$3;
                                var $2981 = $2999;
                                break;
                        };
                        var $2978 = $2981;
                        break;
                    case 'List.nil':
                        var self = $2977;
                        switch (self._) {
                            case 'List.nil':
                            case 'List.cons':
                                var $3001 = _state$3;
                                var $3000 = $3001;
                                break;
                        };
                        var $2978 = $3000;
                        break;
                };
                var $2972 = $2978;
                break;
        };
        return $2972;
    };
    const Litereum$normalize$cases = x0 => x1 => x2 => Litereum$normalize$cases$(x0, x1, x2);

    function Litereum$normalize$(_state$1) {
        var self = Litereum$reduce$(_state$1);
        switch (self._) {
            case 'Litereum.Runtime.new':
                var $3003 = self.world;
                var $3004 = self.subst;
                var $3005 = self.fresh;
                var $3006 = self.gas;
                var $3007 = self.term;
                var self = $3007;
                switch (self._) {
                    case 'Litereum.Term.create':
                        var $3009 = self.ctor;
                        var $3010 = self.vals;
                        var self = Litereum$normalize$many$(Litereum$Runtime$new$($3003, $3004, $3005, $3006, $3010));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3012 = self.world;
                                var $3013 = self.subst;
                                var $3014 = self.fresh;
                                var $3015 = self.gas;
                                var $3016 = self.term;
                                var $3017 = Litereum$Runtime$new$($3012, $3013, $3014, $3015, Litereum$Term$create$($3009, $3016));
                                var $3011 = $3017;
                                break;
                        };
                        var $3008 = $3011;
                        break;
                    case 'Litereum.Term.match':
                        var $3018 = self.name;
                        var $3019 = self.data;
                        var $3020 = self.cses;
                        var self = Litereum$get_constructors$($3003, $3019);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3022 = self.value;
                                var _ctrs$11 = $3022;
                                var self = _ctrs$11;
                                switch (self._) {
                                    case 'List.nil':
                                        var self = Litereum$normalize$cases$(_ctrs$11, $3018, Litereum$Runtime$new$($3003, $3004, $3005, $3006, $3020));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $3025 = self.world;
                                                var $3026 = self.subst;
                                                var $3027 = self.fresh;
                                                var $3028 = self.gas;
                                                var $3029 = self.term;
                                                var $3030 = Litereum$Runtime$new$($3025, $3026, $3027, $3028, Litereum$Term$match$($3018, $3019, $3029));
                                                var $3024 = $3030;
                                                break;
                                        };
                                        var $3023 = $3024;
                                        break;
                                    case 'List.cons':
                                        var self = Litereum$normalize$cases$(_ctrs$11, $3018, Litereum$Runtime$new$($3003, $3004, $3005, $3006, $3020));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $3032 = self.world;
                                                var $3033 = self.subst;
                                                var $3034 = self.fresh;
                                                var $3035 = self.gas;
                                                var $3036 = self.term;
                                                var $3037 = Litereum$Runtime$new$($3032, $3033, $3034, $3035, Litereum$Term$match$($3018, $3019, $3036));
                                                var $3031 = $3037;
                                                break;
                                        };
                                        var $3023 = $3031;
                                        break;
                                };
                                var $3021 = $3023;
                                break;
                            case 'Maybe.none':
                                var $3038 = Litereum$Runtime$new$($3003, $3004, $3005, $3006, $3007);
                                var $3021 = $3038;
                                break;
                        };
                        var $3008 = $3021;
                        break;
                    case 'Litereum.Term.compare':
                        var $3039 = self.val0;
                        var $3040 = self.val1;
                        var $3041 = self.iflt;
                        var $3042 = self.ifeq;
                        var $3043 = self.ifgt;
                        var self = Litereum$normalize$(Litereum$Runtime$new$($3003, $3004, $3005, $3006, $3039));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3045 = self.world;
                                var $3046 = self.subst;
                                var $3047 = self.fresh;
                                var $3048 = self.gas;
                                var $3049 = self.term;
                                var self = Litereum$normalize$(Litereum$Runtime$new$($3045, $3046, $3047, $3048, $3040));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $3051 = self.world;
                                        var $3052 = self.subst;
                                        var $3053 = self.fresh;
                                        var $3054 = self.gas;
                                        var $3055 = self.term;
                                        var self = Litereum$normalize$(Litereum$Runtime$new$($3051, $3052, $3053, $3054, $3041));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $3057 = self.world;
                                                var $3058 = self.subst;
                                                var $3059 = self.fresh;
                                                var $3060 = self.gas;
                                                var $3061 = self.term;
                                                var self = Litereum$normalize$(Litereum$Runtime$new$($3057, $3058, $3059, $3060, $3042));
                                                switch (self._) {
                                                    case 'Litereum.Runtime.new':
                                                        var $3063 = self.world;
                                                        var $3064 = self.subst;
                                                        var $3065 = self.fresh;
                                                        var $3066 = self.gas;
                                                        var $3067 = self.term;
                                                        var self = Litereum$normalize$(Litereum$Runtime$new$($3063, $3064, $3065, $3066, $3043));
                                                        switch (self._) {
                                                            case 'Litereum.Runtime.new':
                                                                var $3069 = self.world;
                                                                var $3070 = self.subst;
                                                                var $3071 = self.fresh;
                                                                var $3072 = self.gas;
                                                                var $3073 = self.term;
                                                                var $3074 = Litereum$Runtime$new$($3069, $3070, $3071, $3072, Litereum$Term$compare$($3049, $3055, $3061, $3067, $3073));
                                                                var $3068 = $3074;
                                                                break;
                                                        };
                                                        var $3062 = $3068;
                                                        break;
                                                };
                                                var $3056 = $3062;
                                                break;
                                        };
                                        var $3050 = $3056;
                                        break;
                                };
                                var $3044 = $3050;
                                break;
                        };
                        var $3008 = $3044;
                        break;
                    case 'Litereum.Term.operate':
                        var $3075 = self.oper;
                        var $3076 = self.val0;
                        var $3077 = self.val1;
                        var self = Litereum$normalize$(Litereum$Runtime$new$($3003, $3004, $3005, $3006, $3076));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3079 = self.world;
                                var $3080 = self.subst;
                                var $3081 = self.fresh;
                                var $3082 = self.gas;
                                var $3083 = self.term;
                                var self = Litereum$normalize$(Litereum$Runtime$new$($3079, $3080, $3081, $3082, $3077));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $3085 = self.world;
                                        var $3086 = self.subst;
                                        var $3087 = self.fresh;
                                        var $3088 = self.gas;
                                        var $3089 = self.term;
                                        var $3090 = Litereum$Runtime$new$($3085, $3086, $3087, $3088, Litereum$Term$operate$($3075, $3083, $3089));
                                        var $3084 = $3090;
                                        break;
                                };
                                var $3078 = $3084;
                                break;
                        };
                        var $3008 = $3078;
                        break;
                    case 'Litereum.Term.var':
                    case 'Litereum.Term.call':
                    case 'Litereum.Term.let':
                    case 'Litereum.Term.word':
                    case 'Litereum.Term.bind':
                        var $3091 = Litereum$Runtime$new$($3003, $3004, $3005, $3006, $3007);
                        var $3008 = $3091;
                        break;
                };
                var $3002 = $3008;
                break;
        };
        return $3002;
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
                        var $3092 = self.head;
                        var $3093 = self.tail;
                        var $3094 = String$flatten$go$($3093, (_res$2 + $3092));
                        return $3094;
                    case 'List.nil':
                        var $3095 = _res$2;
                        return $3095;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$flatten$go = x0 => x1 => String$flatten$go$(x0, x1);

    function String$flatten$(_xs$1) {
        var $3096 = String$flatten$go$(_xs$1, "");
        return $3096;
    };
    const String$flatten = x0 => String$flatten$(x0);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $3098 = self.head;
                var $3099 = self.tail;
                var $3100 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $3101 = "";
                        return $3101;
                    } else {
                        var $3102 = _sep$1;
                        return $3102;
                    };
                })(), List$cons$($3098, List$cons$(String$join$go$(_sep$1, $3099, Bool$false), List$nil))));
                var $3097 = $3100;
                break;
            case 'List.nil':
                var $3103 = "";
                var $3097 = $3103;
                break;
        };
        return $3097;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $3104 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $3104;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function Litereum$show$type$(_world$1, _type$2) {
        var self = _type$2;
        switch (self._) {
            case 'Litereum.Type.data':
                var $3106 = self.name;
                var $3107 = $3106;
                var $3105 = $3107;
                break;
            case 'Litereum.Type.word':
                var $3108 = "#word";
                var $3105 = $3108;
                break;
        };
        return $3105;
    };
    const Litereum$show$type = x0 => x1 => Litereum$show$type$(x0, x1);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $3110 = self.pred;
                var $3111 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $3110));
                var $3109 = $3111;
                break;
            case 'Word.i':
                var $3112 = self.pred;
                var $3113 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $3112));
                var $3109 = $3113;
                break;
            case 'Word.e':
                var $3114 = _nil$3;
                var $3109 = $3114;
                break;
        };
        return $3109;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);

    function Word$to_nat$(_word$2) {
        var $3115 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $3116 = Nat$succ$((2n * _x$4));
            return $3116;
        }), _word$2);
        return $3115;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function Word$show$(_size$1, _a$2) {
        var $3117 = Nat$show$(Word$to_nat$(_a$2));
        return $3117;
    };
    const Word$show = x0 => x1 => Word$show$(x0, x1);
    const U64$show = a0 => (String(a0));

    function Litereum$show$term$(_world$1, _term$2) {
        var self = _term$2;
        switch (self._) {
            case 'Litereum.Term.var':
                var $3119 = self.name;
                var $3120 = $3119;
                var $3118 = $3120;
                break;
            case 'Litereum.Term.call':
                var $3121 = self.bond;
                var $3122 = self.args;
                var _bond$5 = $3121;
                var _args$6 = List$map$(Litereum$show$term(_world$1), $3122);
                var $3123 = (_bond$5 + ("(" + (String$join$(",", _args$6) + ")")));
                var $3118 = $3123;
                break;
            case 'Litereum.Term.let':
                var $3124 = self.name;
                var $3125 = self.type;
                var $3126 = self.expr;
                var $3127 = self.body;
                var _name$7 = $3124;
                var _type$8 = Litereum$show$type$(_world$1, $3125);
                var _expr$9 = Litereum$show$term$(_world$1, $3126);
                var _body$10 = Litereum$show$term$(_world$1, $3127);
                var $3128 = ("let " + (_name$7 + (" : " + (_type$8 + (" = " + (_expr$9 + (" " + _body$10)))))));
                var $3118 = $3128;
                break;
            case 'Litereum.Term.create':
                var $3129 = self.ctor;
                var $3130 = self.vals;
                var _vals$5 = List$mapped$($3130, Litereum$show$term(_world$1));
                var $3131 = ($3129 + ("{" + (String$join$(",", _vals$5) + "}")));
                var $3118 = $3131;
                break;
            case 'Litereum.Term.match':
                var $3132 = self.name;
                var $3133 = self.data;
                var $3134 = self.cses;
                var self = Litereum$get_data$(_world$1, $3133);
                switch (self._) {
                    case 'Maybe.some':
                        var $3136 = self.value;
                        var _data$7 = $3136;
                        var self = _data$7;
                        switch (self._) {
                            case 'Litereum.Data.new':
                                var $3138 = self.constructors;
                                var _name$10 = $3132;
                                var _cses$11 = List$zipped_with$($3138, $3134, (_case_ctor$11 => _case_body$12 => {
                                    var $3140 = ((() => {
                                        var self = _case_ctor$11;
                                        switch (self._) {
                                            case 'Litereum.Constructor.new':
                                                var $3141 = self.name;
                                                var $3142 = $3141;
                                                return $3142;
                                        };
                                    })() + (": " + Litereum$show$term$(_world$1, _case_body$12)));
                                    return $3140;
                                }));
                                var $3139 = ("case " + (_name$10 + (" : " + ($3133 + (" { " + (String$join$(", ", _cses$11) + " }"))))));
                                var $3137 = $3139;
                                break;
                        };
                        var $3135 = $3137;
                        break;
                    case 'Maybe.none':
                        var $3143 = "?";
                        var $3135 = $3143;
                        break;
                };
                var $3118 = $3135;
                break;
            case 'Litereum.Term.word':
                var $3144 = self.numb;
                var $3145 = ("#" + (String($3144)));
                var $3118 = $3145;
                break;
            case 'Litereum.Term.compare':
                var $3146 = self.val0;
                var $3147 = self.val1;
                var $3148 = self.iflt;
                var $3149 = self.ifeq;
                var $3150 = self.ifgt;
                var _val0$8 = Litereum$show$term$(_world$1, $3146);
                var _val1$9 = Litereum$show$term$(_world$1, $3147);
                var _iflt$10 = Litereum$show$term$(_world$1, $3148);
                var _ifeq$11 = Litereum$show$term$(_world$1, $3149);
                var _ifgt$12 = Litereum$show$term$(_world$1, $3150);
                var $3151 = ("compare " + (_val0$8 + (" " + (_val1$9 + (" { _<_: " + (_iflt$10 + (" _=_: " + (_ifeq$11 + (" _>_: " + (_ifgt$12 + " }"))))))))));
                var $3118 = $3151;
                break;
            case 'Litereum.Term.operate':
                var $3152 = self.oper;
                var $3153 = self.val0;
                var $3154 = self.val1;
                var self = $3152;
                switch (self._) {
                    case 'Litereum.Operation.add':
                        var $3156 = "+";
                        var _oper$6 = $3156;
                        break;
                    case 'Litereum.Operation.sub':
                        var $3157 = "-";
                        var _oper$6 = $3157;
                        break;
                    case 'Litereum.Operation.mul':
                        var $3158 = "*";
                        var _oper$6 = $3158;
                        break;
                    case 'Litereum.Operation.div':
                        var $3159 = "/";
                        var _oper$6 = $3159;
                        break;
                    case 'Litereum.Operation.mod':
                        var $3160 = "%";
                        var _oper$6 = $3160;
                        break;
                    case 'Litereum.Operation.or':
                        var $3161 = "|";
                        var _oper$6 = $3161;
                        break;
                    case 'Litereum.Operation.and':
                        var $3162 = "&";
                        var _oper$6 = $3162;
                        break;
                    case 'Litereum.Operation.xor':
                        var $3163 = "^";
                        var _oper$6 = $3163;
                        break;
                };
                var _val0$7 = Litereum$show$term$(_world$1, $3153);
                var _val1$8 = Litereum$show$term$(_world$1, $3154);
                var $3155 = (_oper$6 + ("(" + (_val0$7 + ("," + (_val1$8 + ")")))));
                var $3118 = $3155;
                break;
            case 'Litereum.Term.bind':
                var $3164 = self.name;
                var $3165 = self.main;
                var $3166 = self.body;
                var _name$6 = $3164;
                var _main$7 = Litereum$show$term$(_world$1, $3165);
                var _body$8 = Litereum$show$term$(_world$1, $3166);
                var $3167 = ("bind " + (_name$6 + (" { " + (_main$7 + (" } " + _body$8)))));
                var $3118 = $3167;
                break;
        };
        return $3118;
    };
    const Litereum$show$term = x0 => x1 => Litereum$show$term$(x0, x1);

    function Litereum$run$(_world$1, _transaction$2, _bipass$3) {
        var self = _world$1;
        switch (self._) {
            case 'Litereum.World.new':
                var $3169 = self.name_count;
                var $3170 = self.name_to_index;
                var $3171 = self.index_to_name;
                var $3172 = self.entry;
                var self = _transaction$2;
                switch (self._) {
                    case 'Litereum.Transaction.new_name':
                        var $3174 = self.name;
                        var _name$9 = $3174;
                        var self = Map$get$(_name$9, (() => {
                            var self = _world$1;
                            switch (self._) {
                                case 'Litereum.World.new':
                                    var $3176 = self.name_to_index;
                                    var $3177 = $3176;
                                    return $3177;
                            };
                        })());
                        switch (self._) {
                            case 'Maybe.none':
                                var self = _world$1;
                                switch (self._) {
                                    case 'Litereum.World.new':
                                        var $3179 = self.name_to_index;
                                        var $3180 = self.index_to_name;
                                        var $3181 = self.entry;
                                        var $3182 = Litereum$World$new$(($3169 + 1n), $3179, $3180, $3181);
                                        var _world$10 = $3182;
                                        break;
                                };
                                var self = _world$10;
                                switch (self._) {
                                    case 'Litereum.World.new':
                                        var $3183 = self.name_count;
                                        var $3184 = self.index_to_name;
                                        var $3185 = self.entry;
                                        var $3186 = Litereum$World$new$($3183, Map$set$(_name$9, $3169, $3170), $3184, $3185);
                                        var _world$11 = $3186;
                                        break;
                                };
                                var self = _world$11;
                                switch (self._) {
                                    case 'Litereum.World.new':
                                        var $3187 = self.name_count;
                                        var $3188 = self.name_to_index;
                                        var $3189 = self.entry;
                                        var $3190 = Litereum$World$new$($3187, $3188, Map$set$(Nat$show$($3169), _name$9, $3171), $3189);
                                        var _world$12 = $3190;
                                        break;
                                };
                                var $3178 = Maybe$some$(_world$12);
                                var $3175 = $3178;
                                break;
                            case 'Maybe.some':
                                var $3191 = Maybe$none;
                                var $3175 = $3191;
                                break;
                        };
                        var $3173 = $3175;
                        break;
                    case 'Litereum.Transaction.new_data':
                        var $3192 = self.data;
                        var _data$9 = $3192;
                        var self = _data$9;
                        switch (self._) {
                            case 'Litereum.Data.new':
                                var $3194 = self.name;
                                var self = Map$get$($3194, $3172);
                                switch (self._) {
                                    case 'Maybe.none':
                                        var self = _bipass$3;
                                        if (self) {
                                            var $3197 = Unit$new;
                                            var _logger$12 = $3197;
                                        } else {
                                            var $3198 = ((console.log(("- data " + $3194)), (_$12 => {
                                                var $3199 = Unit$new;
                                                return $3199;
                                            })()));
                                            var _logger$12 = $3198;
                                        };
                                        var self = _world$1;
                                        switch (self._) {
                                            case 'Litereum.World.new':
                                                var $3200 = self.name_count;
                                                var $3201 = self.name_to_index;
                                                var $3202 = self.index_to_name;
                                                var $3203 = Litereum$World$new$($3200, $3201, $3202, Map$set$($3194, Litereum$Entry$data$(_data$9), $3172));
                                                var _world$13 = $3203;
                                                break;
                                        };
                                        var $3196 = Maybe$some$(_world$13);
                                        var $3195 = $3196;
                                        break;
                                    case 'Maybe.some':
                                        var $3204 = Maybe$none;
                                        var $3195 = $3204;
                                        break;
                                };
                                var $3193 = $3195;
                                break;
                        };
                        var $3173 = $3193;
                        break;
                    case 'Litereum.Transaction.new_bond':
                        var $3205 = self.bond;
                        var _bond$9 = $3205;
                        var self = _bond$9;
                        switch (self._) {
                            case 'Litereum.Bond.new':
                                var $3207 = self.name;
                                var $3208 = self.input_names;
                                var $3209 = self.input_types;
                                var $3210 = self.output_type;
                                var $3211 = self.main;
                                var self = Map$get$($3207, $3172);
                                switch (self._) {
                                    case 'Maybe.none':
                                        var self = _world$1;
                                        switch (self._) {
                                            case 'Litereum.World.new':
                                                var $3214 = self.name_count;
                                                var $3215 = self.name_to_index;
                                                var $3216 = self.index_to_name;
                                                var $3217 = Litereum$World$new$($3214, $3215, $3216, Map$set$($3207, Litereum$Entry$bond$(_bond$9), $3172));
                                                var _world$16 = $3217;
                                                break;
                                        };
                                        var _context$17 = Litereum$extend$(Map$from_list$(List$nil), $3208, $3209);
                                        var self = _bipass$3;
                                        if (self) {
                                            var $3218 = Maybe$some$(_world$16);
                                            var $3213 = $3218;
                                        } else {
                                            var self = Litereum$check$(_context$17, _world$16, $3211, $3210);
                                            if (self) {
                                                var self = _bipass$3;
                                                if (self) {
                                                    var $3221 = Unit$new;
                                                    var _logger$18 = $3221;
                                                } else {
                                                    var $3222 = ((console.log(("- bond " + $3207)), (_$18 => {
                                                        var $3223 = Unit$new;
                                                        return $3223;
                                                    })()));
                                                    var _logger$18 = $3222;
                                                };
                                                var $3220 = Maybe$some$(_world$16);
                                                var $3219 = $3220;
                                            } else {
                                                var self = _bipass$3;
                                                if (self) {
                                                    var $3225 = Unit$new;
                                                    var _logger$18 = $3225;
                                                } else {
                                                    var $3226 = ((console.log(("- bond error: ill-typed bond " + $3207)), (_$18 => {
                                                        var $3227 = Unit$new;
                                                        return $3227;
                                                    })()));
                                                    var _logger$18 = $3226;
                                                };
                                                var $3224 = Maybe$none;
                                                var $3219 = $3224;
                                            };
                                            var $3213 = $3219;
                                        };
                                        var $3212 = $3213;
                                        break;
                                    case 'Maybe.some':
                                        var self = _bipass$3;
                                        if (self) {
                                            var $3229 = Unit$new;
                                            var _logger$17 = $3229;
                                        } else {
                                            var $3230 = ((console.log(("- bond error: redefinition of " + $3207)), (_$17 => {
                                                var $3231 = Unit$new;
                                                return $3231;
                                            })()));
                                            var _logger$17 = $3230;
                                        };
                                        var $3228 = Maybe$none;
                                        var $3212 = $3228;
                                        break;
                                };
                                var $3206 = $3212;
                                break;
                        };
                        var $3173 = $3206;
                        break;
                    case 'Litereum.Transaction.new_eval':
                        var $3232 = self.eval;
                        var _eval$9 = $3232;
                        var self = _eval$9;
                        switch (self._) {
                            case 'Litereum.Eval.new':
                                var $3234 = self.term;
                                var $3235 = self.type;
                                var self = _bipass$3;
                                if (self) {
                                    var $3237 = Maybe$some$(_world$1);
                                    var $3236 = $3237;
                                } else {
                                    var self = Litereum$check$(Map$from_list$(List$nil), _world$1, $3234, $3235);
                                    if (self) {
                                        var self = Litereum$normalize$(Litereum$Runtime$new$(_world$1, Map$from_list$(List$nil), 0n, 0n, $3234));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $3240 = self.world;
                                                var $3241 = self.term;
                                                var self = _bipass$3;
                                                if (self) {
                                                    var $3243 = Unit$new;
                                                    var _logger$17 = $3243;
                                                } else {
                                                    var $3244 = ((console.log(("- eval " + Litereum$show$term$($3240, $3241))), (_$17 => {
                                                        var $3245 = Unit$new;
                                                        return $3245;
                                                    })()));
                                                    var _logger$17 = $3244;
                                                };
                                                var $3242 = Maybe$some$($3240);
                                                var $3239 = $3242;
                                                break;
                                        };
                                        var $3238 = $3239;
                                    } else {
                                        var self = _bipass$3;
                                        if (self) {
                                            var $3247 = Unit$new;
                                            var _logger$12 = $3247;
                                        } else {
                                            var $3248 = ((console.log("- eval error: ill-typed term"), (_$12 => {
                                                var $3249 = Unit$new;
                                                return $3249;
                                            })()));
                                            var _logger$12 = $3248;
                                        };
                                        var $3246 = Maybe$none;
                                        var $3238 = $3246;
                                    };
                                    var $3236 = $3238;
                                };
                                var $3233 = $3236;
                                break;
                        };
                        var $3173 = $3233;
                        break;
                };
                var $3168 = $3173;
                break;
        };
        return $3168;
    };
    const Litereum$run = x0 => x1 => x2 => Litereum$run$(x0, x1, x2);

    function Litereum$reg$(_world$1, _transaction$2) {
        var $3250 = Maybe$default$(Litereum$run$(_world$1, _transaction$2, Bool$true), _world$1);
        return $3250;
    };
    const Litereum$reg = x0 => x1 => Litereum$reg$(x0, x1);

    function Litereum$parse$block$(_world$1) {
        var $3251 = Parser$choice(List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $3253 = self.err;
                    var _reply$8 = Litereum$parse$transaction$(_world$1)(_pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $3255 = self.err;
                            var self = $3253;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $3257 = self.value;
                                    var $3258 = Parser$Reply$error$(Parser$Error$combine$($3257, $3255));
                                    var $3256 = $3258;
                                    break;
                                case 'Maybe.none':
                                    var $3259 = Parser$Reply$error$($3255);
                                    var $3256 = $3259;
                                    break;
                            };
                            var $3254 = $3256;
                            break;
                        case 'Parser.Reply.value':
                            var $3260 = self.pst;
                            var $3261 = self.val;
                            var self = $3260;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $3263 = self.err;
                                    var $3264 = self.nam;
                                    var $3265 = self.ini;
                                    var $3266 = self.idx;
                                    var $3267 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($3253, $3263), $3264, $3265, $3266, $3267);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $3269 = self.err;
                                            var _reply$22 = Litereum$parse$block$(Litereum$reg$(_world$1, $3261))(_reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $3271 = self.err;
                                                    var self = $3269;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $3273 = self.value;
                                                            var $3274 = Parser$Reply$error$(Parser$Error$combine$($3273, $3271));
                                                            var $3272 = $3274;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $3275 = Parser$Reply$error$($3271);
                                                            var $3272 = $3275;
                                                            break;
                                                    };
                                                    var $3270 = $3272;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $3276 = self.pst;
                                                    var $3277 = self.val;
                                                    var self = $3276;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $3279 = self.err;
                                                            var $3280 = self.nam;
                                                            var $3281 = self.ini;
                                                            var $3282 = self.idx;
                                                            var $3283 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($3269, $3279), $3280, $3281, $3282, $3283);
                                                            var $3284 = Parser$Reply$value$(_reply$pst$30, List$cons$($3261, $3277));
                                                            var $3278 = $3284;
                                                            break;
                                                    };
                                                    var $3270 = $3278;
                                                    break;
                                            };
                                            var $3268 = $3270;
                                            break;
                                    };
                                    var $3262 = $3268;
                                    break;
                            };
                            var $3254 = $3262;
                            break;
                    };
                    var $3252 = $3254;
                    break;
            };
            return $3252;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $3286 = self.err;
                    var _reply$8 = Litereum$parse$ignore(_pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $3288 = self.err;
                            var self = $3286;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $3290 = self.value;
                                    var $3291 = Parser$Reply$error$(Parser$Error$combine$($3290, $3288));
                                    var $3289 = $3291;
                                    break;
                                case 'Maybe.none':
                                    var $3292 = Parser$Reply$error$($3288);
                                    var $3289 = $3292;
                                    break;
                            };
                            var $3287 = $3289;
                            break;
                        case 'Parser.Reply.value':
                            var $3293 = self.pst;
                            var self = $3293;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $3295 = self.err;
                                    var $3296 = self.nam;
                                    var $3297 = self.ini;
                                    var $3298 = self.idx;
                                    var $3299 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($3286, $3295), $3296, $3297, $3298, $3299);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $3301 = self.err;
                                            var _reply$22 = Parser$eof$(_reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $3303 = self.err;
                                                    var self = $3301;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $3305 = self.value;
                                                            var $3306 = Parser$Reply$error$(Parser$Error$combine$($3305, $3303));
                                                            var $3304 = $3306;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $3307 = Parser$Reply$error$($3303);
                                                            var $3304 = $3307;
                                                            break;
                                                    };
                                                    var $3302 = $3304;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $3308 = self.pst;
                                                    var self = $3308;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $3310 = self.err;
                                                            var $3311 = self.nam;
                                                            var $3312 = self.ini;
                                                            var $3313 = self.idx;
                                                            var $3314 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($3301, $3310), $3311, $3312, $3313, $3314);
                                                            var $3315 = Parser$Reply$value$(_reply$pst$30, List$nil);
                                                            var $3309 = $3315;
                                                            break;
                                                    };
                                                    var $3302 = $3309;
                                                    break;
                                            };
                                            var $3300 = $3302;
                                            break;
                                    };
                                    var $3294 = $3300;
                                    break;
                            };
                            var $3287 = $3294;
                            break;
                    };
                    var $3285 = $3287;
                    break;
            };
            return $3285;
        }), List$nil)));
        return $3251;
    };
    const Litereum$parse$block = x0 => Litereum$parse$block$(x0);

    function IO$(_A$1) {
        var $3316 = null;
        return $3316;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $3317 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $3317;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$end$(_value$2) {
        var $3318 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $3318;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$put_string$(_text$1) {
        var $3319 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $3320 = IO$end$(Unit$new);
            return $3320;
        }));
        return $3319;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function IO$print$(_text$1) {
        var $3321 = IO$put_string$((_text$1 + "\u{a}"));
        return $3321;
    };
    const IO$print = x0 => IO$print$(x0);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $3323 = self.value;
                var $3324 = _f$4($3323);
                var $3322 = $3324;
                break;
            case 'IO.ask':
                var $3325 = self.query;
                var $3326 = self.param;
                var $3327 = self.then;
                var $3328 = IO$ask$($3325, $3326, (_x$8 => {
                    var $3329 = IO$bind$($3327(_x$8), _f$4);
                    return $3329;
                }));
                var $3322 = $3328;
                break;
        };
        return $3322;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$monad$(_new$2) {
        var $3330 = _new$2(IO$bind)(IO$end);
        return $3330;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function Litereum$show$constructor$(_world$1, _constructor$2) {
        var self = _constructor$2;
        switch (self._) {
            case 'Litereum.Constructor.new':
                var $3332 = self.name;
                var $3333 = self.field_names;
                var $3334 = self.field_types;
                var _names$6 = $3333;
                var _types$7 = List$mapped$($3334, Litereum$show$type(_world$1));
                var _fields$8 = List$zip_with$((_name$8 => _type$9 => {
                    var $3336 = (_name$8 + (": " + _type$9));
                    return $3336;
                }), _names$6, _types$7);
                var $3335 = ($3332 + ("{" + (String$join$(", ", _fields$8) + "}")));
                var $3331 = $3335;
                break;
        };
        return $3331;
    };
    const Litereum$show$constructor = x0 => x1 => Litereum$show$constructor$(x0, x1);

    function Litereum$show$data$(_world$1, _data$2) {
        var self = _data$2;
        switch (self._) {
            case 'Litereum.Data.new':
                var $3338 = self.name;
                var $3339 = self.constructors;
                var $3340 = ($3338 + (" { " + (String$join$(", ", List$mapped$($3339, Litereum$show$constructor(_world$1))) + " }")));
                var $3337 = $3340;
                break;
        };
        return $3337;
    };
    const Litereum$show$data = x0 => x1 => Litereum$show$data$(x0, x1);

    function Litereum$show$bond$(_world$1, _bond$2) {
        var self = _bond$2;
        switch (self._) {
            case 'Litereum.Bond.new':
                var $3342 = self.name;
                var $3343 = self.input_names;
                var $3344 = self.input_types;
                var $3345 = self.output_type;
                var $3346 = self.main;
                var $3347 = self.owners;
                var $3348 = ($3342 + ("(" + (String$join$(",", List$zipped_with$($3343, $3344, (_name$9 => _type$10 => {
                    var $3349 = (_name$9 + (": " + Litereum$show$type$(_world$1, _type$10)));
                    return $3349;
                }))) + ("): " + (Litereum$show$type$(_world$1, $3345) + (" { " + (Litereum$show$term$(_world$1, $3346) + (" }" + (() => {
                    var self = $3347;
                    switch (self._) {
                        case 'List.nil':
                            var $3350 = "";
                            return $3350;
                        case 'List.cons':
                            var $3351 = (" " + String$join$(" ", List$map$(a1 => ("@" + a1), $3347)));
                            return $3351;
                    };
                })()))))))));
                var $3341 = $3348;
                break;
        };
        return $3341;
    };
    const Litereum$show$bond = x0 => x1 => Litereum$show$bond$(x0, x1);

    function Litereum$show$eval$(_world$1, _eval$2) {
        var self = _eval$2;
        switch (self._) {
            case 'Litereum.Eval.new':
                var $3353 = self.term;
                var $3354 = self.type;
                var _term$5 = Litereum$show$term$(_world$1, $3353);
                var _type$6 = Litereum$show$type$(_world$1, $3354);
                var $3355 = ("{" + (_term$5 + ("} : " + _type$6)));
                var $3352 = $3355;
                break;
        };
        return $3352;
    };
    const Litereum$show$eval = x0 => x1 => Litereum$show$eval$(x0, x1);

    function Litereum$show$transaction$(_world$1, _transaction$2) {
        var self = _transaction$2;
        switch (self._) {
            case 'Litereum.Transaction.new_name':
                var $3357 = self.name;
                var $3358 = ("name " + $3357);
                var $3356 = $3358;
                break;
            case 'Litereum.Transaction.new_data':
                var $3359 = self.data;
                var $3360 = ("type " + Litereum$show$data$(_world$1, $3359));
                var $3356 = $3360;
                break;
            case 'Litereum.Transaction.new_bond':
                var $3361 = self.bond;
                var $3362 = ("bond " + Litereum$show$bond$(_world$1, $3361));
                var $3356 = $3362;
                break;
            case 'Litereum.Transaction.new_eval':
                var $3363 = self.eval;
                var $3364 = ("eval " + Litereum$show$eval$(_world$1, $3363));
                var $3356 = $3364;
                break;
        };
        return $3356;
    };
    const Litereum$show$transaction = x0 => x1 => Litereum$show$transaction$(x0, x1);

    function Litereum$show$block$(_world$1, _block$2) {
        var self = _block$2;
        switch (self._) {
            case 'List.cons':
                var $3366 = self.head;
                var $3367 = self.tail;
                var _head$5 = Litereum$show$transaction$(_world$1, $3366);
                var _tail$6 = Litereum$show$block$(Litereum$reg$(_world$1, $3366), $3367);
                var $3368 = ("- " + (_head$5 + ("\u{a}" + _tail$6)));
                var $3365 = $3368;
                break;
            case 'List.nil':
                var $3369 = "";
                var $3365 = $3369;
                break;
        };
        return $3365;
    };
    const Litereum$show$block = x0 => x1 => Litereum$show$block$(x0, x1);
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');

    function U16$new$(_value$1) {
        var $3370 = word_to_u16(_value$1);
        return $3370;
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
            var $3372 = Bits$e;
            var $3371 = $3372;
        } else {
            var $3373 = (self - 1n);
            var self = ((_value$2 % 2n) === 0n);
            if (self) {
                var $3375 = (Litereum$serialize$fixlen$($3373, (_value$2 / 2n)) + '0');
                var $3374 = $3375;
            } else {
                var $3376 = (Litereum$serialize$fixlen$($3373, (_value$2 / 2n)) + '1');
                var $3374 = $3376;
            };
            var $3371 = $3374;
        };
        return $3371;
    };
    const Litereum$serialize$fixlen = x0 => x1 => Litereum$serialize$fixlen$(x0, x1);
    const U16$to_nat = a0 => (BigInt(a0));
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Litereum$serialize$name$new$(_name$1) {
        var self = _name$1;
        if (self.length === 0) {
            var $3378 = (Bits$e + '0');
            var $3377 = $3378;
        } else {
            var $3379 = self.charCodeAt(0);
            var $3380 = self.slice(1);
            var self = U16$btw$(48, $3379, 57);
            if (self) {
                var $3382 = (($3379 - 48) & 0xFFFF);
                var _numb$4 = $3382;
            } else {
                var self = U16$btw$(65, $3379, 90);
                if (self) {
                    var $3384 = (((($3379 - 65) & 0xFFFF) + 10) & 0xFFFF);
                    var $3383 = $3384;
                } else {
                    var self = U16$btw$(97, $3379, 122);
                    if (self) {
                        var $3386 = (((($3379 - 97) & 0xFFFF) + 36) & 0xFFFF);
                        var $3385 = $3386;
                    } else {
                        var self = U16$btw$(95, $3379, 95);
                        if (self) {
                            var $3388 = 62;
                            var $3387 = $3388;
                        } else {
                            var $3389 = 63;
                            var $3387 = $3389;
                        };
                        var $3385 = $3387;
                    };
                    var $3383 = $3385;
                };
                var _numb$4 = $3383;
            };
            var _head$5 = Litereum$serialize$fixlen$(6n, (BigInt(_numb$4)));
            var _tail$6 = Litereum$serialize$name$new$($3380);
            var $3381 = ((_tail$6 + _head$5) + '1');
            var $3377 = $3381;
        };
        return $3377;
    };
    const Litereum$serialize$name$new = x0 => Litereum$serialize$name$new$(x0);

    function Litereum$serialize$varlen$go$(_value$1) {
        var self = _value$1;
        if (self === 0n) {
            var $3391 = Bits$e;
            var $3390 = $3391;
        } else {
            var $3392 = (self - 1n);
            var self = (_value$1 === 1n);
            if (self) {
                var $3394 = (Bits$e + '0');
                var $3393 = $3394;
            } else {
                var self = ((_value$1 % 2n) === 0n);
                if (self) {
                    var $3396 = ((Litereum$serialize$varlen$go$((_value$1 / 2n)) + '0') + '1');
                    var $3395 = $3396;
                } else {
                    var $3397 = ((Litereum$serialize$varlen$go$((_value$1 / 2n)) + '1') + '1');
                    var $3395 = $3397;
                };
                var $3393 = $3395;
            };
            var $3390 = $3393;
        };
        return $3390;
    };
    const Litereum$serialize$varlen$go = x0 => Litereum$serialize$varlen$go$(x0);

    function Litereum$serialize$varlen$(_value$1) {
        var $3398 = Litereum$serialize$varlen$go$((_value$1 + 1n));
        return $3398;
    };
    const Litereum$serialize$varlen = x0 => Litereum$serialize$varlen$(x0);

    function Litereum$serialize$name$old$(_world$1, _name$2) {
        var self = _world$1;
        switch (self._) {
            case 'Litereum.World.new':
                var $3400 = self.name_to_index;
                var self = Map$get$(_name$2, $3400);
                switch (self._) {
                    case 'Maybe.some':
                        var $3402 = self.value;
                        var _bits$8 = Litereum$serialize$varlen$($3402);
                        var $3403 = _bits$8;
                        var $3401 = $3403;
                        break;
                    case 'Maybe.none':
                        var $3404 = Bits$e;
                        var $3401 = $3404;
                        break;
                };
                var $3399 = $3401;
                break;
        };
        return $3399;
    };
    const Litereum$serialize$name$old = x0 => x1 => Litereum$serialize$name$old$(x0, x1);

    function Litereum$serialize$list$(_item$2, _list$3) {
        var self = _list$3;
        switch (self._) {
            case 'List.cons':
                var $3406 = self.head;
                var $3407 = self.tail;
                var $3408 = ((Litereum$serialize$list$(_item$2, $3407) + _item$2($3406)) + '1');
                var $3405 = $3408;
                break;
            case 'List.nil':
                var $3409 = (Bits$e + '0');
                var $3405 = $3409;
                break;
        };
        return $3405;
    };
    const Litereum$serialize$list = x0 => x1 => Litereum$serialize$list$(x0, x1);

    function Litereum$serialize$type$(_world$1, _typ$2) {
        var self = _typ$2;
        switch (self._) {
            case 'Litereum.Type.data':
                var $3411 = self.name;
                var $3412 = (Litereum$serialize$name$old$(_world$1, $3411) + '1');
                var $3410 = $3412;
                break;
            case 'Litereum.Type.word':
                var $3413 = (Bits$e + '0');
                var $3410 = $3413;
                break;
        };
        return $3410;
    };
    const Litereum$serialize$type = x0 => x1 => Litereum$serialize$type$(x0, x1);

    function Litereum$serialize$constructor$(_world$1, _ctor$2) {
        var self = _ctor$2;
        switch (self._) {
            case 'Litereum.Constructor.new':
                var $3415 = self.name;
                var $3416 = self.field_names;
                var $3417 = self.field_types;
                var _name$6 = Litereum$serialize$name$old$(_world$1, $3415);
                var _nams$7 = Litereum$serialize$list$(Litereum$serialize$name$old(_world$1), $3416);
                var _typs$8 = Litereum$serialize$list$(Litereum$serialize$type(_world$1), $3417);
                var $3418 = ((_typs$8 + _nams$7) + _name$6);
                var $3414 = $3418;
                break;
        };
        return $3414;
    };
    const Litereum$serialize$constructor = x0 => x1 => Litereum$serialize$constructor$(x0, x1);

    function Litereum$serialize$data$(_world$1, _data$2) {
        var self = _data$2;
        switch (self._) {
            case 'Litereum.Data.new':
                var $3420 = self.name;
                var $3421 = self.constructors;
                var _name$5 = Litereum$serialize$name$old$(_world$1, $3420);
                var _ctrs$6 = Litereum$serialize$list$(Litereum$serialize$constructor(_world$1), $3421);
                var $3422 = (_ctrs$6 + _name$5);
                var $3419 = $3422;
                break;
        };
        return $3419;
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
                        var $3423 = self.head;
                        var $3424 = self.tail;
                        var self = _f$3($3423);
                        if (self) {
                            var $3426 = Maybe$some$(_i$4);
                            var $3425 = $3426;
                        } else {
                            var $3427 = List$find_index$go$($3424, _f$3, Nat$succ$(_i$4));
                            var $3425 = $3427;
                        };
                        return $3425;
                    case 'List.nil':
                        var $3428 = Maybe$none;
                        return $3428;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$find_index$go = x0 => x1 => x2 => List$find_index$go$(x0, x1, x2);

    function List$find_index$(_xs$2, _f$3) {
        var $3429 = List$find_index$go$(_xs$2, _f$3, Nat$zero);
        return $3429;
    };
    const List$find_index = x0 => x1 => List$find_index$(x0, x1);

    function Litereum$serialize$name$local$(_world$1, _vars$2, _name$3) {
        var self = List$find_index$(_vars$2, a1 => (_name$3 === a1));
        switch (self._) {
            case 'Maybe.some':
                var $3431 = self.value;
                var $3432 = Litereum$serialize$varlen$($3431);
                var $3430 = $3432;
                break;
            case 'Maybe.none':
                var $3433 = Bits$e;
                var $3430 = $3433;
                break;
        };
        return $3430;
    };
    const Litereum$serialize$name$local = x0 => x1 => x2 => Litereum$serialize$name$local$(x0, x1, x2);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $3435 = self.head;
                var $3436 = self.tail;
                var $3437 = List$cons$($3435, List$concat$($3436, _bs$3));
                var $3434 = $3437;
                break;
            case 'List.nil':
                var $3438 = _bs$3;
                var $3434 = $3438;
                break;
        };
        return $3434;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function Litereum$serialize$cases$(_world$1, _vars$2, _name$3, _ctors$4, _cases$5) {
        var self = _ctors$4;
        switch (self._) {
            case 'List.cons':
                var $3440 = self.head;
                var $3441 = self.tail;
                var self = _cases$5;
                switch (self._) {
                    case 'List.cons':
                        var $3443 = self.head;
                        var $3444 = self.tail;
                        var _flds$10 = List$map$(a1 => ((_name$3 + ".") + a1), (() => {
                            var self = $3440;
                            switch (self._) {
                                case 'Litereum.Constructor.new':
                                    var $3446 = self.field_names;
                                    var $3447 = $3446;
                                    return $3447;
                            };
                        })());
                        var _head$11 = Litereum$serialize$term$(_world$1, List$concat$(List$reverse$(_flds$10), _vars$2), $3443);
                        var _tail$12 = Litereum$serialize$cases$(_world$1, _vars$2, _name$3, $3441, $3444);
                        var $3445 = (_tail$12 + _head$11);
                        var $3442 = $3445;
                        break;
                    case 'List.nil':
                        var $3448 = Bits$e;
                        var $3442 = $3448;
                        break;
                };
                var $3439 = $3442;
                break;
            case 'List.nil':
                var self = _cases$5;
                switch (self._) {
                    case 'List.nil':
                    case 'List.cons':
                        var $3450 = Bits$e;
                        var $3449 = $3450;
                        break;
                };
                var $3439 = $3449;
                break;
        };
        return $3439;
    };
    const Litereum$serialize$cases = x0 => x1 => x2 => x3 => x4 => Litereum$serialize$cases$(x0, x1, x2, x3, x4);
    const U64$to_nat = a0 => (a0);

    function Litereum$serialize$term$(_world$1, _vars$2, _term$3) {
        var self = _term$3;
        switch (self._) {
            case 'Litereum.Term.var':
                var $3452 = self.name;
                var $3453 = (Litereum$serialize$name$local$(_world$1, _vars$2, $3452) + '0');
                var $3451 = $3453;
                break;
            case 'Litereum.Term.call':
                var $3454 = self.bond;
                var $3455 = self.args;
                var _bond$6 = Litereum$serialize$name$old$(_world$1, $3454);
                var _args$7 = Litereum$serialize$list$(Litereum$serialize$term(_world$1)(_vars$2), $3455);
                var $3456 = (((((_args$7 + _bond$6) + '0') + '0') + '1') + '1');
                var $3451 = $3456;
                break;
            case 'Litereum.Term.let':
                var $3457 = self.name;
                var $3458 = self.type;
                var $3459 = self.expr;
                var $3460 = self.body;
                var _name$8 = Litereum$serialize$name$old$(_world$1, $3457);
                var _type$9 = Litereum$serialize$type$(_world$1, $3458);
                var _expr$10 = Litereum$serialize$term$(_world$1, _vars$2, $3459);
                var _body$11 = Litereum$serialize$term$(_world$1, List$cons$($3457, _vars$2), $3460);
                var $3461 = (((((((_body$11 + _expr$10) + _type$9) + _name$8) + '0') + '0') + '0') + '1');
                var $3451 = $3461;
                break;
            case 'Litereum.Term.create':
                var $3462 = self.ctor;
                var $3463 = self.vals;
                var _ctor$6 = Litereum$serialize$name$old$(_world$1, $3462);
                var _vals$7 = Litereum$serialize$list$(Litereum$serialize$term(_world$1)(_vars$2), $3463);
                var $3464 = (((((_vals$7 + _ctor$6) + '0') + '1') + '0') + '1');
                var $3451 = $3464;
                break;
            case 'Litereum.Term.match':
                var $3465 = self.name;
                var $3466 = self.data;
                var $3467 = self.cses;
                var _name$7 = Litereum$serialize$name$local$(_world$1, _vars$2, $3465);
                var _data$8 = Litereum$serialize$name$old$(_world$1, $3466);
                var _cses$9 = Litereum$serialize$cases$(_world$1, _vars$2, $3465, Maybe$default$(Litereum$get_constructors$(_world$1, $3466), List$nil), $3467);
                var $3468 = ((((((_cses$9 + _data$8) + _name$7) + '0') + '1') + '1') + '1');
                var $3451 = $3468;
                break;
            case 'Litereum.Term.word':
                var $3469 = self.numb;
                var _numb$5 = Litereum$serialize$fixlen$(64n, ($3469));
                var $3470 = ((((_numb$5 + '1') + '0') + '0') + '1');
                var $3451 = $3470;
                break;
            case 'Litereum.Term.compare':
                var $3471 = self.val0;
                var $3472 = self.val1;
                var $3473 = self.iflt;
                var $3474 = self.ifeq;
                var $3475 = self.ifgt;
                var _val0$9 = Litereum$serialize$term$(_world$1, _vars$2, $3471);
                var _val1$10 = Litereum$serialize$term$(_world$1, _vars$2, $3472);
                var _iflt$11 = Litereum$serialize$term$(_world$1, _vars$2, $3473);
                var _ifeq$12 = Litereum$serialize$term$(_world$1, _vars$2, $3474);
                var _ifgt$13 = Litereum$serialize$term$(_world$1, _vars$2, $3475);
                var $3476 = ((((((((_ifgt$13 + _ifeq$12) + _iflt$11) + _val1$10) + _val0$9) + '1') + '0') + '1') + '1');
                var $3451 = $3476;
                break;
            case 'Litereum.Term.operate':
                var $3477 = self.oper;
                var $3478 = self.val0;
                var $3479 = self.val1;
                var _oper$7 = Litereum$serialize$fixlen$(3n, (() => {
                    var self = $3477;
                    switch (self._) {
                        case 'Litereum.Operation.add':
                            var $3481 = 0n;
                            return $3481;
                        case 'Litereum.Operation.sub':
                            var $3482 = 1n;
                            return $3482;
                        case 'Litereum.Operation.mul':
                            var $3483 = 2n;
                            return $3483;
                        case 'Litereum.Operation.div':
                            var $3484 = 3n;
                            return $3484;
                        case 'Litereum.Operation.mod':
                            var $3485 = 4n;
                            return $3485;
                        case 'Litereum.Operation.or':
                            var $3486 = 5n;
                            return $3486;
                        case 'Litereum.Operation.and':
                            var $3487 = 6n;
                            return $3487;
                        case 'Litereum.Operation.xor':
                            var $3488 = 7n;
                            return $3488;
                    };
                })());
                var _val0$8 = Litereum$serialize$term$(_world$1, _vars$2, $3478);
                var _val1$9 = Litereum$serialize$term$(_world$1, _vars$2, $3479);
                var $3480 = ((((((_val1$9 + _val0$8) + _oper$7) + '1') + '1') + '0') + '1');
                var $3451 = $3480;
                break;
            case 'Litereum.Term.bind':
                var $3489 = self.name;
                var $3490 = self.main;
                var $3491 = self.body;
                var self = Litereum$get_bond$(_world$1, $3489);
                switch (self._) {
                    case 'Maybe.some':
                        var $3493 = self.value;
                        var _bond$8 = $3493;
                        var self = _bond$8;
                        switch (self._) {
                            case 'Litereum.Bond.new':
                                var $3495 = self.input_names;
                                var _name$15 = Litereum$serialize$name$old$(_world$1, $3489);
                                var _vrs2$16 = List$concat$(List$reverse$($3495), _vars$2);
                                var _main$17 = Litereum$serialize$term$(_world$1, _vrs2$16, $3490);
                                var _body$18 = Litereum$serialize$term$(_world$1, _vars$2, $3491);
                                var $3496 = ((((((_body$18 + _main$17) + _name$15) + '1') + '1') + '1') + '1');
                                var $3494 = $3496;
                                break;
                        };
                        var $3492 = $3494;
                        break;
                    case 'Maybe.none':
                        var $3497 = Bits$e;
                        var $3492 = $3497;
                        break;
                };
                var $3451 = $3492;
                break;
        };
        return $3451;
    };
    const Litereum$serialize$term = x0 => x1 => x2 => Litereum$serialize$term$(x0, x1, x2);

    function Litereum$serialize$bond$(_world$1, _bond$2) {
        var self = _bond$2;
        switch (self._) {
            case 'Litereum.Bond.new':
                var $3499 = self.name;
                var $3500 = self.input_names;
                var $3501 = self.input_types;
                var $3502 = self.output_type;
                var $3503 = self.main;
                var $3504 = self.owners;
                var _name$9 = Litereum$serialize$name$old$(_world$1, $3499);
                var _input_names$10 = Litereum$serialize$list$(Litereum$serialize$name$old(_world$1), $3500);
                var _input_types$11 = Litereum$serialize$list$(Litereum$serialize$type(_world$1), $3501);
                var _output_type$12 = Litereum$serialize$type$(_world$1, $3502);
                var _main$13 = Litereum$serialize$term$(_world$1, List$reverse$($3500), $3503);
                var _owners$14 = Litereum$serialize$list$(Litereum$serialize$name$old(_world$1), $3504);
                var $3505 = (((((_owners$14 + _main$13) + _output_type$12) + _input_types$11) + _input_names$10) + _name$9);
                var $3498 = $3505;
                break;
        };
        return $3498;
    };
    const Litereum$serialize$bond = x0 => x1 => Litereum$serialize$bond$(x0, x1);

    function Litereum$serialize$eval$(_world$1, _eval$2) {
        var self = _eval$2;
        switch (self._) {
            case 'Litereum.Eval.new':
                var $3507 = self.term;
                var $3508 = self.type;
                var _term$5 = Litereum$serialize$term$(_world$1, List$nil, $3507);
                var _type$6 = Litereum$serialize$type$(_world$1, $3508);
                var $3509 = (_type$6 + _term$5);
                var $3506 = $3509;
                break;
        };
        return $3506;
    };
    const Litereum$serialize$eval = x0 => x1 => Litereum$serialize$eval$(x0, x1);

    function Litereum$serialize$transaction$(_world$1, _transaction$2) {
        var self = _transaction$2;
        switch (self._) {
            case 'Litereum.Transaction.new_name':
                var $3511 = self.name;
                var _name$4 = Litereum$serialize$name$new$($3511);
                var $3512 = ((_name$4 + '0') + '0');
                var $3510 = $3512;
                break;
            case 'Litereum.Transaction.new_data':
                var $3513 = self.data;
                var _data$4 = Litereum$serialize$data$(_world$1, $3513);
                var $3514 = ((_data$4 + '0') + '1');
                var $3510 = $3514;
                break;
            case 'Litereum.Transaction.new_bond':
                var $3515 = self.bond;
                var _bond$4 = Litereum$serialize$bond$(_world$1, $3515);
                var $3516 = ((_bond$4 + '1') + '0');
                var $3510 = $3516;
                break;
            case 'Litereum.Transaction.new_eval':
                var $3517 = self.eval;
                var _term$4 = Litereum$serialize$eval$(_world$1, $3517);
                var $3518 = ((_term$4 + '1') + '1');
                var $3510 = $3518;
                break;
        };
        return $3510;
    };
    const Litereum$serialize$transaction = x0 => x1 => Litereum$serialize$transaction$(x0, x1);

    function Litereum$serialize$block$(_world$1, _block$2) {
        var self = _block$2;
        switch (self._) {
            case 'List.cons':
                var $3520 = self.head;
                var $3521 = self.tail;
                var _head$5 = Litereum$serialize$transaction$(_world$1, $3520);
                var _tail$6 = Litereum$serialize$block$(Litereum$reg$(_world$1, $3520), $3521);
                var $3522 = (_tail$6 + _head$5);
                var $3519 = $3522;
                break;
            case 'List.nil':
                var $3523 = Bits$e;
                var $3519 = $3523;
                break;
        };
        return $3519;
    };
    const Litereum$serialize$block = x0 => x1 => Litereum$serialize$block$(x0, x1);

    function Bits$hex$encode$(_x$1) {
        var self = _x$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $3525 = self.slice(0, -1);
                var self = $3525;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $3527 = self.slice(0, -1);
                        var self = $3527;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $3529 = self.slice(0, -1);
                                var self = $3529;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3531 = self.slice(0, -1);
                                        var $3532 = ("0" + Bits$hex$encode$($3531));
                                        var $3530 = $3532;
                                        break;
                                    case 'i':
                                        var $3533 = self.slice(0, -1);
                                        var $3534 = ("8" + Bits$hex$encode$($3533));
                                        var $3530 = $3534;
                                        break;
                                    case 'e':
                                        var $3535 = "0";
                                        var $3530 = $3535;
                                        break;
                                };
                                var $3528 = $3530;
                                break;
                            case 'i':
                                var $3536 = self.slice(0, -1);
                                var self = $3536;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3538 = self.slice(0, -1);
                                        var $3539 = ("4" + Bits$hex$encode$($3538));
                                        var $3537 = $3539;
                                        break;
                                    case 'i':
                                        var $3540 = self.slice(0, -1);
                                        var $3541 = ("c" + Bits$hex$encode$($3540));
                                        var $3537 = $3541;
                                        break;
                                    case 'e':
                                        var $3542 = "4";
                                        var $3537 = $3542;
                                        break;
                                };
                                var $3528 = $3537;
                                break;
                            case 'e':
                                var $3543 = "0";
                                var $3528 = $3543;
                                break;
                        };
                        var $3526 = $3528;
                        break;
                    case 'i':
                        var $3544 = self.slice(0, -1);
                        var self = $3544;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $3546 = self.slice(0, -1);
                                var self = $3546;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3548 = self.slice(0, -1);
                                        var $3549 = ("2" + Bits$hex$encode$($3548));
                                        var $3547 = $3549;
                                        break;
                                    case 'i':
                                        var $3550 = self.slice(0, -1);
                                        var $3551 = ("a" + Bits$hex$encode$($3550));
                                        var $3547 = $3551;
                                        break;
                                    case 'e':
                                        var $3552 = "2";
                                        var $3547 = $3552;
                                        break;
                                };
                                var $3545 = $3547;
                                break;
                            case 'i':
                                var $3553 = self.slice(0, -1);
                                var self = $3553;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3555 = self.slice(0, -1);
                                        var $3556 = ("6" + Bits$hex$encode$($3555));
                                        var $3554 = $3556;
                                        break;
                                    case 'i':
                                        var $3557 = self.slice(0, -1);
                                        var $3558 = ("e" + Bits$hex$encode$($3557));
                                        var $3554 = $3558;
                                        break;
                                    case 'e':
                                        var $3559 = "6";
                                        var $3554 = $3559;
                                        break;
                                };
                                var $3545 = $3554;
                                break;
                            case 'e':
                                var $3560 = "2";
                                var $3545 = $3560;
                                break;
                        };
                        var $3526 = $3545;
                        break;
                    case 'e':
                        var $3561 = "0";
                        var $3526 = $3561;
                        break;
                };
                var $3524 = $3526;
                break;
            case 'i':
                var $3562 = self.slice(0, -1);
                var self = $3562;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $3564 = self.slice(0, -1);
                        var self = $3564;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $3566 = self.slice(0, -1);
                                var self = $3566;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3568 = self.slice(0, -1);
                                        var $3569 = ("1" + Bits$hex$encode$($3568));
                                        var $3567 = $3569;
                                        break;
                                    case 'i':
                                        var $3570 = self.slice(0, -1);
                                        var $3571 = ("9" + Bits$hex$encode$($3570));
                                        var $3567 = $3571;
                                        break;
                                    case 'e':
                                        var $3572 = "1";
                                        var $3567 = $3572;
                                        break;
                                };
                                var $3565 = $3567;
                                break;
                            case 'i':
                                var $3573 = self.slice(0, -1);
                                var self = $3573;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3575 = self.slice(0, -1);
                                        var $3576 = ("5" + Bits$hex$encode$($3575));
                                        var $3574 = $3576;
                                        break;
                                    case 'i':
                                        var $3577 = self.slice(0, -1);
                                        var $3578 = ("d" + Bits$hex$encode$($3577));
                                        var $3574 = $3578;
                                        break;
                                    case 'e':
                                        var $3579 = "5";
                                        var $3574 = $3579;
                                        break;
                                };
                                var $3565 = $3574;
                                break;
                            case 'e':
                                var $3580 = "1";
                                var $3565 = $3580;
                                break;
                        };
                        var $3563 = $3565;
                        break;
                    case 'i':
                        var $3581 = self.slice(0, -1);
                        var self = $3581;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $3583 = self.slice(0, -1);
                                var self = $3583;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3585 = self.slice(0, -1);
                                        var $3586 = ("3" + Bits$hex$encode$($3585));
                                        var $3584 = $3586;
                                        break;
                                    case 'i':
                                        var $3587 = self.slice(0, -1);
                                        var $3588 = ("b" + Bits$hex$encode$($3587));
                                        var $3584 = $3588;
                                        break;
                                    case 'e':
                                        var $3589 = "3";
                                        var $3584 = $3589;
                                        break;
                                };
                                var $3582 = $3584;
                                break;
                            case 'i':
                                var $3590 = self.slice(0, -1);
                                var self = $3590;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3592 = self.slice(0, -1);
                                        var $3593 = ("7" + Bits$hex$encode$($3592));
                                        var $3591 = $3593;
                                        break;
                                    case 'i':
                                        var $3594 = self.slice(0, -1);
                                        var $3595 = ("f" + Bits$hex$encode$($3594));
                                        var $3591 = $3595;
                                        break;
                                    case 'e':
                                        var $3596 = "7";
                                        var $3591 = $3596;
                                        break;
                                };
                                var $3582 = $3591;
                                break;
                            case 'e':
                                var $3597 = "3";
                                var $3582 = $3597;
                                break;
                        };
                        var $3563 = $3582;
                        break;
                    case 'e':
                        var $3598 = "1";
                        var $3563 = $3598;
                        break;
                };
                var $3524 = $3563;
                break;
            case 'e':
                var $3599 = "";
                var $3524 = $3599;
                break;
        };
        return $3524;
    };
    const Bits$hex$encode = x0 => Bits$hex$encode$(x0);

    function Bits$is_empty$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $3601 = Bool$true;
                var $3600 = $3601;
                break;
            case 'o':
            case 'i':
                var $3602 = Bool$false;
                var $3600 = $3602;
                break;
        };
        return $3600;
    };
    const Bits$is_empty = x0 => Bits$is_empty$(x0);

    function Litereum$deserialize$fixlen$(_size$1, _bits$2) {
        var self = _size$1;
        if (self === 0n) {
            var $3604 = Pair$new$(_bits$2, 0n);
            var $3603 = $3604;
        } else {
            var $3605 = (self - 1n);
            var self = _bits$2;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $3607 = self.slice(0, -1);
                    var self = Litereum$deserialize$fixlen$($3605, $3607);
                    switch (self._) {
                        case 'Pair.new':
                            var $3609 = self.fst;
                            var $3610 = self.snd;
                            var $3611 = Pair$new$($3609, ($3610 * 2n));
                            var $3608 = $3611;
                            break;
                    };
                    var $3606 = $3608;
                    break;
                case 'i':
                    var $3612 = self.slice(0, -1);
                    var self = Litereum$deserialize$fixlen$($3605, $3612);
                    switch (self._) {
                        case 'Pair.new':
                            var $3614 = self.fst;
                            var $3615 = self.snd;
                            var $3616 = Pair$new$($3614, (($3615 * 2n) + 1n));
                            var $3613 = $3616;
                            break;
                    };
                    var $3606 = $3613;
                    break;
                case 'e':
                    var $3617 = Pair$new$(Bits$e, 0n);
                    var $3606 = $3617;
                    break;
            };
            var $3603 = $3606;
        };
        return $3603;
    };
    const Litereum$deserialize$fixlen = x0 => x1 => Litereum$deserialize$fixlen$(x0, x1);
    const U16$from_nat = a0 => (Number(a0) & 0xFFFF);

    function Litereum$deserialize$name$new$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $3619 = self.slice(0, -1);
                var $3620 = Pair$new$($3619, "");
                var $3618 = $3620;
                break;
            case 'i':
                var $3621 = self.slice(0, -1);
                var self = Litereum$deserialize$fixlen$(6n, $3621);
                switch (self._) {
                    case 'Pair.new':
                        var $3623 = self.fst;
                        var $3624 = self.snd;
                        var self = Litereum$deserialize$name$new$($3623);
                        switch (self._) {
                            case 'Pair.new':
                                var $3626 = self.fst;
                                var $3627 = self.snd;
                                var _numb$7 = (Number($3624) & 0xFFFF);
                                var self = U16$btw$(0, _numb$7, 9);
                                if (self) {
                                    var $3629 = ((_numb$7 + 48) & 0xFFFF);
                                    var _head$8 = $3629;
                                } else {
                                    var self = U16$btw$(10, _numb$7, 35);
                                    if (self) {
                                        var $3631 = ((((_numb$7 - 10) & 0xFFFF) + 65) & 0xFFFF);
                                        var $3630 = $3631;
                                    } else {
                                        var self = U16$btw$(36, _numb$7, 61);
                                        if (self) {
                                            var $3633 = ((((_numb$7 - 36) & 0xFFFF) + 97) & 0xFFFF);
                                            var $3632 = $3633;
                                        } else {
                                            var self = U16$btw$(62, _numb$7, 62);
                                            if (self) {
                                                var $3635 = 95;
                                                var $3634 = $3635;
                                            } else {
                                                var $3636 = 46;
                                                var $3634 = $3636;
                                            };
                                            var $3632 = $3634;
                                        };
                                        var $3630 = $3632;
                                    };
                                    var _head$8 = $3630;
                                };
                                var $3628 = Pair$new$($3626, String$cons$(_head$8, $3627));
                                var $3625 = $3628;
                                break;
                        };
                        var $3622 = $3625;
                        break;
                };
                var $3618 = $3622;
                break;
            case 'e':
                var $3637 = Pair$new$(Bits$e, "");
                var $3618 = $3637;
                break;
        };
        return $3618;
    };
    const Litereum$deserialize$name$new = x0 => Litereum$deserialize$name$new$(x0);

    function Litereum$deserialize$varlen$go$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $3639 = self.slice(0, -1);
                var $3640 = Pair$new$($3639, 1n);
                var $3638 = $3640;
                break;
            case 'i':
                var $3641 = self.slice(0, -1);
                var self = $3641;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $3643 = self.slice(0, -1);
                        var self = Litereum$deserialize$varlen$go$($3643);
                        switch (self._) {
                            case 'Pair.new':
                                var $3645 = self.fst;
                                var $3646 = self.snd;
                                var $3647 = Pair$new$($3645, ($3646 * 2n));
                                var $3644 = $3647;
                                break;
                        };
                        var $3642 = $3644;
                        break;
                    case 'i':
                        var $3648 = self.slice(0, -1);
                        var self = Litereum$deserialize$varlen$go$($3648);
                        switch (self._) {
                            case 'Pair.new':
                                var $3650 = self.fst;
                                var $3651 = self.snd;
                                var $3652 = Pair$new$($3650, (($3651 * 2n) + 1n));
                                var $3649 = $3652;
                                break;
                        };
                        var $3642 = $3649;
                        break;
                    case 'e':
                        var $3653 = Pair$new$($3641, 0n);
                        var $3642 = $3653;
                        break;
                };
                var $3638 = $3642;
                break;
            case 'e':
                var $3654 = Pair$new$(Bits$e, 0n);
                var $3638 = $3654;
                break;
        };
        return $3638;
    };
    const Litereum$deserialize$varlen$go = x0 => Litereum$deserialize$varlen$go$(x0);

    function Litereum$deserialize$varlen$(_bits$1) {
        var self = Litereum$deserialize$varlen$go$(_bits$1);
        switch (self._) {
            case 'Pair.new':
                var $3656 = self.fst;
                var $3657 = self.snd;
                var $3658 = Pair$new$($3656, ($3657 - 1n <= 0n ? 0n : $3657 - 1n));
                var $3655 = $3658;
                break;
        };
        return $3655;
    };
    const Litereum$deserialize$varlen = x0 => Litereum$deserialize$varlen$(x0);

    function Litereum$deserialize$name$old$(_world$1, _bits$2) {
        var self = _world$1;
        switch (self._) {
            case 'Litereum.World.new':
                var $3660 = self.index_to_name;
                var self = Litereum$deserialize$varlen$(_bits$2);
                switch (self._) {
                    case 'Pair.new':
                        var $3662 = self.fst;
                        var $3663 = self.snd;
                        var self = Map$get$(Nat$show$($3663), $3660);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3665 = self.value;
                                var $3666 = Pair$new$($3662, $3665);
                                var $3664 = $3666;
                                break;
                            case 'Maybe.none':
                                var $3667 = Pair$new$($3662, "");
                                var $3664 = $3667;
                                break;
                        };
                        var $3661 = $3664;
                        break;
                };
                var $3659 = $3661;
                break;
        };
        return $3659;
    };
    const Litereum$deserialize$name$old = x0 => x1 => Litereum$deserialize$name$old$(x0, x1);

    function Litereum$deserialize$list$(_item$2, _bits$3) {
        var self = _bits$3;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $3669 = self.slice(0, -1);
                var $3670 = Pair$new$($3669, List$nil);
                var $3668 = $3670;
                break;
            case 'i':
                var $3671 = self.slice(0, -1);
                var self = _item$2($3671);
                switch (self._) {
                    case 'Pair.new':
                        var $3673 = self.fst;
                        var $3674 = self.snd;
                        var self = Litereum$deserialize$list$(_item$2, $3673);
                        switch (self._) {
                            case 'Pair.new':
                                var $3676 = self.fst;
                                var $3677 = self.snd;
                                var $3678 = Pair$new$($3676, List$cons$($3674, $3677));
                                var $3675 = $3678;
                                break;
                        };
                        var $3672 = $3675;
                        break;
                };
                var $3668 = $3672;
                break;
            case 'e':
                var $3679 = Pair$new$(Bits$e, List$nil);
                var $3668 = $3679;
                break;
        };
        return $3668;
    };
    const Litereum$deserialize$list = x0 => x1 => Litereum$deserialize$list$(x0, x1);

    function Litereum$deserialize$type$(_world$1, _bits$2) {
        var self = _bits$2;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $3681 = self.slice(0, -1);
                var $3682 = Pair$new$($3681, Litereum$Type$word);
                var $3680 = $3682;
                break;
            case 'i':
                var $3683 = self.slice(0, -1);
                var self = Litereum$deserialize$name$old$(_world$1, $3683);
                switch (self._) {
                    case 'Pair.new':
                        var $3685 = self.fst;
                        var $3686 = self.snd;
                        var $3687 = Pair$new$($3685, Litereum$Type$data$($3686));
                        var $3684 = $3687;
                        break;
                };
                var $3680 = $3684;
                break;
            case 'e':
                var $3688 = Pair$new$(_bits$2, Litereum$Type$word);
                var $3680 = $3688;
                break;
        };
        return $3680;
    };
    const Litereum$deserialize$type = x0 => x1 => Litereum$deserialize$type$(x0, x1);

    function Litereum$deserialize$constructor$(_world$1, _bits$2) {
        var self = Litereum$deserialize$name$old$(_world$1, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $3690 = self.fst;
                var $3691 = self.snd;
                var self = Litereum$deserialize$list$(Litereum$deserialize$name$old(_world$1), $3690);
                switch (self._) {
                    case 'Pair.new':
                        var $3693 = self.fst;
                        var $3694 = self.snd;
                        var self = Litereum$deserialize$list$(Litereum$deserialize$type(_world$1), $3693);
                        switch (self._) {
                            case 'Pair.new':
                                var $3696 = self.fst;
                                var $3697 = self.snd;
                                var $3698 = Pair$new$($3696, Litereum$Constructor$new$($3691, $3694, $3697));
                                var $3695 = $3698;
                                break;
                        };
                        var $3692 = $3695;
                        break;
                };
                var $3689 = $3692;
                break;
        };
        return $3689;
    };
    const Litereum$deserialize$constructor = x0 => x1 => Litereum$deserialize$constructor$(x0, x1);

    function Litereum$deserialize$data$(_world$1, _bits$2) {
        var self = Litereum$deserialize$name$old$(_world$1, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $3700 = self.fst;
                var $3701 = self.snd;
                var self = Litereum$deserialize$list$(Litereum$deserialize$constructor(_world$1), $3700);
                switch (self._) {
                    case 'Pair.new':
                        var $3703 = self.fst;
                        var $3704 = self.snd;
                        var $3705 = Pair$new$($3703, Litereum$Data$new$($3701, $3704));
                        var $3702 = $3705;
                        break;
                };
                var $3699 = $3702;
                break;
        };
        return $3699;
    };
    const Litereum$deserialize$data = x0 => x1 => Litereum$deserialize$data$(x0, x1);

    function Litereum$deserialize$name$local$(_world$1, _vars$2, _bits$3) {
        var self = Litereum$deserialize$varlen$(_bits$3);
        switch (self._) {
            case 'Pair.new':
                var $3707 = self.fst;
                var $3708 = self.snd;
                var $3709 = Pair$new$($3707, Maybe$default$(List$get$($3708, _vars$2), ""));
                var $3706 = $3709;
                break;
        };
        return $3706;
    };
    const Litereum$deserialize$name$local = x0 => x1 => x2 => Litereum$deserialize$name$local$(x0, x1, x2);

    function Litereum$deserialize$cases$(_world$1, _vars$2, _name$3, _ctors$4, _bits$5) {
        var self = _ctors$4;
        switch (self._) {
            case 'List.cons':
                var $3711 = self.head;
                var $3712 = self.tail;
                var _flds$8 = List$map$(a1 => ((_name$3 + ".") + a1), (() => {
                    var self = $3711;
                    switch (self._) {
                        case 'Litereum.Constructor.new':
                            var $3714 = self.field_names;
                            var $3715 = $3714;
                            return $3715;
                    };
                })());
                var self = Litereum$deserialize$term$(_world$1, List$concat$(List$reverse$(_flds$8), _vars$2), _bits$5);
                switch (self._) {
                    case 'Pair.new':
                        var $3716 = self.fst;
                        var $3717 = self.snd;
                        var self = Litereum$deserialize$cases$(_world$1, _vars$2, _name$3, $3712, $3716);
                        switch (self._) {
                            case 'Pair.new':
                                var $3719 = self.fst;
                                var $3720 = self.snd;
                                var $3721 = Pair$new$($3719, List$cons$($3717, $3720));
                                var $3718 = $3721;
                                break;
                        };
                        var $3713 = $3718;
                        break;
                };
                var $3710 = $3713;
                break;
            case 'List.nil':
                var $3722 = Pair$new$(_bits$5, List$nil);
                var $3710 = $3722;
                break;
        };
        return $3710;
    };
    const Litereum$deserialize$cases = x0 => x1 => x2 => x3 => x4 => Litereum$deserialize$cases$(x0, x1, x2, x3, x4);

    function Litereum$deserialize$term$(_world$1, _vars$2, _bits$3) {
        var self = _bits$3;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $3724 = self.slice(0, -1);
                var self = Litereum$deserialize$name$local$(_world$1, _vars$2, $3724);
                switch (self._) {
                    case 'Pair.new':
                        var $3726 = self.fst;
                        var $3727 = self.snd;
                        var $3728 = Pair$new$($3726, Litereum$Term$var$($3727));
                        var $3725 = $3728;
                        break;
                };
                var $3723 = $3725;
                break;
            case 'i':
                var $3729 = self.slice(0, -1);
                var self = Litereum$deserialize$fixlen$(3n, $3729);
                switch (self._) {
                    case 'Pair.new':
                        var $3731 = self.fst;
                        var $3732 = self.snd;
                        var self = ($3732 === 0n);
                        if (self) {
                            var self = Litereum$deserialize$name$old$(_world$1, $3731);
                            switch (self._) {
                                case 'Pair.new':
                                    var $3735 = self.fst;
                                    var $3736 = self.snd;
                                    var self = Litereum$deserialize$type$(_world$1, $3735);
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $3738 = self.fst;
                                            var $3739 = self.snd;
                                            var self = Litereum$deserialize$term$(_world$1, _vars$2, $3738);
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $3741 = self.fst;
                                                    var $3742 = self.snd;
                                                    var self = Litereum$deserialize$term$(_world$1, List$cons$($3736, _vars$2), $3741);
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $3744 = self.fst;
                                                            var $3745 = self.snd;
                                                            var $3746 = Pair$new$($3744, Litereum$Term$let$($3736, $3739, $3742, $3745));
                                                            var $3743 = $3746;
                                                            break;
                                                    };
                                                    var $3740 = $3743;
                                                    break;
                                            };
                                            var $3737 = $3740;
                                            break;
                                    };
                                    var $3734 = $3737;
                                    break;
                            };
                            var $3733 = $3734;
                        } else {
                            var self = ($3732 === 1n);
                            if (self) {
                                var self = Litereum$deserialize$name$old$(_world$1, $3731);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $3749 = self.fst;
                                        var $3750 = self.snd;
                                        var self = Litereum$deserialize$list$(Litereum$deserialize$term(_world$1)(_vars$2), $3749);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $3752 = self.fst;
                                                var $3753 = self.snd;
                                                var $3754 = Pair$new$($3752, Litereum$Term$call$($3750, $3753));
                                                var $3751 = $3754;
                                                break;
                                        };
                                        var $3748 = $3751;
                                        break;
                                };
                                var $3747 = $3748;
                            } else {
                                var self = ($3732 === 2n);
                                if (self) {
                                    var self = Litereum$deserialize$name$old$(_world$1, $3731);
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $3757 = self.fst;
                                            var $3758 = self.snd;
                                            var self = Litereum$deserialize$list$(Litereum$deserialize$term(_world$1)(_vars$2), $3757);
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $3760 = self.fst;
                                                    var $3761 = self.snd;
                                                    var $3762 = Pair$new$($3760, Litereum$Term$create$($3758, $3761));
                                                    var $3759 = $3762;
                                                    break;
                                            };
                                            var $3756 = $3759;
                                            break;
                                    };
                                    var $3755 = $3756;
                                } else {
                                    var self = ($3732 === 3n);
                                    if (self) {
                                        var self = Litereum$deserialize$name$local$(_world$1, _vars$2, $3731);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $3765 = self.fst;
                                                var $3766 = self.snd;
                                                var self = Litereum$deserialize$name$old$(_world$1, $3765);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3768 = self.fst;
                                                        var $3769 = self.snd;
                                                        var self = Litereum$deserialize$cases$(_world$1, _vars$2, $3766, Maybe$default$(Litereum$get_constructors$(_world$1, $3769), List$nil), $3768);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $3771 = self.fst;
                                                                var $3772 = self.snd;
                                                                var $3773 = Pair$new$($3771, Litereum$Term$match$($3766, $3769, $3772));
                                                                var $3770 = $3773;
                                                                break;
                                                        };
                                                        var $3767 = $3770;
                                                        break;
                                                };
                                                var $3764 = $3767;
                                                break;
                                        };
                                        var $3763 = $3764;
                                    } else {
                                        var self = ($3732 === 4n);
                                        if (self) {
                                            var self = Litereum$deserialize$fixlen$(64n, $3731);
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $3776 = self.fst;
                                                    var $3777 = self.snd;
                                                    var $3778 = Pair$new$($3776, Litereum$Term$word$(($3777 & 0xFFFFFFFFFFFFFFFFn)));
                                                    var $3775 = $3778;
                                                    break;
                                            };
                                            var $3774 = $3775;
                                        } else {
                                            var self = ($3732 === 5n);
                                            if (self) {
                                                var self = Litereum$deserialize$term$(_world$1, _vars$2, $3731);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3781 = self.fst;
                                                        var $3782 = self.snd;
                                                        var self = Litereum$deserialize$term$(_world$1, _vars$2, $3781);
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
                                                                                var self = Litereum$deserialize$term$(_world$1, _vars$2, $3790);
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $3793 = self.fst;
                                                                                        var $3794 = self.snd;
                                                                                        var $3795 = Pair$new$($3793, Litereum$Term$compare$($3782, $3785, $3788, $3791, $3794));
                                                                                        var $3792 = $3795;
                                                                                        break;
                                                                                };
                                                                                var $3789 = $3792;
                                                                                break;
                                                                        };
                                                                        var $3786 = $3789;
                                                                        break;
                                                                };
                                                                var $3783 = $3786;
                                                                break;
                                                        };
                                                        var $3780 = $3783;
                                                        break;
                                                };
                                                var $3779 = $3780;
                                            } else {
                                                var self = ($3732 === 6n);
                                                if (self) {
                                                    var self = Litereum$deserialize$fixlen$(3n, $3731);
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $3798 = self.fst;
                                                            var $3799 = self.snd;
                                                            var self = Litereum$deserialize$term$(_world$1, _vars$2, $3798);
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $3801 = self.fst;
                                                                    var $3802 = self.snd;
                                                                    var self = Litereum$deserialize$term$(_world$1, _vars$2, $3801);
                                                                    switch (self._) {
                                                                        case 'Pair.new':
                                                                            var $3804 = self.fst;
                                                                            var $3805 = self.snd;
                                                                            var self = ($3799 === 0n);
                                                                            if (self) {
                                                                                var $3807 = Litereum$Operation$add;
                                                                                var _oper$13 = $3807;
                                                                            } else {
                                                                                var self = ($3799 === 1n);
                                                                                if (self) {
                                                                                    var $3809 = Litereum$Operation$sub;
                                                                                    var $3808 = $3809;
                                                                                } else {
                                                                                    var self = ($3799 === 2n);
                                                                                    if (self) {
                                                                                        var $3811 = Litereum$Operation$mul;
                                                                                        var $3810 = $3811;
                                                                                    } else {
                                                                                        var self = ($3799 === 3n);
                                                                                        if (self) {
                                                                                            var $3813 = Litereum$Operation$div;
                                                                                            var $3812 = $3813;
                                                                                        } else {
                                                                                            var self = ($3799 === 4n);
                                                                                            if (self) {
                                                                                                var $3815 = Litereum$Operation$mod;
                                                                                                var $3814 = $3815;
                                                                                            } else {
                                                                                                var self = ($3799 === 5n);
                                                                                                if (self) {
                                                                                                    var $3817 = Litereum$Operation$or;
                                                                                                    var $3816 = $3817;
                                                                                                } else {
                                                                                                    var self = ($3799 === 6n);
                                                                                                    if (self) {
                                                                                                        var $3819 = Litereum$Operation$and;
                                                                                                        var $3818 = $3819;
                                                                                                    } else {
                                                                                                        var self = ($3799 === 7n);
                                                                                                        if (self) {
                                                                                                            var $3821 = Litereum$Operation$xor;
                                                                                                            var $3820 = $3821;
                                                                                                        } else {
                                                                                                            var $3822 = Litereum$Operation$add;
                                                                                                            var $3820 = $3822;
                                                                                                        };
                                                                                                        var $3818 = $3820;
                                                                                                    };
                                                                                                    var $3816 = $3818;
                                                                                                };
                                                                                                var $3814 = $3816;
                                                                                            };
                                                                                            var $3812 = $3814;
                                                                                        };
                                                                                        var $3810 = $3812;
                                                                                    };
                                                                                    var $3808 = $3810;
                                                                                };
                                                                                var _oper$13 = $3808;
                                                                            };
                                                                            var $3806 = Pair$new$($3804, Litereum$Term$operate$(_oper$13, $3802, $3805));
                                                                            var $3803 = $3806;
                                                                            break;
                                                                    };
                                                                    var $3800 = $3803;
                                                                    break;
                                                            };
                                                            var $3797 = $3800;
                                                            break;
                                                    };
                                                    var $3796 = $3797;
                                                } else {
                                                    var self = ($3732 === 7n);
                                                    if (self) {
                                                        var self = Litereum$deserialize$name$old$(_world$1, $3731);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $3825 = self.fst;
                                                                var $3826 = self.snd;
                                                                var self = Litereum$get_bond$(_world$1, $3826);
                                                                switch (self._) {
                                                                    case 'Maybe.some':
                                                                        var $3828 = self.value;
                                                                        var _bond$10 = $3828;
                                                                        var self = _bond$10;
                                                                        switch (self._) {
                                                                            case 'Litereum.Bond.new':
                                                                                var $3830 = self.input_names;
                                                                                var _vrs2$17 = List$concat$(List$reverse$($3830), _vars$2);
                                                                                var self = Litereum$deserialize$term$(_world$1, _vrs2$17, $3825);
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $3832 = self.fst;
                                                                                        var $3833 = self.snd;
                                                                                        var self = Litereum$deserialize$term$(_world$1, _vars$2, $3832);
                                                                                        switch (self._) {
                                                                                            case 'Pair.new':
                                                                                                var $3835 = self.fst;
                                                                                                var $3836 = self.snd;
                                                                                                var $3837 = Pair$new$($3835, Litereum$Term$bind$($3826, $3833, $3836));
                                                                                                var $3834 = $3837;
                                                                                                break;
                                                                                        };
                                                                                        var $3831 = $3834;
                                                                                        break;
                                                                                };
                                                                                var $3829 = $3831;
                                                                                break;
                                                                        };
                                                                        var $3827 = $3829;
                                                                        break;
                                                                    case 'Maybe.none':
                                                                        var $3838 = Pair$new$($3825, Litereum$Term$word$(0n));
                                                                        var $3827 = $3838;
                                                                        break;
                                                                };
                                                                var $3824 = $3827;
                                                                break;
                                                        };
                                                        var $3823 = $3824;
                                                    } else {
                                                        var $3839 = Pair$new$($3731, Litereum$Term$word$(0n));
                                                        var $3823 = $3839;
                                                    };
                                                    var $3796 = $3823;
                                                };
                                                var $3779 = $3796;
                                            };
                                            var $3774 = $3779;
                                        };
                                        var $3763 = $3774;
                                    };
                                    var $3755 = $3763;
                                };
                                var $3747 = $3755;
                            };
                            var $3733 = $3747;
                        };
                        var $3730 = $3733;
                        break;
                };
                var $3723 = $3730;
                break;
            case 'e':
                var $3840 = Pair$new$(_bits$3, Litereum$Term$word$(0n));
                var $3723 = $3840;
                break;
        };
        return $3723;
    };
    const Litereum$deserialize$term = x0 => x1 => x2 => Litereum$deserialize$term$(x0, x1, x2);

    function Litereum$deserialize$bond$(_world$1, _bits$2) {
        var self = Litereum$deserialize$name$old$(_world$1, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $3842 = self.fst;
                var $3843 = self.snd;
                var self = Litereum$deserialize$list$(Litereum$deserialize$name$old(_world$1), $3842);
                switch (self._) {
                    case 'Pair.new':
                        var $3845 = self.fst;
                        var $3846 = self.snd;
                        var self = Litereum$deserialize$list$(Litereum$deserialize$type(_world$1), $3845);
                        switch (self._) {
                            case 'Pair.new':
                                var $3848 = self.fst;
                                var $3849 = self.snd;
                                var self = Litereum$deserialize$type$(_world$1, $3848);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $3851 = self.fst;
                                        var $3852 = self.snd;
                                        var self = Litereum$deserialize$term$(_world$1, List$reverse$($3846), $3851);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $3854 = self.fst;
                                                var $3855 = self.snd;
                                                var self = Litereum$deserialize$list$(Litereum$deserialize$name$old(_world$1), $3854);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3857 = self.fst;
                                                        var $3858 = self.snd;
                                                        var $3859 = Pair$new$($3857, Litereum$Bond$new$($3843, $3846, $3849, $3852, $3855, $3858));
                                                        var $3856 = $3859;
                                                        break;
                                                };
                                                var $3853 = $3856;
                                                break;
                                        };
                                        var $3850 = $3853;
                                        break;
                                };
                                var $3847 = $3850;
                                break;
                        };
                        var $3844 = $3847;
                        break;
                };
                var $3841 = $3844;
                break;
        };
        return $3841;
    };
    const Litereum$deserialize$bond = x0 => x1 => Litereum$deserialize$bond$(x0, x1);

    function Litereum$deserialize$eval$(_world$1, _bits$2) {
        var self = Litereum$deserialize$term$(_world$1, List$nil, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $3861 = self.fst;
                var $3862 = self.snd;
                var self = Litereum$deserialize$type$(_world$1, $3861);
                switch (self._) {
                    case 'Pair.new':
                        var $3864 = self.fst;
                        var $3865 = self.snd;
                        var $3866 = Pair$new$($3864, Litereum$Eval$new$($3862, $3865));
                        var $3863 = $3866;
                        break;
                };
                var $3860 = $3863;
                break;
        };
        return $3860;
    };
    const Litereum$deserialize$eval = x0 => x1 => Litereum$deserialize$eval$(x0, x1);

    function Litereum$deserialize$transaction$(_world$1, _bits$2) {
        var self = Litereum$deserialize$fixlen$(2n, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $3868 = self.fst;
                var $3869 = self.snd;
                var self = ($3869 === 0n);
                if (self) {
                    var self = Litereum$deserialize$name$new$($3868);
                    switch (self._) {
                        case 'Pair.new':
                            var $3872 = self.fst;
                            var $3873 = self.snd;
                            var $3874 = Pair$new$($3872, Litereum$Transaction$new_name$($3873));
                            var $3871 = $3874;
                            break;
                    };
                    var $3870 = $3871;
                } else {
                    var self = ($3869 === 1n);
                    if (self) {
                        var self = Litereum$deserialize$data$(_world$1, $3868);
                        switch (self._) {
                            case 'Pair.new':
                                var $3877 = self.fst;
                                var $3878 = self.snd;
                                var $3879 = Pair$new$($3877, Litereum$Transaction$new_data$($3878));
                                var $3876 = $3879;
                                break;
                        };
                        var $3875 = $3876;
                    } else {
                        var self = ($3869 === 2n);
                        if (self) {
                            var self = Litereum$deserialize$bond$(_world$1, $3868);
                            switch (self._) {
                                case 'Pair.new':
                                    var $3882 = self.fst;
                                    var $3883 = self.snd;
                                    var $3884 = Pair$new$($3882, Litereum$Transaction$new_bond$($3883));
                                    var $3881 = $3884;
                                    break;
                            };
                            var $3880 = $3881;
                        } else {
                            var self = ($3869 === 3n);
                            if (self) {
                                var self = Litereum$deserialize$eval$(_world$1, $3868);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $3887 = self.fst;
                                        var $3888 = self.snd;
                                        var $3889 = Pair$new$($3887, Litereum$Transaction$new_eval$($3888));
                                        var $3886 = $3889;
                                        break;
                                };
                                var $3885 = $3886;
                            } else {
                                var $3890 = Pair$new$($3868, Litereum$Transaction$new_name$(""));
                                var $3885 = $3890;
                            };
                            var $3880 = $3885;
                        };
                        var $3875 = $3880;
                    };
                    var $3870 = $3875;
                };
                var $3867 = $3870;
                break;
        };
        return $3867;
    };
    const Litereum$deserialize$transaction = x0 => x1 => Litereum$deserialize$transaction$(x0, x1);

    function Litereum$deserialize$block$(_world$1, _bits$2) {
        var self = Bits$is_empty$(_bits$2);
        if (self) {
            var $3892 = Pair$new$(Bits$e, List$nil);
            var $3891 = $3892;
        } else {
            var self = Litereum$deserialize$transaction$(_world$1, _bits$2);
            switch (self._) {
                case 'Pair.new':
                    var $3894 = self.fst;
                    var $3895 = self.snd;
                    var self = Litereum$deserialize$block$(Litereum$reg$(_world$1, $3895), $3894);
                    switch (self._) {
                        case 'Pair.new':
                            var $3897 = self.fst;
                            var $3898 = self.snd;
                            var $3899 = Pair$new$($3897, List$cons$($3895, $3898));
                            var $3896 = $3899;
                            break;
                    };
                    var $3893 = $3896;
                    break;
            };
            var $3891 = $3893;
        };
        return $3891;
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
                        var $3900 = self.head;
                        var $3901 = self.tail;
                        var self = Litereum$run$(_world$1, $3900, Bool$false);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3903 = self.value;
                                var $3904 = Litereum$run$block$($3903, $3901);
                                var $3902 = $3904;
                                break;
                            case 'Maybe.none':
                                var $3905 = Maybe$none;
                                var $3902 = $3905;
                                break;
                        };
                        return $3902;
                    case 'List.nil':
                        var $3906 = Maybe$some$(_world$1);
                        return $3906;
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
                var $3908 = self.value;
                var $3909 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                    var $3910 = _m$bind$4;
                    return $3910;
                }))(IO$print$("Block: "))((_$4 => {
                    var $3911 = IO$monad$((_m$bind$5 => _m$pure$6 => {
                        var $3912 = _m$bind$5;
                        return $3912;
                    }))(IO$print$(Litereum$show$block$(_world$2, $3908)))((_$5 => {
                        var $3913 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                            var $3914 = _m$bind$6;
                            return $3914;
                        }))(IO$print$("Serialization:"))((_$6 => {
                            var _bits$7 = Litereum$serialize$block$(Litereum$genesis, $3908);
                            var $3915 = IO$monad$((_m$bind$8 => _m$pure$9 => {
                                var $3916 = _m$bind$8;
                                return $3916;
                            }))(IO$print$(("- " + Bits$hex$encode$(_bits$7))))((_$8 => {
                                var $3917 = IO$monad$((_m$bind$9 => _m$pure$10 => {
                                    var $3918 = _m$bind$9;
                                    return $3918;
                                }))(IO$print$(""))((_$9 => {
                                    var $3919 = IO$monad$((_m$bind$10 => _m$pure$11 => {
                                        var $3920 = _m$bind$10;
                                        return $3920;
                                    }))(IO$print$("Deserialization:"))((_$10 => {
                                        var self = Litereum$deserialize$block$(Litereum$genesis, _bits$7);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $3922 = self.snd;
                                                var $3923 = IO$monad$((_m$bind$13 => _m$pure$14 => {
                                                    var $3924 = _m$bind$13;
                                                    return $3924;
                                                }))(IO$print$(Litereum$show$block$(Litereum$genesis, $3922)))((_$13 => {
                                                    var $3925 = ((console.log("Evaluation: "), (_$14 => {
                                                        var self = Litereum$run$block$(_world$2, $3922);
                                                        switch (self._) {
                                                            case 'Maybe.none':
                                                                var $3927 = IO$print$("failed execution");
                                                                var $3926 = $3927;
                                                                break;
                                                            case 'Maybe.some':
                                                                var $3928 = IO$monad$((_m$bind$16 => _m$pure$17 => {
                                                                    var $3929 = _m$bind$16;
                                                                    return $3929;
                                                                }))(IO$print$(""))((_$16 => {
                                                                    var $3930 = IO$print$("Done!");
                                                                    return $3930;
                                                                }));
                                                                var $3926 = $3928;
                                                                break;
                                                        };
                                                        return $3926;
                                                    })()));
                                                    return $3925;
                                                }));
                                                var $3921 = $3923;
                                                break;
                                        };
                                        return $3921;
                                    }));
                                    return $3919;
                                }));
                                return $3917;
                            }));
                            return $3915;
                        }));
                        return $3913;
                    }));
                    return $3911;
                }));
                var $3907 = $3909;
                break;
            case 'Maybe.none':
                var $3931 = IO$print$("Invalid block syntax.");
                var $3907 = $3931;
                break;
        };
        return $3907;
    };
    const Litereum$api$run_block = x0 => Litereum$api$run_block$(x0);
    const Litereum = Litereum$api$run_block$("\u{a}    name Bool\u{a}    name true\u{a}    name false\u{a}    name Nat\u{a}    name zero\u{a}    name succ\u{a}    name pred\u{a}    name x\u{a}    name y\u{a}    name not\u{a}    name and\u{a}    name or\u{a}    name double\u{a}    name get_count\u{a}    name inc_count\u{a}\u{a}    eval {\u{a}      #50\u{a}    } : #word\u{a}\u{a}    type Bool {\u{a}      true{}\u{a}      false{}\u{a}    }\u{a}\u{a}    type Nat {\u{a}      zero{}\u{a}      succ{pred: Nat}\u{a}    }\u{a}\u{a}    eval {\u{a}      +(#10, #20)\u{a}    } : #word\u{a}\u{a}    bond and(x: Bool, y: Bool): Bool {\u{a}      case x : Bool {\u{a}        true: y\u{a}        false: false{}\u{a}      }\u{a}    }\u{a}\u{a}    eval {\u{a}      and(true{}, false{})\u{a}    } : Bool\u{a}\u{a}    bond double(x: Nat): Nat {\u{a}      case x : Nat {\u{a}        zero: zero{}\u{a}        succ: succ{succ{double(x.pred)}}\u{a}      }\u{a}    }\u{a}\u{a}    eval {\u{a}      double(succ{succ{succ{zero{}}}})\u{a}    } : Nat\u{a}\u{a}    bond get_count(): #word {\u{a}      #0\u{a}    } @inc_count\u{a}\u{a}    bond inc_count(): #word {\u{a}      bind get_count {\u{a}        +(get_count(), #1)\u{a}      }\u{a}      #0\u{a}    }\u{a}\u{a}    eval { inc_count() } : #word\u{a}    eval { inc_count() } : #word\u{a}    eval { inc_count() } : #word\u{a}    eval { get_count() } : #word\u{a}  ");
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
