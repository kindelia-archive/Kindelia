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

    function List$cons$(_head$2, _tail$3) {
        var $237 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $237;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function Pair$(_A$1, _B$2) {
        var $238 = null;
        return $238;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Pair$new$(_fst$3, _snd$4) {
        var $239 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $239;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);
    const List$nil = ({
        _: 'List.nil'
    });
    const Litereum$genesis = Litereum$World$new$(1n, Map$from_list$(List$cons$(Pair$new$("", 0n), List$nil)), Map$from_list$(List$cons$(Pair$new$("0", ""), List$nil)), Map$from_list$(List$nil));

    function Parser$State$new$(_err$1, _nam$2, _ini$3, _idx$4, _str$5) {
        var $240 = ({
            _: 'Parser.State.new',
            'err': _err$1,
            'nam': _nam$2,
            'ini': _ini$3,
            'idx': _idx$4,
            'str': _str$5
        });
        return $240;
    };
    const Parser$State$new = x0 => x1 => x2 => x3 => x4 => Parser$State$new$(x0, x1, x2, x3, x4);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function Maybe$(_A$1) {
        var $241 = null;
        return $241;
    };
    const Maybe = x0 => Maybe$(x0);

    function Maybe$some$(_value$2) {
        var $242 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $242;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

    function Parser$run$(_parser$2, _code$3) {
        var self = _parser$2(Parser$State$new$(Maybe$none, "", 0n, 0n, _code$3));
        switch (self._) {
            case 'Parser.Reply.value':
                var $244 = self.val;
                var $245 = Maybe$some$($244);
                var $243 = $245;
                break;
            case 'Parser.Reply.error':
                var $246 = Maybe$none;
                var $243 = $246;
                break;
        };
        return $243;
    };
    const Parser$run = x0 => x1 => Parser$run$(x0, x1);

    function List$(_A$1) {
        var $247 = null;
        return $247;
    };
    const List = x0 => List$(x0);

    function Parser$Reply$(_V$1) {
        var $248 = null;
        return $248;
    };
    const Parser$Reply = x0 => Parser$Reply$(x0);

    function Parser$Reply$error$(_err$2) {
        var $249 = ({
            _: 'Parser.Reply.error',
            'err': _err$2
        });
        return $249;
    };
    const Parser$Reply$error = x0 => Parser$Reply$error$(x0);

    function Parser$Error$new$(_nam$1, _ini$2, _idx$3, _msg$4) {
        var $250 = ({
            _: 'Parser.Error.new',
            'nam': _nam$1,
            'ini': _ini$2,
            'idx': _idx$3,
            'msg': _msg$4
        });
        return $250;
    };
    const Parser$Error$new = x0 => x1 => x2 => x3 => Parser$Error$new$(x0, x1, x2, x3);

    function Parser$Reply$fail$(_nam$2, _ini$3, _idx$4, _msg$5) {
        var $251 = Parser$Reply$error$(Parser$Error$new$(_nam$2, _ini$3, _idx$4, _msg$5));
        return $251;
    };
    const Parser$Reply$fail = x0 => x1 => x2 => x3 => Parser$Reply$fail$(x0, x1, x2, x3);
    const Nat$gtn = a0 => a1 => (a0 > a1);

    function Parser$Error$combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Parser.Error.new':
                var $253 = self.idx;
                var self = _b$2;
                switch (self._) {
                    case 'Parser.Error.new':
                        var $255 = self.idx;
                        var self = ($253 > $255);
                        if (self) {
                            var $257 = _a$1;
                            var $256 = $257;
                        } else {
                            var $258 = _b$2;
                            var $256 = $258;
                        };
                        var $254 = $256;
                        break;
                };
                var $252 = $254;
                break;
        };
        return $252;
    };
    const Parser$Error$combine = x0 => x1 => Parser$Error$combine$(x0, x1);

    function Parser$Error$maybe_combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Maybe.some':
                var $260 = self.value;
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.some':
                        var $262 = self.value;
                        var $263 = Maybe$some$(Parser$Error$combine$($260, $262));
                        var $261 = $263;
                        break;
                    case 'Maybe.none':
                        var $264 = _a$1;
                        var $261 = $264;
                        break;
                };
                var $259 = $261;
                break;
            case 'Maybe.none':
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.none':
                        var $266 = Maybe$none;
                        var $265 = $266;
                        break;
                    case 'Maybe.some':
                        var $267 = _b$2;
                        var $265 = $267;
                        break;
                };
                var $259 = $265;
                break;
        };
        return $259;
    };
    const Parser$Error$maybe_combine = x0 => x1 => Parser$Error$maybe_combine$(x0, x1);

    function Parser$Reply$value$(_pst$2, _val$3) {
        var $268 = ({
            _: 'Parser.Reply.value',
            'pst': _pst$2,
            'val': _val$3
        });
        return $268;
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
                        var $269 = self.err;
                        var $270 = self.nam;
                        var $271 = self.ini;
                        var $272 = self.idx;
                        var $273 = self.str;
                        var self = _pars$2;
                        switch (self._) {
                            case 'List.cons':
                                var $275 = self.head;
                                var $276 = self.tail;
                                var _parsed$11 = $275(_pst$3);
                                var self = _parsed$11;
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $278 = self.err;
                                        var _cur_err$13 = Maybe$some$($278);
                                        var _far_err$14 = Parser$Error$maybe_combine$($269, _cur_err$13);
                                        var _new_pst$15 = Parser$State$new$(_far_err$14, $270, $271, $272, $273);
                                        var $279 = Parser$choice$($276, _new_pst$15);
                                        var $277 = $279;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $280 = self.pst;
                                        var $281 = self.val;
                                        var $282 = Parser$Reply$value$($280, $281);
                                        var $277 = $282;
                                        break;
                                };
                                var $274 = $277;
                                break;
                            case 'List.nil':
                                var self = $269;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $284 = self.value;
                                        var $285 = Parser$Reply$error$($284);
                                        var $283 = $285;
                                        break;
                                    case 'Maybe.none':
                                        var $286 = Parser$Reply$fail$($270, $271, $272, "No parse.");
                                        var $283 = $286;
                                        break;
                                };
                                var $274 = $283;
                                break;
                        };
                        return $274;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$choice = x0 => x1 => Parser$choice$(x0, x1);

    function Parser$(_V$1) {
        var $287 = null;
        return $287;
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
                                var $289 = self.pst;
                                var $290 = self.val;
                                var $291 = Parser$many$go$(_parse$2, (_xs$12 => {
                                    var $292 = _values$3(List$cons$($290, _xs$12));
                                    return $292;
                                }), $289);
                                var $288 = $291;
                                break;
                            case 'Parser.Reply.error':
                                var $293 = Parser$Reply$value$(_pst$4, _values$3(List$nil));
                                var $288 = $293;
                                break;
                        };
                        return $288;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$many$go = x0 => x1 => x2 => Parser$many$go$(x0, x1, x2);

    function Parser$many$(_parser$2) {
        var $294 = Parser$many$go(_parser$2)((_x$3 => {
            var $295 = _x$3;
            return $295;
        }));
        return $294;
    };
    const Parser$many = x0 => Parser$many$(x0);
    const Unit$new = null;

    function String$cons$(_head$1, _tail$2) {
        var $296 = (String.fromCharCode(_head$1) + _tail$2);
        return $296;
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
                        var $297 = self.err;
                        var $298 = self.nam;
                        var $299 = self.ini;
                        var $300 = self.idx;
                        var $301 = self.str;
                        var self = _text$3;
                        if (self.length === 0) {
                            var $303 = Parser$Reply$value$(_pst$4, Unit$new);
                            var $302 = $303;
                        } else {
                            var $304 = self.charCodeAt(0);
                            var $305 = self.slice(1);
                            var self = $301;
                            if (self.length === 0) {
                                var _error_msg$12 = ("Expected \'" + (_ini_txt$2 + "\', found end of file."));
                                var $307 = Parser$Reply$fail$($298, $299, _ini_idx$1, _error_msg$12);
                                var $306 = $307;
                            } else {
                                var $308 = self.charCodeAt(0);
                                var $309 = self.slice(1);
                                var self = ($304 === $308);
                                if (self) {
                                    var _pst$14 = Parser$State$new$($297, $298, $299, Nat$succ$($300), $309);
                                    var $311 = Parser$text$go$(_ini_idx$1, _ini_txt$2, $305, _pst$14);
                                    var $310 = $311;
                                } else {
                                    var _chr$14 = String$cons$($308, String$nil);
                                    var _err$15 = ("Expected \'" + (_ini_txt$2 + ("\', found \'" + (_chr$14 + "\'."))));
                                    var $312 = Parser$Reply$fail$($298, $299, _ini_idx$1, _err$15);
                                    var $310 = $312;
                                };
                                var $306 = $310;
                            };
                            var $302 = $306;
                        };
                        return $302;
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
                var $314 = self.idx;
                var self = Parser$text$go$($314, _text$1, _text$1, _pst$2);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $316 = self.err;
                        var $317 = Parser$Reply$error$($316);
                        var $315 = $317;
                        break;
                    case 'Parser.Reply.value':
                        var $318 = self.pst;
                        var $319 = self.val;
                        var $320 = Parser$Reply$value$($318, $319);
                        var $315 = $320;
                        break;
                };
                var $313 = $315;
                break;
        };
        return $313;
    };
    const Parser$text = x0 => x1 => Parser$text$(x0, x1);

    function Parser$eof$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $322 = self.nam;
                var $323 = self.ini;
                var $324 = self.idx;
                var $325 = self.str;
                var self = $325;
                if (self.length === 0) {
                    var $327 = Parser$Reply$value$(_pst$1, Unit$new);
                    var $326 = $327;
                } else {
                    var $328 = self.charCodeAt(0);
                    var $329 = self.slice(1);
                    var $330 = Parser$Reply$fail$($322, $323, $324, "Expected end-of-file.");
                    var $326 = $330;
                };
                var $321 = $326;
                break;
        };
        return $321;
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
                        var $331 = self.head;
                        var $332 = self.tail;
                        var $333 = List$reverse$go$($332, List$cons$($331, _res$3));
                        return $333;
                    case 'List.nil':
                        var $334 = _res$3;
                        return $334;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $335 = List$reverse$go$(_xs$2, List$nil);
        return $335;
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
                        var $337 = self.err;
                        var _reply$8 = _parse$3(_pst$5);
                        var self = _reply$8;
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $339 = self.err;
                                var $340 = Parser$Reply$error$(Parser$Error$combine$($339, $337));
                                var $338 = $340;
                                break;
                            case 'Parser.Reply.value':
                                var $341 = self.pst;
                                var $342 = self.val;
                                var $343 = Parser$until$go$(_until$2, _parse$3, List$cons$($342, _values$4), $341);
                                var $338 = $343;
                                break;
                        };
                        var $336 = $338;
                        break;
                    case 'Parser.Reply.value':
                        var $344 = self.pst;
                        var $345 = Parser$Reply$value$($344, List$reverse$(_values$4));
                        var $336 = $345;
                        break;
                };
                return $336;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$until$go = x0 => x1 => x2 => x3 => Parser$until$go$(x0, x1, x2, x3);

    function Parser$until$(_until$2, _parse$3) {
        var $346 = Parser$until$go(_until$2)(_parse$3)(List$nil);
        return $346;
    };
    const Parser$until = x0 => x1 => Parser$until$(x0, x1);

    function Parser$one$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $348 = self.err;
                var $349 = self.nam;
                var $350 = self.ini;
                var $351 = self.idx;
                var $352 = self.str;
                var self = $352;
                if (self.length === 0) {
                    var $354 = Parser$Reply$fail$($349, $350, $351, "Unexpected end of file.");
                    var $353 = $354;
                } else {
                    var $355 = self.charCodeAt(0);
                    var $356 = self.slice(1);
                    var _pst$9 = Parser$State$new$($348, $349, $350, Nat$succ$($351), $356);
                    var $357 = Parser$Reply$value$(_pst$9, $355);
                    var $353 = $357;
                };
                var $347 = $353;
                break;
        };
        return $347;
    };
    const Parser$one = x0 => Parser$one$(x0);
    const Litereum$parse$ignore = Parser$many$(Parser$choice(List$cons$(Parser$text(" "), List$cons$(Parser$text("\u{9}"), List$cons$(Parser$text("\u{d}"), List$cons$(Parser$text("\u{a}"), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $359 = self.err;
                var _reply$7 = Parser$text$("//", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $361 = self.err;
                        var self = $359;
                        switch (self._) {
                            case 'Maybe.some':
                                var $363 = self.value;
                                var $364 = Parser$Reply$error$(Parser$Error$combine$($363, $361));
                                var $362 = $364;
                                break;
                            case 'Maybe.none':
                                var $365 = Parser$Reply$error$($361);
                                var $362 = $365;
                                break;
                        };
                        var $360 = $362;
                        break;
                    case 'Parser.Reply.value':
                        var $366 = self.pst;
                        var self = $366;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $368 = self.err;
                                var $369 = self.nam;
                                var $370 = self.ini;
                                var $371 = self.idx;
                                var $372 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($359, $368), $369, $370, $371, $372);
                                var _end$16 = Parser$choice(List$cons$(Parser$text("\u{a}"), List$cons$(Parser$eof, List$nil)));
                                var self = _reply$pst$15;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $374 = self.err;
                                        var _reply$22 = Parser$until$(_end$16, Parser$one)(_reply$pst$15);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $376 = self.err;
                                                var self = $374;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $378 = self.value;
                                                        var $379 = Parser$Reply$error$(Parser$Error$combine$($378, $376));
                                                        var $377 = $379;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $380 = Parser$Reply$error$($376);
                                                        var $377 = $380;
                                                        break;
                                                };
                                                var $375 = $377;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $381 = self.pst;
                                                var self = $381;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $383 = self.err;
                                                        var $384 = self.nam;
                                                        var $385 = self.ini;
                                                        var $386 = self.idx;
                                                        var $387 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($374, $383), $384, $385, $386, $387);
                                                        var $388 = Parser$Reply$value$(_reply$pst$30, Unit$new);
                                                        var $382 = $388;
                                                        break;
                                                };
                                                var $375 = $382;
                                                break;
                                        };
                                        var $373 = $375;
                                        break;
                                };
                                var $367 = $373;
                                break;
                        };
                        var $360 = $367;
                        break;
                };
                var $358 = $360;
                break;
        };
        return $358;
    }), List$nil)))))));

    function Litereum$parse$text$(_text$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $390 = self.err;
                var _reply$8 = Litereum$parse$ignore(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $392 = self.err;
                        var self = $390;
                        switch (self._) {
                            case 'Maybe.some':
                                var $394 = self.value;
                                var $395 = Parser$Reply$error$(Parser$Error$combine$($394, $392));
                                var $393 = $395;
                                break;
                            case 'Maybe.none':
                                var $396 = Parser$Reply$error$($392);
                                var $393 = $396;
                                break;
                        };
                        var $391 = $393;
                        break;
                    case 'Parser.Reply.value':
                        var $397 = self.pst;
                        var self = $397;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $399 = self.err;
                                var $400 = self.nam;
                                var $401 = self.ini;
                                var $402 = self.idx;
                                var $403 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($390, $399), $400, $401, $402, $403);
                                var $404 = Parser$text$(_text$1, _reply$pst$16);
                                var $398 = $404;
                                break;
                        };
                        var $391 = $398;
                        break;
                };
                var $389 = $391;
                break;
        };
        return $389;
    };
    const Litereum$parse$text = x0 => x1 => Litereum$parse$text$(x0, x1);

    function Parser$letter$(_is_letter$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $406 = self.err;
                var $407 = self.nam;
                var $408 = self.ini;
                var $409 = self.idx;
                var $410 = self.str;
                var self = $410;
                if (self.length === 0) {
                    var $412 = Parser$Reply$fail$($407, $408, $409, "Unexpected eof.");
                    var $411 = $412;
                } else {
                    var $413 = self.charCodeAt(0);
                    var $414 = self.slice(1);
                    var self = _is_letter$1($413);
                    if (self) {
                        var $416 = Parser$Reply$value$(Parser$State$new$($406, $407, $408, Nat$succ$($409), $414), $413);
                        var $415 = $416;
                    } else {
                        var $417 = Parser$Reply$fail$($407, $408, $409, "Expected letter.");
                        var $415 = $417;
                    };
                    var $411 = $415;
                };
                var $405 = $411;
                break;
        };
        return $405;
    };
    const Parser$letter = x0 => x1 => Parser$letter$(x0, x1);
    const Bool$and = a0 => a1 => (a0 && a1);

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $419 = Bool$true;
                var $418 = $419;
                break;
            case 'Cmp.gtn':
                var $420 = Bool$false;
                var $418 = $420;
                break;
        };
        return $418;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $421 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $421;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U16$lte = a0 => a1 => (a0 <= a1);

    function U16$btw$(_a$1, _b$2, _c$3) {
        var $422 = ((_a$1 <= _b$2) && (_b$2 <= _c$3));
        return $422;
    };
    const U16$btw = x0 => x1 => x2 => U16$btw$(x0, x1, x2);
    const Litereum$parse$letter = Parser$letter((_chr$1 => {
        var self = U16$btw$(65, _chr$1, 90);
        if (self) {
            var $424 = Bool$true;
            var $423 = $424;
        } else {
            var self = U16$btw$(97, _chr$1, 122);
            if (self) {
                var $426 = Bool$true;
                var $425 = $426;
            } else {
                var self = U16$btw$(48, _chr$1, 57);
                if (self) {
                    var $428 = Bool$true;
                    var $427 = $428;
                } else {
                    var self = (46 === _chr$1);
                    if (self) {
                        var $430 = Bool$true;
                        var $429 = $430;
                    } else {
                        var self = (95 === _chr$1);
                        if (self) {
                            var $432 = Bool$true;
                            var $431 = $432;
                        } else {
                            var self = (94 === _chr$1);
                            if (self) {
                                var $434 = Bool$true;
                                var $433 = $434;
                            } else {
                                var $435 = Bool$false;
                                var $433 = $435;
                            };
                            var $431 = $433;
                        };
                        var $429 = $431;
                    };
                    var $427 = $429;
                };
                var $425 = $427;
            };
            var $423 = $425;
        };
        return $423;
    }));

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $437 = self.head;
                var $438 = self.tail;
                var $439 = _cons$5($437)(List$fold$($438, _nil$4, _cons$5));
                var $436 = $439;
                break;
            case 'List.nil':
                var $440 = _nil$4;
                var $436 = $440;
                break;
        };
        return $436;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Litereum$parse$name$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $442 = self.err;
                var _reply$7 = Litereum$parse$ignore(_pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $444 = self.err;
                        var self = $442;
                        switch (self._) {
                            case 'Maybe.some':
                                var $446 = self.value;
                                var $447 = Parser$Reply$error$(Parser$Error$combine$($446, $444));
                                var $445 = $447;
                                break;
                            case 'Maybe.none':
                                var $448 = Parser$Reply$error$($444);
                                var $445 = $448;
                                break;
                        };
                        var $443 = $445;
                        break;
                    case 'Parser.Reply.value':
                        var $449 = self.pst;
                        var self = $449;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $451 = self.err;
                                var $452 = self.nam;
                                var $453 = self.ini;
                                var $454 = self.idx;
                                var $455 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($442, $451), $452, $453, $454, $455);
                                var self = _reply$pst$15;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $457 = self.err;
                                        var _reply$21 = Litereum$parse$letter(_reply$pst$15);
                                        var self = _reply$21;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $459 = self.err;
                                                var self = $457;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $461 = self.value;
                                                        var $462 = Parser$Reply$error$(Parser$Error$combine$($461, $459));
                                                        var $460 = $462;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $463 = Parser$Reply$error$($459);
                                                        var $460 = $463;
                                                        break;
                                                };
                                                var $458 = $460;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $464 = self.pst;
                                                var $465 = self.val;
                                                var self = $464;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $467 = self.err;
                                                        var $468 = self.nam;
                                                        var $469 = self.ini;
                                                        var $470 = self.idx;
                                                        var $471 = self.str;
                                                        var _reply$pst$29 = Parser$State$new$(Parser$Error$maybe_combine$($457, $467), $468, $469, $470, $471);
                                                        var self = _reply$pst$29;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $473 = self.err;
                                                                var _reply$35 = Parser$many$(Litereum$parse$letter)(_reply$pst$29);
                                                                var self = _reply$35;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $475 = self.err;
                                                                        var self = $473;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $477 = self.value;
                                                                                var $478 = Parser$Reply$error$(Parser$Error$combine$($477, $475));
                                                                                var $476 = $478;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $479 = Parser$Reply$error$($475);
                                                                                var $476 = $479;
                                                                                break;
                                                                        };
                                                                        var $474 = $476;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $480 = self.pst;
                                                                        var $481 = self.val;
                                                                        var self = $480;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $483 = self.err;
                                                                                var $484 = self.nam;
                                                                                var $485 = self.ini;
                                                                                var $486 = self.idx;
                                                                                var $487 = self.str;
                                                                                var _reply$pst$43 = Parser$State$new$(Parser$Error$maybe_combine$($473, $483), $484, $485, $486, $487);
                                                                                var $488 = Parser$Reply$value$(_reply$pst$43, String$cons$($465, List$fold$($481, String$nil, String$cons)));
                                                                                var $482 = $488;
                                                                                break;
                                                                        };
                                                                        var $474 = $482;
                                                                        break;
                                                                };
                                                                var $472 = $474;
                                                                break;
                                                        };
                                                        var $466 = $472;
                                                        break;
                                                };
                                                var $458 = $466;
                                                break;
                                        };
                                        var $456 = $458;
                                        break;
                                };
                                var $450 = $456;
                                break;
                        };
                        var $443 = $450;
                        break;
                };
                var $441 = $443;
                break;
        };
        return $441;
    };
    const Litereum$parse$name = x0 => Litereum$parse$name$(x0);

    function Litereum$Transaction$new_name$(_name$1) {
        var $489 = ({
            _: 'Litereum.Transaction.new_name',
            'name': _name$1
        });
        return $489;
    };
    const Litereum$Transaction$new_name = x0 => Litereum$Transaction$new_name$(x0);

    function Parser$wrap$(_opens$2, _parse$3, _close$4, _pst$5) {
        var self = _pst$5;
        switch (self._) {
            case 'Parser.State.new':
                var $491 = self.err;
                var _reply$11 = _opens$2(_pst$5);
                var self = _reply$11;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $493 = self.err;
                        var self = $491;
                        switch (self._) {
                            case 'Maybe.some':
                                var $495 = self.value;
                                var $496 = Parser$Reply$error$(Parser$Error$combine$($495, $493));
                                var $494 = $496;
                                break;
                            case 'Maybe.none':
                                var $497 = Parser$Reply$error$($493);
                                var $494 = $497;
                                break;
                        };
                        var $492 = $494;
                        break;
                    case 'Parser.Reply.value':
                        var $498 = self.pst;
                        var self = $498;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $500 = self.err;
                                var $501 = self.nam;
                                var $502 = self.ini;
                                var $503 = self.idx;
                                var $504 = self.str;
                                var _reply$pst$19 = Parser$State$new$(Parser$Error$maybe_combine$($491, $500), $501, $502, $503, $504);
                                var $505 = Parser$until$(_close$4, _parse$3)(_reply$pst$19);
                                var $499 = $505;
                                break;
                        };
                        var $492 = $499;
                        break;
                };
                var $490 = $492;
                break;
        };
        return $490;
    };
    const Parser$wrap = x0 => x1 => x2 => x3 => Parser$wrap$(x0, x1, x2, x3);

    function Parser$maybe$(_parse$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var self = _parse$2(_pst$3);
                switch (self._) {
                    case 'Parser.Reply.value':
                        var $508 = self.pst;
                        var $509 = self.val;
                        var $510 = Parser$Reply$value$($508, Maybe$some$($509));
                        var $507 = $510;
                        break;
                    case 'Parser.Reply.error':
                        var $511 = Parser$Reply$value$(_pst$3, Maybe$none);
                        var $507 = $511;
                        break;
                };
                var $506 = $507;
                break;
        };
        return $506;
    };
    const Parser$maybe = x0 => x1 => Parser$maybe$(x0, x1);

    function Litereum$Type$effect$(_rety$1) {
        var $512 = ({
            _: 'Litereum.Type.effect',
            'rety': _rety$1
        });
        return $512;
    };
    const Litereum$Type$effect = x0 => Litereum$Type$effect$(x0);
    const Litereum$Type$word = ({
        _: 'Litereum.Type.word'
    });

    function Litereum$Type$data$(_name$1) {
        var $513 = ({
            _: 'Litereum.Type.data',
            'name': _name$1
        });
        return $513;
    };
    const Litereum$Type$data = x0 => Litereum$Type$data$(x0);

    function Litereum$parse$type$(_world$1) {
        var $514 = Parser$choice(List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $516 = self.err;
                    var _reply$8 = Litereum$parse$text$("&", _pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $518 = self.err;
                            var self = $516;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $520 = self.value;
                                    var $521 = Parser$Reply$error$(Parser$Error$combine$($520, $518));
                                    var $519 = $521;
                                    break;
                                case 'Maybe.none':
                                    var $522 = Parser$Reply$error$($518);
                                    var $519 = $522;
                                    break;
                            };
                            var $517 = $519;
                            break;
                        case 'Parser.Reply.value':
                            var $523 = self.pst;
                            var self = $523;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $525 = self.err;
                                    var $526 = self.nam;
                                    var $527 = self.ini;
                                    var $528 = self.idx;
                                    var $529 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($516, $525), $526, $527, $528, $529);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $531 = self.err;
                                            var _reply$22 = Litereum$parse$type$(_world$1)(_reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $533 = self.err;
                                                    var self = $531;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $535 = self.value;
                                                            var $536 = Parser$Reply$error$(Parser$Error$combine$($535, $533));
                                                            var $534 = $536;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $537 = Parser$Reply$error$($533);
                                                            var $534 = $537;
                                                            break;
                                                    };
                                                    var $532 = $534;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $538 = self.pst;
                                                    var $539 = self.val;
                                                    var self = $538;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $541 = self.err;
                                                            var $542 = self.nam;
                                                            var $543 = self.ini;
                                                            var $544 = self.idx;
                                                            var $545 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($531, $541), $542, $543, $544, $545);
                                                            var $546 = Parser$Reply$value$(_reply$pst$30, Litereum$Type$effect$($539));
                                                            var $540 = $546;
                                                            break;
                                                    };
                                                    var $532 = $540;
                                                    break;
                                            };
                                            var $530 = $532;
                                            break;
                                    };
                                    var $524 = $530;
                                    break;
                            };
                            var $517 = $524;
                            break;
                    };
                    var $515 = $517;
                    break;
            };
            return $515;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $548 = self.err;
                    var _reply$8 = Litereum$parse$text$("#word", _pst$2);
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
                                    var $562 = Parser$Reply$value$(_reply$pst$16, Litereum$Type$word);
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
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $564 = self.err;
                    var _reply$8 = Litereum$parse$name$(_pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $566 = self.err;
                            var self = $564;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $568 = self.value;
                                    var $569 = Parser$Reply$error$(Parser$Error$combine$($568, $566));
                                    var $567 = $569;
                                    break;
                                case 'Maybe.none':
                                    var $570 = Parser$Reply$error$($566);
                                    var $567 = $570;
                                    break;
                            };
                            var $565 = $567;
                            break;
                        case 'Parser.Reply.value':
                            var $571 = self.pst;
                            var $572 = self.val;
                            var self = $571;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $574 = self.err;
                                    var $575 = self.nam;
                                    var $576 = self.ini;
                                    var $577 = self.idx;
                                    var $578 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($564, $574), $575, $576, $577, $578);
                                    var $579 = Parser$Reply$value$(_reply$pst$16, Litereum$Type$data$($572));
                                    var $573 = $579;
                                    break;
                            };
                            var $565 = $573;
                            break;
                    };
                    var $563 = $565;
                    break;
            };
            return $563;
        }), List$nil))));
        return $514;
    };
    const Litereum$parse$type = x0 => Litereum$parse$type$(x0);

    function Litereum$parse$ann$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $581 = self.err;
                var _reply$8 = Parser$maybe$(Litereum$parse$text(","), _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $583 = self.err;
                        var self = $581;
                        switch (self._) {
                            case 'Maybe.some':
                                var $585 = self.value;
                                var $586 = Parser$Reply$error$(Parser$Error$combine$($585, $583));
                                var $584 = $586;
                                break;
                            case 'Maybe.none':
                                var $587 = Parser$Reply$error$($583);
                                var $584 = $587;
                                break;
                        };
                        var $582 = $584;
                        break;
                    case 'Parser.Reply.value':
                        var $588 = self.pst;
                        var self = $588;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $590 = self.err;
                                var $591 = self.nam;
                                var $592 = self.ini;
                                var $593 = self.idx;
                                var $594 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($581, $590), $591, $592, $593, $594);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $596 = self.err;
                                        var _reply$22 = Litereum$parse$name$(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $598 = self.err;
                                                var self = $596;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $600 = self.value;
                                                        var $601 = Parser$Reply$error$(Parser$Error$combine$($600, $598));
                                                        var $599 = $601;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $602 = Parser$Reply$error$($598);
                                                        var $599 = $602;
                                                        break;
                                                };
                                                var $597 = $599;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $603 = self.pst;
                                                var $604 = self.val;
                                                var self = $603;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $606 = self.err;
                                                        var $607 = self.nam;
                                                        var $608 = self.ini;
                                                        var $609 = self.idx;
                                                        var $610 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($596, $606), $607, $608, $609, $610);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $612 = self.err;
                                                                var _reply$36 = Litereum$parse$text$(":", _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $614 = self.err;
                                                                        var self = $612;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $616 = self.value;
                                                                                var $617 = Parser$Reply$error$(Parser$Error$combine$($616, $614));
                                                                                var $615 = $617;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $618 = Parser$Reply$error$($614);
                                                                                var $615 = $618;
                                                                                break;
                                                                        };
                                                                        var $613 = $615;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $619 = self.pst;
                                                                        var self = $619;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $621 = self.err;
                                                                                var $622 = self.nam;
                                                                                var $623 = self.ini;
                                                                                var $624 = self.idx;
                                                                                var $625 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($612, $621), $622, $623, $624, $625);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $627 = self.err;
                                                                                        var _reply$50 = Litereum$parse$type$(_world$1)(_reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $629 = self.err;
                                                                                                var self = $627;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $631 = self.value;
                                                                                                        var $632 = Parser$Reply$error$(Parser$Error$combine$($631, $629));
                                                                                                        var $630 = $632;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $633 = Parser$Reply$error$($629);
                                                                                                        var $630 = $633;
                                                                                                        break;
                                                                                                };
                                                                                                var $628 = $630;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $634 = self.pst;
                                                                                                var $635 = self.val;
                                                                                                var self = $634;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $637 = self.err;
                                                                                                        var $638 = self.nam;
                                                                                                        var $639 = self.ini;
                                                                                                        var $640 = self.idx;
                                                                                                        var $641 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($627, $637), $638, $639, $640, $641);
                                                                                                        var $642 = Parser$Reply$value$(_reply$pst$58, Pair$new$($604, $635));
                                                                                                        var $636 = $642;
                                                                                                        break;
                                                                                                };
                                                                                                var $628 = $636;
                                                                                                break;
                                                                                        };
                                                                                        var $626 = $628;
                                                                                        break;
                                                                                };
                                                                                var $620 = $626;
                                                                                break;
                                                                        };
                                                                        var $613 = $620;
                                                                        break;
                                                                };
                                                                var $611 = $613;
                                                                break;
                                                        };
                                                        var $605 = $611;
                                                        break;
                                                };
                                                var $597 = $605;
                                                break;
                                        };
                                        var $595 = $597;
                                        break;
                                };
                                var $589 = $595;
                                break;
                        };
                        var $582 = $589;
                        break;
                };
                var $580 = $582;
                break;
        };
        return $580;
    };
    const Litereum$parse$ann = x0 => x1 => Litereum$parse$ann$(x0, x1);

    function List$mapped$(_as$2, _f$4) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $644 = self.head;
                var $645 = self.tail;
                var $646 = List$cons$(_f$4($644), List$mapped$($645, _f$4));
                var $643 = $646;
                break;
            case 'List.nil':
                var $647 = List$nil;
                var $643 = $647;
                break;
        };
        return $643;
    };
    const List$mapped = x0 => x1 => List$mapped$(x0, x1);

    function Litereum$Constructor$new$(_name$1, _field_names$2, _field_types$3) {
        var $648 = ({
            _: 'Litereum.Constructor.new',
            'name': _name$1,
            'field_names': _field_names$2,
            'field_types': _field_types$3
        });
        return $648;
    };
    const Litereum$Constructor$new = x0 => x1 => x2 => Litereum$Constructor$new$(x0, x1, x2);

    function Litereum$parse$constructor$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $650 = self.err;
                var _reply$8 = Litereum$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $652 = self.err;
                        var self = $650;
                        switch (self._) {
                            case 'Maybe.some':
                                var $654 = self.value;
                                var $655 = Parser$Reply$error$(Parser$Error$combine$($654, $652));
                                var $653 = $655;
                                break;
                            case 'Maybe.none':
                                var $656 = Parser$Reply$error$($652);
                                var $653 = $656;
                                break;
                        };
                        var $651 = $653;
                        break;
                    case 'Parser.Reply.value':
                        var $657 = self.pst;
                        var $658 = self.val;
                        var self = $657;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $660 = self.err;
                                var $661 = self.nam;
                                var $662 = self.ini;
                                var $663 = self.idx;
                                var $664 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($650, $660), $661, $662, $663, $664);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $666 = self.err;
                                        var _reply$22 = Parser$wrap$(Litereum$parse$text("{"), Litereum$parse$ann(_world$1), Litereum$parse$text("}"), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $668 = self.err;
                                                var self = $666;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $670 = self.value;
                                                        var $671 = Parser$Reply$error$(Parser$Error$combine$($670, $668));
                                                        var $669 = $671;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $672 = Parser$Reply$error$($668);
                                                        var $669 = $672;
                                                        break;
                                                };
                                                var $667 = $669;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $673 = self.pst;
                                                var $674 = self.val;
                                                var self = $673;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $676 = self.err;
                                                        var $677 = self.nam;
                                                        var $678 = self.ini;
                                                        var $679 = self.idx;
                                                        var $680 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($666, $676), $677, $678, $679, $680);
                                                        var _nams$31 = List$mapped$($674, (_x$31 => {
                                                            var self = _x$31;
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $683 = self.fst;
                                                                    var $684 = $683;
                                                                    var $682 = $684;
                                                                    break;
                                                            };
                                                            return $682;
                                                        }));
                                                        var _typs$32 = List$mapped$($674, (_x$32 => {
                                                            var self = _x$32;
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $686 = self.snd;
                                                                    var $687 = $686;
                                                                    var $685 = $687;
                                                                    break;
                                                            };
                                                            return $685;
                                                        }));
                                                        var $681 = Parser$Reply$value$(_reply$pst$30, Litereum$Constructor$new$($658, _nams$31, _typs$32));
                                                        var $675 = $681;
                                                        break;
                                                };
                                                var $667 = $675;
                                                break;
                                        };
                                        var $665 = $667;
                                        break;
                                };
                                var $659 = $665;
                                break;
                        };
                        var $651 = $659;
                        break;
                };
                var $649 = $651;
                break;
        };
        return $649;
    };
    const Litereum$parse$constructor = x0 => x1 => Litereum$parse$constructor$(x0, x1);

    function Litereum$Data$new$(_name$1, _constructors$2) {
        var $688 = ({
            _: 'Litereum.Data.new',
            'name': _name$1,
            'constructors': _constructors$2
        });
        return $688;
    };
    const Litereum$Data$new = x0 => x1 => Litereum$Data$new$(x0, x1);

    function Litereum$parse$data$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $690 = self.err;
                var _reply$8 = Litereum$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $692 = self.err;
                        var self = $690;
                        switch (self._) {
                            case 'Maybe.some':
                                var $694 = self.value;
                                var $695 = Parser$Reply$error$(Parser$Error$combine$($694, $692));
                                var $693 = $695;
                                break;
                            case 'Maybe.none':
                                var $696 = Parser$Reply$error$($692);
                                var $693 = $696;
                                break;
                        };
                        var $691 = $693;
                        break;
                    case 'Parser.Reply.value':
                        var $697 = self.pst;
                        var $698 = self.val;
                        var self = $697;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $700 = self.err;
                                var $701 = self.nam;
                                var $702 = self.ini;
                                var $703 = self.idx;
                                var $704 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($690, $700), $701, $702, $703, $704);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $706 = self.err;
                                        var _reply$22 = Parser$wrap$(Litereum$parse$text("{"), (_pst$22 => {
                                            var self = _pst$22;
                                            switch (self._) {
                                                case 'Parser.State.new':
                                                    var $709 = self.err;
                                                    var _reply$28 = Parser$maybe$(Litereum$parse$text(","), _pst$22);
                                                    var self = _reply$28;
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $711 = self.err;
                                                            var self = $709;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $713 = self.value;
                                                                    var $714 = Parser$Reply$error$(Parser$Error$combine$($713, $711));
                                                                    var $712 = $714;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $715 = Parser$Reply$error$($711);
                                                                    var $712 = $715;
                                                                    break;
                                                            };
                                                            var $710 = $712;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $716 = self.pst;
                                                            var self = $716;
                                                            switch (self._) {
                                                                case 'Parser.State.new':
                                                                    var $718 = self.err;
                                                                    var $719 = self.nam;
                                                                    var $720 = self.ini;
                                                                    var $721 = self.idx;
                                                                    var $722 = self.str;
                                                                    var _reply$pst$36 = Parser$State$new$(Parser$Error$maybe_combine$($709, $718), $719, $720, $721, $722);
                                                                    var $723 = Litereum$parse$constructor$(_world$1, _reply$pst$36);
                                                                    var $717 = $723;
                                                                    break;
                                                            };
                                                            var $710 = $717;
                                                            break;
                                                    };
                                                    var $708 = $710;
                                                    break;
                                            };
                                            return $708;
                                        }), Litereum$parse$text("}"), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $724 = self.err;
                                                var self = $706;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $726 = self.value;
                                                        var $727 = Parser$Reply$error$(Parser$Error$combine$($726, $724));
                                                        var $725 = $727;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $728 = Parser$Reply$error$($724);
                                                        var $725 = $728;
                                                        break;
                                                };
                                                var $707 = $725;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $729 = self.pst;
                                                var $730 = self.val;
                                                var self = $729;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $732 = self.err;
                                                        var $733 = self.nam;
                                                        var $734 = self.ini;
                                                        var $735 = self.idx;
                                                        var $736 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($706, $732), $733, $734, $735, $736);
                                                        var $737 = Parser$Reply$value$(_reply$pst$30, Litereum$Data$new$($698, $730));
                                                        var $731 = $737;
                                                        break;
                                                };
                                                var $707 = $731;
                                                break;
                                        };
                                        var $705 = $707;
                                        break;
                                };
                                var $699 = $705;
                                break;
                        };
                        var $691 = $699;
                        break;
                };
                var $689 = $691;
                break;
        };
        return $689;
    };
    const Litereum$parse$data = x0 => x1 => Litereum$parse$data$(x0, x1);

    function Litereum$Transaction$new_data$(_data$1) {
        var $738 = ({
            _: 'Litereum.Transaction.new_data',
            'data': _data$1
        });
        return $738;
    };
    const Litereum$Transaction$new_data = x0 => Litereum$Transaction$new_data$(x0);

    function Litereum$Term$let$(_name$1, _type$2, _expr$3, _body$4) {
        var $739 = ({
            _: 'Litereum.Term.let',
            'name': _name$1,
            'type': _type$2,
            'expr': _expr$3,
            'body': _body$4
        });
        return $739;
    };
    const Litereum$Term$let = x0 => x1 => x2 => x3 => Litereum$Term$let$(x0, x1, x2, x3);

    function Litereum$parse$term$let$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $741 = self.err;
                var _reply$8 = Litereum$parse$text$("let", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $743 = self.err;
                        var self = $741;
                        switch (self._) {
                            case 'Maybe.some':
                                var $745 = self.value;
                                var $746 = Parser$Reply$error$(Parser$Error$combine$($745, $743));
                                var $744 = $746;
                                break;
                            case 'Maybe.none':
                                var $747 = Parser$Reply$error$($743);
                                var $744 = $747;
                                break;
                        };
                        var $742 = $744;
                        break;
                    case 'Parser.Reply.value':
                        var $748 = self.pst;
                        var self = $748;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $750 = self.err;
                                var $751 = self.nam;
                                var $752 = self.ini;
                                var $753 = self.idx;
                                var $754 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($741, $750), $751, $752, $753, $754);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $756 = self.err;
                                        var _reply$22 = Litereum$parse$name$(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $758 = self.err;
                                                var self = $756;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $760 = self.value;
                                                        var $761 = Parser$Reply$error$(Parser$Error$combine$($760, $758));
                                                        var $759 = $761;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $762 = Parser$Reply$error$($758);
                                                        var $759 = $762;
                                                        break;
                                                };
                                                var $757 = $759;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $763 = self.pst;
                                                var $764 = self.val;
                                                var self = $763;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $766 = self.err;
                                                        var $767 = self.nam;
                                                        var $768 = self.ini;
                                                        var $769 = self.idx;
                                                        var $770 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($756, $766), $767, $768, $769, $770);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $772 = self.err;
                                                                var _reply$36 = Litereum$parse$text$(":", _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $774 = self.err;
                                                                        var self = $772;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $776 = self.value;
                                                                                var $777 = Parser$Reply$error$(Parser$Error$combine$($776, $774));
                                                                                var $775 = $777;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $778 = Parser$Reply$error$($774);
                                                                                var $775 = $778;
                                                                                break;
                                                                        };
                                                                        var $773 = $775;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $779 = self.pst;
                                                                        var self = $779;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $781 = self.err;
                                                                                var $782 = self.nam;
                                                                                var $783 = self.ini;
                                                                                var $784 = self.idx;
                                                                                var $785 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($772, $781), $782, $783, $784, $785);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $787 = self.err;
                                                                                        var _reply$50 = Litereum$parse$type$(_world$1)(_reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $789 = self.err;
                                                                                                var self = $787;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $791 = self.value;
                                                                                                        var $792 = Parser$Reply$error$(Parser$Error$combine$($791, $789));
                                                                                                        var $790 = $792;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $793 = Parser$Reply$error$($789);
                                                                                                        var $790 = $793;
                                                                                                        break;
                                                                                                };
                                                                                                var $788 = $790;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $794 = self.pst;
                                                                                                var $795 = self.val;
                                                                                                var self = $794;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $797 = self.err;
                                                                                                        var $798 = self.nam;
                                                                                                        var $799 = self.ini;
                                                                                                        var $800 = self.idx;
                                                                                                        var $801 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($787, $797), $798, $799, $800, $801);
                                                                                                        var self = _reply$pst$58;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $803 = self.err;
                                                                                                                var _reply$64 = Litereum$parse$text$("=", _reply$pst$58);
                                                                                                                var self = _reply$64;
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $805 = self.err;
                                                                                                                        var self = $803;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Maybe.some':
                                                                                                                                var $807 = self.value;
                                                                                                                                var $808 = Parser$Reply$error$(Parser$Error$combine$($807, $805));
                                                                                                                                var $806 = $808;
                                                                                                                                break;
                                                                                                                            case 'Maybe.none':
                                                                                                                                var $809 = Parser$Reply$error$($805);
                                                                                                                                var $806 = $809;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $804 = $806;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $810 = self.pst;
                                                                                                                        var self = $810;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $812 = self.err;
                                                                                                                                var $813 = self.nam;
                                                                                                                                var $814 = self.ini;
                                                                                                                                var $815 = self.idx;
                                                                                                                                var $816 = self.str;
                                                                                                                                var _reply$pst$72 = Parser$State$new$(Parser$Error$maybe_combine$($803, $812), $813, $814, $815, $816);
                                                                                                                                var self = _reply$pst$72;
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.State.new':
                                                                                                                                        var $818 = self.err;
                                                                                                                                        var _reply$78 = Litereum$parse$term$(_world$1)(_reply$pst$72);
                                                                                                                                        var self = _reply$78;
                                                                                                                                        switch (self._) {
                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                var $820 = self.err;
                                                                                                                                                var self = $818;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                        var $822 = self.value;
                                                                                                                                                        var $823 = Parser$Reply$error$(Parser$Error$combine$($822, $820));
                                                                                                                                                        var $821 = $823;
                                                                                                                                                        break;
                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                        var $824 = Parser$Reply$error$($820);
                                                                                                                                                        var $821 = $824;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $819 = $821;
                                                                                                                                                break;
                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                var $825 = self.pst;
                                                                                                                                                var $826 = self.val;
                                                                                                                                                var self = $825;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                        var $828 = self.err;
                                                                                                                                                        var $829 = self.nam;
                                                                                                                                                        var $830 = self.ini;
                                                                                                                                                        var $831 = self.idx;
                                                                                                                                                        var $832 = self.str;
                                                                                                                                                        var _reply$pst$86 = Parser$State$new$(Parser$Error$maybe_combine$($818, $828), $829, $830, $831, $832);
                                                                                                                                                        var self = _reply$pst$86;
                                                                                                                                                        switch (self._) {
                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                var $834 = self.err;
                                                                                                                                                                var _reply$92 = Parser$maybe$(Litereum$parse$text(";"), _reply$pst$86);
                                                                                                                                                                var self = _reply$92;
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
                                                                                                                                                                        var self = $841;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                var $843 = self.err;
                                                                                                                                                                                var $844 = self.nam;
                                                                                                                                                                                var $845 = self.ini;
                                                                                                                                                                                var $846 = self.idx;
                                                                                                                                                                                var $847 = self.str;
                                                                                                                                                                                var _reply$pst$100 = Parser$State$new$(Parser$Error$maybe_combine$($834, $843), $844, $845, $846, $847);
                                                                                                                                                                                var self = _reply$pst$100;
                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                        var $849 = self.err;
                                                                                                                                                                                        var _reply$106 = Litereum$parse$term$(_world$1)(_reply$pst$100);
                                                                                                                                                                                        var self = _reply$106;
                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                                                                var $851 = self.err;
                                                                                                                                                                                                var self = $849;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                                                                        var $853 = self.value;
                                                                                                                                                                                                        var $854 = Parser$Reply$error$(Parser$Error$combine$($853, $851));
                                                                                                                                                                                                        var $852 = $854;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                                                                        var $855 = Parser$Reply$error$($851);
                                                                                                                                                                                                        var $852 = $855;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $850 = $852;
                                                                                                                                                                                                break;
                                                                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                                                                var $856 = self.pst;
                                                                                                                                                                                                var $857 = self.val;
                                                                                                                                                                                                var self = $856;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                        var $859 = self.err;
                                                                                                                                                                                                        var $860 = self.nam;
                                                                                                                                                                                                        var $861 = self.ini;
                                                                                                                                                                                                        var $862 = self.idx;
                                                                                                                                                                                                        var $863 = self.str;
                                                                                                                                                                                                        var _reply$pst$114 = Parser$State$new$(Parser$Error$maybe_combine$($849, $859), $860, $861, $862, $863);
                                                                                                                                                                                                        var $864 = Parser$Reply$value$(_reply$pst$114, Litereum$Term$let$($764, $795, $826, $857));
                                                                                                                                                                                                        var $858 = $864;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $850 = $858;
                                                                                                                                                                                                break;
                                                                                                                                                                                        };
                                                                                                                                                                                        var $848 = $850;
                                                                                                                                                                                        break;
                                                                                                                                                                                };
                                                                                                                                                                                var $842 = $848;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $835 = $842;
                                                                                                                                                                        break;
                                                                                                                                                                };
                                                                                                                                                                var $833 = $835;
                                                                                                                                                                break;
                                                                                                                                                        };
                                                                                                                                                        var $827 = $833;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $819 = $827;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $817 = $819;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $811 = $817;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $804 = $811;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $802 = $804;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $796 = $802;
                                                                                                        break;
                                                                                                };
                                                                                                var $788 = $796;
                                                                                                break;
                                                                                        };
                                                                                        var $786 = $788;
                                                                                        break;
                                                                                };
                                                                                var $780 = $786;
                                                                                break;
                                                                        };
                                                                        var $773 = $780;
                                                                        break;
                                                                };
                                                                var $771 = $773;
                                                                break;
                                                        };
                                                        var $765 = $771;
                                                        break;
                                                };
                                                var $757 = $765;
                                                break;
                                        };
                                        var $755 = $757;
                                        break;
                                };
                                var $749 = $755;
                                break;
                        };
                        var $742 = $749;
                        break;
                };
                var $740 = $742;
                break;
        };
        return $740;
    };
    const Litereum$parse$term$let = x0 => x1 => Litereum$parse$term$let$(x0, x1);

    function Litereum$Term$create$(_ctor$1, _vals$2) {
        var $865 = ({
            _: 'Litereum.Term.create',
            'ctor': _ctor$1,
            'vals': _vals$2
        });
        return $865;
    };
    const Litereum$Term$create = x0 => x1 => Litereum$Term$create$(x0, x1);

    function Litereum$parse$term$create$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $867 = self.err;
                var _reply$8 = Litereum$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $869 = self.err;
                        var self = $867;
                        switch (self._) {
                            case 'Maybe.some':
                                var $871 = self.value;
                                var $872 = Parser$Reply$error$(Parser$Error$combine$($871, $869));
                                var $870 = $872;
                                break;
                            case 'Maybe.none':
                                var $873 = Parser$Reply$error$($869);
                                var $870 = $873;
                                break;
                        };
                        var $868 = $870;
                        break;
                    case 'Parser.Reply.value':
                        var $874 = self.pst;
                        var $875 = self.val;
                        var self = $874;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $877 = self.err;
                                var $878 = self.nam;
                                var $879 = self.ini;
                                var $880 = self.idx;
                                var $881 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($867, $877), $878, $879, $880, $881);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $883 = self.err;
                                        var _reply$22 = Parser$wrap$(Litereum$parse$text("{"), Litereum$parse$term$(_world$1), Litereum$parse$text("}"), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $885 = self.err;
                                                var self = $883;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $887 = self.value;
                                                        var $888 = Parser$Reply$error$(Parser$Error$combine$($887, $885));
                                                        var $886 = $888;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $889 = Parser$Reply$error$($885);
                                                        var $886 = $889;
                                                        break;
                                                };
                                                var $884 = $886;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $890 = self.pst;
                                                var $891 = self.val;
                                                var self = $890;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $893 = self.err;
                                                        var $894 = self.nam;
                                                        var $895 = self.ini;
                                                        var $896 = self.idx;
                                                        var $897 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($883, $893), $894, $895, $896, $897);
                                                        var $898 = Parser$Reply$value$(_reply$pst$30, Litereum$Term$create$($875, $891));
                                                        var $892 = $898;
                                                        break;
                                                };
                                                var $884 = $892;
                                                break;
                                        };
                                        var $882 = $884;
                                        break;
                                };
                                var $876 = $882;
                                break;
                        };
                        var $868 = $876;
                        break;
                };
                var $866 = $868;
                break;
        };
        return $866;
    };
    const Litereum$parse$term$create = x0 => x1 => Litereum$parse$term$create$(x0, x1);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $900 = self.value;
                var $901 = _f$4($900);
                var $899 = $901;
                break;
            case 'Maybe.none':
                var $902 = Maybe$none;
                var $899 = $902;
                break;
        };
        return $899;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);

    function Maybe$monad$(_new$2) {
        var $903 = _new$2(Maybe$bind)(Maybe$some);
        return $903;
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
                        var $904 = self.key;
                        var $905 = self.val;
                        var $906 = self.left;
                        var $907 = self.right;
                        var self = _cmp$3(_key$4)($904);
                        switch (self._) {
                            case 'Cmp.ltn':
                                var $909 = BBT$lookup$(_cmp$3, _key$4, $906);
                                var $908 = $909;
                                break;
                            case 'Cmp.eql':
                                var $910 = Maybe$some$($905);
                                var $908 = $910;
                                break;
                            case 'Cmp.gtn':
                                var $911 = BBT$lookup$(_cmp$3, _key$4, $907);
                                var $908 = $911;
                                break;
                        };
                        return $908;
                    case 'BBT.tip':
                        var $912 = Maybe$none;
                        return $912;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BBT$lookup = x0 => x1 => x2 => BBT$lookup$(x0, x1, x2);

    function Map$get$(_key$2, _map$3) {
        var $913 = BBT$lookup$(String$cmp, _key$2, _map$3);
        return $913;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function Litereum$get_data$(_world$1, _name$2) {
        var self = _world$1;
        switch (self._) {
            case 'Litereum.World.new':
                var $915 = self.entry;
                var $916 = Maybe$monad$((_m$bind$7 => _m$pure$8 => {
                    var $917 = _m$bind$7;
                    return $917;
                }))(Map$get$(_name$2, $915))((_entry$7 => {
                    var self = _entry$7;
                    switch (self._) {
                        case 'Litereum.Entry.data':
                            var $919 = self.value;
                            var $920 = Maybe$some$($919);
                            var $918 = $920;
                            break;
                        case 'Litereum.Entry.bond':
                            var $921 = Maybe$none;
                            var $918 = $921;
                            break;
                    };
                    return $918;
                }));
                var $914 = $916;
                break;
        };
        return $914;
    };
    const Litereum$get_data = x0 => x1 => Litereum$get_data$(x0, x1);

    function Parser$fail$(_error$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var $923 = self.nam;
                var $924 = self.ini;
                var $925 = self.idx;
                var $926 = Parser$Reply$fail$($923, $924, $925, _error$2);
                var $922 = $926;
                break;
        };
        return $922;
    };
    const Parser$fail = x0 => x1 => Parser$fail$(x0, x1);

    function Litereum$parse$term$match$cases$(_world$1, _constructors$2) {
        var self = _constructors$2;
        switch (self._) {
            case 'List.cons':
                var $928 = self.head;
                var $929 = self.tail;
                var _ctor$5 = $928;
                var self = _ctor$5;
                switch (self._) {
                    case 'Litereum.Constructor.new':
                        var $931 = self.name;
                        var $932 = (_pst$9 => {
                            var self = _pst$9;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $934 = self.err;
                                    var _reply$15 = Litereum$parse$text$($931, _pst$9);
                                    var self = _reply$15;
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $936 = self.err;
                                            var self = $934;
                                            switch (self._) {
                                                case 'Maybe.some':
                                                    var $938 = self.value;
                                                    var $939 = Parser$Reply$error$(Parser$Error$combine$($938, $936));
                                                    var $937 = $939;
                                                    break;
                                                case 'Maybe.none':
                                                    var $940 = Parser$Reply$error$($936);
                                                    var $937 = $940;
                                                    break;
                                            };
                                            var $935 = $937;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $941 = self.pst;
                                            var self = $941;
                                            switch (self._) {
                                                case 'Parser.State.new':
                                                    var $943 = self.err;
                                                    var $944 = self.nam;
                                                    var $945 = self.ini;
                                                    var $946 = self.idx;
                                                    var $947 = self.str;
                                                    var _reply$pst$23 = Parser$State$new$(Parser$Error$maybe_combine$($934, $943), $944, $945, $946, $947);
                                                    var self = _reply$pst$23;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $949 = self.err;
                                                            var _reply$29 = Litereum$parse$text$(":", _reply$pst$23);
                                                            var self = _reply$29;
                                                            switch (self._) {
                                                                case 'Parser.Reply.error':
                                                                    var $951 = self.err;
                                                                    var self = $949;
                                                                    switch (self._) {
                                                                        case 'Maybe.some':
                                                                            var $953 = self.value;
                                                                            var $954 = Parser$Reply$error$(Parser$Error$combine$($953, $951));
                                                                            var $952 = $954;
                                                                            break;
                                                                        case 'Maybe.none':
                                                                            var $955 = Parser$Reply$error$($951);
                                                                            var $952 = $955;
                                                                            break;
                                                                    };
                                                                    var $950 = $952;
                                                                    break;
                                                                case 'Parser.Reply.value':
                                                                    var $956 = self.pst;
                                                                    var self = $956;
                                                                    switch (self._) {
                                                                        case 'Parser.State.new':
                                                                            var $958 = self.err;
                                                                            var $959 = self.nam;
                                                                            var $960 = self.ini;
                                                                            var $961 = self.idx;
                                                                            var $962 = self.str;
                                                                            var _reply$pst$37 = Parser$State$new$(Parser$Error$maybe_combine$($949, $958), $959, $960, $961, $962);
                                                                            var self = _reply$pst$37;
                                                                            switch (self._) {
                                                                                case 'Parser.State.new':
                                                                                    var $964 = self.err;
                                                                                    var _reply$43 = Litereum$parse$term$(_world$1)(_reply$pst$37);
                                                                                    var self = _reply$43;
                                                                                    switch (self._) {
                                                                                        case 'Parser.Reply.error':
                                                                                            var $966 = self.err;
                                                                                            var self = $964;
                                                                                            switch (self._) {
                                                                                                case 'Maybe.some':
                                                                                                    var $968 = self.value;
                                                                                                    var $969 = Parser$Reply$error$(Parser$Error$combine$($968, $966));
                                                                                                    var $967 = $969;
                                                                                                    break;
                                                                                                case 'Maybe.none':
                                                                                                    var $970 = Parser$Reply$error$($966);
                                                                                                    var $967 = $970;
                                                                                                    break;
                                                                                            };
                                                                                            var $965 = $967;
                                                                                            break;
                                                                                        case 'Parser.Reply.value':
                                                                                            var $971 = self.pst;
                                                                                            var $972 = self.val;
                                                                                            var self = $971;
                                                                                            switch (self._) {
                                                                                                case 'Parser.State.new':
                                                                                                    var $974 = self.err;
                                                                                                    var $975 = self.nam;
                                                                                                    var $976 = self.ini;
                                                                                                    var $977 = self.idx;
                                                                                                    var $978 = self.str;
                                                                                                    var _reply$pst$51 = Parser$State$new$(Parser$Error$maybe_combine$($964, $974), $975, $976, $977, $978);
                                                                                                    var self = _reply$pst$51;
                                                                                                    switch (self._) {
                                                                                                        case 'Parser.State.new':
                                                                                                            var $980 = self.err;
                                                                                                            var _reply$57 = Parser$maybe$(Litereum$parse$text(","), _reply$pst$51);
                                                                                                            var self = _reply$57;
                                                                                                            switch (self._) {
                                                                                                                case 'Parser.Reply.error':
                                                                                                                    var $982 = self.err;
                                                                                                                    var self = $980;
                                                                                                                    switch (self._) {
                                                                                                                        case 'Maybe.some':
                                                                                                                            var $984 = self.value;
                                                                                                                            var $985 = Parser$Reply$error$(Parser$Error$combine$($984, $982));
                                                                                                                            var $983 = $985;
                                                                                                                            break;
                                                                                                                        case 'Maybe.none':
                                                                                                                            var $986 = Parser$Reply$error$($982);
                                                                                                                            var $983 = $986;
                                                                                                                            break;
                                                                                                                    };
                                                                                                                    var $981 = $983;
                                                                                                                    break;
                                                                                                                case 'Parser.Reply.value':
                                                                                                                    var $987 = self.pst;
                                                                                                                    var self = $987;
                                                                                                                    switch (self._) {
                                                                                                                        case 'Parser.State.new':
                                                                                                                            var $989 = self.err;
                                                                                                                            var $990 = self.nam;
                                                                                                                            var $991 = self.ini;
                                                                                                                            var $992 = self.idx;
                                                                                                                            var $993 = self.str;
                                                                                                                            var _reply$pst$65 = Parser$State$new$(Parser$Error$maybe_combine$($980, $989), $990, $991, $992, $993);
                                                                                                                            var self = _reply$pst$65;
                                                                                                                            switch (self._) {
                                                                                                                                case 'Parser.State.new':
                                                                                                                                    var $995 = self.err;
                                                                                                                                    var _reply$71 = Litereum$parse$term$match$cases$(_world$1, $929)(_reply$pst$65);
                                                                                                                                    var self = _reply$71;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Parser.Reply.error':
                                                                                                                                            var $997 = self.err;
                                                                                                                                            var self = $995;
                                                                                                                                            switch (self._) {
                                                                                                                                                case 'Maybe.some':
                                                                                                                                                    var $999 = self.value;
                                                                                                                                                    var $1000 = Parser$Reply$error$(Parser$Error$combine$($999, $997));
                                                                                                                                                    var $998 = $1000;
                                                                                                                                                    break;
                                                                                                                                                case 'Maybe.none':
                                                                                                                                                    var $1001 = Parser$Reply$error$($997);
                                                                                                                                                    var $998 = $1001;
                                                                                                                                                    break;
                                                                                                                                            };
                                                                                                                                            var $996 = $998;
                                                                                                                                            break;
                                                                                                                                        case 'Parser.Reply.value':
                                                                                                                                            var $1002 = self.pst;
                                                                                                                                            var $1003 = self.val;
                                                                                                                                            var self = $1002;
                                                                                                                                            switch (self._) {
                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                    var $1005 = self.err;
                                                                                                                                                    var $1006 = self.nam;
                                                                                                                                                    var $1007 = self.ini;
                                                                                                                                                    var $1008 = self.idx;
                                                                                                                                                    var $1009 = self.str;
                                                                                                                                                    var _reply$pst$79 = Parser$State$new$(Parser$Error$maybe_combine$($995, $1005), $1006, $1007, $1008, $1009);
                                                                                                                                                    var $1010 = Parser$Reply$value$(_reply$pst$79, List$cons$($972, $1003));
                                                                                                                                                    var $1004 = $1010;
                                                                                                                                                    break;
                                                                                                                                            };
                                                                                                                                            var $996 = $1004;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $994 = $996;
                                                                                                                                    break;
                                                                                                                            };
                                                                                                                            var $988 = $994;
                                                                                                                            break;
                                                                                                                    };
                                                                                                                    var $981 = $988;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $979 = $981;
                                                                                                            break;
                                                                                                    };
                                                                                                    var $973 = $979;
                                                                                                    break;
                                                                                            };
                                                                                            var $965 = $973;
                                                                                            break;
                                                                                    };
                                                                                    var $963 = $965;
                                                                                    break;
                                                                            };
                                                                            var $957 = $963;
                                                                            break;
                                                                    };
                                                                    var $950 = $957;
                                                                    break;
                                                            };
                                                            var $948 = $950;
                                                            break;
                                                    };
                                                    var $942 = $948;
                                                    break;
                                            };
                                            var $935 = $942;
                                            break;
                                    };
                                    var $933 = $935;
                                    break;
                            };
                            return $933;
                        });
                        var $930 = $932;
                        break;
                };
                var $927 = $930;
                break;
            case 'List.nil':
                var $1011 = (_pst$3 => {
                    var $1012 = Parser$Reply$value$(_pst$3, List$nil);
                    return $1012;
                });
                var $927 = $1011;
                break;
        };
        return $927;
    };
    const Litereum$parse$term$match$cases = x0 => x1 => Litereum$parse$term$match$cases$(x0, x1);

    function Litereum$Term$match$(_name$1, _data$2, _cses$3) {
        var $1013 = ({
            _: 'Litereum.Term.match',
            'name': _name$1,
            'data': _data$2,
            'cses': _cses$3
        });
        return $1013;
    };
    const Litereum$Term$match = x0 => x1 => x2 => Litereum$Term$match$(x0, x1, x2);

    function Litereum$parse$term$match$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1015 = self.err;
                var _reply$8 = Litereum$parse$text$("case ", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1017 = self.err;
                        var self = $1015;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1019 = self.value;
                                var $1020 = Parser$Reply$error$(Parser$Error$combine$($1019, $1017));
                                var $1018 = $1020;
                                break;
                            case 'Maybe.none':
                                var $1021 = Parser$Reply$error$($1017);
                                var $1018 = $1021;
                                break;
                        };
                        var $1016 = $1018;
                        break;
                    case 'Parser.Reply.value':
                        var $1022 = self.pst;
                        var self = $1022;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1024 = self.err;
                                var $1025 = self.nam;
                                var $1026 = self.ini;
                                var $1027 = self.idx;
                                var $1028 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1015, $1024), $1025, $1026, $1027, $1028);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1030 = self.err;
                                        var _reply$22 = Litereum$parse$name$(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1032 = self.err;
                                                var self = $1030;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1034 = self.value;
                                                        var $1035 = Parser$Reply$error$(Parser$Error$combine$($1034, $1032));
                                                        var $1033 = $1035;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1036 = Parser$Reply$error$($1032);
                                                        var $1033 = $1036;
                                                        break;
                                                };
                                                var $1031 = $1033;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1037 = self.pst;
                                                var $1038 = self.val;
                                                var self = $1037;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1040 = self.err;
                                                        var $1041 = self.nam;
                                                        var $1042 = self.ini;
                                                        var $1043 = self.idx;
                                                        var $1044 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1030, $1040), $1041, $1042, $1043, $1044);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $1046 = self.err;
                                                                var _reply$36 = Litereum$parse$text$(":", _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1048 = self.err;
                                                                        var self = $1046;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $1050 = self.value;
                                                                                var $1051 = Parser$Reply$error$(Parser$Error$combine$($1050, $1048));
                                                                                var $1049 = $1051;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $1052 = Parser$Reply$error$($1048);
                                                                                var $1049 = $1052;
                                                                                break;
                                                                        };
                                                                        var $1047 = $1049;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1053 = self.pst;
                                                                        var self = $1053;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $1055 = self.err;
                                                                                var $1056 = self.nam;
                                                                                var $1057 = self.ini;
                                                                                var $1058 = self.idx;
                                                                                var $1059 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($1046, $1055), $1056, $1057, $1058, $1059);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $1061 = self.err;
                                                                                        var _reply$50 = Litereum$parse$name$(_reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1063 = self.err;
                                                                                                var self = $1061;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $1065 = self.value;
                                                                                                        var $1066 = Parser$Reply$error$(Parser$Error$combine$($1065, $1063));
                                                                                                        var $1064 = $1066;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $1067 = Parser$Reply$error$($1063);
                                                                                                        var $1064 = $1067;
                                                                                                        break;
                                                                                                };
                                                                                                var $1062 = $1064;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1068 = self.pst;
                                                                                                var $1069 = self.val;
                                                                                                var self = $1068;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $1071 = self.err;
                                                                                                        var $1072 = self.nam;
                                                                                                        var $1073 = self.ini;
                                                                                                        var $1074 = self.idx;
                                                                                                        var $1075 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($1061, $1071), $1072, $1073, $1074, $1075);
                                                                                                        var self = Litereum$get_data$(_world$1, $1069);
                                                                                                        switch (self._) {
                                                                                                            case 'Maybe.some':
                                                                                                                var $1077 = self.value;
                                                                                                                var _data$60 = $1077;
                                                                                                                var self = _data$60;
                                                                                                                switch (self._) {
                                                                                                                    case 'Litereum.Data.new':
                                                                                                                        var $1079 = self.constructors;
                                                                                                                        var $1080 = (_pst$63 => {
                                                                                                                            var self = _pst$63;
                                                                                                                            switch (self._) {
                                                                                                                                case 'Parser.State.new':
                                                                                                                                    var $1082 = self.err;
                                                                                                                                    var _reply$69 = Litereum$parse$text$("{", _pst$63);
                                                                                                                                    var self = _reply$69;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Parser.Reply.error':
                                                                                                                                            var $1084 = self.err;
                                                                                                                                            var self = $1082;
                                                                                                                                            switch (self._) {
                                                                                                                                                case 'Maybe.some':
                                                                                                                                                    var $1086 = self.value;
                                                                                                                                                    var $1087 = Parser$Reply$error$(Parser$Error$combine$($1086, $1084));
                                                                                                                                                    var $1085 = $1087;
                                                                                                                                                    break;
                                                                                                                                                case 'Maybe.none':
                                                                                                                                                    var $1088 = Parser$Reply$error$($1084);
                                                                                                                                                    var $1085 = $1088;
                                                                                                                                                    break;
                                                                                                                                            };
                                                                                                                                            var $1083 = $1085;
                                                                                                                                            break;
                                                                                                                                        case 'Parser.Reply.value':
                                                                                                                                            var $1089 = self.pst;
                                                                                                                                            var self = $1089;
                                                                                                                                            switch (self._) {
                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                    var $1091 = self.err;
                                                                                                                                                    var $1092 = self.nam;
                                                                                                                                                    var $1093 = self.ini;
                                                                                                                                                    var $1094 = self.idx;
                                                                                                                                                    var $1095 = self.str;
                                                                                                                                                    var _reply$pst$77 = Parser$State$new$(Parser$Error$maybe_combine$($1082, $1091), $1092, $1093, $1094, $1095);
                                                                                                                                                    var self = _reply$pst$77;
                                                                                                                                                    switch (self._) {
                                                                                                                                                        case 'Parser.State.new':
                                                                                                                                                            var $1097 = self.err;
                                                                                                                                                            var _reply$83 = Litereum$parse$term$match$cases$(_world$1, $1079)(_reply$pst$77);
                                                                                                                                                            var self = _reply$83;
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
                                                                                                                                                                            var _reply$pst$91 = Parser$State$new$(Parser$Error$maybe_combine$($1097, $1107), $1108, $1109, $1110, $1111);
                                                                                                                                                                            var self = _reply$pst$91;
                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                                                    var $1113 = self.err;
                                                                                                                                                                                    var _reply$97 = Litereum$parse$text$("}", _reply$pst$91);
                                                                                                                                                                                    var self = _reply$97;
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
                                                                                                                                                                                            var self = $1120;
                                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                                                                    var $1122 = self.err;
                                                                                                                                                                                                    var $1123 = self.nam;
                                                                                                                                                                                                    var $1124 = self.ini;
                                                                                                                                                                                                    var $1125 = self.idx;
                                                                                                                                                                                                    var $1126 = self.str;
                                                                                                                                                                                                    var _reply$pst$105 = Parser$State$new$(Parser$Error$maybe_combine$($1113, $1122), $1123, $1124, $1125, $1126);
                                                                                                                                                                                                    var $1127 = Parser$Reply$value$(_reply$pst$105, Litereum$Term$match$($1038, $1069, $1105));
                                                                                                                                                                                                    var $1121 = $1127;
                                                                                                                                                                                                    break;
                                                                                                                                                                                            };
                                                                                                                                                                                            var $1114 = $1121;
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
                                                                                                                                                    var $1090 = $1096;
                                                                                                                                                    break;
                                                                                                                                            };
                                                                                                                                            var $1083 = $1090;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1081 = $1083;
                                                                                                                                    break;
                                                                                                                            };
                                                                                                                            return $1081;
                                                                                                                        });
                                                                                                                        var $1078 = $1080;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $1076 = $1078;
                                                                                                                break;
                                                                                                            case 'Maybe.none':
                                                                                                                var $1128 = Parser$fail("Type not found.");
                                                                                                                var $1076 = $1128;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1076 = $1076(_reply$pst$58);
                                                                                                        var $1070 = $1076;
                                                                                                        break;
                                                                                                };
                                                                                                var $1062 = $1070;
                                                                                                break;
                                                                                        };
                                                                                        var $1060 = $1062;
                                                                                        break;
                                                                                };
                                                                                var $1054 = $1060;
                                                                                break;
                                                                        };
                                                                        var $1047 = $1054;
                                                                        break;
                                                                };
                                                                var $1045 = $1047;
                                                                break;
                                                        };
                                                        var $1039 = $1045;
                                                        break;
                                                };
                                                var $1031 = $1039;
                                                break;
                                        };
                                        var $1029 = $1031;
                                        break;
                                };
                                var $1023 = $1029;
                                break;
                        };
                        var $1016 = $1023;
                        break;
                };
                var $1014 = $1016;
                break;
        };
        return $1014;
    };
    const Litereum$parse$term$match = x0 => x1 => Litereum$parse$term$match$(x0, x1);

    function Parser$many1$(_parser$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var $1130 = self.err;
                var _reply$9 = _parser$2(_pst$3);
                var self = _reply$9;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1132 = self.err;
                        var self = $1130;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1134 = self.value;
                                var $1135 = Parser$Reply$error$(Parser$Error$combine$($1134, $1132));
                                var $1133 = $1135;
                                break;
                            case 'Maybe.none':
                                var $1136 = Parser$Reply$error$($1132);
                                var $1133 = $1136;
                                break;
                        };
                        var $1131 = $1133;
                        break;
                    case 'Parser.Reply.value':
                        var $1137 = self.pst;
                        var $1138 = self.val;
                        var self = $1137;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1140 = self.err;
                                var $1141 = self.nam;
                                var $1142 = self.ini;
                                var $1143 = self.idx;
                                var $1144 = self.str;
                                var _reply$pst$17 = Parser$State$new$(Parser$Error$maybe_combine$($1130, $1140), $1141, $1142, $1143, $1144);
                                var self = _reply$pst$17;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1146 = self.err;
                                        var _reply$23 = Parser$many$(_parser$2)(_reply$pst$17);
                                        var self = _reply$23;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1148 = self.err;
                                                var self = $1146;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1150 = self.value;
                                                        var $1151 = Parser$Reply$error$(Parser$Error$combine$($1150, $1148));
                                                        var $1149 = $1151;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1152 = Parser$Reply$error$($1148);
                                                        var $1149 = $1152;
                                                        break;
                                                };
                                                var $1147 = $1149;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1153 = self.pst;
                                                var $1154 = self.val;
                                                var self = $1153;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1156 = self.err;
                                                        var $1157 = self.nam;
                                                        var $1158 = self.ini;
                                                        var $1159 = self.idx;
                                                        var $1160 = self.str;
                                                        var _reply$pst$31 = Parser$State$new$(Parser$Error$maybe_combine$($1146, $1156), $1157, $1158, $1159, $1160);
                                                        var $1161 = Parser$Reply$value$(_reply$pst$31, List$cons$($1138, $1154));
                                                        var $1155 = $1161;
                                                        break;
                                                };
                                                var $1147 = $1155;
                                                break;
                                        };
                                        var $1145 = $1147;
                                        break;
                                };
                                var $1139 = $1145;
                                break;
                        };
                        var $1131 = $1139;
                        break;
                };
                var $1129 = $1131;
                break;
        };
        return $1129;
    };
    const Parser$many1 = x0 => x1 => Parser$many1$(x0, x1);

    function Parser$digit$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1163 = self.err;
                var $1164 = self.nam;
                var $1165 = self.ini;
                var $1166 = self.idx;
                var $1167 = self.str;
                var self = $1167;
                if (self.length === 0) {
                    var $1169 = Parser$Reply$fail$($1164, $1165, $1166, "Not a digit.");
                    var $1168 = $1169;
                } else {
                    var $1170 = self.charCodeAt(0);
                    var $1171 = self.slice(1);
                    var _pst$9 = Parser$State$new$($1163, $1164, $1165, Nat$succ$($1166), $1171);
                    var self = ($1170 === 48);
                    if (self) {
                        var $1173 = Parser$Reply$value$(_pst$9, 0n);
                        var $1172 = $1173;
                    } else {
                        var self = ($1170 === 49);
                        if (self) {
                            var $1175 = Parser$Reply$value$(_pst$9, 1n);
                            var $1174 = $1175;
                        } else {
                            var self = ($1170 === 50);
                            if (self) {
                                var $1177 = Parser$Reply$value$(_pst$9, 2n);
                                var $1176 = $1177;
                            } else {
                                var self = ($1170 === 51);
                                if (self) {
                                    var $1179 = Parser$Reply$value$(_pst$9, 3n);
                                    var $1178 = $1179;
                                } else {
                                    var self = ($1170 === 52);
                                    if (self) {
                                        var $1181 = Parser$Reply$value$(_pst$9, 4n);
                                        var $1180 = $1181;
                                    } else {
                                        var self = ($1170 === 53);
                                        if (self) {
                                            var $1183 = Parser$Reply$value$(_pst$9, 5n);
                                            var $1182 = $1183;
                                        } else {
                                            var self = ($1170 === 54);
                                            if (self) {
                                                var $1185 = Parser$Reply$value$(_pst$9, 6n);
                                                var $1184 = $1185;
                                            } else {
                                                var self = ($1170 === 55);
                                                if (self) {
                                                    var $1187 = Parser$Reply$value$(_pst$9, 7n);
                                                    var $1186 = $1187;
                                                } else {
                                                    var self = ($1170 === 56);
                                                    if (self) {
                                                        var $1189 = Parser$Reply$value$(_pst$9, 8n);
                                                        var $1188 = $1189;
                                                    } else {
                                                        var self = ($1170 === 57);
                                                        if (self) {
                                                            var $1191 = Parser$Reply$value$(_pst$9, 9n);
                                                            var $1190 = $1191;
                                                        } else {
                                                            var $1192 = Parser$Reply$fail$($1164, $1165, $1166, "Not a digit.");
                                                            var $1190 = $1192;
                                                        };
                                                        var $1188 = $1190;
                                                    };
                                                    var $1186 = $1188;
                                                };
                                                var $1184 = $1186;
                                            };
                                            var $1182 = $1184;
                                        };
                                        var $1180 = $1182;
                                    };
                                    var $1178 = $1180;
                                };
                                var $1176 = $1178;
                            };
                            var $1174 = $1176;
                        };
                        var $1172 = $1174;
                    };
                    var $1168 = $1172;
                };
                var $1162 = $1168;
                break;
        };
        return $1162;
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
                        var $1193 = self.head;
                        var $1194 = self.tail;
                        var $1195 = Nat$from_base$go$(_b$1, $1194, (_b$1 * _p$3), (($1193 * _p$3) + _res$4));
                        return $1195;
                    case 'List.nil':
                        var $1196 = _res$4;
                        return $1196;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$from_base$go = x0 => x1 => x2 => x3 => Nat$from_base$go$(x0, x1, x2, x3);

    function Nat$from_base$(_base$1, _ds$2) {
        var $1197 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $1197;
    };
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);

    function Parser$nat$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1199 = self.err;
                var _reply$7 = Parser$many1$(Parser$digit, _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1201 = self.err;
                        var self = $1199;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1203 = self.value;
                                var $1204 = Parser$Reply$error$(Parser$Error$combine$($1203, $1201));
                                var $1202 = $1204;
                                break;
                            case 'Maybe.none':
                                var $1205 = Parser$Reply$error$($1201);
                                var $1202 = $1205;
                                break;
                        };
                        var $1200 = $1202;
                        break;
                    case 'Parser.Reply.value':
                        var $1206 = self.pst;
                        var $1207 = self.val;
                        var self = $1206;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1209 = self.err;
                                var $1210 = self.nam;
                                var $1211 = self.ini;
                                var $1212 = self.idx;
                                var $1213 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1199, $1209), $1210, $1211, $1212, $1213);
                                var $1214 = Parser$Reply$value$(_reply$pst$15, Nat$from_base$(10n, $1207));
                                var $1208 = $1214;
                                break;
                        };
                        var $1200 = $1208;
                        break;
                };
                var $1198 = $1200;
                break;
        };
        return $1198;
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
                    var $1215 = _x$1;
                    return $1215;
                } else {
                    var $1216 = (self - 1n);
                    var $1217 = Nat$pow$aux$(_x$1, $1216, (_aux$3 * 2n));
                    return $1217;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$pow$aux = x0 => x1 => x2 => Nat$pow$aux$(x0, x1, x2);
    const Nat$pow = a0 => a1 => (a0 ** a1);

    function Litereum$Term$word$(_numb$1) {
        var $1218 = ({
            _: 'Litereum.Term.word',
            'numb': _numb$1
        });
        return $1218;
    };
    const Litereum$Term$word = x0 => Litereum$Term$word$(x0);

    function U64$new$(_value$1) {
        var $1219 = word_to_u64(_value$1);
        return $1219;
    };
    const U64$new = x0 => U64$new$(x0);
    const Nat$to_u64 = a0 => (a0 & 0xFFFFFFFFFFFFFFFFn);

    function Litereum$parse$term$word$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1221 = self.err;
                var _reply$8 = Litereum$parse$text$("#", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1223 = self.err;
                        var self = $1221;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1225 = self.value;
                                var $1226 = Parser$Reply$error$(Parser$Error$combine$($1225, $1223));
                                var $1224 = $1226;
                                break;
                            case 'Maybe.none':
                                var $1227 = Parser$Reply$error$($1223);
                                var $1224 = $1227;
                                break;
                        };
                        var $1222 = $1224;
                        break;
                    case 'Parser.Reply.value':
                        var $1228 = self.pst;
                        var self = $1228;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1230 = self.err;
                                var $1231 = self.nam;
                                var $1232 = self.ini;
                                var $1233 = self.idx;
                                var $1234 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1221, $1230), $1231, $1232, $1233, $1234);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1236 = self.err;
                                        var _reply$22 = Parser$nat$(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1238 = self.err;
                                                var self = $1236;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1240 = self.value;
                                                        var $1241 = Parser$Reply$error$(Parser$Error$combine$($1240, $1238));
                                                        var $1239 = $1241;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1242 = Parser$Reply$error$($1238);
                                                        var $1239 = $1242;
                                                        break;
                                                };
                                                var $1237 = $1239;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1243 = self.pst;
                                                var $1244 = self.val;
                                                var self = $1243;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1246 = self.err;
                                                        var $1247 = self.nam;
                                                        var $1248 = self.ini;
                                                        var $1249 = self.idx;
                                                        var $1250 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1236, $1246), $1247, $1248, $1249, $1250);
                                                        var self = ($1244 >= (2n ** 64n));
                                                        if (self) {
                                                            var $1252 = Parser$fail("Number out of bound");
                                                            var $1251 = $1252;
                                                        } else {
                                                            var $1253 = (_pst$31 => {
                                                                var $1254 = Parser$Reply$value$(_pst$31, Litereum$Term$word$(($1244 & 0xFFFFFFFFFFFFFFFFn)));
                                                                return $1254;
                                                            });
                                                            var $1251 = $1253;
                                                        };
                                                        var $1251 = $1251(_reply$pst$30);
                                                        var $1245 = $1251;
                                                        break;
                                                };
                                                var $1237 = $1245;
                                                break;
                                        };
                                        var $1235 = $1237;
                                        break;
                                };
                                var $1229 = $1235;
                                break;
                        };
                        var $1222 = $1229;
                        break;
                };
                var $1220 = $1222;
                break;
        };
        return $1220;
    };
    const Litereum$parse$term$word = x0 => x1 => Litereum$parse$term$word$(x0, x1);

    function Litereum$Term$compare$(_val0$1, _val1$2, _iflt$3, _ifeq$4, _ifgt$5) {
        var $1255 = ({
            _: 'Litereum.Term.compare',
            'val0': _val0$1,
            'val1': _val1$2,
            'iflt': _iflt$3,
            'ifeq': _ifeq$4,
            'ifgt': _ifgt$5
        });
        return $1255;
    };
    const Litereum$Term$compare = x0 => x1 => x2 => x3 => x4 => Litereum$Term$compare$(x0, x1, x2, x3, x4);

    function Litereum$parse$term$compare$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1257 = self.err;
                var _reply$8 = Litereum$parse$text$("compare", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1259 = self.err;
                        var self = $1257;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1261 = self.value;
                                var $1262 = Parser$Reply$error$(Parser$Error$combine$($1261, $1259));
                                var $1260 = $1262;
                                break;
                            case 'Maybe.none':
                                var $1263 = Parser$Reply$error$($1259);
                                var $1260 = $1263;
                                break;
                        };
                        var $1258 = $1260;
                        break;
                    case 'Parser.Reply.value':
                        var $1264 = self.pst;
                        var self = $1264;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1266 = self.err;
                                var $1267 = self.nam;
                                var $1268 = self.ini;
                                var $1269 = self.idx;
                                var $1270 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1257, $1266), $1267, $1268, $1269, $1270);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1272 = self.err;
                                        var _reply$22 = Litereum$parse$term$(_world$1)(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1274 = self.err;
                                                var self = $1272;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1276 = self.value;
                                                        var $1277 = Parser$Reply$error$(Parser$Error$combine$($1276, $1274));
                                                        var $1275 = $1277;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1278 = Parser$Reply$error$($1274);
                                                        var $1275 = $1278;
                                                        break;
                                                };
                                                var $1273 = $1275;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1279 = self.pst;
                                                var $1280 = self.val;
                                                var self = $1279;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1282 = self.err;
                                                        var $1283 = self.nam;
                                                        var $1284 = self.ini;
                                                        var $1285 = self.idx;
                                                        var $1286 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1272, $1282), $1283, $1284, $1285, $1286);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $1288 = self.err;
                                                                var _reply$36 = Litereum$parse$term$(_world$1)(_reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1290 = self.err;
                                                                        var self = $1288;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $1292 = self.value;
                                                                                var $1293 = Parser$Reply$error$(Parser$Error$combine$($1292, $1290));
                                                                                var $1291 = $1293;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $1294 = Parser$Reply$error$($1290);
                                                                                var $1291 = $1294;
                                                                                break;
                                                                        };
                                                                        var $1289 = $1291;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1295 = self.pst;
                                                                        var $1296 = self.val;
                                                                        var self = $1295;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $1298 = self.err;
                                                                                var $1299 = self.nam;
                                                                                var $1300 = self.ini;
                                                                                var $1301 = self.idx;
                                                                                var $1302 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($1288, $1298), $1299, $1300, $1301, $1302);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $1304 = self.err;
                                                                                        var _reply$50 = Litereum$parse$text$("{", _reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1306 = self.err;
                                                                                                var self = $1304;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $1308 = self.value;
                                                                                                        var $1309 = Parser$Reply$error$(Parser$Error$combine$($1308, $1306));
                                                                                                        var $1307 = $1309;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $1310 = Parser$Reply$error$($1306);
                                                                                                        var $1307 = $1310;
                                                                                                        break;
                                                                                                };
                                                                                                var $1305 = $1307;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1311 = self.pst;
                                                                                                var self = $1311;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $1313 = self.err;
                                                                                                        var $1314 = self.nam;
                                                                                                        var $1315 = self.ini;
                                                                                                        var $1316 = self.idx;
                                                                                                        var $1317 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($1304, $1313), $1314, $1315, $1316, $1317);
                                                                                                        var self = _reply$pst$58;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $1319 = self.err;
                                                                                                                var _reply$64 = Litereum$parse$text$("_<_:", _reply$pst$58);
                                                                                                                var self = _reply$64;
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $1321 = self.err;
                                                                                                                        var self = $1319;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Maybe.some':
                                                                                                                                var $1323 = self.value;
                                                                                                                                var $1324 = Parser$Reply$error$(Parser$Error$combine$($1323, $1321));
                                                                                                                                var $1322 = $1324;
                                                                                                                                break;
                                                                                                                            case 'Maybe.none':
                                                                                                                                var $1325 = Parser$Reply$error$($1321);
                                                                                                                                var $1322 = $1325;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1320 = $1322;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $1326 = self.pst;
                                                                                                                        var self = $1326;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $1328 = self.err;
                                                                                                                                var $1329 = self.nam;
                                                                                                                                var $1330 = self.ini;
                                                                                                                                var $1331 = self.idx;
                                                                                                                                var $1332 = self.str;
                                                                                                                                var _reply$pst$72 = Parser$State$new$(Parser$Error$maybe_combine$($1319, $1328), $1329, $1330, $1331, $1332);
                                                                                                                                var self = _reply$pst$72;
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.State.new':
                                                                                                                                        var $1334 = self.err;
                                                                                                                                        var _reply$78 = Litereum$parse$term$(_world$1)(_reply$pst$72);
                                                                                                                                        var self = _reply$78;
                                                                                                                                        switch (self._) {
                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                var $1336 = self.err;
                                                                                                                                                var self = $1334;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                        var $1338 = self.value;
                                                                                                                                                        var $1339 = Parser$Reply$error$(Parser$Error$combine$($1338, $1336));
                                                                                                                                                        var $1337 = $1339;
                                                                                                                                                        break;
                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                        var $1340 = Parser$Reply$error$($1336);
                                                                                                                                                        var $1337 = $1340;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1335 = $1337;
                                                                                                                                                break;
                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                var $1341 = self.pst;
                                                                                                                                                var $1342 = self.val;
                                                                                                                                                var self = $1341;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                        var $1344 = self.err;
                                                                                                                                                        var $1345 = self.nam;
                                                                                                                                                        var $1346 = self.ini;
                                                                                                                                                        var $1347 = self.idx;
                                                                                                                                                        var $1348 = self.str;
                                                                                                                                                        var _reply$pst$86 = Parser$State$new$(Parser$Error$maybe_combine$($1334, $1344), $1345, $1346, $1347, $1348);
                                                                                                                                                        var self = _reply$pst$86;
                                                                                                                                                        switch (self._) {
                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                var $1350 = self.err;
                                                                                                                                                                var _reply$92 = Litereum$parse$text$("_=_:", _reply$pst$86);
                                                                                                                                                                var self = _reply$92;
                                                                                                                                                                switch (self._) {
                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                        var $1352 = self.err;
                                                                                                                                                                        var self = $1350;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                var $1354 = self.value;
                                                                                                                                                                                var $1355 = Parser$Reply$error$(Parser$Error$combine$($1354, $1352));
                                                                                                                                                                                var $1353 = $1355;
                                                                                                                                                                                break;
                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                var $1356 = Parser$Reply$error$($1352);
                                                                                                                                                                                var $1353 = $1356;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $1351 = $1353;
                                                                                                                                                                        break;
                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                        var $1357 = self.pst;
                                                                                                                                                                        var self = $1357;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                var $1359 = self.err;
                                                                                                                                                                                var $1360 = self.nam;
                                                                                                                                                                                var $1361 = self.ini;
                                                                                                                                                                                var $1362 = self.idx;
                                                                                                                                                                                var $1363 = self.str;
                                                                                                                                                                                var _reply$pst$100 = Parser$State$new$(Parser$Error$maybe_combine$($1350, $1359), $1360, $1361, $1362, $1363);
                                                                                                                                                                                var self = _reply$pst$100;
                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                        var $1365 = self.err;
                                                                                                                                                                                        var _reply$106 = Litereum$parse$term$(_world$1)(_reply$pst$100);
                                                                                                                                                                                        var self = _reply$106;
                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                                                                var $1367 = self.err;
                                                                                                                                                                                                var self = $1365;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                                                                        var $1369 = self.value;
                                                                                                                                                                                                        var $1370 = Parser$Reply$error$(Parser$Error$combine$($1369, $1367));
                                                                                                                                                                                                        var $1368 = $1370;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                                                                        var $1371 = Parser$Reply$error$($1367);
                                                                                                                                                                                                        var $1368 = $1371;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $1366 = $1368;
                                                                                                                                                                                                break;
                                                                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                                                                var $1372 = self.pst;
                                                                                                                                                                                                var $1373 = self.val;
                                                                                                                                                                                                var self = $1372;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                        var $1375 = self.err;
                                                                                                                                                                                                        var $1376 = self.nam;
                                                                                                                                                                                                        var $1377 = self.ini;
                                                                                                                                                                                                        var $1378 = self.idx;
                                                                                                                                                                                                        var $1379 = self.str;
                                                                                                                                                                                                        var _reply$pst$114 = Parser$State$new$(Parser$Error$maybe_combine$($1365, $1375), $1376, $1377, $1378, $1379);
                                                                                                                                                                                                        var self = _reply$pst$114;
                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                                                var $1381 = self.err;
                                                                                                                                                                                                                var _reply$120 = Litereum$parse$text$("_>_:", _reply$pst$114);
                                                                                                                                                                                                                var self = _reply$120;
                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                                                                        var $1383 = self.err;
                                                                                                                                                                                                                        var self = $1381;
                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                                                                var $1385 = self.value;
                                                                                                                                                                                                                                var $1386 = Parser$Reply$error$(Parser$Error$combine$($1385, $1383));
                                                                                                                                                                                                                                var $1384 = $1386;
                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                                                                var $1387 = Parser$Reply$error$($1383);
                                                                                                                                                                                                                                var $1384 = $1387;
                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                        };
                                                                                                                                                                                                                        var $1382 = $1384;
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                                                                        var $1388 = self.pst;
                                                                                                                                                                                                                        var self = $1388;
                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                                                                var $1390 = self.err;
                                                                                                                                                                                                                                var $1391 = self.nam;
                                                                                                                                                                                                                                var $1392 = self.ini;
                                                                                                                                                                                                                                var $1393 = self.idx;
                                                                                                                                                                                                                                var $1394 = self.str;
                                                                                                                                                                                                                                var _reply$pst$128 = Parser$State$new$(Parser$Error$maybe_combine$($1381, $1390), $1391, $1392, $1393, $1394);
                                                                                                                                                                                                                                var self = _reply$pst$128;
                                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                                                        var $1396 = self.err;
                                                                                                                                                                                                                                        var _reply$134 = Litereum$parse$term$(_world$1)(_reply$pst$128);
                                                                                                                                                                                                                                        var self = _reply$134;
                                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                                                                                                                var $1398 = self.err;
                                                                                                                                                                                                                                                var self = $1396;
                                                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                                                                                                                        var $1400 = self.value;
                                                                                                                                                                                                                                                        var $1401 = Parser$Reply$error$(Parser$Error$combine$($1400, $1398));
                                                                                                                                                                                                                                                        var $1399 = $1401;
                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                                                                                                                        var $1402 = Parser$Reply$error$($1398);
                                                                                                                                                                                                                                                        var $1399 = $1402;
                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                var $1397 = $1399;
                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                                                                                                                var $1403 = self.pst;
                                                                                                                                                                                                                                                var $1404 = self.val;
                                                                                                                                                                                                                                                var self = $1403;
                                                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                                                                        var $1406 = self.err;
                                                                                                                                                                                                                                                        var $1407 = self.nam;
                                                                                                                                                                                                                                                        var $1408 = self.ini;
                                                                                                                                                                                                                                                        var $1409 = self.idx;
                                                                                                                                                                                                                                                        var $1410 = self.str;
                                                                                                                                                                                                                                                        var _reply$pst$142 = Parser$State$new$(Parser$Error$maybe_combine$($1396, $1406), $1407, $1408, $1409, $1410);
                                                                                                                                                                                                                                                        var self = _reply$pst$142;
                                                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                                                                                                var $1412 = self.err;
                                                                                                                                                                                                                                                                var _reply$148 = Litereum$parse$text$("}", _reply$pst$142);
                                                                                                                                                                                                                                                                var self = _reply$148;
                                                                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                                                                                                                        var $1414 = self.err;
                                                                                                                                                                                                                                                                        var self = $1412;
                                                                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                                                                                                                var $1416 = self.value;
                                                                                                                                                                                                                                                                                var $1417 = Parser$Reply$error$(Parser$Error$combine$($1416, $1414));
                                                                                                                                                                                                                                                                                var $1415 = $1417;
                                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                                                                                                                var $1418 = Parser$Reply$error$($1414);
                                                                                                                                                                                                                                                                                var $1415 = $1418;
                                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                                                        var $1413 = $1415;
                                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                                                                                                                        var $1419 = self.pst;
                                                                                                                                                                                                                                                                        var self = $1419;
                                                                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                                                                                                                var $1421 = self.err;
                                                                                                                                                                                                                                                                                var $1422 = self.nam;
                                                                                                                                                                                                                                                                                var $1423 = self.ini;
                                                                                                                                                                                                                                                                                var $1424 = self.idx;
                                                                                                                                                                                                                                                                                var $1425 = self.str;
                                                                                                                                                                                                                                                                                var _reply$pst$156 = Parser$State$new$(Parser$Error$maybe_combine$($1412, $1421), $1422, $1423, $1424, $1425);
                                                                                                                                                                                                                                                                                var $1426 = Parser$Reply$value$(_reply$pst$156, Litereum$Term$compare$($1280, $1296, $1342, $1373, $1404));
                                                                                                                                                                                                                                                                                var $1420 = $1426;
                                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                                                        var $1413 = $1420;
                                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                                var $1411 = $1413;
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                                        var $1405 = $1411;
                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                var $1397 = $1405;
                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                        var $1395 = $1397;
                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                var $1389 = $1395;
                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                        };
                                                                                                                                                                                                                        var $1382 = $1389;
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                };
                                                                                                                                                                                                                var $1380 = $1382;
                                                                                                                                                                                                                break;
                                                                                                                                                                                                        };
                                                                                                                                                                                                        var $1374 = $1380;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $1366 = $1374;
                                                                                                                                                                                                break;
                                                                                                                                                                                        };
                                                                                                                                                                                        var $1364 = $1366;
                                                                                                                                                                                        break;
                                                                                                                                                                                };
                                                                                                                                                                                var $1358 = $1364;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $1351 = $1358;
                                                                                                                                                                        break;
                                                                                                                                                                };
                                                                                                                                                                var $1349 = $1351;
                                                                                                                                                                break;
                                                                                                                                                        };
                                                                                                                                                        var $1343 = $1349;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1335 = $1343;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $1333 = $1335;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $1327 = $1333;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1320 = $1327;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $1318 = $1320;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1312 = $1318;
                                                                                                        break;
                                                                                                };
                                                                                                var $1305 = $1312;
                                                                                                break;
                                                                                        };
                                                                                        var $1303 = $1305;
                                                                                        break;
                                                                                };
                                                                                var $1297 = $1303;
                                                                                break;
                                                                        };
                                                                        var $1289 = $1297;
                                                                        break;
                                                                };
                                                                var $1287 = $1289;
                                                                break;
                                                        };
                                                        var $1281 = $1287;
                                                        break;
                                                };
                                                var $1273 = $1281;
                                                break;
                                        };
                                        var $1271 = $1273;
                                        break;
                                };
                                var $1265 = $1271;
                                break;
                        };
                        var $1258 = $1265;
                        break;
                };
                var $1256 = $1258;
                break;
        };
        return $1256;
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
                var $1428 = self.err;
                var _reply$7 = Litereum$parse$text$("+", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1430 = self.err;
                        var self = $1428;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1432 = self.value;
                                var $1433 = Parser$Reply$error$(Parser$Error$combine$($1432, $1430));
                                var $1431 = $1433;
                                break;
                            case 'Maybe.none':
                                var $1434 = Parser$Reply$error$($1430);
                                var $1431 = $1434;
                                break;
                        };
                        var $1429 = $1431;
                        break;
                    case 'Parser.Reply.value':
                        var $1435 = self.pst;
                        var self = $1435;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1437 = self.err;
                                var $1438 = self.nam;
                                var $1439 = self.ini;
                                var $1440 = self.idx;
                                var $1441 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1428, $1437), $1438, $1439, $1440, $1441);
                                var $1442 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$add));
                                var $1436 = $1442;
                                break;
                        };
                        var $1429 = $1436;
                        break;
                };
                var $1427 = $1429;
                break;
        };
        return $1427;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1444 = self.err;
                var _reply$7 = Litereum$parse$text$("-", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1446 = self.err;
                        var self = $1444;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1448 = self.value;
                                var $1449 = Parser$Reply$error$(Parser$Error$combine$($1448, $1446));
                                var $1447 = $1449;
                                break;
                            case 'Maybe.none':
                                var $1450 = Parser$Reply$error$($1446);
                                var $1447 = $1450;
                                break;
                        };
                        var $1445 = $1447;
                        break;
                    case 'Parser.Reply.value':
                        var $1451 = self.pst;
                        var self = $1451;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1453 = self.err;
                                var $1454 = self.nam;
                                var $1455 = self.ini;
                                var $1456 = self.idx;
                                var $1457 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1444, $1453), $1454, $1455, $1456, $1457);
                                var $1458 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$sub));
                                var $1452 = $1458;
                                break;
                        };
                        var $1445 = $1452;
                        break;
                };
                var $1443 = $1445;
                break;
        };
        return $1443;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1460 = self.err;
                var _reply$7 = Litereum$parse$text$("*", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1462 = self.err;
                        var self = $1460;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1464 = self.value;
                                var $1465 = Parser$Reply$error$(Parser$Error$combine$($1464, $1462));
                                var $1463 = $1465;
                                break;
                            case 'Maybe.none':
                                var $1466 = Parser$Reply$error$($1462);
                                var $1463 = $1466;
                                break;
                        };
                        var $1461 = $1463;
                        break;
                    case 'Parser.Reply.value':
                        var $1467 = self.pst;
                        var self = $1467;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1469 = self.err;
                                var $1470 = self.nam;
                                var $1471 = self.ini;
                                var $1472 = self.idx;
                                var $1473 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1460, $1469), $1470, $1471, $1472, $1473);
                                var $1474 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$mul));
                                var $1468 = $1474;
                                break;
                        };
                        var $1461 = $1468;
                        break;
                };
                var $1459 = $1461;
                break;
        };
        return $1459;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1476 = self.err;
                var _reply$7 = Litereum$parse$text$("/", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1478 = self.err;
                        var self = $1476;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1480 = self.value;
                                var $1481 = Parser$Reply$error$(Parser$Error$combine$($1480, $1478));
                                var $1479 = $1481;
                                break;
                            case 'Maybe.none':
                                var $1482 = Parser$Reply$error$($1478);
                                var $1479 = $1482;
                                break;
                        };
                        var $1477 = $1479;
                        break;
                    case 'Parser.Reply.value':
                        var $1483 = self.pst;
                        var self = $1483;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1485 = self.err;
                                var $1486 = self.nam;
                                var $1487 = self.ini;
                                var $1488 = self.idx;
                                var $1489 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1476, $1485), $1486, $1487, $1488, $1489);
                                var $1490 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$div));
                                var $1484 = $1490;
                                break;
                        };
                        var $1477 = $1484;
                        break;
                };
                var $1475 = $1477;
                break;
        };
        return $1475;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1492 = self.err;
                var _reply$7 = Litereum$parse$text$("%", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1494 = self.err;
                        var self = $1492;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1496 = self.value;
                                var $1497 = Parser$Reply$error$(Parser$Error$combine$($1496, $1494));
                                var $1495 = $1497;
                                break;
                            case 'Maybe.none':
                                var $1498 = Parser$Reply$error$($1494);
                                var $1495 = $1498;
                                break;
                        };
                        var $1493 = $1495;
                        break;
                    case 'Parser.Reply.value':
                        var $1499 = self.pst;
                        var self = $1499;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1501 = self.err;
                                var $1502 = self.nam;
                                var $1503 = self.ini;
                                var $1504 = self.idx;
                                var $1505 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1492, $1501), $1502, $1503, $1504, $1505);
                                var $1506 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$mod));
                                var $1500 = $1506;
                                break;
                        };
                        var $1493 = $1500;
                        break;
                };
                var $1491 = $1493;
                break;
        };
        return $1491;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1508 = self.err;
                var _reply$7 = Litereum$parse$text$("|", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1510 = self.err;
                        var self = $1508;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1512 = self.value;
                                var $1513 = Parser$Reply$error$(Parser$Error$combine$($1512, $1510));
                                var $1511 = $1513;
                                break;
                            case 'Maybe.none':
                                var $1514 = Parser$Reply$error$($1510);
                                var $1511 = $1514;
                                break;
                        };
                        var $1509 = $1511;
                        break;
                    case 'Parser.Reply.value':
                        var $1515 = self.pst;
                        var self = $1515;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1517 = self.err;
                                var $1518 = self.nam;
                                var $1519 = self.ini;
                                var $1520 = self.idx;
                                var $1521 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1508, $1517), $1518, $1519, $1520, $1521);
                                var $1522 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$or));
                                var $1516 = $1522;
                                break;
                        };
                        var $1509 = $1516;
                        break;
                };
                var $1507 = $1509;
                break;
        };
        return $1507;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1524 = self.err;
                var _reply$7 = Litereum$parse$text$("&", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1526 = self.err;
                        var self = $1524;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1528 = self.value;
                                var $1529 = Parser$Reply$error$(Parser$Error$combine$($1528, $1526));
                                var $1527 = $1529;
                                break;
                            case 'Maybe.none':
                                var $1530 = Parser$Reply$error$($1526);
                                var $1527 = $1530;
                                break;
                        };
                        var $1525 = $1527;
                        break;
                    case 'Parser.Reply.value':
                        var $1531 = self.pst;
                        var self = $1531;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1533 = self.err;
                                var $1534 = self.nam;
                                var $1535 = self.ini;
                                var $1536 = self.idx;
                                var $1537 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1524, $1533), $1534, $1535, $1536, $1537);
                                var $1538 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$and));
                                var $1532 = $1538;
                                break;
                        };
                        var $1525 = $1532;
                        break;
                };
                var $1523 = $1525;
                break;
        };
        return $1523;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1540 = self.err;
                var _reply$7 = Litereum$parse$text$("^", _pst$1);
                var self = _reply$7;
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
                        var self = $1547;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1549 = self.err;
                                var $1550 = self.nam;
                                var $1551 = self.ini;
                                var $1552 = self.idx;
                                var $1553 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1540, $1549), $1550, $1551, $1552, $1553);
                                var $1554 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$xor));
                                var $1548 = $1554;
                                break;
                        };
                        var $1541 = $1548;
                        break;
                };
                var $1539 = $1541;
                break;
        };
        return $1539;
    }), List$cons$((_pst$1 => {
        var $1555 = Parser$Reply$value$(_pst$1, Maybe$none);
        return $1555;
    }), List$nil))))))))));

    function Litereum$Term$operate$(_oper$1, _val0$2, _val1$3) {
        var $1556 = ({
            _: 'Litereum.Term.operate',
            'oper': _oper$1,
            'val0': _val0$2,
            'val1': _val1$3
        });
        return $1556;
    };
    const Litereum$Term$operate = x0 => x1 => x2 => Litereum$Term$operate$(x0, x1, x2);

    function Litereum$parse$term$operate$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1558 = self.err;
                var _reply$8 = Litereum$parse$term$operation(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1560 = self.err;
                        var self = $1558;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1562 = self.value;
                                var $1563 = Parser$Reply$error$(Parser$Error$combine$($1562, $1560));
                                var $1561 = $1563;
                                break;
                            case 'Maybe.none':
                                var $1564 = Parser$Reply$error$($1560);
                                var $1561 = $1564;
                                break;
                        };
                        var $1559 = $1561;
                        break;
                    case 'Parser.Reply.value':
                        var $1565 = self.pst;
                        var $1566 = self.val;
                        var self = $1565;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1568 = self.err;
                                var $1569 = self.nam;
                                var $1570 = self.ini;
                                var $1571 = self.idx;
                                var $1572 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1558, $1568), $1569, $1570, $1571, $1572);
                                var self = $1566;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $1574 = self.value;
                                        var $1575 = (_pst$18 => {
                                            var self = _pst$18;
                                            switch (self._) {
                                                case 'Parser.State.new':
                                                    var $1577 = self.err;
                                                    var _reply$24 = Litereum$parse$text$("(", _pst$18);
                                                    var self = _reply$24;
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $1579 = self.err;
                                                            var self = $1577;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $1581 = self.value;
                                                                    var $1582 = Parser$Reply$error$(Parser$Error$combine$($1581, $1579));
                                                                    var $1580 = $1582;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $1583 = Parser$Reply$error$($1579);
                                                                    var $1580 = $1583;
                                                                    break;
                                                            };
                                                            var $1578 = $1580;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $1584 = self.pst;
                                                            var self = $1584;
                                                            switch (self._) {
                                                                case 'Parser.State.new':
                                                                    var $1586 = self.err;
                                                                    var $1587 = self.nam;
                                                                    var $1588 = self.ini;
                                                                    var $1589 = self.idx;
                                                                    var $1590 = self.str;
                                                                    var _reply$pst$32 = Parser$State$new$(Parser$Error$maybe_combine$($1577, $1586), $1587, $1588, $1589, $1590);
                                                                    var self = _reply$pst$32;
                                                                    switch (self._) {
                                                                        case 'Parser.State.new':
                                                                            var $1592 = self.err;
                                                                            var _reply$38 = Litereum$parse$term$(_world$1)(_reply$pst$32);
                                                                            var self = _reply$38;
                                                                            switch (self._) {
                                                                                case 'Parser.Reply.error':
                                                                                    var $1594 = self.err;
                                                                                    var self = $1592;
                                                                                    switch (self._) {
                                                                                        case 'Maybe.some':
                                                                                            var $1596 = self.value;
                                                                                            var $1597 = Parser$Reply$error$(Parser$Error$combine$($1596, $1594));
                                                                                            var $1595 = $1597;
                                                                                            break;
                                                                                        case 'Maybe.none':
                                                                                            var $1598 = Parser$Reply$error$($1594);
                                                                                            var $1595 = $1598;
                                                                                            break;
                                                                                    };
                                                                                    var $1593 = $1595;
                                                                                    break;
                                                                                case 'Parser.Reply.value':
                                                                                    var $1599 = self.pst;
                                                                                    var $1600 = self.val;
                                                                                    var self = $1599;
                                                                                    switch (self._) {
                                                                                        case 'Parser.State.new':
                                                                                            var $1602 = self.err;
                                                                                            var $1603 = self.nam;
                                                                                            var $1604 = self.ini;
                                                                                            var $1605 = self.idx;
                                                                                            var $1606 = self.str;
                                                                                            var _reply$pst$46 = Parser$State$new$(Parser$Error$maybe_combine$($1592, $1602), $1603, $1604, $1605, $1606);
                                                                                            var self = _reply$pst$46;
                                                                                            switch (self._) {
                                                                                                case 'Parser.State.new':
                                                                                                    var $1608 = self.err;
                                                                                                    var _reply$52 = Parser$maybe$(Litereum$parse$text(","), _reply$pst$46);
                                                                                                    var self = _reply$52;
                                                                                                    switch (self._) {
                                                                                                        case 'Parser.Reply.error':
                                                                                                            var $1610 = self.err;
                                                                                                            var self = $1608;
                                                                                                            switch (self._) {
                                                                                                                case 'Maybe.some':
                                                                                                                    var $1612 = self.value;
                                                                                                                    var $1613 = Parser$Reply$error$(Parser$Error$combine$($1612, $1610));
                                                                                                                    var $1611 = $1613;
                                                                                                                    break;
                                                                                                                case 'Maybe.none':
                                                                                                                    var $1614 = Parser$Reply$error$($1610);
                                                                                                                    var $1611 = $1614;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $1609 = $1611;
                                                                                                            break;
                                                                                                        case 'Parser.Reply.value':
                                                                                                            var $1615 = self.pst;
                                                                                                            var self = $1615;
                                                                                                            switch (self._) {
                                                                                                                case 'Parser.State.new':
                                                                                                                    var $1617 = self.err;
                                                                                                                    var $1618 = self.nam;
                                                                                                                    var $1619 = self.ini;
                                                                                                                    var $1620 = self.idx;
                                                                                                                    var $1621 = self.str;
                                                                                                                    var _reply$pst$60 = Parser$State$new$(Parser$Error$maybe_combine$($1608, $1617), $1618, $1619, $1620, $1621);
                                                                                                                    var self = _reply$pst$60;
                                                                                                                    switch (self._) {
                                                                                                                        case 'Parser.State.new':
                                                                                                                            var $1623 = self.err;
                                                                                                                            var _reply$66 = Litereum$parse$term$(_world$1)(_reply$pst$60);
                                                                                                                            var self = _reply$66;
                                                                                                                            switch (self._) {
                                                                                                                                case 'Parser.Reply.error':
                                                                                                                                    var $1625 = self.err;
                                                                                                                                    var self = $1623;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Maybe.some':
                                                                                                                                            var $1627 = self.value;
                                                                                                                                            var $1628 = Parser$Reply$error$(Parser$Error$combine$($1627, $1625));
                                                                                                                                            var $1626 = $1628;
                                                                                                                                            break;
                                                                                                                                        case 'Maybe.none':
                                                                                                                                            var $1629 = Parser$Reply$error$($1625);
                                                                                                                                            var $1626 = $1629;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1624 = $1626;
                                                                                                                                    break;
                                                                                                                                case 'Parser.Reply.value':
                                                                                                                                    var $1630 = self.pst;
                                                                                                                                    var $1631 = self.val;
                                                                                                                                    var self = $1630;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Parser.State.new':
                                                                                                                                            var $1633 = self.err;
                                                                                                                                            var $1634 = self.nam;
                                                                                                                                            var $1635 = self.ini;
                                                                                                                                            var $1636 = self.idx;
                                                                                                                                            var $1637 = self.str;
                                                                                                                                            var _reply$pst$74 = Parser$State$new$(Parser$Error$maybe_combine$($1623, $1633), $1634, $1635, $1636, $1637);
                                                                                                                                            var self = _reply$pst$74;
                                                                                                                                            switch (self._) {
                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                    var $1639 = self.err;
                                                                                                                                                    var _reply$80 = Litereum$parse$text$(")", _reply$pst$74);
                                                                                                                                                    var self = _reply$80;
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
                                                                                                                                                                    var _reply$pst$88 = Parser$State$new$(Parser$Error$maybe_combine$($1639, $1648), $1649, $1650, $1651, $1652);
                                                                                                                                                                    var $1653 = Parser$Reply$value$(_reply$pst$88, Litereum$Term$operate$($1574, $1600, $1631));
                                                                                                                                                                    var $1647 = $1653;
                                                                                                                                                                    break;
                                                                                                                                                            };
                                                                                                                                                            var $1640 = $1647;
                                                                                                                                                            break;
                                                                                                                                                    };
                                                                                                                                                    var $1638 = $1640;
                                                                                                                                                    break;
                                                                                                                                            };
                                                                                                                                            var $1632 = $1638;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1624 = $1632;
                                                                                                                                    break;
                                                                                                                            };
                                                                                                                            var $1622 = $1624;
                                                                                                                            break;
                                                                                                                    };
                                                                                                                    var $1616 = $1622;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $1609 = $1616;
                                                                                                            break;
                                                                                                    };
                                                                                                    var $1607 = $1609;
                                                                                                    break;
                                                                                            };
                                                                                            var $1601 = $1607;
                                                                                            break;
                                                                                    };
                                                                                    var $1593 = $1601;
                                                                                    break;
                                                                            };
                                                                            var $1591 = $1593;
                                                                            break;
                                                                    };
                                                                    var $1585 = $1591;
                                                                    break;
                                                            };
                                                            var $1578 = $1585;
                                                            break;
                                                    };
                                                    var $1576 = $1578;
                                                    break;
                                            };
                                            return $1576;
                                        });
                                        var $1573 = $1575;
                                        break;
                                    case 'Maybe.none':
                                        var $1654 = Parser$fail("Not an operation.");
                                        var $1573 = $1654;
                                        break;
                                };
                                var $1573 = $1573(_reply$pst$16);
                                var $1567 = $1573;
                                break;
                        };
                        var $1559 = $1567;
                        break;
                };
                var $1557 = $1559;
                break;
        };
        return $1557;
    };
    const Litereum$parse$term$operate = x0 => x1 => Litereum$parse$term$operate$(x0, x1);

    function Litereum$Term$bind$(_bond$1, _main$2, _body$3) {
        var $1655 = ({
            _: 'Litereum.Term.bind',
            'bond': _bond$1,
            'main': _main$2,
            'body': _body$3
        });
        return $1655;
    };
    const Litereum$Term$bind = x0 => x1 => x2 => Litereum$Term$bind$(x0, x1, x2);

    function Litereum$parse$term$bind$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1657 = self.err;
                var _reply$8 = Litereum$parse$text$("bind", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1659 = self.err;
                        var self = $1657;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1661 = self.value;
                                var $1662 = Parser$Reply$error$(Parser$Error$combine$($1661, $1659));
                                var $1660 = $1662;
                                break;
                            case 'Maybe.none':
                                var $1663 = Parser$Reply$error$($1659);
                                var $1660 = $1663;
                                break;
                        };
                        var $1658 = $1660;
                        break;
                    case 'Parser.Reply.value':
                        var $1664 = self.pst;
                        var self = $1664;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1666 = self.err;
                                var $1667 = self.nam;
                                var $1668 = self.ini;
                                var $1669 = self.idx;
                                var $1670 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1657, $1666), $1667, $1668, $1669, $1670);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1672 = self.err;
                                        var _reply$22 = Litereum$parse$name$(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1674 = self.err;
                                                var self = $1672;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1676 = self.value;
                                                        var $1677 = Parser$Reply$error$(Parser$Error$combine$($1676, $1674));
                                                        var $1675 = $1677;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1678 = Parser$Reply$error$($1674);
                                                        var $1675 = $1678;
                                                        break;
                                                };
                                                var $1673 = $1675;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1679 = self.pst;
                                                var $1680 = self.val;
                                                var self = $1679;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1682 = self.err;
                                                        var $1683 = self.nam;
                                                        var $1684 = self.ini;
                                                        var $1685 = self.idx;
                                                        var $1686 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1672, $1682), $1683, $1684, $1685, $1686);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $1688 = self.err;
                                                                var _reply$36 = Litereum$parse$text$("{", _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1690 = self.err;
                                                                        var self = $1688;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $1692 = self.value;
                                                                                var $1693 = Parser$Reply$error$(Parser$Error$combine$($1692, $1690));
                                                                                var $1691 = $1693;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $1694 = Parser$Reply$error$($1690);
                                                                                var $1691 = $1694;
                                                                                break;
                                                                        };
                                                                        var $1689 = $1691;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1695 = self.pst;
                                                                        var self = $1695;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $1697 = self.err;
                                                                                var $1698 = self.nam;
                                                                                var $1699 = self.ini;
                                                                                var $1700 = self.idx;
                                                                                var $1701 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($1688, $1697), $1698, $1699, $1700, $1701);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $1703 = self.err;
                                                                                        var _reply$50 = Litereum$parse$term$(_world$1)(_reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1705 = self.err;
                                                                                                var self = $1703;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $1707 = self.value;
                                                                                                        var $1708 = Parser$Reply$error$(Parser$Error$combine$($1707, $1705));
                                                                                                        var $1706 = $1708;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $1709 = Parser$Reply$error$($1705);
                                                                                                        var $1706 = $1709;
                                                                                                        break;
                                                                                                };
                                                                                                var $1704 = $1706;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1710 = self.pst;
                                                                                                var $1711 = self.val;
                                                                                                var self = $1710;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $1713 = self.err;
                                                                                                        var $1714 = self.nam;
                                                                                                        var $1715 = self.ini;
                                                                                                        var $1716 = self.idx;
                                                                                                        var $1717 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($1703, $1713), $1714, $1715, $1716, $1717);
                                                                                                        var self = _reply$pst$58;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $1719 = self.err;
                                                                                                                var _reply$64 = Litereum$parse$text$("}", _reply$pst$58);
                                                                                                                var self = _reply$64;
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
                                                                                                                        var self = $1726;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $1728 = self.err;
                                                                                                                                var $1729 = self.nam;
                                                                                                                                var $1730 = self.ini;
                                                                                                                                var $1731 = self.idx;
                                                                                                                                var $1732 = self.str;
                                                                                                                                var _reply$pst$72 = Parser$State$new$(Parser$Error$maybe_combine$($1719, $1728), $1729, $1730, $1731, $1732);
                                                                                                                                var self = _reply$pst$72;
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.State.new':
                                                                                                                                        var $1734 = self.err;
                                                                                                                                        var _reply$78 = Litereum$parse$term$(_world$1)(_reply$pst$72);
                                                                                                                                        var self = _reply$78;
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
                                                                                                                                                        var _reply$pst$86 = Parser$State$new$(Parser$Error$maybe_combine$($1734, $1744), $1745, $1746, $1747, $1748);
                                                                                                                                                        var $1749 = Parser$Reply$value$(_reply$pst$86, Litereum$Term$bind$($1680, $1711, $1742));
                                                                                                                                                        var $1743 = $1749;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1735 = $1743;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $1733 = $1735;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $1727 = $1733;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1720 = $1727;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $1718 = $1720;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1712 = $1718;
                                                                                                        break;
                                                                                                };
                                                                                                var $1704 = $1712;
                                                                                                break;
                                                                                        };
                                                                                        var $1702 = $1704;
                                                                                        break;
                                                                                };
                                                                                var $1696 = $1702;
                                                                                break;
                                                                        };
                                                                        var $1689 = $1696;
                                                                        break;
                                                                };
                                                                var $1687 = $1689;
                                                                break;
                                                        };
                                                        var $1681 = $1687;
                                                        break;
                                                };
                                                var $1673 = $1681;
                                                break;
                                        };
                                        var $1671 = $1673;
                                        break;
                                };
                                var $1665 = $1671;
                                break;
                        };
                        var $1658 = $1665;
                        break;
                };
                var $1656 = $1658;
                break;
        };
        return $1656;
    };
    const Litereum$parse$term$bind = x0 => x1 => Litereum$parse$term$bind$(x0, x1);

    function Litereum$Term$run$(_name$1, _type$2, _expr$3, _body$4) {
        var $1750 = ({
            _: 'Litereum.Term.run',
            'name': _name$1,
            'type': _type$2,
            'expr': _expr$3,
            'body': _body$4
        });
        return $1750;
    };
    const Litereum$Term$run = x0 => x1 => x2 => x3 => Litereum$Term$run$(x0, x1, x2, x3);

    function Litereum$parse$term$run$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1752 = self.err;
                var _reply$8 = Litereum$parse$text$("run", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1754 = self.err;
                        var self = $1752;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1756 = self.value;
                                var $1757 = Parser$Reply$error$(Parser$Error$combine$($1756, $1754));
                                var $1755 = $1757;
                                break;
                            case 'Maybe.none':
                                var $1758 = Parser$Reply$error$($1754);
                                var $1755 = $1758;
                                break;
                        };
                        var $1753 = $1755;
                        break;
                    case 'Parser.Reply.value':
                        var $1759 = self.pst;
                        var self = $1759;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1761 = self.err;
                                var $1762 = self.nam;
                                var $1763 = self.ini;
                                var $1764 = self.idx;
                                var $1765 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1752, $1761), $1762, $1763, $1764, $1765);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1767 = self.err;
                                        var _reply$22 = Parser$choice$(List$cons$((_pst$22 => {
                                            var self = _pst$22;
                                            switch (self._) {
                                                case 'Parser.State.new':
                                                    var $1770 = self.err;
                                                    var _reply$28 = Litereum$parse$name$(_pst$22);
                                                    var self = _reply$28;
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $1772 = self.err;
                                                            var self = $1770;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $1774 = self.value;
                                                                    var $1775 = Parser$Reply$error$(Parser$Error$combine$($1774, $1772));
                                                                    var $1773 = $1775;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $1776 = Parser$Reply$error$($1772);
                                                                    var $1773 = $1776;
                                                                    break;
                                                            };
                                                            var $1771 = $1773;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $1777 = self.pst;
                                                            var $1778 = self.val;
                                                            var self = $1777;
                                                            switch (self._) {
                                                                case 'Parser.State.new':
                                                                    var $1780 = self.err;
                                                                    var $1781 = self.nam;
                                                                    var $1782 = self.ini;
                                                                    var $1783 = self.idx;
                                                                    var $1784 = self.str;
                                                                    var _reply$pst$36 = Parser$State$new$(Parser$Error$maybe_combine$($1770, $1780), $1781, $1782, $1783, $1784);
                                                                    var self = _reply$pst$36;
                                                                    switch (self._) {
                                                                        case 'Parser.State.new':
                                                                            var $1786 = self.err;
                                                                            var _reply$42 = Litereum$parse$text$(":", _reply$pst$36);
                                                                            var self = _reply$42;
                                                                            switch (self._) {
                                                                                case 'Parser.Reply.error':
                                                                                    var $1788 = self.err;
                                                                                    var self = $1786;
                                                                                    switch (self._) {
                                                                                        case 'Maybe.some':
                                                                                            var $1790 = self.value;
                                                                                            var $1791 = Parser$Reply$error$(Parser$Error$combine$($1790, $1788));
                                                                                            var $1789 = $1791;
                                                                                            break;
                                                                                        case 'Maybe.none':
                                                                                            var $1792 = Parser$Reply$error$($1788);
                                                                                            var $1789 = $1792;
                                                                                            break;
                                                                                    };
                                                                                    var $1787 = $1789;
                                                                                    break;
                                                                                case 'Parser.Reply.value':
                                                                                    var $1793 = self.pst;
                                                                                    var self = $1793;
                                                                                    switch (self._) {
                                                                                        case 'Parser.State.new':
                                                                                            var $1795 = self.err;
                                                                                            var $1796 = self.nam;
                                                                                            var $1797 = self.ini;
                                                                                            var $1798 = self.idx;
                                                                                            var $1799 = self.str;
                                                                                            var _reply$pst$50 = Parser$State$new$(Parser$Error$maybe_combine$($1786, $1795), $1796, $1797, $1798, $1799);
                                                                                            var self = _reply$pst$50;
                                                                                            switch (self._) {
                                                                                                case 'Parser.State.new':
                                                                                                    var $1801 = self.err;
                                                                                                    var _reply$56 = Litereum$parse$type$(_world$1)(_reply$pst$50);
                                                                                                    var self = _reply$56;
                                                                                                    switch (self._) {
                                                                                                        case 'Parser.Reply.error':
                                                                                                            var $1803 = self.err;
                                                                                                            var self = $1801;
                                                                                                            switch (self._) {
                                                                                                                case 'Maybe.some':
                                                                                                                    var $1805 = self.value;
                                                                                                                    var $1806 = Parser$Reply$error$(Parser$Error$combine$($1805, $1803));
                                                                                                                    var $1804 = $1806;
                                                                                                                    break;
                                                                                                                case 'Maybe.none':
                                                                                                                    var $1807 = Parser$Reply$error$($1803);
                                                                                                                    var $1804 = $1807;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $1802 = $1804;
                                                                                                            break;
                                                                                                        case 'Parser.Reply.value':
                                                                                                            var $1808 = self.pst;
                                                                                                            var $1809 = self.val;
                                                                                                            var self = $1808;
                                                                                                            switch (self._) {
                                                                                                                case 'Parser.State.new':
                                                                                                                    var $1811 = self.err;
                                                                                                                    var $1812 = self.nam;
                                                                                                                    var $1813 = self.ini;
                                                                                                                    var $1814 = self.idx;
                                                                                                                    var $1815 = self.str;
                                                                                                                    var _reply$pst$64 = Parser$State$new$(Parser$Error$maybe_combine$($1801, $1811), $1812, $1813, $1814, $1815);
                                                                                                                    var self = _reply$pst$64;
                                                                                                                    switch (self._) {
                                                                                                                        case 'Parser.State.new':
                                                                                                                            var $1817 = self.err;
                                                                                                                            var _reply$70 = Litereum$parse$text$("=", _reply$pst$64);
                                                                                                                            var self = _reply$70;
                                                                                                                            switch (self._) {
                                                                                                                                case 'Parser.Reply.error':
                                                                                                                                    var $1819 = self.err;
                                                                                                                                    var self = $1817;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Maybe.some':
                                                                                                                                            var $1821 = self.value;
                                                                                                                                            var $1822 = Parser$Reply$error$(Parser$Error$combine$($1821, $1819));
                                                                                                                                            var $1820 = $1822;
                                                                                                                                            break;
                                                                                                                                        case 'Maybe.none':
                                                                                                                                            var $1823 = Parser$Reply$error$($1819);
                                                                                                                                            var $1820 = $1823;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1818 = $1820;
                                                                                                                                    break;
                                                                                                                                case 'Parser.Reply.value':
                                                                                                                                    var $1824 = self.pst;
                                                                                                                                    var self = $1824;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Parser.State.new':
                                                                                                                                            var $1826 = self.err;
                                                                                                                                            var $1827 = self.nam;
                                                                                                                                            var $1828 = self.ini;
                                                                                                                                            var $1829 = self.idx;
                                                                                                                                            var $1830 = self.str;
                                                                                                                                            var _reply$pst$78 = Parser$State$new$(Parser$Error$maybe_combine$($1817, $1826), $1827, $1828, $1829, $1830);
                                                                                                                                            var $1831 = Parser$Reply$value$(_reply$pst$78, Pair$new$($1778, $1809));
                                                                                                                                            var $1825 = $1831;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1818 = $1825;
                                                                                                                                    break;
                                                                                                                            };
                                                                                                                            var $1816 = $1818;
                                                                                                                            break;
                                                                                                                    };
                                                                                                                    var $1810 = $1816;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $1802 = $1810;
                                                                                                            break;
                                                                                                    };
                                                                                                    var $1800 = $1802;
                                                                                                    break;
                                                                                            };
                                                                                            var $1794 = $1800;
                                                                                            break;
                                                                                    };
                                                                                    var $1787 = $1794;
                                                                                    break;
                                                                            };
                                                                            var $1785 = $1787;
                                                                            break;
                                                                    };
                                                                    var $1779 = $1785;
                                                                    break;
                                                            };
                                                            var $1771 = $1779;
                                                            break;
                                                    };
                                                    var $1769 = $1771;
                                                    break;
                                            };
                                            return $1769;
                                        }), List$cons$((_pst$22 => {
                                            var $1832 = Parser$Reply$value$(_pst$22, Pair$new$("", Litereum$Type$word));
                                            return $1832;
                                        }), List$nil)), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1833 = self.err;
                                                var self = $1767;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1835 = self.value;
                                                        var $1836 = Parser$Reply$error$(Parser$Error$combine$($1835, $1833));
                                                        var $1834 = $1836;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1837 = Parser$Reply$error$($1833);
                                                        var $1834 = $1837;
                                                        break;
                                                };
                                                var $1768 = $1834;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1838 = self.pst;
                                                var $1839 = self.val;
                                                var self = $1838;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1841 = self.err;
                                                        var $1842 = self.nam;
                                                        var $1843 = self.ini;
                                                        var $1844 = self.idx;
                                                        var $1845 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1767, $1841), $1842, $1843, $1844, $1845);
                                                        var self = $1839;
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $1847 = self.fst;
                                                                var $1848 = self.snd;
                                                                var $1849 = (_pst$33 => {
                                                                    var self = _pst$33;
                                                                    switch (self._) {
                                                                        case 'Parser.State.new':
                                                                            var $1851 = self.err;
                                                                            var _reply$39 = Litereum$parse$term$(_world$1)(_pst$33);
                                                                            var self = _reply$39;
                                                                            switch (self._) {
                                                                                case 'Parser.Reply.error':
                                                                                    var $1853 = self.err;
                                                                                    var self = $1851;
                                                                                    switch (self._) {
                                                                                        case 'Maybe.some':
                                                                                            var $1855 = self.value;
                                                                                            var $1856 = Parser$Reply$error$(Parser$Error$combine$($1855, $1853));
                                                                                            var $1854 = $1856;
                                                                                            break;
                                                                                        case 'Maybe.none':
                                                                                            var $1857 = Parser$Reply$error$($1853);
                                                                                            var $1854 = $1857;
                                                                                            break;
                                                                                    };
                                                                                    var $1852 = $1854;
                                                                                    break;
                                                                                case 'Parser.Reply.value':
                                                                                    var $1858 = self.pst;
                                                                                    var $1859 = self.val;
                                                                                    var self = $1858;
                                                                                    switch (self._) {
                                                                                        case 'Parser.State.new':
                                                                                            var $1861 = self.err;
                                                                                            var $1862 = self.nam;
                                                                                            var $1863 = self.ini;
                                                                                            var $1864 = self.idx;
                                                                                            var $1865 = self.str;
                                                                                            var _reply$pst$47 = Parser$State$new$(Parser$Error$maybe_combine$($1851, $1861), $1862, $1863, $1864, $1865);
                                                                                            var self = _reply$pst$47;
                                                                                            switch (self._) {
                                                                                                case 'Parser.State.new':
                                                                                                    var $1867 = self.err;
                                                                                                    var _reply$53 = Parser$maybe$(Litereum$parse$text(";"), _reply$pst$47);
                                                                                                    var self = _reply$53;
                                                                                                    switch (self._) {
                                                                                                        case 'Parser.Reply.error':
                                                                                                            var $1869 = self.err;
                                                                                                            var self = $1867;
                                                                                                            switch (self._) {
                                                                                                                case 'Maybe.some':
                                                                                                                    var $1871 = self.value;
                                                                                                                    var $1872 = Parser$Reply$error$(Parser$Error$combine$($1871, $1869));
                                                                                                                    var $1870 = $1872;
                                                                                                                    break;
                                                                                                                case 'Maybe.none':
                                                                                                                    var $1873 = Parser$Reply$error$($1869);
                                                                                                                    var $1870 = $1873;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $1868 = $1870;
                                                                                                            break;
                                                                                                        case 'Parser.Reply.value':
                                                                                                            var $1874 = self.pst;
                                                                                                            var self = $1874;
                                                                                                            switch (self._) {
                                                                                                                case 'Parser.State.new':
                                                                                                                    var $1876 = self.err;
                                                                                                                    var $1877 = self.nam;
                                                                                                                    var $1878 = self.ini;
                                                                                                                    var $1879 = self.idx;
                                                                                                                    var $1880 = self.str;
                                                                                                                    var _reply$pst$61 = Parser$State$new$(Parser$Error$maybe_combine$($1867, $1876), $1877, $1878, $1879, $1880);
                                                                                                                    var self = _reply$pst$61;
                                                                                                                    switch (self._) {
                                                                                                                        case 'Parser.State.new':
                                                                                                                            var $1882 = self.err;
                                                                                                                            var _reply$67 = Litereum$parse$term$(_world$1)(_reply$pst$61);
                                                                                                                            var self = _reply$67;
                                                                                                                            switch (self._) {
                                                                                                                                case 'Parser.Reply.error':
                                                                                                                                    var $1884 = self.err;
                                                                                                                                    var self = $1882;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Maybe.some':
                                                                                                                                            var $1886 = self.value;
                                                                                                                                            var $1887 = Parser$Reply$error$(Parser$Error$combine$($1886, $1884));
                                                                                                                                            var $1885 = $1887;
                                                                                                                                            break;
                                                                                                                                        case 'Maybe.none':
                                                                                                                                            var $1888 = Parser$Reply$error$($1884);
                                                                                                                                            var $1885 = $1888;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1883 = $1885;
                                                                                                                                    break;
                                                                                                                                case 'Parser.Reply.value':
                                                                                                                                    var $1889 = self.pst;
                                                                                                                                    var $1890 = self.val;
                                                                                                                                    var self = $1889;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Parser.State.new':
                                                                                                                                            var $1892 = self.err;
                                                                                                                                            var $1893 = self.nam;
                                                                                                                                            var $1894 = self.ini;
                                                                                                                                            var $1895 = self.idx;
                                                                                                                                            var $1896 = self.str;
                                                                                                                                            var _reply$pst$75 = Parser$State$new$(Parser$Error$maybe_combine$($1882, $1892), $1893, $1894, $1895, $1896);
                                                                                                                                            var $1897 = Parser$Reply$value$(_reply$pst$75, Litereum$Term$run$($1847, $1848, $1859, $1890));
                                                                                                                                            var $1891 = $1897;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1883 = $1891;
                                                                                                                                    break;
                                                                                                                            };
                                                                                                                            var $1881 = $1883;
                                                                                                                            break;
                                                                                                                    };
                                                                                                                    var $1875 = $1881;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $1868 = $1875;
                                                                                                            break;
                                                                                                    };
                                                                                                    var $1866 = $1868;
                                                                                                    break;
                                                                                            };
                                                                                            var $1860 = $1866;
                                                                                            break;
                                                                                    };
                                                                                    var $1852 = $1860;
                                                                                    break;
                                                                            };
                                                                            var $1850 = $1852;
                                                                            break;
                                                                    };
                                                                    return $1850;
                                                                });
                                                                var $1846 = $1849;
                                                                break;
                                                        };
                                                        var $1846 = $1846(_reply$pst$30);
                                                        var $1840 = $1846;
                                                        break;
                                                };
                                                var $1768 = $1840;
                                                break;
                                        };
                                        var $1766 = $1768;
                                        break;
                                };
                                var $1760 = $1766;
                                break;
                        };
                        var $1753 = $1760;
                        break;
                };
                var $1751 = $1753;
                break;
        };
        return $1751;
    };
    const Litereum$parse$term$run = x0 => x1 => Litereum$parse$term$run$(x0, x1);

    function Litereum$Term$return$(_expr$1) {
        var $1898 = ({
            _: 'Litereum.Term.return',
            'expr': _expr$1
        });
        return $1898;
    };
    const Litereum$Term$return = x0 => Litereum$Term$return$(x0);

    function Litereum$parse$term$return$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1900 = self.err;
                var _reply$8 = Litereum$parse$text$("return", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1902 = self.err;
                        var self = $1900;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1904 = self.value;
                                var $1905 = Parser$Reply$error$(Parser$Error$combine$($1904, $1902));
                                var $1903 = $1905;
                                break;
                            case 'Maybe.none':
                                var $1906 = Parser$Reply$error$($1902);
                                var $1903 = $1906;
                                break;
                        };
                        var $1901 = $1903;
                        break;
                    case 'Parser.Reply.value':
                        var $1907 = self.pst;
                        var self = $1907;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1909 = self.err;
                                var $1910 = self.nam;
                                var $1911 = self.ini;
                                var $1912 = self.idx;
                                var $1913 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1900, $1909), $1910, $1911, $1912, $1913);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1915 = self.err;
                                        var _reply$22 = Litereum$parse$term$(_world$1)(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1917 = self.err;
                                                var self = $1915;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1919 = self.value;
                                                        var $1920 = Parser$Reply$error$(Parser$Error$combine$($1919, $1917));
                                                        var $1918 = $1920;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1921 = Parser$Reply$error$($1917);
                                                        var $1918 = $1921;
                                                        break;
                                                };
                                                var $1916 = $1918;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1922 = self.pst;
                                                var $1923 = self.val;
                                                var self = $1922;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1925 = self.err;
                                                        var $1926 = self.nam;
                                                        var $1927 = self.ini;
                                                        var $1928 = self.idx;
                                                        var $1929 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1915, $1925), $1926, $1927, $1928, $1929);
                                                        var $1930 = Parser$Reply$value$(_reply$pst$30, Litereum$Term$return$($1923));
                                                        var $1924 = $1930;
                                                        break;
                                                };
                                                var $1916 = $1924;
                                                break;
                                        };
                                        var $1914 = $1916;
                                        break;
                                };
                                var $1908 = $1914;
                                break;
                        };
                        var $1901 = $1908;
                        break;
                };
                var $1899 = $1901;
                break;
        };
        return $1899;
    };
    const Litereum$parse$term$return = x0 => x1 => Litereum$parse$term$return$(x0, x1);

    function Litereum$Term$call$(_bond$1, _args$2) {
        var $1931 = ({
            _: 'Litereum.Term.call',
            'bond': _bond$1,
            'args': _args$2
        });
        return $1931;
    };
    const Litereum$Term$call = x0 => x1 => Litereum$Term$call$(x0, x1);

    function Litereum$parse$term$call$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1933 = self.err;
                var _reply$8 = Litereum$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1935 = self.err;
                        var self = $1933;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1937 = self.value;
                                var $1938 = Parser$Reply$error$(Parser$Error$combine$($1937, $1935));
                                var $1936 = $1938;
                                break;
                            case 'Maybe.none':
                                var $1939 = Parser$Reply$error$($1935);
                                var $1936 = $1939;
                                break;
                        };
                        var $1934 = $1936;
                        break;
                    case 'Parser.Reply.value':
                        var $1940 = self.pst;
                        var $1941 = self.val;
                        var self = $1940;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1943 = self.err;
                                var $1944 = self.nam;
                                var $1945 = self.ini;
                                var $1946 = self.idx;
                                var $1947 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1933, $1943), $1944, $1945, $1946, $1947);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1949 = self.err;
                                        var _reply$22 = Parser$wrap$(Litereum$parse$text("("), (_pst$22 => {
                                            var self = _pst$22;
                                            switch (self._) {
                                                case 'Parser.State.new':
                                                    var $1952 = self.err;
                                                    var _reply$28 = Parser$maybe$(Litereum$parse$text(","), _pst$22);
                                                    var self = _reply$28;
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $1954 = self.err;
                                                            var self = $1952;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $1956 = self.value;
                                                                    var $1957 = Parser$Reply$error$(Parser$Error$combine$($1956, $1954));
                                                                    var $1955 = $1957;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $1958 = Parser$Reply$error$($1954);
                                                                    var $1955 = $1958;
                                                                    break;
                                                            };
                                                            var $1953 = $1955;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $1959 = self.pst;
                                                            var self = $1959;
                                                            switch (self._) {
                                                                case 'Parser.State.new':
                                                                    var $1961 = self.err;
                                                                    var $1962 = self.nam;
                                                                    var $1963 = self.ini;
                                                                    var $1964 = self.idx;
                                                                    var $1965 = self.str;
                                                                    var _reply$pst$36 = Parser$State$new$(Parser$Error$maybe_combine$($1952, $1961), $1962, $1963, $1964, $1965);
                                                                    var $1966 = Litereum$parse$term$(_world$1)(_reply$pst$36);
                                                                    var $1960 = $1966;
                                                                    break;
                                                            };
                                                            var $1953 = $1960;
                                                            break;
                                                    };
                                                    var $1951 = $1953;
                                                    break;
                                            };
                                            return $1951;
                                        }), Litereum$parse$text(")"), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1967 = self.err;
                                                var self = $1949;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1969 = self.value;
                                                        var $1970 = Parser$Reply$error$(Parser$Error$combine$($1969, $1967));
                                                        var $1968 = $1970;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1971 = Parser$Reply$error$($1967);
                                                        var $1968 = $1971;
                                                        break;
                                                };
                                                var $1950 = $1968;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1972 = self.pst;
                                                var $1973 = self.val;
                                                var self = $1972;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1975 = self.err;
                                                        var $1976 = self.nam;
                                                        var $1977 = self.ini;
                                                        var $1978 = self.idx;
                                                        var $1979 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1949, $1975), $1976, $1977, $1978, $1979);
                                                        var $1980 = Parser$Reply$value$(_reply$pst$30, Litereum$Term$call$($1941, $1973));
                                                        var $1974 = $1980;
                                                        break;
                                                };
                                                var $1950 = $1974;
                                                break;
                                        };
                                        var $1948 = $1950;
                                        break;
                                };
                                var $1942 = $1948;
                                break;
                        };
                        var $1934 = $1942;
                        break;
                };
                var $1932 = $1934;
                break;
        };
        return $1932;
    };
    const Litereum$parse$term$call = x0 => x1 => Litereum$parse$term$call$(x0, x1);

    function Litereum$Term$var$(_name$1) {
        var $1981 = ({
            _: 'Litereum.Term.var',
            'name': _name$1
        });
        return $1981;
    };
    const Litereum$Term$var = x0 => Litereum$Term$var$(x0);

    function Litereum$parse$term$var$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1983 = self.err;
                var _reply$8 = Litereum$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1985 = self.err;
                        var self = $1983;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1987 = self.value;
                                var $1988 = Parser$Reply$error$(Parser$Error$combine$($1987, $1985));
                                var $1986 = $1988;
                                break;
                            case 'Maybe.none':
                                var $1989 = Parser$Reply$error$($1985);
                                var $1986 = $1989;
                                break;
                        };
                        var $1984 = $1986;
                        break;
                    case 'Parser.Reply.value':
                        var $1990 = self.pst;
                        var $1991 = self.val;
                        var self = $1990;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1993 = self.err;
                                var $1994 = self.nam;
                                var $1995 = self.ini;
                                var $1996 = self.idx;
                                var $1997 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1983, $1993), $1994, $1995, $1996, $1997);
                                var $1998 = Parser$Reply$value$(_reply$pst$16, Litereum$Term$var$($1991));
                                var $1992 = $1998;
                                break;
                        };
                        var $1984 = $1992;
                        break;
                };
                var $1982 = $1984;
                break;
        };
        return $1982;
    };
    const Litereum$parse$term$var = x0 => x1 => Litereum$parse$term$var$(x0, x1);

    function Litereum$parse$term$(_world$1) {
        var $1999 = Parser$choice(List$cons$(Litereum$parse$term$let(_world$1), List$cons$(Litereum$parse$term$create(_world$1), List$cons$(Litereum$parse$term$match(_world$1), List$cons$(Litereum$parse$term$word(_world$1), List$cons$(Litereum$parse$term$compare(_world$1), List$cons$(Litereum$parse$term$operate(_world$1), List$cons$(Litereum$parse$term$bind(_world$1), List$cons$(Litereum$parse$term$run(_world$1), List$cons$(Litereum$parse$term$return(_world$1), List$cons$(Litereum$parse$term$call(_world$1), List$cons$(Litereum$parse$term$var(_world$1), List$nil))))))))))));
        return $1999;
    };
    const Litereum$parse$term = x0 => Litereum$parse$term$(x0);

    function Litereum$Bond$new$(_name$1, _input_names$2, _input_types$3, _output_type$4, _main$5, _owners$6) {
        var $2000 = ({
            _: 'Litereum.Bond.new',
            'name': _name$1,
            'input_names': _input_names$2,
            'input_types': _input_types$3,
            'output_type': _output_type$4,
            'main': _main$5,
            'owners': _owners$6
        });
        return $2000;
    };
    const Litereum$Bond$new = x0 => x1 => x2 => x3 => x4 => x5 => Litereum$Bond$new$(x0, x1, x2, x3, x4, x5);

    function Litereum$parse$bond$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $2002 = self.err;
                var _reply$8 = Litereum$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2004 = self.err;
                        var self = $2002;
                        switch (self._) {
                            case 'Maybe.some':
                                var $2006 = self.value;
                                var $2007 = Parser$Reply$error$(Parser$Error$combine$($2006, $2004));
                                var $2005 = $2007;
                                break;
                            case 'Maybe.none':
                                var $2008 = Parser$Reply$error$($2004);
                                var $2005 = $2008;
                                break;
                        };
                        var $2003 = $2005;
                        break;
                    case 'Parser.Reply.value':
                        var $2009 = self.pst;
                        var $2010 = self.val;
                        var self = $2009;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $2012 = self.err;
                                var $2013 = self.nam;
                                var $2014 = self.ini;
                                var $2015 = self.idx;
                                var $2016 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2002, $2012), $2013, $2014, $2015, $2016);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $2018 = self.err;
                                        var _reply$22 = Parser$wrap$(Litereum$parse$text("("), Litereum$parse$ann(_world$1), Litereum$parse$text(")"), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2020 = self.err;
                                                var self = $2018;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $2022 = self.value;
                                                        var $2023 = Parser$Reply$error$(Parser$Error$combine$($2022, $2020));
                                                        var $2021 = $2023;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $2024 = Parser$Reply$error$($2020);
                                                        var $2021 = $2024;
                                                        break;
                                                };
                                                var $2019 = $2021;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2025 = self.pst;
                                                var $2026 = self.val;
                                                var self = $2025;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $2028 = self.err;
                                                        var $2029 = self.nam;
                                                        var $2030 = self.ini;
                                                        var $2031 = self.idx;
                                                        var $2032 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2018, $2028), $2029, $2030, $2031, $2032);
                                                        var _iarg$31 = List$mapped$($2026, (_x$31 => {
                                                            var self = _x$31;
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $2035 = self.fst;
                                                                    var $2036 = $2035;
                                                                    var $2034 = $2036;
                                                                    break;
                                                            };
                                                            return $2034;
                                                        }));
                                                        var _ityp$32 = List$mapped$($2026, (_x$32 => {
                                                            var self = _x$32;
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $2038 = self.snd;
                                                                    var $2039 = $2038;
                                                                    var $2037 = $2039;
                                                                    break;
                                                            };
                                                            return $2037;
                                                        }));
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $2040 = self.err;
                                                                var _reply$38 = Litereum$parse$text$(":", _reply$pst$30);
                                                                var self = _reply$38;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $2042 = self.err;
                                                                        var self = $2040;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $2044 = self.value;
                                                                                var $2045 = Parser$Reply$error$(Parser$Error$combine$($2044, $2042));
                                                                                var $2043 = $2045;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $2046 = Parser$Reply$error$($2042);
                                                                                var $2043 = $2046;
                                                                                break;
                                                                        };
                                                                        var $2041 = $2043;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $2047 = self.pst;
                                                                        var self = $2047;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $2049 = self.err;
                                                                                var $2050 = self.nam;
                                                                                var $2051 = self.ini;
                                                                                var $2052 = self.idx;
                                                                                var $2053 = self.str;
                                                                                var _reply$pst$46 = Parser$State$new$(Parser$Error$maybe_combine$($2040, $2049), $2050, $2051, $2052, $2053);
                                                                                var self = _reply$pst$46;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $2055 = self.err;
                                                                                        var _reply$52 = Litereum$parse$type$(_world$1)(_reply$pst$46);
                                                                                        var self = _reply$52;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $2057 = self.err;
                                                                                                var self = $2055;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $2059 = self.value;
                                                                                                        var $2060 = Parser$Reply$error$(Parser$Error$combine$($2059, $2057));
                                                                                                        var $2058 = $2060;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $2061 = Parser$Reply$error$($2057);
                                                                                                        var $2058 = $2061;
                                                                                                        break;
                                                                                                };
                                                                                                var $2056 = $2058;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $2062 = self.pst;
                                                                                                var $2063 = self.val;
                                                                                                var self = $2062;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $2065 = self.err;
                                                                                                        var $2066 = self.nam;
                                                                                                        var $2067 = self.ini;
                                                                                                        var $2068 = self.idx;
                                                                                                        var $2069 = self.str;
                                                                                                        var _reply$pst$60 = Parser$State$new$(Parser$Error$maybe_combine$($2055, $2065), $2066, $2067, $2068, $2069);
                                                                                                        var self = _reply$pst$60;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $2071 = self.err;
                                                                                                                var _reply$66 = Litereum$parse$text$("{", _reply$pst$60);
                                                                                                                var self = _reply$66;
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $2073 = self.err;
                                                                                                                        var self = $2071;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Maybe.some':
                                                                                                                                var $2075 = self.value;
                                                                                                                                var $2076 = Parser$Reply$error$(Parser$Error$combine$($2075, $2073));
                                                                                                                                var $2074 = $2076;
                                                                                                                                break;
                                                                                                                            case 'Maybe.none':
                                                                                                                                var $2077 = Parser$Reply$error$($2073);
                                                                                                                                var $2074 = $2077;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $2072 = $2074;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $2078 = self.pst;
                                                                                                                        var self = $2078;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $2080 = self.err;
                                                                                                                                var $2081 = self.nam;
                                                                                                                                var $2082 = self.ini;
                                                                                                                                var $2083 = self.idx;
                                                                                                                                var $2084 = self.str;
                                                                                                                                var _reply$pst$74 = Parser$State$new$(Parser$Error$maybe_combine$($2071, $2080), $2081, $2082, $2083, $2084);
                                                                                                                                var self = _reply$pst$74;
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.State.new':
                                                                                                                                        var $2086 = self.err;
                                                                                                                                        var _reply$80 = Litereum$parse$term$(_world$1)(_reply$pst$74);
                                                                                                                                        var self = _reply$80;
                                                                                                                                        switch (self._) {
                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                var $2088 = self.err;
                                                                                                                                                var self = $2086;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                        var $2090 = self.value;
                                                                                                                                                        var $2091 = Parser$Reply$error$(Parser$Error$combine$($2090, $2088));
                                                                                                                                                        var $2089 = $2091;
                                                                                                                                                        break;
                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                        var $2092 = Parser$Reply$error$($2088);
                                                                                                                                                        var $2089 = $2092;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $2087 = $2089;
                                                                                                                                                break;
                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                var $2093 = self.pst;
                                                                                                                                                var $2094 = self.val;
                                                                                                                                                var self = $2093;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                        var $2096 = self.err;
                                                                                                                                                        var $2097 = self.nam;
                                                                                                                                                        var $2098 = self.ini;
                                                                                                                                                        var $2099 = self.idx;
                                                                                                                                                        var $2100 = self.str;
                                                                                                                                                        var _reply$pst$88 = Parser$State$new$(Parser$Error$maybe_combine$($2086, $2096), $2097, $2098, $2099, $2100);
                                                                                                                                                        var self = _reply$pst$88;
                                                                                                                                                        switch (self._) {
                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                var $2102 = self.err;
                                                                                                                                                                var _reply$94 = Litereum$parse$text$("}", _reply$pst$88);
                                                                                                                                                                var self = _reply$94;
                                                                                                                                                                switch (self._) {
                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                        var $2104 = self.err;
                                                                                                                                                                        var self = $2102;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                var $2106 = self.value;
                                                                                                                                                                                var $2107 = Parser$Reply$error$(Parser$Error$combine$($2106, $2104));
                                                                                                                                                                                var $2105 = $2107;
                                                                                                                                                                                break;
                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                var $2108 = Parser$Reply$error$($2104);
                                                                                                                                                                                var $2105 = $2108;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $2103 = $2105;
                                                                                                                                                                        break;
                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                        var $2109 = self.pst;
                                                                                                                                                                        var self = $2109;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                var $2111 = self.err;
                                                                                                                                                                                var $2112 = self.nam;
                                                                                                                                                                                var $2113 = self.ini;
                                                                                                                                                                                var $2114 = self.idx;
                                                                                                                                                                                var $2115 = self.str;
                                                                                                                                                                                var _reply$pst$102 = Parser$State$new$(Parser$Error$maybe_combine$($2102, $2111), $2112, $2113, $2114, $2115);
                                                                                                                                                                                var self = _reply$pst$102;
                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                        var $2117 = self.err;
                                                                                                                                                                                        var _reply$108 = Parser$many$((_pst$108 => {
                                                                                                                                                                                            var self = _pst$108;
                                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                                                                    var $2120 = self.err;
                                                                                                                                                                                                    var _reply$114 = Litereum$parse$text$("@", _pst$108);
                                                                                                                                                                                                    var self = _reply$114;
                                                                                                                                                                                                    switch (self._) {
                                                                                                                                                                                                        case 'Parser.Reply.error':
                                                                                                                                                                                                            var $2122 = self.err;
                                                                                                                                                                                                            var self = $2120;
                                                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                                                case 'Maybe.some':
                                                                                                                                                                                                                    var $2124 = self.value;
                                                                                                                                                                                                                    var $2125 = Parser$Reply$error$(Parser$Error$combine$($2124, $2122));
                                                                                                                                                                                                                    var $2123 = $2125;
                                                                                                                                                                                                                    break;
                                                                                                                                                                                                                case 'Maybe.none':
                                                                                                                                                                                                                    var $2126 = Parser$Reply$error$($2122);
                                                                                                                                                                                                                    var $2123 = $2126;
                                                                                                                                                                                                                    break;
                                                                                                                                                                                                            };
                                                                                                                                                                                                            var $2121 = $2123;
                                                                                                                                                                                                            break;
                                                                                                                                                                                                        case 'Parser.Reply.value':
                                                                                                                                                                                                            var $2127 = self.pst;
                                                                                                                                                                                                            var self = $2127;
                                                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                                                                                    var $2129 = self.err;
                                                                                                                                                                                                                    var $2130 = self.nam;
                                                                                                                                                                                                                    var $2131 = self.ini;
                                                                                                                                                                                                                    var $2132 = self.idx;
                                                                                                                                                                                                                    var $2133 = self.str;
                                                                                                                                                                                                                    var _reply$pst$122 = Parser$State$new$(Parser$Error$maybe_combine$($2120, $2129), $2130, $2131, $2132, $2133);
                                                                                                                                                                                                                    var self = _reply$pst$122;
                                                                                                                                                                                                                    switch (self._) {
                                                                                                                                                                                                                        case 'Parser.State.new':
                                                                                                                                                                                                                            var $2135 = self.err;
                                                                                                                                                                                                                            var _reply$128 = Litereum$parse$name$(_reply$pst$122);
                                                                                                                                                                                                                            var self = _reply$128;
                                                                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                                                                case 'Parser.Reply.error':
                                                                                                                                                                                                                                    var $2137 = self.err;
                                                                                                                                                                                                                                    var self = $2135;
                                                                                                                                                                                                                                    switch (self._) {
                                                                                                                                                                                                                                        case 'Maybe.some':
                                                                                                                                                                                                                                            var $2139 = self.value;
                                                                                                                                                                                                                                            var $2140 = Parser$Reply$error$(Parser$Error$combine$($2139, $2137));
                                                                                                                                                                                                                                            var $2138 = $2140;
                                                                                                                                                                                                                                            break;
                                                                                                                                                                                                                                        case 'Maybe.none':
                                                                                                                                                                                                                                            var $2141 = Parser$Reply$error$($2137);
                                                                                                                                                                                                                                            var $2138 = $2141;
                                                                                                                                                                                                                                            break;
                                                                                                                                                                                                                                    };
                                                                                                                                                                                                                                    var $2136 = $2138;
                                                                                                                                                                                                                                    break;
                                                                                                                                                                                                                                case 'Parser.Reply.value':
                                                                                                                                                                                                                                    var $2142 = self.pst;
                                                                                                                                                                                                                                    var $2143 = self.val;
                                                                                                                                                                                                                                    var self = $2142;
                                                                                                                                                                                                                                    switch (self._) {
                                                                                                                                                                                                                                        case 'Parser.State.new':
                                                                                                                                                                                                                                            var $2145 = self.err;
                                                                                                                                                                                                                                            var $2146 = self.nam;
                                                                                                                                                                                                                                            var $2147 = self.ini;
                                                                                                                                                                                                                                            var $2148 = self.idx;
                                                                                                                                                                                                                                            var $2149 = self.str;
                                                                                                                                                                                                                                            var _reply$pst$136 = Parser$State$new$(Parser$Error$maybe_combine$($2135, $2145), $2146, $2147, $2148, $2149);
                                                                                                                                                                                                                                            var $2150 = Parser$Reply$value$(_reply$pst$136, $2143);
                                                                                                                                                                                                                                            var $2144 = $2150;
                                                                                                                                                                                                                                            break;
                                                                                                                                                                                                                                    };
                                                                                                                                                                                                                                    var $2136 = $2144;
                                                                                                                                                                                                                                    break;
                                                                                                                                                                                                                            };
                                                                                                                                                                                                                            var $2134 = $2136;
                                                                                                                                                                                                                            break;
                                                                                                                                                                                                                    };
                                                                                                                                                                                                                    var $2128 = $2134;
                                                                                                                                                                                                                    break;
                                                                                                                                                                                                            };
                                                                                                                                                                                                            var $2121 = $2128;
                                                                                                                                                                                                            break;
                                                                                                                                                                                                    };
                                                                                                                                                                                                    var $2119 = $2121;
                                                                                                                                                                                                    break;
                                                                                                                                                                                            };
                                                                                                                                                                                            return $2119;
                                                                                                                                                                                        }))(_reply$pst$102);
                                                                                                                                                                                        var self = _reply$108;
                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                                                                var $2151 = self.err;
                                                                                                                                                                                                var self = $2117;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                                                                        var $2153 = self.value;
                                                                                                                                                                                                        var $2154 = Parser$Reply$error$(Parser$Error$combine$($2153, $2151));
                                                                                                                                                                                                        var $2152 = $2154;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                                                                        var $2155 = Parser$Reply$error$($2151);
                                                                                                                                                                                                        var $2152 = $2155;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $2118 = $2152;
                                                                                                                                                                                                break;
                                                                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                                                                var $2156 = self.pst;
                                                                                                                                                                                                var $2157 = self.val;
                                                                                                                                                                                                var self = $2156;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                        var $2159 = self.err;
                                                                                                                                                                                                        var $2160 = self.nam;
                                                                                                                                                                                                        var $2161 = self.ini;
                                                                                                                                                                                                        var $2162 = self.idx;
                                                                                                                                                                                                        var $2163 = self.str;
                                                                                                                                                                                                        var _reply$pst$116 = Parser$State$new$(Parser$Error$maybe_combine$($2117, $2159), $2160, $2161, $2162, $2163);
                                                                                                                                                                                                        var $2164 = Parser$Reply$value$(_reply$pst$116, Litereum$Bond$new$($2010, _iarg$31, _ityp$32, $2063, $2094, $2157));
                                                                                                                                                                                                        var $2158 = $2164;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $2118 = $2158;
                                                                                                                                                                                                break;
                                                                                                                                                                                        };
                                                                                                                                                                                        var $2116 = $2118;
                                                                                                                                                                                        break;
                                                                                                                                                                                };
                                                                                                                                                                                var $2110 = $2116;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $2103 = $2110;
                                                                                                                                                                        break;
                                                                                                                                                                };
                                                                                                                                                                var $2101 = $2103;
                                                                                                                                                                break;
                                                                                                                                                        };
                                                                                                                                                        var $2095 = $2101;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $2087 = $2095;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $2085 = $2087;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $2079 = $2085;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $2072 = $2079;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $2070 = $2072;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $2064 = $2070;
                                                                                                        break;
                                                                                                };
                                                                                                var $2056 = $2064;
                                                                                                break;
                                                                                        };
                                                                                        var $2054 = $2056;
                                                                                        break;
                                                                                };
                                                                                var $2048 = $2054;
                                                                                break;
                                                                        };
                                                                        var $2041 = $2048;
                                                                        break;
                                                                };
                                                                var $2033 = $2041;
                                                                break;
                                                        };
                                                        var $2027 = $2033;
                                                        break;
                                                };
                                                var $2019 = $2027;
                                                break;
                                        };
                                        var $2017 = $2019;
                                        break;
                                };
                                var $2011 = $2017;
                                break;
                        };
                        var $2003 = $2011;
                        break;
                };
                var $2001 = $2003;
                break;
        };
        return $2001;
    };
    const Litereum$parse$bond = x0 => x1 => Litereum$parse$bond$(x0, x1);

    function Litereum$Transaction$new_bond$(_bond$1) {
        var $2165 = ({
            _: 'Litereum.Transaction.new_bond',
            'bond': _bond$1
        });
        return $2165;
    };
    const Litereum$Transaction$new_bond = x0 => Litereum$Transaction$new_bond$(x0);

    function Litereum$Eval$new$(_term$1, _type$2) {
        var $2166 = ({
            _: 'Litereum.Eval.new',
            'term': _term$1,
            'type': _type$2
        });
        return $2166;
    };
    const Litereum$Eval$new = x0 => x1 => Litereum$Eval$new$(x0, x1);

    function Litereum$parse$eval$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $2168 = self.err;
                var _reply$8 = Litereum$parse$text$("{", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2170 = self.err;
                        var self = $2168;
                        switch (self._) {
                            case 'Maybe.some':
                                var $2172 = self.value;
                                var $2173 = Parser$Reply$error$(Parser$Error$combine$($2172, $2170));
                                var $2171 = $2173;
                                break;
                            case 'Maybe.none':
                                var $2174 = Parser$Reply$error$($2170);
                                var $2171 = $2174;
                                break;
                        };
                        var $2169 = $2171;
                        break;
                    case 'Parser.Reply.value':
                        var $2175 = self.pst;
                        var self = $2175;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $2177 = self.err;
                                var $2178 = self.nam;
                                var $2179 = self.ini;
                                var $2180 = self.idx;
                                var $2181 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2168, $2177), $2178, $2179, $2180, $2181);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $2183 = self.err;
                                        var _reply$22 = Litereum$parse$term$(_world$1)(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2185 = self.err;
                                                var self = $2183;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $2187 = self.value;
                                                        var $2188 = Parser$Reply$error$(Parser$Error$combine$($2187, $2185));
                                                        var $2186 = $2188;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $2189 = Parser$Reply$error$($2185);
                                                        var $2186 = $2189;
                                                        break;
                                                };
                                                var $2184 = $2186;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2190 = self.pst;
                                                var $2191 = self.val;
                                                var self = $2190;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $2193 = self.err;
                                                        var $2194 = self.nam;
                                                        var $2195 = self.ini;
                                                        var $2196 = self.idx;
                                                        var $2197 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2183, $2193), $2194, $2195, $2196, $2197);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $2199 = self.err;
                                                                var _reply$36 = Litereum$parse$text$("}", _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $2201 = self.err;
                                                                        var self = $2199;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $2203 = self.value;
                                                                                var $2204 = Parser$Reply$error$(Parser$Error$combine$($2203, $2201));
                                                                                var $2202 = $2204;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $2205 = Parser$Reply$error$($2201);
                                                                                var $2202 = $2205;
                                                                                break;
                                                                        };
                                                                        var $2200 = $2202;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $2206 = self.pst;
                                                                        var self = $2206;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $2208 = self.err;
                                                                                var $2209 = self.nam;
                                                                                var $2210 = self.ini;
                                                                                var $2211 = self.idx;
                                                                                var $2212 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($2199, $2208), $2209, $2210, $2211, $2212);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $2214 = self.err;
                                                                                        var _reply$50 = Litereum$parse$text$(":", _reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $2216 = self.err;
                                                                                                var self = $2214;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $2218 = self.value;
                                                                                                        var $2219 = Parser$Reply$error$(Parser$Error$combine$($2218, $2216));
                                                                                                        var $2217 = $2219;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $2220 = Parser$Reply$error$($2216);
                                                                                                        var $2217 = $2220;
                                                                                                        break;
                                                                                                };
                                                                                                var $2215 = $2217;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $2221 = self.pst;
                                                                                                var self = $2221;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $2223 = self.err;
                                                                                                        var $2224 = self.nam;
                                                                                                        var $2225 = self.ini;
                                                                                                        var $2226 = self.idx;
                                                                                                        var $2227 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($2214, $2223), $2224, $2225, $2226, $2227);
                                                                                                        var self = _reply$pst$58;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $2229 = self.err;
                                                                                                                var _reply$64 = Litereum$parse$type$(_world$1)(_reply$pst$58);
                                                                                                                var self = _reply$64;
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $2231 = self.err;
                                                                                                                        var self = $2229;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Maybe.some':
                                                                                                                                var $2233 = self.value;
                                                                                                                                var $2234 = Parser$Reply$error$(Parser$Error$combine$($2233, $2231));
                                                                                                                                var $2232 = $2234;
                                                                                                                                break;
                                                                                                                            case 'Maybe.none':
                                                                                                                                var $2235 = Parser$Reply$error$($2231);
                                                                                                                                var $2232 = $2235;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $2230 = $2232;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $2236 = self.pst;
                                                                                                                        var $2237 = self.val;
                                                                                                                        var self = $2236;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $2239 = self.err;
                                                                                                                                var $2240 = self.nam;
                                                                                                                                var $2241 = self.ini;
                                                                                                                                var $2242 = self.idx;
                                                                                                                                var $2243 = self.str;
                                                                                                                                var _reply$pst$72 = Parser$State$new$(Parser$Error$maybe_combine$($2229, $2239), $2240, $2241, $2242, $2243);
                                                                                                                                var $2244 = Parser$Reply$value$(_reply$pst$72, Litereum$Eval$new$($2191, $2237));
                                                                                                                                var $2238 = $2244;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $2230 = $2238;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $2228 = $2230;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $2222 = $2228;
                                                                                                        break;
                                                                                                };
                                                                                                var $2215 = $2222;
                                                                                                break;
                                                                                        };
                                                                                        var $2213 = $2215;
                                                                                        break;
                                                                                };
                                                                                var $2207 = $2213;
                                                                                break;
                                                                        };
                                                                        var $2200 = $2207;
                                                                        break;
                                                                };
                                                                var $2198 = $2200;
                                                                break;
                                                        };
                                                        var $2192 = $2198;
                                                        break;
                                                };
                                                var $2184 = $2192;
                                                break;
                                        };
                                        var $2182 = $2184;
                                        break;
                                };
                                var $2176 = $2182;
                                break;
                        };
                        var $2169 = $2176;
                        break;
                };
                var $2167 = $2169;
                break;
        };
        return $2167;
    };
    const Litereum$parse$eval = x0 => x1 => Litereum$parse$eval$(x0, x1);

    function Litereum$Transaction$new_eval$(_eval$1) {
        var $2245 = ({
            _: 'Litereum.Transaction.new_eval',
            'eval': _eval$1
        });
        return $2245;
    };
    const Litereum$Transaction$new_eval = x0 => Litereum$Transaction$new_eval$(x0);

    function Litereum$parse$transaction$(_world$1) {
        var $2246 = Parser$choice(List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2248 = self.err;
                    var _reply$8 = Litereum$parse$text$("name", _pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2250 = self.err;
                            var self = $2248;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2252 = self.value;
                                    var $2253 = Parser$Reply$error$(Parser$Error$combine$($2252, $2250));
                                    var $2251 = $2253;
                                    break;
                                case 'Maybe.none':
                                    var $2254 = Parser$Reply$error$($2250);
                                    var $2251 = $2254;
                                    break;
                            };
                            var $2249 = $2251;
                            break;
                        case 'Parser.Reply.value':
                            var $2255 = self.pst;
                            var self = $2255;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2257 = self.err;
                                    var $2258 = self.nam;
                                    var $2259 = self.ini;
                                    var $2260 = self.idx;
                                    var $2261 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2248, $2257), $2258, $2259, $2260, $2261);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $2263 = self.err;
                                            var _reply$22 = Litereum$parse$name$(_reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2265 = self.err;
                                                    var self = $2263;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $2267 = self.value;
                                                            var $2268 = Parser$Reply$error$(Parser$Error$combine$($2267, $2265));
                                                            var $2266 = $2268;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $2269 = Parser$Reply$error$($2265);
                                                            var $2266 = $2269;
                                                            break;
                                                    };
                                                    var $2264 = $2266;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2270 = self.pst;
                                                    var $2271 = self.val;
                                                    var self = $2270;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $2273 = self.err;
                                                            var $2274 = self.nam;
                                                            var $2275 = self.ini;
                                                            var $2276 = self.idx;
                                                            var $2277 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2263, $2273), $2274, $2275, $2276, $2277);
                                                            var $2278 = Parser$Reply$value$(_reply$pst$30, Litereum$Transaction$new_name$($2271));
                                                            var $2272 = $2278;
                                                            break;
                                                    };
                                                    var $2264 = $2272;
                                                    break;
                                            };
                                            var $2262 = $2264;
                                            break;
                                    };
                                    var $2256 = $2262;
                                    break;
                            };
                            var $2249 = $2256;
                            break;
                    };
                    var $2247 = $2249;
                    break;
            };
            return $2247;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2280 = self.err;
                    var _reply$8 = Litereum$parse$text$("type", _pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2282 = self.err;
                            var self = $2280;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2284 = self.value;
                                    var $2285 = Parser$Reply$error$(Parser$Error$combine$($2284, $2282));
                                    var $2283 = $2285;
                                    break;
                                case 'Maybe.none':
                                    var $2286 = Parser$Reply$error$($2282);
                                    var $2283 = $2286;
                                    break;
                            };
                            var $2281 = $2283;
                            break;
                        case 'Parser.Reply.value':
                            var $2287 = self.pst;
                            var self = $2287;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2289 = self.err;
                                    var $2290 = self.nam;
                                    var $2291 = self.ini;
                                    var $2292 = self.idx;
                                    var $2293 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2280, $2289), $2290, $2291, $2292, $2293);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $2295 = self.err;
                                            var _reply$22 = Litereum$parse$data$(_world$1, _reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2297 = self.err;
                                                    var self = $2295;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $2299 = self.value;
                                                            var $2300 = Parser$Reply$error$(Parser$Error$combine$($2299, $2297));
                                                            var $2298 = $2300;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $2301 = Parser$Reply$error$($2297);
                                                            var $2298 = $2301;
                                                            break;
                                                    };
                                                    var $2296 = $2298;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2302 = self.pst;
                                                    var $2303 = self.val;
                                                    var self = $2302;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $2305 = self.err;
                                                            var $2306 = self.nam;
                                                            var $2307 = self.ini;
                                                            var $2308 = self.idx;
                                                            var $2309 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2295, $2305), $2306, $2307, $2308, $2309);
                                                            var $2310 = Parser$Reply$value$(_reply$pst$30, Litereum$Transaction$new_data$($2303));
                                                            var $2304 = $2310;
                                                            break;
                                                    };
                                                    var $2296 = $2304;
                                                    break;
                                            };
                                            var $2294 = $2296;
                                            break;
                                    };
                                    var $2288 = $2294;
                                    break;
                            };
                            var $2281 = $2288;
                            break;
                    };
                    var $2279 = $2281;
                    break;
            };
            return $2279;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2312 = self.err;
                    var _reply$8 = Litereum$parse$text$("bond", _pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2314 = self.err;
                            var self = $2312;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2316 = self.value;
                                    var $2317 = Parser$Reply$error$(Parser$Error$combine$($2316, $2314));
                                    var $2315 = $2317;
                                    break;
                                case 'Maybe.none':
                                    var $2318 = Parser$Reply$error$($2314);
                                    var $2315 = $2318;
                                    break;
                            };
                            var $2313 = $2315;
                            break;
                        case 'Parser.Reply.value':
                            var $2319 = self.pst;
                            var self = $2319;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2321 = self.err;
                                    var $2322 = self.nam;
                                    var $2323 = self.ini;
                                    var $2324 = self.idx;
                                    var $2325 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2312, $2321), $2322, $2323, $2324, $2325);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $2327 = self.err;
                                            var _reply$22 = Litereum$parse$bond$(_world$1, _reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2329 = self.err;
                                                    var self = $2327;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $2331 = self.value;
                                                            var $2332 = Parser$Reply$error$(Parser$Error$combine$($2331, $2329));
                                                            var $2330 = $2332;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $2333 = Parser$Reply$error$($2329);
                                                            var $2330 = $2333;
                                                            break;
                                                    };
                                                    var $2328 = $2330;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2334 = self.pst;
                                                    var $2335 = self.val;
                                                    var self = $2334;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $2337 = self.err;
                                                            var $2338 = self.nam;
                                                            var $2339 = self.ini;
                                                            var $2340 = self.idx;
                                                            var $2341 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2327, $2337), $2338, $2339, $2340, $2341);
                                                            var $2342 = Parser$Reply$value$(_reply$pst$30, Litereum$Transaction$new_bond$($2335));
                                                            var $2336 = $2342;
                                                            break;
                                                    };
                                                    var $2328 = $2336;
                                                    break;
                                            };
                                            var $2326 = $2328;
                                            break;
                                    };
                                    var $2320 = $2326;
                                    break;
                            };
                            var $2313 = $2320;
                            break;
                    };
                    var $2311 = $2313;
                    break;
            };
            return $2311;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2344 = self.err;
                    var _reply$8 = Litereum$parse$text$("eval", _pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2346 = self.err;
                            var self = $2344;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2348 = self.value;
                                    var $2349 = Parser$Reply$error$(Parser$Error$combine$($2348, $2346));
                                    var $2347 = $2349;
                                    break;
                                case 'Maybe.none':
                                    var $2350 = Parser$Reply$error$($2346);
                                    var $2347 = $2350;
                                    break;
                            };
                            var $2345 = $2347;
                            break;
                        case 'Parser.Reply.value':
                            var $2351 = self.pst;
                            var self = $2351;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2353 = self.err;
                                    var $2354 = self.nam;
                                    var $2355 = self.ini;
                                    var $2356 = self.idx;
                                    var $2357 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2344, $2353), $2354, $2355, $2356, $2357);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $2359 = self.err;
                                            var _reply$22 = Litereum$parse$eval$(_world$1, _reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2361 = self.err;
                                                    var self = $2359;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $2363 = self.value;
                                                            var $2364 = Parser$Reply$error$(Parser$Error$combine$($2363, $2361));
                                                            var $2362 = $2364;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $2365 = Parser$Reply$error$($2361);
                                                            var $2362 = $2365;
                                                            break;
                                                    };
                                                    var $2360 = $2362;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2366 = self.pst;
                                                    var $2367 = self.val;
                                                    var self = $2366;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $2369 = self.err;
                                                            var $2370 = self.nam;
                                                            var $2371 = self.ini;
                                                            var $2372 = self.idx;
                                                            var $2373 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2359, $2369), $2370, $2371, $2372, $2373);
                                                            var $2374 = Parser$Reply$value$(_reply$pst$30, Litereum$Transaction$new_eval$($2367));
                                                            var $2368 = $2374;
                                                            break;
                                                    };
                                                    var $2360 = $2368;
                                                    break;
                                            };
                                            var $2358 = $2360;
                                            break;
                                    };
                                    var $2352 = $2358;
                                    break;
                            };
                            var $2345 = $2352;
                            break;
                    };
                    var $2343 = $2345;
                    break;
            };
            return $2343;
        }), List$nil)))));
        return $2246;
    };
    const Litereum$parse$transaction = x0 => Litereum$parse$transaction$(x0);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $2376 = self.value;
                var $2377 = $2376;
                var $2375 = $2377;
                break;
            case 'Maybe.none':
                var $2378 = _a$3;
                var $2375 = $2378;
                break;
        };
        return $2375;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Map$(_V$1) {
        var $2379 = null;
        return $2379;
    };
    const Map = x0 => Map$(x0);

    function Map$set$(_key$2, _val$3, _map$4) {
        var $2380 = BBT$insert$(String$cmp, _key$2, _val$3, _map$4);
        return $2380;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $2381 = null;
        return $2381;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $2382 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $2382;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $2383 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $2383;
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
                    var $2384 = Either$left$(_n$1);
                    return $2384;
                } else {
                    var $2385 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $2387 = Either$right$(Nat$succ$($2385));
                        var $2386 = $2387;
                    } else {
                        var $2388 = (self - 1n);
                        var $2389 = Nat$sub_rem$($2388, $2385);
                        var $2386 = $2389;
                    };
                    return $2386;
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
                        var $2390 = self.value;
                        var $2391 = Nat$div_mod$go$($2390, _m$2, Nat$succ$(_d$3));
                        return $2391;
                    case 'Either.right':
                        var $2392 = Pair$new$(_d$3, _n$1);
                        return $2392;
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
                        var $2393 = self.fst;
                        var $2394 = self.snd;
                        var self = $2393;
                        if (self === 0n) {
                            var $2396 = List$cons$($2394, _res$3);
                            var $2395 = $2396;
                        } else {
                            var $2397 = (self - 1n);
                            var $2398 = Nat$to_base$go$(_base$1, $2393, List$cons$($2394, _res$3));
                            var $2395 = $2398;
                        };
                        return $2395;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $2399 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $2399;
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
                    var $2400 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $2400;
                } else {
                    var $2401 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $2403 = _r$3;
                        var $2402 = $2403;
                    } else {
                        var $2404 = (self - 1n);
                        var $2405 = Nat$mod$go$($2404, $2401, Nat$succ$(_r$3));
                        var $2402 = $2405;
                    };
                    return $2402;
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
                        var $2406 = self.head;
                        var $2407 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $2409 = Maybe$some$($2406);
                            var $2408 = $2409;
                        } else {
                            var $2410 = (self - 1n);
                            var $2411 = List$at$($2410, $2407);
                            var $2408 = $2411;
                        };
                        return $2408;
                    case 'List.nil':
                        var $2412 = Maybe$none;
                        return $2412;
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
                    var $2415 = self.value;
                    var $2416 = $2415;
                    var $2414 = $2416;
                    break;
                case 'Maybe.none':
                    var $2417 = 35;
                    var $2414 = $2417;
                    break;
            };
            var $2413 = $2414;
        } else {
            var $2418 = 35;
            var $2413 = $2418;
        };
        return $2413;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $2419 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $2420 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $2420;
        }));
        return $2419;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $2421 = Nat$to_string_base$(10n, _n$1);
        return $2421;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const Debug$log = a0 => a1 => ((console.log(a0), a1()));

    function Litereum$Entry$data$(_value$1) {
        var $2422 = ({
            _: 'Litereum.Entry.data',
            'value': _value$1
        });
        return $2422;
    };
    const Litereum$Entry$data = x0 => Litereum$Entry$data$(x0);

    function Litereum$Entry$bond$(_value$1) {
        var $2423 = ({
            _: 'Litereum.Entry.bond',
            'value': _value$1
        });
        return $2423;
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
                        var $2424 = self.head;
                        var $2425 = self.tail;
                        var self = _vals$4;
                        switch (self._) {
                            case 'List.cons':
                                var $2427 = self.head;
                                var $2428 = self.tail;
                                var $2429 = Litereum$extend$(Map$set$($2424, $2427, _map$2), $2425, $2428);
                                var $2426 = $2429;
                                break;
                            case 'List.nil':
                                var $2430 = _map$2;
                                var $2426 = $2430;
                                break;
                        };
                        return $2426;
                    case 'List.nil':
                        var self = _vals$4;
                        switch (self._) {
                            case 'List.nil':
                            case 'List.cons':
                                var $2432 = _map$2;
                                var $2431 = $2432;
                                break;
                        };
                        return $2431;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Litereum$extend = x0 => x1 => x2 => Litereum$extend$(x0, x1, x2);
    const String$eql = a0 => a1 => (a0 === a1);

    function Litereum$equal$(_a$1, _b$2) {
        var Litereum$equal$ = (_a$1, _b$2) => ({
            ctr: 'TCO',
            arg: [_a$1, _b$2]
        });
        var Litereum$equal = _a$1 => _b$2 => Litereum$equal$(_a$1, _b$2);
        var arg = [_a$1, _b$2];
        while (true) {
            let [_a$1, _b$2] = arg;
            var R = (() => {
                var self = _a$1;
                switch (self._) {
                    case 'Litereum.Type.data':
                        var $2433 = self.name;
                        var self = _b$2;
                        switch (self._) {
                            case 'Litereum.Type.data':
                                var $2435 = self.name;
                                var $2436 = ($2433 === $2435);
                                var $2434 = $2436;
                                break;
                            case 'Litereum.Type.word':
                            case 'Litereum.Type.effect':
                                var $2437 = Bool$false;
                                var $2434 = $2437;
                                break;
                        };
                        return $2434;
                    case 'Litereum.Type.effect':
                        var $2438 = self.rety;
                        var self = _b$2;
                        switch (self._) {
                            case 'Litereum.Type.effect':
                                var $2440 = self.rety;
                                var $2441 = Litereum$equal$($2438, $2440);
                                var $2439 = $2441;
                                break;
                            case 'Litereum.Type.word':
                            case 'Litereum.Type.data':
                                var $2442 = Bool$false;
                                var $2439 = $2442;
                                break;
                        };
                        return $2439;
                    case 'Litereum.Type.word':
                        var self = _b$2;
                        switch (self._) {
                            case 'Litereum.Type.word':
                                var $2444 = Bool$true;
                                var $2443 = $2444;
                                break;
                            case 'Litereum.Type.data':
                            case 'Litereum.Type.effect':
                                var $2445 = Bool$false;
                                var $2443 = $2445;
                                break;
                        };
                        return $2443;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Litereum$equal = x0 => x1 => Litereum$equal$(x0, x1);

    function Maybe$is_some$(_m$2) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.none':
                var $2447 = Bool$false;
                var $2446 = $2447;
                break;
            case 'Maybe.some':
                var $2448 = Bool$true;
                var $2446 = $2448;
                break;
        };
        return $2446;
    };
    const Maybe$is_some = x0 => Maybe$is_some$(x0);

    function Litereum$get_bond$(_world$1, _name$2) {
        var self = _world$1;
        switch (self._) {
            case 'Litereum.World.new':
                var $2450 = self.entry;
                var $2451 = Maybe$monad$((_m$bind$7 => _m$pure$8 => {
                    var $2452 = _m$bind$7;
                    return $2452;
                }))(Map$get$(_name$2, $2450))((_entry$7 => {
                    var self = _entry$7;
                    switch (self._) {
                        case 'Litereum.Entry.bond':
                            var $2454 = self.value;
                            var $2455 = Maybe$some$($2454);
                            var $2453 = $2455;
                            break;
                        case 'Litereum.Entry.data':
                            var $2456 = Maybe$none;
                            var $2453 = $2456;
                            break;
                    };
                    return $2453;
                }));
                var $2449 = $2451;
                break;
        };
        return $2449;
    };
    const Litereum$get_bond = x0 => x1 => Litereum$get_bond$(x0, x1);

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.cons':
                var $2458 = self.head;
                var $2459 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.cons':
                        var $2461 = self.head;
                        var $2462 = self.tail;
                        var $2463 = List$cons$(Pair$new$($2458, $2461), List$zip$($2459, $2462));
                        var $2460 = $2463;
                        break;
                    case 'List.nil':
                        var $2464 = List$nil;
                        var $2460 = $2464;
                        break;
                };
                var $2457 = $2460;
                break;
            case 'List.nil':
                var $2465 = List$nil;
                var $2457 = $2465;
                break;
        };
        return $2457;
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
                        var $2466 = self.head;
                        var $2467 = self.tail;
                        var self = _cond$2($2466);
                        if (self) {
                            var $2469 = List$all$(_cond$2, $2467);
                            var $2468 = $2469;
                        } else {
                            var $2470 = Bool$false;
                            var $2468 = $2470;
                        };
                        return $2468;
                    case 'List.nil':
                        var $2471 = Bool$true;
                        return $2471;
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
                var $2473 = self.value;
                var $2474 = Maybe$some$(_f$4($2473));
                var $2472 = $2474;
                break;
            case 'Maybe.none':
                var $2475 = Maybe$none;
                var $2472 = $2475;
                break;
        };
        return $2472;
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
                        var $2476 = self.head;
                        var $2477 = self.tail;
                        var self = _f$3(_i$4)($2476);
                        if (self) {
                            var $2479 = Maybe$some$(Pair$new$(_i$4, $2476));
                            var $2478 = $2479;
                        } else {
                            var $2480 = List$ifind$go$($2477, _f$3, Nat$succ$(_i$4));
                            var $2478 = $2480;
                        };
                        return $2478;
                    case 'List.nil':
                        var $2481 = Maybe$none;
                        return $2481;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$ifind$go = x0 => x1 => x2 => List$ifind$go$(x0, x1, x2);

    function List$ifind$(_f$2, _xs$3) {
        var $2482 = List$ifind$go$(_xs$3, _f$2, Nat$zero);
        return $2482;
    };
    const List$ifind = x0 => x1 => List$ifind$(x0, x1);

    function Litereum$get_constructor_value$(_data$1, _name$2) {
        var $2483 = Maybe$mapped$(List$ifind$((_i$3 => _ctr$4 => {
            var $2484 = ((() => {
                var self = _ctr$4;
                switch (self._) {
                    case 'Litereum.Constructor.new':
                        var $2485 = self.name;
                        var $2486 = $2485;
                        return $2486;
                };
            })() === _name$2);
            return $2484;
        }), (() => {
            var self = _data$1;
            switch (self._) {
                case 'Litereum.Data.new':
                    var $2487 = self.constructors;
                    var $2488 = $2487;
                    return $2488;
            };
        })()), (_x$3 => {
            var self = _x$3;
            switch (self._) {
                case 'Pair.new':
                    var $2490 = self.snd;
                    var $2491 = $2490;
                    var $2489 = $2491;
                    break;
            };
            return $2489;
        }));
        return $2483;
    };
    const Litereum$get_constructor_value = x0 => x1 => Litereum$get_constructor_value$(x0, x1);
    const Nat$eql = a0 => a1 => (a0 === a1);
    const List$length = a0 => (list_length(a0));

    function List$zip_with$(_f$4, _as$5, _bs$6) {
        var self = _as$5;
        switch (self._) {
            case 'List.cons':
                var $2493 = self.head;
                var $2494 = self.tail;
                var self = _bs$6;
                switch (self._) {
                    case 'List.cons':
                        var $2496 = self.head;
                        var $2497 = self.tail;
                        var $2498 = List$cons$(_f$4($2493)($2496), List$zip_with$(_f$4, $2494, $2497));
                        var $2495 = $2498;
                        break;
                    case 'List.nil':
                        var $2499 = List$nil;
                        var $2495 = $2499;
                        break;
                };
                var $2492 = $2495;
                break;
            case 'List.nil':
                var $2500 = List$nil;
                var $2492 = $2500;
                break;
        };
        return $2492;
    };
    const List$zip_with = x0 => x1 => x2 => List$zip_with$(x0, x1, x2);

    function List$zipped_with$(_as$3, _bs$4, _f$6) {
        var $2501 = List$zip_with$(_f$6, _as$3, _bs$4);
        return $2501;
    };
    const List$zipped_with = x0 => x1 => x2 => List$zipped_with$(x0, x1, x2);

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $2503 = self.head;
                var $2504 = self.tail;
                var $2505 = List$cons$(_f$3($2503), List$map$(_f$3, $2504));
                var $2502 = $2505;
                break;
            case 'List.nil':
                var $2506 = List$nil;
                var $2502 = $2506;
                break;
        };
        return $2502;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function List$and$(_list$1) {
        var $2507 = List$all$((_x$2 => {
            var $2508 = _x$2;
            return $2508;
        }), _list$1);
        return $2507;
    };
    const List$and = x0 => List$and$(x0);

    function Litereum$check$(_context$1, _world$2, _term$3, _type$4) {
        var self = _context$1;
        switch (self._) {
            case 'BBT.tip':
                var self = _world$2;
                switch (self._) {
                    case 'Litereum.World.new':
                        var $2511 = self.name_to_index;
                        var self = _term$3;
                        switch (self._) {
                            case 'Litereum.Term.var':
                                var $2513 = self.name;
                                var self = Map$get$($2513, _context$1);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2515 = self.value;
                                        var $2516 = Litereum$equal$($2515, _type$4);
                                        var $2514 = $2516;
                                        break;
                                    case 'Maybe.none':
                                        var $2517 = Bool$false;
                                        var $2514 = $2517;
                                        break;
                                };
                                var $2512 = $2514;
                                break;
                            case 'Litereum.Term.call':
                                var $2518 = self.bond;
                                var $2519 = self.args;
                                var _def0$11 = Maybe$is_some$(Map$get$($2518, $2511));
                                var self = Litereum$get_bond$(_world$2, $2518);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2521 = self.value;
                                        var _bond$13 = $2521;
                                        var self = _bond$13;
                                        switch (self._) {
                                            case 'Litereum.Bond.new':
                                                var $2523 = self.input_types;
                                                var $2524 = self.output_type;
                                                var _otyp$20 = Litereum$equal$($2524, _type$4);
                                                var _args$21 = List$zip$($2519, $2523);
                                                var _args$22 = List$all$((_x$22 => {
                                                    var $2526 = Litereum$check$(_context$1, _world$2, (() => {
                                                        var self = _x$22;
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $2527 = self.fst;
                                                                var $2528 = $2527;
                                                                return $2528;
                                                        };
                                                    })(), (() => {
                                                        var self = _x$22;
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $2529 = self.snd;
                                                                var $2530 = $2529;
                                                                return $2530;
                                                        };
                                                    })());
                                                    return $2526;
                                                }), _args$21);
                                                var $2525 = (_def0$11 && (_otyp$20 && _args$22));
                                                var $2522 = $2525;
                                                break;
                                        };
                                        var $2520 = $2522;
                                        break;
                                    case 'Maybe.none':
                                        var $2531 = Bool$false;
                                        var $2520 = $2531;
                                        break;
                                };
                                var $2512 = $2520;
                                break;
                            case 'Litereum.Term.let':
                                var $2532 = self.name;
                                var $2533 = self.type;
                                var $2534 = self.expr;
                                var $2535 = self.body;
                                var _def0$13 = Maybe$is_some$(Map$get$($2532, $2511));
                                var _expr$14 = Litereum$check$(_context$1, _world$2, $2534, $2533);
                                var _ctx2$15 = Map$set$($2532, $2533, _context$1);
                                var _body$16 = Litereum$check$(_ctx2$15, _world$2, $2535, _type$4);
                                var $2536 = (_def0$13 && (_expr$14 && _body$16));
                                var $2512 = $2536;
                                break;
                            case 'Litereum.Term.create':
                                var $2537 = self.ctor;
                                var $2538 = self.vals;
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.data':
                                        var $2540 = self.name;
                                        var self = Litereum$get_data$(_world$2, $2540);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $2542 = self.value;
                                                var _data$13 = $2542;
                                                var self = _data$13;
                                                switch (self._) {
                                                    case 'Litereum.Data.new':
                                                        var self = Litereum$get_constructor_value$(_data$13, $2537);
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $2545 = self.value;
                                                                var _ctor$17 = $2545;
                                                                var self = _ctor$17;
                                                                switch (self._) {
                                                                    case 'Litereum.Constructor.new':
                                                                        var $2547 = self.field_types;
                                                                        var _size$21 = ((list_length($2538)) === (list_length($2547)));
                                                                        var _vals$22 = List$zip$($2538, $2547);
                                                                        var _vals$23 = List$all$((_x$23 => {
                                                                            var $2549 = Litereum$check$(_context$1, _world$2, (() => {
                                                                                var self = _x$23;
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $2550 = self.fst;
                                                                                        var $2551 = $2550;
                                                                                        return $2551;
                                                                                };
                                                                            })(), (() => {
                                                                                var self = _x$23;
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $2552 = self.snd;
                                                                                        var $2553 = $2552;
                                                                                        return $2553;
                                                                                };
                                                                            })());
                                                                            return $2549;
                                                                        }), _vals$22);
                                                                        var $2548 = (_size$21 && _vals$23);
                                                                        var $2546 = $2548;
                                                                        break;
                                                                };
                                                                var $2544 = $2546;
                                                                break;
                                                            case 'Maybe.none':
                                                                var $2554 = Bool$false;
                                                                var $2544 = $2554;
                                                                break;
                                                        };
                                                        var $2543 = $2544;
                                                        break;
                                                };
                                                var $2541 = $2543;
                                                break;
                                            case 'Maybe.none':
                                                var $2555 = Bool$false;
                                                var $2541 = $2555;
                                                break;
                                        };
                                        var $2539 = $2541;
                                        break;
                                    case 'Litereum.Type.word':
                                    case 'Litereum.Type.effect':
                                        var $2556 = Bool$false;
                                        var $2539 = $2556;
                                        break;
                                };
                                var $2512 = $2539;
                                break;
                            case 'Litereum.Term.match':
                                var $2557 = self.name;
                                var $2558 = self.data;
                                var $2559 = self.cses;
                                var self = Litereum$get_data$(_world$2, $2558);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2561 = self.value;
                                        var _data$13 = $2561;
                                        var self = _data$13;
                                        switch (self._) {
                                            case 'Litereum.Data.new':
                                                var $2563 = self.constructors;
                                                var _def0$16 = Maybe$is_some$(Map$get$($2558, $2511));
                                                var _size$17 = ((list_length($2559)) === (list_length($2563)));
                                                var _expr$18 = Litereum$check$(_context$1, _world$2, Litereum$Term$var$($2557), Litereum$Type$data$($2558));
                                                var _cses$19 = List$zipped_with$($2559, $2563, (_case_body$19 => _case_ctor$20 => {
                                                    var _nams$21 = List$map$(a1 => (($2557 + ".") + a1), (() => {
                                                        var self = _case_ctor$20;
                                                        switch (self._) {
                                                            case 'Litereum.Constructor.new':
                                                                var $2566 = self.field_names;
                                                                var $2567 = $2566;
                                                                return $2567;
                                                        };
                                                    })());
                                                    var self = _case_ctor$20;
                                                    switch (self._) {
                                                        case 'Litereum.Constructor.new':
                                                            var $2568 = self.field_types;
                                                            var $2569 = $2568;
                                                            var _typs$22 = $2569;
                                                            break;
                                                    };
                                                    var _ctx2$23 = Litereum$extend$(_context$1, _nams$21, _typs$22);
                                                    var $2565 = Litereum$check$(_ctx2$23, _world$2, _case_body$19, _type$4);
                                                    return $2565;
                                                }));
                                                var $2564 = (_def0$16 && (_size$17 && List$and$(_cses$19)));
                                                var $2562 = $2564;
                                                break;
                                        };
                                        var $2560 = $2562;
                                        break;
                                    case 'Maybe.none':
                                        var $2570 = Bool$false;
                                        var $2560 = $2570;
                                        break;
                                };
                                var $2512 = $2560;
                                break;
                            case 'Litereum.Term.compare':
                                var $2571 = self.val0;
                                var $2572 = self.iflt;
                                var $2573 = self.ifeq;
                                var $2574 = self.ifgt;
                                var _val0$14 = Litereum$check$(_context$1, _world$2, $2571, Litereum$Type$word);
                                var _val1$15 = Litereum$check$(_context$1, _world$2, $2571, Litereum$Type$word);
                                var _iflt$16 = Litereum$check$(_context$1, _world$2, $2572, _type$4);
                                var _ifeq$17 = Litereum$check$(_context$1, _world$2, $2573, _type$4);
                                var _ifgt$18 = Litereum$check$(_context$1, _world$2, $2574, _type$4);
                                var $2575 = (_val0$14 && (_val1$15 && (_iflt$16 && (_ifeq$17 && _ifgt$18))));
                                var $2512 = $2575;
                                break;
                            case 'Litereum.Term.operate':
                                var $2576 = self.val0;
                                var $2577 = self.val1;
                                var _val0$12 = Litereum$check$(_context$1, _world$2, $2576, Litereum$Type$word);
                                var _val1$13 = Litereum$check$(_context$1, _world$2, $2577, Litereum$Type$word);
                                var $2578 = (_val0$12 && _val1$13);
                                var $2512 = $2578;
                                break;
                            case 'Litereum.Term.run':
                                var $2579 = self.name;
                                var $2580 = self.type;
                                var $2581 = self.expr;
                                var $2582 = self.body;
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.word':
                                    case 'Litereum.Type.data':
                                        var $2584 = Bool$false;
                                        var $2583 = $2584;
                                        break;
                                    case 'Litereum.Type.effect':
                                        var _expr$14 = Litereum$check$(_context$1, _world$2, $2581, Litereum$Type$effect$($2580));
                                        var _ctx2$15 = Map$set$($2579, $2580, _context$1);
                                        var _body$16 = Litereum$check$(_ctx2$15, _world$2, $2582, _type$4);
                                        var $2585 = (_expr$14 && _body$16);
                                        var $2583 = $2585;
                                        break;
                                };
                                var $2512 = $2583;
                                break;
                            case 'Litereum.Term.bind':
                                var $2586 = self.bond;
                                var $2587 = self.main;
                                var $2588 = self.body;
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.word':
                                    case 'Litereum.Type.data':
                                        var $2590 = Bool$false;
                                        var $2589 = $2590;
                                        break;
                                    case 'Litereum.Type.effect':
                                        var self = Litereum$get_bond$(_world$2, $2586);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $2592 = self.value;
                                                var _bond$14 = $2592;
                                                var self = _bond$14;
                                                switch (self._) {
                                                    case 'Litereum.Bond.new':
                                                        var $2594 = self.input_names;
                                                        var $2595 = self.input_types;
                                                        var $2596 = self.output_type;
                                                        var _ctx2$21 = Litereum$extend$(_context$1, $2594, $2595);
                                                        var _main$22 = Litereum$check$(_ctx2$21, _world$2, $2587, $2596);
                                                        var _body$23 = Litereum$check$(_context$1, _world$2, $2588, _type$4);
                                                        var $2597 = (_main$22 && _body$23);
                                                        var $2593 = $2597;
                                                        break;
                                                };
                                                var $2591 = $2593;
                                                break;
                                            case 'Maybe.none':
                                                var $2598 = Bool$false;
                                                var $2591 = $2598;
                                                break;
                                        };
                                        var $2589 = $2591;
                                        break;
                                };
                                var $2512 = $2589;
                                break;
                            case 'Litereum.Term.return':
                                var $2599 = self.expr;
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.effect':
                                        var $2601 = self.rety;
                                        var $2602 = Litereum$check$(_context$1, _world$2, $2599, $2601);
                                        var $2600 = $2602;
                                        break;
                                    case 'Litereum.Type.word':
                                    case 'Litereum.Type.data':
                                        var $2603 = Bool$false;
                                        var $2600 = $2603;
                                        break;
                                };
                                var $2512 = $2600;
                                break;
                            case 'Litereum.Term.word':
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.word':
                                        var $2605 = Bool$true;
                                        var $2604 = $2605;
                                        break;
                                    case 'Litereum.Type.data':
                                    case 'Litereum.Type.effect':
                                        var $2606 = Bool$false;
                                        var $2604 = $2606;
                                        break;
                                };
                                var $2512 = $2604;
                                break;
                        };
                        var $2510 = $2512;
                        break;
                };
                var $2509 = $2510;
                break;
            case 'BBT.bin':
                var self = _world$2;
                switch (self._) {
                    case 'Litereum.World.new':
                        var $2608 = self.name_to_index;
                        var self = _term$3;
                        switch (self._) {
                            case 'Litereum.Term.var':
                                var $2610 = self.name;
                                var self = Map$get$($2610, _context$1);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2612 = self.value;
                                        var $2613 = Litereum$equal$($2612, _type$4);
                                        var $2611 = $2613;
                                        break;
                                    case 'Maybe.none':
                                        var $2614 = Bool$false;
                                        var $2611 = $2614;
                                        break;
                                };
                                var $2609 = $2611;
                                break;
                            case 'Litereum.Term.call':
                                var $2615 = self.bond;
                                var $2616 = self.args;
                                var _def0$16 = Maybe$is_some$(Map$get$($2615, $2608));
                                var self = Litereum$get_bond$(_world$2, $2615);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2618 = self.value;
                                        var _bond$18 = $2618;
                                        var self = _bond$18;
                                        switch (self._) {
                                            case 'Litereum.Bond.new':
                                                var $2620 = self.input_types;
                                                var $2621 = self.output_type;
                                                var _otyp$25 = Litereum$equal$($2621, _type$4);
                                                var _args$26 = List$zip$($2616, $2620);
                                                var _args$27 = List$all$((_x$27 => {
                                                    var $2623 = Litereum$check$(_context$1, _world$2, (() => {
                                                        var self = _x$27;
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $2624 = self.fst;
                                                                var $2625 = $2624;
                                                                return $2625;
                                                        };
                                                    })(), (() => {
                                                        var self = _x$27;
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $2626 = self.snd;
                                                                var $2627 = $2626;
                                                                return $2627;
                                                        };
                                                    })());
                                                    return $2623;
                                                }), _args$26);
                                                var $2622 = (_def0$16 && (_otyp$25 && _args$27));
                                                var $2619 = $2622;
                                                break;
                                        };
                                        var $2617 = $2619;
                                        break;
                                    case 'Maybe.none':
                                        var $2628 = Bool$false;
                                        var $2617 = $2628;
                                        break;
                                };
                                var $2609 = $2617;
                                break;
                            case 'Litereum.Term.let':
                                var $2629 = self.name;
                                var $2630 = self.type;
                                var $2631 = self.expr;
                                var $2632 = self.body;
                                var _def0$18 = Maybe$is_some$(Map$get$($2629, $2608));
                                var _expr$19 = Litereum$check$(_context$1, _world$2, $2631, $2630);
                                var _ctx2$20 = Map$set$($2629, $2630, _context$1);
                                var _body$21 = Litereum$check$(_ctx2$20, _world$2, $2632, _type$4);
                                var $2633 = (_def0$18 && (_expr$19 && _body$21));
                                var $2609 = $2633;
                                break;
                            case 'Litereum.Term.create':
                                var $2634 = self.ctor;
                                var $2635 = self.vals;
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.data':
                                        var $2637 = self.name;
                                        var self = Litereum$get_data$(_world$2, $2637);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $2639 = self.value;
                                                var _data$18 = $2639;
                                                var self = _data$18;
                                                switch (self._) {
                                                    case 'Litereum.Data.new':
                                                        var self = Litereum$get_constructor_value$(_data$18, $2634);
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $2642 = self.value;
                                                                var _ctor$22 = $2642;
                                                                var self = _ctor$22;
                                                                switch (self._) {
                                                                    case 'Litereum.Constructor.new':
                                                                        var $2644 = self.field_types;
                                                                        var _size$26 = ((list_length($2635)) === (list_length($2644)));
                                                                        var _vals$27 = List$zip$($2635, $2644);
                                                                        var _vals$28 = List$all$((_x$28 => {
                                                                            var $2646 = Litereum$check$(_context$1, _world$2, (() => {
                                                                                var self = _x$28;
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $2647 = self.fst;
                                                                                        var $2648 = $2647;
                                                                                        return $2648;
                                                                                };
                                                                            })(), (() => {
                                                                                var self = _x$28;
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $2649 = self.snd;
                                                                                        var $2650 = $2649;
                                                                                        return $2650;
                                                                                };
                                                                            })());
                                                                            return $2646;
                                                                        }), _vals$27);
                                                                        var $2645 = (_size$26 && _vals$28);
                                                                        var $2643 = $2645;
                                                                        break;
                                                                };
                                                                var $2641 = $2643;
                                                                break;
                                                            case 'Maybe.none':
                                                                var $2651 = Bool$false;
                                                                var $2641 = $2651;
                                                                break;
                                                        };
                                                        var $2640 = $2641;
                                                        break;
                                                };
                                                var $2638 = $2640;
                                                break;
                                            case 'Maybe.none':
                                                var $2652 = Bool$false;
                                                var $2638 = $2652;
                                                break;
                                        };
                                        var $2636 = $2638;
                                        break;
                                    case 'Litereum.Type.word':
                                    case 'Litereum.Type.effect':
                                        var $2653 = Bool$false;
                                        var $2636 = $2653;
                                        break;
                                };
                                var $2609 = $2636;
                                break;
                            case 'Litereum.Term.match':
                                var $2654 = self.name;
                                var $2655 = self.data;
                                var $2656 = self.cses;
                                var self = Litereum$get_data$(_world$2, $2655);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2658 = self.value;
                                        var _data$18 = $2658;
                                        var self = _data$18;
                                        switch (self._) {
                                            case 'Litereum.Data.new':
                                                var $2660 = self.constructors;
                                                var _def0$21 = Maybe$is_some$(Map$get$($2655, $2608));
                                                var _size$22 = ((list_length($2656)) === (list_length($2660)));
                                                var _expr$23 = Litereum$check$(_context$1, _world$2, Litereum$Term$var$($2654), Litereum$Type$data$($2655));
                                                var _cses$24 = List$zipped_with$($2656, $2660, (_case_body$24 => _case_ctor$25 => {
                                                    var _nams$26 = List$map$(a1 => (($2654 + ".") + a1), (() => {
                                                        var self = _case_ctor$25;
                                                        switch (self._) {
                                                            case 'Litereum.Constructor.new':
                                                                var $2663 = self.field_names;
                                                                var $2664 = $2663;
                                                                return $2664;
                                                        };
                                                    })());
                                                    var self = _case_ctor$25;
                                                    switch (self._) {
                                                        case 'Litereum.Constructor.new':
                                                            var $2665 = self.field_types;
                                                            var $2666 = $2665;
                                                            var _typs$27 = $2666;
                                                            break;
                                                    };
                                                    var _ctx2$28 = Litereum$extend$(_context$1, _nams$26, _typs$27);
                                                    var $2662 = Litereum$check$(_ctx2$28, _world$2, _case_body$24, _type$4);
                                                    return $2662;
                                                }));
                                                var $2661 = (_def0$21 && (_size$22 && List$and$(_cses$24)));
                                                var $2659 = $2661;
                                                break;
                                        };
                                        var $2657 = $2659;
                                        break;
                                    case 'Maybe.none':
                                        var $2667 = Bool$false;
                                        var $2657 = $2667;
                                        break;
                                };
                                var $2609 = $2657;
                                break;
                            case 'Litereum.Term.compare':
                                var $2668 = self.val0;
                                var $2669 = self.iflt;
                                var $2670 = self.ifeq;
                                var $2671 = self.ifgt;
                                var _val0$19 = Litereum$check$(_context$1, _world$2, $2668, Litereum$Type$word);
                                var _val1$20 = Litereum$check$(_context$1, _world$2, $2668, Litereum$Type$word);
                                var _iflt$21 = Litereum$check$(_context$1, _world$2, $2669, _type$4);
                                var _ifeq$22 = Litereum$check$(_context$1, _world$2, $2670, _type$4);
                                var _ifgt$23 = Litereum$check$(_context$1, _world$2, $2671, _type$4);
                                var $2672 = (_val0$19 && (_val1$20 && (_iflt$21 && (_ifeq$22 && _ifgt$23))));
                                var $2609 = $2672;
                                break;
                            case 'Litereum.Term.operate':
                                var $2673 = self.val0;
                                var $2674 = self.val1;
                                var _val0$17 = Litereum$check$(_context$1, _world$2, $2673, Litereum$Type$word);
                                var _val1$18 = Litereum$check$(_context$1, _world$2, $2674, Litereum$Type$word);
                                var $2675 = (_val0$17 && _val1$18);
                                var $2609 = $2675;
                                break;
                            case 'Litereum.Term.run':
                                var $2676 = self.name;
                                var $2677 = self.type;
                                var $2678 = self.expr;
                                var $2679 = self.body;
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.word':
                                    case 'Litereum.Type.data':
                                        var $2681 = Bool$false;
                                        var $2680 = $2681;
                                        break;
                                    case 'Litereum.Type.effect':
                                        var _expr$19 = Litereum$check$(_context$1, _world$2, $2678, Litereum$Type$effect$($2677));
                                        var _ctx2$20 = Map$set$($2676, $2677, _context$1);
                                        var _body$21 = Litereum$check$(_ctx2$20, _world$2, $2679, _type$4);
                                        var $2682 = (_expr$19 && _body$21);
                                        var $2680 = $2682;
                                        break;
                                };
                                var $2609 = $2680;
                                break;
                            case 'Litereum.Term.bind':
                                var $2683 = self.bond;
                                var $2684 = self.main;
                                var $2685 = self.body;
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.word':
                                    case 'Litereum.Type.data':
                                        var $2687 = Bool$false;
                                        var $2686 = $2687;
                                        break;
                                    case 'Litereum.Type.effect':
                                        var self = Litereum$get_bond$(_world$2, $2683);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $2689 = self.value;
                                                var _bond$19 = $2689;
                                                var self = _bond$19;
                                                switch (self._) {
                                                    case 'Litereum.Bond.new':
                                                        var $2691 = self.input_names;
                                                        var $2692 = self.input_types;
                                                        var $2693 = self.output_type;
                                                        var _ctx2$26 = Litereum$extend$(_context$1, $2691, $2692);
                                                        var _main$27 = Litereum$check$(_ctx2$26, _world$2, $2684, $2693);
                                                        var _body$28 = Litereum$check$(_context$1, _world$2, $2685, _type$4);
                                                        var $2694 = (_main$27 && _body$28);
                                                        var $2690 = $2694;
                                                        break;
                                                };
                                                var $2688 = $2690;
                                                break;
                                            case 'Maybe.none':
                                                var $2695 = Bool$false;
                                                var $2688 = $2695;
                                                break;
                                        };
                                        var $2686 = $2688;
                                        break;
                                };
                                var $2609 = $2686;
                                break;
                            case 'Litereum.Term.return':
                                var $2696 = self.expr;
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.effect':
                                        var $2698 = self.rety;
                                        var $2699 = Litereum$check$(_context$1, _world$2, $2696, $2698);
                                        var $2697 = $2699;
                                        break;
                                    case 'Litereum.Type.word':
                                    case 'Litereum.Type.data':
                                        var $2700 = Bool$false;
                                        var $2697 = $2700;
                                        break;
                                };
                                var $2609 = $2697;
                                break;
                            case 'Litereum.Term.word':
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.word':
                                        var $2702 = Bool$true;
                                        var $2701 = $2702;
                                        break;
                                    case 'Litereum.Type.data':
                                    case 'Litereum.Type.effect':
                                        var $2703 = Bool$false;
                                        var $2701 = $2703;
                                        break;
                                };
                                var $2609 = $2701;
                                break;
                        };
                        var $2607 = $2609;
                        break;
                };
                var $2509 = $2607;
                break;
        };
        return $2509;
    };
    const Litereum$check = x0 => x1 => x2 => x3 => Litereum$check$(x0, x1, x2, x3);

    function Litereum$sanitize$many$(_world$1, _table$2, _fresh$3, _terms$4) {
        var self = _terms$4;
        switch (self._) {
            case 'List.cons':
                var $2705 = self.head;
                var $2706 = self.tail;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $2705);
                switch (self._) {
                    case 'Pair.new':
                        var $2708 = self.fst;
                        var $2709 = self.snd;
                        var self = Litereum$sanitize$many$(_world$1, _table$2, $2708, $2706);
                        switch (self._) {
                            case 'Pair.new':
                                var $2711 = self.fst;
                                var $2712 = self.snd;
                                var $2713 = Pair$new$($2711, List$cons$($2709, $2712));
                                var $2710 = $2713;
                                break;
                        };
                        var $2707 = $2710;
                        break;
                };
                var $2704 = $2707;
                break;
            case 'List.nil':
                var $2714 = Pair$new$(_fresh$3, List$nil);
                var $2704 = $2714;
                break;
        };
        return $2704;
    };
    const Litereum$sanitize$many = x0 => x1 => x2 => x3 => Litereum$sanitize$many$(x0, x1, x2, x3);

    function Triple$new$(_fst$4, _snd$5, _trd$6) {
        var $2715 = ({
            _: 'Triple.new',
            'fst': _fst$4,
            'snd': _snd$5,
            'trd': _trd$6
        });
        return $2715;
    };
    const Triple$new = x0 => x1 => x2 => Triple$new$(x0, x1, x2);

    function Litereum$rename$(_table$1, _fresh$2, _old_name$3) {
        var _new_name$4 = ("$" + Nat$show$(_fresh$2));
        var _table$5 = Map$set$(_old_name$3, _new_name$4, _table$1);
        var _fresh$6 = Nat$succ$(_fresh$2);
        var $2716 = Triple$new$(_table$5, _fresh$6, _new_name$4);
        return $2716;
    };
    const Litereum$rename = x0 => x1 => x2 => Litereum$rename$(x0, x1, x2);

    function Litereum$get_constructors$(_world$1, _name$2) {
        var self = Litereum$get_data$(_world$1, _name$2);
        switch (self._) {
            case 'Maybe.some':
                var $2718 = self.value;
                var $2719 = Maybe$some$((() => {
                    var self = $2718;
                    switch (self._) {
                        case 'Litereum.Data.new':
                            var $2720 = self.constructors;
                            var $2721 = $2720;
                            return $2721;
                    };
                })());
                var $2717 = $2719;
                break;
            case 'Maybe.none':
                var $2722 = Maybe$none;
                var $2717 = $2722;
                break;
        };
        return $2717;
    };
    const Litereum$get_constructors = x0 => x1 => Litereum$get_constructors$(x0, x1);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Litereum$sanitize$cases$(_world$1, _table$2, _fresh$3, _old_name$4, _new_name$5, _ctrs$6, _cses$7) {
        var self = _ctrs$6;
        switch (self._) {
            case 'List.cons':
                var $2724 = self.head;
                var $2725 = self.tail;
                var self = _cses$7;
                switch (self._) {
                    case 'List.cons':
                        var $2727 = self.head;
                        var $2728 = self.tail;
                        var _new_table$12 = _table$2;
                        var _new_table$13 = (() => {
                            var $2731 = _new_table$12;
                            var self = $2724;
                            switch (self._) {
                                case 'Litereum.Constructor.new':
                                    var $2733 = self.field_names;
                                    var $2734 = $2733;
                                    var $2732 = $2734;
                                    break;
                            };
                            let _new_table$14 = $2731;
                            let _field$13;
                            while ($2732._ === 'List.cons') {
                                _field$13 = $2732.head;
                                var $2731 = Map$set$((_old_name$4 + ("." + _field$13)), (_new_name$5 + ("." + _field$13)), _new_table$14);
                                _new_table$14 = $2731;
                                $2732 = $2732.tail;
                            }
                            return _new_table$14;
                        })();
                        var self = Litereum$sanitize$(_world$1, _new_table$13, _fresh$3, $2727);
                        switch (self._) {
                            case 'Pair.new':
                                var $2735 = self.fst;
                                var $2736 = self.snd;
                                var self = Litereum$sanitize$cases$(_world$1, _table$2, $2735, _old_name$4, _new_name$5, $2725, $2728);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2738 = self.fst;
                                        var $2739 = self.snd;
                                        var $2740 = Pair$new$($2738, List$cons$($2736, $2739));
                                        var $2737 = $2740;
                                        break;
                                };
                                var $2729 = $2737;
                                break;
                        };
                        var $2726 = $2729;
                        break;
                    case 'List.nil':
                        var $2741 = Pair$new$(_fresh$3, List$nil);
                        var $2726 = $2741;
                        break;
                };
                var $2723 = $2726;
                break;
            case 'List.nil':
                var self = _cses$7;
                switch (self._) {
                    case 'List.nil':
                    case 'List.cons':
                        var $2743 = Pair$new$(_fresh$3, List$nil);
                        var $2742 = $2743;
                        break;
                };
                var $2723 = $2742;
                break;
        };
        return $2723;
    };
    const Litereum$sanitize$cases = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Litereum$sanitize$cases$(x0, x1, x2, x3, x4, x5, x6);

    function Triple$(_A$1, _B$2, _C$3) {
        var $2744 = null;
        return $2744;
    };
    const Triple = x0 => x1 => x2 => Triple$(x0, x1, x2);

    function Litereum$rename$many$(_table$1, _fresh$2, _names$3) {
        var self = _names$3;
        switch (self._) {
            case 'List.cons':
                var $2746 = self.head;
                var $2747 = self.tail;
                var self = Litereum$rename$(_table$1, _fresh$2, $2746);
                switch (self._) {
                    case 'Triple.new':
                        var $2749 = self.fst;
                        var $2750 = self.snd;
                        var $2751 = self.trd;
                        var self = Litereum$rename$many$($2749, $2750, $2747);
                        switch (self._) {
                            case 'Triple.new':
                                var $2753 = self.fst;
                                var $2754 = self.snd;
                                var $2755 = self.trd;
                                var $2756 = Triple$new$($2753, $2754, List$cons$($2751, $2755));
                                var $2752 = $2756;
                                break;
                        };
                        var $2748 = $2752;
                        break;
                };
                var $2745 = $2748;
                break;
            case 'List.nil':
                var $2757 = Triple$new$(_table$1, _fresh$2, List$nil);
                var $2745 = $2757;
                break;
        };
        return $2745;
    };
    const Litereum$rename$many = x0 => x1 => x2 => Litereum$rename$many$(x0, x1, x2);

    function Litereum$sanitize$(_world$1, _table$2, _fresh$3, _term$4) {
        var self = _term$4;
        switch (self._) {
            case 'Litereum.Term.var':
                var $2759 = self.name;
                var _term$6 = Litereum$Term$var$(Maybe$default$(Map$get$($2759, _table$2), $2759));
                var $2760 = Pair$new$(_fresh$3, _term$6);
                var $2758 = $2760;
                break;
            case 'Litereum.Term.call':
                var $2761 = self.bond;
                var $2762 = self.args;
                var self = Litereum$sanitize$many$(_world$1, _table$2, _fresh$3, $2762);
                switch (self._) {
                    case 'Pair.new':
                        var $2764 = self.fst;
                        var $2765 = self.snd;
                        var $2766 = Pair$new$($2764, Litereum$Term$call$($2761, $2765));
                        var $2763 = $2766;
                        break;
                };
                var $2758 = $2763;
                break;
            case 'Litereum.Term.let':
                var $2767 = self.name;
                var $2768 = self.type;
                var $2769 = self.expr;
                var $2770 = self.body;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $2769);
                switch (self._) {
                    case 'Pair.new':
                        var $2772 = self.fst;
                        var $2773 = self.snd;
                        var self = Litereum$rename$(_table$2, $2772, $2767);
                        switch (self._) {
                            case 'Triple.new':
                                var $2775 = self.fst;
                                var $2776 = self.snd;
                                var $2777 = self.trd;
                                var self = Litereum$sanitize$(_world$1, $2775, $2776, $2770);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2779 = self.fst;
                                        var $2780 = self.snd;
                                        var $2781 = Pair$new$($2779, Litereum$Term$let$($2777, $2768, $2773, $2780));
                                        var $2778 = $2781;
                                        break;
                                };
                                var $2774 = $2778;
                                break;
                        };
                        var $2771 = $2774;
                        break;
                };
                var $2758 = $2771;
                break;
            case 'Litereum.Term.create':
                var $2782 = self.ctor;
                var $2783 = self.vals;
                var self = Litereum$sanitize$many$(_world$1, _table$2, _fresh$3, $2783);
                switch (self._) {
                    case 'Pair.new':
                        var $2785 = self.fst;
                        var $2786 = self.snd;
                        var $2787 = Pair$new$($2785, Litereum$Term$create$($2782, $2786));
                        var $2784 = $2787;
                        break;
                };
                var $2758 = $2784;
                break;
            case 'Litereum.Term.match':
                var $2788 = self.name;
                var $2789 = self.data;
                var $2790 = self.cses;
                var _ctrs$8 = Maybe$default$(Litereum$get_constructors$(_world$1, $2789), List$nil);
                var _old_name$9 = $2788;
                var _new_name$10 = Maybe$default$(Map$get$($2788, _table$2), $2788);
                var self = Litereum$sanitize$cases$(_world$1, _table$2, _fresh$3, _old_name$9, _new_name$10, _ctrs$8, $2790);
                switch (self._) {
                    case 'Pair.new':
                        var $2792 = self.fst;
                        var $2793 = self.snd;
                        var $2794 = Pair$new$($2792, Litereum$Term$match$(_new_name$10, $2789, $2793));
                        var $2791 = $2794;
                        break;
                };
                var $2758 = $2791;
                break;
            case 'Litereum.Term.word':
                var $2795 = self.numb;
                var $2796 = Pair$new$(_fresh$3, Litereum$Term$word$($2795));
                var $2758 = $2796;
                break;
            case 'Litereum.Term.compare':
                var $2797 = self.val0;
                var $2798 = self.val1;
                var $2799 = self.iflt;
                var $2800 = self.ifeq;
                var $2801 = self.ifgt;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $2797);
                switch (self._) {
                    case 'Pair.new':
                        var $2803 = self.fst;
                        var $2804 = self.snd;
                        var self = Litereum$sanitize$(_world$1, _table$2, $2803, $2798);
                        switch (self._) {
                            case 'Pair.new':
                                var $2806 = self.fst;
                                var $2807 = self.snd;
                                var self = Litereum$sanitize$(_world$1, _table$2, $2806, $2799);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2809 = self.fst;
                                        var $2810 = self.snd;
                                        var self = Litereum$sanitize$(_world$1, _table$2, $2809, $2800);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $2812 = self.fst;
                                                var $2813 = self.snd;
                                                var self = Litereum$sanitize$(_world$1, _table$2, $2812, $2801);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $2815 = self.fst;
                                                        var $2816 = self.snd;
                                                        var $2817 = Pair$new$($2815, Litereum$Term$compare$($2804, $2807, $2810, $2813, $2816));
                                                        var $2814 = $2817;
                                                        break;
                                                };
                                                var $2811 = $2814;
                                                break;
                                        };
                                        var $2808 = $2811;
                                        break;
                                };
                                var $2805 = $2808;
                                break;
                        };
                        var $2802 = $2805;
                        break;
                };
                var $2758 = $2802;
                break;
            case 'Litereum.Term.operate':
                var $2818 = self.oper;
                var $2819 = self.val0;
                var $2820 = self.val1;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $2819);
                switch (self._) {
                    case 'Pair.new':
                        var $2822 = self.fst;
                        var $2823 = self.snd;
                        var self = Litereum$sanitize$(_world$1, _table$2, $2822, $2820);
                        switch (self._) {
                            case 'Pair.new':
                                var $2825 = self.fst;
                                var $2826 = self.snd;
                                var $2827 = Pair$new$($2825, Litereum$Term$operate$($2818, $2823, $2826));
                                var $2824 = $2827;
                                break;
                        };
                        var $2821 = $2824;
                        break;
                };
                var $2758 = $2821;
                break;
            case 'Litereum.Term.run':
                var $2828 = self.name;
                var $2829 = self.type;
                var $2830 = self.expr;
                var $2831 = self.body;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $2830);
                switch (self._) {
                    case 'Pair.new':
                        var $2833 = self.fst;
                        var $2834 = self.snd;
                        var self = Litereum$rename$(_table$2, $2833, $2828);
                        switch (self._) {
                            case 'Triple.new':
                                var $2836 = self.fst;
                                var $2837 = self.snd;
                                var self = Litereum$sanitize$(_world$1, $2836, $2837, $2831);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2839 = self.fst;
                                        var $2840 = self.snd;
                                        var $2841 = Pair$new$($2839, Litereum$Term$run$($2828, $2829, $2834, $2840));
                                        var $2838 = $2841;
                                        break;
                                };
                                var $2835 = $2838;
                                break;
                        };
                        var $2832 = $2835;
                        break;
                };
                var $2758 = $2832;
                break;
            case 'Litereum.Term.bind':
                var $2842 = self.bond;
                var $2843 = self.main;
                var $2844 = self.body;
                var self = Litereum$get_bond$(_world$1, $2842);
                switch (self._) {
                    case 'Maybe.some':
                        var $2846 = self.value;
                        var _bond$9 = $2846;
                        var self = _bond$9;
                        switch (self._) {
                            case 'Litereum.Bond.new':
                                var $2848 = self.input_names;
                                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $2844);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2850 = self.fst;
                                        var $2851 = self.snd;
                                        var self = Litereum$rename$many$(_table$2, $2850, $2848);
                                        switch (self._) {
                                            case 'Triple.new':
                                                var $2853 = self.fst;
                                                var $2854 = self.snd;
                                                var self = Litereum$sanitize$(_world$1, $2853, $2854, $2843);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $2856 = self.fst;
                                                        var $2857 = self.snd;
                                                        var $2858 = Pair$new$($2856, Litereum$Term$bind$($2842, $2857, $2851));
                                                        var $2855 = $2858;
                                                        break;
                                                };
                                                var $2852 = $2855;
                                                break;
                                        };
                                        var $2849 = $2852;
                                        break;
                                };
                                var $2847 = $2849;
                                break;
                        };
                        var $2845 = $2847;
                        break;
                    case 'Maybe.none':
                        var $2859 = Pair$new$(_fresh$3, _term$4);
                        var $2845 = $2859;
                        break;
                };
                var $2758 = $2845;
                break;
            case 'Litereum.Term.return':
                var $2860 = self.expr;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $2860);
                switch (self._) {
                    case 'Pair.new':
                        var $2862 = self.fst;
                        var $2863 = self.snd;
                        var $2864 = Pair$new$($2862, Litereum$Term$return$($2863));
                        var $2861 = $2864;
                        break;
                };
                var $2758 = $2861;
                break;
        };
        return $2758;
    };
    const Litereum$sanitize = x0 => x1 => x2 => x3 => Litereum$sanitize$(x0, x1, x2, x3);

    function Litereum$Runtime$(_A$1) {
        var $2865 = null;
        return $2865;
    };
    const Litereum$Runtime = x0 => Litereum$Runtime$(x0);

    function Litereum$Runtime$new$(_world$2, _subst$3, _fresh$4, _gas$5, _term$6) {
        var $2866 = ({
            _: 'Litereum.Runtime.new',
            'world': _world$2,
            'subst': _subst$3,
            'fresh': _fresh$4,
            'gas': _gas$5,
            'term': _term$6
        });
        return $2866;
    };
    const Litereum$Runtime$new = x0 => x1 => x2 => x3 => x4 => Litereum$Runtime$new$(x0, x1, x2, x3, x4);
    const U64$from_nat = a0 => (a0 & 0xFFFFFFFFFFFFFFFFn);

    function Litereum$get_constructor_index$(_data$1, _name$2) {
        var $2867 = Maybe$mapped$(List$ifind$((_i$3 => _ctr$4 => {
            var $2868 = ((() => {
                var self = _ctr$4;
                switch (self._) {
                    case 'Litereum.Constructor.new':
                        var $2869 = self.name;
                        var $2870 = $2869;
                        return $2870;
                };
            })() === _name$2);
            return $2868;
        }), (() => {
            var self = _data$1;
            switch (self._) {
                case 'Litereum.Data.new':
                    var $2871 = self.constructors;
                    var $2872 = $2871;
                    return $2872;
            };
        })()), (_x$3 => {
            var self = _x$3;
            switch (self._) {
                case 'Pair.new':
                    var $2874 = self.fst;
                    var $2875 = $2874;
                    var $2873 = $2875;
                    break;
            };
            return $2873;
        }));
        return $2867;
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
                        var $2876 = self.head;
                        var $2877 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $2879 = Maybe$some$($2876);
                            var $2878 = $2879;
                        } else {
                            var $2880 = (self - 1n);
                            var $2881 = List$get$($2880, $2877);
                            var $2878 = $2881;
                        };
                        return $2878;
                    case 'List.nil':
                        var $2882 = Maybe$none;
                        return $2882;
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
            var $2884 = Cmp$ltn;
            var $2883 = $2884;
        } else {
            var self = (_a$1 === _b$2);
            if (self) {
                var $2886 = Cmp$eql;
                var $2885 = $2886;
            } else {
                var $2887 = Cmp$gtn;
                var $2885 = $2887;
            };
            var $2883 = $2885;
        };
        return $2883;
    };
    const U64$cmp = x0 => x1 => U64$cmp$(x0, x1);
    const U64$add = a0 => a1 => ((a0 + a1) & 0xFFFFFFFFFFFFFFFFn);

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $2889 = self.pred;
                var $2890 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $2892 = self.pred;
                            var $2893 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2895 = Word$i$(Word$subber$(_a$pred$10, $2892, Bool$true));
                                    var $2894 = $2895;
                                } else {
                                    var $2896 = Word$o$(Word$subber$(_a$pred$10, $2892, Bool$false));
                                    var $2894 = $2896;
                                };
                                return $2894;
                            });
                            var $2891 = $2893;
                            break;
                        case 'Word.i':
                            var $2897 = self.pred;
                            var $2898 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2900 = Word$o$(Word$subber$(_a$pred$10, $2897, Bool$true));
                                    var $2899 = $2900;
                                } else {
                                    var $2901 = Word$i$(Word$subber$(_a$pred$10, $2897, Bool$true));
                                    var $2899 = $2901;
                                };
                                return $2899;
                            });
                            var $2891 = $2898;
                            break;
                        case 'Word.e':
                            var $2902 = (_a$pred$8 => {
                                var $2903 = Word$e;
                                return $2903;
                            });
                            var $2891 = $2902;
                            break;
                    };
                    var $2891 = $2891($2889);
                    return $2891;
                });
                var $2888 = $2890;
                break;
            case 'Word.i':
                var $2904 = self.pred;
                var $2905 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $2907 = self.pred;
                            var $2908 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2910 = Word$o$(Word$subber$(_a$pred$10, $2907, Bool$false));
                                    var $2909 = $2910;
                                } else {
                                    var $2911 = Word$i$(Word$subber$(_a$pred$10, $2907, Bool$false));
                                    var $2909 = $2911;
                                };
                                return $2909;
                            });
                            var $2906 = $2908;
                            break;
                        case 'Word.i':
                            var $2912 = self.pred;
                            var $2913 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2915 = Word$i$(Word$subber$(_a$pred$10, $2912, Bool$true));
                                    var $2914 = $2915;
                                } else {
                                    var $2916 = Word$o$(Word$subber$(_a$pred$10, $2912, Bool$false));
                                    var $2914 = $2916;
                                };
                                return $2914;
                            });
                            var $2906 = $2913;
                            break;
                        case 'Word.e':
                            var $2917 = (_a$pred$8 => {
                                var $2918 = Word$e;
                                return $2918;
                            });
                            var $2906 = $2917;
                            break;
                    };
                    var $2906 = $2906($2904);
                    return $2906;
                });
                var $2888 = $2905;
                break;
            case 'Word.e':
                var $2919 = (_b$5 => {
                    var $2920 = Word$e;
                    return $2920;
                });
                var $2888 = $2919;
                break;
        };
        var $2888 = $2888(_b$3);
        return $2888;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $2921 = Word$subber$(_a$2, _b$3, Bool$false);
        return $2921;
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
                        var $2922 = self.pred;
                        var $2923 = Word$bit_length$go$($2922, Nat$succ$(_c$3), _n$4);
                        return $2923;
                    case 'Word.i':
                        var $2924 = self.pred;
                        var $2925 = Word$bit_length$go$($2924, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $2925;
                    case 'Word.e':
                        var $2926 = _n$4;
                        return $2926;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $2927 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $2927;
    };
    const Word$bit_length = x0 => Word$bit_length$(x0);
    const Nat$ltn = a0 => a1 => (a0 < a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $2929 = Bool$false;
                var $2928 = $2929;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $2930 = Bool$true;
                var $2928 = $2930;
                break;
        };
        return $2928;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $2931 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $2931;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $2933 = self.pred;
                var $2934 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $2936 = self.pred;
                            var $2937 = (_a$pred$9 => {
                                var $2938 = Word$o$(Word$or$(_a$pred$9, $2936));
                                return $2938;
                            });
                            var $2935 = $2937;
                            break;
                        case 'Word.i':
                            var $2939 = self.pred;
                            var $2940 = (_a$pred$9 => {
                                var $2941 = Word$i$(Word$or$(_a$pred$9, $2939));
                                return $2941;
                            });
                            var $2935 = $2940;
                            break;
                        case 'Word.e':
                            var $2942 = (_a$pred$7 => {
                                var $2943 = Word$e;
                                return $2943;
                            });
                            var $2935 = $2942;
                            break;
                    };
                    var $2935 = $2935($2933);
                    return $2935;
                });
                var $2932 = $2934;
                break;
            case 'Word.i':
                var $2944 = self.pred;
                var $2945 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $2947 = self.pred;
                            var $2948 = (_a$pred$9 => {
                                var $2949 = Word$i$(Word$or$(_a$pred$9, $2947));
                                return $2949;
                            });
                            var $2946 = $2948;
                            break;
                        case 'Word.i':
                            var $2950 = self.pred;
                            var $2951 = (_a$pred$9 => {
                                var $2952 = Word$i$(Word$or$(_a$pred$9, $2950));
                                return $2952;
                            });
                            var $2946 = $2951;
                            break;
                        case 'Word.e':
                            var $2953 = (_a$pred$7 => {
                                var $2954 = Word$e;
                                return $2954;
                            });
                            var $2946 = $2953;
                            break;
                    };
                    var $2946 = $2946($2944);
                    return $2946;
                });
                var $2932 = $2945;
                break;
            case 'Word.e':
                var $2955 = (_b$4 => {
                    var $2956 = Word$e;
                    return $2956;
                });
                var $2932 = $2955;
                break;
        };
        var $2932 = $2932(_b$3);
        return $2932;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right$one$go$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $2958 = self.pred;
                var $2959 = Word$o$(Word$shift_right$one$go$($2958));
                var $2957 = $2959;
                break;
            case 'Word.i':
                var $2960 = self.pred;
                var $2961 = Word$i$(Word$shift_right$one$go$($2960));
                var $2957 = $2961;
                break;
            case 'Word.e':
                var $2962 = Word$o$(Word$e);
                var $2957 = $2962;
                break;
        };
        return $2957;
    };
    const Word$shift_right$one$go = x0 => Word$shift_right$one$go$(x0);

    function Word$shift_right$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $2964 = self.pred;
                var $2965 = Word$shift_right$one$go$($2964);
                var $2963 = $2965;
                break;
            case 'Word.i':
                var $2966 = self.pred;
                var $2967 = Word$shift_right$one$go$($2966);
                var $2963 = $2967;
                break;
            case 'Word.e':
                var $2968 = Word$e;
                var $2963 = $2968;
                break;
        };
        return $2963;
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
                    var $2969 = _value$2;
                    return $2969;
                } else {
                    var $2970 = (self - 1n);
                    var $2971 = Word$shift_right$(Word$shift_right$one$(_value$2), $2970);
                    return $2971;
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
                    var $2972 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $2972;
                } else {
                    var $2973 = Pair$new$(Bool$false, _value$5);
                    var self = $2973;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $2974 = self.fst;
                        var $2975 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $2977 = $2975;
                            var $2976 = $2977;
                        } else {
                            var $2978 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right$(_shift_copy$4, 1n);
                            var self = $2974;
                            if (self) {
                                var $2980 = Word$div$go$($2978, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $2975);
                                var $2979 = $2980;
                            } else {
                                var $2981 = Word$div$go$($2978, _sub_copy$3, _new_shift_copy$9, $2975);
                                var $2979 = $2981;
                            };
                            var $2976 = $2979;
                        };
                        return $2976;
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
            var $2983 = Word$to_zero$(_a$2);
            var $2982 = $2983;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_b$3, _shift$6);
            var $2984 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $2982 = $2984;
        };
        return $2982;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U64$div = a0 => a1 => ((a0 / a1) & 0xFFFFFFFFFFFFFFFFn);

    function Word$mod$(_a$2, _b$3) {
        var _q$4 = Word$div$(_a$2, _b$3);
        var $2985 = Word$sub$(_a$2, Word$mul$(_b$3, _q$4));
        return $2985;
    };
    const Word$mod = x0 => x1 => Word$mod$(x0, x1);
    const U64$mod = a0 => a1 => (a0 % a1);
    const U64$or = a0 => a1 => (a0 | a1);

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $2987 = self.pred;
                var $2988 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $2990 = self.pred;
                            var $2991 = (_a$pred$9 => {
                                var $2992 = Word$o$(Word$and$(_a$pred$9, $2990));
                                return $2992;
                            });
                            var $2989 = $2991;
                            break;
                        case 'Word.i':
                            var $2993 = self.pred;
                            var $2994 = (_a$pred$9 => {
                                var $2995 = Word$o$(Word$and$(_a$pred$9, $2993));
                                return $2995;
                            });
                            var $2989 = $2994;
                            break;
                        case 'Word.e':
                            var $2996 = (_a$pred$7 => {
                                var $2997 = Word$e;
                                return $2997;
                            });
                            var $2989 = $2996;
                            break;
                    };
                    var $2989 = $2989($2987);
                    return $2989;
                });
                var $2986 = $2988;
                break;
            case 'Word.i':
                var $2998 = self.pred;
                var $2999 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $3001 = self.pred;
                            var $3002 = (_a$pred$9 => {
                                var $3003 = Word$o$(Word$and$(_a$pred$9, $3001));
                                return $3003;
                            });
                            var $3000 = $3002;
                            break;
                        case 'Word.i':
                            var $3004 = self.pred;
                            var $3005 = (_a$pred$9 => {
                                var $3006 = Word$i$(Word$and$(_a$pred$9, $3004));
                                return $3006;
                            });
                            var $3000 = $3005;
                            break;
                        case 'Word.e':
                            var $3007 = (_a$pred$7 => {
                                var $3008 = Word$e;
                                return $3008;
                            });
                            var $3000 = $3007;
                            break;
                    };
                    var $3000 = $3000($2998);
                    return $3000;
                });
                var $2986 = $2999;
                break;
            case 'Word.e':
                var $3009 = (_b$4 => {
                    var $3010 = Word$e;
                    return $3010;
                });
                var $2986 = $3009;
                break;
        };
        var $2986 = $2986(_b$3);
        return $2986;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U64$and = a0 => a1 => (a0 & a1);

    function Word$xor$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $3012 = self.pred;
                var $3013 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $3015 = self.pred;
                            var $3016 = (_a$pred$9 => {
                                var $3017 = Word$o$(Word$xor$(_a$pred$9, $3015));
                                return $3017;
                            });
                            var $3014 = $3016;
                            break;
                        case 'Word.i':
                            var $3018 = self.pred;
                            var $3019 = (_a$pred$9 => {
                                var $3020 = Word$i$(Word$xor$(_a$pred$9, $3018));
                                return $3020;
                            });
                            var $3014 = $3019;
                            break;
                        case 'Word.e':
                            var $3021 = (_a$pred$7 => {
                                var $3022 = Word$e;
                                return $3022;
                            });
                            var $3014 = $3021;
                            break;
                    };
                    var $3014 = $3014($3012);
                    return $3014;
                });
                var $3011 = $3013;
                break;
            case 'Word.i':
                var $3023 = self.pred;
                var $3024 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $3026 = self.pred;
                            var $3027 = (_a$pred$9 => {
                                var $3028 = Word$i$(Word$xor$(_a$pred$9, $3026));
                                return $3028;
                            });
                            var $3025 = $3027;
                            break;
                        case 'Word.i':
                            var $3029 = self.pred;
                            var $3030 = (_a$pred$9 => {
                                var $3031 = Word$o$(Word$xor$(_a$pred$9, $3029));
                                return $3031;
                            });
                            var $3025 = $3030;
                            break;
                        case 'Word.e':
                            var $3032 = (_a$pred$7 => {
                                var $3033 = Word$e;
                                return $3033;
                            });
                            var $3025 = $3032;
                            break;
                    };
                    var $3025 = $3025($3023);
                    return $3025;
                });
                var $3011 = $3024;
                break;
            case 'Word.e':
                var $3034 = (_b$4 => {
                    var $3035 = Word$e;
                    return $3035;
                });
                var $3011 = $3034;
                break;
        };
        var $3011 = $3011(_b$3);
        return $3011;
    };
    const Word$xor = x0 => x1 => Word$xor$(x0, x1);
    const U64$xor = a0 => a1 => (a0 ^ a1);

    function Litereum$reduce$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'Litereum.Runtime.new':
                var $3037 = self.world;
                var $3038 = self.subst;
                var $3039 = self.fresh;
                var $3040 = self.gas;
                var $3041 = self.term;
                var self = $3041;
                switch (self._) {
                    case 'Litereum.Term.var':
                        var $3043 = self.name;
                        var _term$8 = Maybe$default$(Map$get$($3043, $3038), $3041);
                        var self = Litereum$reduce$(Litereum$Runtime$new$($3037, $3038, $3039, $3040, _term$8));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3045 = self.world;
                                var $3046 = self.subst;
                                var $3047 = self.fresh;
                                var $3048 = self.gas;
                                var $3049 = self.term;
                                var $3050 = Litereum$Runtime$new$($3045, Map$set$($3043, $3049, $3046), $3047, $3048, $3049);
                                var $3044 = $3050;
                                break;
                        };
                        var $3042 = $3044;
                        break;
                    case 'Litereum.Term.call':
                        var $3051 = self.bond;
                        var $3052 = self.args;
                        var self = Litereum$get_bond$($3037, $3051);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3054 = self.value;
                                var _bond$10 = $3054;
                                var self = _bond$10;
                                switch (self._) {
                                    case 'Litereum.Bond.new':
                                        var $3056 = self.input_names;
                                        var $3057 = self.main;
                                        var self = Litereum$rename$many$(Map$from_list$(List$nil), $3039, $3056);
                                        switch (self._) {
                                            case 'Triple.new':
                                                var $3059 = self.fst;
                                                var $3060 = self.snd;
                                                var $3061 = self.trd;
                                                var self = Litereum$sanitize$($3037, $3059, $3060, $3057);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3063 = self.fst;
                                                        var $3064 = self.snd;
                                                        var _subst$22 = Litereum$extend$($3038, $3061, $3052);
                                                        var $3065 = Litereum$reduce$(Litereum$Runtime$new$($3037, _subst$22, $3063, $3040, $3064));
                                                        var $3062 = $3065;
                                                        break;
                                                };
                                                var $3058 = $3062;
                                                break;
                                        };
                                        var $3055 = $3058;
                                        break;
                                };
                                var $3053 = $3055;
                                break;
                            case 'Maybe.none':
                                var $3066 = _state$1;
                                var $3053 = $3066;
                                break;
                        };
                        var $3042 = $3053;
                        break;
                    case 'Litereum.Term.let':
                        var $3067 = self.name;
                        var $3068 = self.expr;
                        var $3069 = self.body;
                        var $3070 = Litereum$reduce$(Litereum$Runtime$new$($3037, Map$set$($3067, $3068, $3038), $3039, $3040, $3069));
                        var $3042 = $3070;
                        break;
                    case 'Litereum.Term.match':
                        var $3071 = self.name;
                        var $3072 = self.data;
                        var $3073 = self.cses;
                        var self = Litereum$reduce$(Litereum$Runtime$new$($3037, $3038, $3039, $3040, Maybe$default$(Map$get$($3071, $3038), Litereum$Term$word$(0n))));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3075 = self.world;
                                var $3076 = self.subst;
                                var $3077 = self.fresh;
                                var $3078 = self.gas;
                                var $3079 = self.term;
                                var self = $3079;
                                switch (self._) {
                                    case 'Litereum.Term.create':
                                        var $3081 = self.ctor;
                                        var $3082 = self.vals;
                                        var self = Litereum$get_data$($3075, $3072);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $3084 = self.value;
                                                var _data$18 = $3084;
                                                var self = _data$18;
                                                switch (self._) {
                                                    case 'Litereum.Data.new':
                                                        var self = Litereum$get_constructor_value$(_data$18, $3081);
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $3087 = self.value;
                                                                var _ctor$22 = $3087;
                                                                var self = _ctor$22;
                                                                switch (self._) {
                                                                    case 'Litereum.Constructor.new':
                                                                        var self = Litereum$get_constructor_index$(_data$18, $3081);
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $3090 = self.value;
                                                                                var self = List$get$($3090, $3073);
                                                                                switch (self._) {
                                                                                    case 'Maybe.some':
                                                                                        var $3092 = self.value;
                                                                                        var _nams$28 = List$map$(a1 => (($3071 + ".") + a1), (() => {
                                                                                            var self = _ctor$22;
                                                                                            switch (self._) {
                                                                                                case 'Litereum.Constructor.new':
                                                                                                    var $3094 = self.field_names;
                                                                                                    var $3095 = $3094;
                                                                                                    return $3095;
                                                                                            };
                                                                                        })());
                                                                                        var _subst$29 = Litereum$extend$($3076, _nams$28, $3082);
                                                                                        var $3093 = Litereum$reduce$(Litereum$Runtime$new$($3075, _subst$29, $3077, $3078, $3092));
                                                                                        var $3091 = $3093;
                                                                                        break;
                                                                                    case 'Maybe.none':
                                                                                        var $3096 = _state$1;
                                                                                        var $3091 = $3096;
                                                                                        break;
                                                                                };
                                                                                var $3089 = $3091;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $3097 = _state$1;
                                                                                var $3089 = $3097;
                                                                                break;
                                                                        };
                                                                        var $3088 = $3089;
                                                                        break;
                                                                };
                                                                var $3086 = $3088;
                                                                break;
                                                            case 'Maybe.none':
                                                                var $3098 = _state$1;
                                                                var $3086 = $3098;
                                                                break;
                                                        };
                                                        var $3085 = $3086;
                                                        break;
                                                };
                                                var $3083 = $3085;
                                                break;
                                            case 'Maybe.none':
                                                var $3099 = _state$1;
                                                var $3083 = $3099;
                                                break;
                                        };
                                        var $3080 = $3083;
                                        break;
                                    case 'Litereum.Term.var':
                                    case 'Litereum.Term.call':
                                    case 'Litereum.Term.let':
                                    case 'Litereum.Term.match':
                                    case 'Litereum.Term.word':
                                    case 'Litereum.Term.compare':
                                    case 'Litereum.Term.operate':
                                    case 'Litereum.Term.run':
                                    case 'Litereum.Term.bind':
                                    case 'Litereum.Term.return':
                                        var $3100 = _state$1;
                                        var $3080 = $3100;
                                        break;
                                };
                                var $3074 = $3080;
                                break;
                        };
                        var $3042 = $3074;
                        break;
                    case 'Litereum.Term.compare':
                        var $3101 = self.val0;
                        var $3102 = self.val1;
                        var $3103 = self.iflt;
                        var $3104 = self.ifeq;
                        var $3105 = self.ifgt;
                        var self = Litereum$reduce$(Litereum$Runtime$new$($3037, $3038, $3039, $3040, $3101));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3107 = self.world;
                                var $3108 = self.subst;
                                var $3109 = self.fresh;
                                var $3110 = self.gas;
                                var $3111 = self.term;
                                var self = Litereum$reduce$(Litereum$Runtime$new$($3107, $3108, $3109, $3110, $3102));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $3113 = self.world;
                                        var $3114 = self.subst;
                                        var $3115 = self.fresh;
                                        var $3116 = self.gas;
                                        var $3117 = self.term;
                                        var self = $3111;
                                        switch (self._) {
                                            case 'Litereum.Term.word':
                                                var $3119 = self.numb;
                                                var self = $3117;
                                                switch (self._) {
                                                    case 'Litereum.Term.word':
                                                        var $3121 = self.numb;
                                                        var self = U64$cmp$($3119, $3121);
                                                        switch (self._) {
                                                            case 'Cmp.ltn':
                                                                var $3123 = Litereum$reduce$(Litereum$Runtime$new$($3113, $3114, $3115, $3116, $3103));
                                                                var $3122 = $3123;
                                                                break;
                                                            case 'Cmp.eql':
                                                                var $3124 = Litereum$reduce$(Litereum$Runtime$new$($3113, $3114, $3115, $3116, $3104));
                                                                var $3122 = $3124;
                                                                break;
                                                            case 'Cmp.gtn':
                                                                var $3125 = Litereum$reduce$(Litereum$Runtime$new$($3113, $3114, $3115, $3116, $3105));
                                                                var $3122 = $3125;
                                                                break;
                                                        };
                                                        var $3120 = $3122;
                                                        break;
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.run':
                                                    case 'Litereum.Term.bind':
                                                    case 'Litereum.Term.return':
                                                        var $3126 = _state$1;
                                                        var $3120 = $3126;
                                                        break;
                                                };
                                                var $3118 = $3120;
                                                break;
                                            case 'Litereum.Term.var':
                                            case 'Litereum.Term.return':
                                                var self = $3117;
                                                switch (self._) {
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.word':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.run':
                                                    case 'Litereum.Term.bind':
                                                    case 'Litereum.Term.return':
                                                        var $3128 = _state$1;
                                                        var $3127 = $3128;
                                                        break;
                                                };
                                                var $3118 = $3127;
                                                break;
                                            case 'Litereum.Term.call':
                                            case 'Litereum.Term.create':
                                                var self = $3117;
                                                switch (self._) {
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.word':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.run':
                                                    case 'Litereum.Term.bind':
                                                    case 'Litereum.Term.return':
                                                        var $3130 = _state$1;
                                                        var $3129 = $3130;
                                                        break;
                                                };
                                                var $3118 = $3129;
                                                break;
                                            case 'Litereum.Term.let':
                                            case 'Litereum.Term.run':
                                                var self = $3117;
                                                switch (self._) {
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.word':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.run':
                                                    case 'Litereum.Term.bind':
                                                    case 'Litereum.Term.return':
                                                        var $3132 = _state$1;
                                                        var $3131 = $3132;
                                                        break;
                                                };
                                                var $3118 = $3131;
                                                break;
                                            case 'Litereum.Term.match':
                                            case 'Litereum.Term.operate':
                                            case 'Litereum.Term.bind':
                                                var self = $3117;
                                                switch (self._) {
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.word':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.run':
                                                    case 'Litereum.Term.bind':
                                                    case 'Litereum.Term.return':
                                                        var $3134 = _state$1;
                                                        var $3133 = $3134;
                                                        break;
                                                };
                                                var $3118 = $3133;
                                                break;
                                            case 'Litereum.Term.compare':
                                                var self = $3117;
                                                switch (self._) {
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.word':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.run':
                                                    case 'Litereum.Term.bind':
                                                    case 'Litereum.Term.return':
                                                        var $3136 = _state$1;
                                                        var $3135 = $3136;
                                                        break;
                                                };
                                                var $3118 = $3135;
                                                break;
                                        };
                                        var $3112 = $3118;
                                        break;
                                };
                                var $3106 = $3112;
                                break;
                        };
                        var $3042 = $3106;
                        break;
                    case 'Litereum.Term.operate':
                        var $3137 = self.oper;
                        var $3138 = self.val0;
                        var $3139 = self.val1;
                        var self = Litereum$reduce$(Litereum$Runtime$new$($3037, $3038, $3039, $3040, $3138));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3141 = self.world;
                                var $3142 = self.subst;
                                var $3143 = self.fresh;
                                var $3144 = self.gas;
                                var $3145 = self.term;
                                var self = Litereum$reduce$(Litereum$Runtime$new$($3141, $3142, $3143, $3144, $3139));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $3147 = self.world;
                                        var $3148 = self.subst;
                                        var $3149 = self.fresh;
                                        var $3150 = self.gas;
                                        var $3151 = self.term;
                                        var self = $3145;
                                        switch (self._) {
                                            case 'Litereum.Term.word':
                                                var $3153 = self.numb;
                                                var self = $3151;
                                                switch (self._) {
                                                    case 'Litereum.Term.word':
                                                        var $3155 = self.numb;
                                                        var self = $3137;
                                                        switch (self._) {
                                                            case 'Litereum.Operation.add':
                                                                var $3157 = Litereum$Runtime$new$($3147, $3148, $3149, $3150, Litereum$Term$word$((($3153 + $3155) & 0xFFFFFFFFFFFFFFFFn)));
                                                                var $3156 = $3157;
                                                                break;
                                                            case 'Litereum.Operation.sub':
                                                                var $3158 = Litereum$Runtime$new$($3147, $3148, $3149, $3150, Litereum$Term$word$((($3153 - $3155) & 0xFFFFFFFFFFFFFFFFn)));
                                                                var $3156 = $3158;
                                                                break;
                                                            case 'Litereum.Operation.mul':
                                                                var $3159 = Litereum$Runtime$new$($3147, $3148, $3149, $3150, Litereum$Term$word$((($3153 * $3155) & 0xFFFFFFFFFFFFFFFFn)));
                                                                var $3156 = $3159;
                                                                break;
                                                            case 'Litereum.Operation.div':
                                                                var $3160 = Litereum$Runtime$new$($3147, $3148, $3149, $3150, Litereum$Term$word$((($3153 / $3155) & 0xFFFFFFFFFFFFFFFFn)));
                                                                var $3156 = $3160;
                                                                break;
                                                            case 'Litereum.Operation.mod':
                                                                var $3161 = Litereum$Runtime$new$($3147, $3148, $3149, $3150, Litereum$Term$word$(($3153 % $3155)));
                                                                var $3156 = $3161;
                                                                break;
                                                            case 'Litereum.Operation.or':
                                                                var $3162 = Litereum$Runtime$new$($3147, $3148, $3149, $3150, Litereum$Term$word$(($3153 | $3155)));
                                                                var $3156 = $3162;
                                                                break;
                                                            case 'Litereum.Operation.and':
                                                                var $3163 = Litereum$Runtime$new$($3147, $3148, $3149, $3150, Litereum$Term$word$(($3153 & $3155)));
                                                                var $3156 = $3163;
                                                                break;
                                                            case 'Litereum.Operation.xor':
                                                                var $3164 = Litereum$Runtime$new$($3147, $3148, $3149, $3150, Litereum$Term$word$(($3153 ^ $3155)));
                                                                var $3156 = $3164;
                                                                break;
                                                        };
                                                        var $3154 = $3156;
                                                        break;
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.run':
                                                    case 'Litereum.Term.bind':
                                                    case 'Litereum.Term.return':
                                                        var $3165 = _state$1;
                                                        var $3154 = $3165;
                                                        break;
                                                };
                                                var $3152 = $3154;
                                                break;
                                            case 'Litereum.Term.var':
                                            case 'Litereum.Term.return':
                                                var self = $3151;
                                                switch (self._) {
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.word':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.run':
                                                    case 'Litereum.Term.bind':
                                                    case 'Litereum.Term.return':
                                                        var $3167 = _state$1;
                                                        var $3166 = $3167;
                                                        break;
                                                };
                                                var $3152 = $3166;
                                                break;
                                            case 'Litereum.Term.call':
                                            case 'Litereum.Term.create':
                                                var self = $3151;
                                                switch (self._) {
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.word':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.run':
                                                    case 'Litereum.Term.bind':
                                                    case 'Litereum.Term.return':
                                                        var $3169 = _state$1;
                                                        var $3168 = $3169;
                                                        break;
                                                };
                                                var $3152 = $3168;
                                                break;
                                            case 'Litereum.Term.let':
                                            case 'Litereum.Term.run':
                                                var self = $3151;
                                                switch (self._) {
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.word':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.run':
                                                    case 'Litereum.Term.bind':
                                                    case 'Litereum.Term.return':
                                                        var $3171 = _state$1;
                                                        var $3170 = $3171;
                                                        break;
                                                };
                                                var $3152 = $3170;
                                                break;
                                            case 'Litereum.Term.match':
                                            case 'Litereum.Term.operate':
                                            case 'Litereum.Term.bind':
                                                var self = $3151;
                                                switch (self._) {
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.word':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.run':
                                                    case 'Litereum.Term.bind':
                                                    case 'Litereum.Term.return':
                                                        var $3173 = _state$1;
                                                        var $3172 = $3173;
                                                        break;
                                                };
                                                var $3152 = $3172;
                                                break;
                                            case 'Litereum.Term.compare':
                                                var self = $3151;
                                                switch (self._) {
                                                    case 'Litereum.Term.var':
                                                    case 'Litereum.Term.call':
                                                    case 'Litereum.Term.let':
                                                    case 'Litereum.Term.create':
                                                    case 'Litereum.Term.match':
                                                    case 'Litereum.Term.word':
                                                    case 'Litereum.Term.compare':
                                                    case 'Litereum.Term.operate':
                                                    case 'Litereum.Term.run':
                                                    case 'Litereum.Term.bind':
                                                    case 'Litereum.Term.return':
                                                        var $3175 = _state$1;
                                                        var $3174 = $3175;
                                                        break;
                                                };
                                                var $3152 = $3174;
                                                break;
                                        };
                                        var $3146 = $3152;
                                        break;
                                };
                                var $3140 = $3146;
                                break;
                        };
                        var $3042 = $3140;
                        break;
                    case 'Litereum.Term.create':
                    case 'Litereum.Term.word':
                    case 'Litereum.Term.run':
                    case 'Litereum.Term.bind':
                    case 'Litereum.Term.return':
                        var $3176 = _state$1;
                        var $3042 = $3176;
                        break;
                };
                var $3036 = $3042;
                break;
        };
        return $3036;
    };
    const Litereum$reduce = x0 => Litereum$reduce$(x0);

    function Litereum$normalize$many$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'Litereum.Runtime.new':
                var $3178 = self.world;
                var $3179 = self.subst;
                var $3180 = self.fresh;
                var $3181 = self.gas;
                var $3182 = self.term;
                var self = $3182;
                switch (self._) {
                    case 'List.cons':
                        var $3184 = self.head;
                        var $3185 = self.tail;
                        var self = Litereum$normalize$(Litereum$Runtime$new$($3178, $3179, $3180, $3181, $3184));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3187 = self.world;
                                var $3188 = self.subst;
                                var $3189 = self.fresh;
                                var $3190 = self.gas;
                                var $3191 = self.term;
                                var self = Litereum$normalize$many$(Litereum$Runtime$new$($3187, $3188, $3189, $3190, $3185));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $3193 = self.world;
                                        var $3194 = self.subst;
                                        var $3195 = self.fresh;
                                        var $3196 = self.gas;
                                        var $3197 = self.term;
                                        var $3198 = Litereum$Runtime$new$($3193, $3194, $3195, $3196, List$cons$($3191, $3197));
                                        var $3192 = $3198;
                                        break;
                                };
                                var $3186 = $3192;
                                break;
                        };
                        var $3183 = $3186;
                        break;
                    case 'List.nil':
                        var $3199 = _state$1;
                        var $3183 = $3199;
                        break;
                };
                var $3177 = $3183;
                break;
        };
        return $3177;
    };
    const Litereum$normalize$many = x0 => Litereum$normalize$many$(x0);

    function Litereum$normalize$cases$(_ctrs$1, _name$2, _state$3) {
        var self = _state$3;
        switch (self._) {
            case 'Litereum.Runtime.new':
                var $3201 = self.world;
                var $3202 = self.subst;
                var $3203 = self.fresh;
                var $3204 = self.gas;
                var $3205 = self.term;
                var self = _ctrs$1;
                switch (self._) {
                    case 'List.cons':
                        var $3207 = self.head;
                        var $3208 = self.tail;
                        var self = $3205;
                        switch (self._) {
                            case 'List.cons':
                                var $3210 = self.head;
                                var $3211 = self.tail;
                                var _nams$13 = List$map$(a1 => ((_name$2 + ".") + a1), (() => {
                                    var self = $3207;
                                    switch (self._) {
                                        case 'Litereum.Constructor.new':
                                            var $3213 = self.field_names;
                                            var $3214 = $3213;
                                            return $3214;
                                    };
                                })());
                                var _vals$14 = List$map$(Litereum$Term$var, _nams$13);
                                var _subst$15 = Litereum$extend$($3202, _nams$13, _vals$14);
                                var self = Litereum$normalize$(Litereum$Runtime$new$($3201, _subst$15, $3203, $3204, $3210));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $3215 = self.world;
                                        var $3216 = self.subst;
                                        var $3217 = self.fresh;
                                        var $3218 = self.gas;
                                        var $3219 = self.term;
                                        var self = Litereum$normalize$cases$($3208, _name$2, Litereum$Runtime$new$($3215, $3216, $3217, $3218, $3211));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $3221 = self.world;
                                                var $3222 = self.subst;
                                                var $3223 = self.fresh;
                                                var $3224 = self.gas;
                                                var $3225 = self.term;
                                                var $3226 = Litereum$Runtime$new$($3221, $3222, $3223, $3224, List$cons$($3219, $3225));
                                                var $3220 = $3226;
                                                break;
                                        };
                                        var $3212 = $3220;
                                        break;
                                };
                                var $3209 = $3212;
                                break;
                            case 'List.nil':
                                var $3227 = _state$3;
                                var $3209 = $3227;
                                break;
                        };
                        var $3206 = $3209;
                        break;
                    case 'List.nil':
                        var self = $3205;
                        switch (self._) {
                            case 'List.nil':
                            case 'List.cons':
                                var $3229 = _state$3;
                                var $3228 = $3229;
                                break;
                        };
                        var $3206 = $3228;
                        break;
                };
                var $3200 = $3206;
                break;
        };
        return $3200;
    };
    const Litereum$normalize$cases = x0 => x1 => x2 => Litereum$normalize$cases$(x0, x1, x2);

    function Litereum$normalize$bound$(_names$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Litereum.Runtime.new':
                var $3231 = self.world;
                var $3232 = self.subst;
                var $3233 = self.fresh;
                var $3234 = self.gas;
                var $3235 = self.term;
                var _subst$8 = Litereum$extend$($3232, _names$1, List$map$(Litereum$Term$var, _names$1));
                var $3236 = Litereum$normalize$(Litereum$Runtime$new$($3231, _subst$8, $3233, $3234, $3235));
                var $3230 = $3236;
                break;
        };
        return $3230;
    };
    const Litereum$normalize$bound = x0 => x1 => Litereum$normalize$bound$(x0, x1);

    function Litereum$normalize$(_state$1) {
        var self = Litereum$reduce$(_state$1);
        switch (self._) {
            case 'Litereum.Runtime.new':
                var $3238 = self.world;
                var $3239 = self.subst;
                var $3240 = self.fresh;
                var $3241 = self.gas;
                var $3242 = self.term;
                var self = $3242;
                switch (self._) {
                    case 'Litereum.Term.create':
                        var $3244 = self.ctor;
                        var $3245 = self.vals;
                        var self = Litereum$normalize$many$(Litereum$Runtime$new$($3238, $3239, $3240, $3241, $3245));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3247 = self.world;
                                var $3248 = self.subst;
                                var $3249 = self.fresh;
                                var $3250 = self.gas;
                                var $3251 = self.term;
                                var $3252 = Litereum$Runtime$new$($3247, $3248, $3249, $3250, Litereum$Term$create$($3244, $3251));
                                var $3246 = $3252;
                                break;
                        };
                        var $3243 = $3246;
                        break;
                    case 'Litereum.Term.match':
                        var $3253 = self.name;
                        var $3254 = self.data;
                        var $3255 = self.cses;
                        var self = Litereum$get_constructors$($3238, $3254);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3257 = self.value;
                                var _ctrs$11 = $3257;
                                var self = _ctrs$11;
                                switch (self._) {
                                    case 'List.nil':
                                        var self = Litereum$normalize$cases$(_ctrs$11, $3253, Litereum$Runtime$new$($3238, $3239, $3240, $3241, $3255));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $3260 = self.world;
                                                var $3261 = self.subst;
                                                var $3262 = self.fresh;
                                                var $3263 = self.gas;
                                                var $3264 = self.term;
                                                var $3265 = Litereum$Runtime$new$($3260, $3261, $3262, $3263, Litereum$Term$match$($3253, $3254, $3264));
                                                var $3259 = $3265;
                                                break;
                                        };
                                        var $3258 = $3259;
                                        break;
                                    case 'List.cons':
                                        var self = Litereum$normalize$cases$(_ctrs$11, $3253, Litereum$Runtime$new$($3238, $3239, $3240, $3241, $3255));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $3267 = self.world;
                                                var $3268 = self.subst;
                                                var $3269 = self.fresh;
                                                var $3270 = self.gas;
                                                var $3271 = self.term;
                                                var $3272 = Litereum$Runtime$new$($3267, $3268, $3269, $3270, Litereum$Term$match$($3253, $3254, $3271));
                                                var $3266 = $3272;
                                                break;
                                        };
                                        var $3258 = $3266;
                                        break;
                                };
                                var $3256 = $3258;
                                break;
                            case 'Maybe.none':
                                var $3273 = Litereum$Runtime$new$($3238, $3239, $3240, $3241, $3242);
                                var $3256 = $3273;
                                break;
                        };
                        var $3243 = $3256;
                        break;
                    case 'Litereum.Term.compare':
                        var $3274 = self.val0;
                        var $3275 = self.val1;
                        var $3276 = self.iflt;
                        var $3277 = self.ifeq;
                        var $3278 = self.ifgt;
                        var self = Litereum$normalize$(Litereum$Runtime$new$($3238, $3239, $3240, $3241, $3274));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3280 = self.world;
                                var $3281 = self.subst;
                                var $3282 = self.fresh;
                                var $3283 = self.gas;
                                var $3284 = self.term;
                                var self = Litereum$normalize$(Litereum$Runtime$new$($3280, $3281, $3282, $3283, $3275));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $3286 = self.world;
                                        var $3287 = self.subst;
                                        var $3288 = self.fresh;
                                        var $3289 = self.gas;
                                        var $3290 = self.term;
                                        var self = Litereum$normalize$(Litereum$Runtime$new$($3286, $3287, $3288, $3289, $3276));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $3292 = self.world;
                                                var $3293 = self.subst;
                                                var $3294 = self.fresh;
                                                var $3295 = self.gas;
                                                var $3296 = self.term;
                                                var self = Litereum$normalize$(Litereum$Runtime$new$($3292, $3293, $3294, $3295, $3277));
                                                switch (self._) {
                                                    case 'Litereum.Runtime.new':
                                                        var $3298 = self.world;
                                                        var $3299 = self.subst;
                                                        var $3300 = self.fresh;
                                                        var $3301 = self.gas;
                                                        var $3302 = self.term;
                                                        var self = Litereum$normalize$(Litereum$Runtime$new$($3298, $3299, $3300, $3301, $3278));
                                                        switch (self._) {
                                                            case 'Litereum.Runtime.new':
                                                                var $3304 = self.world;
                                                                var $3305 = self.subst;
                                                                var $3306 = self.fresh;
                                                                var $3307 = self.gas;
                                                                var $3308 = self.term;
                                                                var $3309 = Litereum$Runtime$new$($3304, $3305, $3306, $3307, Litereum$Term$compare$($3284, $3290, $3296, $3302, $3308));
                                                                var $3303 = $3309;
                                                                break;
                                                        };
                                                        var $3297 = $3303;
                                                        break;
                                                };
                                                var $3291 = $3297;
                                                break;
                                        };
                                        var $3285 = $3291;
                                        break;
                                };
                                var $3279 = $3285;
                                break;
                        };
                        var $3243 = $3279;
                        break;
                    case 'Litereum.Term.operate':
                        var $3310 = self.oper;
                        var $3311 = self.val0;
                        var $3312 = self.val1;
                        var self = Litereum$normalize$(Litereum$Runtime$new$($3238, $3239, $3240, $3241, $3311));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3314 = self.world;
                                var $3315 = self.subst;
                                var $3316 = self.fresh;
                                var $3317 = self.gas;
                                var $3318 = self.term;
                                var self = Litereum$normalize$(Litereum$Runtime$new$($3314, $3315, $3316, $3317, $3312));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $3320 = self.world;
                                        var $3321 = self.subst;
                                        var $3322 = self.fresh;
                                        var $3323 = self.gas;
                                        var $3324 = self.term;
                                        var $3325 = Litereum$Runtime$new$($3320, $3321, $3322, $3323, Litereum$Term$operate$($3310, $3318, $3324));
                                        var $3319 = $3325;
                                        break;
                                };
                                var $3313 = $3319;
                                break;
                        };
                        var $3243 = $3313;
                        break;
                    case 'Litereum.Term.run':
                        var $3326 = self.name;
                        var $3327 = self.type;
                        var $3328 = self.expr;
                        var $3329 = self.body;
                        var self = Litereum$normalize$(Litereum$Runtime$new$($3238, $3239, $3240, $3241, $3328));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3331 = self.world;
                                var $3332 = self.subst;
                                var $3333 = self.fresh;
                                var $3334 = self.gas;
                                var $3335 = self.term;
                                var self = Litereum$normalize$(Litereum$Runtime$new$($3331, $3332, $3333, $3334, $3329));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $3337 = self.world;
                                        var $3338 = self.subst;
                                        var $3339 = self.fresh;
                                        var $3340 = self.gas;
                                        var $3341 = self.term;
                                        var $3342 = Litereum$Runtime$new$($3337, $3338, $3339, $3340, Litereum$Term$run$($3326, $3327, $3335, $3341));
                                        var $3336 = $3342;
                                        break;
                                };
                                var $3330 = $3336;
                                break;
                        };
                        var $3243 = $3330;
                        break;
                    case 'Litereum.Term.bind':
                        var $3343 = self.bond;
                        var $3344 = self.main;
                        var $3345 = self.body;
                        var self = Litereum$get_bond$($3238, $3343);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3347 = self.value;
                                var _bond$11 = $3347;
                                var self = _bond$11;
                                switch (self._) {
                                    case 'Litereum.Bond.new':
                                        var $3349 = self.input_names;
                                        var self = Litereum$normalize$bound$($3349, Litereum$Runtime$new$($3238, $3239, $3240, $3241, $3344));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $3351 = self.world;
                                                var $3352 = self.subst;
                                                var $3353 = self.fresh;
                                                var $3354 = self.gas;
                                                var $3355 = self.term;
                                                var self = Litereum$normalize$(Litereum$Runtime$new$($3351, $3352, $3353, $3354, $3345));
                                                switch (self._) {
                                                    case 'Litereum.Runtime.new':
                                                        var $3357 = self.world;
                                                        var $3358 = self.subst;
                                                        var $3359 = self.fresh;
                                                        var $3360 = self.gas;
                                                        var $3361 = self.term;
                                                        var $3362 = Litereum$Runtime$new$($3357, $3358, $3359, $3360, Litereum$Term$bind$($3343, $3355, $3361));
                                                        var $3356 = $3362;
                                                        break;
                                                };
                                                var $3350 = $3356;
                                                break;
                                        };
                                        var $3348 = $3350;
                                        break;
                                };
                                var $3346 = $3348;
                                break;
                            case 'Maybe.none':
                                var $3363 = _state$1;
                                var $3346 = $3363;
                                break;
                        };
                        var $3243 = $3346;
                        break;
                    case 'Litereum.Term.return':
                        var $3364 = self.expr;
                        var self = Litereum$normalize$(Litereum$Runtime$new$($3238, $3239, $3240, $3241, $3364));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3366 = self.world;
                                var $3367 = self.subst;
                                var $3368 = self.fresh;
                                var $3369 = self.gas;
                                var $3370 = self.term;
                                var $3371 = Litereum$Runtime$new$($3366, $3367, $3368, $3369, Litereum$Term$return$($3370));
                                var $3365 = $3371;
                                break;
                        };
                        var $3243 = $3365;
                        break;
                    case 'Litereum.Term.var':
                    case 'Litereum.Term.call':
                    case 'Litereum.Term.let':
                    case 'Litereum.Term.word':
                        var $3372 = Litereum$Runtime$new$($3238, $3239, $3240, $3241, $3242);
                        var $3243 = $3372;
                        break;
                };
                var $3237 = $3243;
                break;
        };
        return $3237;
    };
    const Litereum$normalize = x0 => Litereum$normalize$(x0);

    function Litereum$run$(_state$1) {
        var self = Litereum$reduce$(_state$1);
        switch (self._) {
            case 'Litereum.Runtime.new':
                var $3374 = self.world;
                var $3375 = self.subst;
                var $3376 = self.fresh;
                var $3377 = self.gas;
                var $3378 = self.term;
                var self = $3378;
                switch (self._) {
                    case 'Litereum.Term.run':
                        var $3380 = self.name;
                        var $3381 = self.type;
                        var $3382 = self.expr;
                        var $3383 = self.body;
                        var self = Litereum$run$(Litereum$Runtime$new$($3374, $3375, $3376, $3377, $3382));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3385 = self.world;
                                var $3386 = self.subst;
                                var $3387 = self.fresh;
                                var $3388 = self.gas;
                                var $3389 = self.term;
                                var self = $3389;
                                switch (self._) {
                                    case 'Litereum.Term.var':
                                    case 'Litereum.Term.call':
                                    case 'Litereum.Term.let':
                                    case 'Litereum.Term.create':
                                    case 'Litereum.Term.match':
                                    case 'Litereum.Term.word':
                                    case 'Litereum.Term.compare':
                                    case 'Litereum.Term.operate':
                                    case 'Litereum.Term.run':
                                    case 'Litereum.Term.bind':
                                        var $3391 = Litereum$Runtime$new$($3385, $3386, $3387, $3388, Litereum$Term$run$($3380, $3381, $3389, $3383));
                                        var $3390 = $3391;
                                        break;
                                    case 'Litereum.Term.return':
                                        var $3392 = Litereum$run$(Litereum$Runtime$new$($3385, Map$set$($3380, $3389, $3386), $3387, $3388, $3383));
                                        var $3390 = $3392;
                                        break;
                                };
                                var $3384 = $3390;
                                break;
                        };
                        var $3379 = $3384;
                        break;
                    case 'Litereum.Term.bind':
                        var $3393 = self.bond;
                        var $3394 = self.main;
                        var $3395 = self.body;
                        var self = Litereum$get_bond$($3374, $3393);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3397 = self.value;
                                var _bond$11 = $3397;
                                var self = _bond$11;
                                switch (self._) {
                                    case 'Litereum.Bond.new':
                                        var $3399 = self.input_names;
                                        var self = Litereum$normalize$bound$($3399, Litereum$Runtime$new$($3374, $3375, $3376, $3377, $3394));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $3401 = self.world;
                                                var $3402 = self.subst;
                                                var $3403 = self.fresh;
                                                var $3404 = self.gas;
                                                var $3405 = self.term;
                                                var _new_entry$23 = Litereum$Entry$bond$((() => {
                                                    var self = _bond$11;
                                                    switch (self._) {
                                                        case 'Litereum.Bond.new':
                                                            var $3407 = self.name;
                                                            var $3408 = self.input_names;
                                                            var $3409 = self.input_types;
                                                            var $3410 = self.output_type;
                                                            var $3411 = self.owners;
                                                            var $3412 = Litereum$Bond$new$($3407, $3408, $3409, $3410, $3405, $3411);
                                                            return $3412;
                                                    };
                                                })());
                                                var self = $3401;
                                                switch (self._) {
                                                    case 'Litereum.World.new':
                                                        var $3413 = self.name_count;
                                                        var $3414 = self.name_to_index;
                                                        var $3415 = self.index_to_name;
                                                        var $3416 = Litereum$World$new$($3413, $3414, $3415, Map$set$($3393, _new_entry$23, (() => {
                                                            var self = $3401;
                                                            switch (self._) {
                                                                case 'Litereum.World.new':
                                                                    var $3417 = self.entry;
                                                                    var $3418 = $3417;
                                                                    return $3418;
                                                            };
                                                        })()));
                                                        var _new_world$24 = $3416;
                                                        break;
                                                };
                                                var $3406 = Litereum$run$(Litereum$Runtime$new$(_new_world$24, $3402, $3403, $3404, $3395));
                                                var $3400 = $3406;
                                                break;
                                        };
                                        var $3398 = $3400;
                                        break;
                                };
                                var $3396 = $3398;
                                break;
                            case 'Maybe.none':
                                var $3419 = _state$1;
                                var $3396 = $3419;
                                break;
                        };
                        var $3379 = $3396;
                        break;
                    case 'Litereum.Term.var':
                    case 'Litereum.Term.call':
                    case 'Litereum.Term.let':
                    case 'Litereum.Term.create':
                    case 'Litereum.Term.match':
                    case 'Litereum.Term.word':
                    case 'Litereum.Term.compare':
                    case 'Litereum.Term.operate':
                    case 'Litereum.Term.return':
                        var $3420 = Litereum$Runtime$new$($3374, $3375, $3376, $3377, $3378);
                        var $3379 = $3420;
                        break;
                };
                var $3373 = $3379;
                break;
        };
        return $3373;
    };
    const Litereum$run = x0 => Litereum$run$(x0);

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
                        var $3421 = self.head;
                        var $3422 = self.tail;
                        var $3423 = String$flatten$go$($3422, (_res$2 + $3421));
                        return $3423;
                    case 'List.nil':
                        var $3424 = _res$2;
                        return $3424;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$flatten$go = x0 => x1 => String$flatten$go$(x0, x1);

    function String$flatten$(_xs$1) {
        var $3425 = String$flatten$go$(_xs$1, "");
        return $3425;
    };
    const String$flatten = x0 => String$flatten$(x0);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $3427 = self.head;
                var $3428 = self.tail;
                var $3429 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $3430 = "";
                        return $3430;
                    } else {
                        var $3431 = _sep$1;
                        return $3431;
                    };
                })(), List$cons$($3427, List$cons$(String$join$go$(_sep$1, $3428, Bool$false), List$nil))));
                var $3426 = $3429;
                break;
            case 'List.nil':
                var $3432 = "";
                var $3426 = $3432;
                break;
        };
        return $3426;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $3433 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $3433;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function Litereum$show$type$(_world$1, _type$2) {
        var self = _type$2;
        switch (self._) {
            case 'Litereum.Type.data':
                var $3435 = self.name;
                var $3436 = $3435;
                var $3434 = $3436;
                break;
            case 'Litereum.Type.effect':
                var $3437 = self.rety;
                var $3438 = ("& " + Litereum$show$type$(_world$1, $3437));
                var $3434 = $3438;
                break;
            case 'Litereum.Type.word':
                var $3439 = "#word";
                var $3434 = $3439;
                break;
        };
        return $3434;
    };
    const Litereum$show$type = x0 => x1 => Litereum$show$type$(x0, x1);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $3441 = self.pred;
                var $3442 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $3441));
                var $3440 = $3442;
                break;
            case 'Word.i':
                var $3443 = self.pred;
                var $3444 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $3443));
                var $3440 = $3444;
                break;
            case 'Word.e':
                var $3445 = _nil$3;
                var $3440 = $3445;
                break;
        };
        return $3440;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);

    function Word$to_nat$(_word$2) {
        var $3446 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $3447 = Nat$succ$((2n * _x$4));
            return $3447;
        }), _word$2);
        return $3446;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);

    function Word$show$(_size$1, _a$2) {
        var $3448 = Nat$show$(Word$to_nat$(_a$2));
        return $3448;
    };
    const Word$show = x0 => x1 => Word$show$(x0, x1);
    const U64$show = a0 => (String(a0));

    function String$is_empty$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $3450 = Bool$true;
            var $3449 = $3450;
        } else {
            var $3451 = self.charCodeAt(0);
            var $3452 = self.slice(1);
            var $3453 = Bool$false;
            var $3449 = $3453;
        };
        return $3449;
    };
    const String$is_empty = x0 => String$is_empty$(x0);

    function Litereum$show$term$(_world$1, _term$2) {
        var self = _term$2;
        switch (self._) {
            case 'Litereum.Term.var':
                var $3455 = self.name;
                var $3456 = $3455;
                var $3454 = $3456;
                break;
            case 'Litereum.Term.call':
                var $3457 = self.bond;
                var $3458 = self.args;
                var _bond$5 = $3457;
                var _args$6 = List$map$(Litereum$show$term(_world$1), $3458);
                var $3459 = (_bond$5 + ("(" + (String$join$(",", _args$6) + ")")));
                var $3454 = $3459;
                break;
            case 'Litereum.Term.let':
                var $3460 = self.name;
                var $3461 = self.type;
                var $3462 = self.expr;
                var $3463 = self.body;
                var _name$7 = $3460;
                var _type$8 = Litereum$show$type$(_world$1, $3461);
                var _expr$9 = Litereum$show$term$(_world$1, $3462);
                var _body$10 = Litereum$show$term$(_world$1, $3463);
                var $3464 = ("let " + (_name$7 + (" : " + (_type$8 + (" = " + (_expr$9 + (" " + _body$10)))))));
                var $3454 = $3464;
                break;
            case 'Litereum.Term.create':
                var $3465 = self.ctor;
                var $3466 = self.vals;
                var _vals$5 = List$mapped$($3466, Litereum$show$term(_world$1));
                var $3467 = ($3465 + ("{" + (String$join$(",", _vals$5) + "}")));
                var $3454 = $3467;
                break;
            case 'Litereum.Term.match':
                var $3468 = self.name;
                var $3469 = self.data;
                var $3470 = self.cses;
                var self = Litereum$get_data$(_world$1, $3469);
                switch (self._) {
                    case 'Maybe.some':
                        var $3472 = self.value;
                        var _data$7 = $3472;
                        var self = _data$7;
                        switch (self._) {
                            case 'Litereum.Data.new':
                                var $3474 = self.constructors;
                                var _name$10 = $3468;
                                var _cses$11 = List$zipped_with$($3474, $3470, (_case_ctor$11 => _case_body$12 => {
                                    var $3476 = ((() => {
                                        var self = _case_ctor$11;
                                        switch (self._) {
                                            case 'Litereum.Constructor.new':
                                                var $3477 = self.name;
                                                var $3478 = $3477;
                                                return $3478;
                                        };
                                    })() + (": " + Litereum$show$term$(_world$1, _case_body$12)));
                                    return $3476;
                                }));
                                var $3475 = ("case " + (_name$10 + (" : " + ($3469 + (" { " + (String$join$(", ", _cses$11) + " }"))))));
                                var $3473 = $3475;
                                break;
                        };
                        var $3471 = $3473;
                        break;
                    case 'Maybe.none':
                        var $3479 = "?";
                        var $3471 = $3479;
                        break;
                };
                var $3454 = $3471;
                break;
            case 'Litereum.Term.word':
                var $3480 = self.numb;
                var $3481 = ("#" + (String($3480)));
                var $3454 = $3481;
                break;
            case 'Litereum.Term.compare':
                var $3482 = self.val0;
                var $3483 = self.val1;
                var $3484 = self.iflt;
                var $3485 = self.ifeq;
                var $3486 = self.ifgt;
                var _val0$8 = Litereum$show$term$(_world$1, $3482);
                var _val1$9 = Litereum$show$term$(_world$1, $3483);
                var _iflt$10 = Litereum$show$term$(_world$1, $3484);
                var _ifeq$11 = Litereum$show$term$(_world$1, $3485);
                var _ifgt$12 = Litereum$show$term$(_world$1, $3486);
                var $3487 = ("compare " + (_val0$8 + (" " + (_val1$9 + (" { _<_: " + (_iflt$10 + (" _=_: " + (_ifeq$11 + (" _>_: " + (_ifgt$12 + " }"))))))))));
                var $3454 = $3487;
                break;
            case 'Litereum.Term.operate':
                var $3488 = self.oper;
                var $3489 = self.val0;
                var $3490 = self.val1;
                var self = $3488;
                switch (self._) {
                    case 'Litereum.Operation.add':
                        var $3492 = "+";
                        var _oper$6 = $3492;
                        break;
                    case 'Litereum.Operation.sub':
                        var $3493 = "-";
                        var _oper$6 = $3493;
                        break;
                    case 'Litereum.Operation.mul':
                        var $3494 = "*";
                        var _oper$6 = $3494;
                        break;
                    case 'Litereum.Operation.div':
                        var $3495 = "/";
                        var _oper$6 = $3495;
                        break;
                    case 'Litereum.Operation.mod':
                        var $3496 = "%";
                        var _oper$6 = $3496;
                        break;
                    case 'Litereum.Operation.or':
                        var $3497 = "|";
                        var _oper$6 = $3497;
                        break;
                    case 'Litereum.Operation.and':
                        var $3498 = "&";
                        var _oper$6 = $3498;
                        break;
                    case 'Litereum.Operation.xor':
                        var $3499 = "^";
                        var _oper$6 = $3499;
                        break;
                };
                var _val0$7 = Litereum$show$term$(_world$1, $3489);
                var _val1$8 = Litereum$show$term$(_world$1, $3490);
                var $3491 = (_oper$6 + ("(" + (_val0$7 + ("," + (_val1$8 + ")")))));
                var $3454 = $3491;
                break;
            case 'Litereum.Term.run':
                var $3500 = self.name;
                var $3501 = self.type;
                var $3502 = self.expr;
                var $3503 = self.body;
                var _name$7 = $3500;
                var _type$8 = Litereum$show$type$(_world$1, $3501);
                var _expr$9 = Litereum$show$term$(_world$1, $3502);
                var _body$10 = Litereum$show$term$(_world$1, $3503);
                var self = String$is_empty$(_name$7);
                if (self) {
                    var $3505 = ("run " + (_expr$9 + ("; " + _body$10)));
                    var $3504 = $3505;
                } else {
                    var $3506 = ("run " + (_name$7 + (" : " + (_type$8 + (" = " + (_expr$9 + ("; " + _body$10)))))));
                    var $3504 = $3506;
                };
                var $3454 = $3504;
                break;
            case 'Litereum.Term.bind':
                var $3507 = self.bond;
                var $3508 = self.main;
                var $3509 = self.body;
                var _bond$6 = $3507;
                var _main$7 = Litereum$show$term$(_world$1, $3508);
                var _body$8 = Litereum$show$term$(_world$1, $3509);
                var $3510 = ("bind " + (_bond$6 + (" { " + (_main$7 + (" } " + _body$8)))));
                var $3454 = $3510;
                break;
            case 'Litereum.Term.return':
                var $3511 = self.expr;
                var _expr$4 = Litereum$show$term$(_world$1, $3511);
                var $3512 = ("return " + _expr$4);
                var $3454 = $3512;
                break;
        };
        return $3454;
    };
    const Litereum$show$term = x0 => x1 => Litereum$show$term$(x0, x1);

    function Litereum$run_transaction$(_world$1, _transaction$2, _dry$3) {
        var self = _world$1;
        switch (self._) {
            case 'Litereum.World.new':
                var $3514 = self.name_count;
                var $3515 = self.name_to_index;
                var $3516 = self.index_to_name;
                var $3517 = self.entry;
                var self = _transaction$2;
                switch (self._) {
                    case 'Litereum.Transaction.new_name':
                        var $3519 = self.name;
                        var _name$9 = $3519;
                        var self = Map$get$(_name$9, (() => {
                            var self = _world$1;
                            switch (self._) {
                                case 'Litereum.World.new':
                                    var $3521 = self.name_to_index;
                                    var $3522 = $3521;
                                    return $3522;
                            };
                        })());
                        switch (self._) {
                            case 'Maybe.none':
                                var self = _world$1;
                                switch (self._) {
                                    case 'Litereum.World.new':
                                        var $3524 = self.name_to_index;
                                        var $3525 = self.index_to_name;
                                        var $3526 = self.entry;
                                        var $3527 = Litereum$World$new$(($3514 + 1n), $3524, $3525, $3526);
                                        var _world$10 = $3527;
                                        break;
                                };
                                var self = _world$10;
                                switch (self._) {
                                    case 'Litereum.World.new':
                                        var $3528 = self.name_count;
                                        var $3529 = self.index_to_name;
                                        var $3530 = self.entry;
                                        var $3531 = Litereum$World$new$($3528, Map$set$(_name$9, $3514, $3515), $3529, $3530);
                                        var _world$11 = $3531;
                                        break;
                                };
                                var self = _world$11;
                                switch (self._) {
                                    case 'Litereum.World.new':
                                        var $3532 = self.name_count;
                                        var $3533 = self.name_to_index;
                                        var $3534 = self.entry;
                                        var $3535 = Litereum$World$new$($3532, $3533, Map$set$(Nat$show$($3514), _name$9, $3516), $3534);
                                        var _world$12 = $3535;
                                        break;
                                };
                                var $3523 = Maybe$some$(_world$12);
                                var $3520 = $3523;
                                break;
                            case 'Maybe.some':
                                var $3536 = Maybe$none;
                                var $3520 = $3536;
                                break;
                        };
                        var $3518 = $3520;
                        break;
                    case 'Litereum.Transaction.new_data':
                        var $3537 = self.data;
                        var _data$9 = $3537;
                        var self = _data$9;
                        switch (self._) {
                            case 'Litereum.Data.new':
                                var $3539 = self.name;
                                var self = Map$get$($3539, $3517);
                                switch (self._) {
                                    case 'Maybe.none':
                                        var self = _dry$3;
                                        if (self) {
                                            var $3542 = Unit$new;
                                            var _logger$12 = $3542;
                                        } else {
                                            var $3543 = ((console.log(("- data " + $3539)), (_$12 => {
                                                var $3544 = Unit$new;
                                                return $3544;
                                            })()));
                                            var _logger$12 = $3543;
                                        };
                                        var self = _world$1;
                                        switch (self._) {
                                            case 'Litereum.World.new':
                                                var $3545 = self.name_count;
                                                var $3546 = self.name_to_index;
                                                var $3547 = self.index_to_name;
                                                var $3548 = Litereum$World$new$($3545, $3546, $3547, Map$set$($3539, Litereum$Entry$data$(_data$9), $3517));
                                                var _world$13 = $3548;
                                                break;
                                        };
                                        var $3541 = Maybe$some$(_world$13);
                                        var $3540 = $3541;
                                        break;
                                    case 'Maybe.some':
                                        var $3549 = Maybe$none;
                                        var $3540 = $3549;
                                        break;
                                };
                                var $3538 = $3540;
                                break;
                        };
                        var $3518 = $3538;
                        break;
                    case 'Litereum.Transaction.new_bond':
                        var $3550 = self.bond;
                        var _bond$9 = $3550;
                        var self = _bond$9;
                        switch (self._) {
                            case 'Litereum.Bond.new':
                                var $3552 = self.name;
                                var $3553 = self.input_names;
                                var $3554 = self.input_types;
                                var $3555 = self.output_type;
                                var $3556 = self.main;
                                var self = Map$get$($3552, $3517);
                                switch (self._) {
                                    case 'Maybe.none':
                                        var self = _world$1;
                                        switch (self._) {
                                            case 'Litereum.World.new':
                                                var $3559 = self.name_count;
                                                var $3560 = self.name_to_index;
                                                var $3561 = self.index_to_name;
                                                var $3562 = Litereum$World$new$($3559, $3560, $3561, Map$set$($3552, Litereum$Entry$bond$(_bond$9), $3517));
                                                var _world$16 = $3562;
                                                break;
                                        };
                                        var _context$17 = Litereum$extend$(Map$from_list$(List$nil), $3553, $3554);
                                        var self = _dry$3;
                                        if (self) {
                                            var $3563 = Maybe$some$(_world$16);
                                            var $3558 = $3563;
                                        } else {
                                            var self = Litereum$check$(_context$17, _world$16, $3556, $3555);
                                            if (self) {
                                                var self = _dry$3;
                                                if (self) {
                                                    var $3566 = Unit$new;
                                                    var _logger$18 = $3566;
                                                } else {
                                                    var $3567 = ((console.log(("- bond " + $3552)), (_$18 => {
                                                        var $3568 = Unit$new;
                                                        return $3568;
                                                    })()));
                                                    var _logger$18 = $3567;
                                                };
                                                var $3565 = Maybe$some$(_world$16);
                                                var $3564 = $3565;
                                            } else {
                                                var self = _dry$3;
                                                if (self) {
                                                    var $3570 = Unit$new;
                                                    var _logger$18 = $3570;
                                                } else {
                                                    var $3571 = ((console.log(("- bond error: ill-typed bond " + $3552)), (_$18 => {
                                                        var $3572 = Unit$new;
                                                        return $3572;
                                                    })()));
                                                    var _logger$18 = $3571;
                                                };
                                                var $3569 = Maybe$none;
                                                var $3564 = $3569;
                                            };
                                            var $3558 = $3564;
                                        };
                                        var $3557 = $3558;
                                        break;
                                    case 'Maybe.some':
                                        var self = _dry$3;
                                        if (self) {
                                            var $3574 = Unit$new;
                                            var _logger$17 = $3574;
                                        } else {
                                            var $3575 = ((console.log(("- bond error: redefinition of " + $3552)), (_$17 => {
                                                var $3576 = Unit$new;
                                                return $3576;
                                            })()));
                                            var _logger$17 = $3575;
                                        };
                                        var $3573 = Maybe$none;
                                        var $3557 = $3573;
                                        break;
                                };
                                var $3551 = $3557;
                                break;
                        };
                        var $3518 = $3551;
                        break;
                    case 'Litereum.Transaction.new_eval':
                        var $3577 = self.eval;
                        var _eval$9 = $3577;
                        var self = _eval$9;
                        switch (self._) {
                            case 'Litereum.Eval.new':
                                var $3579 = self.term;
                                var $3580 = self.type;
                                var self = _dry$3;
                                if (self) {
                                    var $3582 = Maybe$some$(_world$1);
                                    var $3581 = $3582;
                                } else {
                                    var self = Litereum$check$(Map$from_list$(List$nil), _world$1, $3579, $3580);
                                    if (self) {
                                        var _fresh$12 = 0n;
                                        var self = Litereum$sanitize$(_world$1, Map$from_list$(List$nil), _fresh$12, $3579);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $3585 = self.fst;
                                                var $3586 = self.snd;
                                                var self = $3580;
                                                switch (self._) {
                                                    case 'Litereum.Type.word':
                                                    case 'Litereum.Type.data':
                                                        var $3588 = Litereum$normalize$(Litereum$Runtime$new$(_world$1, Map$from_list$(List$nil), $3585, 0n, $3586));
                                                        var self = $3588;
                                                        break;
                                                    case 'Litereum.Type.effect':
                                                        var $3589 = Litereum$normalize$(Litereum$run$(Litereum$Runtime$new$(_world$1, Map$from_list$(List$nil), $3585, 0n, $3586)));
                                                        var self = $3589;
                                                        break;
                                                };
                                                switch (self._) {
                                                    case 'Litereum.Runtime.new':
                                                        var $3590 = self.world;
                                                        var $3591 = self.term;
                                                        var self = _dry$3;
                                                        if (self) {
                                                            var $3593 = Unit$new;
                                                            var _logger$20 = $3593;
                                                        } else {
                                                            var $3594 = ((console.log(("- eval " + Litereum$show$term$($3590, $3591))), (_$20 => {
                                                                var $3595 = Unit$new;
                                                                return $3595;
                                                            })()));
                                                            var _logger$20 = $3594;
                                                        };
                                                        var $3592 = Maybe$some$($3590);
                                                        var $3587 = $3592;
                                                        break;
                                                };
                                                var $3584 = $3587;
                                                break;
                                        };
                                        var $3583 = $3584;
                                    } else {
                                        var self = _dry$3;
                                        if (self) {
                                            var $3597 = Unit$new;
                                            var _logger$12 = $3597;
                                        } else {
                                            var $3598 = ((console.log("- eval error: ill-typed term"), (_$12 => {
                                                var $3599 = Unit$new;
                                                return $3599;
                                            })()));
                                            var _logger$12 = $3598;
                                        };
                                        var $3596 = Maybe$none;
                                        var $3583 = $3596;
                                    };
                                    var $3581 = $3583;
                                };
                                var $3578 = $3581;
                                break;
                        };
                        var $3518 = $3578;
                        break;
                };
                var $3513 = $3518;
                break;
        };
        return $3513;
    };
    const Litereum$run_transaction = x0 => x1 => x2 => Litereum$run_transaction$(x0, x1, x2);

    function Litereum$reg$(_world$1, _transaction$2) {
        var $3600 = Maybe$default$(Litereum$run_transaction$(_world$1, _transaction$2, Bool$true), _world$1);
        return $3600;
    };
    const Litereum$reg = x0 => x1 => Litereum$reg$(x0, x1);

    function Litereum$parse$block$(_world$1) {
        var $3601 = Parser$choice(List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $3603 = self.err;
                    var _reply$8 = Litereum$parse$transaction$(_world$1)(_pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $3605 = self.err;
                            var self = $3603;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $3607 = self.value;
                                    var $3608 = Parser$Reply$error$(Parser$Error$combine$($3607, $3605));
                                    var $3606 = $3608;
                                    break;
                                case 'Maybe.none':
                                    var $3609 = Parser$Reply$error$($3605);
                                    var $3606 = $3609;
                                    break;
                            };
                            var $3604 = $3606;
                            break;
                        case 'Parser.Reply.value':
                            var $3610 = self.pst;
                            var $3611 = self.val;
                            var self = $3610;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $3613 = self.err;
                                    var $3614 = self.nam;
                                    var $3615 = self.ini;
                                    var $3616 = self.idx;
                                    var $3617 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($3603, $3613), $3614, $3615, $3616, $3617);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $3619 = self.err;
                                            var _reply$22 = Litereum$parse$block$(Litereum$reg$(_world$1, $3611))(_reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $3621 = self.err;
                                                    var self = $3619;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $3623 = self.value;
                                                            var $3624 = Parser$Reply$error$(Parser$Error$combine$($3623, $3621));
                                                            var $3622 = $3624;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $3625 = Parser$Reply$error$($3621);
                                                            var $3622 = $3625;
                                                            break;
                                                    };
                                                    var $3620 = $3622;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $3626 = self.pst;
                                                    var $3627 = self.val;
                                                    var self = $3626;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $3629 = self.err;
                                                            var $3630 = self.nam;
                                                            var $3631 = self.ini;
                                                            var $3632 = self.idx;
                                                            var $3633 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($3619, $3629), $3630, $3631, $3632, $3633);
                                                            var $3634 = Parser$Reply$value$(_reply$pst$30, List$cons$($3611, $3627));
                                                            var $3628 = $3634;
                                                            break;
                                                    };
                                                    var $3620 = $3628;
                                                    break;
                                            };
                                            var $3618 = $3620;
                                            break;
                                    };
                                    var $3612 = $3618;
                                    break;
                            };
                            var $3604 = $3612;
                            break;
                    };
                    var $3602 = $3604;
                    break;
            };
            return $3602;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $3636 = self.err;
                    var _reply$8 = Litereum$parse$ignore(_pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $3638 = self.err;
                            var self = $3636;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $3640 = self.value;
                                    var $3641 = Parser$Reply$error$(Parser$Error$combine$($3640, $3638));
                                    var $3639 = $3641;
                                    break;
                                case 'Maybe.none':
                                    var $3642 = Parser$Reply$error$($3638);
                                    var $3639 = $3642;
                                    break;
                            };
                            var $3637 = $3639;
                            break;
                        case 'Parser.Reply.value':
                            var $3643 = self.pst;
                            var self = $3643;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $3645 = self.err;
                                    var $3646 = self.nam;
                                    var $3647 = self.ini;
                                    var $3648 = self.idx;
                                    var $3649 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($3636, $3645), $3646, $3647, $3648, $3649);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $3651 = self.err;
                                            var _reply$22 = Parser$eof$(_reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $3653 = self.err;
                                                    var self = $3651;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $3655 = self.value;
                                                            var $3656 = Parser$Reply$error$(Parser$Error$combine$($3655, $3653));
                                                            var $3654 = $3656;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $3657 = Parser$Reply$error$($3653);
                                                            var $3654 = $3657;
                                                            break;
                                                    };
                                                    var $3652 = $3654;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $3658 = self.pst;
                                                    var self = $3658;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $3660 = self.err;
                                                            var $3661 = self.nam;
                                                            var $3662 = self.ini;
                                                            var $3663 = self.idx;
                                                            var $3664 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($3651, $3660), $3661, $3662, $3663, $3664);
                                                            var $3665 = Parser$Reply$value$(_reply$pst$30, List$nil);
                                                            var $3659 = $3665;
                                                            break;
                                                    };
                                                    var $3652 = $3659;
                                                    break;
                                            };
                                            var $3650 = $3652;
                                            break;
                                    };
                                    var $3644 = $3650;
                                    break;
                            };
                            var $3637 = $3644;
                            break;
                    };
                    var $3635 = $3637;
                    break;
            };
            return $3635;
        }), List$nil)));
        return $3601;
    };
    const Litereum$parse$block = x0 => Litereum$parse$block$(x0);

    function IO$(_A$1) {
        var $3666 = null;
        return $3666;
    };
    const IO = x0 => IO$(x0);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $3667 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $3667;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$end$(_value$2) {
        var $3668 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $3668;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$put_string$(_text$1) {
        var $3669 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $3670 = IO$end$(Unit$new);
            return $3670;
        }));
        return $3669;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function IO$print$(_text$1) {
        var $3671 = IO$put_string$((_text$1 + "\u{a}"));
        return $3671;
    };
    const IO$print = x0 => IO$print$(x0);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $3673 = self.value;
                var $3674 = _f$4($3673);
                var $3672 = $3674;
                break;
            case 'IO.ask':
                var $3675 = self.query;
                var $3676 = self.param;
                var $3677 = self.then;
                var $3678 = IO$ask$($3675, $3676, (_x$8 => {
                    var $3679 = IO$bind$($3677(_x$8), _f$4);
                    return $3679;
                }));
                var $3672 = $3678;
                break;
        };
        return $3672;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$monad$(_new$2) {
        var $3680 = _new$2(IO$bind)(IO$end);
        return $3680;
    };
    const IO$monad = x0 => IO$monad$(x0);
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');

    function U16$new$(_value$1) {
        var $3681 = word_to_u16(_value$1);
        return $3681;
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
            var $3683 = Bits$e;
            var $3682 = $3683;
        } else {
            var $3684 = (self - 1n);
            var self = ((_value$2 % 2n) === 0n);
            if (self) {
                var $3686 = (Litereum$serialize$fixlen$($3684, (_value$2 / 2n)) + '0');
                var $3685 = $3686;
            } else {
                var $3687 = (Litereum$serialize$fixlen$($3684, (_value$2 / 2n)) + '1');
                var $3685 = $3687;
            };
            var $3682 = $3685;
        };
        return $3682;
    };
    const Litereum$serialize$fixlen = x0 => x1 => Litereum$serialize$fixlen$(x0, x1);
    const U16$to_nat = a0 => (BigInt(a0));
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Litereum$serialize$name$new$(_name$1) {
        var self = _name$1;
        if (self.length === 0) {
            var $3689 = (Bits$e + '0');
            var $3688 = $3689;
        } else {
            var $3690 = self.charCodeAt(0);
            var $3691 = self.slice(1);
            var self = U16$btw$(48, $3690, 57);
            if (self) {
                var $3693 = (($3690 - 48) & 0xFFFF);
                var _numb$4 = $3693;
            } else {
                var self = U16$btw$(65, $3690, 90);
                if (self) {
                    var $3695 = (((($3690 - 65) & 0xFFFF) + 10) & 0xFFFF);
                    var $3694 = $3695;
                } else {
                    var self = U16$btw$(97, $3690, 122);
                    if (self) {
                        var $3697 = (((($3690 - 97) & 0xFFFF) + 36) & 0xFFFF);
                        var $3696 = $3697;
                    } else {
                        var self = U16$btw$(95, $3690, 95);
                        if (self) {
                            var $3699 = 62;
                            var $3698 = $3699;
                        } else {
                            var $3700 = 63;
                            var $3698 = $3700;
                        };
                        var $3696 = $3698;
                    };
                    var $3694 = $3696;
                };
                var _numb$4 = $3694;
            };
            var _head$5 = Litereum$serialize$fixlen$(6n, (BigInt(_numb$4)));
            var _tail$6 = Litereum$serialize$name$new$($3691);
            var $3692 = ((_tail$6 + _head$5) + '1');
            var $3688 = $3692;
        };
        return $3688;
    };
    const Litereum$serialize$name$new = x0 => Litereum$serialize$name$new$(x0);

    function Litereum$serialize$varlen$go$(_value$1) {
        var self = _value$1;
        if (self === 0n) {
            var $3702 = Bits$e;
            var $3701 = $3702;
        } else {
            var $3703 = (self - 1n);
            var self = (_value$1 === 1n);
            if (self) {
                var $3705 = (Bits$e + '0');
                var $3704 = $3705;
            } else {
                var self = ((_value$1 % 2n) === 0n);
                if (self) {
                    var $3707 = ((Litereum$serialize$varlen$go$((_value$1 / 2n)) + '0') + '1');
                    var $3706 = $3707;
                } else {
                    var $3708 = ((Litereum$serialize$varlen$go$((_value$1 / 2n)) + '1') + '1');
                    var $3706 = $3708;
                };
                var $3704 = $3706;
            };
            var $3701 = $3704;
        };
        return $3701;
    };
    const Litereum$serialize$varlen$go = x0 => Litereum$serialize$varlen$go$(x0);

    function Litereum$serialize$varlen$(_value$1) {
        var $3709 = Litereum$serialize$varlen$go$((_value$1 + 1n));
        return $3709;
    };
    const Litereum$serialize$varlen = x0 => Litereum$serialize$varlen$(x0);

    function Litereum$serialize$name$old$(_world$1, _name$2) {
        var self = _world$1;
        switch (self._) {
            case 'Litereum.World.new':
                var $3711 = self.name_to_index;
                var self = Map$get$(_name$2, $3711);
                switch (self._) {
                    case 'Maybe.some':
                        var $3713 = self.value;
                        var _bits$8 = Litereum$serialize$varlen$($3713);
                        var $3714 = _bits$8;
                        var $3712 = $3714;
                        break;
                    case 'Maybe.none':
                        var $3715 = (Bits$e + '0');
                        var $3712 = $3715;
                        break;
                };
                var $3710 = $3712;
                break;
        };
        return $3710;
    };
    const Litereum$serialize$name$old = x0 => x1 => Litereum$serialize$name$old$(x0, x1);

    function Litereum$serialize$list$(_item$2, _list$3) {
        var self = _list$3;
        switch (self._) {
            case 'List.cons':
                var $3717 = self.head;
                var $3718 = self.tail;
                var $3719 = ((Litereum$serialize$list$(_item$2, $3718) + _item$2($3717)) + '1');
                var $3716 = $3719;
                break;
            case 'List.nil':
                var $3720 = (Bits$e + '0');
                var $3716 = $3720;
                break;
        };
        return $3716;
    };
    const Litereum$serialize$list = x0 => x1 => Litereum$serialize$list$(x0, x1);

    function Litereum$serialize$type$(_world$1, _typ$2) {
        var self = _typ$2;
        switch (self._) {
            case 'Litereum.Type.data':
                var $3722 = self.name;
                var $3723 = ((Litereum$serialize$name$old$(_world$1, $3722) + '0') + '1');
                var $3721 = $3723;
                break;
            case 'Litereum.Type.effect':
                var $3724 = self.rety;
                var $3725 = ((Litereum$serialize$type$(_world$1, $3724) + '1') + '0');
                var $3721 = $3725;
                break;
            case 'Litereum.Type.word':
                var $3726 = ((Bits$e + '0') + '0');
                var $3721 = $3726;
                break;
        };
        return $3721;
    };
    const Litereum$serialize$type = x0 => x1 => Litereum$serialize$type$(x0, x1);

    function Litereum$serialize$constructor$(_world$1, _ctor$2) {
        var self = _ctor$2;
        switch (self._) {
            case 'Litereum.Constructor.new':
                var $3728 = self.name;
                var $3729 = self.field_names;
                var $3730 = self.field_types;
                var _name$6 = Litereum$serialize$name$old$(_world$1, $3728);
                var _nams$7 = Litereum$serialize$list$(Litereum$serialize$name$old(_world$1), $3729);
                var _typs$8 = Litereum$serialize$list$(Litereum$serialize$type(_world$1), $3730);
                var $3731 = ((_typs$8 + _nams$7) + _name$6);
                var $3727 = $3731;
                break;
        };
        return $3727;
    };
    const Litereum$serialize$constructor = x0 => x1 => Litereum$serialize$constructor$(x0, x1);

    function Litereum$serialize$data$(_world$1, _data$2) {
        var self = _data$2;
        switch (self._) {
            case 'Litereum.Data.new':
                var $3733 = self.name;
                var $3734 = self.constructors;
                var _name$5 = Litereum$serialize$name$old$(_world$1, $3733);
                var _ctrs$6 = Litereum$serialize$list$(Litereum$serialize$constructor(_world$1), $3734);
                var $3735 = (_ctrs$6 + _name$5);
                var $3732 = $3735;
                break;
        };
        return $3732;
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
                        var $3736 = self.head;
                        var $3737 = self.tail;
                        var self = _f$3($3736);
                        if (self) {
                            var $3739 = Maybe$some$(_i$4);
                            var $3738 = $3739;
                        } else {
                            var $3740 = List$find_index$go$($3737, _f$3, Nat$succ$(_i$4));
                            var $3738 = $3740;
                        };
                        return $3738;
                    case 'List.nil':
                        var $3741 = Maybe$none;
                        return $3741;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$find_index$go = x0 => x1 => x2 => List$find_index$go$(x0, x1, x2);

    function List$find_index$(_xs$2, _f$3) {
        var $3742 = List$find_index$go$(_xs$2, _f$3, Nat$zero);
        return $3742;
    };
    const List$find_index = x0 => x1 => List$find_index$(x0, x1);

    function Litereum$serialize$name$local$(_world$1, _vars$2, _name$3) {
        var self = List$find_index$(_vars$2, a1 => (_name$3 === a1));
        switch (self._) {
            case 'Maybe.some':
                var $3744 = self.value;
                var $3745 = Litereum$serialize$varlen$($3744);
                var $3743 = $3745;
                break;
            case 'Maybe.none':
                var $3746 = Bits$e;
                var $3743 = $3746;
                break;
        };
        return $3743;
    };
    const Litereum$serialize$name$local = x0 => x1 => x2 => Litereum$serialize$name$local$(x0, x1, x2);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $3748 = self.head;
                var $3749 = self.tail;
                var $3750 = List$cons$($3748, List$concat$($3749, _bs$3));
                var $3747 = $3750;
                break;
            case 'List.nil':
                var $3751 = _bs$3;
                var $3747 = $3751;
                break;
        };
        return $3747;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function Litereum$serialize$cases$(_world$1, _vars$2, _name$3, _ctors$4, _cases$5) {
        var self = _ctors$4;
        switch (self._) {
            case 'List.cons':
                var $3753 = self.head;
                var $3754 = self.tail;
                var self = _cases$5;
                switch (self._) {
                    case 'List.cons':
                        var $3756 = self.head;
                        var $3757 = self.tail;
                        var _flds$10 = List$map$(a1 => ((_name$3 + ".") + a1), (() => {
                            var self = $3753;
                            switch (self._) {
                                case 'Litereum.Constructor.new':
                                    var $3759 = self.field_names;
                                    var $3760 = $3759;
                                    return $3760;
                            };
                        })());
                        var _head$11 = Litereum$serialize$term$(_world$1, List$concat$(List$reverse$(_flds$10), _vars$2), $3756);
                        var _tail$12 = Litereum$serialize$cases$(_world$1, _vars$2, _name$3, $3754, $3757);
                        var $3758 = (_tail$12 + _head$11);
                        var $3755 = $3758;
                        break;
                    case 'List.nil':
                        var $3761 = Bits$e;
                        var $3755 = $3761;
                        break;
                };
                var $3752 = $3755;
                break;
            case 'List.nil':
                var self = _cases$5;
                switch (self._) {
                    case 'List.nil':
                    case 'List.cons':
                        var $3763 = Bits$e;
                        var $3762 = $3763;
                        break;
                };
                var $3752 = $3762;
                break;
        };
        return $3752;
    };
    const Litereum$serialize$cases = x0 => x1 => x2 => x3 => x4 => Litereum$serialize$cases$(x0, x1, x2, x3, x4);
    const U64$to_nat = a0 => (a0);

    function Litereum$serialize$term$(_world$1, _vars$2, _term$3) {
        var self = _term$3;
        switch (self._) {
            case 'Litereum.Term.var':
                var $3765 = self.name;
                var $3766 = (Litereum$serialize$name$local$(_world$1, _vars$2, $3765) + '0');
                var $3764 = $3766;
                break;
            case 'Litereum.Term.call':
                var $3767 = self.bond;
                var $3768 = self.args;
                var _bond$6 = Litereum$serialize$name$old$(_world$1, $3767);
                var _args$7 = Litereum$serialize$list$(Litereum$serialize$term(_world$1)(_vars$2), $3768);
                var $3769 = (((((_args$7 + _bond$6) + '0') + '0') + '1') + '1');
                var $3764 = $3769;
                break;
            case 'Litereum.Term.let':
                var $3770 = self.name;
                var $3771 = self.type;
                var $3772 = self.expr;
                var $3773 = self.body;
                var _name$8 = Litereum$serialize$name$old$(_world$1, $3770);
                var _type$9 = Litereum$serialize$type$(_world$1, $3771);
                var _expr$10 = Litereum$serialize$term$(_world$1, _vars$2, $3772);
                var _body$11 = Litereum$serialize$term$(_world$1, List$cons$($3770, _vars$2), $3773);
                var $3774 = (((((((_body$11 + _expr$10) + _type$9) + _name$8) + '0') + '0') + '0') + '1');
                var $3764 = $3774;
                break;
            case 'Litereum.Term.create':
                var $3775 = self.ctor;
                var $3776 = self.vals;
                var _ctor$6 = Litereum$serialize$name$old$(_world$1, $3775);
                var _vals$7 = Litereum$serialize$list$(Litereum$serialize$term(_world$1)(_vars$2), $3776);
                var $3777 = (((((_vals$7 + _ctor$6) + '0') + '1') + '0') + '1');
                var $3764 = $3777;
                break;
            case 'Litereum.Term.match':
                var $3778 = self.name;
                var $3779 = self.data;
                var $3780 = self.cses;
                var _name$7 = Litereum$serialize$name$local$(_world$1, _vars$2, $3778);
                var _data$8 = Litereum$serialize$name$old$(_world$1, $3779);
                var _cses$9 = Litereum$serialize$cases$(_world$1, _vars$2, $3778, Maybe$default$(Litereum$get_constructors$(_world$1, $3779), List$nil), $3780);
                var $3781 = ((((((_cses$9 + _data$8) + _name$7) + '0') + '1') + '1') + '1');
                var $3764 = $3781;
                break;
            case 'Litereum.Term.word':
                var $3782 = self.numb;
                var _numb$5 = Litereum$serialize$fixlen$(64n, ($3782));
                var $3783 = ((((_numb$5 + '1') + '0') + '0') + '1');
                var $3764 = $3783;
                break;
            case 'Litereum.Term.compare':
                var $3784 = self.val0;
                var $3785 = self.val1;
                var $3786 = self.iflt;
                var $3787 = self.ifeq;
                var $3788 = self.ifgt;
                var _val0$9 = Litereum$serialize$term$(_world$1, _vars$2, $3784);
                var _val1$10 = Litereum$serialize$term$(_world$1, _vars$2, $3785);
                var _iflt$11 = Litereum$serialize$term$(_world$1, _vars$2, $3786);
                var _ifeq$12 = Litereum$serialize$term$(_world$1, _vars$2, $3787);
                var _ifgt$13 = Litereum$serialize$term$(_world$1, _vars$2, $3788);
                var $3789 = ((((((((_ifgt$13 + _ifeq$12) + _iflt$11) + _val1$10) + _val0$9) + '1') + '0') + '1') + '1');
                var $3764 = $3789;
                break;
            case 'Litereum.Term.operate':
                var $3790 = self.oper;
                var $3791 = self.val0;
                var $3792 = self.val1;
                var _oper$7 = Litereum$serialize$fixlen$(3n, (() => {
                    var self = $3790;
                    switch (self._) {
                        case 'Litereum.Operation.add':
                            var $3794 = 0n;
                            return $3794;
                        case 'Litereum.Operation.sub':
                            var $3795 = 1n;
                            return $3795;
                        case 'Litereum.Operation.mul':
                            var $3796 = 2n;
                            return $3796;
                        case 'Litereum.Operation.div':
                            var $3797 = 3n;
                            return $3797;
                        case 'Litereum.Operation.mod':
                            var $3798 = 4n;
                            return $3798;
                        case 'Litereum.Operation.or':
                            var $3799 = 5n;
                            return $3799;
                        case 'Litereum.Operation.and':
                            var $3800 = 6n;
                            return $3800;
                        case 'Litereum.Operation.xor':
                            var $3801 = 7n;
                            return $3801;
                    };
                })());
                var _val0$8 = Litereum$serialize$term$(_world$1, _vars$2, $3791);
                var _val1$9 = Litereum$serialize$term$(_world$1, _vars$2, $3792);
                var $3793 = ((((((_val1$9 + _val0$8) + _oper$7) + '1') + '1') + '0') + '1');
                var $3764 = $3793;
                break;
            case 'Litereum.Term.run':
                var $3802 = self.name;
                var $3803 = self.type;
                var $3804 = self.expr;
                var $3805 = self.body;
                var _name$8 = Litereum$serialize$name$old$(_world$1, $3802);
                var _type$9 = Litereum$serialize$type$(_world$1, $3803);
                var _expr$10 = Litereum$serialize$term$(_world$1, _vars$2, $3804);
                var _body$11 = Litereum$serialize$term$(_world$1, List$cons$($3802, _vars$2), $3805);
                var $3806 = (((((((((_body$11 + _expr$10) + _type$9) + _name$8) + '0') + '0') + '1') + '1') + '1') + '1');
                var $3764 = $3806;
                break;
            case 'Litereum.Term.bind':
                var $3807 = self.bond;
                var $3808 = self.main;
                var $3809 = self.body;
                var self = Litereum$get_bond$(_world$1, $3807);
                switch (self._) {
                    case 'Maybe.some':
                        var $3811 = self.value;
                        var _bond$8 = $3811;
                        var self = _bond$8;
                        switch (self._) {
                            case 'Litereum.Bond.new':
                                var $3813 = self.input_names;
                                var _name$15 = Litereum$serialize$name$old$(_world$1, $3807);
                                var _vrs2$16 = List$concat$(List$reverse$($3813), _vars$2);
                                var _main$17 = Litereum$serialize$term$(_world$1, _vrs2$16, $3808);
                                var _body$18 = Litereum$serialize$term$(_world$1, _vars$2, $3809);
                                var $3814 = ((((((((_body$18 + _main$17) + _name$15) + '0') + '1') + '1') + '1') + '1') + '1');
                                var $3812 = $3814;
                                break;
                        };
                        var $3810 = $3812;
                        break;
                    case 'Maybe.none':
                        var $3815 = Bits$e;
                        var $3810 = $3815;
                        break;
                };
                var $3764 = $3810;
                break;
            case 'Litereum.Term.return':
                var $3816 = self.expr;
                var _expr$5 = Litereum$serialize$term$(_world$1, _vars$2, $3816);
                var $3817 = ((((((_expr$5 + '1') + '0') + '1') + '1') + '1') + '1');
                var $3764 = $3817;
                break;
        };
        return $3764;
    };
    const Litereum$serialize$term = x0 => x1 => x2 => Litereum$serialize$term$(x0, x1, x2);

    function Litereum$serialize$bond$(_world$1, _bond$2) {
        var self = _bond$2;
        switch (self._) {
            case 'Litereum.Bond.new':
                var $3819 = self.name;
                var $3820 = self.input_names;
                var $3821 = self.input_types;
                var $3822 = self.output_type;
                var $3823 = self.main;
                var $3824 = self.owners;
                var _name$9 = Litereum$serialize$name$old$(_world$1, $3819);
                var _input_names$10 = Litereum$serialize$list$(Litereum$serialize$name$old(_world$1), $3820);
                var _input_types$11 = Litereum$serialize$list$(Litereum$serialize$type(_world$1), $3821);
                var _output_type$12 = Litereum$serialize$type$(_world$1, $3822);
                var _main$13 = Litereum$serialize$term$(_world$1, List$reverse$($3820), $3823);
                var _owners$14 = Litereum$serialize$list$(Litereum$serialize$name$old(_world$1), $3824);
                var $3825 = (((((_owners$14 + _main$13) + _output_type$12) + _input_types$11) + _input_names$10) + _name$9);
                var $3818 = $3825;
                break;
        };
        return $3818;
    };
    const Litereum$serialize$bond = x0 => x1 => Litereum$serialize$bond$(x0, x1);

    function Litereum$serialize$eval$(_world$1, _eval$2) {
        var self = _eval$2;
        switch (self._) {
            case 'Litereum.Eval.new':
                var $3827 = self.term;
                var $3828 = self.type;
                var _term$5 = Litereum$serialize$term$(_world$1, List$nil, $3827);
                var _type$6 = Litereum$serialize$type$(_world$1, $3828);
                var $3829 = (_type$6 + _term$5);
                var $3826 = $3829;
                break;
        };
        return $3826;
    };
    const Litereum$serialize$eval = x0 => x1 => Litereum$serialize$eval$(x0, x1);

    function Litereum$serialize$transaction$(_world$1, _transaction$2) {
        var self = _transaction$2;
        switch (self._) {
            case 'Litereum.Transaction.new_name':
                var $3831 = self.name;
                var _name$4 = Litereum$serialize$name$new$($3831);
                var $3832 = ((_name$4 + '0') + '0');
                var $3830 = $3832;
                break;
            case 'Litereum.Transaction.new_data':
                var $3833 = self.data;
                var _data$4 = Litereum$serialize$data$(_world$1, $3833);
                var $3834 = ((_data$4 + '0') + '1');
                var $3830 = $3834;
                break;
            case 'Litereum.Transaction.new_bond':
                var $3835 = self.bond;
                var _bond$4 = Litereum$serialize$bond$(_world$1, $3835);
                var $3836 = ((_bond$4 + '1') + '0');
                var $3830 = $3836;
                break;
            case 'Litereum.Transaction.new_eval':
                var $3837 = self.eval;
                var _term$4 = Litereum$serialize$eval$(_world$1, $3837);
                var $3838 = ((_term$4 + '1') + '1');
                var $3830 = $3838;
                break;
        };
        return $3830;
    };
    const Litereum$serialize$transaction = x0 => x1 => Litereum$serialize$transaction$(x0, x1);

    function Litereum$serialize$block$(_world$1, _block$2) {
        var self = _block$2;
        switch (self._) {
            case 'List.cons':
                var $3840 = self.head;
                var $3841 = self.tail;
                var _head$5 = Litereum$serialize$transaction$(_world$1, $3840);
                var _tail$6 = Litereum$serialize$block$(Litereum$reg$(_world$1, $3840), $3841);
                var $3842 = (_tail$6 + _head$5);
                var $3839 = $3842;
                break;
            case 'List.nil':
                var $3843 = Bits$e;
                var $3839 = $3843;
                break;
        };
        return $3839;
    };
    const Litereum$serialize$block = x0 => x1 => Litereum$serialize$block$(x0, x1);

    function Bits$hex$encode$(_x$1) {
        var self = _x$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $3845 = self.slice(0, -1);
                var self = $3845;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $3847 = self.slice(0, -1);
                        var self = $3847;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $3849 = self.slice(0, -1);
                                var self = $3849;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3851 = self.slice(0, -1);
                                        var $3852 = ("0" + Bits$hex$encode$($3851));
                                        var $3850 = $3852;
                                        break;
                                    case 'i':
                                        var $3853 = self.slice(0, -1);
                                        var $3854 = ("8" + Bits$hex$encode$($3853));
                                        var $3850 = $3854;
                                        break;
                                    case 'e':
                                        var $3855 = "0";
                                        var $3850 = $3855;
                                        break;
                                };
                                var $3848 = $3850;
                                break;
                            case 'i':
                                var $3856 = self.slice(0, -1);
                                var self = $3856;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3858 = self.slice(0, -1);
                                        var $3859 = ("4" + Bits$hex$encode$($3858));
                                        var $3857 = $3859;
                                        break;
                                    case 'i':
                                        var $3860 = self.slice(0, -1);
                                        var $3861 = ("c" + Bits$hex$encode$($3860));
                                        var $3857 = $3861;
                                        break;
                                    case 'e':
                                        var $3862 = "4";
                                        var $3857 = $3862;
                                        break;
                                };
                                var $3848 = $3857;
                                break;
                            case 'e':
                                var $3863 = "0";
                                var $3848 = $3863;
                                break;
                        };
                        var $3846 = $3848;
                        break;
                    case 'i':
                        var $3864 = self.slice(0, -1);
                        var self = $3864;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $3866 = self.slice(0, -1);
                                var self = $3866;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3868 = self.slice(0, -1);
                                        var $3869 = ("2" + Bits$hex$encode$($3868));
                                        var $3867 = $3869;
                                        break;
                                    case 'i':
                                        var $3870 = self.slice(0, -1);
                                        var $3871 = ("a" + Bits$hex$encode$($3870));
                                        var $3867 = $3871;
                                        break;
                                    case 'e':
                                        var $3872 = "2";
                                        var $3867 = $3872;
                                        break;
                                };
                                var $3865 = $3867;
                                break;
                            case 'i':
                                var $3873 = self.slice(0, -1);
                                var self = $3873;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3875 = self.slice(0, -1);
                                        var $3876 = ("6" + Bits$hex$encode$($3875));
                                        var $3874 = $3876;
                                        break;
                                    case 'i':
                                        var $3877 = self.slice(0, -1);
                                        var $3878 = ("e" + Bits$hex$encode$($3877));
                                        var $3874 = $3878;
                                        break;
                                    case 'e':
                                        var $3879 = "6";
                                        var $3874 = $3879;
                                        break;
                                };
                                var $3865 = $3874;
                                break;
                            case 'e':
                                var $3880 = "2";
                                var $3865 = $3880;
                                break;
                        };
                        var $3846 = $3865;
                        break;
                    case 'e':
                        var $3881 = "0";
                        var $3846 = $3881;
                        break;
                };
                var $3844 = $3846;
                break;
            case 'i':
                var $3882 = self.slice(0, -1);
                var self = $3882;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $3884 = self.slice(0, -1);
                        var self = $3884;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $3886 = self.slice(0, -1);
                                var self = $3886;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3888 = self.slice(0, -1);
                                        var $3889 = ("1" + Bits$hex$encode$($3888));
                                        var $3887 = $3889;
                                        break;
                                    case 'i':
                                        var $3890 = self.slice(0, -1);
                                        var $3891 = ("9" + Bits$hex$encode$($3890));
                                        var $3887 = $3891;
                                        break;
                                    case 'e':
                                        var $3892 = "1";
                                        var $3887 = $3892;
                                        break;
                                };
                                var $3885 = $3887;
                                break;
                            case 'i':
                                var $3893 = self.slice(0, -1);
                                var self = $3893;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3895 = self.slice(0, -1);
                                        var $3896 = ("5" + Bits$hex$encode$($3895));
                                        var $3894 = $3896;
                                        break;
                                    case 'i':
                                        var $3897 = self.slice(0, -1);
                                        var $3898 = ("d" + Bits$hex$encode$($3897));
                                        var $3894 = $3898;
                                        break;
                                    case 'e':
                                        var $3899 = "5";
                                        var $3894 = $3899;
                                        break;
                                };
                                var $3885 = $3894;
                                break;
                            case 'e':
                                var $3900 = "1";
                                var $3885 = $3900;
                                break;
                        };
                        var $3883 = $3885;
                        break;
                    case 'i':
                        var $3901 = self.slice(0, -1);
                        var self = $3901;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $3903 = self.slice(0, -1);
                                var self = $3903;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3905 = self.slice(0, -1);
                                        var $3906 = ("3" + Bits$hex$encode$($3905));
                                        var $3904 = $3906;
                                        break;
                                    case 'i':
                                        var $3907 = self.slice(0, -1);
                                        var $3908 = ("b" + Bits$hex$encode$($3907));
                                        var $3904 = $3908;
                                        break;
                                    case 'e':
                                        var $3909 = "3";
                                        var $3904 = $3909;
                                        break;
                                };
                                var $3902 = $3904;
                                break;
                            case 'i':
                                var $3910 = self.slice(0, -1);
                                var self = $3910;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3912 = self.slice(0, -1);
                                        var $3913 = ("7" + Bits$hex$encode$($3912));
                                        var $3911 = $3913;
                                        break;
                                    case 'i':
                                        var $3914 = self.slice(0, -1);
                                        var $3915 = ("f" + Bits$hex$encode$($3914));
                                        var $3911 = $3915;
                                        break;
                                    case 'e':
                                        var $3916 = "7";
                                        var $3911 = $3916;
                                        break;
                                };
                                var $3902 = $3911;
                                break;
                            case 'e':
                                var $3917 = "3";
                                var $3902 = $3917;
                                break;
                        };
                        var $3883 = $3902;
                        break;
                    case 'e':
                        var $3918 = "1";
                        var $3883 = $3918;
                        break;
                };
                var $3844 = $3883;
                break;
            case 'e':
                var $3919 = "";
                var $3844 = $3919;
                break;
        };
        return $3844;
    };
    const Bits$hex$encode = x0 => Bits$hex$encode$(x0);

    function Bits$is_empty$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $3921 = Bool$true;
                var $3920 = $3921;
                break;
            case 'o':
            case 'i':
                var $3922 = Bool$false;
                var $3920 = $3922;
                break;
        };
        return $3920;
    };
    const Bits$is_empty = x0 => Bits$is_empty$(x0);

    function Litereum$deserialize$fixlen$(_size$1, _bits$2) {
        var self = _size$1;
        if (self === 0n) {
            var $3924 = Pair$new$(_bits$2, 0n);
            var $3923 = $3924;
        } else {
            var $3925 = (self - 1n);
            var self = _bits$2;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $3927 = self.slice(0, -1);
                    var self = Litereum$deserialize$fixlen$($3925, $3927);
                    switch (self._) {
                        case 'Pair.new':
                            var $3929 = self.fst;
                            var $3930 = self.snd;
                            var $3931 = Pair$new$($3929, ($3930 * 2n));
                            var $3928 = $3931;
                            break;
                    };
                    var $3926 = $3928;
                    break;
                case 'i':
                    var $3932 = self.slice(0, -1);
                    var self = Litereum$deserialize$fixlen$($3925, $3932);
                    switch (self._) {
                        case 'Pair.new':
                            var $3934 = self.fst;
                            var $3935 = self.snd;
                            var $3936 = Pair$new$($3934, (($3935 * 2n) + 1n));
                            var $3933 = $3936;
                            break;
                    };
                    var $3926 = $3933;
                    break;
                case 'e':
                    var $3937 = Pair$new$(Bits$e, 0n);
                    var $3926 = $3937;
                    break;
            };
            var $3923 = $3926;
        };
        return $3923;
    };
    const Litereum$deserialize$fixlen = x0 => x1 => Litereum$deserialize$fixlen$(x0, x1);
    const U16$from_nat = a0 => (Number(a0) & 0xFFFF);

    function Litereum$deserialize$name$new$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $3939 = self.slice(0, -1);
                var $3940 = Pair$new$($3939, "");
                var $3938 = $3940;
                break;
            case 'i':
                var $3941 = self.slice(0, -1);
                var self = Litereum$deserialize$fixlen$(6n, $3941);
                switch (self._) {
                    case 'Pair.new':
                        var $3943 = self.fst;
                        var $3944 = self.snd;
                        var self = Litereum$deserialize$name$new$($3943);
                        switch (self._) {
                            case 'Pair.new':
                                var $3946 = self.fst;
                                var $3947 = self.snd;
                                var _numb$7 = (Number($3944) & 0xFFFF);
                                var self = U16$btw$(0, _numb$7, 9);
                                if (self) {
                                    var $3949 = ((_numb$7 + 48) & 0xFFFF);
                                    var _head$8 = $3949;
                                } else {
                                    var self = U16$btw$(10, _numb$7, 35);
                                    if (self) {
                                        var $3951 = ((((_numb$7 - 10) & 0xFFFF) + 65) & 0xFFFF);
                                        var $3950 = $3951;
                                    } else {
                                        var self = U16$btw$(36, _numb$7, 61);
                                        if (self) {
                                            var $3953 = ((((_numb$7 - 36) & 0xFFFF) + 97) & 0xFFFF);
                                            var $3952 = $3953;
                                        } else {
                                            var self = U16$btw$(62, _numb$7, 62);
                                            if (self) {
                                                var $3955 = 95;
                                                var $3954 = $3955;
                                            } else {
                                                var $3956 = 46;
                                                var $3954 = $3956;
                                            };
                                            var $3952 = $3954;
                                        };
                                        var $3950 = $3952;
                                    };
                                    var _head$8 = $3950;
                                };
                                var $3948 = Pair$new$($3946, String$cons$(_head$8, $3947));
                                var $3945 = $3948;
                                break;
                        };
                        var $3942 = $3945;
                        break;
                };
                var $3938 = $3942;
                break;
            case 'e':
                var $3957 = Pair$new$(Bits$e, "");
                var $3938 = $3957;
                break;
        };
        return $3938;
    };
    const Litereum$deserialize$name$new = x0 => Litereum$deserialize$name$new$(x0);

    function Litereum$deserialize$varlen$go$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $3959 = self.slice(0, -1);
                var $3960 = Pair$new$($3959, 1n);
                var $3958 = $3960;
                break;
            case 'i':
                var $3961 = self.slice(0, -1);
                var self = $3961;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $3963 = self.slice(0, -1);
                        var self = Litereum$deserialize$varlen$go$($3963);
                        switch (self._) {
                            case 'Pair.new':
                                var $3965 = self.fst;
                                var $3966 = self.snd;
                                var $3967 = Pair$new$($3965, ($3966 * 2n));
                                var $3964 = $3967;
                                break;
                        };
                        var $3962 = $3964;
                        break;
                    case 'i':
                        var $3968 = self.slice(0, -1);
                        var self = Litereum$deserialize$varlen$go$($3968);
                        switch (self._) {
                            case 'Pair.new':
                                var $3970 = self.fst;
                                var $3971 = self.snd;
                                var $3972 = Pair$new$($3970, (($3971 * 2n) + 1n));
                                var $3969 = $3972;
                                break;
                        };
                        var $3962 = $3969;
                        break;
                    case 'e':
                        var $3973 = Pair$new$($3961, 0n);
                        var $3962 = $3973;
                        break;
                };
                var $3958 = $3962;
                break;
            case 'e':
                var $3974 = Pair$new$(Bits$e, 0n);
                var $3958 = $3974;
                break;
        };
        return $3958;
    };
    const Litereum$deserialize$varlen$go = x0 => Litereum$deserialize$varlen$go$(x0);

    function Litereum$deserialize$varlen$(_bits$1) {
        var self = Litereum$deserialize$varlen$go$(_bits$1);
        switch (self._) {
            case 'Pair.new':
                var $3976 = self.fst;
                var $3977 = self.snd;
                var $3978 = Pair$new$($3976, ($3977 - 1n <= 0n ? 0n : $3977 - 1n));
                var $3975 = $3978;
                break;
        };
        return $3975;
    };
    const Litereum$deserialize$varlen = x0 => Litereum$deserialize$varlen$(x0);

    function Litereum$deserialize$name$old$(_world$1, _bits$2) {
        var self = _world$1;
        switch (self._) {
            case 'Litereum.World.new':
                var $3980 = self.index_to_name;
                var self = Litereum$deserialize$varlen$(_bits$2);
                switch (self._) {
                    case 'Pair.new':
                        var $3982 = self.fst;
                        var $3983 = self.snd;
                        var self = Map$get$(Nat$show$($3983), $3980);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3985 = self.value;
                                var $3986 = Pair$new$($3982, $3985);
                                var $3984 = $3986;
                                break;
                            case 'Maybe.none':
                                var $3987 = Pair$new$($3982, "");
                                var $3984 = $3987;
                                break;
                        };
                        var $3981 = $3984;
                        break;
                };
                var $3979 = $3981;
                break;
        };
        return $3979;
    };
    const Litereum$deserialize$name$old = x0 => x1 => Litereum$deserialize$name$old$(x0, x1);

    function Litereum$deserialize$list$(_item$2, _bits$3) {
        var self = _bits$3;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $3989 = self.slice(0, -1);
                var $3990 = Pair$new$($3989, List$nil);
                var $3988 = $3990;
                break;
            case 'i':
                var $3991 = self.slice(0, -1);
                var self = _item$2($3991);
                switch (self._) {
                    case 'Pair.new':
                        var $3993 = self.fst;
                        var $3994 = self.snd;
                        var self = Litereum$deserialize$list$(_item$2, $3993);
                        switch (self._) {
                            case 'Pair.new':
                                var $3996 = self.fst;
                                var $3997 = self.snd;
                                var $3998 = Pair$new$($3996, List$cons$($3994, $3997));
                                var $3995 = $3998;
                                break;
                        };
                        var $3992 = $3995;
                        break;
                };
                var $3988 = $3992;
                break;
            case 'e':
                var $3999 = Pair$new$(Bits$e, List$nil);
                var $3988 = $3999;
                break;
        };
        return $3988;
    };
    const Litereum$deserialize$list = x0 => x1 => Litereum$deserialize$list$(x0, x1);

    function Litereum$deserialize$type$(_world$1, _bits$2) {
        var self = Litereum$deserialize$fixlen$(2n, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $4001 = self.fst;
                var $4002 = self.snd;
                var self = ($4002 === 0n);
                if (self) {
                    var $4004 = Pair$new$($4001, Litereum$Type$word);
                    var $4003 = $4004;
                } else {
                    var self = ($4002 === 1n);
                    if (self) {
                        var self = Litereum$deserialize$name$old$(_world$1, $4001);
                        switch (self._) {
                            case 'Pair.new':
                                var $4007 = self.fst;
                                var $4008 = self.snd;
                                var $4009 = Pair$new$($4007, Litereum$Type$data$($4008));
                                var $4006 = $4009;
                                break;
                        };
                        var $4005 = $4006;
                    } else {
                        var self = ($4002 === 2n);
                        if (self) {
                            var self = Litereum$deserialize$type$(_world$1, $4001);
                            switch (self._) {
                                case 'Pair.new':
                                    var $4012 = self.fst;
                                    var $4013 = self.snd;
                                    var $4014 = Pair$new$($4012, Litereum$Type$effect$($4013));
                                    var $4011 = $4014;
                                    break;
                            };
                            var $4010 = $4011;
                        } else {
                            var $4015 = Pair$new$($4001, Litereum$Type$word);
                            var $4010 = $4015;
                        };
                        var $4005 = $4010;
                    };
                    var $4003 = $4005;
                };
                var $4000 = $4003;
                break;
        };
        return $4000;
    };
    const Litereum$deserialize$type = x0 => x1 => Litereum$deserialize$type$(x0, x1);

    function Litereum$deserialize$constructor$(_world$1, _bits$2) {
        var self = Litereum$deserialize$name$old$(_world$1, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $4017 = self.fst;
                var $4018 = self.snd;
                var self = Litereum$deserialize$list$(Litereum$deserialize$name$old(_world$1), $4017);
                switch (self._) {
                    case 'Pair.new':
                        var $4020 = self.fst;
                        var $4021 = self.snd;
                        var self = Litereum$deserialize$list$(Litereum$deserialize$type(_world$1), $4020);
                        switch (self._) {
                            case 'Pair.new':
                                var $4023 = self.fst;
                                var $4024 = self.snd;
                                var $4025 = Pair$new$($4023, Litereum$Constructor$new$($4018, $4021, $4024));
                                var $4022 = $4025;
                                break;
                        };
                        var $4019 = $4022;
                        break;
                };
                var $4016 = $4019;
                break;
        };
        return $4016;
    };
    const Litereum$deserialize$constructor = x0 => x1 => Litereum$deserialize$constructor$(x0, x1);

    function Litereum$deserialize$data$(_world$1, _bits$2) {
        var self = Litereum$deserialize$name$old$(_world$1, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $4027 = self.fst;
                var $4028 = self.snd;
                var self = Litereum$deserialize$list$(Litereum$deserialize$constructor(_world$1), $4027);
                switch (self._) {
                    case 'Pair.new':
                        var $4030 = self.fst;
                        var $4031 = self.snd;
                        var $4032 = Pair$new$($4030, Litereum$Data$new$($4028, $4031));
                        var $4029 = $4032;
                        break;
                };
                var $4026 = $4029;
                break;
        };
        return $4026;
    };
    const Litereum$deserialize$data = x0 => x1 => Litereum$deserialize$data$(x0, x1);

    function Litereum$deserialize$name$local$(_world$1, _vars$2, _bits$3) {
        var self = Litereum$deserialize$varlen$(_bits$3);
        switch (self._) {
            case 'Pair.new':
                var $4034 = self.fst;
                var $4035 = self.snd;
                var $4036 = Pair$new$($4034, Maybe$default$(List$get$($4035, _vars$2), ""));
                var $4033 = $4036;
                break;
        };
        return $4033;
    };
    const Litereum$deserialize$name$local = x0 => x1 => x2 => Litereum$deserialize$name$local$(x0, x1, x2);

    function Litereum$deserialize$cases$(_world$1, _vars$2, _name$3, _ctors$4, _bits$5) {
        var self = _ctors$4;
        switch (self._) {
            case 'List.cons':
                var $4038 = self.head;
                var $4039 = self.tail;
                var _flds$8 = List$map$(a1 => ((_name$3 + ".") + a1), (() => {
                    var self = $4038;
                    switch (self._) {
                        case 'Litereum.Constructor.new':
                            var $4041 = self.field_names;
                            var $4042 = $4041;
                            return $4042;
                    };
                })());
                var self = Litereum$deserialize$term$(_world$1, List$concat$(List$reverse$(_flds$8), _vars$2), _bits$5);
                switch (self._) {
                    case 'Pair.new':
                        var $4043 = self.fst;
                        var $4044 = self.snd;
                        var self = Litereum$deserialize$cases$(_world$1, _vars$2, _name$3, $4039, $4043);
                        switch (self._) {
                            case 'Pair.new':
                                var $4046 = self.fst;
                                var $4047 = self.snd;
                                var $4048 = Pair$new$($4046, List$cons$($4044, $4047));
                                var $4045 = $4048;
                                break;
                        };
                        var $4040 = $4045;
                        break;
                };
                var $4037 = $4040;
                break;
            case 'List.nil':
                var $4049 = Pair$new$(_bits$5, List$nil);
                var $4037 = $4049;
                break;
        };
        return $4037;
    };
    const Litereum$deserialize$cases = x0 => x1 => x2 => x3 => x4 => Litereum$deserialize$cases$(x0, x1, x2, x3, x4);

    function Litereum$deserialize$term$(_world$1, _vars$2, _bits$3) {
        var self = _bits$3;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $4051 = self.slice(0, -1);
                var self = Litereum$deserialize$name$local$(_world$1, _vars$2, $4051);
                switch (self._) {
                    case 'Pair.new':
                        var $4053 = self.fst;
                        var $4054 = self.snd;
                        var $4055 = Pair$new$($4053, Litereum$Term$var$($4054));
                        var $4052 = $4055;
                        break;
                };
                var $4050 = $4052;
                break;
            case 'i':
                var $4056 = self.slice(0, -1);
                var self = Litereum$deserialize$fixlen$(3n, $4056);
                switch (self._) {
                    case 'Pair.new':
                        var $4058 = self.fst;
                        var $4059 = self.snd;
                        var self = ($4059 === 0n);
                        if (self) {
                            var self = Litereum$deserialize$name$old$(_world$1, $4058);
                            switch (self._) {
                                case 'Pair.new':
                                    var $4062 = self.fst;
                                    var $4063 = self.snd;
                                    var self = Litereum$deserialize$type$(_world$1, $4062);
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $4065 = self.fst;
                                            var $4066 = self.snd;
                                            var self = Litereum$deserialize$term$(_world$1, _vars$2, $4065);
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $4068 = self.fst;
                                                    var $4069 = self.snd;
                                                    var self = Litereum$deserialize$term$(_world$1, List$cons$($4063, _vars$2), $4068);
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $4071 = self.fst;
                                                            var $4072 = self.snd;
                                                            var $4073 = Pair$new$($4071, Litereum$Term$let$($4063, $4066, $4069, $4072));
                                                            var $4070 = $4073;
                                                            break;
                                                    };
                                                    var $4067 = $4070;
                                                    break;
                                            };
                                            var $4064 = $4067;
                                            break;
                                    };
                                    var $4061 = $4064;
                                    break;
                            };
                            var $4060 = $4061;
                        } else {
                            var self = ($4059 === 1n);
                            if (self) {
                                var self = Litereum$deserialize$name$old$(_world$1, $4058);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $4076 = self.fst;
                                        var $4077 = self.snd;
                                        var self = Litereum$deserialize$list$(Litereum$deserialize$term(_world$1)(_vars$2), $4076);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $4079 = self.fst;
                                                var $4080 = self.snd;
                                                var $4081 = Pair$new$($4079, Litereum$Term$call$($4077, $4080));
                                                var $4078 = $4081;
                                                break;
                                        };
                                        var $4075 = $4078;
                                        break;
                                };
                                var $4074 = $4075;
                            } else {
                                var self = ($4059 === 2n);
                                if (self) {
                                    var self = Litereum$deserialize$name$old$(_world$1, $4058);
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $4084 = self.fst;
                                            var $4085 = self.snd;
                                            var self = Litereum$deserialize$list$(Litereum$deserialize$term(_world$1)(_vars$2), $4084);
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $4087 = self.fst;
                                                    var $4088 = self.snd;
                                                    var $4089 = Pair$new$($4087, Litereum$Term$create$($4085, $4088));
                                                    var $4086 = $4089;
                                                    break;
                                            };
                                            var $4083 = $4086;
                                            break;
                                    };
                                    var $4082 = $4083;
                                } else {
                                    var self = ($4059 === 3n);
                                    if (self) {
                                        var self = Litereum$deserialize$name$local$(_world$1, _vars$2, $4058);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $4092 = self.fst;
                                                var $4093 = self.snd;
                                                var self = Litereum$deserialize$name$old$(_world$1, $4092);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $4095 = self.fst;
                                                        var $4096 = self.snd;
                                                        var self = Litereum$deserialize$cases$(_world$1, _vars$2, $4093, Maybe$default$(Litereum$get_constructors$(_world$1, $4096), List$nil), $4095);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $4098 = self.fst;
                                                                var $4099 = self.snd;
                                                                var $4100 = Pair$new$($4098, Litereum$Term$match$($4093, $4096, $4099));
                                                                var $4097 = $4100;
                                                                break;
                                                        };
                                                        var $4094 = $4097;
                                                        break;
                                                };
                                                var $4091 = $4094;
                                                break;
                                        };
                                        var $4090 = $4091;
                                    } else {
                                        var self = ($4059 === 4n);
                                        if (self) {
                                            var self = Litereum$deserialize$fixlen$(64n, $4058);
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $4103 = self.fst;
                                                    var $4104 = self.snd;
                                                    var $4105 = Pair$new$($4103, Litereum$Term$word$(($4104 & 0xFFFFFFFFFFFFFFFFn)));
                                                    var $4102 = $4105;
                                                    break;
                                            };
                                            var $4101 = $4102;
                                        } else {
                                            var self = ($4059 === 5n);
                                            if (self) {
                                                var self = Litereum$deserialize$term$(_world$1, _vars$2, $4058);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $4108 = self.fst;
                                                        var $4109 = self.snd;
                                                        var self = Litereum$deserialize$term$(_world$1, _vars$2, $4108);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $4111 = self.fst;
                                                                var $4112 = self.snd;
                                                                var self = Litereum$deserialize$term$(_world$1, _vars$2, $4111);
                                                                switch (self._) {
                                                                    case 'Pair.new':
                                                                        var $4114 = self.fst;
                                                                        var $4115 = self.snd;
                                                                        var self = Litereum$deserialize$term$(_world$1, _vars$2, $4114);
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $4117 = self.fst;
                                                                                var $4118 = self.snd;
                                                                                var self = Litereum$deserialize$term$(_world$1, _vars$2, $4117);
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $4120 = self.fst;
                                                                                        var $4121 = self.snd;
                                                                                        var $4122 = Pair$new$($4120, Litereum$Term$compare$($4109, $4112, $4115, $4118, $4121));
                                                                                        var $4119 = $4122;
                                                                                        break;
                                                                                };
                                                                                var $4116 = $4119;
                                                                                break;
                                                                        };
                                                                        var $4113 = $4116;
                                                                        break;
                                                                };
                                                                var $4110 = $4113;
                                                                break;
                                                        };
                                                        var $4107 = $4110;
                                                        break;
                                                };
                                                var $4106 = $4107;
                                            } else {
                                                var self = ($4059 === 6n);
                                                if (self) {
                                                    var self = Litereum$deserialize$fixlen$(3n, $4058);
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $4125 = self.fst;
                                                            var $4126 = self.snd;
                                                            var self = Litereum$deserialize$term$(_world$1, _vars$2, $4125);
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $4128 = self.fst;
                                                                    var $4129 = self.snd;
                                                                    var self = Litereum$deserialize$term$(_world$1, _vars$2, $4128);
                                                                    switch (self._) {
                                                                        case 'Pair.new':
                                                                            var $4131 = self.fst;
                                                                            var $4132 = self.snd;
                                                                            var self = ($4126 === 0n);
                                                                            if (self) {
                                                                                var $4134 = Litereum$Operation$add;
                                                                                var _oper$13 = $4134;
                                                                            } else {
                                                                                var self = ($4126 === 1n);
                                                                                if (self) {
                                                                                    var $4136 = Litereum$Operation$sub;
                                                                                    var $4135 = $4136;
                                                                                } else {
                                                                                    var self = ($4126 === 2n);
                                                                                    if (self) {
                                                                                        var $4138 = Litereum$Operation$mul;
                                                                                        var $4137 = $4138;
                                                                                    } else {
                                                                                        var self = ($4126 === 3n);
                                                                                        if (self) {
                                                                                            var $4140 = Litereum$Operation$div;
                                                                                            var $4139 = $4140;
                                                                                        } else {
                                                                                            var self = ($4126 === 4n);
                                                                                            if (self) {
                                                                                                var $4142 = Litereum$Operation$mod;
                                                                                                var $4141 = $4142;
                                                                                            } else {
                                                                                                var self = ($4126 === 5n);
                                                                                                if (self) {
                                                                                                    var $4144 = Litereum$Operation$or;
                                                                                                    var $4143 = $4144;
                                                                                                } else {
                                                                                                    var self = ($4126 === 6n);
                                                                                                    if (self) {
                                                                                                        var $4146 = Litereum$Operation$and;
                                                                                                        var $4145 = $4146;
                                                                                                    } else {
                                                                                                        var self = ($4126 === 7n);
                                                                                                        if (self) {
                                                                                                            var $4148 = Litereum$Operation$xor;
                                                                                                            var $4147 = $4148;
                                                                                                        } else {
                                                                                                            var $4149 = Litereum$Operation$add;
                                                                                                            var $4147 = $4149;
                                                                                                        };
                                                                                                        var $4145 = $4147;
                                                                                                    };
                                                                                                    var $4143 = $4145;
                                                                                                };
                                                                                                var $4141 = $4143;
                                                                                            };
                                                                                            var $4139 = $4141;
                                                                                        };
                                                                                        var $4137 = $4139;
                                                                                    };
                                                                                    var $4135 = $4137;
                                                                                };
                                                                                var _oper$13 = $4135;
                                                                            };
                                                                            var $4133 = Pair$new$($4131, Litereum$Term$operate$(_oper$13, $4129, $4132));
                                                                            var $4130 = $4133;
                                                                            break;
                                                                    };
                                                                    var $4127 = $4130;
                                                                    break;
                                                            };
                                                            var $4124 = $4127;
                                                            break;
                                                    };
                                                    var $4123 = $4124;
                                                } else {
                                                    var self = ($4059 === 7n);
                                                    if (self) {
                                                        var self = Litereum$deserialize$fixlen$(2n, $4058);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $4152 = self.fst;
                                                                var $4153 = self.snd;
                                                                var self = ($4153 === 0n);
                                                                if (self) {
                                                                    var self = Litereum$deserialize$name$old$(_world$1, $4152);
                                                                    switch (self._) {
                                                                        case 'Pair.new':
                                                                            var $4156 = self.fst;
                                                                            var $4157 = self.snd;
                                                                            var self = Litereum$deserialize$type$(_world$1, $4156);
                                                                            switch (self._) {
                                                                                case 'Pair.new':
                                                                                    var $4159 = self.fst;
                                                                                    var $4160 = self.snd;
                                                                                    var self = Litereum$deserialize$term$(_world$1, _vars$2, $4159);
                                                                                    switch (self._) {
                                                                                        case 'Pair.new':
                                                                                            var $4162 = self.fst;
                                                                                            var $4163 = self.snd;
                                                                                            var self = Litereum$deserialize$term$(_world$1, List$cons$($4157, _vars$2), $4162);
                                                                                            switch (self._) {
                                                                                                case 'Pair.new':
                                                                                                    var $4165 = self.fst;
                                                                                                    var $4166 = self.snd;
                                                                                                    var $4167 = Pair$new$($4165, Litereum$Term$run$($4157, $4160, $4163, $4166));
                                                                                                    var $4164 = $4167;
                                                                                                    break;
                                                                                            };
                                                                                            var $4161 = $4164;
                                                                                            break;
                                                                                    };
                                                                                    var $4158 = $4161;
                                                                                    break;
                                                                            };
                                                                            var $4155 = $4158;
                                                                            break;
                                                                    };
                                                                    var $4154 = $4155;
                                                                } else {
                                                                    var self = ($4153 === 1n);
                                                                    if (self) {
                                                                        var self = Litereum$deserialize$name$old$(_world$1, $4152);
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $4170 = self.fst;
                                                                                var $4171 = self.snd;
                                                                                var self = Litereum$get_bond$(_world$1, $4171);
                                                                                switch (self._) {
                                                                                    case 'Maybe.some':
                                                                                        var $4173 = self.value;
                                                                                        var _bond$12 = $4173;
                                                                                        var self = _bond$12;
                                                                                        switch (self._) {
                                                                                            case 'Litereum.Bond.new':
                                                                                                var $4175 = self.input_names;
                                                                                                var _vrs2$19 = List$concat$(List$reverse$($4175), _vars$2);
                                                                                                var self = Litereum$deserialize$term$(_world$1, _vrs2$19, $4170);
                                                                                                switch (self._) {
                                                                                                    case 'Pair.new':
                                                                                                        var $4177 = self.fst;
                                                                                                        var $4178 = self.snd;
                                                                                                        var self = Litereum$deserialize$term$(_world$1, _vars$2, $4177);
                                                                                                        switch (self._) {
                                                                                                            case 'Pair.new':
                                                                                                                var $4180 = self.fst;
                                                                                                                var $4181 = self.snd;
                                                                                                                var $4182 = Pair$new$($4180, Litereum$Term$bind$($4171, $4178, $4181));
                                                                                                                var $4179 = $4182;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $4176 = $4179;
                                                                                                        break;
                                                                                                };
                                                                                                var $4174 = $4176;
                                                                                                break;
                                                                                        };
                                                                                        var $4172 = $4174;
                                                                                        break;
                                                                                    case 'Maybe.none':
                                                                                        var $4183 = Pair$new$($4170, Litereum$Term$word$(0n));
                                                                                        var $4172 = $4183;
                                                                                        break;
                                                                                };
                                                                                var $4169 = $4172;
                                                                                break;
                                                                        };
                                                                        var $4168 = $4169;
                                                                    } else {
                                                                        var self = ($4153 === 2n);
                                                                        if (self) {
                                                                            var self = Litereum$deserialize$term$(_world$1, _vars$2, $4152);
                                                                            switch (self._) {
                                                                                case 'Pair.new':
                                                                                    var $4186 = self.fst;
                                                                                    var $4187 = self.snd;
                                                                                    var $4188 = Pair$new$($4186, Litereum$Term$return$($4187));
                                                                                    var $4185 = $4188;
                                                                                    break;
                                                                            };
                                                                            var $4184 = $4185;
                                                                        } else {
                                                                            var $4189 = Pair$new$($4152, Litereum$Term$word$(0n));
                                                                            var $4184 = $4189;
                                                                        };
                                                                        var $4168 = $4184;
                                                                    };
                                                                    var $4154 = $4168;
                                                                };
                                                                var $4151 = $4154;
                                                                break;
                                                        };
                                                        var $4150 = $4151;
                                                    } else {
                                                        var $4190 = Pair$new$($4058, Litereum$Term$word$(0n));
                                                        var $4150 = $4190;
                                                    };
                                                    var $4123 = $4150;
                                                };
                                                var $4106 = $4123;
                                            };
                                            var $4101 = $4106;
                                        };
                                        var $4090 = $4101;
                                    };
                                    var $4082 = $4090;
                                };
                                var $4074 = $4082;
                            };
                            var $4060 = $4074;
                        };
                        var $4057 = $4060;
                        break;
                };
                var $4050 = $4057;
                break;
            case 'e':
                var $4191 = Pair$new$(_bits$3, Litereum$Term$word$(0n));
                var $4050 = $4191;
                break;
        };
        return $4050;
    };
    const Litereum$deserialize$term = x0 => x1 => x2 => Litereum$deserialize$term$(x0, x1, x2);

    function Litereum$deserialize$bond$(_world$1, _bits$2) {
        var self = Litereum$deserialize$name$old$(_world$1, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $4193 = self.fst;
                var $4194 = self.snd;
                var self = Litereum$deserialize$list$(Litereum$deserialize$name$old(_world$1), $4193);
                switch (self._) {
                    case 'Pair.new':
                        var $4196 = self.fst;
                        var $4197 = self.snd;
                        var self = Litereum$deserialize$list$(Litereum$deserialize$type(_world$1), $4196);
                        switch (self._) {
                            case 'Pair.new':
                                var $4199 = self.fst;
                                var $4200 = self.snd;
                                var self = Litereum$deserialize$type$(_world$1, $4199);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $4202 = self.fst;
                                        var $4203 = self.snd;
                                        var self = Litereum$deserialize$term$(_world$1, List$reverse$($4197), $4202);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $4205 = self.fst;
                                                var $4206 = self.snd;
                                                var self = Litereum$deserialize$list$(Litereum$deserialize$name$old(_world$1), $4205);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $4208 = self.fst;
                                                        var $4209 = self.snd;
                                                        var $4210 = Pair$new$($4208, Litereum$Bond$new$($4194, $4197, $4200, $4203, $4206, $4209));
                                                        var $4207 = $4210;
                                                        break;
                                                };
                                                var $4204 = $4207;
                                                break;
                                        };
                                        var $4201 = $4204;
                                        break;
                                };
                                var $4198 = $4201;
                                break;
                        };
                        var $4195 = $4198;
                        break;
                };
                var $4192 = $4195;
                break;
        };
        return $4192;
    };
    const Litereum$deserialize$bond = x0 => x1 => Litereum$deserialize$bond$(x0, x1);

    function Litereum$deserialize$eval$(_world$1, _bits$2) {
        var self = Litereum$deserialize$term$(_world$1, List$nil, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $4212 = self.fst;
                var $4213 = self.snd;
                var self = Litereum$deserialize$type$(_world$1, $4212);
                switch (self._) {
                    case 'Pair.new':
                        var $4215 = self.fst;
                        var $4216 = self.snd;
                        var $4217 = Pair$new$($4215, Litereum$Eval$new$($4213, $4216));
                        var $4214 = $4217;
                        break;
                };
                var $4211 = $4214;
                break;
        };
        return $4211;
    };
    const Litereum$deserialize$eval = x0 => x1 => Litereum$deserialize$eval$(x0, x1);

    function Litereum$deserialize$transaction$(_world$1, _bits$2) {
        var self = Litereum$deserialize$fixlen$(2n, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $4219 = self.fst;
                var $4220 = self.snd;
                var self = ($4220 === 0n);
                if (self) {
                    var self = Litereum$deserialize$name$new$($4219);
                    switch (self._) {
                        case 'Pair.new':
                            var $4223 = self.fst;
                            var $4224 = self.snd;
                            var $4225 = Pair$new$($4223, Litereum$Transaction$new_name$($4224));
                            var $4222 = $4225;
                            break;
                    };
                    var $4221 = $4222;
                } else {
                    var self = ($4220 === 1n);
                    if (self) {
                        var self = Litereum$deserialize$data$(_world$1, $4219);
                        switch (self._) {
                            case 'Pair.new':
                                var $4228 = self.fst;
                                var $4229 = self.snd;
                                var $4230 = Pair$new$($4228, Litereum$Transaction$new_data$($4229));
                                var $4227 = $4230;
                                break;
                        };
                        var $4226 = $4227;
                    } else {
                        var self = ($4220 === 2n);
                        if (self) {
                            var self = Litereum$deserialize$bond$(_world$1, $4219);
                            switch (self._) {
                                case 'Pair.new':
                                    var $4233 = self.fst;
                                    var $4234 = self.snd;
                                    var $4235 = Pair$new$($4233, Litereum$Transaction$new_bond$($4234));
                                    var $4232 = $4235;
                                    break;
                            };
                            var $4231 = $4232;
                        } else {
                            var self = ($4220 === 3n);
                            if (self) {
                                var self = Litereum$deserialize$eval$(_world$1, $4219);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $4238 = self.fst;
                                        var $4239 = self.snd;
                                        var $4240 = Pair$new$($4238, Litereum$Transaction$new_eval$($4239));
                                        var $4237 = $4240;
                                        break;
                                };
                                var $4236 = $4237;
                            } else {
                                var $4241 = Pair$new$($4219, Litereum$Transaction$new_name$(""));
                                var $4236 = $4241;
                            };
                            var $4231 = $4236;
                        };
                        var $4226 = $4231;
                    };
                    var $4221 = $4226;
                };
                var $4218 = $4221;
                break;
        };
        return $4218;
    };
    const Litereum$deserialize$transaction = x0 => x1 => Litereum$deserialize$transaction$(x0, x1);

    function Litereum$deserialize$block$(_world$1, _bits$2) {
        var self = Bits$is_empty$(_bits$2);
        if (self) {
            var $4243 = Pair$new$(Bits$e, List$nil);
            var $4242 = $4243;
        } else {
            var self = Litereum$deserialize$transaction$(_world$1, _bits$2);
            switch (self._) {
                case 'Pair.new':
                    var $4245 = self.fst;
                    var $4246 = self.snd;
                    var self = Litereum$deserialize$block$(Litereum$reg$(_world$1, $4246), $4245);
                    switch (self._) {
                        case 'Pair.new':
                            var $4248 = self.fst;
                            var $4249 = self.snd;
                            var $4250 = Pair$new$($4248, List$cons$($4246, $4249));
                            var $4247 = $4250;
                            break;
                    };
                    var $4244 = $4247;
                    break;
            };
            var $4242 = $4244;
        };
        return $4242;
    };
    const Litereum$deserialize$block = x0 => x1 => Litereum$deserialize$block$(x0, x1);

    function Litereum$show$constructor$(_world$1, _constructor$2) {
        var self = _constructor$2;
        switch (self._) {
            case 'Litereum.Constructor.new':
                var $4252 = self.name;
                var $4253 = self.field_names;
                var $4254 = self.field_types;
                var _names$6 = $4253;
                var _types$7 = List$mapped$($4254, Litereum$show$type(_world$1));
                var _fields$8 = List$zip_with$((_name$8 => _type$9 => {
                    var $4256 = (_name$8 + (": " + _type$9));
                    return $4256;
                }), _names$6, _types$7);
                var $4255 = ($4252 + ("{" + (String$join$(", ", _fields$8) + "}")));
                var $4251 = $4255;
                break;
        };
        return $4251;
    };
    const Litereum$show$constructor = x0 => x1 => Litereum$show$constructor$(x0, x1);

    function Litereum$show$data$(_world$1, _data$2) {
        var self = _data$2;
        switch (self._) {
            case 'Litereum.Data.new':
                var $4258 = self.name;
                var $4259 = self.constructors;
                var $4260 = ($4258 + (" { " + (String$join$(", ", List$mapped$($4259, Litereum$show$constructor(_world$1))) + " }")));
                var $4257 = $4260;
                break;
        };
        return $4257;
    };
    const Litereum$show$data = x0 => x1 => Litereum$show$data$(x0, x1);

    function Litereum$show$bond$(_world$1, _bond$2) {
        var self = _bond$2;
        switch (self._) {
            case 'Litereum.Bond.new':
                var $4262 = self.name;
                var $4263 = self.input_names;
                var $4264 = self.input_types;
                var $4265 = self.output_type;
                var $4266 = self.main;
                var $4267 = self.owners;
                var $4268 = ($4262 + ("(" + (String$join$(",", List$zipped_with$($4263, $4264, (_name$9 => _type$10 => {
                    var $4269 = (_name$9 + (": " + Litereum$show$type$(_world$1, _type$10)));
                    return $4269;
                }))) + ("): " + (Litereum$show$type$(_world$1, $4265) + (" { " + (Litereum$show$term$(_world$1, $4266) + (" }" + (() => {
                    var self = $4267;
                    switch (self._) {
                        case 'List.nil':
                            var $4270 = "";
                            return $4270;
                        case 'List.cons':
                            var $4271 = (" " + String$join$(" ", List$map$(a1 => ("@" + a1), $4267)));
                            return $4271;
                    };
                })()))))))));
                var $4261 = $4268;
                break;
        };
        return $4261;
    };
    const Litereum$show$bond = x0 => x1 => Litereum$show$bond$(x0, x1);

    function Litereum$show$eval$(_world$1, _eval$2) {
        var self = _eval$2;
        switch (self._) {
            case 'Litereum.Eval.new':
                var $4273 = self.term;
                var $4274 = self.type;
                var _term$5 = Litereum$show$term$(_world$1, $4273);
                var _type$6 = Litereum$show$type$(_world$1, $4274);
                var $4275 = ("{" + (_term$5 + ("} : " + _type$6)));
                var $4272 = $4275;
                break;
        };
        return $4272;
    };
    const Litereum$show$eval = x0 => x1 => Litereum$show$eval$(x0, x1);

    function Litereum$show$transaction$(_world$1, _transaction$2) {
        var self = _transaction$2;
        switch (self._) {
            case 'Litereum.Transaction.new_name':
                var $4277 = self.name;
                var $4278 = ("name " + $4277);
                var $4276 = $4278;
                break;
            case 'Litereum.Transaction.new_data':
                var $4279 = self.data;
                var $4280 = ("type " + Litereum$show$data$(_world$1, $4279));
                var $4276 = $4280;
                break;
            case 'Litereum.Transaction.new_bond':
                var $4281 = self.bond;
                var $4282 = ("bond " + Litereum$show$bond$(_world$1, $4281));
                var $4276 = $4282;
                break;
            case 'Litereum.Transaction.new_eval':
                var $4283 = self.eval;
                var $4284 = ("eval " + Litereum$show$eval$(_world$1, $4283));
                var $4276 = $4284;
                break;
        };
        return $4276;
    };
    const Litereum$show$transaction = x0 => x1 => Litereum$show$transaction$(x0, x1);

    function Litereum$show$block$(_world$1, _block$2) {
        var self = _block$2;
        switch (self._) {
            case 'List.cons':
                var $4286 = self.head;
                var $4287 = self.tail;
                var _head$5 = Litereum$show$transaction$(_world$1, $4286);
                var _tail$6 = Litereum$show$block$(Litereum$reg$(_world$1, $4286), $4287);
                var $4288 = ("- " + (_head$5 + ("\u{a}" + _tail$6)));
                var $4285 = $4288;
                break;
            case 'List.nil':
                var $4289 = "";
                var $4285 = $4289;
                break;
        };
        return $4285;
    };
    const Litereum$show$block = x0 => x1 => Litereum$show$block$(x0, x1);

    function Litereum$run_block$(_world$1, _transactions$2) {
        var Litereum$run_block$ = (_world$1, _transactions$2) => ({
            ctr: 'TCO',
            arg: [_world$1, _transactions$2]
        });
        var Litereum$run_block = _world$1 => _transactions$2 => Litereum$run_block$(_world$1, _transactions$2);
        var arg = [_world$1, _transactions$2];
        while (true) {
            let [_world$1, _transactions$2] = arg;
            var R = (() => {
                var self = _transactions$2;
                switch (self._) {
                    case 'List.cons':
                        var $4290 = self.head;
                        var $4291 = self.tail;
                        var self = Litereum$run_transaction$(_world$1, $4290, Bool$false);
                        switch (self._) {
                            case 'Maybe.some':
                                var $4293 = self.value;
                                var $4294 = Litereum$run_block$($4293, $4291);
                                var $4292 = $4294;
                                break;
                            case 'Maybe.none':
                                var $4295 = Maybe$none;
                                var $4292 = $4295;
                                break;
                        };
                        return $4292;
                    case 'List.nil':
                        var $4296 = Maybe$some$(_world$1);
                        return $4296;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Litereum$run_block = x0 => x1 => Litereum$run_block$(x0, x1);

    function Litereum$api$run_block$(_code$1) {
        var _world$2 = Litereum$genesis;
        var self = Parser$run$(Litereum$parse$block$(_world$2), _code$1);
        switch (self._) {
            case 'Maybe.some':
                var $4298 = self.value;
                var $4299 = IO$monad$((_m$bind$4 => _m$pure$5 => {
                    var $4300 = _m$bind$4;
                    return $4300;
                }))(IO$print$("Serialization:"))((_$4 => {
                    var _bits$5 = Litereum$serialize$block$(Litereum$genesis, $4298);
                    var $4301 = IO$monad$((_m$bind$6 => _m$pure$7 => {
                        var $4302 = _m$bind$6;
                        return $4302;
                    }))(IO$print$(("- " + Bits$hex$encode$(_bits$5))))((_$6 => {
                        var $4303 = IO$monad$((_m$bind$7 => _m$pure$8 => {
                            var $4304 = _m$bind$7;
                            return $4304;
                        }))(IO$print$(""))((_$7 => {
                            var $4305 = IO$monad$((_m$bind$8 => _m$pure$9 => {
                                var $4306 = _m$bind$8;
                                return $4306;
                            }))(IO$print$("Deserialization:"))((_$8 => {
                                var self = Litereum$deserialize$block$(Litereum$genesis, _bits$5);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $4308 = self.snd;
                                        var $4309 = IO$monad$((_m$bind$11 => _m$pure$12 => {
                                            var $4310 = _m$bind$11;
                                            return $4310;
                                        }))(IO$print$(Litereum$show$block$(Litereum$genesis, $4308)))((_$11 => {
                                            var $4311 = ((console.log("Evaluation: "), (_$12 => {
                                                var self = Litereum$run_block$(_world$2, $4308);
                                                switch (self._) {
                                                    case 'Maybe.none':
                                                        var $4313 = IO$print$("failed execution");
                                                        var $4312 = $4313;
                                                        break;
                                                    case 'Maybe.some':
                                                        var $4314 = IO$monad$((_m$bind$14 => _m$pure$15 => {
                                                            var $4315 = _m$bind$14;
                                                            return $4315;
                                                        }))(IO$print$(""))((_$14 => {
                                                            var $4316 = IO$print$("Done!");
                                                            return $4316;
                                                        }));
                                                        var $4312 = $4314;
                                                        break;
                                                };
                                                return $4312;
                                            })()));
                                            return $4311;
                                        }));
                                        var $4307 = $4309;
                                        break;
                                };
                                return $4307;
                            }));
                            return $4305;
                        }));
                        return $4303;
                    }));
                    return $4301;
                }));
                var $4297 = $4299;
                break;
            case 'Maybe.none':
                var $4317 = IO$print$("Invalid block syntax.");
                var $4297 = $4317;
                break;
        };
        return $4297;
    };
    const Litereum$api$run_block = x0 => Litereum$api$run_block$(x0);
    const Litereum = (() => {
        var _test$1 = Litereum$api$run_block$("");
        var $4318 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $4319 = _m$pure$3;
            return $4319;
        }))(Unit$new);
        return $4318;
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
        'List.cons': List$cons,
        'Pair': Pair,
        'Pair.new': Pair$new,
        'List.nil': List$nil,
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
        'Litereum.Type.effect': Litereum$Type$effect,
        'Litereum.Type.word': Litereum$Type$word,
        'Litereum.Type.data': Litereum$Type$data,
        'Litereum.parse.type': Litereum$parse$type,
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
        'Litereum.Term.run': Litereum$Term$run,
        'Litereum.parse.term.run': Litereum$parse$term$run,
        'Litereum.Term.return': Litereum$Term$return,
        'Litereum.parse.term.return': Litereum$parse$term$return,
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
        'Litereum.sanitize.many': Litereum$sanitize$many,
        'Triple.new': Triple$new,
        'Litereum.rename': Litereum$rename,
        'Litereum.get_constructors': Litereum$get_constructors,
        'List.for': List$for,
        'Litereum.sanitize.cases': Litereum$sanitize$cases,
        'Triple': Triple,
        'Litereum.rename.many': Litereum$rename$many,
        'Litereum.sanitize': Litereum$sanitize,
        'Litereum.Runtime': Litereum$Runtime,
        'Litereum.Runtime.new': Litereum$Runtime$new,
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
        'Litereum.normalize.bound': Litereum$normalize$bound,
        'Litereum.normalize': Litereum$normalize,
        'Litereum.run': Litereum$run,
        'String.flatten.go': String$flatten$go,
        'String.flatten': String$flatten,
        'String.join.go': String$join$go,
        'String.join': String$join,
        'Litereum.show.type': Litereum$show$type,
        'Word.fold': Word$fold,
        'Word.to_nat': Word$to_nat,
        'Word.show': Word$show,
        'U64.show': U64$show,
        'String.is_empty': String$is_empty,
        'Litereum.show.term': Litereum$show$term,
        'Litereum.run_transaction': Litereum$run_transaction,
        'Litereum.reg': Litereum$reg,
        'Litereum.parse.block': Litereum$parse$block,
        'IO': IO,
        'IO.ask': IO$ask,
        'IO.end': IO$end,
        'IO.put_string': IO$put_string,
        'IO.print': IO$print,
        'IO.bind': IO$bind,
        'IO.monad': IO$monad,
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
        'Litereum.show.constructor': Litereum$show$constructor,
        'Litereum.show.data': Litereum$show$data,
        'Litereum.show.bond': Litereum$show$bond,
        'Litereum.show.eval': Litereum$show$eval,
        'Litereum.show.transaction': Litereum$show$transaction,
        'Litereum.show.block': Litereum$show$block,
        'Litereum.run_block': Litereum$run_block,
        'Litereum.api.run_block': Litereum$api$run_block,
        'Litereum': Litereum,
    };
})();
module.exports['$main$']();