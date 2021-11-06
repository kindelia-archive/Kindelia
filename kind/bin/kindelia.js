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

    function Parser$Reply$(_V$1) {
        var $29 = null;
        return $29;
    };
    const Parser$Reply = x0 => Parser$Reply$(x0);

    function Parser$Reply$error$(_err$2) {
        var $30 = ({
            _: 'Parser.Reply.error',
            'err': _err$2
        });
        return $30;
    };
    const Parser$Reply$error = x0 => Parser$Reply$error$(x0);

    function Parser$Error$new$(_nam$1, _ini$2, _idx$3, _msg$4) {
        var $31 = ({
            _: 'Parser.Error.new',
            'nam': _nam$1,
            'ini': _ini$2,
            'idx': _idx$3,
            'msg': _msg$4
        });
        return $31;
    };
    const Parser$Error$new = x0 => x1 => x2 => x3 => Parser$Error$new$(x0, x1, x2, x3);

    function Parser$Reply$fail$(_nam$2, _ini$3, _idx$4, _msg$5) {
        var $32 = Parser$Reply$error$(Parser$Error$new$(_nam$2, _ini$3, _idx$4, _msg$5));
        return $32;
    };
    const Parser$Reply$fail = x0 => x1 => x2 => x3 => Parser$Reply$fail$(x0, x1, x2, x3);

    function Maybe$some$(_value$2) {
        var $33 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $33;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

    function Maybe$(_A$1) {
        var $34 = null;
        return $34;
    };
    const Maybe = x0 => Maybe$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });
    const Bool$false = false;
    const Bool$true = true;
    const Nat$gtn = a0 => a1 => (a0 > a1);

    function Parser$Error$combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Parser.Error.new':
                var $36 = self.idx;
                var self = _b$2;
                switch (self._) {
                    case 'Parser.Error.new':
                        var $38 = self.idx;
                        var self = ($36 > $38);
                        if (self) {
                            var $40 = _a$1;
                            var $39 = $40;
                        } else {
                            var $41 = _b$2;
                            var $39 = $41;
                        };
                        var $37 = $39;
                        break;
                };
                var $35 = $37;
                break;
        };
        return $35;
    };
    const Parser$Error$combine = x0 => x1 => Parser$Error$combine$(x0, x1);

    function Parser$Error$maybe_combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Maybe.some':
                var $43 = self.value;
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.some':
                        var $45 = self.value;
                        var $46 = Maybe$some$(Parser$Error$combine$($43, $45));
                        var $44 = $46;
                        break;
                    case 'Maybe.none':
                        var $47 = _a$1;
                        var $44 = $47;
                        break;
                };
                var $42 = $44;
                break;
            case 'Maybe.none':
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.none':
                        var $49 = Maybe$none;
                        var $48 = $49;
                        break;
                    case 'Maybe.some':
                        var $50 = _b$2;
                        var $48 = $50;
                        break;
                };
                var $42 = $48;
                break;
        };
        return $42;
    };
    const Parser$Error$maybe_combine = x0 => x1 => Parser$Error$maybe_combine$(x0, x1);

    function Parser$State$new$(_err$1, _nam$2, _ini$3, _idx$4, _str$5) {
        var $51 = ({
            _: 'Parser.State.new',
            'err': _err$1,
            'nam': _nam$2,
            'ini': _ini$3,
            'idx': _idx$4,
            'str': _str$5
        });
        return $51;
    };
    const Parser$State$new = x0 => x1 => x2 => x3 => x4 => Parser$State$new$(x0, x1, x2, x3, x4);

    function Parser$Reply$value$(_pst$2, _val$3) {
        var $52 = ({
            _: 'Parser.Reply.value',
            'pst': _pst$2,
            'val': _val$3
        });
        return $52;
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
                        var $53 = self.err;
                        var $54 = self.nam;
                        var $55 = self.ini;
                        var $56 = self.idx;
                        var $57 = self.str;
                        var self = _pars$2;
                        switch (self._) {
                            case 'List.cons':
                                var $59 = self.head;
                                var $60 = self.tail;
                                var _parsed$11 = $59(_pst$3);
                                var self = _parsed$11;
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $62 = self.err;
                                        var _cur_err$13 = Maybe$some$($62);
                                        var _far_err$14 = Parser$Error$maybe_combine$($53, _cur_err$13);
                                        var _new_pst$15 = Parser$State$new$(_far_err$14, $54, $55, $56, $57);
                                        var $63 = Parser$choice$($60, _new_pst$15);
                                        var $61 = $63;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $64 = self.pst;
                                        var $65 = self.val;
                                        var $66 = Parser$Reply$value$($64, $65);
                                        var $61 = $66;
                                        break;
                                };
                                var $58 = $61;
                                break;
                            case 'List.nil':
                                var self = $53;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $68 = self.value;
                                        var $69 = Parser$Reply$error$($68);
                                        var $67 = $69;
                                        break;
                                    case 'Maybe.none':
                                        var $70 = Parser$Reply$fail$($54, $55, $56, "No parse.");
                                        var $67 = $70;
                                        break;
                                };
                                var $58 = $67;
                                break;
                        };
                        return $58;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$choice = x0 => x1 => Parser$choice$(x0, x1);

    function List$(_A$1) {
        var $71 = null;
        return $71;
    };
    const List = x0 => List$(x0);

    function List$cons$(_head$2, _tail$3) {
        var $72 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $72;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function Parser$(_V$1) {
        var $73 = null;
        return $73;
    };
    const Parser = x0 => Parser$(x0);
    const List$nil = ({
        _: 'List.nil'
    });

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
                                var $75 = self.pst;
                                var $76 = self.val;
                                var $77 = Parser$many$go$(_parse$2, (_xs$12 => {
                                    var $78 = _values$3(List$cons$($76, _xs$12));
                                    return $78;
                                }), $75);
                                var $74 = $77;
                                break;
                            case 'Parser.Reply.error':
                                var $79 = Parser$Reply$value$(_pst$4, _values$3(List$nil));
                                var $74 = $79;
                                break;
                        };
                        return $74;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$many$go = x0 => x1 => x2 => Parser$many$go$(x0, x1, x2);

    function Parser$many$(_parser$2) {
        var $80 = Parser$many$go(_parser$2)((_x$3 => {
            var $81 = _x$3;
            return $81;
        }));
        return $80;
    };
    const Parser$many = x0 => Parser$many$(x0);
    const Unit$new = null;

    function String$cons$(_head$1, _tail$2) {
        var $82 = (String.fromCharCode(_head$1) + _tail$2);
        return $82;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $84 = Bool$false;
                var $83 = $84;
                break;
            case 'Cmp.eql':
                var $85 = Bool$true;
                var $83 = $85;
                break;
        };
        return $83;
    };
    const Cmp$as_eql = x0 => Cmp$as_eql$(x0);
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
                var $87 = self.pred;
                var $88 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $90 = self.pred;
                            var $91 = (_a$pred$10 => {
                                var $92 = Word$cmp$go$(_a$pred$10, $90, _c$4);
                                return $92;
                            });
                            var $89 = $91;
                            break;
                        case 'Word.i':
                            var $93 = self.pred;
                            var $94 = (_a$pred$10 => {
                                var $95 = Word$cmp$go$(_a$pred$10, $93, Cmp$ltn);
                                return $95;
                            });
                            var $89 = $94;
                            break;
                        case 'Word.e':
                            var $96 = (_a$pred$8 => {
                                var $97 = _c$4;
                                return $97;
                            });
                            var $89 = $96;
                            break;
                    };
                    var $89 = $89($87);
                    return $89;
                });
                var $86 = $88;
                break;
            case 'Word.i':
                var $98 = self.pred;
                var $99 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $101 = self.pred;
                            var $102 = (_a$pred$10 => {
                                var $103 = Word$cmp$go$(_a$pred$10, $101, Cmp$gtn);
                                return $103;
                            });
                            var $100 = $102;
                            break;
                        case 'Word.i':
                            var $104 = self.pred;
                            var $105 = (_a$pred$10 => {
                                var $106 = Word$cmp$go$(_a$pred$10, $104, _c$4);
                                return $106;
                            });
                            var $100 = $105;
                            break;
                        case 'Word.e':
                            var $107 = (_a$pred$8 => {
                                var $108 = _c$4;
                                return $108;
                            });
                            var $100 = $107;
                            break;
                    };
                    var $100 = $100($98);
                    return $100;
                });
                var $86 = $99;
                break;
            case 'Word.e':
                var $109 = (_b$5 => {
                    var $110 = _c$4;
                    return $110;
                });
                var $86 = $109;
                break;
        };
        var $86 = $86(_b$3);
        return $86;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $111 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $111;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $112 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $112;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);

    function Nat$succ$(_pred$1) {
        var $113 = 1n + _pred$1;
        return $113;
    };
    const Nat$succ = x0 => Nat$succ$(x0);
    const Nat$zero = 0n;
    const U16$eql = a0 => a1 => (a0 === a1);
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
                        var $114 = self.err;
                        var $115 = self.nam;
                        var $116 = self.ini;
                        var $117 = self.idx;
                        var $118 = self.str;
                        var self = _text$3;
                        if (self.length === 0) {
                            var $120 = Parser$Reply$value$(_pst$4, Unit$new);
                            var $119 = $120;
                        } else {
                            var $121 = self.charCodeAt(0);
                            var $122 = self.slice(1);
                            var self = $118;
                            if (self.length === 0) {
                                var _error_msg$12 = ("Expected \'" + (_ini_txt$2 + "\', found end of file."));
                                var $124 = Parser$Reply$fail$($115, $116, _ini_idx$1, _error_msg$12);
                                var $123 = $124;
                            } else {
                                var $125 = self.charCodeAt(0);
                                var $126 = self.slice(1);
                                var self = ($121 === $125);
                                if (self) {
                                    var _pst$14 = Parser$State$new$($114, $115, $116, Nat$succ$($117), $126);
                                    var $128 = Parser$text$go$(_ini_idx$1, _ini_txt$2, $122, _pst$14);
                                    var $127 = $128;
                                } else {
                                    var _chr$14 = String$cons$($125, String$nil);
                                    var _err$15 = ("Expected \'" + (_ini_txt$2 + ("\', found \'" + (_chr$14 + "\'."))));
                                    var $129 = Parser$Reply$fail$($115, $116, _ini_idx$1, _err$15);
                                    var $127 = $129;
                                };
                                var $123 = $127;
                            };
                            var $119 = $123;
                        };
                        return $119;
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
                var $131 = self.idx;
                var self = Parser$text$go$($131, _text$1, _text$1, _pst$2);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $133 = self.err;
                        var $134 = Parser$Reply$error$($133);
                        var $132 = $134;
                        break;
                    case 'Parser.Reply.value':
                        var $135 = self.pst;
                        var $136 = self.val;
                        var $137 = Parser$Reply$value$($135, $136);
                        var $132 = $137;
                        break;
                };
                var $130 = $132;
                break;
        };
        return $130;
    };
    const Parser$text = x0 => x1 => Parser$text$(x0, x1);

    function Parser$eof$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $139 = self.nam;
                var $140 = self.ini;
                var $141 = self.idx;
                var $142 = self.str;
                var self = $142;
                if (self.length === 0) {
                    var $144 = Parser$Reply$value$(_pst$1, Unit$new);
                    var $143 = $144;
                } else {
                    var $145 = self.charCodeAt(0);
                    var $146 = self.slice(1);
                    var $147 = Parser$Reply$fail$($139, $140, $141, "Expected end-of-file.");
                    var $143 = $147;
                };
                var $138 = $143;
                break;
        };
        return $138;
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
                        var $148 = self.head;
                        var $149 = self.tail;
                        var $150 = List$reverse$go$($149, List$cons$($148, _res$3));
                        return $150;
                    case 'List.nil':
                        var $151 = _res$3;
                        return $151;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);

    function List$reverse$(_xs$2) {
        var $152 = List$reverse$go$(_xs$2, List$nil);
        return $152;
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
                        var $154 = self.err;
                        var _reply$8 = _parse$3(_pst$5);
                        var self = _reply$8;
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $156 = self.err;
                                var $157 = Parser$Reply$error$(Parser$Error$combine$($156, $154));
                                var $155 = $157;
                                break;
                            case 'Parser.Reply.value':
                                var $158 = self.pst;
                                var $159 = self.val;
                                var $160 = Parser$until$go$(_until$2, _parse$3, List$cons$($159, _values$4), $158);
                                var $155 = $160;
                                break;
                        };
                        var $153 = $155;
                        break;
                    case 'Parser.Reply.value':
                        var $161 = self.pst;
                        var $162 = Parser$Reply$value$($161, List$reverse$(_values$4));
                        var $153 = $162;
                        break;
                };
                return $153;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$until$go = x0 => x1 => x2 => x3 => Parser$until$go$(x0, x1, x2, x3);

    function Parser$until$(_until$2, _parse$3) {
        var $163 = Parser$until$go(_until$2)(_parse$3)(List$nil);
        return $163;
    };
    const Parser$until = x0 => x1 => Parser$until$(x0, x1);

    function Parser$one$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $165 = self.err;
                var $166 = self.nam;
                var $167 = self.ini;
                var $168 = self.idx;
                var $169 = self.str;
                var self = $169;
                if (self.length === 0) {
                    var $171 = Parser$Reply$fail$($166, $167, $168, "Unexpected end of file.");
                    var $170 = $171;
                } else {
                    var $172 = self.charCodeAt(0);
                    var $173 = self.slice(1);
                    var _pst$9 = Parser$State$new$($165, $166, $167, Nat$succ$($168), $173);
                    var $174 = Parser$Reply$value$(_pst$9, $172);
                    var $170 = $174;
                };
                var $164 = $170;
                break;
        };
        return $164;
    };
    const Parser$one = x0 => Parser$one$(x0);
    const Kindelia$parse$ignore = Parser$many$(Parser$choice(List$cons$(Parser$text(" "), List$cons$(Parser$text("\u{9}"), List$cons$(Parser$text("\u{d}"), List$cons$(Parser$text("\u{a}"), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $176 = self.err;
                var _reply$7 = Parser$text$("//", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $178 = self.err;
                        var self = $176;
                        switch (self._) {
                            case 'Maybe.some':
                                var $180 = self.value;
                                var $181 = Parser$Reply$error$(Parser$Error$combine$($180, $178));
                                var $179 = $181;
                                break;
                            case 'Maybe.none':
                                var $182 = Parser$Reply$error$($178);
                                var $179 = $182;
                                break;
                        };
                        var $177 = $179;
                        break;
                    case 'Parser.Reply.value':
                        var $183 = self.pst;
                        var self = $183;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $185 = self.err;
                                var $186 = self.nam;
                                var $187 = self.ini;
                                var $188 = self.idx;
                                var $189 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($176, $185), $186, $187, $188, $189);
                                var _end$16 = Parser$choice(List$cons$(Parser$text("\u{a}"), List$cons$(Parser$eof, List$nil)));
                                var self = _reply$pst$15;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $191 = self.err;
                                        var _reply$22 = Parser$until$(_end$16, Parser$one)(_reply$pst$15);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $193 = self.err;
                                                var self = $191;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $195 = self.value;
                                                        var $196 = Parser$Reply$error$(Parser$Error$combine$($195, $193));
                                                        var $194 = $196;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $197 = Parser$Reply$error$($193);
                                                        var $194 = $197;
                                                        break;
                                                };
                                                var $192 = $194;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $198 = self.pst;
                                                var self = $198;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $200 = self.err;
                                                        var $201 = self.nam;
                                                        var $202 = self.ini;
                                                        var $203 = self.idx;
                                                        var $204 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($191, $200), $201, $202, $203, $204);
                                                        var $205 = Parser$Reply$value$(_reply$pst$30, Unit$new);
                                                        var $199 = $205;
                                                        break;
                                                };
                                                var $192 = $199;
                                                break;
                                        };
                                        var $190 = $192;
                                        break;
                                };
                                var $184 = $190;
                                break;
                        };
                        var $177 = $184;
                        break;
                };
                var $175 = $177;
                break;
        };
        return $175;
    }), List$nil)))))));

    function Kindelia$parse$text$(_text$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $207 = self.err;
                var _reply$8 = Kindelia$parse$ignore(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $209 = self.err;
                        var self = $207;
                        switch (self._) {
                            case 'Maybe.some':
                                var $211 = self.value;
                                var $212 = Parser$Reply$error$(Parser$Error$combine$($211, $209));
                                var $210 = $212;
                                break;
                            case 'Maybe.none':
                                var $213 = Parser$Reply$error$($209);
                                var $210 = $213;
                                break;
                        };
                        var $208 = $210;
                        break;
                    case 'Parser.Reply.value':
                        var $214 = self.pst;
                        var self = $214;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $216 = self.err;
                                var $217 = self.nam;
                                var $218 = self.ini;
                                var $219 = self.idx;
                                var $220 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($207, $216), $217, $218, $219, $220);
                                var $221 = Parser$text$(_text$1, _reply$pst$16);
                                var $215 = $221;
                                break;
                        };
                        var $208 = $215;
                        break;
                };
                var $206 = $208;
                break;
        };
        return $206;
    };
    const Kindelia$parse$text = x0 => x1 => Kindelia$parse$text$(x0, x1);

    function Parser$letter$(_is_letter$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $223 = self.err;
                var $224 = self.nam;
                var $225 = self.ini;
                var $226 = self.idx;
                var $227 = self.str;
                var self = $227;
                if (self.length === 0) {
                    var $229 = Parser$Reply$fail$($224, $225, $226, "Unexpected eof.");
                    var $228 = $229;
                } else {
                    var $230 = self.charCodeAt(0);
                    var $231 = self.slice(1);
                    var self = _is_letter$1($230);
                    if (self) {
                        var $233 = Parser$Reply$value$(Parser$State$new$($223, $224, $225, Nat$succ$($226), $231), $230);
                        var $232 = $233;
                    } else {
                        var $234 = Parser$Reply$fail$($224, $225, $226, "Expected letter.");
                        var $232 = $234;
                    };
                    var $228 = $232;
                };
                var $222 = $228;
                break;
        };
        return $222;
    };
    const Parser$letter = x0 => x1 => Parser$letter$(x0, x1);
    const Bool$and = a0 => a1 => (a0 && a1);

    function Cmp$as_lte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $236 = Bool$true;
                var $235 = $236;
                break;
            case 'Cmp.gtn':
                var $237 = Bool$false;
                var $235 = $237;
                break;
        };
        return $235;
    };
    const Cmp$as_lte = x0 => Cmp$as_lte$(x0);

    function Word$lte$(_a$2, _b$3) {
        var $238 = Cmp$as_lte$(Word$cmp$(_a$2, _b$3));
        return $238;
    };
    const Word$lte = x0 => x1 => Word$lte$(x0, x1);
    const U16$lte = a0 => a1 => (a0 <= a1);

    function U16$btw$(_a$1, _b$2, _c$3) {
        var $239 = ((_a$1 <= _b$2) && (_b$2 <= _c$3));
        return $239;
    };
    const U16$btw = x0 => x1 => x2 => U16$btw$(x0, x1, x2);
    const Kindelia$parse$letter = Parser$letter((_chr$1 => {
        var self = U16$btw$(65, _chr$1, 90);
        if (self) {
            var $241 = Bool$true;
            var $240 = $241;
        } else {
            var self = U16$btw$(97, _chr$1, 122);
            if (self) {
                var $243 = Bool$true;
                var $242 = $243;
            } else {
                var self = U16$btw$(48, _chr$1, 57);
                if (self) {
                    var $245 = Bool$true;
                    var $244 = $245;
                } else {
                    var self = (46 === _chr$1);
                    if (self) {
                        var $247 = Bool$true;
                        var $246 = $247;
                    } else {
                        var self = (95 === _chr$1);
                        if (self) {
                            var $249 = Bool$true;
                            var $248 = $249;
                        } else {
                            var self = (94 === _chr$1);
                            if (self) {
                                var $251 = Bool$true;
                                var $250 = $251;
                            } else {
                                var $252 = Bool$false;
                                var $250 = $252;
                            };
                            var $248 = $250;
                        };
                        var $246 = $248;
                    };
                    var $244 = $246;
                };
                var $242 = $244;
            };
            var $240 = $242;
        };
        return $240;
    }));

    function List$fold$(_list$2, _nil$4, _cons$5) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $254 = self.head;
                var $255 = self.tail;
                var $256 = _cons$5($254)(List$fold$($255, _nil$4, _cons$5));
                var $253 = $256;
                break;
            case 'List.nil':
                var $257 = _nil$4;
                var $253 = $257;
                break;
        };
        return $253;
    };
    const List$fold = x0 => x1 => x2 => List$fold$(x0, x1, x2);

    function Kindelia$parse$name$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $259 = self.err;
                var _reply$7 = Kindelia$parse$ignore(_pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $261 = self.err;
                        var self = $259;
                        switch (self._) {
                            case 'Maybe.some':
                                var $263 = self.value;
                                var $264 = Parser$Reply$error$(Parser$Error$combine$($263, $261));
                                var $262 = $264;
                                break;
                            case 'Maybe.none':
                                var $265 = Parser$Reply$error$($261);
                                var $262 = $265;
                                break;
                        };
                        var $260 = $262;
                        break;
                    case 'Parser.Reply.value':
                        var $266 = self.pst;
                        var self = $266;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $268 = self.err;
                                var $269 = self.nam;
                                var $270 = self.ini;
                                var $271 = self.idx;
                                var $272 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($259, $268), $269, $270, $271, $272);
                                var self = _reply$pst$15;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $274 = self.err;
                                        var _reply$21 = Kindelia$parse$letter(_reply$pst$15);
                                        var self = _reply$21;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $276 = self.err;
                                                var self = $274;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $278 = self.value;
                                                        var $279 = Parser$Reply$error$(Parser$Error$combine$($278, $276));
                                                        var $277 = $279;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $280 = Parser$Reply$error$($276);
                                                        var $277 = $280;
                                                        break;
                                                };
                                                var $275 = $277;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $281 = self.pst;
                                                var $282 = self.val;
                                                var self = $281;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $284 = self.err;
                                                        var $285 = self.nam;
                                                        var $286 = self.ini;
                                                        var $287 = self.idx;
                                                        var $288 = self.str;
                                                        var _reply$pst$29 = Parser$State$new$(Parser$Error$maybe_combine$($274, $284), $285, $286, $287, $288);
                                                        var self = _reply$pst$29;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $290 = self.err;
                                                                var _reply$35 = Parser$many$(Kindelia$parse$letter)(_reply$pst$29);
                                                                var self = _reply$35;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $292 = self.err;
                                                                        var self = $290;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $294 = self.value;
                                                                                var $295 = Parser$Reply$error$(Parser$Error$combine$($294, $292));
                                                                                var $293 = $295;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $296 = Parser$Reply$error$($292);
                                                                                var $293 = $296;
                                                                                break;
                                                                        };
                                                                        var $291 = $293;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $297 = self.pst;
                                                                        var $298 = self.val;
                                                                        var self = $297;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $300 = self.err;
                                                                                var $301 = self.nam;
                                                                                var $302 = self.ini;
                                                                                var $303 = self.idx;
                                                                                var $304 = self.str;
                                                                                var _reply$pst$43 = Parser$State$new$(Parser$Error$maybe_combine$($290, $300), $301, $302, $303, $304);
                                                                                var $305 = Parser$Reply$value$(_reply$pst$43, String$cons$($282, List$fold$($298, String$nil, String$cons)));
                                                                                var $299 = $305;
                                                                                break;
                                                                        };
                                                                        var $291 = $299;
                                                                        break;
                                                                };
                                                                var $289 = $291;
                                                                break;
                                                        };
                                                        var $283 = $289;
                                                        break;
                                                };
                                                var $275 = $283;
                                                break;
                                        };
                                        var $273 = $275;
                                        break;
                                };
                                var $267 = $273;
                                break;
                        };
                        var $260 = $267;
                        break;
                };
                var $258 = $260;
                break;
        };
        return $258;
    };
    const Kindelia$parse$name = x0 => Kindelia$parse$name$(x0);

    function Parser$wrap$(_opens$2, _parse$3, _close$4, _pst$5) {
        var self = _pst$5;
        switch (self._) {
            case 'Parser.State.new':
                var $307 = self.err;
                var _reply$11 = _opens$2(_pst$5);
                var self = _reply$11;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $309 = self.err;
                        var self = $307;
                        switch (self._) {
                            case 'Maybe.some':
                                var $311 = self.value;
                                var $312 = Parser$Reply$error$(Parser$Error$combine$($311, $309));
                                var $310 = $312;
                                break;
                            case 'Maybe.none':
                                var $313 = Parser$Reply$error$($309);
                                var $310 = $313;
                                break;
                        };
                        var $308 = $310;
                        break;
                    case 'Parser.Reply.value':
                        var $314 = self.pst;
                        var self = $314;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $316 = self.err;
                                var $317 = self.nam;
                                var $318 = self.ini;
                                var $319 = self.idx;
                                var $320 = self.str;
                                var _reply$pst$19 = Parser$State$new$(Parser$Error$maybe_combine$($307, $316), $317, $318, $319, $320);
                                var $321 = Parser$until$(_close$4, _parse$3)(_reply$pst$19);
                                var $315 = $321;
                                break;
                        };
                        var $308 = $315;
                        break;
                };
                var $306 = $308;
                break;
        };
        return $306;
    };
    const Parser$wrap = x0 => x1 => x2 => x3 => Parser$wrap$(x0, x1, x2, x3);

    function Pair$(_A$1, _B$2) {
        var $322 = null;
        return $322;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Parser$maybe$(_parse$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var self = _parse$2(_pst$3);
                switch (self._) {
                    case 'Parser.Reply.value':
                        var $325 = self.pst;
                        var $326 = self.val;
                        var $327 = Parser$Reply$value$($325, Maybe$some$($326));
                        var $324 = $327;
                        break;
                    case 'Parser.Reply.error':
                        var $328 = Parser$Reply$value$(_pst$3, Maybe$none);
                        var $324 = $328;
                        break;
                };
                var $323 = $324;
                break;
        };
        return $323;
    };
    const Parser$maybe = x0 => x1 => Parser$maybe$(x0, x1);
    const Kindelia$Type$word = ({
        _: 'Kindelia.Type.word'
    });

    function Kindelia$Type$data$(_name$1) {
        var $329 = ({
            _: 'Kindelia.Type.data',
            'name': _name$1
        });
        return $329;
    };
    const Kindelia$Type$data = x0 => Kindelia$Type$data$(x0);

    function Kindelia$parse$type$(_world$1) {
        var $330 = Parser$choice(List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $332 = self.err;
                    var _reply$8 = Kindelia$parse$text$("#word", _pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $334 = self.err;
                            var self = $332;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $336 = self.value;
                                    var $337 = Parser$Reply$error$(Parser$Error$combine$($336, $334));
                                    var $335 = $337;
                                    break;
                                case 'Maybe.none':
                                    var $338 = Parser$Reply$error$($334);
                                    var $335 = $338;
                                    break;
                            };
                            var $333 = $335;
                            break;
                        case 'Parser.Reply.value':
                            var $339 = self.pst;
                            var self = $339;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $341 = self.err;
                                    var $342 = self.nam;
                                    var $343 = self.ini;
                                    var $344 = self.idx;
                                    var $345 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($332, $341), $342, $343, $344, $345);
                                    var $346 = Parser$Reply$value$(_reply$pst$16, Kindelia$Type$word);
                                    var $340 = $346;
                                    break;
                            };
                            var $333 = $340;
                            break;
                    };
                    var $331 = $333;
                    break;
            };
            return $331;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $348 = self.err;
                    var _reply$8 = Kindelia$parse$name$(_pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $350 = self.err;
                            var self = $348;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $352 = self.value;
                                    var $353 = Parser$Reply$error$(Parser$Error$combine$($352, $350));
                                    var $351 = $353;
                                    break;
                                case 'Maybe.none':
                                    var $354 = Parser$Reply$error$($350);
                                    var $351 = $354;
                                    break;
                            };
                            var $349 = $351;
                            break;
                        case 'Parser.Reply.value':
                            var $355 = self.pst;
                            var $356 = self.val;
                            var self = $355;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $358 = self.err;
                                    var $359 = self.nam;
                                    var $360 = self.ini;
                                    var $361 = self.idx;
                                    var $362 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($348, $358), $359, $360, $361, $362);
                                    var $363 = Parser$Reply$value$(_reply$pst$16, Kindelia$Type$data$($356));
                                    var $357 = $363;
                                    break;
                            };
                            var $349 = $357;
                            break;
                    };
                    var $347 = $349;
                    break;
            };
            return $347;
        }), List$nil)));
        return $330;
    };
    const Kindelia$parse$type = x0 => Kindelia$parse$type$(x0);

    function Pair$new$(_fst$3, _snd$4) {
        var $364 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $364;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Kindelia$parse$ann$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $366 = self.err;
                var _reply$8 = Parser$maybe$(Kindelia$parse$text(","), _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $368 = self.err;
                        var self = $366;
                        switch (self._) {
                            case 'Maybe.some':
                                var $370 = self.value;
                                var $371 = Parser$Reply$error$(Parser$Error$combine$($370, $368));
                                var $369 = $371;
                                break;
                            case 'Maybe.none':
                                var $372 = Parser$Reply$error$($368);
                                var $369 = $372;
                                break;
                        };
                        var $367 = $369;
                        break;
                    case 'Parser.Reply.value':
                        var $373 = self.pst;
                        var self = $373;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $375 = self.err;
                                var $376 = self.nam;
                                var $377 = self.ini;
                                var $378 = self.idx;
                                var $379 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($366, $375), $376, $377, $378, $379);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $381 = self.err;
                                        var _reply$22 = Kindelia$parse$name$(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $383 = self.err;
                                                var self = $381;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $385 = self.value;
                                                        var $386 = Parser$Reply$error$(Parser$Error$combine$($385, $383));
                                                        var $384 = $386;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $387 = Parser$Reply$error$($383);
                                                        var $384 = $387;
                                                        break;
                                                };
                                                var $382 = $384;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $388 = self.pst;
                                                var $389 = self.val;
                                                var self = $388;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $391 = self.err;
                                                        var $392 = self.nam;
                                                        var $393 = self.ini;
                                                        var $394 = self.idx;
                                                        var $395 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($381, $391), $392, $393, $394, $395);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $397 = self.err;
                                                                var _reply$36 = Kindelia$parse$text$(":", _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $399 = self.err;
                                                                        var self = $397;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $401 = self.value;
                                                                                var $402 = Parser$Reply$error$(Parser$Error$combine$($401, $399));
                                                                                var $400 = $402;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $403 = Parser$Reply$error$($399);
                                                                                var $400 = $403;
                                                                                break;
                                                                        };
                                                                        var $398 = $400;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $404 = self.pst;
                                                                        var self = $404;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $406 = self.err;
                                                                                var $407 = self.nam;
                                                                                var $408 = self.ini;
                                                                                var $409 = self.idx;
                                                                                var $410 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($397, $406), $407, $408, $409, $410);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $412 = self.err;
                                                                                        var _reply$50 = Kindelia$parse$type$(_world$1)(_reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $414 = self.err;
                                                                                                var self = $412;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $416 = self.value;
                                                                                                        var $417 = Parser$Reply$error$(Parser$Error$combine$($416, $414));
                                                                                                        var $415 = $417;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $418 = Parser$Reply$error$($414);
                                                                                                        var $415 = $418;
                                                                                                        break;
                                                                                                };
                                                                                                var $413 = $415;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $419 = self.pst;
                                                                                                var $420 = self.val;
                                                                                                var self = $419;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $422 = self.err;
                                                                                                        var $423 = self.nam;
                                                                                                        var $424 = self.ini;
                                                                                                        var $425 = self.idx;
                                                                                                        var $426 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($412, $422), $423, $424, $425, $426);
                                                                                                        var $427 = Parser$Reply$value$(_reply$pst$58, Pair$new$($389, $420));
                                                                                                        var $421 = $427;
                                                                                                        break;
                                                                                                };
                                                                                                var $413 = $421;
                                                                                                break;
                                                                                        };
                                                                                        var $411 = $413;
                                                                                        break;
                                                                                };
                                                                                var $405 = $411;
                                                                                break;
                                                                        };
                                                                        var $398 = $405;
                                                                        break;
                                                                };
                                                                var $396 = $398;
                                                                break;
                                                        };
                                                        var $390 = $396;
                                                        break;
                                                };
                                                var $382 = $390;
                                                break;
                                        };
                                        var $380 = $382;
                                        break;
                                };
                                var $374 = $380;
                                break;
                        };
                        var $367 = $374;
                        break;
                };
                var $365 = $367;
                break;
        };
        return $365;
    };
    const Kindelia$parse$ann = x0 => x1 => Kindelia$parse$ann$(x0, x1);

    function Kindelia$Constructor$new$(_name$1, _args$2) {
        var $428 = ({
            _: 'Kindelia.Constructor.new',
            'name': _name$1,
            'args': _args$2
        });
        return $428;
    };
    const Kindelia$Constructor$new = x0 => x1 => Kindelia$Constructor$new$(x0, x1);

    function Kindelia$parse$constructor$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $430 = self.err;
                var _reply$8 = Kindelia$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $432 = self.err;
                        var self = $430;
                        switch (self._) {
                            case 'Maybe.some':
                                var $434 = self.value;
                                var $435 = Parser$Reply$error$(Parser$Error$combine$($434, $432));
                                var $433 = $435;
                                break;
                            case 'Maybe.none':
                                var $436 = Parser$Reply$error$($432);
                                var $433 = $436;
                                break;
                        };
                        var $431 = $433;
                        break;
                    case 'Parser.Reply.value':
                        var $437 = self.pst;
                        var $438 = self.val;
                        var self = $437;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $440 = self.err;
                                var $441 = self.nam;
                                var $442 = self.ini;
                                var $443 = self.idx;
                                var $444 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($430, $440), $441, $442, $443, $444);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $446 = self.err;
                                        var _reply$22 = Parser$wrap$(Kindelia$parse$text("{"), Kindelia$parse$ann(_world$1), Kindelia$parse$text("}"), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $448 = self.err;
                                                var self = $446;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $450 = self.value;
                                                        var $451 = Parser$Reply$error$(Parser$Error$combine$($450, $448));
                                                        var $449 = $451;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $452 = Parser$Reply$error$($448);
                                                        var $449 = $452;
                                                        break;
                                                };
                                                var $447 = $449;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $453 = self.pst;
                                                var $454 = self.val;
                                                var self = $453;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $456 = self.err;
                                                        var $457 = self.nam;
                                                        var $458 = self.ini;
                                                        var $459 = self.idx;
                                                        var $460 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($446, $456), $457, $458, $459, $460);
                                                        var $461 = Parser$Reply$value$(_reply$pst$30, Kindelia$Constructor$new$($438, $454));
                                                        var $455 = $461;
                                                        break;
                                                };
                                                var $447 = $455;
                                                break;
                                        };
                                        var $445 = $447;
                                        break;
                                };
                                var $439 = $445;
                                break;
                        };
                        var $431 = $439;
                        break;
                };
                var $429 = $431;
                break;
        };
        return $429;
    };
    const Kindelia$parse$constructor = x0 => x1 => Kindelia$parse$constructor$(x0, x1);

    function Kindelia$Data$new$(_name$1, _constructors$2) {
        var $462 = ({
            _: 'Kindelia.Data.new',
            'name': _name$1,
            'constructors': _constructors$2
        });
        return $462;
    };
    const Kindelia$Data$new = x0 => x1 => Kindelia$Data$new$(x0, x1);

    function Kindelia$parse$data$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $464 = self.err;
                var _reply$8 = Kindelia$parse$text$("type", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $466 = self.err;
                        var self = $464;
                        switch (self._) {
                            case 'Maybe.some':
                                var $468 = self.value;
                                var $469 = Parser$Reply$error$(Parser$Error$combine$($468, $466));
                                var $467 = $469;
                                break;
                            case 'Maybe.none':
                                var $470 = Parser$Reply$error$($466);
                                var $467 = $470;
                                break;
                        };
                        var $465 = $467;
                        break;
                    case 'Parser.Reply.value':
                        var $471 = self.pst;
                        var self = $471;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $473 = self.err;
                                var $474 = self.nam;
                                var $475 = self.ini;
                                var $476 = self.idx;
                                var $477 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($464, $473), $474, $475, $476, $477);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $479 = self.err;
                                        var _reply$22 = Kindelia$parse$name$(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $481 = self.err;
                                                var self = $479;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $483 = self.value;
                                                        var $484 = Parser$Reply$error$(Parser$Error$combine$($483, $481));
                                                        var $482 = $484;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $485 = Parser$Reply$error$($481);
                                                        var $482 = $485;
                                                        break;
                                                };
                                                var $480 = $482;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $486 = self.pst;
                                                var $487 = self.val;
                                                var self = $486;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $489 = self.err;
                                                        var $490 = self.nam;
                                                        var $491 = self.ini;
                                                        var $492 = self.idx;
                                                        var $493 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($479, $489), $490, $491, $492, $493);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $495 = self.err;
                                                                var _reply$36 = Parser$wrap$(Kindelia$parse$text("{"), (_pst$36 => {
                                                                    var self = _pst$36;
                                                                    switch (self._) {
                                                                        case 'Parser.State.new':
                                                                            var $498 = self.err;
                                                                            var _reply$42 = Kindelia$parse$constructor$(_world$1, _pst$36);
                                                                            var self = _reply$42;
                                                                            switch (self._) {
                                                                                case 'Parser.Reply.error':
                                                                                    var $500 = self.err;
                                                                                    var self = $498;
                                                                                    switch (self._) {
                                                                                        case 'Maybe.some':
                                                                                            var $502 = self.value;
                                                                                            var $503 = Parser$Reply$error$(Parser$Error$combine$($502, $500));
                                                                                            var $501 = $503;
                                                                                            break;
                                                                                        case 'Maybe.none':
                                                                                            var $504 = Parser$Reply$error$($500);
                                                                                            var $501 = $504;
                                                                                            break;
                                                                                    };
                                                                                    var $499 = $501;
                                                                                    break;
                                                                                case 'Parser.Reply.value':
                                                                                    var $505 = self.pst;
                                                                                    var $506 = self.val;
                                                                                    var self = $505;
                                                                                    switch (self._) {
                                                                                        case 'Parser.State.new':
                                                                                            var $508 = self.err;
                                                                                            var $509 = self.nam;
                                                                                            var $510 = self.ini;
                                                                                            var $511 = self.idx;
                                                                                            var $512 = self.str;
                                                                                            var _reply$pst$50 = Parser$State$new$(Parser$Error$maybe_combine$($498, $508), $509, $510, $511, $512);
                                                                                            var self = _reply$pst$50;
                                                                                            switch (self._) {
                                                                                                case 'Parser.State.new':
                                                                                                    var $514 = self.err;
                                                                                                    var _reply$56 = Parser$maybe$(Kindelia$parse$text(","), _reply$pst$50);
                                                                                                    var self = _reply$56;
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
                                                                                                                    var _reply$pst$64 = Parser$State$new$(Parser$Error$maybe_combine$($514, $523), $524, $525, $526, $527);
                                                                                                                    var $528 = Parser$Reply$value$(_reply$pst$64, $506);
                                                                                                                    var $522 = $528;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $515 = $522;
                                                                                                            break;
                                                                                                    };
                                                                                                    var $513 = $515;
                                                                                                    break;
                                                                                            };
                                                                                            var $507 = $513;
                                                                                            break;
                                                                                    };
                                                                                    var $499 = $507;
                                                                                    break;
                                                                            };
                                                                            var $497 = $499;
                                                                            break;
                                                                    };
                                                                    return $497;
                                                                }), Kindelia$parse$text("}"), _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $529 = self.err;
                                                                        var self = $495;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $531 = self.value;
                                                                                var $532 = Parser$Reply$error$(Parser$Error$combine$($531, $529));
                                                                                var $530 = $532;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $533 = Parser$Reply$error$($529);
                                                                                var $530 = $533;
                                                                                break;
                                                                        };
                                                                        var $496 = $530;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $534 = self.pst;
                                                                        var $535 = self.val;
                                                                        var self = $534;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $537 = self.err;
                                                                                var $538 = self.nam;
                                                                                var $539 = self.ini;
                                                                                var $540 = self.idx;
                                                                                var $541 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($495, $537), $538, $539, $540, $541);
                                                                                var $542 = Parser$Reply$value$(_reply$pst$44, Kindelia$Data$new$($487, $535));
                                                                                var $536 = $542;
                                                                                break;
                                                                        };
                                                                        var $496 = $536;
                                                                        break;
                                                                };
                                                                var $494 = $496;
                                                                break;
                                                        };
                                                        var $488 = $494;
                                                        break;
                                                };
                                                var $480 = $488;
                                                break;
                                        };
                                        var $478 = $480;
                                        break;
                                };
                                var $472 = $478;
                                break;
                        };
                        var $465 = $472;
                        break;
                };
                var $463 = $465;
                break;
        };
        return $463;
    };
    const Kindelia$parse$data = x0 => x1 => Kindelia$parse$data$(x0, x1);

    function Kindelia$Transaction$new_data$(_data$1) {
        var $543 = ({
            _: 'Kindelia.Transaction.new_data',
            'data': _data$1
        });
        return $543;
    };
    const Kindelia$Transaction$new_data = x0 => Kindelia$Transaction$new_data$(x0);

    function Kindelia$Term$let$(_name$1, _type$2, _expr$3, _body$4) {
        var $544 = ({
            _: 'Kindelia.Term.let',
            'name': _name$1,
            'type': _type$2,
            'expr': _expr$3,
            'body': _body$4
        });
        return $544;
    };
    const Kindelia$Term$let = x0 => x1 => x2 => x3 => Kindelia$Term$let$(x0, x1, x2, x3);

    function Kindelia$parse$term$let$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $546 = self.err;
                var _reply$8 = Kindelia$parse$text$("let", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $548 = self.err;
                        var self = $546;
                        switch (self._) {
                            case 'Maybe.some':
                                var $550 = self.value;
                                var $551 = Parser$Reply$error$(Parser$Error$combine$($550, $548));
                                var $549 = $551;
                                break;
                            case 'Maybe.none':
                                var $552 = Parser$Reply$error$($548);
                                var $549 = $552;
                                break;
                        };
                        var $547 = $549;
                        break;
                    case 'Parser.Reply.value':
                        var $553 = self.pst;
                        var self = $553;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $555 = self.err;
                                var $556 = self.nam;
                                var $557 = self.ini;
                                var $558 = self.idx;
                                var $559 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($546, $555), $556, $557, $558, $559);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $561 = self.err;
                                        var _reply$22 = Kindelia$parse$name$(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $563 = self.err;
                                                var self = $561;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $565 = self.value;
                                                        var $566 = Parser$Reply$error$(Parser$Error$combine$($565, $563));
                                                        var $564 = $566;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $567 = Parser$Reply$error$($563);
                                                        var $564 = $567;
                                                        break;
                                                };
                                                var $562 = $564;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $568 = self.pst;
                                                var $569 = self.val;
                                                var self = $568;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $571 = self.err;
                                                        var $572 = self.nam;
                                                        var $573 = self.ini;
                                                        var $574 = self.idx;
                                                        var $575 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($561, $571), $572, $573, $574, $575);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $577 = self.err;
                                                                var _reply$36 = Kindelia$parse$text$(":", _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $579 = self.err;
                                                                        var self = $577;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $581 = self.value;
                                                                                var $582 = Parser$Reply$error$(Parser$Error$combine$($581, $579));
                                                                                var $580 = $582;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $583 = Parser$Reply$error$($579);
                                                                                var $580 = $583;
                                                                                break;
                                                                        };
                                                                        var $578 = $580;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $584 = self.pst;
                                                                        var self = $584;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $586 = self.err;
                                                                                var $587 = self.nam;
                                                                                var $588 = self.ini;
                                                                                var $589 = self.idx;
                                                                                var $590 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($577, $586), $587, $588, $589, $590);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $592 = self.err;
                                                                                        var _reply$50 = Kindelia$parse$type$(_world$1)(_reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $594 = self.err;
                                                                                                var self = $592;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $596 = self.value;
                                                                                                        var $597 = Parser$Reply$error$(Parser$Error$combine$($596, $594));
                                                                                                        var $595 = $597;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $598 = Parser$Reply$error$($594);
                                                                                                        var $595 = $598;
                                                                                                        break;
                                                                                                };
                                                                                                var $593 = $595;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $599 = self.pst;
                                                                                                var $600 = self.val;
                                                                                                var self = $599;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $602 = self.err;
                                                                                                        var $603 = self.nam;
                                                                                                        var $604 = self.ini;
                                                                                                        var $605 = self.idx;
                                                                                                        var $606 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($592, $602), $603, $604, $605, $606);
                                                                                                        var self = _reply$pst$58;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $608 = self.err;
                                                                                                                var _reply$64 = Kindelia$parse$text$("=", _reply$pst$58);
                                                                                                                var self = _reply$64;
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $610 = self.err;
                                                                                                                        var self = $608;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Maybe.some':
                                                                                                                                var $612 = self.value;
                                                                                                                                var $613 = Parser$Reply$error$(Parser$Error$combine$($612, $610));
                                                                                                                                var $611 = $613;
                                                                                                                                break;
                                                                                                                            case 'Maybe.none':
                                                                                                                                var $614 = Parser$Reply$error$($610);
                                                                                                                                var $611 = $614;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $609 = $611;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $615 = self.pst;
                                                                                                                        var self = $615;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $617 = self.err;
                                                                                                                                var $618 = self.nam;
                                                                                                                                var $619 = self.ini;
                                                                                                                                var $620 = self.idx;
                                                                                                                                var $621 = self.str;
                                                                                                                                var _reply$pst$72 = Parser$State$new$(Parser$Error$maybe_combine$($608, $617), $618, $619, $620, $621);
                                                                                                                                var self = _reply$pst$72;
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.State.new':
                                                                                                                                        var $623 = self.err;
                                                                                                                                        var _reply$78 = Kindelia$parse$term$(_world$1)(_reply$pst$72);
                                                                                                                                        var self = _reply$78;
                                                                                                                                        switch (self._) {
                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                var $625 = self.err;
                                                                                                                                                var self = $623;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                        var $627 = self.value;
                                                                                                                                                        var $628 = Parser$Reply$error$(Parser$Error$combine$($627, $625));
                                                                                                                                                        var $626 = $628;
                                                                                                                                                        break;
                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                        var $629 = Parser$Reply$error$($625);
                                                                                                                                                        var $626 = $629;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $624 = $626;
                                                                                                                                                break;
                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                var $630 = self.pst;
                                                                                                                                                var $631 = self.val;
                                                                                                                                                var self = $630;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                        var $633 = self.err;
                                                                                                                                                        var $634 = self.nam;
                                                                                                                                                        var $635 = self.ini;
                                                                                                                                                        var $636 = self.idx;
                                                                                                                                                        var $637 = self.str;
                                                                                                                                                        var _reply$pst$86 = Parser$State$new$(Parser$Error$maybe_combine$($623, $633), $634, $635, $636, $637);
                                                                                                                                                        var self = _reply$pst$86;
                                                                                                                                                        switch (self._) {
                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                var $639 = self.err;
                                                                                                                                                                var _reply$92 = Parser$maybe$(Kindelia$parse$text(";"), _reply$pst$86);
                                                                                                                                                                var self = _reply$92;
                                                                                                                                                                switch (self._) {
                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                        var $641 = self.err;
                                                                                                                                                                        var self = $639;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                var $643 = self.value;
                                                                                                                                                                                var $644 = Parser$Reply$error$(Parser$Error$combine$($643, $641));
                                                                                                                                                                                var $642 = $644;
                                                                                                                                                                                break;
                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                var $645 = Parser$Reply$error$($641);
                                                                                                                                                                                var $642 = $645;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $640 = $642;
                                                                                                                                                                        break;
                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                        var $646 = self.pst;
                                                                                                                                                                        var self = $646;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                var $648 = self.err;
                                                                                                                                                                                var $649 = self.nam;
                                                                                                                                                                                var $650 = self.ini;
                                                                                                                                                                                var $651 = self.idx;
                                                                                                                                                                                var $652 = self.str;
                                                                                                                                                                                var _reply$pst$100 = Parser$State$new$(Parser$Error$maybe_combine$($639, $648), $649, $650, $651, $652);
                                                                                                                                                                                var self = _reply$pst$100;
                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                        var $654 = self.err;
                                                                                                                                                                                        var _reply$106 = Kindelia$parse$term$(_world$1)(_reply$pst$100);
                                                                                                                                                                                        var self = _reply$106;
                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                                                                var $656 = self.err;
                                                                                                                                                                                                var self = $654;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                                                                        var $658 = self.value;
                                                                                                                                                                                                        var $659 = Parser$Reply$error$(Parser$Error$combine$($658, $656));
                                                                                                                                                                                                        var $657 = $659;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                                                                        var $660 = Parser$Reply$error$($656);
                                                                                                                                                                                                        var $657 = $660;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $655 = $657;
                                                                                                                                                                                                break;
                                                                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                                                                var $661 = self.pst;
                                                                                                                                                                                                var $662 = self.val;
                                                                                                                                                                                                var self = $661;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                        var $664 = self.err;
                                                                                                                                                                                                        var $665 = self.nam;
                                                                                                                                                                                                        var $666 = self.ini;
                                                                                                                                                                                                        var $667 = self.idx;
                                                                                                                                                                                                        var $668 = self.str;
                                                                                                                                                                                                        var _reply$pst$114 = Parser$State$new$(Parser$Error$maybe_combine$($654, $664), $665, $666, $667, $668);
                                                                                                                                                                                                        var $669 = Parser$Reply$value$(_reply$pst$114, Kindelia$Term$let$($569, $600, $631, $662));
                                                                                                                                                                                                        var $663 = $669;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $655 = $663;
                                                                                                                                                                                                break;
                                                                                                                                                                                        };
                                                                                                                                                                                        var $653 = $655;
                                                                                                                                                                                        break;
                                                                                                                                                                                };
                                                                                                                                                                                var $647 = $653;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $640 = $647;
                                                                                                                                                                        break;
                                                                                                                                                                };
                                                                                                                                                                var $638 = $640;
                                                                                                                                                                break;
                                                                                                                                                        };
                                                                                                                                                        var $632 = $638;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $624 = $632;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $622 = $624;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $616 = $622;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $609 = $616;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $607 = $609;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $601 = $607;
                                                                                                        break;
                                                                                                };
                                                                                                var $593 = $601;
                                                                                                break;
                                                                                        };
                                                                                        var $591 = $593;
                                                                                        break;
                                                                                };
                                                                                var $585 = $591;
                                                                                break;
                                                                        };
                                                                        var $578 = $585;
                                                                        break;
                                                                };
                                                                var $576 = $578;
                                                                break;
                                                        };
                                                        var $570 = $576;
                                                        break;
                                                };
                                                var $562 = $570;
                                                break;
                                        };
                                        var $560 = $562;
                                        break;
                                };
                                var $554 = $560;
                                break;
                        };
                        var $547 = $554;
                        break;
                };
                var $545 = $547;
                break;
        };
        return $545;
    };
    const Kindelia$parse$term$let = x0 => x1 => Kindelia$parse$term$let$(x0, x1);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $671 = self.value;
                var $672 = _f$4($671);
                var $670 = $672;
                break;
            case 'Maybe.none':
                var $673 = Maybe$none;
                var $670 = $673;
                break;
        };
        return $670;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);

    function Maybe$monad$(_new$2) {
        var $674 = _new$2(Maybe$bind)(Maybe$some);
        return $674;
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
                        var $675 = self.key;
                        var $676 = self.val;
                        var $677 = self.left;
                        var $678 = self.right;
                        var self = _cmp$3(_key$4)($675);
                        switch (self._) {
                            case 'Cmp.ltn':
                                var $680 = BBT$lookup$(_cmp$3, _key$4, $677);
                                var $679 = $680;
                                break;
                            case 'Cmp.eql':
                                var $681 = Maybe$some$($676);
                                var $679 = $681;
                                break;
                            case 'Cmp.gtn':
                                var $682 = BBT$lookup$(_cmp$3, _key$4, $678);
                                var $679 = $682;
                                break;
                        };
                        return $679;
                    case 'BBT.tip':
                        var $683 = Maybe$none;
                        return $683;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BBT$lookup = x0 => x1 => x2 => BBT$lookup$(x0, x1, x2);

    function Cmp$as_ltn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $685 = Bool$true;
                var $684 = $685;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $686 = Bool$false;
                var $684 = $686;
                break;
        };
        return $684;
    };
    const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);

    function Word$ltn$(_a$2, _b$3) {
        var $687 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
        return $687;
    };
    const Word$ltn = x0 => x1 => Word$ltn$(x0, x1);
    const U16$ltn = a0 => a1 => (a0 < a1);

    function U16$cmp$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $689 = Cmp$ltn;
            var $688 = $689;
        } else {
            var self = (_a$1 === _b$2);
            if (self) {
                var $691 = Cmp$eql;
                var $690 = $691;
            } else {
                var $692 = Cmp$gtn;
                var $690 = $692;
            };
            var $688 = $690;
        };
        return $688;
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
                        var $694 = Cmp$eql;
                        var $693 = $694;
                    } else {
                        var $695 = self.charCodeAt(0);
                        var $696 = self.slice(1);
                        var $697 = Cmp$ltn;
                        var $693 = $697;
                    };
                    return $693;
                } else {
                    var $698 = self.charCodeAt(0);
                    var $699 = self.slice(1);
                    var self = _b$2;
                    if (self.length === 0) {
                        var $701 = Cmp$gtn;
                        var $700 = $701;
                    } else {
                        var $702 = self.charCodeAt(0);
                        var $703 = self.slice(1);
                        var self = U16$cmp$($698, $702);
                        switch (self._) {
                            case 'Cmp.ltn':
                                var $705 = Cmp$ltn;
                                var $704 = $705;
                                break;
                            case 'Cmp.eql':
                                var $706 = String$cmp$($699, $703);
                                var $704 = $706;
                                break;
                            case 'Cmp.gtn':
                                var $707 = Cmp$gtn;
                                var $704 = $707;
                                break;
                        };
                        var $700 = $704;
                    };
                    return $700;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$cmp = x0 => x1 => String$cmp$(x0, x1);

    function Map$get$(_key$2, _map$3) {
        var $708 = BBT$lookup$(String$cmp, _key$2, _map$3);
        return $708;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function BBT$(_K$1, _V$2) {
        var $709 = null;
        return $709;
    };
    const BBT = x0 => x1 => BBT$(x0, x1);

    function Map$(_V$1) {
        var $710 = null;
        return $710;
    };
    const Map = x0 => Map$(x0);

    function Kindelia$get_data$(_world$1, _name$2) {
        var $711 = Maybe$monad$((_m$bind$3 => _m$pure$4 => {
            var $712 = _m$bind$3;
            return $712;
        }))(Map$get$(_name$2, (() => {
            var self = _world$1;
            switch (self._) {
                case 'Kindelia.World.new':
                    var $713 = self.entry;
                    var $714 = $713;
                    return $714;
            };
        })()))((_entry$3 => {
            var self = _entry$3;
            switch (self._) {
                case 'Kindelia.Entry.data':
                    var $716 = self.value;
                    var $717 = Maybe$some$($716);
                    var $715 = $717;
                    break;
                case 'Kindelia.Entry.bond':
                    var $718 = Maybe$none;
                    var $715 = $718;
                    break;
            };
            return $715;
        }));
        return $711;
    };
    const Kindelia$get_data = x0 => x1 => Kindelia$get_data$(x0, x1);

    function Parser$fail$(_error$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var $720 = self.nam;
                var $721 = self.ini;
                var $722 = self.idx;
                var $723 = Parser$Reply$fail$($720, $721, $722, _error$2);
                var $719 = $723;
                break;
        };
        return $719;
    };
    const Parser$fail = x0 => x1 => Parser$fail$(x0, x1);

    function List$find$(_cond$2, _xs$3) {
        var List$find$ = (_cond$2, _xs$3) => ({
            ctr: 'TCO',
            arg: [_cond$2, _xs$3]
        });
        var List$find = _cond$2 => _xs$3 => List$find$(_cond$2, _xs$3);
        var arg = [_cond$2, _xs$3];
        while (true) {
            let [_cond$2, _xs$3] = arg;
            var R = (() => {
                var self = _xs$3;
                switch (self._) {
                    case 'List.cons':
                        var $724 = self.head;
                        var $725 = self.tail;
                        var self = _cond$2($724);
                        if (self) {
                            var $727 = Maybe$some$($724);
                            var $726 = $727;
                        } else {
                            var $728 = List$find$(_cond$2, $725);
                            var $726 = $728;
                        };
                        return $726;
                    case 'List.nil':
                        var $729 = Maybe$none;
                        return $729;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$find = x0 => x1 => List$find$(x0, x1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Kindelia$parse$term$create$fields$(_world$1, _fields$2) {
        var self = _fields$2;
        switch (self._) {
            case 'List.cons':
                var $731 = self.head;
                var $732 = self.tail;
                var $733 = (_pst$5 => {
                    var self = _pst$5;
                    switch (self._) {
                        case 'Parser.State.new':
                            var $735 = self.err;
                            var _reply$11 = Parser$maybe$((_pst$11 => {
                                var self = _pst$11;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $738 = self.err;
                                        var _reply$17 = Kindelia$parse$text$($731, _pst$11);
                                        var self = _reply$17;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $740 = self.err;
                                                var self = $738;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $742 = self.value;
                                                        var $743 = Parser$Reply$error$(Parser$Error$combine$($742, $740));
                                                        var $741 = $743;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $744 = Parser$Reply$error$($740);
                                                        var $741 = $744;
                                                        break;
                                                };
                                                var $739 = $741;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $745 = self.pst;
                                                var self = $745;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $747 = self.err;
                                                        var $748 = self.nam;
                                                        var $749 = self.ini;
                                                        var $750 = self.idx;
                                                        var $751 = self.str;
                                                        var _reply$pst$25 = Parser$State$new$(Parser$Error$maybe_combine$($738, $747), $748, $749, $750, $751);
                                                        var $752 = Kindelia$parse$text$(":", _reply$pst$25);
                                                        var $746 = $752;
                                                        break;
                                                };
                                                var $739 = $746;
                                                break;
                                        };
                                        var $737 = $739;
                                        break;
                                };
                                return $737;
                            }), _pst$5);
                            var self = _reply$11;
                            switch (self._) {
                                case 'Parser.Reply.error':
                                    var $753 = self.err;
                                    var self = $735;
                                    switch (self._) {
                                        case 'Maybe.some':
                                            var $755 = self.value;
                                            var $756 = Parser$Reply$error$(Parser$Error$combine$($755, $753));
                                            var $754 = $756;
                                            break;
                                        case 'Maybe.none':
                                            var $757 = Parser$Reply$error$($753);
                                            var $754 = $757;
                                            break;
                                    };
                                    var $736 = $754;
                                    break;
                                case 'Parser.Reply.value':
                                    var $758 = self.pst;
                                    var self = $758;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $760 = self.err;
                                            var $761 = self.nam;
                                            var $762 = self.ini;
                                            var $763 = self.idx;
                                            var $764 = self.str;
                                            var _reply$pst$19 = Parser$State$new$(Parser$Error$maybe_combine$($735, $760), $761, $762, $763, $764);
                                            var self = _reply$pst$19;
                                            switch (self._) {
                                                case 'Parser.State.new':
                                                    var $766 = self.err;
                                                    var _reply$25 = Kindelia$parse$term$(_world$1)(_reply$pst$19);
                                                    var self = _reply$25;
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $768 = self.err;
                                                            var self = $766;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $770 = self.value;
                                                                    var $771 = Parser$Reply$error$(Parser$Error$combine$($770, $768));
                                                                    var $769 = $771;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $772 = Parser$Reply$error$($768);
                                                                    var $769 = $772;
                                                                    break;
                                                            };
                                                            var $767 = $769;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $773 = self.pst;
                                                            var $774 = self.val;
                                                            var self = $773;
                                                            switch (self._) {
                                                                case 'Parser.State.new':
                                                                    var $776 = self.err;
                                                                    var $777 = self.nam;
                                                                    var $778 = self.ini;
                                                                    var $779 = self.idx;
                                                                    var $780 = self.str;
                                                                    var _reply$pst$33 = Parser$State$new$(Parser$Error$maybe_combine$($766, $776), $777, $778, $779, $780);
                                                                    var self = _reply$pst$33;
                                                                    switch (self._) {
                                                                        case 'Parser.State.new':
                                                                            var $782 = self.err;
                                                                            var _reply$39 = Kindelia$parse$term$create$fields$(_world$1, $732)(_reply$pst$33);
                                                                            var self = _reply$39;
                                                                            switch (self._) {
                                                                                case 'Parser.Reply.error':
                                                                                    var $784 = self.err;
                                                                                    var self = $782;
                                                                                    switch (self._) {
                                                                                        case 'Maybe.some':
                                                                                            var $786 = self.value;
                                                                                            var $787 = Parser$Reply$error$(Parser$Error$combine$($786, $784));
                                                                                            var $785 = $787;
                                                                                            break;
                                                                                        case 'Maybe.none':
                                                                                            var $788 = Parser$Reply$error$($784);
                                                                                            var $785 = $788;
                                                                                            break;
                                                                                    };
                                                                                    var $783 = $785;
                                                                                    break;
                                                                                case 'Parser.Reply.value':
                                                                                    var $789 = self.pst;
                                                                                    var $790 = self.val;
                                                                                    var self = $789;
                                                                                    switch (self._) {
                                                                                        case 'Parser.State.new':
                                                                                            var $792 = self.err;
                                                                                            var $793 = self.nam;
                                                                                            var $794 = self.ini;
                                                                                            var $795 = self.idx;
                                                                                            var $796 = self.str;
                                                                                            var _reply$pst$47 = Parser$State$new$(Parser$Error$maybe_combine$($782, $792), $793, $794, $795, $796);
                                                                                            var self = _reply$pst$47;
                                                                                            switch (self._) {
                                                                                                case 'Parser.State.new':
                                                                                                    var $798 = self.err;
                                                                                                    var _reply$53 = Parser$maybe$(Kindelia$parse$text(","), _reply$pst$47);
                                                                                                    var self = _reply$53;
                                                                                                    switch (self._) {
                                                                                                        case 'Parser.Reply.error':
                                                                                                            var $800 = self.err;
                                                                                                            var self = $798;
                                                                                                            switch (self._) {
                                                                                                                case 'Maybe.some':
                                                                                                                    var $802 = self.value;
                                                                                                                    var $803 = Parser$Reply$error$(Parser$Error$combine$($802, $800));
                                                                                                                    var $801 = $803;
                                                                                                                    break;
                                                                                                                case 'Maybe.none':
                                                                                                                    var $804 = Parser$Reply$error$($800);
                                                                                                                    var $801 = $804;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $799 = $801;
                                                                                                            break;
                                                                                                        case 'Parser.Reply.value':
                                                                                                            var $805 = self.pst;
                                                                                                            var self = $805;
                                                                                                            switch (self._) {
                                                                                                                case 'Parser.State.new':
                                                                                                                    var $807 = self.err;
                                                                                                                    var $808 = self.nam;
                                                                                                                    var $809 = self.ini;
                                                                                                                    var $810 = self.idx;
                                                                                                                    var $811 = self.str;
                                                                                                                    var _reply$pst$61 = Parser$State$new$(Parser$Error$maybe_combine$($798, $807), $808, $809, $810, $811);
                                                                                                                    var $812 = Parser$Reply$value$(_reply$pst$61, List$cons$($774, $790));
                                                                                                                    var $806 = $812;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $799 = $806;
                                                                                                            break;
                                                                                                    };
                                                                                                    var $797 = $799;
                                                                                                    break;
                                                                                            };
                                                                                            var $791 = $797;
                                                                                            break;
                                                                                    };
                                                                                    var $783 = $791;
                                                                                    break;
                                                                            };
                                                                            var $781 = $783;
                                                                            break;
                                                                    };
                                                                    var $775 = $781;
                                                                    break;
                                                            };
                                                            var $767 = $775;
                                                            break;
                                                    };
                                                    var $765 = $767;
                                                    break;
                                            };
                                            var $759 = $765;
                                            break;
                                    };
                                    var $736 = $759;
                                    break;
                            };
                            var $734 = $736;
                            break;
                    };
                    return $734;
                });
                var $730 = $733;
                break;
            case 'List.nil':
                var $813 = (_pst$3 => {
                    var $814 = Parser$Reply$value$(_pst$3, List$nil);
                    return $814;
                });
                var $730 = $813;
                break;
        };
        return $730;
    };
    const Kindelia$parse$term$create$fields = x0 => x1 => Kindelia$parse$term$create$fields$(x0, x1);

    function List$mapped$(_as$2, _f$4) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $816 = self.head;
                var $817 = self.tail;
                var $818 = List$cons$(_f$4($816), List$mapped$($817, _f$4));
                var $815 = $818;
                break;
            case 'List.nil':
                var $819 = List$nil;
                var $815 = $819;
                break;
        };
        return $815;
    };
    const List$mapped = x0 => x1 => List$mapped$(x0, x1);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $821 = self.fst;
                var $822 = $821;
                var $820 = $822;
                break;
        };
        return $820;
    };
    const Pair$fst = x0 => Pair$fst$(x0);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $824 = self.value;
                var $825 = $824;
                var $823 = $825;
                break;
            case 'Maybe.none':
                var $826 = _a$3;
                var $823 = $826;
                break;
        };
        return $823;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

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
                        var $827 = self.head;
                        var $828 = self.tail;
                        var self = _f$3($827);
                        if (self) {
                            var $830 = Maybe$some$(_i$4);
                            var $829 = $830;
                        } else {
                            var $831 = List$find_index$go$($828, _f$3, Nat$succ$(_i$4));
                            var $829 = $831;
                        };
                        return $829;
                    case 'List.nil':
                        var $832 = Maybe$none;
                        return $832;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$find_index$go = x0 => x1 => x2 => List$find_index$go$(x0, x1, x2);

    function List$find_index$(_xs$2, _f$3) {
        var $833 = List$find_index$go$(_xs$2, _f$3, Nat$zero);
        return $833;
    };
    const List$find_index = x0 => x1 => List$find_index$(x0, x1);

    function Kindelia$Term$create$(_ctor$1, _vals$2) {
        var $834 = ({
            _: 'Kindelia.Term.create',
            'ctor': _ctor$1,
            'vals': _vals$2
        });
        return $834;
    };
    const Kindelia$Term$create = x0 => x1 => Kindelia$Term$create$(x0, x1);

    function Kindelia$parse$term$create$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $836 = self.err;
                var _reply$8 = Kindelia$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $838 = self.err;
                        var self = $836;
                        switch (self._) {
                            case 'Maybe.some':
                                var $840 = self.value;
                                var $841 = Parser$Reply$error$(Parser$Error$combine$($840, $838));
                                var $839 = $841;
                                break;
                            case 'Maybe.none':
                                var $842 = Parser$Reply$error$($838);
                                var $839 = $842;
                                break;
                        };
                        var $837 = $839;
                        break;
                    case 'Parser.Reply.value':
                        var $843 = self.pst;
                        var $844 = self.val;
                        var self = $843;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $846 = self.err;
                                var $847 = self.nam;
                                var $848 = self.ini;
                                var $849 = self.idx;
                                var $850 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($836, $846), $847, $848, $849, $850);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $852 = self.err;
                                        var _reply$22 = Kindelia$parse$text$("@", _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $854 = self.err;
                                                var self = $852;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $856 = self.value;
                                                        var $857 = Parser$Reply$error$(Parser$Error$combine$($856, $854));
                                                        var $855 = $857;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $858 = Parser$Reply$error$($854);
                                                        var $855 = $858;
                                                        break;
                                                };
                                                var $853 = $855;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $859 = self.pst;
                                                var self = $859;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $861 = self.err;
                                                        var $862 = self.nam;
                                                        var $863 = self.ini;
                                                        var $864 = self.idx;
                                                        var $865 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($852, $861), $862, $863, $864, $865);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $867 = self.err;
                                                                var _reply$36 = Kindelia$parse$name$(_reply$pst$30);
                                                                var self = _reply$36;
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
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($867, $877), $878, $879, $880, $881);
                                                                                var self = Kindelia$get_data$(_world$1, $844);
                                                                                switch (self._) {
                                                                                    case 'Maybe.some':
                                                                                        var $883 = self.value;
                                                                                        var _data$46 = $883;
                                                                                        var self = _data$46;
                                                                                        switch (self._) {
                                                                                            case 'Kindelia.Data.new':
                                                                                                var $885 = self.constructors;
                                                                                                var $886 = (_pst$49 => {
                                                                                                    var self = _pst$49;
                                                                                                    switch (self._) {
                                                                                                        case 'Parser.State.new':
                                                                                                            var $888 = self.err;
                                                                                                            var _reply$55 = Kindelia$parse$text$("{", _pst$49);
                                                                                                            var self = _reply$55;
                                                                                                            switch (self._) {
                                                                                                                case 'Parser.Reply.error':
                                                                                                                    var $890 = self.err;
                                                                                                                    var self = $888;
                                                                                                                    switch (self._) {
                                                                                                                        case 'Maybe.some':
                                                                                                                            var $892 = self.value;
                                                                                                                            var $893 = Parser$Reply$error$(Parser$Error$combine$($892, $890));
                                                                                                                            var $891 = $893;
                                                                                                                            break;
                                                                                                                        case 'Maybe.none':
                                                                                                                            var $894 = Parser$Reply$error$($890);
                                                                                                                            var $891 = $894;
                                                                                                                            break;
                                                                                                                    };
                                                                                                                    var $889 = $891;
                                                                                                                    break;
                                                                                                                case 'Parser.Reply.value':
                                                                                                                    var $895 = self.pst;
                                                                                                                    var self = $895;
                                                                                                                    switch (self._) {
                                                                                                                        case 'Parser.State.new':
                                                                                                                            var $897 = self.err;
                                                                                                                            var $898 = self.nam;
                                                                                                                            var $899 = self.ini;
                                                                                                                            var $900 = self.idx;
                                                                                                                            var $901 = self.str;
                                                                                                                            var _reply$pst$63 = Parser$State$new$(Parser$Error$maybe_combine$($888, $897), $898, $899, $900, $901);
                                                                                                                            var self = List$find$((_ctor$64 => {
                                                                                                                                var $903 = ((() => {
                                                                                                                                    var self = _ctor$64;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Kindelia.Constructor.new':
                                                                                                                                            var $904 = self.name;
                                                                                                                                            var $905 = $904;
                                                                                                                                            return $905;
                                                                                                                                    };
                                                                                                                                })() === $875);
                                                                                                                                return $903;
                                                                                                                            }), $885);
                                                                                                                            switch (self._) {
                                                                                                                                case 'Maybe.some':
                                                                                                                                    var $906 = self.value;
                                                                                                                                    var _ctor$65 = $906;
                                                                                                                                    var self = _ctor$65;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Kindelia.Constructor.new':
                                                                                                                                            var $908 = self.args;
                                                                                                                                            var $909 = (_pst$68 => {
                                                                                                                                                var self = _pst$68;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                        var $911 = self.err;
                                                                                                                                                        var _reply$74 = Kindelia$parse$term$create$fields$(_world$1, List$mapped$($908, Pair$fst))(_pst$68);
                                                                                                                                                        var self = _reply$74;
                                                                                                                                                        switch (self._) {
                                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                                var $913 = self.err;
                                                                                                                                                                var self = $911;
                                                                                                                                                                switch (self._) {
                                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                                        var $915 = self.value;
                                                                                                                                                                        var $916 = Parser$Reply$error$(Parser$Error$combine$($915, $913));
                                                                                                                                                                        var $914 = $916;
                                                                                                                                                                        break;
                                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                                        var $917 = Parser$Reply$error$($913);
                                                                                                                                                                        var $914 = $917;
                                                                                                                                                                        break;
                                                                                                                                                                };
                                                                                                                                                                var $912 = $914;
                                                                                                                                                                break;
                                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                                var $918 = self.pst;
                                                                                                                                                                var $919 = self.val;
                                                                                                                                                                var self = $918;
                                                                                                                                                                switch (self._) {
                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                        var $921 = self.err;
                                                                                                                                                                        var $922 = self.nam;
                                                                                                                                                                        var $923 = self.ini;
                                                                                                                                                                        var $924 = self.idx;
                                                                                                                                                                        var $925 = self.str;
                                                                                                                                                                        var _reply$pst$82 = Parser$State$new$(Parser$Error$maybe_combine$($911, $921), $922, $923, $924, $925);
                                                                                                                                                                        var self = _reply$pst$82;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                var $927 = self.err;
                                                                                                                                                                                var _reply$88 = Kindelia$parse$text$("}", _reply$pst$82);
                                                                                                                                                                                var self = _reply$88;
                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                                        var $929 = self.err;
                                                                                                                                                                                        var self = $927;
                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                                var $931 = self.value;
                                                                                                                                                                                                var $932 = Parser$Reply$error$(Parser$Error$combine$($931, $929));
                                                                                                                                                                                                var $930 = $932;
                                                                                                                                                                                                break;
                                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                                var $933 = Parser$Reply$error$($929);
                                                                                                                                                                                                var $930 = $933;
                                                                                                                                                                                                break;
                                                                                                                                                                                        };
                                                                                                                                                                                        var $928 = $930;
                                                                                                                                                                                        break;
                                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                                        var $934 = self.pst;
                                                                                                                                                                                        var self = $934;
                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                                var $936 = self.err;
                                                                                                                                                                                                var $937 = self.nam;
                                                                                                                                                                                                var $938 = self.ini;
                                                                                                                                                                                                var $939 = self.idx;
                                                                                                                                                                                                var $940 = self.str;
                                                                                                                                                                                                var _reply$pst$96 = Parser$State$new$(Parser$Error$maybe_combine$($927, $936), $937, $938, $939, $940);
                                                                                                                                                                                                var _cnam$97 = List$mapped$((() => {
                                                                                                                                                                                                    var self = _data$46;
                                                                                                                                                                                                    switch (self._) {
                                                                                                                                                                                                        case 'Kindelia.Data.new':
                                                                                                                                                                                                            var $942 = self.constructors;
                                                                                                                                                                                                            var $943 = $942;
                                                                                                                                                                                                            return $943;
                                                                                                                                                                                                    };
                                                                                                                                                                                                })(), (_x$97 => {
                                                                                                                                                                                                    var self = _x$97;
                                                                                                                                                                                                    switch (self._) {
                                                                                                                                                                                                        case 'Kindelia.Constructor.new':
                                                                                                                                                                                                            var $945 = self.name;
                                                                                                                                                                                                            var $946 = $945;
                                                                                                                                                                                                            var $944 = $946;
                                                                                                                                                                                                            break;
                                                                                                                                                                                                    };
                                                                                                                                                                                                    return $944;
                                                                                                                                                                                                }));
                                                                                                                                                                                                var _ctor$98 = Maybe$default$(List$find_index$(_cnam$97, a1 => ($875 === a1)), 0n);
                                                                                                                                                                                                var $941 = Parser$Reply$value$(_reply$pst$96, Kindelia$Term$create$(_ctor$98, $919));
                                                                                                                                                                                                var $935 = $941;
                                                                                                                                                                                                break;
                                                                                                                                                                                        };
                                                                                                                                                                                        var $928 = $935;
                                                                                                                                                                                        break;
                                                                                                                                                                                };
                                                                                                                                                                                var $926 = $928;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $920 = $926;
                                                                                                                                                                        break;
                                                                                                                                                                };
                                                                                                                                                                var $912 = $920;
                                                                                                                                                                break;
                                                                                                                                                        };
                                                                                                                                                        var $910 = $912;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                return $910;
                                                                                                                                            });
                                                                                                                                            var $907 = $909;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $902 = $907;
                                                                                                                                    break;
                                                                                                                                case 'Maybe.none':
                                                                                                                                    var $947 = Parser$fail("Constructor not found.");
                                                                                                                                    var $902 = $947;
                                                                                                                                    break;
                                                                                                                            };
                                                                                                                            var $902 = $902(_reply$pst$63);
                                                                                                                            var $896 = $902;
                                                                                                                            break;
                                                                                                                    };
                                                                                                                    var $889 = $896;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $887 = $889;
                                                                                                            break;
                                                                                                    };
                                                                                                    return $887;
                                                                                                });
                                                                                                var $884 = $886;
                                                                                                break;
                                                                                        };
                                                                                        var $882 = $884;
                                                                                        break;
                                                                                    case 'Maybe.none':
                                                                                        var $948 = Parser$fail("Type not found.");
                                                                                        var $882 = $948;
                                                                                        break;
                                                                                };
                                                                                var $882 = $882(_reply$pst$44);
                                                                                var $876 = $882;
                                                                                break;
                                                                        };
                                                                        var $868 = $876;
                                                                        break;
                                                                };
                                                                var $866 = $868;
                                                                break;
                                                        };
                                                        var $860 = $866;
                                                        break;
                                                };
                                                var $853 = $860;
                                                break;
                                        };
                                        var $851 = $853;
                                        break;
                                };
                                var $845 = $851;
                                break;
                        };
                        var $837 = $845;
                        break;
                };
                var $835 = $837;
                break;
        };
        return $835;
    };
    const Kindelia$parse$term$create = x0 => x1 => Kindelia$parse$term$create$(x0, x1);

    function Kindelia$parse$term$match$cases$(_world$1, _constructors$2) {
        var self = _constructors$2;
        switch (self._) {
            case 'List.cons':
                var $950 = self.head;
                var $951 = self.tail;
                var _ctor$5 = $950;
                var self = _ctor$5;
                switch (self._) {
                    case 'Kindelia.Constructor.new':
                        var $953 = self.name;
                        var $954 = (_pst$8 => {
                            var self = _pst$8;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $956 = self.err;
                                    var _reply$14 = Kindelia$parse$text$($953, _pst$8);
                                    var self = _reply$14;
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $958 = self.err;
                                            var self = $956;
                                            switch (self._) {
                                                case 'Maybe.some':
                                                    var $960 = self.value;
                                                    var $961 = Parser$Reply$error$(Parser$Error$combine$($960, $958));
                                                    var $959 = $961;
                                                    break;
                                                case 'Maybe.none':
                                                    var $962 = Parser$Reply$error$($958);
                                                    var $959 = $962;
                                                    break;
                                            };
                                            var $957 = $959;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $963 = self.pst;
                                            var self = $963;
                                            switch (self._) {
                                                case 'Parser.State.new':
                                                    var $965 = self.err;
                                                    var $966 = self.nam;
                                                    var $967 = self.ini;
                                                    var $968 = self.idx;
                                                    var $969 = self.str;
                                                    var _reply$pst$22 = Parser$State$new$(Parser$Error$maybe_combine$($956, $965), $966, $967, $968, $969);
                                                    var self = _reply$pst$22;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $971 = self.err;
                                                            var _reply$28 = Kindelia$parse$text$(":", _reply$pst$22);
                                                            var self = _reply$28;
                                                            switch (self._) {
                                                                case 'Parser.Reply.error':
                                                                    var $973 = self.err;
                                                                    var self = $971;
                                                                    switch (self._) {
                                                                        case 'Maybe.some':
                                                                            var $975 = self.value;
                                                                            var $976 = Parser$Reply$error$(Parser$Error$combine$($975, $973));
                                                                            var $974 = $976;
                                                                            break;
                                                                        case 'Maybe.none':
                                                                            var $977 = Parser$Reply$error$($973);
                                                                            var $974 = $977;
                                                                            break;
                                                                    };
                                                                    var $972 = $974;
                                                                    break;
                                                                case 'Parser.Reply.value':
                                                                    var $978 = self.pst;
                                                                    var self = $978;
                                                                    switch (self._) {
                                                                        case 'Parser.State.new':
                                                                            var $980 = self.err;
                                                                            var $981 = self.nam;
                                                                            var $982 = self.ini;
                                                                            var $983 = self.idx;
                                                                            var $984 = self.str;
                                                                            var _reply$pst$36 = Parser$State$new$(Parser$Error$maybe_combine$($971, $980), $981, $982, $983, $984);
                                                                            var self = _reply$pst$36;
                                                                            switch (self._) {
                                                                                case 'Parser.State.new':
                                                                                    var $986 = self.err;
                                                                                    var _reply$42 = Kindelia$parse$term$(_world$1)(_reply$pst$36);
                                                                                    var self = _reply$42;
                                                                                    switch (self._) {
                                                                                        case 'Parser.Reply.error':
                                                                                            var $988 = self.err;
                                                                                            var self = $986;
                                                                                            switch (self._) {
                                                                                                case 'Maybe.some':
                                                                                                    var $990 = self.value;
                                                                                                    var $991 = Parser$Reply$error$(Parser$Error$combine$($990, $988));
                                                                                                    var $989 = $991;
                                                                                                    break;
                                                                                                case 'Maybe.none':
                                                                                                    var $992 = Parser$Reply$error$($988);
                                                                                                    var $989 = $992;
                                                                                                    break;
                                                                                            };
                                                                                            var $987 = $989;
                                                                                            break;
                                                                                        case 'Parser.Reply.value':
                                                                                            var $993 = self.pst;
                                                                                            var $994 = self.val;
                                                                                            var self = $993;
                                                                                            switch (self._) {
                                                                                                case 'Parser.State.new':
                                                                                                    var $996 = self.err;
                                                                                                    var $997 = self.nam;
                                                                                                    var $998 = self.ini;
                                                                                                    var $999 = self.idx;
                                                                                                    var $1000 = self.str;
                                                                                                    var _reply$pst$50 = Parser$State$new$(Parser$Error$maybe_combine$($986, $996), $997, $998, $999, $1000);
                                                                                                    var self = _reply$pst$50;
                                                                                                    switch (self._) {
                                                                                                        case 'Parser.State.new':
                                                                                                            var $1002 = self.err;
                                                                                                            var _reply$56 = Parser$maybe$(Kindelia$parse$text(","), _reply$pst$50);
                                                                                                            var self = _reply$56;
                                                                                                            switch (self._) {
                                                                                                                case 'Parser.Reply.error':
                                                                                                                    var $1004 = self.err;
                                                                                                                    var self = $1002;
                                                                                                                    switch (self._) {
                                                                                                                        case 'Maybe.some':
                                                                                                                            var $1006 = self.value;
                                                                                                                            var $1007 = Parser$Reply$error$(Parser$Error$combine$($1006, $1004));
                                                                                                                            var $1005 = $1007;
                                                                                                                            break;
                                                                                                                        case 'Maybe.none':
                                                                                                                            var $1008 = Parser$Reply$error$($1004);
                                                                                                                            var $1005 = $1008;
                                                                                                                            break;
                                                                                                                    };
                                                                                                                    var $1003 = $1005;
                                                                                                                    break;
                                                                                                                case 'Parser.Reply.value':
                                                                                                                    var $1009 = self.pst;
                                                                                                                    var self = $1009;
                                                                                                                    switch (self._) {
                                                                                                                        case 'Parser.State.new':
                                                                                                                            var $1011 = self.err;
                                                                                                                            var $1012 = self.nam;
                                                                                                                            var $1013 = self.ini;
                                                                                                                            var $1014 = self.idx;
                                                                                                                            var $1015 = self.str;
                                                                                                                            var _reply$pst$64 = Parser$State$new$(Parser$Error$maybe_combine$($1002, $1011), $1012, $1013, $1014, $1015);
                                                                                                                            var self = _reply$pst$64;
                                                                                                                            switch (self._) {
                                                                                                                                case 'Parser.State.new':
                                                                                                                                    var $1017 = self.err;
                                                                                                                                    var _reply$70 = Kindelia$parse$term$match$cases$(_world$1, $951)(_reply$pst$64);
                                                                                                                                    var self = _reply$70;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Parser.Reply.error':
                                                                                                                                            var $1019 = self.err;
                                                                                                                                            var self = $1017;
                                                                                                                                            switch (self._) {
                                                                                                                                                case 'Maybe.some':
                                                                                                                                                    var $1021 = self.value;
                                                                                                                                                    var $1022 = Parser$Reply$error$(Parser$Error$combine$($1021, $1019));
                                                                                                                                                    var $1020 = $1022;
                                                                                                                                                    break;
                                                                                                                                                case 'Maybe.none':
                                                                                                                                                    var $1023 = Parser$Reply$error$($1019);
                                                                                                                                                    var $1020 = $1023;
                                                                                                                                                    break;
                                                                                                                                            };
                                                                                                                                            var $1018 = $1020;
                                                                                                                                            break;
                                                                                                                                        case 'Parser.Reply.value':
                                                                                                                                            var $1024 = self.pst;
                                                                                                                                            var $1025 = self.val;
                                                                                                                                            var self = $1024;
                                                                                                                                            switch (self._) {
                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                    var $1027 = self.err;
                                                                                                                                                    var $1028 = self.nam;
                                                                                                                                                    var $1029 = self.ini;
                                                                                                                                                    var $1030 = self.idx;
                                                                                                                                                    var $1031 = self.str;
                                                                                                                                                    var _reply$pst$78 = Parser$State$new$(Parser$Error$maybe_combine$($1017, $1027), $1028, $1029, $1030, $1031);
                                                                                                                                                    var $1032 = Parser$Reply$value$(_reply$pst$78, List$cons$($994, $1025));
                                                                                                                                                    var $1026 = $1032;
                                                                                                                                                    break;
                                                                                                                                            };
                                                                                                                                            var $1018 = $1026;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1016 = $1018;
                                                                                                                                    break;
                                                                                                                            };
                                                                                                                            var $1010 = $1016;
                                                                                                                            break;
                                                                                                                    };
                                                                                                                    var $1003 = $1010;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $1001 = $1003;
                                                                                                            break;
                                                                                                    };
                                                                                                    var $995 = $1001;
                                                                                                    break;
                                                                                            };
                                                                                            var $987 = $995;
                                                                                            break;
                                                                                    };
                                                                                    var $985 = $987;
                                                                                    break;
                                                                            };
                                                                            var $979 = $985;
                                                                            break;
                                                                    };
                                                                    var $972 = $979;
                                                                    break;
                                                            };
                                                            var $970 = $972;
                                                            break;
                                                    };
                                                    var $964 = $970;
                                                    break;
                                            };
                                            var $957 = $964;
                                            break;
                                    };
                                    var $955 = $957;
                                    break;
                            };
                            return $955;
                        });
                        var $952 = $954;
                        break;
                };
                var $949 = $952;
                break;
            case 'List.nil':
                var $1033 = (_pst$3 => {
                    var $1034 = Parser$Reply$value$(_pst$3, List$nil);
                    return $1034;
                });
                var $949 = $1033;
                break;
        };
        return $949;
    };
    const Kindelia$parse$term$match$cases = x0 => x1 => Kindelia$parse$term$match$cases$(x0, x1);

    function Kindelia$Term$match$(_name$1, _data$2, _cses$3) {
        var $1035 = ({
            _: 'Kindelia.Term.match',
            'name': _name$1,
            'data': _data$2,
            'cses': _cses$3
        });
        return $1035;
    };
    const Kindelia$Term$match = x0 => x1 => x2 => Kindelia$Term$match$(x0, x1, x2);

    function Kindelia$parse$term$match$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1037 = self.err;
                var _reply$8 = Kindelia$parse$text$("case ", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1039 = self.err;
                        var self = $1037;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1041 = self.value;
                                var $1042 = Parser$Reply$error$(Parser$Error$combine$($1041, $1039));
                                var $1040 = $1042;
                                break;
                            case 'Maybe.none':
                                var $1043 = Parser$Reply$error$($1039);
                                var $1040 = $1043;
                                break;
                        };
                        var $1038 = $1040;
                        break;
                    case 'Parser.Reply.value':
                        var $1044 = self.pst;
                        var self = $1044;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1046 = self.err;
                                var $1047 = self.nam;
                                var $1048 = self.ini;
                                var $1049 = self.idx;
                                var $1050 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1037, $1046), $1047, $1048, $1049, $1050);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1052 = self.err;
                                        var _reply$22 = Kindelia$parse$name$(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1054 = self.err;
                                                var self = $1052;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1056 = self.value;
                                                        var $1057 = Parser$Reply$error$(Parser$Error$combine$($1056, $1054));
                                                        var $1055 = $1057;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1058 = Parser$Reply$error$($1054);
                                                        var $1055 = $1058;
                                                        break;
                                                };
                                                var $1053 = $1055;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1059 = self.pst;
                                                var $1060 = self.val;
                                                var self = $1059;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1062 = self.err;
                                                        var $1063 = self.nam;
                                                        var $1064 = self.ini;
                                                        var $1065 = self.idx;
                                                        var $1066 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1052, $1062), $1063, $1064, $1065, $1066);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $1068 = self.err;
                                                                var _reply$36 = Kindelia$parse$text$(":", _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1070 = self.err;
                                                                        var self = $1068;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $1072 = self.value;
                                                                                var $1073 = Parser$Reply$error$(Parser$Error$combine$($1072, $1070));
                                                                                var $1071 = $1073;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $1074 = Parser$Reply$error$($1070);
                                                                                var $1071 = $1074;
                                                                                break;
                                                                        };
                                                                        var $1069 = $1071;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1075 = self.pst;
                                                                        var self = $1075;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $1077 = self.err;
                                                                                var $1078 = self.nam;
                                                                                var $1079 = self.ini;
                                                                                var $1080 = self.idx;
                                                                                var $1081 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($1068, $1077), $1078, $1079, $1080, $1081);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $1083 = self.err;
                                                                                        var _reply$50 = Kindelia$parse$name$(_reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1085 = self.err;
                                                                                                var self = $1083;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $1087 = self.value;
                                                                                                        var $1088 = Parser$Reply$error$(Parser$Error$combine$($1087, $1085));
                                                                                                        var $1086 = $1088;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $1089 = Parser$Reply$error$($1085);
                                                                                                        var $1086 = $1089;
                                                                                                        break;
                                                                                                };
                                                                                                var $1084 = $1086;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1090 = self.pst;
                                                                                                var $1091 = self.val;
                                                                                                var self = $1090;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $1093 = self.err;
                                                                                                        var $1094 = self.nam;
                                                                                                        var $1095 = self.ini;
                                                                                                        var $1096 = self.idx;
                                                                                                        var $1097 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($1083, $1093), $1094, $1095, $1096, $1097);
                                                                                                        var self = Kindelia$get_data$(_world$1, $1091);
                                                                                                        switch (self._) {
                                                                                                            case 'Maybe.some':
                                                                                                                var $1099 = self.value;
                                                                                                                var _data$60 = $1099;
                                                                                                                var self = _data$60;
                                                                                                                switch (self._) {
                                                                                                                    case 'Kindelia.Data.new':
                                                                                                                        var $1101 = self.constructors;
                                                                                                                        var $1102 = (_pst$63 => {
                                                                                                                            var self = _pst$63;
                                                                                                                            switch (self._) {
                                                                                                                                case 'Parser.State.new':
                                                                                                                                    var $1104 = self.err;
                                                                                                                                    var _reply$69 = Kindelia$parse$text$("{", _pst$63);
                                                                                                                                    var self = _reply$69;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Parser.Reply.error':
                                                                                                                                            var $1106 = self.err;
                                                                                                                                            var self = $1104;
                                                                                                                                            switch (self._) {
                                                                                                                                                case 'Maybe.some':
                                                                                                                                                    var $1108 = self.value;
                                                                                                                                                    var $1109 = Parser$Reply$error$(Parser$Error$combine$($1108, $1106));
                                                                                                                                                    var $1107 = $1109;
                                                                                                                                                    break;
                                                                                                                                                case 'Maybe.none':
                                                                                                                                                    var $1110 = Parser$Reply$error$($1106);
                                                                                                                                                    var $1107 = $1110;
                                                                                                                                                    break;
                                                                                                                                            };
                                                                                                                                            var $1105 = $1107;
                                                                                                                                            break;
                                                                                                                                        case 'Parser.Reply.value':
                                                                                                                                            var $1111 = self.pst;
                                                                                                                                            var self = $1111;
                                                                                                                                            switch (self._) {
                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                    var $1113 = self.err;
                                                                                                                                                    var $1114 = self.nam;
                                                                                                                                                    var $1115 = self.ini;
                                                                                                                                                    var $1116 = self.idx;
                                                                                                                                                    var $1117 = self.str;
                                                                                                                                                    var _reply$pst$77 = Parser$State$new$(Parser$Error$maybe_combine$($1104, $1113), $1114, $1115, $1116, $1117);
                                                                                                                                                    var self = _reply$pst$77;
                                                                                                                                                    switch (self._) {
                                                                                                                                                        case 'Parser.State.new':
                                                                                                                                                            var $1119 = self.err;
                                                                                                                                                            var _reply$83 = Kindelia$parse$term$match$cases$(_world$1, $1101)(_reply$pst$77);
                                                                                                                                                            var self = _reply$83;
                                                                                                                                                            switch (self._) {
                                                                                                                                                                case 'Parser.Reply.error':
                                                                                                                                                                    var $1121 = self.err;
                                                                                                                                                                    var self = $1119;
                                                                                                                                                                    switch (self._) {
                                                                                                                                                                        case 'Maybe.some':
                                                                                                                                                                            var $1123 = self.value;
                                                                                                                                                                            var $1124 = Parser$Reply$error$(Parser$Error$combine$($1123, $1121));
                                                                                                                                                                            var $1122 = $1124;
                                                                                                                                                                            break;
                                                                                                                                                                        case 'Maybe.none':
                                                                                                                                                                            var $1125 = Parser$Reply$error$($1121);
                                                                                                                                                                            var $1122 = $1125;
                                                                                                                                                                            break;
                                                                                                                                                                    };
                                                                                                                                                                    var $1120 = $1122;
                                                                                                                                                                    break;
                                                                                                                                                                case 'Parser.Reply.value':
                                                                                                                                                                    var $1126 = self.pst;
                                                                                                                                                                    var $1127 = self.val;
                                                                                                                                                                    var self = $1126;
                                                                                                                                                                    switch (self._) {
                                                                                                                                                                        case 'Parser.State.new':
                                                                                                                                                                            var $1129 = self.err;
                                                                                                                                                                            var $1130 = self.nam;
                                                                                                                                                                            var $1131 = self.ini;
                                                                                                                                                                            var $1132 = self.idx;
                                                                                                                                                                            var $1133 = self.str;
                                                                                                                                                                            var _reply$pst$91 = Parser$State$new$(Parser$Error$maybe_combine$($1119, $1129), $1130, $1131, $1132, $1133);
                                                                                                                                                                            var self = _reply$pst$91;
                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                                                    var $1135 = self.err;
                                                                                                                                                                                    var _reply$97 = Kindelia$parse$text$("}", _reply$pst$91);
                                                                                                                                                                                    var self = _reply$97;
                                                                                                                                                                                    switch (self._) {
                                                                                                                                                                                        case 'Parser.Reply.error':
                                                                                                                                                                                            var $1137 = self.err;
                                                                                                                                                                                            var self = $1135;
                                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                                case 'Maybe.some':
                                                                                                                                                                                                    var $1139 = self.value;
                                                                                                                                                                                                    var $1140 = Parser$Reply$error$(Parser$Error$combine$($1139, $1137));
                                                                                                                                                                                                    var $1138 = $1140;
                                                                                                                                                                                                    break;
                                                                                                                                                                                                case 'Maybe.none':
                                                                                                                                                                                                    var $1141 = Parser$Reply$error$($1137);
                                                                                                                                                                                                    var $1138 = $1141;
                                                                                                                                                                                                    break;
                                                                                                                                                                                            };
                                                                                                                                                                                            var $1136 = $1138;
                                                                                                                                                                                            break;
                                                                                                                                                                                        case 'Parser.Reply.value':
                                                                                                                                                                                            var $1142 = self.pst;
                                                                                                                                                                                            var self = $1142;
                                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                                                                    var $1144 = self.err;
                                                                                                                                                                                                    var $1145 = self.nam;
                                                                                                                                                                                                    var $1146 = self.ini;
                                                                                                                                                                                                    var $1147 = self.idx;
                                                                                                                                                                                                    var $1148 = self.str;
                                                                                                                                                                                                    var _reply$pst$105 = Parser$State$new$(Parser$Error$maybe_combine$($1135, $1144), $1145, $1146, $1147, $1148);
                                                                                                                                                                                                    var $1149 = Parser$Reply$value$(_reply$pst$105, Kindelia$Term$match$($1060, $1091, $1127));
                                                                                                                                                                                                    var $1143 = $1149;
                                                                                                                                                                                                    break;
                                                                                                                                                                                            };
                                                                                                                                                                                            var $1136 = $1143;
                                                                                                                                                                                            break;
                                                                                                                                                                                    };
                                                                                                                                                                                    var $1134 = $1136;
                                                                                                                                                                                    break;
                                                                                                                                                                            };
                                                                                                                                                                            var $1128 = $1134;
                                                                                                                                                                            break;
                                                                                                                                                                    };
                                                                                                                                                                    var $1120 = $1128;
                                                                                                                                                                    break;
                                                                                                                                                            };
                                                                                                                                                            var $1118 = $1120;
                                                                                                                                                            break;
                                                                                                                                                    };
                                                                                                                                                    var $1112 = $1118;
                                                                                                                                                    break;
                                                                                                                                            };
                                                                                                                                            var $1105 = $1112;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1103 = $1105;
                                                                                                                                    break;
                                                                                                                            };
                                                                                                                            return $1103;
                                                                                                                        });
                                                                                                                        var $1100 = $1102;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $1098 = $1100;
                                                                                                                break;
                                                                                                            case 'Maybe.none':
                                                                                                                var $1150 = Parser$fail("Type not found.");
                                                                                                                var $1098 = $1150;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1098 = $1098(_reply$pst$58);
                                                                                                        var $1092 = $1098;
                                                                                                        break;
                                                                                                };
                                                                                                var $1084 = $1092;
                                                                                                break;
                                                                                        };
                                                                                        var $1082 = $1084;
                                                                                        break;
                                                                                };
                                                                                var $1076 = $1082;
                                                                                break;
                                                                        };
                                                                        var $1069 = $1076;
                                                                        break;
                                                                };
                                                                var $1067 = $1069;
                                                                break;
                                                        };
                                                        var $1061 = $1067;
                                                        break;
                                                };
                                                var $1053 = $1061;
                                                break;
                                        };
                                        var $1051 = $1053;
                                        break;
                                };
                                var $1045 = $1051;
                                break;
                        };
                        var $1038 = $1045;
                        break;
                };
                var $1036 = $1038;
                break;
        };
        return $1036;
    };
    const Kindelia$parse$term$match = x0 => x1 => Kindelia$parse$term$match$(x0, x1);

    function Parser$many1$(_parser$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var $1152 = self.err;
                var _reply$9 = _parser$2(_pst$3);
                var self = _reply$9;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1154 = self.err;
                        var self = $1152;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1156 = self.value;
                                var $1157 = Parser$Reply$error$(Parser$Error$combine$($1156, $1154));
                                var $1155 = $1157;
                                break;
                            case 'Maybe.none':
                                var $1158 = Parser$Reply$error$($1154);
                                var $1155 = $1158;
                                break;
                        };
                        var $1153 = $1155;
                        break;
                    case 'Parser.Reply.value':
                        var $1159 = self.pst;
                        var $1160 = self.val;
                        var self = $1159;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1162 = self.err;
                                var $1163 = self.nam;
                                var $1164 = self.ini;
                                var $1165 = self.idx;
                                var $1166 = self.str;
                                var _reply$pst$17 = Parser$State$new$(Parser$Error$maybe_combine$($1152, $1162), $1163, $1164, $1165, $1166);
                                var self = _reply$pst$17;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1168 = self.err;
                                        var _reply$23 = Parser$many$(_parser$2)(_reply$pst$17);
                                        var self = _reply$23;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1170 = self.err;
                                                var self = $1168;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1172 = self.value;
                                                        var $1173 = Parser$Reply$error$(Parser$Error$combine$($1172, $1170));
                                                        var $1171 = $1173;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1174 = Parser$Reply$error$($1170);
                                                        var $1171 = $1174;
                                                        break;
                                                };
                                                var $1169 = $1171;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1175 = self.pst;
                                                var $1176 = self.val;
                                                var self = $1175;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1178 = self.err;
                                                        var $1179 = self.nam;
                                                        var $1180 = self.ini;
                                                        var $1181 = self.idx;
                                                        var $1182 = self.str;
                                                        var _reply$pst$31 = Parser$State$new$(Parser$Error$maybe_combine$($1168, $1178), $1179, $1180, $1181, $1182);
                                                        var $1183 = Parser$Reply$value$(_reply$pst$31, List$cons$($1160, $1176));
                                                        var $1177 = $1183;
                                                        break;
                                                };
                                                var $1169 = $1177;
                                                break;
                                        };
                                        var $1167 = $1169;
                                        break;
                                };
                                var $1161 = $1167;
                                break;
                        };
                        var $1153 = $1161;
                        break;
                };
                var $1151 = $1153;
                break;
        };
        return $1151;
    };
    const Parser$many1 = x0 => x1 => Parser$many1$(x0, x1);

    function Parser$digit$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1185 = self.err;
                var $1186 = self.nam;
                var $1187 = self.ini;
                var $1188 = self.idx;
                var $1189 = self.str;
                var self = $1189;
                if (self.length === 0) {
                    var $1191 = Parser$Reply$fail$($1186, $1187, $1188, "Not a digit.");
                    var $1190 = $1191;
                } else {
                    var $1192 = self.charCodeAt(0);
                    var $1193 = self.slice(1);
                    var _pst$9 = Parser$State$new$($1185, $1186, $1187, Nat$succ$($1188), $1193);
                    var self = ($1192 === 48);
                    if (self) {
                        var $1195 = Parser$Reply$value$(_pst$9, 0n);
                        var $1194 = $1195;
                    } else {
                        var self = ($1192 === 49);
                        if (self) {
                            var $1197 = Parser$Reply$value$(_pst$9, 1n);
                            var $1196 = $1197;
                        } else {
                            var self = ($1192 === 50);
                            if (self) {
                                var $1199 = Parser$Reply$value$(_pst$9, 2n);
                                var $1198 = $1199;
                            } else {
                                var self = ($1192 === 51);
                                if (self) {
                                    var $1201 = Parser$Reply$value$(_pst$9, 3n);
                                    var $1200 = $1201;
                                } else {
                                    var self = ($1192 === 52);
                                    if (self) {
                                        var $1203 = Parser$Reply$value$(_pst$9, 4n);
                                        var $1202 = $1203;
                                    } else {
                                        var self = ($1192 === 53);
                                        if (self) {
                                            var $1205 = Parser$Reply$value$(_pst$9, 5n);
                                            var $1204 = $1205;
                                        } else {
                                            var self = ($1192 === 54);
                                            if (self) {
                                                var $1207 = Parser$Reply$value$(_pst$9, 6n);
                                                var $1206 = $1207;
                                            } else {
                                                var self = ($1192 === 55);
                                                if (self) {
                                                    var $1209 = Parser$Reply$value$(_pst$9, 7n);
                                                    var $1208 = $1209;
                                                } else {
                                                    var self = ($1192 === 56);
                                                    if (self) {
                                                        var $1211 = Parser$Reply$value$(_pst$9, 8n);
                                                        var $1210 = $1211;
                                                    } else {
                                                        var self = ($1192 === 57);
                                                        if (self) {
                                                            var $1213 = Parser$Reply$value$(_pst$9, 9n);
                                                            var $1212 = $1213;
                                                        } else {
                                                            var $1214 = Parser$Reply$fail$($1186, $1187, $1188, "Not a digit.");
                                                            var $1212 = $1214;
                                                        };
                                                        var $1210 = $1212;
                                                    };
                                                    var $1208 = $1210;
                                                };
                                                var $1206 = $1208;
                                            };
                                            var $1204 = $1206;
                                        };
                                        var $1202 = $1204;
                                    };
                                    var $1200 = $1202;
                                };
                                var $1198 = $1200;
                            };
                            var $1196 = $1198;
                        };
                        var $1194 = $1196;
                    };
                    var $1190 = $1194;
                };
                var $1184 = $1190;
                break;
        };
        return $1184;
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
                        var $1215 = self.head;
                        var $1216 = self.tail;
                        var $1217 = Nat$from_base$go$(_b$1, $1216, (_b$1 * _p$3), (($1215 * _p$3) + _res$4));
                        return $1217;
                    case 'List.nil':
                        var $1218 = _res$4;
                        return $1218;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$from_base$go = x0 => x1 => x2 => x3 => Nat$from_base$go$(x0, x1, x2, x3);

    function Nat$from_base$(_base$1, _ds$2) {
        var $1219 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $1219;
    };
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);

    function Parser$nat$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1221 = self.err;
                var _reply$7 = Parser$many1$(Parser$digit, _pst$1);
                var self = _reply$7;
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
                        var $1229 = self.val;
                        var self = $1228;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1231 = self.err;
                                var $1232 = self.nam;
                                var $1233 = self.ini;
                                var $1234 = self.idx;
                                var $1235 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1221, $1231), $1232, $1233, $1234, $1235);
                                var $1236 = Parser$Reply$value$(_reply$pst$15, Nat$from_base$(10n, $1229));
                                var $1230 = $1236;
                                break;
                        };
                        var $1222 = $1230;
                        break;
                };
                var $1220 = $1222;
                break;
        };
        return $1220;
    };
    const Parser$nat = x0 => Parser$nat$(x0);
    const Nat$gte = a0 => a1 => (a0 >= a1);
    const Nat$pow = a0 => a1 => (a0 ** a1);

    function Kindelia$Term$word$(_numb$1) {
        var $1237 = ({
            _: 'Kindelia.Term.word',
            'numb': _numb$1
        });
        return $1237;
    };
    const Kindelia$Term$word = x0 => Kindelia$Term$word$(x0);

    function U64$new$(_value$1) {
        var $1238 = word_to_u64(_value$1);
        return $1238;
    };
    const U64$new = x0 => U64$new$(x0);

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
                    var $1239 = _x$4;
                    return $1239;
                } else {
                    var $1240 = (self - 1n);
                    var $1241 = Nat$apply$($1240, _f$3, _f$3(_x$4));
                    return $1241;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$(_size$1) {
        var $1242 = null;
        return $1242;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$i$(_pred$2) {
        var $1243 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $1243;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$o$(_pred$2) {
        var $1244 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $1244;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $1246 = self.pred;
                var $1247 = Word$i$($1246);
                var $1245 = $1247;
                break;
            case 'Word.i':
                var $1248 = self.pred;
                var $1249 = Word$o$(Word$inc$($1248));
                var $1245 = $1249;
                break;
            case 'Word.e':
                var $1250 = Word$e;
                var $1245 = $1250;
                break;
        };
        return $1245;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $1252 = Word$e;
            var $1251 = $1252;
        } else {
            var $1253 = (self - 1n);
            var $1254 = Word$o$(Word$zero$($1253));
            var $1251 = $1254;
        };
        return $1251;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $1255 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $1255;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);
    const Nat$to_u64 = a0 => (a0 & 0xFFFFFFFFFFFFFFFFn);

    function Kindelia$parse$term$word$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1257 = self.err;
                var _reply$8 = Kindelia$parse$text$("#", _pst$2);
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
                                        var _reply$22 = Parser$nat$(_reply$pst$16);
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
                                                        var self = ($1280 >= (2n ** 64n));
                                                        if (self) {
                                                            var $1288 = Parser$fail("Number out of bound");
                                                            var $1287 = $1288;
                                                        } else {
                                                            var $1289 = (_pst$31 => {
                                                                var $1290 = Parser$Reply$value$(_pst$31, Kindelia$Term$word$(($1280 & 0xFFFFFFFFFFFFFFFFn)));
                                                                return $1290;
                                                            });
                                                            var $1287 = $1289;
                                                        };
                                                        var $1287 = $1287(_reply$pst$30);
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
    const Kindelia$parse$term$word = x0 => x1 => Kindelia$parse$term$word$(x0, x1);

    function Kindelia$Term$compare$(_val0$1, _val1$2, _iflt$3, _ifeq$4, _ifgt$5) {
        var $1291 = ({
            _: 'Kindelia.Term.compare',
            'val0': _val0$1,
            'val1': _val1$2,
            'iflt': _iflt$3,
            'ifeq': _ifeq$4,
            'ifgt': _ifgt$5
        });
        return $1291;
    };
    const Kindelia$Term$compare = x0 => x1 => x2 => x3 => x4 => Kindelia$Term$compare$(x0, x1, x2, x3, x4);

    function Kindelia$parse$term$compare$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1293 = self.err;
                var _reply$8 = Kindelia$parse$text$("compare", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1295 = self.err;
                        var self = $1293;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1297 = self.value;
                                var $1298 = Parser$Reply$error$(Parser$Error$combine$($1297, $1295));
                                var $1296 = $1298;
                                break;
                            case 'Maybe.none':
                                var $1299 = Parser$Reply$error$($1295);
                                var $1296 = $1299;
                                break;
                        };
                        var $1294 = $1296;
                        break;
                    case 'Parser.Reply.value':
                        var $1300 = self.pst;
                        var self = $1300;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1302 = self.err;
                                var $1303 = self.nam;
                                var $1304 = self.ini;
                                var $1305 = self.idx;
                                var $1306 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1293, $1302), $1303, $1304, $1305, $1306);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1308 = self.err;
                                        var _reply$22 = Kindelia$parse$term$(_world$1)(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1310 = self.err;
                                                var self = $1308;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1312 = self.value;
                                                        var $1313 = Parser$Reply$error$(Parser$Error$combine$($1312, $1310));
                                                        var $1311 = $1313;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1314 = Parser$Reply$error$($1310);
                                                        var $1311 = $1314;
                                                        break;
                                                };
                                                var $1309 = $1311;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1315 = self.pst;
                                                var $1316 = self.val;
                                                var self = $1315;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1318 = self.err;
                                                        var $1319 = self.nam;
                                                        var $1320 = self.ini;
                                                        var $1321 = self.idx;
                                                        var $1322 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1308, $1318), $1319, $1320, $1321, $1322);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $1324 = self.err;
                                                                var _reply$36 = Kindelia$parse$term$(_world$1)(_reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1326 = self.err;
                                                                        var self = $1324;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $1328 = self.value;
                                                                                var $1329 = Parser$Reply$error$(Parser$Error$combine$($1328, $1326));
                                                                                var $1327 = $1329;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $1330 = Parser$Reply$error$($1326);
                                                                                var $1327 = $1330;
                                                                                break;
                                                                        };
                                                                        var $1325 = $1327;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1331 = self.pst;
                                                                        var $1332 = self.val;
                                                                        var self = $1331;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $1334 = self.err;
                                                                                var $1335 = self.nam;
                                                                                var $1336 = self.ini;
                                                                                var $1337 = self.idx;
                                                                                var $1338 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($1324, $1334), $1335, $1336, $1337, $1338);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $1340 = self.err;
                                                                                        var _reply$50 = Kindelia$parse$text$("{", _reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1342 = self.err;
                                                                                                var self = $1340;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $1344 = self.value;
                                                                                                        var $1345 = Parser$Reply$error$(Parser$Error$combine$($1344, $1342));
                                                                                                        var $1343 = $1345;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $1346 = Parser$Reply$error$($1342);
                                                                                                        var $1343 = $1346;
                                                                                                        break;
                                                                                                };
                                                                                                var $1341 = $1343;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1347 = self.pst;
                                                                                                var self = $1347;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $1349 = self.err;
                                                                                                        var $1350 = self.nam;
                                                                                                        var $1351 = self.ini;
                                                                                                        var $1352 = self.idx;
                                                                                                        var $1353 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($1340, $1349), $1350, $1351, $1352, $1353);
                                                                                                        var self = _reply$pst$58;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $1355 = self.err;
                                                                                                                var _reply$64 = Kindelia$parse$text$("_<_:", _reply$pst$58);
                                                                                                                var self = _reply$64;
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $1357 = self.err;
                                                                                                                        var self = $1355;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Maybe.some':
                                                                                                                                var $1359 = self.value;
                                                                                                                                var $1360 = Parser$Reply$error$(Parser$Error$combine$($1359, $1357));
                                                                                                                                var $1358 = $1360;
                                                                                                                                break;
                                                                                                                            case 'Maybe.none':
                                                                                                                                var $1361 = Parser$Reply$error$($1357);
                                                                                                                                var $1358 = $1361;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1356 = $1358;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $1362 = self.pst;
                                                                                                                        var self = $1362;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $1364 = self.err;
                                                                                                                                var $1365 = self.nam;
                                                                                                                                var $1366 = self.ini;
                                                                                                                                var $1367 = self.idx;
                                                                                                                                var $1368 = self.str;
                                                                                                                                var _reply$pst$72 = Parser$State$new$(Parser$Error$maybe_combine$($1355, $1364), $1365, $1366, $1367, $1368);
                                                                                                                                var self = _reply$pst$72;
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.State.new':
                                                                                                                                        var $1370 = self.err;
                                                                                                                                        var _reply$78 = Kindelia$parse$term$(_world$1)(_reply$pst$72);
                                                                                                                                        var self = _reply$78;
                                                                                                                                        switch (self._) {
                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                var $1372 = self.err;
                                                                                                                                                var self = $1370;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                        var $1374 = self.value;
                                                                                                                                                        var $1375 = Parser$Reply$error$(Parser$Error$combine$($1374, $1372));
                                                                                                                                                        var $1373 = $1375;
                                                                                                                                                        break;
                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                        var $1376 = Parser$Reply$error$($1372);
                                                                                                                                                        var $1373 = $1376;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1371 = $1373;
                                                                                                                                                break;
                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                var $1377 = self.pst;
                                                                                                                                                var $1378 = self.val;
                                                                                                                                                var self = $1377;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                        var $1380 = self.err;
                                                                                                                                                        var $1381 = self.nam;
                                                                                                                                                        var $1382 = self.ini;
                                                                                                                                                        var $1383 = self.idx;
                                                                                                                                                        var $1384 = self.str;
                                                                                                                                                        var _reply$pst$86 = Parser$State$new$(Parser$Error$maybe_combine$($1370, $1380), $1381, $1382, $1383, $1384);
                                                                                                                                                        var self = _reply$pst$86;
                                                                                                                                                        switch (self._) {
                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                var $1386 = self.err;
                                                                                                                                                                var _reply$92 = Kindelia$parse$text$("_=_:", _reply$pst$86);
                                                                                                                                                                var self = _reply$92;
                                                                                                                                                                switch (self._) {
                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                        var $1388 = self.err;
                                                                                                                                                                        var self = $1386;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                var $1390 = self.value;
                                                                                                                                                                                var $1391 = Parser$Reply$error$(Parser$Error$combine$($1390, $1388));
                                                                                                                                                                                var $1389 = $1391;
                                                                                                                                                                                break;
                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                var $1392 = Parser$Reply$error$($1388);
                                                                                                                                                                                var $1389 = $1392;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $1387 = $1389;
                                                                                                                                                                        break;
                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                        var $1393 = self.pst;
                                                                                                                                                                        var self = $1393;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                var $1395 = self.err;
                                                                                                                                                                                var $1396 = self.nam;
                                                                                                                                                                                var $1397 = self.ini;
                                                                                                                                                                                var $1398 = self.idx;
                                                                                                                                                                                var $1399 = self.str;
                                                                                                                                                                                var _reply$pst$100 = Parser$State$new$(Parser$Error$maybe_combine$($1386, $1395), $1396, $1397, $1398, $1399);
                                                                                                                                                                                var self = _reply$pst$100;
                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                        var $1401 = self.err;
                                                                                                                                                                                        var _reply$106 = Kindelia$parse$term$(_world$1)(_reply$pst$100);
                                                                                                                                                                                        var self = _reply$106;
                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                                                                var $1403 = self.err;
                                                                                                                                                                                                var self = $1401;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                                                                        var $1405 = self.value;
                                                                                                                                                                                                        var $1406 = Parser$Reply$error$(Parser$Error$combine$($1405, $1403));
                                                                                                                                                                                                        var $1404 = $1406;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                                                                        var $1407 = Parser$Reply$error$($1403);
                                                                                                                                                                                                        var $1404 = $1407;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $1402 = $1404;
                                                                                                                                                                                                break;
                                                                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                                                                var $1408 = self.pst;
                                                                                                                                                                                                var $1409 = self.val;
                                                                                                                                                                                                var self = $1408;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                        var $1411 = self.err;
                                                                                                                                                                                                        var $1412 = self.nam;
                                                                                                                                                                                                        var $1413 = self.ini;
                                                                                                                                                                                                        var $1414 = self.idx;
                                                                                                                                                                                                        var $1415 = self.str;
                                                                                                                                                                                                        var _reply$pst$114 = Parser$State$new$(Parser$Error$maybe_combine$($1401, $1411), $1412, $1413, $1414, $1415);
                                                                                                                                                                                                        var self = _reply$pst$114;
                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                                                var $1417 = self.err;
                                                                                                                                                                                                                var _reply$120 = Kindelia$parse$text$("_>_:", _reply$pst$114);
                                                                                                                                                                                                                var self = _reply$120;
                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                                                                        var $1419 = self.err;
                                                                                                                                                                                                                        var self = $1417;
                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                                                                var $1421 = self.value;
                                                                                                                                                                                                                                var $1422 = Parser$Reply$error$(Parser$Error$combine$($1421, $1419));
                                                                                                                                                                                                                                var $1420 = $1422;
                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                                                                var $1423 = Parser$Reply$error$($1419);
                                                                                                                                                                                                                                var $1420 = $1423;
                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                        };
                                                                                                                                                                                                                        var $1418 = $1420;
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                                                                        var $1424 = self.pst;
                                                                                                                                                                                                                        var self = $1424;
                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                                                                var $1426 = self.err;
                                                                                                                                                                                                                                var $1427 = self.nam;
                                                                                                                                                                                                                                var $1428 = self.ini;
                                                                                                                                                                                                                                var $1429 = self.idx;
                                                                                                                                                                                                                                var $1430 = self.str;
                                                                                                                                                                                                                                var _reply$pst$128 = Parser$State$new$(Parser$Error$maybe_combine$($1417, $1426), $1427, $1428, $1429, $1430);
                                                                                                                                                                                                                                var self = _reply$pst$128;
                                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                                                        var $1432 = self.err;
                                                                                                                                                                                                                                        var _reply$134 = Kindelia$parse$term$(_world$1)(_reply$pst$128);
                                                                                                                                                                                                                                        var self = _reply$134;
                                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                                                                                                                var $1434 = self.err;
                                                                                                                                                                                                                                                var self = $1432;
                                                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                                                                                                                        var $1436 = self.value;
                                                                                                                                                                                                                                                        var $1437 = Parser$Reply$error$(Parser$Error$combine$($1436, $1434));
                                                                                                                                                                                                                                                        var $1435 = $1437;
                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                                                                                                                        var $1438 = Parser$Reply$error$($1434);
                                                                                                                                                                                                                                                        var $1435 = $1438;
                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                var $1433 = $1435;
                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                                                                                                                var $1439 = self.pst;
                                                                                                                                                                                                                                                var $1440 = self.val;
                                                                                                                                                                                                                                                var self = $1439;
                                                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                                                                        var $1442 = self.err;
                                                                                                                                                                                                                                                        var $1443 = self.nam;
                                                                                                                                                                                                                                                        var $1444 = self.ini;
                                                                                                                                                                                                                                                        var $1445 = self.idx;
                                                                                                                                                                                                                                                        var $1446 = self.str;
                                                                                                                                                                                                                                                        var _reply$pst$142 = Parser$State$new$(Parser$Error$maybe_combine$($1432, $1442), $1443, $1444, $1445, $1446);
                                                                                                                                                                                                                                                        var self = _reply$pst$142;
                                                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                                                                                                var $1448 = self.err;
                                                                                                                                                                                                                                                                var _reply$148 = Kindelia$parse$text$("}", _reply$pst$142);
                                                                                                                                                                                                                                                                var self = _reply$148;
                                                                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                                                                                                                        var $1450 = self.err;
                                                                                                                                                                                                                                                                        var self = $1448;
                                                                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                                                                                                                var $1452 = self.value;
                                                                                                                                                                                                                                                                                var $1453 = Parser$Reply$error$(Parser$Error$combine$($1452, $1450));
                                                                                                                                                                                                                                                                                var $1451 = $1453;
                                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                                                                                                                var $1454 = Parser$Reply$error$($1450);
                                                                                                                                                                                                                                                                                var $1451 = $1454;
                                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                                                        var $1449 = $1451;
                                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                                                                                                                        var $1455 = self.pst;
                                                                                                                                                                                                                                                                        var self = $1455;
                                                                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                                                                                                                var $1457 = self.err;
                                                                                                                                                                                                                                                                                var $1458 = self.nam;
                                                                                                                                                                                                                                                                                var $1459 = self.ini;
                                                                                                                                                                                                                                                                                var $1460 = self.idx;
                                                                                                                                                                                                                                                                                var $1461 = self.str;
                                                                                                                                                                                                                                                                                var _reply$pst$156 = Parser$State$new$(Parser$Error$maybe_combine$($1448, $1457), $1458, $1459, $1460, $1461);
                                                                                                                                                                                                                                                                                var $1462 = Parser$Reply$value$(_reply$pst$156, Kindelia$Term$compare$($1316, $1332, $1378, $1409, $1440));
                                                                                                                                                                                                                                                                                var $1456 = $1462;
                                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                                                        var $1449 = $1456;
                                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                                var $1447 = $1449;
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                                        var $1441 = $1447;
                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                var $1433 = $1441;
                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                        var $1431 = $1433;
                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                var $1425 = $1431;
                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                        };
                                                                                                                                                                                                                        var $1418 = $1425;
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                };
                                                                                                                                                                                                                var $1416 = $1418;
                                                                                                                                                                                                                break;
                                                                                                                                                                                                        };
                                                                                                                                                                                                        var $1410 = $1416;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $1402 = $1410;
                                                                                                                                                                                                break;
                                                                                                                                                                                        };
                                                                                                                                                                                        var $1400 = $1402;
                                                                                                                                                                                        break;
                                                                                                                                                                                };
                                                                                                                                                                                var $1394 = $1400;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $1387 = $1394;
                                                                                                                                                                        break;
                                                                                                                                                                };
                                                                                                                                                                var $1385 = $1387;
                                                                                                                                                                break;
                                                                                                                                                        };
                                                                                                                                                        var $1379 = $1385;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1371 = $1379;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $1369 = $1371;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $1363 = $1369;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1356 = $1363;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $1354 = $1356;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1348 = $1354;
                                                                                                        break;
                                                                                                };
                                                                                                var $1341 = $1348;
                                                                                                break;
                                                                                        };
                                                                                        var $1339 = $1341;
                                                                                        break;
                                                                                };
                                                                                var $1333 = $1339;
                                                                                break;
                                                                        };
                                                                        var $1325 = $1333;
                                                                        break;
                                                                };
                                                                var $1323 = $1325;
                                                                break;
                                                        };
                                                        var $1317 = $1323;
                                                        break;
                                                };
                                                var $1309 = $1317;
                                                break;
                                        };
                                        var $1307 = $1309;
                                        break;
                                };
                                var $1301 = $1307;
                                break;
                        };
                        var $1294 = $1301;
                        break;
                };
                var $1292 = $1294;
                break;
        };
        return $1292;
    };
    const Kindelia$parse$term$compare = x0 => x1 => Kindelia$parse$term$compare$(x0, x1);
    const Kindelia$Operation$add = ({
        _: 'Kindelia.Operation.add'
    });
    const Kindelia$Operation$sub = ({
        _: 'Kindelia.Operation.sub'
    });
    const Kindelia$Operation$mul = ({
        _: 'Kindelia.Operation.mul'
    });
    const Kindelia$Operation$div = ({
        _: 'Kindelia.Operation.div'
    });
    const Kindelia$Operation$mod = ({
        _: 'Kindelia.Operation.mod'
    });
    const Kindelia$Operation$or = ({
        _: 'Kindelia.Operation.or'
    });
    const Kindelia$Operation$and = ({
        _: 'Kindelia.Operation.and'
    });
    const Kindelia$Operation$xor = ({
        _: 'Kindelia.Operation.xor'
    });
    const Kindelia$parse$term$operation = Parser$choice(List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1464 = self.err;
                var _reply$7 = Kindelia$parse$text$("+", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1466 = self.err;
                        var self = $1464;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1468 = self.value;
                                var $1469 = Parser$Reply$error$(Parser$Error$combine$($1468, $1466));
                                var $1467 = $1469;
                                break;
                            case 'Maybe.none':
                                var $1470 = Parser$Reply$error$($1466);
                                var $1467 = $1470;
                                break;
                        };
                        var $1465 = $1467;
                        break;
                    case 'Parser.Reply.value':
                        var $1471 = self.pst;
                        var self = $1471;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1473 = self.err;
                                var $1474 = self.nam;
                                var $1475 = self.ini;
                                var $1476 = self.idx;
                                var $1477 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1464, $1473), $1474, $1475, $1476, $1477);
                                var $1478 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Kindelia$Operation$add));
                                var $1472 = $1478;
                                break;
                        };
                        var $1465 = $1472;
                        break;
                };
                var $1463 = $1465;
                break;
        };
        return $1463;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1480 = self.err;
                var _reply$7 = Kindelia$parse$text$("-", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1482 = self.err;
                        var self = $1480;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1484 = self.value;
                                var $1485 = Parser$Reply$error$(Parser$Error$combine$($1484, $1482));
                                var $1483 = $1485;
                                break;
                            case 'Maybe.none':
                                var $1486 = Parser$Reply$error$($1482);
                                var $1483 = $1486;
                                break;
                        };
                        var $1481 = $1483;
                        break;
                    case 'Parser.Reply.value':
                        var $1487 = self.pst;
                        var self = $1487;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1489 = self.err;
                                var $1490 = self.nam;
                                var $1491 = self.ini;
                                var $1492 = self.idx;
                                var $1493 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1480, $1489), $1490, $1491, $1492, $1493);
                                var $1494 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Kindelia$Operation$sub));
                                var $1488 = $1494;
                                break;
                        };
                        var $1481 = $1488;
                        break;
                };
                var $1479 = $1481;
                break;
        };
        return $1479;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1496 = self.err;
                var _reply$7 = Kindelia$parse$text$("*", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1498 = self.err;
                        var self = $1496;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1500 = self.value;
                                var $1501 = Parser$Reply$error$(Parser$Error$combine$($1500, $1498));
                                var $1499 = $1501;
                                break;
                            case 'Maybe.none':
                                var $1502 = Parser$Reply$error$($1498);
                                var $1499 = $1502;
                                break;
                        };
                        var $1497 = $1499;
                        break;
                    case 'Parser.Reply.value':
                        var $1503 = self.pst;
                        var self = $1503;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1505 = self.err;
                                var $1506 = self.nam;
                                var $1507 = self.ini;
                                var $1508 = self.idx;
                                var $1509 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1496, $1505), $1506, $1507, $1508, $1509);
                                var $1510 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Kindelia$Operation$mul));
                                var $1504 = $1510;
                                break;
                        };
                        var $1497 = $1504;
                        break;
                };
                var $1495 = $1497;
                break;
        };
        return $1495;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1512 = self.err;
                var _reply$7 = Kindelia$parse$text$("/", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1514 = self.err;
                        var self = $1512;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1516 = self.value;
                                var $1517 = Parser$Reply$error$(Parser$Error$combine$($1516, $1514));
                                var $1515 = $1517;
                                break;
                            case 'Maybe.none':
                                var $1518 = Parser$Reply$error$($1514);
                                var $1515 = $1518;
                                break;
                        };
                        var $1513 = $1515;
                        break;
                    case 'Parser.Reply.value':
                        var $1519 = self.pst;
                        var self = $1519;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1521 = self.err;
                                var $1522 = self.nam;
                                var $1523 = self.ini;
                                var $1524 = self.idx;
                                var $1525 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1512, $1521), $1522, $1523, $1524, $1525);
                                var $1526 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Kindelia$Operation$div));
                                var $1520 = $1526;
                                break;
                        };
                        var $1513 = $1520;
                        break;
                };
                var $1511 = $1513;
                break;
        };
        return $1511;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1528 = self.err;
                var _reply$7 = Kindelia$parse$text$("%", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1530 = self.err;
                        var self = $1528;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1532 = self.value;
                                var $1533 = Parser$Reply$error$(Parser$Error$combine$($1532, $1530));
                                var $1531 = $1533;
                                break;
                            case 'Maybe.none':
                                var $1534 = Parser$Reply$error$($1530);
                                var $1531 = $1534;
                                break;
                        };
                        var $1529 = $1531;
                        break;
                    case 'Parser.Reply.value':
                        var $1535 = self.pst;
                        var self = $1535;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1537 = self.err;
                                var $1538 = self.nam;
                                var $1539 = self.ini;
                                var $1540 = self.idx;
                                var $1541 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1528, $1537), $1538, $1539, $1540, $1541);
                                var $1542 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Kindelia$Operation$mod));
                                var $1536 = $1542;
                                break;
                        };
                        var $1529 = $1536;
                        break;
                };
                var $1527 = $1529;
                break;
        };
        return $1527;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1544 = self.err;
                var _reply$7 = Kindelia$parse$text$("|", _pst$1);
                var self = _reply$7;
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
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1544, $1553), $1554, $1555, $1556, $1557);
                                var $1558 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Kindelia$Operation$or));
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
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1560 = self.err;
                var _reply$7 = Kindelia$parse$text$("&", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1562 = self.err;
                        var self = $1560;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1564 = self.value;
                                var $1565 = Parser$Reply$error$(Parser$Error$combine$($1564, $1562));
                                var $1563 = $1565;
                                break;
                            case 'Maybe.none':
                                var $1566 = Parser$Reply$error$($1562);
                                var $1563 = $1566;
                                break;
                        };
                        var $1561 = $1563;
                        break;
                    case 'Parser.Reply.value':
                        var $1567 = self.pst;
                        var self = $1567;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1569 = self.err;
                                var $1570 = self.nam;
                                var $1571 = self.ini;
                                var $1572 = self.idx;
                                var $1573 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1560, $1569), $1570, $1571, $1572, $1573);
                                var $1574 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Kindelia$Operation$and));
                                var $1568 = $1574;
                                break;
                        };
                        var $1561 = $1568;
                        break;
                };
                var $1559 = $1561;
                break;
        };
        return $1559;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1576 = self.err;
                var _reply$7 = Kindelia$parse$text$("^", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1578 = self.err;
                        var self = $1576;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1580 = self.value;
                                var $1581 = Parser$Reply$error$(Parser$Error$combine$($1580, $1578));
                                var $1579 = $1581;
                                break;
                            case 'Maybe.none':
                                var $1582 = Parser$Reply$error$($1578);
                                var $1579 = $1582;
                                break;
                        };
                        var $1577 = $1579;
                        break;
                    case 'Parser.Reply.value':
                        var $1583 = self.pst;
                        var self = $1583;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1585 = self.err;
                                var $1586 = self.nam;
                                var $1587 = self.ini;
                                var $1588 = self.idx;
                                var $1589 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1576, $1585), $1586, $1587, $1588, $1589);
                                var $1590 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Kindelia$Operation$xor));
                                var $1584 = $1590;
                                break;
                        };
                        var $1577 = $1584;
                        break;
                };
                var $1575 = $1577;
                break;
        };
        return $1575;
    }), List$cons$((_pst$1 => {
        var $1591 = Parser$Reply$value$(_pst$1, Maybe$none);
        return $1591;
    }), List$nil))))))))));

    function Kindelia$Term$operate$(_oper$1, _val0$2, _val1$3) {
        var $1592 = ({
            _: 'Kindelia.Term.operate',
            'oper': _oper$1,
            'val0': _val0$2,
            'val1': _val1$3
        });
        return $1592;
    };
    const Kindelia$Term$operate = x0 => x1 => x2 => Kindelia$Term$operate$(x0, x1, x2);

    function Kindelia$parse$term$operate$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1594 = self.err;
                var _reply$8 = Kindelia$parse$term$operation(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1596 = self.err;
                        var self = $1594;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1598 = self.value;
                                var $1599 = Parser$Reply$error$(Parser$Error$combine$($1598, $1596));
                                var $1597 = $1599;
                                break;
                            case 'Maybe.none':
                                var $1600 = Parser$Reply$error$($1596);
                                var $1597 = $1600;
                                break;
                        };
                        var $1595 = $1597;
                        break;
                    case 'Parser.Reply.value':
                        var $1601 = self.pst;
                        var $1602 = self.val;
                        var self = $1601;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1604 = self.err;
                                var $1605 = self.nam;
                                var $1606 = self.ini;
                                var $1607 = self.idx;
                                var $1608 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1594, $1604), $1605, $1606, $1607, $1608);
                                var self = $1602;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $1610 = self.value;
                                        var $1611 = (_pst$18 => {
                                            var self = _pst$18;
                                            switch (self._) {
                                                case 'Parser.State.new':
                                                    var $1613 = self.err;
                                                    var _reply$24 = Kindelia$parse$text$("(", _pst$18);
                                                    var self = _reply$24;
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $1615 = self.err;
                                                            var self = $1613;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $1617 = self.value;
                                                                    var $1618 = Parser$Reply$error$(Parser$Error$combine$($1617, $1615));
                                                                    var $1616 = $1618;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $1619 = Parser$Reply$error$($1615);
                                                                    var $1616 = $1619;
                                                                    break;
                                                            };
                                                            var $1614 = $1616;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $1620 = self.pst;
                                                            var self = $1620;
                                                            switch (self._) {
                                                                case 'Parser.State.new':
                                                                    var $1622 = self.err;
                                                                    var $1623 = self.nam;
                                                                    var $1624 = self.ini;
                                                                    var $1625 = self.idx;
                                                                    var $1626 = self.str;
                                                                    var _reply$pst$32 = Parser$State$new$(Parser$Error$maybe_combine$($1613, $1622), $1623, $1624, $1625, $1626);
                                                                    var self = _reply$pst$32;
                                                                    switch (self._) {
                                                                        case 'Parser.State.new':
                                                                            var $1628 = self.err;
                                                                            var _reply$38 = Kindelia$parse$term$(_world$1)(_reply$pst$32);
                                                                            var self = _reply$38;
                                                                            switch (self._) {
                                                                                case 'Parser.Reply.error':
                                                                                    var $1630 = self.err;
                                                                                    var self = $1628;
                                                                                    switch (self._) {
                                                                                        case 'Maybe.some':
                                                                                            var $1632 = self.value;
                                                                                            var $1633 = Parser$Reply$error$(Parser$Error$combine$($1632, $1630));
                                                                                            var $1631 = $1633;
                                                                                            break;
                                                                                        case 'Maybe.none':
                                                                                            var $1634 = Parser$Reply$error$($1630);
                                                                                            var $1631 = $1634;
                                                                                            break;
                                                                                    };
                                                                                    var $1629 = $1631;
                                                                                    break;
                                                                                case 'Parser.Reply.value':
                                                                                    var $1635 = self.pst;
                                                                                    var $1636 = self.val;
                                                                                    var self = $1635;
                                                                                    switch (self._) {
                                                                                        case 'Parser.State.new':
                                                                                            var $1638 = self.err;
                                                                                            var $1639 = self.nam;
                                                                                            var $1640 = self.ini;
                                                                                            var $1641 = self.idx;
                                                                                            var $1642 = self.str;
                                                                                            var _reply$pst$46 = Parser$State$new$(Parser$Error$maybe_combine$($1628, $1638), $1639, $1640, $1641, $1642);
                                                                                            var self = _reply$pst$46;
                                                                                            switch (self._) {
                                                                                                case 'Parser.State.new':
                                                                                                    var $1644 = self.err;
                                                                                                    var _reply$52 = Parser$maybe$(Kindelia$parse$text(","), _reply$pst$46);
                                                                                                    var self = _reply$52;
                                                                                                    switch (self._) {
                                                                                                        case 'Parser.Reply.error':
                                                                                                            var $1646 = self.err;
                                                                                                            var self = $1644;
                                                                                                            switch (self._) {
                                                                                                                case 'Maybe.some':
                                                                                                                    var $1648 = self.value;
                                                                                                                    var $1649 = Parser$Reply$error$(Parser$Error$combine$($1648, $1646));
                                                                                                                    var $1647 = $1649;
                                                                                                                    break;
                                                                                                                case 'Maybe.none':
                                                                                                                    var $1650 = Parser$Reply$error$($1646);
                                                                                                                    var $1647 = $1650;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $1645 = $1647;
                                                                                                            break;
                                                                                                        case 'Parser.Reply.value':
                                                                                                            var $1651 = self.pst;
                                                                                                            var self = $1651;
                                                                                                            switch (self._) {
                                                                                                                case 'Parser.State.new':
                                                                                                                    var $1653 = self.err;
                                                                                                                    var $1654 = self.nam;
                                                                                                                    var $1655 = self.ini;
                                                                                                                    var $1656 = self.idx;
                                                                                                                    var $1657 = self.str;
                                                                                                                    var _reply$pst$60 = Parser$State$new$(Parser$Error$maybe_combine$($1644, $1653), $1654, $1655, $1656, $1657);
                                                                                                                    var self = _reply$pst$60;
                                                                                                                    switch (self._) {
                                                                                                                        case 'Parser.State.new':
                                                                                                                            var $1659 = self.err;
                                                                                                                            var _reply$66 = Kindelia$parse$term$(_world$1)(_reply$pst$60);
                                                                                                                            var self = _reply$66;
                                                                                                                            switch (self._) {
                                                                                                                                case 'Parser.Reply.error':
                                                                                                                                    var $1661 = self.err;
                                                                                                                                    var self = $1659;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Maybe.some':
                                                                                                                                            var $1663 = self.value;
                                                                                                                                            var $1664 = Parser$Reply$error$(Parser$Error$combine$($1663, $1661));
                                                                                                                                            var $1662 = $1664;
                                                                                                                                            break;
                                                                                                                                        case 'Maybe.none':
                                                                                                                                            var $1665 = Parser$Reply$error$($1661);
                                                                                                                                            var $1662 = $1665;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1660 = $1662;
                                                                                                                                    break;
                                                                                                                                case 'Parser.Reply.value':
                                                                                                                                    var $1666 = self.pst;
                                                                                                                                    var $1667 = self.val;
                                                                                                                                    var self = $1666;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Parser.State.new':
                                                                                                                                            var $1669 = self.err;
                                                                                                                                            var $1670 = self.nam;
                                                                                                                                            var $1671 = self.ini;
                                                                                                                                            var $1672 = self.idx;
                                                                                                                                            var $1673 = self.str;
                                                                                                                                            var _reply$pst$74 = Parser$State$new$(Parser$Error$maybe_combine$($1659, $1669), $1670, $1671, $1672, $1673);
                                                                                                                                            var self = _reply$pst$74;
                                                                                                                                            switch (self._) {
                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                    var $1675 = self.err;
                                                                                                                                                    var _reply$80 = Kindelia$parse$text$(")", _reply$pst$74);
                                                                                                                                                    var self = _reply$80;
                                                                                                                                                    switch (self._) {
                                                                                                                                                        case 'Parser.Reply.error':
                                                                                                                                                            var $1677 = self.err;
                                                                                                                                                            var self = $1675;
                                                                                                                                                            switch (self._) {
                                                                                                                                                                case 'Maybe.some':
                                                                                                                                                                    var $1679 = self.value;
                                                                                                                                                                    var $1680 = Parser$Reply$error$(Parser$Error$combine$($1679, $1677));
                                                                                                                                                                    var $1678 = $1680;
                                                                                                                                                                    break;
                                                                                                                                                                case 'Maybe.none':
                                                                                                                                                                    var $1681 = Parser$Reply$error$($1677);
                                                                                                                                                                    var $1678 = $1681;
                                                                                                                                                                    break;
                                                                                                                                                            };
                                                                                                                                                            var $1676 = $1678;
                                                                                                                                                            break;
                                                                                                                                                        case 'Parser.Reply.value':
                                                                                                                                                            var $1682 = self.pst;
                                                                                                                                                            var self = $1682;
                                                                                                                                                            switch (self._) {
                                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                                    var $1684 = self.err;
                                                                                                                                                                    var $1685 = self.nam;
                                                                                                                                                                    var $1686 = self.ini;
                                                                                                                                                                    var $1687 = self.idx;
                                                                                                                                                                    var $1688 = self.str;
                                                                                                                                                                    var _reply$pst$88 = Parser$State$new$(Parser$Error$maybe_combine$($1675, $1684), $1685, $1686, $1687, $1688);
                                                                                                                                                                    var $1689 = Parser$Reply$value$(_reply$pst$88, Kindelia$Term$operate$($1610, $1636, $1667));
                                                                                                                                                                    var $1683 = $1689;
                                                                                                                                                                    break;
                                                                                                                                                            };
                                                                                                                                                            var $1676 = $1683;
                                                                                                                                                            break;
                                                                                                                                                    };
                                                                                                                                                    var $1674 = $1676;
                                                                                                                                                    break;
                                                                                                                                            };
                                                                                                                                            var $1668 = $1674;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1660 = $1668;
                                                                                                                                    break;
                                                                                                                            };
                                                                                                                            var $1658 = $1660;
                                                                                                                            break;
                                                                                                                    };
                                                                                                                    var $1652 = $1658;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $1645 = $1652;
                                                                                                            break;
                                                                                                    };
                                                                                                    var $1643 = $1645;
                                                                                                    break;
                                                                                            };
                                                                                            var $1637 = $1643;
                                                                                            break;
                                                                                    };
                                                                                    var $1629 = $1637;
                                                                                    break;
                                                                            };
                                                                            var $1627 = $1629;
                                                                            break;
                                                                    };
                                                                    var $1621 = $1627;
                                                                    break;
                                                            };
                                                            var $1614 = $1621;
                                                            break;
                                                    };
                                                    var $1612 = $1614;
                                                    break;
                                            };
                                            return $1612;
                                        });
                                        var $1609 = $1611;
                                        break;
                                    case 'Maybe.none':
                                        var $1690 = Parser$fail("Not an operation.");
                                        var $1609 = $1690;
                                        break;
                                };
                                var $1609 = $1609(_reply$pst$16);
                                var $1603 = $1609;
                                break;
                        };
                        var $1595 = $1603;
                        break;
                };
                var $1593 = $1595;
                break;
        };
        return $1593;
    };
    const Kindelia$parse$term$operate = x0 => x1 => Kindelia$parse$term$operate$(x0, x1);

    function Kindelia$Term$bind$(_bond$1, _expr$2, _cont$3) {
        var $1691 = ({
            _: 'Kindelia.Term.bind',
            'bond': _bond$1,
            'expr': _expr$2,
            'cont': _cont$3
        });
        return $1691;
    };
    const Kindelia$Term$bind = x0 => x1 => x2 => Kindelia$Term$bind$(x0, x1, x2);

    function Kindelia$parse$term$bind$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1693 = self.err;
                var _reply$8 = Kindelia$parse$text$("bind", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1695 = self.err;
                        var self = $1693;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1697 = self.value;
                                var $1698 = Parser$Reply$error$(Parser$Error$combine$($1697, $1695));
                                var $1696 = $1698;
                                break;
                            case 'Maybe.none':
                                var $1699 = Parser$Reply$error$($1695);
                                var $1696 = $1699;
                                break;
                        };
                        var $1694 = $1696;
                        break;
                    case 'Parser.Reply.value':
                        var $1700 = self.pst;
                        var self = $1700;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1702 = self.err;
                                var $1703 = self.nam;
                                var $1704 = self.ini;
                                var $1705 = self.idx;
                                var $1706 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1693, $1702), $1703, $1704, $1705, $1706);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1708 = self.err;
                                        var _reply$22 = Kindelia$parse$name$(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1710 = self.err;
                                                var self = $1708;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1712 = self.value;
                                                        var $1713 = Parser$Reply$error$(Parser$Error$combine$($1712, $1710));
                                                        var $1711 = $1713;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1714 = Parser$Reply$error$($1710);
                                                        var $1711 = $1714;
                                                        break;
                                                };
                                                var $1709 = $1711;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1715 = self.pst;
                                                var $1716 = self.val;
                                                var self = $1715;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1718 = self.err;
                                                        var $1719 = self.nam;
                                                        var $1720 = self.ini;
                                                        var $1721 = self.idx;
                                                        var $1722 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1708, $1718), $1719, $1720, $1721, $1722);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $1724 = self.err;
                                                                var _reply$36 = Kindelia$parse$text$("{", _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1726 = self.err;
                                                                        var self = $1724;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $1728 = self.value;
                                                                                var $1729 = Parser$Reply$error$(Parser$Error$combine$($1728, $1726));
                                                                                var $1727 = $1729;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $1730 = Parser$Reply$error$($1726);
                                                                                var $1727 = $1730;
                                                                                break;
                                                                        };
                                                                        var $1725 = $1727;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1731 = self.pst;
                                                                        var self = $1731;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $1733 = self.err;
                                                                                var $1734 = self.nam;
                                                                                var $1735 = self.ini;
                                                                                var $1736 = self.idx;
                                                                                var $1737 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($1724, $1733), $1734, $1735, $1736, $1737);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $1739 = self.err;
                                                                                        var _reply$50 = Kindelia$parse$term$(_world$1)(_reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1741 = self.err;
                                                                                                var self = $1739;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $1743 = self.value;
                                                                                                        var $1744 = Parser$Reply$error$(Parser$Error$combine$($1743, $1741));
                                                                                                        var $1742 = $1744;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $1745 = Parser$Reply$error$($1741);
                                                                                                        var $1742 = $1745;
                                                                                                        break;
                                                                                                };
                                                                                                var $1740 = $1742;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1746 = self.pst;
                                                                                                var $1747 = self.val;
                                                                                                var self = $1746;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $1749 = self.err;
                                                                                                        var $1750 = self.nam;
                                                                                                        var $1751 = self.ini;
                                                                                                        var $1752 = self.idx;
                                                                                                        var $1753 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($1739, $1749), $1750, $1751, $1752, $1753);
                                                                                                        var self = _reply$pst$58;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $1755 = self.err;
                                                                                                                var _reply$64 = Kindelia$parse$text$("}", _reply$pst$58);
                                                                                                                var self = _reply$64;
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $1757 = self.err;
                                                                                                                        var self = $1755;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Maybe.some':
                                                                                                                                var $1759 = self.value;
                                                                                                                                var $1760 = Parser$Reply$error$(Parser$Error$combine$($1759, $1757));
                                                                                                                                var $1758 = $1760;
                                                                                                                                break;
                                                                                                                            case 'Maybe.none':
                                                                                                                                var $1761 = Parser$Reply$error$($1757);
                                                                                                                                var $1758 = $1761;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1756 = $1758;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $1762 = self.pst;
                                                                                                                        var self = $1762;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $1764 = self.err;
                                                                                                                                var $1765 = self.nam;
                                                                                                                                var $1766 = self.ini;
                                                                                                                                var $1767 = self.idx;
                                                                                                                                var $1768 = self.str;
                                                                                                                                var _reply$pst$72 = Parser$State$new$(Parser$Error$maybe_combine$($1755, $1764), $1765, $1766, $1767, $1768);
                                                                                                                                var self = _reply$pst$72;
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.State.new':
                                                                                                                                        var $1770 = self.err;
                                                                                                                                        var _reply$78 = Kindelia$parse$term$(_world$1)(_reply$pst$72);
                                                                                                                                        var self = _reply$78;
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
                                                                                                                                                        var _reply$pst$86 = Parser$State$new$(Parser$Error$maybe_combine$($1770, $1780), $1781, $1782, $1783, $1784);
                                                                                                                                                        var $1785 = Parser$Reply$value$(_reply$pst$86, Kindelia$Term$bind$($1716, $1747, $1778));
                                                                                                                                                        var $1779 = $1785;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1771 = $1779;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $1769 = $1771;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $1763 = $1769;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1756 = $1763;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $1754 = $1756;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1748 = $1754;
                                                                                                        break;
                                                                                                };
                                                                                                var $1740 = $1748;
                                                                                                break;
                                                                                        };
                                                                                        var $1738 = $1740;
                                                                                        break;
                                                                                };
                                                                                var $1732 = $1738;
                                                                                break;
                                                                        };
                                                                        var $1725 = $1732;
                                                                        break;
                                                                };
                                                                var $1723 = $1725;
                                                                break;
                                                        };
                                                        var $1717 = $1723;
                                                        break;
                                                };
                                                var $1709 = $1717;
                                                break;
                                        };
                                        var $1707 = $1709;
                                        break;
                                };
                                var $1701 = $1707;
                                break;
                        };
                        var $1694 = $1701;
                        break;
                };
                var $1692 = $1694;
                break;
        };
        return $1692;
    };
    const Kindelia$parse$term$bind = x0 => x1 => Kindelia$parse$term$bind$(x0, x1);

    function Kindelia$Term$call$(_bond$1, _args$2) {
        var $1786 = ({
            _: 'Kindelia.Term.call',
            'bond': _bond$1,
            'args': _args$2
        });
        return $1786;
    };
    const Kindelia$Term$call = x0 => x1 => Kindelia$Term$call$(x0, x1);

    function Kindelia$parse$term$call$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1788 = self.err;
                var _reply$8 = Kindelia$parse$name$(_pst$2);
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
                                        var _reply$22 = Parser$wrap$(Kindelia$parse$text("("), (_pst$22 => {
                                            var self = _pst$22;
                                            switch (self._) {
                                                case 'Parser.State.new':
                                                    var $1807 = self.err;
                                                    var _reply$28 = Kindelia$parse$term$(_world$1)(_pst$22);
                                                    var self = _reply$28;
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $1809 = self.err;
                                                            var self = $1807;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $1811 = self.value;
                                                                    var $1812 = Parser$Reply$error$(Parser$Error$combine$($1811, $1809));
                                                                    var $1810 = $1812;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $1813 = Parser$Reply$error$($1809);
                                                                    var $1810 = $1813;
                                                                    break;
                                                            };
                                                            var $1808 = $1810;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $1814 = self.pst;
                                                            var $1815 = self.val;
                                                            var self = $1814;
                                                            switch (self._) {
                                                                case 'Parser.State.new':
                                                                    var $1817 = self.err;
                                                                    var $1818 = self.nam;
                                                                    var $1819 = self.ini;
                                                                    var $1820 = self.idx;
                                                                    var $1821 = self.str;
                                                                    var _reply$pst$36 = Parser$State$new$(Parser$Error$maybe_combine$($1807, $1817), $1818, $1819, $1820, $1821);
                                                                    var self = _reply$pst$36;
                                                                    switch (self._) {
                                                                        case 'Parser.State.new':
                                                                            var $1823 = self.err;
                                                                            var _reply$42 = Parser$maybe$(Kindelia$parse$text(","), _reply$pst$36);
                                                                            var self = _reply$42;
                                                                            switch (self._) {
                                                                                case 'Parser.Reply.error':
                                                                                    var $1825 = self.err;
                                                                                    var self = $1823;
                                                                                    switch (self._) {
                                                                                        case 'Maybe.some':
                                                                                            var $1827 = self.value;
                                                                                            var $1828 = Parser$Reply$error$(Parser$Error$combine$($1827, $1825));
                                                                                            var $1826 = $1828;
                                                                                            break;
                                                                                        case 'Maybe.none':
                                                                                            var $1829 = Parser$Reply$error$($1825);
                                                                                            var $1826 = $1829;
                                                                                            break;
                                                                                    };
                                                                                    var $1824 = $1826;
                                                                                    break;
                                                                                case 'Parser.Reply.value':
                                                                                    var $1830 = self.pst;
                                                                                    var self = $1830;
                                                                                    switch (self._) {
                                                                                        case 'Parser.State.new':
                                                                                            var $1832 = self.err;
                                                                                            var $1833 = self.nam;
                                                                                            var $1834 = self.ini;
                                                                                            var $1835 = self.idx;
                                                                                            var $1836 = self.str;
                                                                                            var _reply$pst$50 = Parser$State$new$(Parser$Error$maybe_combine$($1823, $1832), $1833, $1834, $1835, $1836);
                                                                                            var $1837 = Parser$Reply$value$(_reply$pst$50, $1815);
                                                                                            var $1831 = $1837;
                                                                                            break;
                                                                                    };
                                                                                    var $1824 = $1831;
                                                                                    break;
                                                                            };
                                                                            var $1822 = $1824;
                                                                            break;
                                                                    };
                                                                    var $1816 = $1822;
                                                                    break;
                                                            };
                                                            var $1808 = $1816;
                                                            break;
                                                    };
                                                    var $1806 = $1808;
                                                    break;
                                            };
                                            return $1806;
                                        }), Kindelia$parse$text(")"), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1838 = self.err;
                                                var self = $1804;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1840 = self.value;
                                                        var $1841 = Parser$Reply$error$(Parser$Error$combine$($1840, $1838));
                                                        var $1839 = $1841;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1842 = Parser$Reply$error$($1838);
                                                        var $1839 = $1842;
                                                        break;
                                                };
                                                var $1805 = $1839;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1843 = self.pst;
                                                var $1844 = self.val;
                                                var self = $1843;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1846 = self.err;
                                                        var $1847 = self.nam;
                                                        var $1848 = self.ini;
                                                        var $1849 = self.idx;
                                                        var $1850 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1804, $1846), $1847, $1848, $1849, $1850);
                                                        var $1851 = Parser$Reply$value$(_reply$pst$30, Kindelia$Term$call$($1796, $1844));
                                                        var $1845 = $1851;
                                                        break;
                                                };
                                                var $1805 = $1845;
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
    const Kindelia$parse$term$call = x0 => x1 => Kindelia$parse$term$call$(x0, x1);

    function Kindelia$Term$var$(_name$1) {
        var $1852 = ({
            _: 'Kindelia.Term.var',
            'name': _name$1
        });
        return $1852;
    };
    const Kindelia$Term$var = x0 => Kindelia$Term$var$(x0);

    function Kindelia$parse$term$var$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1854 = self.err;
                var _reply$8 = Kindelia$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1856 = self.err;
                        var self = $1854;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1858 = self.value;
                                var $1859 = Parser$Reply$error$(Parser$Error$combine$($1858, $1856));
                                var $1857 = $1859;
                                break;
                            case 'Maybe.none':
                                var $1860 = Parser$Reply$error$($1856);
                                var $1857 = $1860;
                                break;
                        };
                        var $1855 = $1857;
                        break;
                    case 'Parser.Reply.value':
                        var $1861 = self.pst;
                        var $1862 = self.val;
                        var self = $1861;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1864 = self.err;
                                var $1865 = self.nam;
                                var $1866 = self.ini;
                                var $1867 = self.idx;
                                var $1868 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1854, $1864), $1865, $1866, $1867, $1868);
                                var $1869 = Parser$Reply$value$(_reply$pst$16, Kindelia$Term$var$($1862));
                                var $1863 = $1869;
                                break;
                        };
                        var $1855 = $1863;
                        break;
                };
                var $1853 = $1855;
                break;
        };
        return $1853;
    };
    const Kindelia$parse$term$var = x0 => x1 => Kindelia$parse$term$var$(x0, x1);

    function Kindelia$parse$term$(_world$1) {
        var $1870 = Parser$choice(List$cons$(Kindelia$parse$term$let(_world$1), List$cons$(Kindelia$parse$term$create(_world$1), List$cons$(Kindelia$parse$term$match(_world$1), List$cons$(Kindelia$parse$term$word(_world$1), List$cons$(Kindelia$parse$term$compare(_world$1), List$cons$(Kindelia$parse$term$operate(_world$1), List$cons$(Kindelia$parse$term$bind(_world$1), List$cons$(Kindelia$parse$term$call(_world$1), List$cons$(Kindelia$parse$term$var(_world$1), List$nil))))))))));
        return $1870;
    };
    const Kindelia$parse$term = x0 => Kindelia$parse$term$(x0);

    function Kindelia$Bond$new$(_name$1, _ownr$2, _args$3, _otyp$4, _main$5) {
        var $1871 = ({
            _: 'Kindelia.Bond.new',
            'name': _name$1,
            'ownr': _ownr$2,
            'args': _args$3,
            'otyp': _otyp$4,
            'main': _main$5
        });
        return $1871;
    };
    const Kindelia$Bond$new = x0 => x1 => x2 => x3 => x4 => Kindelia$Bond$new$(x0, x1, x2, x3, x4);

    function Kindelia$parse$bond$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1873 = self.err;
                var _reply$8 = Kindelia$parse$text$("bond", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1875 = self.err;
                        var self = $1873;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1877 = self.value;
                                var $1878 = Parser$Reply$error$(Parser$Error$combine$($1877, $1875));
                                var $1876 = $1878;
                                break;
                            case 'Maybe.none':
                                var $1879 = Parser$Reply$error$($1875);
                                var $1876 = $1879;
                                break;
                        };
                        var $1874 = $1876;
                        break;
                    case 'Parser.Reply.value':
                        var $1880 = self.pst;
                        var self = $1880;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1882 = self.err;
                                var $1883 = self.nam;
                                var $1884 = self.ini;
                                var $1885 = self.idx;
                                var $1886 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1873, $1882), $1883, $1884, $1885, $1886);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1888 = self.err;
                                        var _reply$22 = Kindelia$parse$name$(_reply$pst$16);
                                        var self = _reply$22;
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
                                                var $1896 = self.val;
                                                var self = $1895;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1898 = self.err;
                                                        var $1899 = self.nam;
                                                        var $1900 = self.ini;
                                                        var $1901 = self.idx;
                                                        var $1902 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1888, $1898), $1899, $1900, $1901, $1902);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $1904 = self.err;
                                                                var _reply$36 = Parser$wrap$(Kindelia$parse$text("("), Kindelia$parse$ann(_world$1), Kindelia$parse$text(")"), _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1906 = self.err;
                                                                        var self = $1904;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $1908 = self.value;
                                                                                var $1909 = Parser$Reply$error$(Parser$Error$combine$($1908, $1906));
                                                                                var $1907 = $1909;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $1910 = Parser$Reply$error$($1906);
                                                                                var $1907 = $1910;
                                                                                break;
                                                                        };
                                                                        var $1905 = $1907;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1911 = self.pst;
                                                                        var $1912 = self.val;
                                                                        var self = $1911;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $1914 = self.err;
                                                                                var $1915 = self.nam;
                                                                                var $1916 = self.ini;
                                                                                var $1917 = self.idx;
                                                                                var $1918 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($1904, $1914), $1915, $1916, $1917, $1918);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $1920 = self.err;
                                                                                        var _reply$50 = Kindelia$parse$text$(":", _reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1922 = self.err;
                                                                                                var self = $1920;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $1924 = self.value;
                                                                                                        var $1925 = Parser$Reply$error$(Parser$Error$combine$($1924, $1922));
                                                                                                        var $1923 = $1925;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $1926 = Parser$Reply$error$($1922);
                                                                                                        var $1923 = $1926;
                                                                                                        break;
                                                                                                };
                                                                                                var $1921 = $1923;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1927 = self.pst;
                                                                                                var self = $1927;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $1929 = self.err;
                                                                                                        var $1930 = self.nam;
                                                                                                        var $1931 = self.ini;
                                                                                                        var $1932 = self.idx;
                                                                                                        var $1933 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($1920, $1929), $1930, $1931, $1932, $1933);
                                                                                                        var self = _reply$pst$58;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $1935 = self.err;
                                                                                                                var _reply$64 = Kindelia$parse$type$(_world$1)(_reply$pst$58);
                                                                                                                var self = _reply$64;
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $1937 = self.err;
                                                                                                                        var self = $1935;
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
                                                                                                                        var $1936 = $1938;
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
                                                                                                                                var _reply$pst$72 = Parser$State$new$(Parser$Error$maybe_combine$($1935, $1945), $1946, $1947, $1948, $1949);
                                                                                                                                var self = _reply$pst$72;
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.State.new':
                                                                                                                                        var $1951 = self.err;
                                                                                                                                        var _reply$78 = Kindelia$parse$text$("{", _reply$pst$72);
                                                                                                                                        var self = _reply$78;
                                                                                                                                        switch (self._) {
                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                var $1953 = self.err;
                                                                                                                                                var self = $1951;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                        var $1955 = self.value;
                                                                                                                                                        var $1956 = Parser$Reply$error$(Parser$Error$combine$($1955, $1953));
                                                                                                                                                        var $1954 = $1956;
                                                                                                                                                        break;
                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                        var $1957 = Parser$Reply$error$($1953);
                                                                                                                                                        var $1954 = $1957;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1952 = $1954;
                                                                                                                                                break;
                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                var $1958 = self.pst;
                                                                                                                                                var self = $1958;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                        var $1960 = self.err;
                                                                                                                                                        var $1961 = self.nam;
                                                                                                                                                        var $1962 = self.ini;
                                                                                                                                                        var $1963 = self.idx;
                                                                                                                                                        var $1964 = self.str;
                                                                                                                                                        var _reply$pst$86 = Parser$State$new$(Parser$Error$maybe_combine$($1951, $1960), $1961, $1962, $1963, $1964);
                                                                                                                                                        var self = _reply$pst$86;
                                                                                                                                                        switch (self._) {
                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                var $1966 = self.err;
                                                                                                                                                                var _reply$92 = Kindelia$parse$term$(_world$1)(_reply$pst$86);
                                                                                                                                                                var self = _reply$92;
                                                                                                                                                                switch (self._) {
                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                        var $1968 = self.err;
                                                                                                                                                                        var self = $1966;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                var $1970 = self.value;
                                                                                                                                                                                var $1971 = Parser$Reply$error$(Parser$Error$combine$($1970, $1968));
                                                                                                                                                                                var $1969 = $1971;
                                                                                                                                                                                break;
                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                var $1972 = Parser$Reply$error$($1968);
                                                                                                                                                                                var $1969 = $1972;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $1967 = $1969;
                                                                                                                                                                        break;
                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                        var $1973 = self.pst;
                                                                                                                                                                        var $1974 = self.val;
                                                                                                                                                                        var self = $1973;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                var $1976 = self.err;
                                                                                                                                                                                var $1977 = self.nam;
                                                                                                                                                                                var $1978 = self.ini;
                                                                                                                                                                                var $1979 = self.idx;
                                                                                                                                                                                var $1980 = self.str;
                                                                                                                                                                                var _reply$pst$100 = Parser$State$new$(Parser$Error$maybe_combine$($1966, $1976), $1977, $1978, $1979, $1980);
                                                                                                                                                                                var self = _reply$pst$100;
                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                        var $1982 = self.err;
                                                                                                                                                                                        var _reply$106 = Kindelia$parse$text$("}", _reply$pst$100);
                                                                                                                                                                                        var self = _reply$106;
                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                                                                var $1984 = self.err;
                                                                                                                                                                                                var self = $1982;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                                                                        var $1986 = self.value;
                                                                                                                                                                                                        var $1987 = Parser$Reply$error$(Parser$Error$combine$($1986, $1984));
                                                                                                                                                                                                        var $1985 = $1987;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                                                                        var $1988 = Parser$Reply$error$($1984);
                                                                                                                                                                                                        var $1985 = $1988;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $1983 = $1985;
                                                                                                                                                                                                break;
                                                                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                                                                var $1989 = self.pst;
                                                                                                                                                                                                var self = $1989;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                        var $1991 = self.err;
                                                                                                                                                                                                        var $1992 = self.nam;
                                                                                                                                                                                                        var $1993 = self.ini;
                                                                                                                                                                                                        var $1994 = self.idx;
                                                                                                                                                                                                        var $1995 = self.str;
                                                                                                                                                                                                        var _reply$pst$114 = Parser$State$new$(Parser$Error$maybe_combine$($1982, $1991), $1992, $1993, $1994, $1995);
                                                                                                                                                                                                        var $1996 = Parser$Reply$value$(_reply$pst$114, Kindelia$Bond$new$($1896, List$nil, $1912, $1943, $1974));
                                                                                                                                                                                                        var $1990 = $1996;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $1983 = $1990;
                                                                                                                                                                                                break;
                                                                                                                                                                                        };
                                                                                                                                                                                        var $1981 = $1983;
                                                                                                                                                                                        break;
                                                                                                                                                                                };
                                                                                                                                                                                var $1975 = $1981;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $1967 = $1975;
                                                                                                                                                                        break;
                                                                                                                                                                };
                                                                                                                                                                var $1965 = $1967;
                                                                                                                                                                break;
                                                                                                                                                        };
                                                                                                                                                        var $1959 = $1965;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1952 = $1959;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $1950 = $1952;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $1944 = $1950;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1936 = $1944;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $1934 = $1936;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1928 = $1934;
                                                                                                        break;
                                                                                                };
                                                                                                var $1921 = $1928;
                                                                                                break;
                                                                                        };
                                                                                        var $1919 = $1921;
                                                                                        break;
                                                                                };
                                                                                var $1913 = $1919;
                                                                                break;
                                                                        };
                                                                        var $1905 = $1913;
                                                                        break;
                                                                };
                                                                var $1903 = $1905;
                                                                break;
                                                        };
                                                        var $1897 = $1903;
                                                        break;
                                                };
                                                var $1889 = $1897;
                                                break;
                                        };
                                        var $1887 = $1889;
                                        break;
                                };
                                var $1881 = $1887;
                                break;
                        };
                        var $1874 = $1881;
                        break;
                };
                var $1872 = $1874;
                break;
        };
        return $1872;
    };
    const Kindelia$parse$bond = x0 => x1 => Kindelia$parse$bond$(x0, x1);

    function Kindelia$Transaction$new_bond$(_bond$1) {
        var $1997 = ({
            _: 'Kindelia.Transaction.new_bond',
            'bond': _bond$1
        });
        return $1997;
    };
    const Kindelia$Transaction$new_bond = x0 => Kindelia$Transaction$new_bond$(x0);

    function Kindelia$Eval$new$(_term$1, _type$2) {
        var $1998 = ({
            _: 'Kindelia.Eval.new',
            'term': _term$1,
            'type': _type$2
        });
        return $1998;
    };
    const Kindelia$Eval$new = x0 => x1 => Kindelia$Eval$new$(x0, x1);

    function Kindelia$parse$eval$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $2000 = self.err;
                var _reply$8 = Kindelia$parse$text$("eval", _pst$2);
                var self = _reply$8;
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
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2000, $2009), $2010, $2011, $2012, $2013);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $2015 = self.err;
                                        var _reply$22 = Kindelia$parse$text$("{", _reply$pst$16);
                                        var self = _reply$22;
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
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2015, $2024), $2025, $2026, $2027, $2028);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $2030 = self.err;
                                                                var _reply$36 = Kindelia$parse$term$(_world$1)(_reply$pst$30);
                                                                var self = _reply$36;
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
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($2030, $2040), $2041, $2042, $2043, $2044);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $2046 = self.err;
                                                                                        var _reply$50 = Kindelia$parse$text$("}", _reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $2048 = self.err;
                                                                                                var self = $2046;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $2050 = self.value;
                                                                                                        var $2051 = Parser$Reply$error$(Parser$Error$combine$($2050, $2048));
                                                                                                        var $2049 = $2051;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $2052 = Parser$Reply$error$($2048);
                                                                                                        var $2049 = $2052;
                                                                                                        break;
                                                                                                };
                                                                                                var $2047 = $2049;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $2053 = self.pst;
                                                                                                var self = $2053;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $2055 = self.err;
                                                                                                        var $2056 = self.nam;
                                                                                                        var $2057 = self.ini;
                                                                                                        var $2058 = self.idx;
                                                                                                        var $2059 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($2046, $2055), $2056, $2057, $2058, $2059);
                                                                                                        var self = _reply$pst$58;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $2061 = self.err;
                                                                                                                var _reply$64 = Kindelia$parse$text$(":", _reply$pst$58);
                                                                                                                var self = _reply$64;
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $2063 = self.err;
                                                                                                                        var self = $2061;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Maybe.some':
                                                                                                                                var $2065 = self.value;
                                                                                                                                var $2066 = Parser$Reply$error$(Parser$Error$combine$($2065, $2063));
                                                                                                                                var $2064 = $2066;
                                                                                                                                break;
                                                                                                                            case 'Maybe.none':
                                                                                                                                var $2067 = Parser$Reply$error$($2063);
                                                                                                                                var $2064 = $2067;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $2062 = $2064;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $2068 = self.pst;
                                                                                                                        var self = $2068;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $2070 = self.err;
                                                                                                                                var $2071 = self.nam;
                                                                                                                                var $2072 = self.ini;
                                                                                                                                var $2073 = self.idx;
                                                                                                                                var $2074 = self.str;
                                                                                                                                var _reply$pst$72 = Parser$State$new$(Parser$Error$maybe_combine$($2061, $2070), $2071, $2072, $2073, $2074);
                                                                                                                                var self = _reply$pst$72;
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.State.new':
                                                                                                                                        var $2076 = self.err;
                                                                                                                                        var _reply$78 = Kindelia$parse$type$(_world$1)(_reply$pst$72);
                                                                                                                                        var self = _reply$78;
                                                                                                                                        switch (self._) {
                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                var $2078 = self.err;
                                                                                                                                                var self = $2076;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                        var $2080 = self.value;
                                                                                                                                                        var $2081 = Parser$Reply$error$(Parser$Error$combine$($2080, $2078));
                                                                                                                                                        var $2079 = $2081;
                                                                                                                                                        break;
                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                        var $2082 = Parser$Reply$error$($2078);
                                                                                                                                                        var $2079 = $2082;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $2077 = $2079;
                                                                                                                                                break;
                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                var $2083 = self.pst;
                                                                                                                                                var $2084 = self.val;
                                                                                                                                                var self = $2083;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                        var $2086 = self.err;
                                                                                                                                                        var $2087 = self.nam;
                                                                                                                                                        var $2088 = self.ini;
                                                                                                                                                        var $2089 = self.idx;
                                                                                                                                                        var $2090 = self.str;
                                                                                                                                                        var _reply$pst$86 = Parser$State$new$(Parser$Error$maybe_combine$($2076, $2086), $2087, $2088, $2089, $2090);
                                                                                                                                                        var $2091 = Parser$Reply$value$(_reply$pst$86, Kindelia$Eval$new$($2038, $2084));
                                                                                                                                                        var $2085 = $2091;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $2077 = $2085;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $2075 = $2077;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $2069 = $2075;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $2062 = $2069;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $2060 = $2062;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $2054 = $2060;
                                                                                                        break;
                                                                                                };
                                                                                                var $2047 = $2054;
                                                                                                break;
                                                                                        };
                                                                                        var $2045 = $2047;
                                                                                        break;
                                                                                };
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
        return $1999;
    };
    const Kindelia$parse$eval = x0 => x1 => Kindelia$parse$eval$(x0, x1);

    function Kindelia$Transaction$new_eval$(_eval$1) {
        var $2092 = ({
            _: 'Kindelia.Transaction.new_eval',
            'eval': _eval$1
        });
        return $2092;
    };
    const Kindelia$Transaction$new_eval = x0 => Kindelia$Transaction$new_eval$(x0);

    function Kindelia$Transaction$new_name$(_name$1) {
        var $2093 = ({
            _: 'Kindelia.Transaction.new_name',
            'name': _name$1
        });
        return $2093;
    };
    const Kindelia$Transaction$new_name = x0 => Kindelia$Transaction$new_name$(x0);

    function Kindelia$parse$transaction$(_world$1) {
        var $2094 = Parser$choice(List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2096 = self.err;
                    var _reply$8 = Kindelia$parse$data$(_world$1, _pst$2);
                    var self = _reply$8;
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
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2096, $2106), $2107, $2108, $2109, $2110);
                                    var $2111 = Parser$Reply$value$(_reply$pst$16, Kindelia$Transaction$new_data$($2104));
                                    var $2105 = $2111;
                                    break;
                            };
                            var $2097 = $2105;
                            break;
                    };
                    var $2095 = $2097;
                    break;
            };
            return $2095;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2113 = self.err;
                    var _reply$8 = Kindelia$parse$bond$(_world$1, _pst$2);
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
                            var $2121 = self.val;
                            var self = $2120;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2123 = self.err;
                                    var $2124 = self.nam;
                                    var $2125 = self.ini;
                                    var $2126 = self.idx;
                                    var $2127 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2113, $2123), $2124, $2125, $2126, $2127);
                                    var $2128 = Parser$Reply$value$(_reply$pst$16, Kindelia$Transaction$new_bond$($2121));
                                    var $2122 = $2128;
                                    break;
                            };
                            var $2114 = $2122;
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
                    var $2130 = self.err;
                    var _reply$8 = Kindelia$parse$eval$(_world$1, _pst$2);
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
                            var $2138 = self.val;
                            var self = $2137;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2140 = self.err;
                                    var $2141 = self.nam;
                                    var $2142 = self.ini;
                                    var $2143 = self.idx;
                                    var $2144 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2130, $2140), $2141, $2142, $2143, $2144);
                                    var $2145 = Parser$Reply$value$(_reply$pst$16, Kindelia$Transaction$new_eval$($2138));
                                    var $2139 = $2145;
                                    break;
                            };
                            var $2131 = $2139;
                            break;
                    };
                    var $2129 = $2131;
                    break;
            };
            return $2129;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2147 = self.err;
                    var _reply$8 = Kindelia$parse$name$(_pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2149 = self.err;
                            var self = $2147;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2151 = self.value;
                                    var $2152 = Parser$Reply$error$(Parser$Error$combine$($2151, $2149));
                                    var $2150 = $2152;
                                    break;
                                case 'Maybe.none':
                                    var $2153 = Parser$Reply$error$($2149);
                                    var $2150 = $2153;
                                    break;
                            };
                            var $2148 = $2150;
                            break;
                        case 'Parser.Reply.value':
                            var $2154 = self.pst;
                            var $2155 = self.val;
                            var self = $2154;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2157 = self.err;
                                    var $2158 = self.nam;
                                    var $2159 = self.ini;
                                    var $2160 = self.idx;
                                    var $2161 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2147, $2157), $2158, $2159, $2160, $2161);
                                    var $2162 = Parser$Reply$value$(_reply$pst$16, Kindelia$Transaction$new_name$($2155));
                                    var $2156 = $2162;
                                    break;
                            };
                            var $2148 = $2156;
                            break;
                    };
                    var $2146 = $2148;
                    break;
            };
            return $2146;
        }), List$nil)))));
        return $2094;
    };
    const Kindelia$parse$transaction = x0 => Kindelia$parse$transaction$(x0);

    function Kindelia$World$new$(_names$1, _entry$2) {
        var $2163 = ({
            _: 'Kindelia.World.new',
            'names': _names$1,
            'entry': _entry$2
        });
        return $2163;
    };
    const Kindelia$World$new = x0 => x1 => Kindelia$World$new$(x0, x1);

    function BBT$bin$(_size$3, _key$4, _val$5, _left$6, _right$7) {
        var $2164 = ({
            _: 'BBT.bin',
            'size': _size$3,
            'key': _key$4,
            'val': _val$5,
            'left': _left$6,
            'right': _right$7
        });
        return $2164;
    };
    const BBT$bin = x0 => x1 => x2 => x3 => x4 => BBT$bin$(x0, x1, x2, x3, x4);

    function U32$new$(_value$1) {
        var $2165 = word_to_u32(_value$1);
        return $2165;
    };
    const U32$new = x0 => U32$new$(x0);
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);
    const BBT$tip = ({
        _: 'BBT.tip'
    });

    function BBT$singleton$(_key$3, _val$4) {
        var $2166 = BBT$bin$(1, _key$3, _val$4, BBT$tip, BBT$tip);
        return $2166;
    };
    const BBT$singleton = x0 => x1 => BBT$singleton$(x0, x1);

    function BBT$size$(_map$3) {
        var self = _map$3;
        switch (self._) {
            case 'BBT.bin':
                var $2168 = self.size;
                var $2169 = $2168;
                var $2167 = $2169;
                break;
            case 'BBT.tip':
                var $2170 = 0;
                var $2167 = $2170;
                break;
        };
        return $2167;
    };
    const BBT$size = x0 => BBT$size$(x0);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $2172 = self.pred;
                var $2173 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $2175 = self.pred;
                            var $2176 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2178 = Word$i$(Word$adder$(_a$pred$10, $2175, Bool$false));
                                    var $2177 = $2178;
                                } else {
                                    var $2179 = Word$o$(Word$adder$(_a$pred$10, $2175, Bool$false));
                                    var $2177 = $2179;
                                };
                                return $2177;
                            });
                            var $2174 = $2176;
                            break;
                        case 'Word.i':
                            var $2180 = self.pred;
                            var $2181 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2183 = Word$o$(Word$adder$(_a$pred$10, $2180, Bool$true));
                                    var $2182 = $2183;
                                } else {
                                    var $2184 = Word$i$(Word$adder$(_a$pred$10, $2180, Bool$false));
                                    var $2182 = $2184;
                                };
                                return $2182;
                            });
                            var $2174 = $2181;
                            break;
                        case 'Word.e':
                            var $2185 = (_a$pred$8 => {
                                var $2186 = Word$e;
                                return $2186;
                            });
                            var $2174 = $2185;
                            break;
                    };
                    var $2174 = $2174($2172);
                    return $2174;
                });
                var $2171 = $2173;
                break;
            case 'Word.i':
                var $2187 = self.pred;
                var $2188 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $2190 = self.pred;
                            var $2191 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2193 = Word$o$(Word$adder$(_a$pred$10, $2190, Bool$true));
                                    var $2192 = $2193;
                                } else {
                                    var $2194 = Word$i$(Word$adder$(_a$pred$10, $2190, Bool$false));
                                    var $2192 = $2194;
                                };
                                return $2192;
                            });
                            var $2189 = $2191;
                            break;
                        case 'Word.i':
                            var $2195 = self.pred;
                            var $2196 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2198 = Word$i$(Word$adder$(_a$pred$10, $2195, Bool$true));
                                    var $2197 = $2198;
                                } else {
                                    var $2199 = Word$o$(Word$adder$(_a$pred$10, $2195, Bool$true));
                                    var $2197 = $2199;
                                };
                                return $2197;
                            });
                            var $2189 = $2196;
                            break;
                        case 'Word.e':
                            var $2200 = (_a$pred$8 => {
                                var $2201 = Word$e;
                                return $2201;
                            });
                            var $2189 = $2200;
                            break;
                    };
                    var $2189 = $2189($2187);
                    return $2189;
                });
                var $2171 = $2188;
                break;
            case 'Word.e':
                var $2202 = (_b$5 => {
                    var $2203 = Word$e;
                    return $2203;
                });
                var $2171 = $2202;
                break;
        };
        var $2171 = $2171(_b$3);
        return $2171;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $2204 = Word$adder$(_a$2, _b$3, Bool$false);
        return $2204;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);

    function Word$shift_left$one$go$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $2206 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $2208 = Word$i$(Word$shift_left$one$go$($2206, Bool$false));
                    var $2207 = $2208;
                } else {
                    var $2209 = Word$o$(Word$shift_left$one$go$($2206, Bool$false));
                    var $2207 = $2209;
                };
                var $2205 = $2207;
                break;
            case 'Word.i':
                var $2210 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $2212 = Word$i$(Word$shift_left$one$go$($2210, Bool$true));
                    var $2211 = $2212;
                } else {
                    var $2213 = Word$o$(Word$shift_left$one$go$($2210, Bool$true));
                    var $2211 = $2213;
                };
                var $2205 = $2211;
                break;
            case 'Word.e':
                var $2214 = Word$e;
                var $2205 = $2214;
                break;
        };
        return $2205;
    };
    const Word$shift_left$one$go = x0 => x1 => Word$shift_left$one$go$(x0, x1);

    function Word$shift_left$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $2216 = self.pred;
                var $2217 = Word$o$(Word$shift_left$one$go$($2216, Bool$false));
                var $2215 = $2217;
                break;
            case 'Word.i':
                var $2218 = self.pred;
                var $2219 = Word$o$(Word$shift_left$one$go$($2218, Bool$true));
                var $2215 = $2219;
                break;
            case 'Word.e':
                var $2220 = Word$e;
                var $2215 = $2220;
                break;
        };
        return $2215;
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
                    var $2221 = _value$2;
                    return $2221;
                } else {
                    var $2222 = (self - 1n);
                    var $2223 = Word$shift_left$(Word$shift_left$one$(_value$2), $2222);
                    return $2223;
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
                        var $2224 = self.pred;
                        var $2225 = Word$mul$go$($2224, Word$shift_left$(_b$4, 1n), _acc$5);
                        return $2225;
                    case 'Word.i':
                        var $2226 = self.pred;
                        var $2227 = Word$mul$go$($2226, Word$shift_left$(_b$4, 1n), Word$add$(_b$4, _acc$5));
                        return $2227;
                    case 'Word.e':
                        var $2228 = _acc$5;
                        return $2228;
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
                var $2230 = self.pred;
                var $2231 = Word$o$(Word$to_zero$($2230));
                var $2229 = $2231;
                break;
            case 'Word.i':
                var $2232 = self.pred;
                var $2233 = Word$o$(Word$to_zero$($2232));
                var $2229 = $2233;
                break;
            case 'Word.e':
                var $2234 = Word$e;
                var $2229 = $2234;
                break;
        };
        return $2229;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $2235 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $2235;
    };
    const Word$mul = x0 => x1 => Word$mul$(x0, x1);
    const U32$mul = a0 => a1 => ((a0 * a1) >>> 0);
    const BBT$w = 3;
    const U32$ltn = a0 => a1 => (a0 < a1);
    const U32$from_nat = a0 => (Number(a0) >>> 0);

    function BBT$node$(_key$3, _val$4, _left$5, _right$6) {
        var _size_left$7 = BBT$size$(_left$5);
        var _size_right$8 = BBT$size$(_right$6);
        var _new_size$9 = ((1 + ((_size_left$7 + _size_right$8) >>> 0)) >>> 0);
        var $2236 = BBT$bin$(_new_size$9, _key$3, _val$4, _left$5, _right$6);
        return $2236;
    };
    const BBT$node = x0 => x1 => x2 => x3 => BBT$node$(x0, x1, x2, x3);

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $2238 = Bool$false;
                var $2237 = $2238;
                break;
            case 'Cmp.gtn':
                var $2239 = Bool$true;
                var $2237 = $2239;
                break;
        };
        return $2237;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Word$gtn$(_a$2, _b$3) {
        var $2240 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $2240;
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
            var $2242 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
            var $2241 = $2242;
        } else {
            var self = (_size_r$8 > _w_x_size_l$10);
            if (self) {
                var self = _r$6;
                switch (self._) {
                    case 'BBT.bin':
                        var $2245 = self.key;
                        var $2246 = self.val;
                        var $2247 = self.left;
                        var $2248 = self.right;
                        var _size_rl$17 = BBT$size$($2247);
                        var _size_rr$18 = BBT$size$($2248);
                        var self = (_size_rl$17 < _size_rr$18);
                        if (self) {
                            var _new_key$19 = $2245;
                            var _new_val$20 = $2246;
                            var _new_left$21 = BBT$node$(_k$3, _v$4, _l$5, $2247);
                            var _new_right$22 = $2248;
                            var $2250 = BBT$node$(_new_key$19, _new_val$20, _new_left$21, _new_right$22);
                            var $2249 = $2250;
                        } else {
                            var self = $2247;
                            switch (self._) {
                                case 'BBT.bin':
                                    var $2252 = self.key;
                                    var $2253 = self.val;
                                    var $2254 = self.left;
                                    var $2255 = self.right;
                                    var _new_key$24 = $2252;
                                    var _new_val$25 = $2253;
                                    var _new_left$26 = BBT$node$(_k$3, _v$4, _l$5, $2254);
                                    var _new_right$27 = BBT$node$($2245, $2246, $2255, $2248);
                                    var $2256 = BBT$node$(_new_key$24, _new_val$25, _new_left$26, _new_right$27);
                                    var $2251 = $2256;
                                    break;
                                case 'BBT.tip':
                                    var $2257 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
                                    var $2251 = $2257;
                                    break;
                            };
                            var $2249 = $2251;
                        };
                        var $2244 = $2249;
                        break;
                    case 'BBT.tip':
                        var $2258 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
                        var $2244 = $2258;
                        break;
                };
                var $2243 = $2244;
            } else {
                var self = (_size_l$7 > _w_x_size_r$11);
                if (self) {
                    var self = _l$5;
                    switch (self._) {
                        case 'BBT.bin':
                            var $2261 = self.key;
                            var $2262 = self.val;
                            var $2263 = self.left;
                            var $2264 = self.right;
                            var _size_ll$17 = BBT$size$($2263);
                            var _size_lr$18 = BBT$size$($2264);
                            var self = (_size_lr$18 < _size_ll$17);
                            if (self) {
                                var _new_key$19 = $2261;
                                var _new_val$20 = $2262;
                                var _new_left$21 = $2263;
                                var _new_right$22 = BBT$node$(_k$3, _v$4, $2264, _r$6);
                                var $2266 = BBT$node$(_new_key$19, _new_val$20, _new_left$21, _new_right$22);
                                var $2265 = $2266;
                            } else {
                                var self = $2264;
                                switch (self._) {
                                    case 'BBT.bin':
                                        var $2268 = self.key;
                                        var $2269 = self.val;
                                        var $2270 = self.left;
                                        var $2271 = self.right;
                                        var _new_key$24 = $2268;
                                        var _new_val$25 = $2269;
                                        var _new_left$26 = BBT$node$($2261, $2262, $2263, $2270);
                                        var _new_right$27 = BBT$node$(_k$3, _v$4, $2271, _r$6);
                                        var $2272 = BBT$node$(_new_key$24, _new_val$25, _new_left$26, _new_right$27);
                                        var $2267 = $2272;
                                        break;
                                    case 'BBT.tip':
                                        var $2273 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
                                        var $2267 = $2273;
                                        break;
                                };
                                var $2265 = $2267;
                            };
                            var $2260 = $2265;
                            break;
                        case 'BBT.tip':
                            var $2274 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
                            var $2260 = $2274;
                            break;
                    };
                    var $2259 = $2260;
                } else {
                    var $2275 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
                    var $2259 = $2275;
                };
                var $2243 = $2259;
            };
            var $2241 = $2243;
        };
        return $2241;
    };
    const BBT$balance = x0 => x1 => x2 => x3 => BBT$balance$(x0, x1, x2, x3);

    function BBT$insert$(_cmp$3, _key$4, _val$5, _map$6) {
        var self = _map$6;
        switch (self._) {
            case 'BBT.bin':
                var $2277 = self.key;
                var $2278 = self.val;
                var $2279 = self.left;
                var $2280 = self.right;
                var self = _cmp$3(_key$4)($2277);
                switch (self._) {
                    case 'Cmp.ltn':
                        var _new_key$12 = $2277;
                        var _new_val$13 = $2278;
                        var _new_left$14 = BBT$insert$(_cmp$3, _key$4, _val$5, $2279);
                        var _new_right$15 = $2280;
                        var $2282 = BBT$balance$(_new_key$12, _new_val$13, _new_left$14, _new_right$15);
                        var $2281 = $2282;
                        break;
                    case 'Cmp.eql':
                        var $2283 = BBT$node$(_key$4, _val$5, $2279, $2280);
                        var $2281 = $2283;
                        break;
                    case 'Cmp.gtn':
                        var _new_key$12 = $2277;
                        var _new_val$13 = $2278;
                        var _new_left$14 = $2279;
                        var _new_right$15 = BBT$insert$(_cmp$3, _key$4, _val$5, $2280);
                        var $2284 = BBT$balance$(_new_key$12, _new_val$13, _new_left$14, _new_right$15);
                        var $2281 = $2284;
                        break;
                };
                var $2276 = $2281;
                break;
            case 'BBT.tip':
                var $2285 = BBT$singleton$(_key$4, _val$5);
                var $2276 = $2285;
                break;
        };
        return $2276;
    };
    const BBT$insert = x0 => x1 => x2 => x3 => BBT$insert$(x0, x1, x2, x3);

    function Map$set$(_key$2, _val$3, _map$4) {
        var $2286 = BBT$insert$(String$cmp, _key$2, _val$3, _map$4);
        return $2286;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function Kindelia$Entry$bond$(_value$1) {
        var $2287 = ({
            _: 'Kindelia.Entry.bond',
            'value': _value$1
        });
        return $2287;
    };
    const Kindelia$Entry$bond = x0 => Kindelia$Entry$bond$(x0);

    function Kindelia$parse$block$(_world$1) {
        var $2288 = Parser$choice(List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2290 = self.err;
                    var _reply$8 = Kindelia$parse$transaction$(_world$1)(_pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2292 = self.err;
                            var self = $2290;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2294 = self.value;
                                    var $2295 = Parser$Reply$error$(Parser$Error$combine$($2294, $2292));
                                    var $2293 = $2295;
                                    break;
                                case 'Maybe.none':
                                    var $2296 = Parser$Reply$error$($2292);
                                    var $2293 = $2296;
                                    break;
                            };
                            var $2291 = $2293;
                            break;
                        case 'Parser.Reply.value':
                            var $2297 = self.pst;
                            var $2298 = self.val;
                            var self = $2297;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2300 = self.err;
                                    var $2301 = self.nam;
                                    var $2302 = self.ini;
                                    var $2303 = self.idx;
                                    var $2304 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2290, $2300), $2301, $2302, $2303, $2304);
                                    var self = $2298;
                                    switch (self._) {
                                        case 'Kindelia.Transaction.new_bond':
                                            var $2306 = self.bond;
                                            var self = _world$1;
                                            switch (self._) {
                                                case 'Kindelia.World.new':
                                                    var $2308 = self.names;
                                                    var $2309 = self.entry;
                                                    var $2310 = Kindelia$World$new$($2308, Map$set$((() => {
                                                        var self = $2306;
                                                        switch (self._) {
                                                            case 'Kindelia.Bond.new':
                                                                var $2311 = self.name;
                                                                var $2312 = $2311;
                                                                return $2312;
                                                        };
                                                    })(), Kindelia$Entry$bond$($2306), $2309));
                                                    var $2307 = $2310;
                                                    break;
                                            };
                                            var _world$17 = $2307;
                                            break;
                                        case 'Kindelia.Transaction.new_data':
                                        case 'Kindelia.Transaction.new_eval':
                                        case 'Kindelia.Transaction.new_name':
                                            var $2313 = _world$1;
                                            var _world$17 = $2313;
                                            break;
                                    };
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $2314 = self.err;
                                            var _reply$23 = Kindelia$parse$block$(_world$17)(_reply$pst$16);
                                            var self = _reply$23;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2316 = self.err;
                                                    var self = $2314;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $2318 = self.value;
                                                            var $2319 = Parser$Reply$error$(Parser$Error$combine$($2318, $2316));
                                                            var $2317 = $2319;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $2320 = Parser$Reply$error$($2316);
                                                            var $2317 = $2320;
                                                            break;
                                                    };
                                                    var $2315 = $2317;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2321 = self.pst;
                                                    var $2322 = self.val;
                                                    var self = $2321;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $2324 = self.err;
                                                            var $2325 = self.nam;
                                                            var $2326 = self.ini;
                                                            var $2327 = self.idx;
                                                            var $2328 = self.str;
                                                            var _reply$pst$31 = Parser$State$new$(Parser$Error$maybe_combine$($2314, $2324), $2325, $2326, $2327, $2328);
                                                            var $2329 = Parser$Reply$value$(_reply$pst$31, List$cons$($2298, $2322));
                                                            var $2323 = $2329;
                                                            break;
                                                    };
                                                    var $2315 = $2323;
                                                    break;
                                            };
                                            var $2305 = $2315;
                                            break;
                                    };
                                    var $2299 = $2305;
                                    break;
                            };
                            var $2291 = $2299;
                            break;
                    };
                    var $2289 = $2291;
                    break;
            };
            return $2289;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2331 = self.err;
                    var _reply$8 = Kindelia$parse$text$("save", _pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2333 = self.err;
                            var self = $2331;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2335 = self.value;
                                    var $2336 = Parser$Reply$error$(Parser$Error$combine$($2335, $2333));
                                    var $2334 = $2336;
                                    break;
                                case 'Maybe.none':
                                    var $2337 = Parser$Reply$error$($2333);
                                    var $2334 = $2337;
                                    break;
                            };
                            var $2332 = $2334;
                            break;
                        case 'Parser.Reply.value':
                            var $2338 = self.pst;
                            var self = $2338;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2340 = self.err;
                                    var $2341 = self.nam;
                                    var $2342 = self.ini;
                                    var $2343 = self.idx;
                                    var $2344 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2331, $2340), $2341, $2342, $2343, $2344);
                                    var $2345 = Parser$Reply$value$(_reply$pst$16, List$nil);
                                    var $2339 = $2345;
                                    break;
                            };
                            var $2332 = $2339;
                            break;
                    };
                    var $2330 = $2332;
                    break;
            };
            return $2330;
        }), List$nil)));
        return $2288;
    };
    const Kindelia$parse$block = x0 => Kindelia$parse$block$(x0);

    function IO$(_A$1) {
        var $2346 = null;
        return $2346;
    };
    const IO = x0 => IO$(x0);
    const Nat$ltn = a0 => a1 => (a0 < a1);

    function String$length$go$(_xs$1, _n$2) {
        var String$length$go$ = (_xs$1, _n$2) => ({
            ctr: 'TCO',
            arg: [_xs$1, _n$2]
        });
        var String$length$go = _xs$1 => _n$2 => String$length$go$(_xs$1, _n$2);
        var arg = [_xs$1, _n$2];
        while (true) {
            let [_xs$1, _n$2] = arg;
            var R = (() => {
                var self = _xs$1;
                if (self.length === 0) {
                    var $2347 = _n$2;
                    return $2347;
                } else {
                    var $2348 = self.charCodeAt(0);
                    var $2349 = self.slice(1);
                    var $2350 = String$length$go$($2349, Nat$succ$(_n$2));
                    return $2350;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$length$go = x0 => x1 => String$length$go$(x0, x1);

    function String$length$(_xs$1) {
        var $2351 = String$length$go$(_xs$1, 0n);
        return $2351;
    };
    const String$length = x0 => String$length$(x0);

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
                        var $2352 = self.head;
                        var $2353 = self.tail;
                        var $2354 = String$flatten$go$($2353, (_res$2 + $2352));
                        return $2354;
                    case 'List.nil':
                        var $2355 = _res$2;
                        return $2355;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$flatten$go = x0 => x1 => String$flatten$go$(x0, x1);

    function String$flatten$(_xs$1) {
        var $2356 = String$flatten$go$(_xs$1, "");
        return $2356;
    };
    const String$flatten = x0 => String$flatten$(x0);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $2358 = self.head;
                var $2359 = self.tail;
                var $2360 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $2361 = "";
                        return $2361;
                    } else {
                        var $2362 = _sep$1;
                        return $2362;
                    };
                })(), List$cons$($2358, List$cons$(String$join$go$(_sep$1, $2359, Bool$false), List$nil))));
                var $2357 = $2360;
                break;
            case 'List.nil':
                var $2363 = "";
                var $2357 = $2363;
                break;
        };
        return $2357;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $2364 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $2364;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function Kind$Code$highlight$end$(_col$1, _row$2, _res$3) {
        var $2365 = String$join$("\u{a}", _res$3);
        return $2365;
    };
    const Kind$Code$highlight$end = x0 => x1 => x2 => Kind$Code$highlight$end$(x0, x1, x2);

    function Maybe$extract$(_m$2, _a$4, _f$5) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $2367 = self.value;
                var $2368 = _f$5($2367);
                var $2366 = $2368;
                break;
            case 'Maybe.none':
                var $2369 = _a$4;
                var $2366 = $2369;
                break;
        };
        return $2366;
    };
    const Maybe$extract = x0 => x1 => x2 => Maybe$extract$(x0, x1, x2);

    function Nat$is_zero$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $2371 = Bool$true;
            var $2370 = $2371;
        } else {
            var $2372 = (self - 1n);
            var $2373 = Bool$false;
            var $2370 = $2373;
        };
        return $2370;
    };
    const Nat$is_zero = x0 => Nat$is_zero$(x0);

    function Nat$double$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $2375 = Nat$zero;
            var $2374 = $2375;
        } else {
            var $2376 = (self - 1n);
            var $2377 = Nat$succ$(Nat$succ$(Nat$double$($2376)));
            var $2374 = $2377;
        };
        return $2374;
    };
    const Nat$double = x0 => Nat$double$(x0);

    function Nat$pred$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $2379 = Nat$zero;
            var $2378 = $2379;
        } else {
            var $2380 = (self - 1n);
            var $2381 = $2380;
            var $2378 = $2381;
        };
        return $2378;
    };
    const Nat$pred = x0 => Nat$pred$(x0);

    function String$reverse$go$(_xs$1, _res$2) {
        var String$reverse$go$ = (_xs$1, _res$2) => ({
            ctr: 'TCO',
            arg: [_xs$1, _res$2]
        });
        var String$reverse$go = _xs$1 => _res$2 => String$reverse$go$(_xs$1, _res$2);
        var arg = [_xs$1, _res$2];
        while (true) {
            let [_xs$1, _res$2] = arg;
            var R = (() => {
                var self = _xs$1;
                if (self.length === 0) {
                    var $2382 = _res$2;
                    return $2382;
                } else {
                    var $2383 = self.charCodeAt(0);
                    var $2384 = self.slice(1);
                    var $2385 = String$reverse$go$($2384, String$cons$($2383, _res$2));
                    return $2385;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$reverse$go = x0 => x1 => String$reverse$go$(x0, x1);

    function String$reverse$(_xs$1) {
        var $2386 = String$reverse$go$(_xs$1, String$nil);
        return $2386;
    };
    const String$reverse = x0 => String$reverse$(x0);

    function String$pad_right$(_size$1, _chr$2, _str$3) {
        var self = _size$1;
        if (self === 0n) {
            var $2388 = _str$3;
            var $2387 = $2388;
        } else {
            var $2389 = (self - 1n);
            var self = _str$3;
            if (self.length === 0) {
                var $2391 = String$cons$(_chr$2, String$pad_right$($2389, _chr$2, ""));
                var $2390 = $2391;
            } else {
                var $2392 = self.charCodeAt(0);
                var $2393 = self.slice(1);
                var $2394 = String$cons$($2392, String$pad_right$($2389, _chr$2, $2393));
                var $2390 = $2394;
            };
            var $2387 = $2390;
        };
        return $2387;
    };
    const String$pad_right = x0 => x1 => x2 => String$pad_right$(x0, x1, x2);

    function String$pad_left$(_size$1, _chr$2, _str$3) {
        var $2395 = String$reverse$(String$pad_right$(_size$1, _chr$2, String$reverse$(_str$3)));
        return $2395;
    };
    const String$pad_left = x0 => x1 => x2 => String$pad_left$(x0, x1, x2);
    const Nat$lte = a0 => a1 => (a0 <= a1);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Nat$div_mod$go$(_n$1, _d$2, _r$3) {
        var Nat$div_mod$go$ = (_n$1, _d$2, _r$3) => ({
            ctr: 'TCO',
            arg: [_n$1, _d$2, _r$3]
        });
        var Nat$div_mod$go = _n$1 => _d$2 => _r$3 => Nat$div_mod$go$(_n$1, _d$2, _r$3);
        var arg = [_n$1, _d$2, _r$3];
        while (true) {
            let [_n$1, _d$2, _r$3] = arg;
            var R = (() => {
                var self = (_n$1 <= _r$3);
                if (self) {
                    var $2396 = Nat$div_mod$go$(_n$1, Nat$succ$(_d$2), (_r$3 - _n$1 <= 0n ? 0n : _r$3 - _n$1));
                    return $2396;
                } else {
                    var $2397 = Pair$new$(_d$2, _r$3);
                    return $2397;
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
                        var $2398 = self.fst;
                        var $2399 = self.snd;
                        var self = $2398;
                        if (self === 0n) {
                            var $2401 = List$cons$($2399, _res$3);
                            var $2400 = $2401;
                        } else {
                            var $2402 = (self - 1n);
                            var $2403 = Nat$to_base$go$(_base$1, $2398, List$cons$($2399, _res$3));
                            var $2400 = $2403;
                        };
                        return $2400;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $2404 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $2404;
    };
    const Nat$to_base = x0 => x1 => Nat$to_base$(x0, x1);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $2406 = self.snd;
                var $2407 = $2406;
                var $2405 = $2407;
                break;
        };
        return $2405;
    };
    const Pair$snd = x0 => Pair$snd$(x0);
    const Nat$mod = a0 => a1 => (a0 % a1);

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
                        var $2408 = self.head;
                        var $2409 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $2411 = Maybe$some$($2408);
                            var $2410 = $2411;
                        } else {
                            var $2412 = (self - 1n);
                            var $2413 = List$at$($2412, $2409);
                            var $2410 = $2413;
                        };
                        return $2410;
                    case 'List.nil':
                        var $2414 = Maybe$none;
                        return $2414;
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
                    var $2417 = self.value;
                    var $2418 = $2417;
                    var $2416 = $2418;
                    break;
                case 'Maybe.none':
                    var $2419 = 35;
                    var $2416 = $2419;
                    break;
            };
            var $2415 = $2416;
        } else {
            var $2420 = 35;
            var $2415 = $2420;
        };
        return $2415;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $2421 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $2422 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $2422;
        }));
        return $2421;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $2423 = Nat$to_string_base$(10n, _n$1);
        return $2423;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const Bool$not = a0 => (!a0);

    function U16$new$(_value$1) {
        var $2424 = word_to_u16(_value$1);
        return $2424;
    };
    const U16$new = x0 => U16$new$(x0);
    const Nat$to_u16 = a0 => (Number(a0) & 0xFFFF);

    function Kind$Code$color$(_col$1, _str$2) {
        var $2425 = String$cons$(27, ("[" + (_col$1 + ("m" + (_str$2 + String$cons$(27, "[0m"))))));
        return $2425;
    };
    const Kind$Code$color = x0 => x1 => Kind$Code$color$(x0, x1);
    const Nat$eql = a0 => a1 => (a0 === a1);

    function List$take$(_n$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $2427 = self.head;
                var $2428 = self.tail;
                var self = _n$2;
                if (self === 0n) {
                    var $2430 = List$nil;
                    var $2429 = $2430;
                } else {
                    var $2431 = (self - 1n);
                    var $2432 = List$cons$($2427, List$take$($2431, $2428));
                    var $2429 = $2432;
                };
                var $2426 = $2429;
                break;
            case 'List.nil':
                var $2433 = List$nil;
                var $2426 = $2433;
                break;
        };
        return $2426;
    };
    const List$take = x0 => x1 => List$take$(x0, x1);

    function Kind$Code$highlight$go$(_code$1, _ixi$2, _ix0$3, _ix1$4, _col$5, _row$6, _lft$7, _lin$8, _res$9) {
        var Kind$Code$highlight$go$ = (_code$1, _ixi$2, _ix0$3, _ix1$4, _col$5, _row$6, _lft$7, _lin$8, _res$9) => ({
            ctr: 'TCO',
            arg: [_code$1, _ixi$2, _ix0$3, _ix1$4, _col$5, _row$6, _lft$7, _lin$8, _res$9]
        });
        var Kind$Code$highlight$go = _code$1 => _ixi$2 => _ix0$3 => _ix1$4 => _col$5 => _row$6 => _lft$7 => _lin$8 => _res$9 => Kind$Code$highlight$go$(_code$1, _ixi$2, _ix0$3, _ix1$4, _col$5, _row$6, _lft$7, _lin$8, _res$9);
        var arg = [_code$1, _ixi$2, _ix0$3, _ix1$4, _col$5, _row$6, _lft$7, _lin$8, _res$9];
        while (true) {
            let [_code$1, _ixi$2, _ix0$3, _ix1$4, _col$5, _row$6, _lft$7, _lin$8, _res$9] = arg;
            var R = (() => {
                var _spa$10 = 3n;
                var self = _code$1;
                if (self.length === 0) {
                    var $2435 = Kind$Code$highlight$end$(_col$5, _row$6, List$reverse$(_res$9));
                    var $2434 = $2435;
                } else {
                    var $2436 = self.charCodeAt(0);
                    var $2437 = self.slice(1);
                    var self = ($2436 === 10);
                    if (self) {
                        var _stp$13 = Maybe$extract$(_lft$7, Bool$false, Nat$is_zero);
                        var self = _stp$13;
                        if (self) {
                            var $2440 = Kind$Code$highlight$end$(_col$5, _row$6, List$reverse$(_res$9));
                            var $2439 = $2440;
                        } else {
                            var _siz$14 = Nat$succ$(Nat$double$(_spa$10));
                            var self = _ix1$4;
                            if (self === 0n) {
                                var self = _lft$7;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2443 = self.value;
                                        var $2444 = Maybe$some$(Nat$pred$($2443));
                                        var $2442 = $2444;
                                        break;
                                    case 'Maybe.none':
                                        var $2445 = Maybe$some$(_spa$10);
                                        var $2442 = $2445;
                                        break;
                                };
                                var _lft$15 = $2442;
                            } else {
                                var $2446 = (self - 1n);
                                var $2447 = _lft$7;
                                var _lft$15 = $2447;
                            };
                            var _ixi$16 = Nat$pred$(_ixi$2);
                            var _ix0$17 = Nat$pred$(_ix0$3);
                            var _ix1$18 = Nat$pred$(_ix1$4);
                            var _col$19 = 0n;
                            var _row$20 = Nat$succ$(_row$6);
                            var _res$21 = List$cons$(String$reverse$(_lin$8), _res$9);
                            var _lin$22 = String$reverse$(String$flatten$(List$cons$(String$pad_left$(4n, 32, Nat$show$(_row$20)), List$cons$(" | ", List$nil))));
                            var $2441 = Kind$Code$highlight$go$($2437, _ixi$16, _ix0$17, _ix1$18, _col$19, _row$20, _lft$15, _lin$22, _res$21);
                            var $2439 = $2441;
                        };
                        var $2438 = $2439;
                    } else {
                        var _chr$13 = String$cons$($2436, String$nil);
                        var self = (Nat$is_zero$(_ix0$3) && (!Nat$is_zero$(_ix1$4)));
                        if (self) {
                            var $2449 = String$reverse$(Kind$Code$color$("41", Kind$Code$color$("37", _chr$13)));
                            var _chr$14 = $2449;
                        } else {
                            var self = (Nat$is_zero$(_ixi$2) && (!Nat$is_zero$(_ix1$4)));
                            if (self) {
                                var $2451 = String$reverse$(Kind$Code$color$("31", Kind$Code$color$("4", _chr$13)));
                                var $2450 = $2451;
                            } else {
                                var $2452 = _chr$13;
                                var $2450 = $2452;
                            };
                            var _chr$14 = $2450;
                        };
                        var self = (_ix0$3 === 1n);
                        if (self) {
                            var $2453 = List$take$(_spa$10, _res$9);
                            var _res$15 = $2453;
                        } else {
                            var $2454 = _res$9;
                            var _res$15 = $2454;
                        };
                        var _ixi$16 = Nat$pred$(_ixi$2);
                        var _ix0$17 = Nat$pred$(_ix0$3);
                        var _ix1$18 = Nat$pred$(_ix1$4);
                        var _col$19 = Nat$succ$(_col$5);
                        var _lin$20 = String$flatten$(List$cons$(_chr$14, List$cons$(_lin$8, List$nil)));
                        var $2448 = Kind$Code$highlight$go$($2437, _ixi$16, _ix0$17, _ix1$18, _col$19, _row$6, _lft$7, _lin$20, _res$15);
                        var $2438 = $2448;
                    };
                    var $2434 = $2438;
                };
                return $2434;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$Code$highlight$go = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => Kind$Code$highlight$go$(x0, x1, x2, x3, x4, x5, x6, x7, x8);

    function Kind$Code$highlight$(_code$1, _init$2, _idx0$3, _idx1$4) {
        var $2455 = Kind$Code$highlight$go$((_code$1 + " \u{a}"), _init$2, _idx0$3, _idx1$4, 0n, 1n, Maybe$none, String$reverse$("   1 | "), List$nil);
        return $2455;
    };
    const Kind$Code$highlight = x0 => x1 => x2 => x3 => Kind$Code$highlight$(x0, x1, x2, x3);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $2456 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $2456;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $2458 = self.value;
                var $2459 = _f$4($2458);
                var $2457 = $2459;
                break;
            case 'IO.ask':
                var $2460 = self.query;
                var $2461 = self.param;
                var $2462 = self.then;
                var $2463 = IO$ask$($2460, $2461, (_x$8 => {
                    var $2464 = IO$bind$($2462(_x$8), _f$4);
                    return $2464;
                }));
                var $2457 = $2463;
                break;
        };
        return $2457;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $2465 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $2465;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $2466 = _new$2(IO$bind)(IO$end);
        return $2466;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function IO$put_string$(_text$1) {
        var $2467 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $2468 = IO$end$(Unit$new);
            return $2468;
        }));
        return $2467;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function IO$print$(_text$1) {
        var $2469 = IO$put_string$((_text$1 + "\u{a}"));
        return $2469;
    };
    const IO$print = x0 => IO$print$(x0);
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $2471 = self.pred;
                var $2472 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $2474 = self.pred;
                            var $2475 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2477 = Word$i$(Word$subber$(_a$pred$10, $2474, Bool$true));
                                    var $2476 = $2477;
                                } else {
                                    var $2478 = Word$o$(Word$subber$(_a$pred$10, $2474, Bool$false));
                                    var $2476 = $2478;
                                };
                                return $2476;
                            });
                            var $2473 = $2475;
                            break;
                        case 'Word.i':
                            var $2479 = self.pred;
                            var $2480 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2482 = Word$o$(Word$subber$(_a$pred$10, $2479, Bool$true));
                                    var $2481 = $2482;
                                } else {
                                    var $2483 = Word$i$(Word$subber$(_a$pred$10, $2479, Bool$true));
                                    var $2481 = $2483;
                                };
                                return $2481;
                            });
                            var $2473 = $2480;
                            break;
                        case 'Word.e':
                            var $2484 = (_a$pred$8 => {
                                var $2485 = Word$e;
                                return $2485;
                            });
                            var $2473 = $2484;
                            break;
                    };
                    var $2473 = $2473($2471);
                    return $2473;
                });
                var $2470 = $2472;
                break;
            case 'Word.i':
                var $2486 = self.pred;
                var $2487 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $2489 = self.pred;
                            var $2490 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2492 = Word$o$(Word$subber$(_a$pred$10, $2489, Bool$false));
                                    var $2491 = $2492;
                                } else {
                                    var $2493 = Word$i$(Word$subber$(_a$pred$10, $2489, Bool$false));
                                    var $2491 = $2493;
                                };
                                return $2491;
                            });
                            var $2488 = $2490;
                            break;
                        case 'Word.i':
                            var $2494 = self.pred;
                            var $2495 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2497 = Word$i$(Word$subber$(_a$pred$10, $2494, Bool$true));
                                    var $2496 = $2497;
                                } else {
                                    var $2498 = Word$o$(Word$subber$(_a$pred$10, $2494, Bool$false));
                                    var $2496 = $2498;
                                };
                                return $2496;
                            });
                            var $2488 = $2495;
                            break;
                        case 'Word.e':
                            var $2499 = (_a$pred$8 => {
                                var $2500 = Word$e;
                                return $2500;
                            });
                            var $2488 = $2499;
                            break;
                    };
                    var $2488 = $2488($2486);
                    return $2488;
                });
                var $2470 = $2487;
                break;
            case 'Word.e':
                var $2501 = (_b$5 => {
                    var $2502 = Word$e;
                    return $2502;
                });
                var $2470 = $2501;
                break;
        };
        var $2470 = $2470(_b$3);
        return $2470;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $2503 = Word$subber$(_a$2, _b$3, Bool$false);
        return $2503;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);
    const U16$sub = a0 => a1 => ((a0 - a1) & 0xFFFF);
    const U16$add = a0 => a1 => ((a0 + a1) & 0xFFFF);
    const Nat$div = a0 => a1 => (a0 / a1);
    const Bits$i = a0 => (a0 + '1');

    function Kindelia$serialize$fixlen$(_size$1, _value$2) {
        var self = _size$1;
        if (self === 0n) {
            var $2505 = Bits$e;
            var $2504 = $2505;
        } else {
            var $2506 = (self - 1n);
            var self = ((_value$2 % 2n) === 0n);
            if (self) {
                var $2508 = (Kindelia$serialize$fixlen$($2506, (_value$2 / 2n)) + '0');
                var $2507 = $2508;
            } else {
                var $2509 = (Kindelia$serialize$fixlen$($2506, (_value$2 / 2n)) + '1');
                var $2507 = $2509;
            };
            var $2504 = $2507;
        };
        return $2504;
    };
    const Kindelia$serialize$fixlen = x0 => x1 => Kindelia$serialize$fixlen$(x0, x1);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $2511 = self.pred;
                var $2512 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $2511));
                var $2510 = $2512;
                break;
            case 'Word.i':
                var $2513 = self.pred;
                var $2514 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $2513));
                var $2510 = $2514;
                break;
            case 'Word.e':
                var $2515 = _nil$3;
                var $2510 = $2515;
                break;
        };
        return $2510;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);

    function Word$to_nat$(_word$2) {
        var $2516 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $2517 = Nat$succ$((2n * _x$4));
            return $2517;
        }), _word$2);
        return $2516;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);
    const U16$to_nat = a0 => (BigInt(a0));
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Kindelia$serialize$name$(_name$1) {
        var self = _name$1;
        if (self.length === 0) {
            var $2519 = (Bits$e + '0');
            var $2518 = $2519;
        } else {
            var $2520 = self.charCodeAt(0);
            var $2521 = self.slice(1);
            var self = U16$btw$(48, $2520, 57);
            if (self) {
                var $2523 = (($2520 - 48) & 0xFFFF);
                var _numb$4 = $2523;
            } else {
                var self = U16$btw$(65, $2520, 90);
                if (self) {
                    var $2525 = (((($2520 - 65) & 0xFFFF) + 10) & 0xFFFF);
                    var $2524 = $2525;
                } else {
                    var self = U16$btw$(97, $2520, 122);
                    if (self) {
                        var $2527 = (((($2520 - 97) & 0xFFFF) + 36) & 0xFFFF);
                        var $2526 = $2527;
                    } else {
                        var self = U16$btw$(95, $2520, 95);
                        if (self) {
                            var $2529 = 62;
                            var $2528 = $2529;
                        } else {
                            var $2530 = 63;
                            var $2528 = $2530;
                        };
                        var $2526 = $2528;
                    };
                    var $2524 = $2526;
                };
                var _numb$4 = $2524;
            };
            var _head$5 = Kindelia$serialize$fixlen$(6n, (BigInt(_numb$4)));
            var _tail$6 = Kindelia$serialize$name$($2521);
            var $2522 = ((_tail$6 + _head$5) + '1');
            var $2518 = $2522;
        };
        return $2518;
    };
    const Kindelia$serialize$name = x0 => Kindelia$serialize$name$(x0);

    function Kindelia$serialize$list$(_item$2, _list$3) {
        var self = _list$3;
        switch (self._) {
            case 'List.cons':
                var $2532 = self.head;
                var $2533 = self.tail;
                var $2534 = ((Kindelia$serialize$list$(_item$2, $2533) + _item$2($2532)) + '1');
                var $2531 = $2534;
                break;
            case 'List.nil':
                var $2535 = (Bits$e + '0');
                var $2531 = $2535;
                break;
        };
        return $2531;
    };
    const Kindelia$serialize$list = x0 => x1 => Kindelia$serialize$list$(x0, x1);

    function Kindelia$serialize$pair$(_first$3, _second$4, _pair$5) {
        var self = _pair$5;
        switch (self._) {
            case 'Pair.new':
                var $2537 = self.fst;
                var $2538 = self.snd;
                var _fst$8 = _first$3($2537);
                var _snd$9 = _second$4($2538);
                var $2539 = (_snd$9 + _fst$8);
                var $2536 = $2539;
                break;
        };
        return $2536;
    };
    const Kindelia$serialize$pair = x0 => x1 => x2 => Kindelia$serialize$pair$(x0, x1, x2);

    function Kindelia$serialize$type$(_world$1, _typ$2) {
        var self = _typ$2;
        switch (self._) {
            case 'Kindelia.Type.data':
                var $2541 = self.name;
                var $2542 = (Kindelia$serialize$name$($2541) + '1');
                var $2540 = $2542;
                break;
            case 'Kindelia.Type.word':
                var $2543 = (Bits$e + '0');
                var $2540 = $2543;
                break;
        };
        return $2540;
    };
    const Kindelia$serialize$type = x0 => x1 => Kindelia$serialize$type$(x0, x1);

    function Kindelia$serialize$constructor$(_world$1, _ctor$2) {
        var self = _ctor$2;
        switch (self._) {
            case 'Kindelia.Constructor.new':
                var $2545 = self.name;
                var $2546 = self.args;
                var _name$5 = Kindelia$serialize$name$($2545);
                var _args$6 = Kindelia$serialize$list$(Kindelia$serialize$pair(Kindelia$serialize$name)(Kindelia$serialize$type(_world$1)), $2546);
                var $2547 = (_args$6 + _name$5);
                var $2544 = $2547;
                break;
        };
        return $2544;
    };
    const Kindelia$serialize$constructor = x0 => x1 => Kindelia$serialize$constructor$(x0, x1);

    function Kindelia$serialize$data$(_world$1, _data$2) {
        var self = _data$2;
        switch (self._) {
            case 'Kindelia.Data.new':
                var $2549 = self.name;
                var $2550 = self.constructors;
                var _name$5 = Kindelia$serialize$name$($2549);
                var _ctrs$6 = Kindelia$serialize$list$(Kindelia$serialize$constructor(_world$1), $2550);
                var $2551 = (_ctrs$6 + _name$5);
                var $2548 = $2551;
                break;
        };
        return $2548;
    };
    const Kindelia$serialize$data = x0 => x1 => Kindelia$serialize$data$(x0, x1);

    function Kindelia$serialize$varlen$go$(_value$1) {
        var self = _value$1;
        if (self === 0n) {
            var $2553 = Bits$e;
            var $2552 = $2553;
        } else {
            var $2554 = (self - 1n);
            var self = (_value$1 === 1n);
            if (self) {
                var $2556 = (Bits$e + '0');
                var $2555 = $2556;
            } else {
                var self = ((_value$1 % 2n) === 0n);
                if (self) {
                    var $2558 = ((Kindelia$serialize$varlen$go$((_value$1 / 2n)) + '0') + '1');
                    var $2557 = $2558;
                } else {
                    var $2559 = ((Kindelia$serialize$varlen$go$((_value$1 / 2n)) + '1') + '1');
                    var $2557 = $2559;
                };
                var $2555 = $2557;
            };
            var $2552 = $2555;
        };
        return $2552;
    };
    const Kindelia$serialize$varlen$go = x0 => Kindelia$serialize$varlen$go$(x0);

    function Kindelia$serialize$varlen$(_value$1) {
        var $2560 = Kindelia$serialize$varlen$go$((_value$1 + 1n));
        return $2560;
    };
    const Kindelia$serialize$varlen = x0 => Kindelia$serialize$varlen$(x0);

    function Kindelia$serialize$name$local$(_world$1, _vars$2, _name$3) {
        var self = List$find_index$(_vars$2, a1 => (_name$3 === a1));
        switch (self._) {
            case 'Maybe.some':
                var $2562 = self.value;
                var $2563 = Kindelia$serialize$varlen$($2562);
                var $2561 = $2563;
                break;
            case 'Maybe.none':
                var $2564 = Bits$e;
                var $2561 = $2564;
                break;
        };
        return $2561;
    };
    const Kindelia$serialize$name$local = x0 => x1 => x2 => Kindelia$serialize$name$local$(x0, x1, x2);

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $2566 = self.head;
                var $2567 = self.tail;
                var $2568 = List$cons$(_f$3($2566), List$map$(_f$3, $2567));
                var $2565 = $2568;
                break;
            case 'List.nil':
                var $2569 = List$nil;
                var $2565 = $2569;
                break;
        };
        return $2565;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $2571 = self.head;
                var $2572 = self.tail;
                var $2573 = List$cons$($2571, List$concat$($2572, _bs$3));
                var $2570 = $2573;
                break;
            case 'List.nil':
                var $2574 = _bs$3;
                var $2570 = $2574;
                break;
        };
        return $2570;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function Kindelia$serialize$cases$(_world$1, _vars$2, _name$3, _ctors$4, _cases$5) {
        var self = _ctors$4;
        switch (self._) {
            case 'List.cons':
                var $2576 = self.head;
                var $2577 = self.tail;
                var self = _cases$5;
                switch (self._) {
                    case 'List.cons':
                        var $2579 = self.head;
                        var $2580 = self.tail;
                        var _flds$10 = List$map$((_args$10 => {
                            var $2582 = (_name$3 + ("." + (() => {
                                var self = _args$10;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2583 = self.fst;
                                        var $2584 = $2583;
                                        return $2584;
                                };
                            })()));
                            return $2582;
                        }), (() => {
                            var self = $2576;
                            switch (self._) {
                                case 'Kindelia.Constructor.new':
                                    var $2585 = self.args;
                                    var $2586 = $2585;
                                    return $2586;
                            };
                        })());
                        var _head$11 = Kindelia$serialize$term$(_world$1, List$concat$(List$reverse$(_flds$10), _vars$2), $2579);
                        var _tail$12 = Kindelia$serialize$cases$(_world$1, _vars$2, _name$3, $2577, $2580);
                        var $2581 = (_tail$12 + _head$11);
                        var $2578 = $2581;
                        break;
                    case 'List.nil':
                        var $2587 = Bits$e;
                        var $2578 = $2587;
                        break;
                };
                var $2575 = $2578;
                break;
            case 'List.nil':
                var self = _cases$5;
                switch (self._) {
                    case 'List.nil':
                    case 'List.cons':
                        var $2589 = Bits$e;
                        var $2588 = $2589;
                        break;
                };
                var $2575 = $2588;
                break;
        };
        return $2575;
    };
    const Kindelia$serialize$cases = x0 => x1 => x2 => x3 => x4 => Kindelia$serialize$cases$(x0, x1, x2, x3, x4);

    function Kindelia$get_constructors$(_world$1, _name$2) {
        var self = Kindelia$get_data$(_world$1, _name$2);
        switch (self._) {
            case 'Maybe.some':
                var $2591 = self.value;
                var $2592 = Maybe$some$((() => {
                    var self = $2591;
                    switch (self._) {
                        case 'Kindelia.Data.new':
                            var $2593 = self.constructors;
                            var $2594 = $2593;
                            return $2594;
                    };
                })());
                var $2590 = $2592;
                break;
            case 'Maybe.none':
                var $2595 = Maybe$none;
                var $2590 = $2595;
                break;
        };
        return $2590;
    };
    const Kindelia$get_constructors = x0 => x1 => Kindelia$get_constructors$(x0, x1);
    const U64$to_nat = a0 => (a0);

    function Kindelia$serialize$term$(_world$1, _vars$2, _term$3) {
        var self = _term$3;
        switch (self._) {
            case 'Kindelia.Term.var':
                var $2597 = self.name;
                var $2598 = (Kindelia$serialize$name$local$(_world$1, _vars$2, $2597) + '0');
                var $2596 = $2598;
                break;
            case 'Kindelia.Term.call':
                var $2599 = self.bond;
                var $2600 = self.args;
                var _bond$6 = Kindelia$serialize$name$($2599);
                var _args$7 = Kindelia$serialize$list$(Kindelia$serialize$term(_world$1)(_vars$2), $2600);
                var $2601 = (((((_args$7 + _bond$6) + '0') + '0') + '1') + '1');
                var $2596 = $2601;
                break;
            case 'Kindelia.Term.let':
                var $2602 = self.name;
                var $2603 = self.type;
                var $2604 = self.expr;
                var $2605 = self.body;
                var _name$8 = Kindelia$serialize$name$($2602);
                var _type$9 = Kindelia$serialize$type$(_world$1, $2603);
                var _expr$10 = Kindelia$serialize$term$(_world$1, _vars$2, $2604);
                var _body$11 = Kindelia$serialize$term$(_world$1, List$cons$($2602, _vars$2), $2605);
                var $2606 = (((((((_body$11 + _expr$10) + _type$9) + _name$8) + '0') + '0') + '0') + '1');
                var $2596 = $2606;
                break;
            case 'Kindelia.Term.create':
                var $2607 = self.ctor;
                var $2608 = self.vals;
                var _ctor$6 = Kindelia$serialize$varlen$($2607);
                var _vals$7 = Kindelia$serialize$list$(Kindelia$serialize$term(_world$1)(_vars$2), $2608);
                var $2609 = (((((_vals$7 + _ctor$6) + '0') + '1') + '0') + '1');
                var $2596 = $2609;
                break;
            case 'Kindelia.Term.match':
                var $2610 = self.name;
                var $2611 = self.data;
                var $2612 = self.cses;
                var _name$7 = Kindelia$serialize$name$local$(_world$1, _vars$2, $2610);
                var _data$8 = Kindelia$serialize$name$($2611);
                var _cses$9 = Kindelia$serialize$cases$(_world$1, _vars$2, $2610, Maybe$default$(Kindelia$get_constructors$(_world$1, $2611), List$nil), $2612);
                var $2613 = ((((((_cses$9 + _data$8) + _name$7) + '0') + '1') + '1') + '1');
                var $2596 = $2613;
                break;
            case 'Kindelia.Term.word':
                var $2614 = self.numb;
                var _numb$5 = Kindelia$serialize$fixlen$(64n, ($2614));
                var $2615 = ((((_numb$5 + '1') + '0') + '0') + '1');
                var $2596 = $2615;
                break;
            case 'Kindelia.Term.compare':
                var $2616 = self.val0;
                var $2617 = self.val1;
                var $2618 = self.iflt;
                var $2619 = self.ifeq;
                var $2620 = self.ifgt;
                var _val0$9 = Kindelia$serialize$term$(_world$1, _vars$2, $2616);
                var _val1$10 = Kindelia$serialize$term$(_world$1, _vars$2, $2617);
                var _iflt$11 = Kindelia$serialize$term$(_world$1, _vars$2, $2618);
                var _ifeq$12 = Kindelia$serialize$term$(_world$1, _vars$2, $2619);
                var _ifgt$13 = Kindelia$serialize$term$(_world$1, _vars$2, $2620);
                var $2621 = ((((((((_ifgt$13 + _ifeq$12) + _iflt$11) + _val1$10) + _val0$9) + '1') + '0') + '1') + '1');
                var $2596 = $2621;
                break;
            case 'Kindelia.Term.operate':
                var $2622 = self.oper;
                var $2623 = self.val0;
                var $2624 = self.val1;
                var _oper$7 = Kindelia$serialize$fixlen$(3n, (() => {
                    var self = $2622;
                    switch (self._) {
                        case 'Kindelia.Operation.add':
                            var $2626 = 0n;
                            return $2626;
                        case 'Kindelia.Operation.sub':
                            var $2627 = 1n;
                            return $2627;
                        case 'Kindelia.Operation.mul':
                            var $2628 = 2n;
                            return $2628;
                        case 'Kindelia.Operation.div':
                            var $2629 = 3n;
                            return $2629;
                        case 'Kindelia.Operation.mod':
                            var $2630 = 4n;
                            return $2630;
                        case 'Kindelia.Operation.or':
                            var $2631 = 5n;
                            return $2631;
                        case 'Kindelia.Operation.and':
                            var $2632 = 6n;
                            return $2632;
                        case 'Kindelia.Operation.xor':
                            var $2633 = 7n;
                            return $2633;
                    };
                })());
                var _val0$8 = Kindelia$serialize$term$(_world$1, _vars$2, $2623);
                var _val1$9 = Kindelia$serialize$term$(_world$1, _vars$2, $2624);
                var $2625 = ((((((_val1$9 + _val0$8) + _oper$7) + '1') + '1') + '0') + '1');
                var $2596 = $2625;
                break;
            case 'Kindelia.Term.bind':
                var $2634 = self.bond;
                var $2635 = self.expr;
                var $2636 = self.cont;
                var _bond$7 = Kindelia$serialize$name$($2634);
                var _expr$8 = Kindelia$serialize$term$(_world$1, _vars$2, $2635);
                var _cont$9 = Kindelia$serialize$term$(_world$1, _vars$2, $2636);
                var $2637 = ((((((_cont$9 + _expr$8) + _bond$7) + '1') + '1') + '1') + '1');
                var $2596 = $2637;
                break;
        };
        return $2596;
    };
    const Kindelia$serialize$term = x0 => x1 => x2 => Kindelia$serialize$term$(x0, x1, x2);

    function Kindelia$serialize$bond$(_world$1, _bond$2) {
        var self = _bond$2;
        switch (self._) {
            case 'Kindelia.Bond.new':
                var $2639 = self.name;
                var $2640 = self.ownr;
                var $2641 = self.args;
                var $2642 = self.otyp;
                var $2643 = self.main;
                var _name$8 = Kindelia$serialize$name$($2639);
                var _ownr$9 = Kindelia$serialize$list$(Kindelia$serialize$name, $2640);
                var _args$10 = Kindelia$serialize$list$(Kindelia$serialize$pair(Kindelia$serialize$name)(Kindelia$serialize$type(_world$1)), $2641);
                var _otyp$11 = Kindelia$serialize$type$(_world$1, $2642);
                var _inam$12 = List$reverse$(List$mapped$($2641, Pair$fst));
                var _main$13 = Kindelia$serialize$term$(_world$1, _inam$12, $2643);
                var $2644 = (((_main$13 + _otyp$11) + _args$10) + _name$8);
                var $2638 = $2644;
                break;
        };
        return $2638;
    };
    const Kindelia$serialize$bond = x0 => x1 => Kindelia$serialize$bond$(x0, x1);

    function Kindelia$serialize$eval$(_world$1, _eval$2) {
        var self = _eval$2;
        switch (self._) {
            case 'Kindelia.Eval.new':
                var $2646 = self.term;
                var $2647 = self.type;
                var _term$5 = Kindelia$serialize$term$(_world$1, List$nil, $2646);
                var _type$6 = Kindelia$serialize$type$(_world$1, $2647);
                var $2648 = (_type$6 + _term$5);
                var $2645 = $2648;
                break;
        };
        return $2645;
    };
    const Kindelia$serialize$eval = x0 => x1 => Kindelia$serialize$eval$(x0, x1);

    function Kindelia$serialize$transaction$(_world$1, _transaction$2) {
        var self = _transaction$2;
        switch (self._) {
            case 'Kindelia.Transaction.new_data':
                var $2650 = self.data;
                var _data$4 = Kindelia$serialize$data$(_world$1, $2650);
                var $2651 = ((_data$4 + '0') + '0');
                var $2649 = $2651;
                break;
            case 'Kindelia.Transaction.new_bond':
                var $2652 = self.bond;
                var _bond$4 = Kindelia$serialize$bond$(_world$1, $2652);
                var $2653 = ((_bond$4 + '0') + '1');
                var $2649 = $2653;
                break;
            case 'Kindelia.Transaction.new_eval':
                var $2654 = self.eval;
                var _term$4 = Kindelia$serialize$eval$(_world$1, $2654);
                var $2655 = ((_term$4 + '1') + '0');
                var $2649 = $2655;
                break;
            case 'Kindelia.Transaction.new_name':
                var $2656 = self.name;
                var _name$4 = Kindelia$serialize$name$($2656);
                var $2657 = ((_name$4 + '1') + '1');
                var $2649 = $2657;
                break;
        };
        return $2649;
    };
    const Kindelia$serialize$transaction = x0 => x1 => Kindelia$serialize$transaction$(x0, x1);

    function Kindelia$serialize$block$(_world$1, _block$2) {
        var self = _block$2;
        switch (self._) {
            case 'List.cons':
                var $2659 = self.head;
                var $2660 = self.tail;
                var _head$5 = Kindelia$serialize$transaction$(_world$1, $2659);
                var _tail$6 = Kindelia$serialize$block$(_world$1, $2660);
                var $2661 = (_tail$6 + _head$5);
                var $2658 = $2661;
                break;
            case 'List.nil':
                var $2662 = Bits$e;
                var $2658 = $2662;
                break;
        };
        return $2658;
    };
    const Kindelia$serialize$block = x0 => x1 => Kindelia$serialize$block$(x0, x1);

    function Bits$is_empty$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $2664 = Bool$true;
                var $2663 = $2664;
                break;
            case 'o':
            case 'i':
                var $2665 = Bool$false;
                var $2663 = $2665;
                break;
        };
        return $2663;
    };
    const Bits$is_empty = x0 => Bits$is_empty$(x0);

    function Kindelia$deserialize$fixlen$(_size$1, _bits$2) {
        var self = _size$1;
        if (self === 0n) {
            var $2667 = Pair$new$(_bits$2, 0n);
            var $2666 = $2667;
        } else {
            var $2668 = (self - 1n);
            var self = _bits$2;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $2670 = self.slice(0, -1);
                    var self = Kindelia$deserialize$fixlen$($2668, $2670);
                    switch (self._) {
                        case 'Pair.new':
                            var $2672 = self.fst;
                            var $2673 = self.snd;
                            var $2674 = Pair$new$($2672, ($2673 * 2n));
                            var $2671 = $2674;
                            break;
                    };
                    var $2669 = $2671;
                    break;
                case 'i':
                    var $2675 = self.slice(0, -1);
                    var self = Kindelia$deserialize$fixlen$($2668, $2675);
                    switch (self._) {
                        case 'Pair.new':
                            var $2677 = self.fst;
                            var $2678 = self.snd;
                            var $2679 = Pair$new$($2677, (($2678 * 2n) + 1n));
                            var $2676 = $2679;
                            break;
                    };
                    var $2669 = $2676;
                    break;
                case 'e':
                    var $2680 = Pair$new$(Bits$e, 0n);
                    var $2669 = $2680;
                    break;
            };
            var $2666 = $2669;
        };
        return $2666;
    };
    const Kindelia$deserialize$fixlen = x0 => x1 => Kindelia$deserialize$fixlen$(x0, x1);
    const U16$from_nat = a0 => (Number(a0) & 0xFFFF);

    function Kindelia$deserialize$name$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2682 = self.slice(0, -1);
                var $2683 = Pair$new$($2682, "");
                var $2681 = $2683;
                break;
            case 'i':
                var $2684 = self.slice(0, -1);
                var self = Kindelia$deserialize$fixlen$(6n, $2684);
                switch (self._) {
                    case 'Pair.new':
                        var $2686 = self.fst;
                        var $2687 = self.snd;
                        var self = Kindelia$deserialize$name$($2686);
                        switch (self._) {
                            case 'Pair.new':
                                var $2689 = self.fst;
                                var $2690 = self.snd;
                                var _numb$7 = (Number($2687) & 0xFFFF);
                                var self = U16$btw$(0, _numb$7, 9);
                                if (self) {
                                    var $2692 = ((_numb$7 + 48) & 0xFFFF);
                                    var _head$8 = $2692;
                                } else {
                                    var self = U16$btw$(10, _numb$7, 35);
                                    if (self) {
                                        var $2694 = ((((_numb$7 - 10) & 0xFFFF) + 65) & 0xFFFF);
                                        var $2693 = $2694;
                                    } else {
                                        var self = U16$btw$(36, _numb$7, 61);
                                        if (self) {
                                            var $2696 = ((((_numb$7 - 36) & 0xFFFF) + 97) & 0xFFFF);
                                            var $2695 = $2696;
                                        } else {
                                            var self = U16$btw$(62, _numb$7, 62);
                                            if (self) {
                                                var $2698 = 95;
                                                var $2697 = $2698;
                                            } else {
                                                var $2699 = 46;
                                                var $2697 = $2699;
                                            };
                                            var $2695 = $2697;
                                        };
                                        var $2693 = $2695;
                                    };
                                    var _head$8 = $2693;
                                };
                                var $2691 = Pair$new$($2689, String$cons$(_head$8, $2690));
                                var $2688 = $2691;
                                break;
                        };
                        var $2685 = $2688;
                        break;
                };
                var $2681 = $2685;
                break;
            case 'e':
                var $2700 = Pair$new$(Bits$e, "");
                var $2681 = $2700;
                break;
        };
        return $2681;
    };
    const Kindelia$deserialize$name = x0 => Kindelia$deserialize$name$(x0);

    function Kindelia$deserialize$list$(_item$2, _bits$3) {
        var self = _bits$3;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2702 = self.slice(0, -1);
                var $2703 = Pair$new$($2702, List$nil);
                var $2701 = $2703;
                break;
            case 'i':
                var $2704 = self.slice(0, -1);
                var self = _item$2($2704);
                switch (self._) {
                    case 'Pair.new':
                        var $2706 = self.fst;
                        var $2707 = self.snd;
                        var self = Kindelia$deserialize$list$(_item$2, $2706);
                        switch (self._) {
                            case 'Pair.new':
                                var $2709 = self.fst;
                                var $2710 = self.snd;
                                var $2711 = Pair$new$($2709, List$cons$($2707, $2710));
                                var $2708 = $2711;
                                break;
                        };
                        var $2705 = $2708;
                        break;
                };
                var $2701 = $2705;
                break;
            case 'e':
                var $2712 = Pair$new$(Bits$e, List$nil);
                var $2701 = $2712;
                break;
        };
        return $2701;
    };
    const Kindelia$deserialize$list = x0 => x1 => Kindelia$deserialize$list$(x0, x1);

    function Kindelia$deserialize$pair$(_first$3, _second$4, _bits$5) {
        var self = _first$3(_bits$5);
        switch (self._) {
            case 'Pair.new':
                var $2714 = self.fst;
                var $2715 = self.snd;
                var self = _second$4($2714);
                switch (self._) {
                    case 'Pair.new':
                        var $2717 = self.fst;
                        var $2718 = self.snd;
                        var $2719 = Pair$new$($2717, Pair$new$($2715, $2718));
                        var $2716 = $2719;
                        break;
                };
                var $2713 = $2716;
                break;
        };
        return $2713;
    };
    const Kindelia$deserialize$pair = x0 => x1 => x2 => Kindelia$deserialize$pair$(x0, x1, x2);

    function Kindelia$deserialize$type$(_world$1, _bits$2) {
        var self = Kindelia$deserialize$fixlen$(1n, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $2721 = self.fst;
                var $2722 = self.snd;
                var self = ($2722 === 0n);
                if (self) {
                    var $2724 = Pair$new$($2721, Kindelia$Type$word);
                    var $2723 = $2724;
                } else {
                    var self = ($2722 === 1n);
                    if (self) {
                        var self = Kindelia$deserialize$name$($2721);
                        switch (self._) {
                            case 'Pair.new':
                                var $2727 = self.fst;
                                var $2728 = self.snd;
                                var $2729 = Pair$new$($2727, Kindelia$Type$data$($2728));
                                var $2726 = $2729;
                                break;
                        };
                        var $2725 = $2726;
                    } else {
                        var $2730 = Pair$new$($2721, Kindelia$Type$word);
                        var $2725 = $2730;
                    };
                    var $2723 = $2725;
                };
                var $2720 = $2723;
                break;
        };
        return $2720;
    };
    const Kindelia$deserialize$type = x0 => x1 => Kindelia$deserialize$type$(x0, x1);

    function Kindelia$deserialize$constructor$(_world$1, _bits$2) {
        var self = Kindelia$deserialize$name$(_bits$2);
        switch (self._) {
            case 'Pair.new':
                var $2732 = self.fst;
                var $2733 = self.snd;
                var self = Kindelia$deserialize$list$(Kindelia$deserialize$pair(Kindelia$deserialize$name)(Kindelia$deserialize$type(_world$1)), $2732);
                switch (self._) {
                    case 'Pair.new':
                        var $2735 = self.fst;
                        var $2736 = self.snd;
                        var $2737 = Pair$new$($2735, Kindelia$Constructor$new$($2733, $2736));
                        var $2734 = $2737;
                        break;
                };
                var $2731 = $2734;
                break;
        };
        return $2731;
    };
    const Kindelia$deserialize$constructor = x0 => x1 => Kindelia$deserialize$constructor$(x0, x1);

    function Kindelia$deserialize$data$(_world$1, _bits$2) {
        var self = Kindelia$deserialize$name$(_bits$2);
        switch (self._) {
            case 'Pair.new':
                var $2739 = self.fst;
                var $2740 = self.snd;
                var self = Kindelia$deserialize$list$(Kindelia$deserialize$constructor(_world$1), $2739);
                switch (self._) {
                    case 'Pair.new':
                        var $2742 = self.fst;
                        var $2743 = self.snd;
                        var $2744 = Pair$new$($2742, Kindelia$Data$new$($2740, $2743));
                        var $2741 = $2744;
                        break;
                };
                var $2738 = $2741;
                break;
        };
        return $2738;
    };
    const Kindelia$deserialize$data = x0 => x1 => Kindelia$deserialize$data$(x0, x1);
    const U64$from_nat = a0 => (a0 & 0xFFFFFFFFFFFFFFFFn);

    function Kindelia$deserialize$varlen$go$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2746 = self.slice(0, -1);
                var $2747 = Pair$new$($2746, 1n);
                var $2745 = $2747;
                break;
            case 'i':
                var $2748 = self.slice(0, -1);
                var self = $2748;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $2750 = self.slice(0, -1);
                        var self = Kindelia$deserialize$varlen$go$($2750);
                        switch (self._) {
                            case 'Pair.new':
                                var $2752 = self.fst;
                                var $2753 = self.snd;
                                var $2754 = Pair$new$($2752, ($2753 * 2n));
                                var $2751 = $2754;
                                break;
                        };
                        var $2749 = $2751;
                        break;
                    case 'i':
                        var $2755 = self.slice(0, -1);
                        var self = Kindelia$deserialize$varlen$go$($2755);
                        switch (self._) {
                            case 'Pair.new':
                                var $2757 = self.fst;
                                var $2758 = self.snd;
                                var $2759 = Pair$new$($2757, (($2758 * 2n) + 1n));
                                var $2756 = $2759;
                                break;
                        };
                        var $2749 = $2756;
                        break;
                    case 'e':
                        var $2760 = Pair$new$($2748, 0n);
                        var $2749 = $2760;
                        break;
                };
                var $2745 = $2749;
                break;
            case 'e':
                var $2761 = Pair$new$(Bits$e, 0n);
                var $2745 = $2761;
                break;
        };
        return $2745;
    };
    const Kindelia$deserialize$varlen$go = x0 => Kindelia$deserialize$varlen$go$(x0);

    function Kindelia$deserialize$varlen$(_bits$1) {
        var self = Kindelia$deserialize$varlen$go$(_bits$1);
        switch (self._) {
            case 'Pair.new':
                var $2763 = self.fst;
                var $2764 = self.snd;
                var $2765 = Pair$new$($2763, ($2764 - 1n <= 0n ? 0n : $2764 - 1n));
                var $2762 = $2765;
                break;
        };
        return $2762;
    };
    const Kindelia$deserialize$varlen = x0 => Kindelia$deserialize$varlen$(x0);

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
                        var $2766 = self.head;
                        var $2767 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $2769 = Maybe$some$($2766);
                            var $2768 = $2769;
                        } else {
                            var $2770 = (self - 1n);
                            var $2771 = List$get$($2770, $2767);
                            var $2768 = $2771;
                        };
                        return $2768;
                    case 'List.nil':
                        var $2772 = Maybe$none;
                        return $2772;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$get = x0 => x1 => List$get$(x0, x1);

    function Kindelia$deserialize$name$local$(_world$1, _vars$2, _bits$3) {
        var self = Kindelia$deserialize$varlen$(_bits$3);
        switch (self._) {
            case 'Pair.new':
                var $2774 = self.fst;
                var $2775 = self.snd;
                var $2776 = Pair$new$($2774, Maybe$default$(List$get$($2775, _vars$2), ""));
                var $2773 = $2776;
                break;
        };
        return $2773;
    };
    const Kindelia$deserialize$name$local = x0 => x1 => x2 => Kindelia$deserialize$name$local$(x0, x1, x2);

    function Kindelia$deserialize$cases$(_world$1, _vars$2, _name$3, _ctors$4, _bits$5) {
        var self = _ctors$4;
        switch (self._) {
            case 'List.cons':
                var $2778 = self.head;
                var $2779 = self.tail;
                var _flds$8 = List$map$((_args$8 => {
                    var $2781 = (_name$3 + ("." + (() => {
                        var self = _args$8;
                        switch (self._) {
                            case 'Pair.new':
                                var $2782 = self.fst;
                                var $2783 = $2782;
                                return $2783;
                        };
                    })()));
                    return $2781;
                }), (() => {
                    var self = $2778;
                    switch (self._) {
                        case 'Kindelia.Constructor.new':
                            var $2784 = self.args;
                            var $2785 = $2784;
                            return $2785;
                    };
                })());
                var self = Kindelia$deserialize$term$(_world$1, List$concat$(List$reverse$(_flds$8), _vars$2), _bits$5);
                switch (self._) {
                    case 'Pair.new':
                        var $2786 = self.fst;
                        var $2787 = self.snd;
                        var self = Kindelia$deserialize$cases$(_world$1, _vars$2, _name$3, $2779, $2786);
                        switch (self._) {
                            case 'Pair.new':
                                var $2789 = self.fst;
                                var $2790 = self.snd;
                                var $2791 = Pair$new$($2789, List$cons$($2787, $2790));
                                var $2788 = $2791;
                                break;
                        };
                        var $2780 = $2788;
                        break;
                };
                var $2777 = $2780;
                break;
            case 'List.nil':
                var $2792 = Pair$new$(_bits$5, List$nil);
                var $2777 = $2792;
                break;
        };
        return $2777;
    };
    const Kindelia$deserialize$cases = x0 => x1 => x2 => x3 => x4 => Kindelia$deserialize$cases$(x0, x1, x2, x3, x4);

    function Kindelia$deserialize$term$(_world$1, _vars$2, _bits$3) {
        var self = _bits$3;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2794 = self.slice(0, -1);
                var self = Kindelia$deserialize$name$local$(_world$1, _vars$2, $2794);
                switch (self._) {
                    case 'Pair.new':
                        var $2796 = self.fst;
                        var $2797 = self.snd;
                        var $2798 = Pair$new$($2796, Kindelia$Term$var$($2797));
                        var $2795 = $2798;
                        break;
                };
                var $2793 = $2795;
                break;
            case 'i':
                var $2799 = self.slice(0, -1);
                var self = Kindelia$deserialize$fixlen$(3n, $2799);
                switch (self._) {
                    case 'Pair.new':
                        var $2801 = self.fst;
                        var $2802 = self.snd;
                        var self = ($2802 === 0n);
                        if (self) {
                            var self = Kindelia$deserialize$name$($2801);
                            switch (self._) {
                                case 'Pair.new':
                                    var $2805 = self.fst;
                                    var $2806 = self.snd;
                                    var self = Kindelia$deserialize$type$(_world$1, $2805);
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $2808 = self.fst;
                                            var $2809 = self.snd;
                                            var self = Kindelia$deserialize$term$(_world$1, _vars$2, $2808);
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $2811 = self.fst;
                                                    var $2812 = self.snd;
                                                    var self = Kindelia$deserialize$term$(_world$1, List$cons$($2806, _vars$2), $2811);
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $2814 = self.fst;
                                                            var $2815 = self.snd;
                                                            var $2816 = Pair$new$($2814, Kindelia$Term$let$($2806, $2809, $2812, $2815));
                                                            var $2813 = $2816;
                                                            break;
                                                    };
                                                    var $2810 = $2813;
                                                    break;
                                            };
                                            var $2807 = $2810;
                                            break;
                                    };
                                    var $2804 = $2807;
                                    break;
                            };
                            var $2803 = $2804;
                        } else {
                            var self = ($2802 === 1n);
                            if (self) {
                                var self = Kindelia$deserialize$name$($2801);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2819 = self.fst;
                                        var $2820 = self.snd;
                                        var self = Kindelia$deserialize$list$(Kindelia$deserialize$term(_world$1)(_vars$2), $2819);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $2822 = self.fst;
                                                var $2823 = self.snd;
                                                var $2824 = Pair$new$($2822, Kindelia$Term$call$($2820, $2823));
                                                var $2821 = $2824;
                                                break;
                                        };
                                        var $2818 = $2821;
                                        break;
                                };
                                var $2817 = $2818;
                            } else {
                                var self = ($2802 === 2n);
                                if (self) {
                                    var self = Kindelia$deserialize$varlen$($2801);
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $2827 = self.fst;
                                            var $2828 = self.snd;
                                            var self = Kindelia$deserialize$list$(Kindelia$deserialize$term(_world$1)(_vars$2), $2827);
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $2830 = self.fst;
                                                    var $2831 = self.snd;
                                                    var $2832 = Pair$new$($2830, Kindelia$Term$create$($2828, $2831));
                                                    var $2829 = $2832;
                                                    break;
                                            };
                                            var $2826 = $2829;
                                            break;
                                    };
                                    var $2825 = $2826;
                                } else {
                                    var self = ($2802 === 3n);
                                    if (self) {
                                        var self = Kindelia$deserialize$name$local$(_world$1, _vars$2, $2801);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $2835 = self.fst;
                                                var $2836 = self.snd;
                                                var self = Kindelia$deserialize$name$($2835);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $2838 = self.fst;
                                                        var $2839 = self.snd;
                                                        var self = Kindelia$deserialize$cases$(_world$1, _vars$2, $2836, Maybe$default$(Kindelia$get_constructors$(_world$1, $2839), List$nil), $2838);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $2841 = self.fst;
                                                                var $2842 = self.snd;
                                                                var $2843 = Pair$new$($2841, Kindelia$Term$match$($2836, $2839, $2842));
                                                                var $2840 = $2843;
                                                                break;
                                                        };
                                                        var $2837 = $2840;
                                                        break;
                                                };
                                                var $2834 = $2837;
                                                break;
                                        };
                                        var $2833 = $2834;
                                    } else {
                                        var self = ($2802 === 4n);
                                        if (self) {
                                            var self = Kindelia$deserialize$fixlen$(64n, $2801);
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $2846 = self.fst;
                                                    var $2847 = self.snd;
                                                    var $2848 = Pair$new$($2846, Kindelia$Term$word$(($2847 & 0xFFFFFFFFFFFFFFFFn)));
                                                    var $2845 = $2848;
                                                    break;
                                            };
                                            var $2844 = $2845;
                                        } else {
                                            var self = ($2802 === 5n);
                                            if (self) {
                                                var self = Kindelia$deserialize$term$(_world$1, _vars$2, $2801);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $2851 = self.fst;
                                                        var $2852 = self.snd;
                                                        var self = Kindelia$deserialize$term$(_world$1, _vars$2, $2851);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $2854 = self.fst;
                                                                var $2855 = self.snd;
                                                                var self = Kindelia$deserialize$term$(_world$1, _vars$2, $2854);
                                                                switch (self._) {
                                                                    case 'Pair.new':
                                                                        var $2857 = self.fst;
                                                                        var $2858 = self.snd;
                                                                        var self = Kindelia$deserialize$term$(_world$1, _vars$2, $2857);
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $2860 = self.fst;
                                                                                var $2861 = self.snd;
                                                                                var self = Kindelia$deserialize$term$(_world$1, _vars$2, $2860);
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $2863 = self.fst;
                                                                                        var $2864 = self.snd;
                                                                                        var $2865 = Pair$new$($2863, Kindelia$Term$compare$($2852, $2855, $2858, $2861, $2864));
                                                                                        var $2862 = $2865;
                                                                                        break;
                                                                                };
                                                                                var $2859 = $2862;
                                                                                break;
                                                                        };
                                                                        var $2856 = $2859;
                                                                        break;
                                                                };
                                                                var $2853 = $2856;
                                                                break;
                                                        };
                                                        var $2850 = $2853;
                                                        break;
                                                };
                                                var $2849 = $2850;
                                            } else {
                                                var self = ($2802 === 6n);
                                                if (self) {
                                                    var self = Kindelia$deserialize$fixlen$(3n, $2801);
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $2868 = self.fst;
                                                            var $2869 = self.snd;
                                                            var self = Kindelia$deserialize$term$(_world$1, _vars$2, $2868);
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $2871 = self.fst;
                                                                    var $2872 = self.snd;
                                                                    var self = Kindelia$deserialize$term$(_world$1, _vars$2, $2871);
                                                                    switch (self._) {
                                                                        case 'Pair.new':
                                                                            var $2874 = self.fst;
                                                                            var $2875 = self.snd;
                                                                            var self = ($2869 === 0n);
                                                                            if (self) {
                                                                                var $2877 = Kindelia$Operation$add;
                                                                                var _oper$13 = $2877;
                                                                            } else {
                                                                                var self = ($2869 === 1n);
                                                                                if (self) {
                                                                                    var $2879 = Kindelia$Operation$sub;
                                                                                    var $2878 = $2879;
                                                                                } else {
                                                                                    var self = ($2869 === 2n);
                                                                                    if (self) {
                                                                                        var $2881 = Kindelia$Operation$mul;
                                                                                        var $2880 = $2881;
                                                                                    } else {
                                                                                        var self = ($2869 === 3n);
                                                                                        if (self) {
                                                                                            var $2883 = Kindelia$Operation$div;
                                                                                            var $2882 = $2883;
                                                                                        } else {
                                                                                            var self = ($2869 === 4n);
                                                                                            if (self) {
                                                                                                var $2885 = Kindelia$Operation$mod;
                                                                                                var $2884 = $2885;
                                                                                            } else {
                                                                                                var self = ($2869 === 5n);
                                                                                                if (self) {
                                                                                                    var $2887 = Kindelia$Operation$or;
                                                                                                    var $2886 = $2887;
                                                                                                } else {
                                                                                                    var self = ($2869 === 6n);
                                                                                                    if (self) {
                                                                                                        var $2889 = Kindelia$Operation$and;
                                                                                                        var $2888 = $2889;
                                                                                                    } else {
                                                                                                        var self = ($2869 === 7n);
                                                                                                        if (self) {
                                                                                                            var $2891 = Kindelia$Operation$xor;
                                                                                                            var $2890 = $2891;
                                                                                                        } else {
                                                                                                            var $2892 = Kindelia$Operation$add;
                                                                                                            var $2890 = $2892;
                                                                                                        };
                                                                                                        var $2888 = $2890;
                                                                                                    };
                                                                                                    var $2886 = $2888;
                                                                                                };
                                                                                                var $2884 = $2886;
                                                                                            };
                                                                                            var $2882 = $2884;
                                                                                        };
                                                                                        var $2880 = $2882;
                                                                                    };
                                                                                    var $2878 = $2880;
                                                                                };
                                                                                var _oper$13 = $2878;
                                                                            };
                                                                            var $2876 = Pair$new$($2874, Kindelia$Term$operate$(_oper$13, $2872, $2875));
                                                                            var $2873 = $2876;
                                                                            break;
                                                                    };
                                                                    var $2870 = $2873;
                                                                    break;
                                                            };
                                                            var $2867 = $2870;
                                                            break;
                                                    };
                                                    var $2866 = $2867;
                                                } else {
                                                    var self = ($2802 === 7n);
                                                    if (self) {
                                                        var self = Kindelia$deserialize$name$($2801);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $2895 = self.fst;
                                                                var $2896 = self.snd;
                                                                var self = Kindelia$deserialize$term$(_world$1, _vars$2, $2895);
                                                                switch (self._) {
                                                                    case 'Pair.new':
                                                                        var $2898 = self.fst;
                                                                        var $2899 = self.snd;
                                                                        var self = Kindelia$deserialize$term$(_world$1, _vars$2, $2898);
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $2901 = self.fst;
                                                                                var $2902 = self.snd;
                                                                                var $2903 = Pair$new$($2901, Kindelia$Term$bind$($2896, $2899, $2902));
                                                                                var $2900 = $2903;
                                                                                break;
                                                                        };
                                                                        var $2897 = $2900;
                                                                        break;
                                                                };
                                                                var $2894 = $2897;
                                                                break;
                                                        };
                                                        var $2893 = $2894;
                                                    } else {
                                                        var $2904 = Pair$new$($2801, Kindelia$Term$word$(0n));
                                                        var $2893 = $2904;
                                                    };
                                                    var $2866 = $2893;
                                                };
                                                var $2849 = $2866;
                                            };
                                            var $2844 = $2849;
                                        };
                                        var $2833 = $2844;
                                    };
                                    var $2825 = $2833;
                                };
                                var $2817 = $2825;
                            };
                            var $2803 = $2817;
                        };
                        var $2800 = $2803;
                        break;
                };
                var $2793 = $2800;
                break;
            case 'e':
                var $2905 = Pair$new$(_bits$3, Kindelia$Term$word$(0n));
                var $2793 = $2905;
                break;
        };
        return $2793;
    };
    const Kindelia$deserialize$term = x0 => x1 => x2 => Kindelia$deserialize$term$(x0, x1, x2);

    function Kindelia$deserialize$bond$(_world$1, _bits$2) {
        var self = Kindelia$deserialize$name$(_bits$2);
        switch (self._) {
            case 'Pair.new':
                var $2907 = self.fst;
                var $2908 = self.snd;
                var self = Kindelia$deserialize$list$(Kindelia$deserialize$name, $2907);
                switch (self._) {
                    case 'Pair.new':
                        var $2910 = self.fst;
                        var $2911 = self.snd;
                        var self = Kindelia$deserialize$list$(Kindelia$deserialize$pair(Kindelia$deserialize$name)(Kindelia$deserialize$type(_world$1)), $2910);
                        switch (self._) {
                            case 'Pair.new':
                                var $2913 = self.fst;
                                var $2914 = self.snd;
                                var self = Kindelia$deserialize$type$(_world$1, $2913);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2916 = self.fst;
                                        var $2917 = self.snd;
                                        var _inam$11 = List$reverse$(List$mapped$($2914, Pair$fst));
                                        var self = Kindelia$deserialize$term$(_world$1, _inam$11, $2916);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $2919 = self.fst;
                                                var $2920 = self.snd;
                                                var $2921 = Pair$new$($2919, Kindelia$Bond$new$($2908, $2911, $2914, $2917, $2920));
                                                var $2918 = $2921;
                                                break;
                                        };
                                        var $2915 = $2918;
                                        break;
                                };
                                var $2912 = $2915;
                                break;
                        };
                        var $2909 = $2912;
                        break;
                };
                var $2906 = $2909;
                break;
        };
        return $2906;
    };
    const Kindelia$deserialize$bond = x0 => x1 => Kindelia$deserialize$bond$(x0, x1);

    function Kindelia$deserialize$eval$(_world$1, _bits$2) {
        var self = Kindelia$deserialize$term$(_world$1, List$nil, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $2923 = self.fst;
                var $2924 = self.snd;
                var self = Kindelia$deserialize$type$(_world$1, $2923);
                switch (self._) {
                    case 'Pair.new':
                        var $2926 = self.fst;
                        var $2927 = self.snd;
                        var $2928 = Pair$new$($2926, Kindelia$Eval$new$($2924, $2927));
                        var $2925 = $2928;
                        break;
                };
                var $2922 = $2925;
                break;
        };
        return $2922;
    };
    const Kindelia$deserialize$eval = x0 => x1 => Kindelia$deserialize$eval$(x0, x1);

    function Kindelia$deserialize$transaction$(_world$1, _bits$2) {
        var self = Kindelia$deserialize$fixlen$(2n, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $2930 = self.fst;
                var $2931 = self.snd;
                var self = ($2931 === 0n);
                if (self) {
                    var self = Kindelia$deserialize$data$(_world$1, $2930);
                    switch (self._) {
                        case 'Pair.new':
                            var $2934 = self.fst;
                            var $2935 = self.snd;
                            var $2936 = Pair$new$($2934, Kindelia$Transaction$new_data$($2935));
                            var $2933 = $2936;
                            break;
                    };
                    var $2932 = $2933;
                } else {
                    var self = ($2931 === 1n);
                    if (self) {
                        var self = Kindelia$deserialize$bond$(_world$1, $2930);
                        switch (self._) {
                            case 'Pair.new':
                                var $2939 = self.fst;
                                var $2940 = self.snd;
                                var $2941 = Pair$new$($2939, Kindelia$Transaction$new_bond$($2940));
                                var $2938 = $2941;
                                break;
                        };
                        var $2937 = $2938;
                    } else {
                        var self = ($2931 === 2n);
                        if (self) {
                            var self = Kindelia$deserialize$eval$(_world$1, $2930);
                            switch (self._) {
                                case 'Pair.new':
                                    var $2944 = self.fst;
                                    var $2945 = self.snd;
                                    var $2946 = Pair$new$($2944, Kindelia$Transaction$new_eval$($2945));
                                    var $2943 = $2946;
                                    break;
                            };
                            var $2942 = $2943;
                        } else {
                            var self = ($2931 === 3n);
                            if (self) {
                                var self = Kindelia$deserialize$name$($2930);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2949 = self.fst;
                                        var $2950 = self.snd;
                                        var $2951 = Pair$new$($2949, Kindelia$Transaction$new_name$($2950));
                                        var $2948 = $2951;
                                        break;
                                };
                                var $2947 = $2948;
                            } else {
                                var $2952 = Pair$new$($2930, Kindelia$Transaction$new_data$(Kindelia$Data$new$("", List$nil)));
                                var $2947 = $2952;
                            };
                            var $2942 = $2947;
                        };
                        var $2937 = $2942;
                    };
                    var $2932 = $2937;
                };
                var $2929 = $2932;
                break;
        };
        return $2929;
    };
    const Kindelia$deserialize$transaction = x0 => x1 => Kindelia$deserialize$transaction$(x0, x1);

    function Kindelia$deserialize$block$(_world$1, _bits$2) {
        var self = Bits$is_empty$(_bits$2);
        if (self) {
            var $2954 = Pair$new$(Bits$e, List$nil);
            var $2953 = $2954;
        } else {
            var self = Kindelia$deserialize$transaction$(_world$1, _bits$2);
            switch (self._) {
                case 'Pair.new':
                    var $2956 = self.fst;
                    var $2957 = self.snd;
                    var self = Kindelia$deserialize$block$(_world$1, $2956);
                    switch (self._) {
                        case 'Pair.new':
                            var $2959 = self.fst;
                            var $2960 = self.snd;
                            var $2961 = Pair$new$($2959, List$cons$($2957, $2960));
                            var $2958 = $2961;
                            break;
                    };
                    var $2955 = $2958;
                    break;
            };
            var $2953 = $2955;
        };
        return $2953;
    };
    const Kindelia$deserialize$block = x0 => x1 => Kindelia$deserialize$block$(x0, x1);

    function Bits$hex$encode$(_x$1) {
        var self = _x$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2963 = self.slice(0, -1);
                var self = $2963;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $2965 = self.slice(0, -1);
                        var self = $2965;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $2967 = self.slice(0, -1);
                                var self = $2967;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $2969 = self.slice(0, -1);
                                        var $2970 = ("0" + Bits$hex$encode$($2969));
                                        var $2968 = $2970;
                                        break;
                                    case 'i':
                                        var $2971 = self.slice(0, -1);
                                        var $2972 = ("8" + Bits$hex$encode$($2971));
                                        var $2968 = $2972;
                                        break;
                                    case 'e':
                                        var $2973 = "0";
                                        var $2968 = $2973;
                                        break;
                                };
                                var $2966 = $2968;
                                break;
                            case 'i':
                                var $2974 = self.slice(0, -1);
                                var self = $2974;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $2976 = self.slice(0, -1);
                                        var $2977 = ("4" + Bits$hex$encode$($2976));
                                        var $2975 = $2977;
                                        break;
                                    case 'i':
                                        var $2978 = self.slice(0, -1);
                                        var $2979 = ("c" + Bits$hex$encode$($2978));
                                        var $2975 = $2979;
                                        break;
                                    case 'e':
                                        var $2980 = "4";
                                        var $2975 = $2980;
                                        break;
                                };
                                var $2966 = $2975;
                                break;
                            case 'e':
                                var $2981 = "0";
                                var $2966 = $2981;
                                break;
                        };
                        var $2964 = $2966;
                        break;
                    case 'i':
                        var $2982 = self.slice(0, -1);
                        var self = $2982;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $2984 = self.slice(0, -1);
                                var self = $2984;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $2986 = self.slice(0, -1);
                                        var $2987 = ("2" + Bits$hex$encode$($2986));
                                        var $2985 = $2987;
                                        break;
                                    case 'i':
                                        var $2988 = self.slice(0, -1);
                                        var $2989 = ("a" + Bits$hex$encode$($2988));
                                        var $2985 = $2989;
                                        break;
                                    case 'e':
                                        var $2990 = "2";
                                        var $2985 = $2990;
                                        break;
                                };
                                var $2983 = $2985;
                                break;
                            case 'i':
                                var $2991 = self.slice(0, -1);
                                var self = $2991;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $2993 = self.slice(0, -1);
                                        var $2994 = ("6" + Bits$hex$encode$($2993));
                                        var $2992 = $2994;
                                        break;
                                    case 'i':
                                        var $2995 = self.slice(0, -1);
                                        var $2996 = ("e" + Bits$hex$encode$($2995));
                                        var $2992 = $2996;
                                        break;
                                    case 'e':
                                        var $2997 = "6";
                                        var $2992 = $2997;
                                        break;
                                };
                                var $2983 = $2992;
                                break;
                            case 'e':
                                var $2998 = "2";
                                var $2983 = $2998;
                                break;
                        };
                        var $2964 = $2983;
                        break;
                    case 'e':
                        var $2999 = "0";
                        var $2964 = $2999;
                        break;
                };
                var $2962 = $2964;
                break;
            case 'i':
                var $3000 = self.slice(0, -1);
                var self = $3000;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $3002 = self.slice(0, -1);
                        var self = $3002;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $3004 = self.slice(0, -1);
                                var self = $3004;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3006 = self.slice(0, -1);
                                        var $3007 = ("1" + Bits$hex$encode$($3006));
                                        var $3005 = $3007;
                                        break;
                                    case 'i':
                                        var $3008 = self.slice(0, -1);
                                        var $3009 = ("9" + Bits$hex$encode$($3008));
                                        var $3005 = $3009;
                                        break;
                                    case 'e':
                                        var $3010 = "1";
                                        var $3005 = $3010;
                                        break;
                                };
                                var $3003 = $3005;
                                break;
                            case 'i':
                                var $3011 = self.slice(0, -1);
                                var self = $3011;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3013 = self.slice(0, -1);
                                        var $3014 = ("5" + Bits$hex$encode$($3013));
                                        var $3012 = $3014;
                                        break;
                                    case 'i':
                                        var $3015 = self.slice(0, -1);
                                        var $3016 = ("d" + Bits$hex$encode$($3015));
                                        var $3012 = $3016;
                                        break;
                                    case 'e':
                                        var $3017 = "5";
                                        var $3012 = $3017;
                                        break;
                                };
                                var $3003 = $3012;
                                break;
                            case 'e':
                                var $3018 = "1";
                                var $3003 = $3018;
                                break;
                        };
                        var $3001 = $3003;
                        break;
                    case 'i':
                        var $3019 = self.slice(0, -1);
                        var self = $3019;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $3021 = self.slice(0, -1);
                                var self = $3021;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3023 = self.slice(0, -1);
                                        var $3024 = ("3" + Bits$hex$encode$($3023));
                                        var $3022 = $3024;
                                        break;
                                    case 'i':
                                        var $3025 = self.slice(0, -1);
                                        var $3026 = ("b" + Bits$hex$encode$($3025));
                                        var $3022 = $3026;
                                        break;
                                    case 'e':
                                        var $3027 = "3";
                                        var $3022 = $3027;
                                        break;
                                };
                                var $3020 = $3022;
                                break;
                            case 'i':
                                var $3028 = self.slice(0, -1);
                                var self = $3028;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3030 = self.slice(0, -1);
                                        var $3031 = ("7" + Bits$hex$encode$($3030));
                                        var $3029 = $3031;
                                        break;
                                    case 'i':
                                        var $3032 = self.slice(0, -1);
                                        var $3033 = ("f" + Bits$hex$encode$($3032));
                                        var $3029 = $3033;
                                        break;
                                    case 'e':
                                        var $3034 = "7";
                                        var $3029 = $3034;
                                        break;
                                };
                                var $3020 = $3029;
                                break;
                            case 'e':
                                var $3035 = "3";
                                var $3020 = $3035;
                                break;
                        };
                        var $3001 = $3020;
                        break;
                    case 'e':
                        var $3036 = "1";
                        var $3001 = $3036;
                        break;
                };
                var $2962 = $3001;
                break;
            case 'e':
                var $3037 = "";
                var $2962 = $3037;
                break;
        };
        return $2962;
    };
    const Bits$hex$encode = x0 => Bits$hex$encode$(x0);
    const Bits$eql = a0 => a1 => (a1 === a0);

    function Kindelia$Entry$data$(_value$1) {
        var $3038 = ({
            _: 'Kindelia.Entry.data',
            'value': _value$1
        });
        return $3038;
    };
    const Kindelia$Entry$data = x0 => Kindelia$Entry$data$(x0);

    function List$unzip$(_xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $3040 = self.head;
                var $3041 = self.tail;
                var _rec$6 = List$unzip$($3041);
                var self = $3040;
                switch (self._) {
                    case 'Pair.new':
                        var $3043 = self.fst;
                        var $3044 = self.snd;
                        var self = _rec$6;
                        switch (self._) {
                            case 'Pair.new':
                                var $3046 = self.fst;
                                var $3047 = self.snd;
                                var $3048 = Pair$new$(List$cons$($3043, $3046), List$cons$($3044, $3047));
                                var $3045 = $3048;
                                break;
                        };
                        var $3042 = $3045;
                        break;
                };
                var $3039 = $3042;
                break;
            case 'List.nil':
                var $3049 = Pair$new$(List$nil, List$nil);
                var $3039 = $3049;
                break;
        };
        return $3039;
    };
    const List$unzip = x0 => List$unzip$(x0);

    function Kindelia$extend$(_map$2, _kvs$3) {
        var Kindelia$extend$ = (_map$2, _kvs$3) => ({
            ctr: 'TCO',
            arg: [_map$2, _kvs$3]
        });
        var Kindelia$extend = _map$2 => _kvs$3 => Kindelia$extend$(_map$2, _kvs$3);
        var arg = [_map$2, _kvs$3];
        while (true) {
            let [_map$2, _kvs$3] = arg;
            var R = (() => {
                var self = _kvs$3;
                switch (self._) {
                    case 'List.cons':
                        var $3050 = self.head;
                        var $3051 = self.tail;
                        var $3052 = Kindelia$extend$(Map$set$((() => {
                            var self = $3050;
                            switch (self._) {
                                case 'Pair.new':
                                    var $3053 = self.fst;
                                    var $3054 = $3053;
                                    return $3054;
                            };
                        })(), (() => {
                            var self = $3050;
                            switch (self._) {
                                case 'Pair.new':
                                    var $3055 = self.snd;
                                    var $3056 = $3055;
                                    return $3056;
                            };
                        })(), _map$2), $3051);
                        return $3052;
                    case 'List.nil':
                        var $3057 = _map$2;
                        return $3057;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kindelia$extend = x0 => x1 => Kindelia$extend$(x0, x1);

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
                        var $3058 = self.head;
                        var $3059 = self.tail;
                        var _key$8 = Pair$fst$($3058);
                        var _val$9 = Pair$snd$($3058);
                        var _new_acc$10 = BBT$insert$(_cmp$3, _key$8, _val$9, _acc$4);
                        var $3060 = BBT$from_list$go$(_cmp$3, _new_acc$10, $3059);
                        return $3060;
                    case 'List.nil':
                        var $3061 = _acc$4;
                        return $3061;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BBT$from_list$go = x0 => x1 => x2 => BBT$from_list$go$(x0, x1, x2);

    function BBT$from_list$(_cmp$3, _xs$4) {
        var $3062 = BBT$from_list$go$(_cmp$3, BBT$tip, _xs$4);
        return $3062;
    };
    const BBT$from_list = x0 => x1 => BBT$from_list$(x0, x1);

    function Map$from_list$(_xs$2) {
        var $3063 = BBT$from_list$(String$cmp, _xs$2);
        return $3063;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.cons':
                var $3065 = self.head;
                var $3066 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.cons':
                        var $3068 = self.head;
                        var $3069 = self.tail;
                        var $3070 = List$cons$(Pair$new$($3065, $3068), List$zip$($3066, $3069));
                        var $3067 = $3070;
                        break;
                    case 'List.nil':
                        var $3071 = List$nil;
                        var $3067 = $3071;
                        break;
                };
                var $3064 = $3067;
                break;
            case 'List.nil':
                var $3072 = List$nil;
                var $3064 = $3072;
                break;
        };
        return $3064;
    };
    const List$zip = x0 => x1 => List$zip$(x0, x1);

    function Kindelia$equal$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Kindelia.Type.data':
                var $3074 = self.name;
                var self = _b$2;
                switch (self._) {
                    case 'Kindelia.Type.data':
                        var $3076 = self.name;
                        var $3077 = ($3074 === $3076);
                        var $3075 = $3077;
                        break;
                    case 'Kindelia.Type.word':
                        var $3078 = Bool$false;
                        var $3075 = $3078;
                        break;
                };
                var $3073 = $3075;
                break;
            case 'Kindelia.Type.word':
                var self = _b$2;
                switch (self._) {
                    case 'Kindelia.Type.word':
                        var $3080 = Bool$true;
                        var $3079 = $3080;
                        break;
                    case 'Kindelia.Type.data':
                        var $3081 = Bool$false;
                        var $3079 = $3081;
                        break;
                };
                var $3073 = $3079;
                break;
        };
        return $3073;
    };
    const Kindelia$equal = x0 => x1 => Kindelia$equal$(x0, x1);

    function Kindelia$get_bond$(_world$1, _name$2) {
        var $3082 = Maybe$monad$((_m$bind$3 => _m$pure$4 => {
            var $3083 = _m$bind$3;
            return $3083;
        }))(Map$get$(_name$2, (() => {
            var self = _world$1;
            switch (self._) {
                case 'Kindelia.World.new':
                    var $3084 = self.entry;
                    var $3085 = $3084;
                    return $3085;
            };
        })()))((_entry$3 => {
            var self = _entry$3;
            switch (self._) {
                case 'Kindelia.Entry.bond':
                    var $3087 = self.value;
                    var $3088 = Maybe$some$($3087);
                    var $3086 = $3088;
                    break;
                case 'Kindelia.Entry.data':
                    var $3089 = Maybe$none;
                    var $3086 = $3089;
                    break;
            };
            return $3086;
        }));
        return $3082;
    };
    const Kindelia$get_bond = x0 => x1 => Kindelia$get_bond$(x0, x1);

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
                        var $3090 = self.head;
                        var $3091 = self.tail;
                        var self = _cond$2($3090);
                        if (self) {
                            var $3093 = List$all$(_cond$2, $3091);
                            var $3092 = $3093;
                        } else {
                            var $3094 = Bool$false;
                            var $3092 = $3094;
                        };
                        return $3092;
                    case 'List.nil':
                        var $3095 = Bool$true;
                        return $3095;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$all = x0 => x1 => List$all$(x0, x1);
    const List$length = a0 => (list_length(a0));

    function List$zip_with$(_f$4, _as$5, _bs$6) {
        var self = _as$5;
        switch (self._) {
            case 'List.cons':
                var $3097 = self.head;
                var $3098 = self.tail;
                var self = _bs$6;
                switch (self._) {
                    case 'List.cons':
                        var $3100 = self.head;
                        var $3101 = self.tail;
                        var $3102 = List$cons$(_f$4($3097)($3100), List$zip_with$(_f$4, $3098, $3101));
                        var $3099 = $3102;
                        break;
                    case 'List.nil':
                        var $3103 = List$nil;
                        var $3099 = $3103;
                        break;
                };
                var $3096 = $3099;
                break;
            case 'List.nil':
                var $3104 = List$nil;
                var $3096 = $3104;
                break;
        };
        return $3096;
    };
    const List$zip_with = x0 => x1 => x2 => List$zip_with$(x0, x1, x2);

    function List$zipped_with$(_as$3, _bs$4, _f$6) {
        var $3105 = List$zip_with$(_f$6, _as$3, _bs$4);
        return $3105;
    };
    const List$zipped_with = x0 => x1 => x2 => List$zipped_with$(x0, x1, x2);

    function List$and$(_list$1) {
        var $3106 = List$all$((_x$2 => {
            var $3107 = _x$2;
            return $3107;
        }), _list$1);
        return $3106;
    };
    const List$and = x0 => List$and$(x0);

    function List$is_empty$(_list$2) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $3109 = Bool$true;
                var $3108 = $3109;
                break;
            case 'List.cons':
                var $3110 = Bool$false;
                var $3108 = $3110;
                break;
        };
        return $3108;
    };
    const List$is_empty = x0 => List$is_empty$(x0);

    function Kindelia$check$(_context$1, _world$2, _term$3, _type$4, _caller$5) {
        var self = _context$1;
        switch (self._) {
            case 'BBT.tip':
                var self = _term$3;
                switch (self._) {
                    case 'Kindelia.Term.var':
                        var $3113 = self.name;
                        var self = Map$get$($3113, _context$1);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3115 = self.value;
                                var $3116 = Kindelia$equal$($3115, _type$4);
                                var $3114 = $3116;
                                break;
                            case 'Maybe.none':
                                var $3117 = Bool$false;
                                var $3114 = $3117;
                                break;
                        };
                        var $3112 = $3114;
                        break;
                    case 'Kindelia.Term.call':
                        var $3118 = self.bond;
                        var $3119 = self.args;
                        var self = Kindelia$get_bond$(_world$2, $3118);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3121 = self.value;
                                var _bond$9 = $3121;
                                var self = _bond$9;
                                switch (self._) {
                                    case 'Kindelia.Bond.new':
                                        var $3123 = self.args;
                                        var $3124 = self.otyp;
                                        var _otyp$15 = Kindelia$equal$($3124, _type$4);
                                        var _ityp$16 = List$mapped$($3123, Pair$snd);
                                        var _args$17 = List$zip$($3119, _ityp$16);
                                        var _args$18 = List$all$((_x$18 => {
                                            var $3126 = Kindelia$check$(_context$1, _world$2, (() => {
                                                var self = _x$18;
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3127 = self.fst;
                                                        var $3128 = $3127;
                                                        return $3128;
                                                };
                                            })(), (() => {
                                                var self = _x$18;
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3129 = self.snd;
                                                        var $3130 = $3129;
                                                        return $3130;
                                                };
                                            })(), _caller$5);
                                            return $3126;
                                        }), _args$17);
                                        var $3125 = (_otyp$15 && _args$18);
                                        var $3122 = $3125;
                                        break;
                                };
                                var $3120 = $3122;
                                break;
                            case 'Maybe.none':
                                var $3131 = Bool$false;
                                var $3120 = $3131;
                                break;
                        };
                        var $3112 = $3120;
                        break;
                    case 'Kindelia.Term.let':
                        var $3132 = self.name;
                        var $3133 = self.type;
                        var $3134 = self.expr;
                        var $3135 = self.body;
                        var _expr$10 = Kindelia$check$(_context$1, _world$2, $3134, $3133, _caller$5);
                        var _ctx2$11 = Map$set$($3132, $3133, _context$1);
                        var _body$12 = Kindelia$check$(_ctx2$11, _world$2, $3135, _type$4, _caller$5);
                        var $3136 = (_expr$10 && _body$12);
                        var $3112 = $3136;
                        break;
                    case 'Kindelia.Term.create':
                        var $3137 = self.ctor;
                        var $3138 = self.vals;
                        var self = _type$4;
                        switch (self._) {
                            case 'Kindelia.Type.data':
                                var $3140 = self.name;
                                var self = Kindelia$get_data$(_world$2, $3140);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $3142 = self.value;
                                        var _data$10 = $3142;
                                        var self = _data$10;
                                        switch (self._) {
                                            case 'Kindelia.Data.new':
                                                var $3144 = self.constructors;
                                                var self = List$get$($3137, $3144);
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $3146 = self.value;
                                                        var _ctor$14 = $3146;
                                                        var self = _ctor$14;
                                                        switch (self._) {
                                                            case 'Kindelia.Constructor.new':
                                                                var $3148 = self.args;
                                                                var _size$17 = ((list_length($3138)) === (list_length($3148)));
                                                                var _ftyp$18 = List$mapped$($3148, Pair$snd);
                                                                var _vals$19 = List$zip$($3138, _ftyp$18);
                                                                var _vals$20 = List$all$((_x$20 => {
                                                                    var $3150 = Kindelia$check$(_context$1, _world$2, (() => {
                                                                        var self = _x$20;
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $3151 = self.fst;
                                                                                var $3152 = $3151;
                                                                                return $3152;
                                                                        };
                                                                    })(), (() => {
                                                                        var self = _x$20;
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $3153 = self.snd;
                                                                                var $3154 = $3153;
                                                                                return $3154;
                                                                        };
                                                                    })(), _caller$5);
                                                                    return $3150;
                                                                }), _vals$19);
                                                                var $3149 = (_size$17 && _vals$20);
                                                                var $3147 = $3149;
                                                                break;
                                                        };
                                                        var $3145 = $3147;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $3155 = Bool$false;
                                                        var $3145 = $3155;
                                                        break;
                                                };
                                                var $3143 = $3145;
                                                break;
                                        };
                                        var $3141 = $3143;
                                        break;
                                    case 'Maybe.none':
                                        var $3156 = Bool$false;
                                        var $3141 = $3156;
                                        break;
                                };
                                var $3139 = $3141;
                                break;
                            case 'Kindelia.Type.word':
                                var $3157 = Bool$false;
                                var $3139 = $3157;
                                break;
                        };
                        var $3112 = $3139;
                        break;
                    case 'Kindelia.Term.match':
                        var $3158 = self.name;
                        var $3159 = self.data;
                        var $3160 = self.cses;
                        var self = Kindelia$get_data$(_world$2, $3159);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3162 = self.value;
                                var _data$10 = $3162;
                                var self = _data$10;
                                switch (self._) {
                                    case 'Kindelia.Data.new':
                                        var $3164 = self.constructors;
                                        var _size$13 = ((list_length($3160)) === (list_length($3164)));
                                        var _expr$14 = Kindelia$check$(_context$1, _world$2, Kindelia$Term$var$($3158), Kindelia$Type$data$($3159), _caller$5);
                                        var _cses$15 = List$zipped_with$($3160, $3164, (_case_body$15 => _case_ctor$16 => {
                                            var _nams$17 = List$map$((_args$17 => {
                                                var $3167 = ($3158 + ("." + (() => {
                                                    var self = _args$17;
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $3168 = self.fst;
                                                            var $3169 = $3168;
                                                            return $3169;
                                                    };
                                                })()));
                                                return $3167;
                                            }), (() => {
                                                var self = _case_ctor$16;
                                                switch (self._) {
                                                    case 'Kindelia.Constructor.new':
                                                        var $3170 = self.args;
                                                        var $3171 = $3170;
                                                        return $3171;
                                                };
                                            })());
                                            var _typs$18 = List$mapped$((() => {
                                                var self = _case_ctor$16;
                                                switch (self._) {
                                                    case 'Kindelia.Constructor.new':
                                                        var $3172 = self.args;
                                                        var $3173 = $3172;
                                                        return $3173;
                                                };
                                            })(), Pair$snd);
                                            var _ctx2$19 = Kindelia$extend$(_context$1, List$zip$(_nams$17, _typs$18));
                                            var $3166 = Kindelia$check$(_ctx2$19, _world$2, _case_body$15, _type$4, _caller$5);
                                            return $3166;
                                        }));
                                        var $3165 = (_size$13 && List$and$(_cses$15));
                                        var $3163 = $3165;
                                        break;
                                };
                                var $3161 = $3163;
                                break;
                            case 'Maybe.none':
                                var $3174 = Bool$false;
                                var $3161 = $3174;
                                break;
                        };
                        var $3112 = $3161;
                        break;
                    case 'Kindelia.Term.compare':
                        var $3175 = self.val0;
                        var $3176 = self.val1;
                        var $3177 = self.iflt;
                        var $3178 = self.ifeq;
                        var $3179 = self.ifgt;
                        var _val0$11 = Kindelia$check$(_context$1, _world$2, $3175, Kindelia$Type$word, _caller$5);
                        var _val1$12 = Kindelia$check$(_context$1, _world$2, $3176, Kindelia$Type$word, _caller$5);
                        var _iflt$13 = Kindelia$check$(_context$1, _world$2, $3177, _type$4, _caller$5);
                        var _ifeq$14 = Kindelia$check$(_context$1, _world$2, $3178, _type$4, _caller$5);
                        var _ifgt$15 = Kindelia$check$(_context$1, _world$2, $3179, _type$4, _caller$5);
                        var $3180 = (_val0$11 && (_val1$12 && (_iflt$13 && (_ifeq$14 && _ifgt$15))));
                        var $3112 = $3180;
                        break;
                    case 'Kindelia.Term.operate':
                        var $3181 = self.val0;
                        var $3182 = self.val1;
                        var _val0$9 = Kindelia$check$(_context$1, _world$2, $3181, Kindelia$Type$word, _caller$5);
                        var _val1$10 = Kindelia$check$(_context$1, _world$2, $3182, Kindelia$Type$word, _caller$5);
                        var $3183 = (_val0$9 && _val1$10);
                        var $3112 = $3183;
                        break;
                    case 'Kindelia.Term.bind':
                        var $3184 = self.bond;
                        var $3185 = self.expr;
                        var $3186 = self.cont;
                        var self = Kindelia$get_bond$(_world$2, $3184);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3188 = self.value;
                                var _bond$10 = $3188;
                                var self = _bond$10;
                                switch (self._) {
                                    case 'Kindelia.Bond.new':
                                        var $3190 = self.args;
                                        var $3191 = self.otyp;
                                        var _notf$16 = List$is_empty$($3190);
                                        var _expr$17 = Kindelia$check$(_context$1, _world$2, $3185, $3191, _caller$5);
                                        var _cont$18 = Kindelia$check$(_context$1, _world$2, $3186, _type$4, _caller$5);
                                        var $3192 = (_notf$16 && (_expr$17 && _cont$18));
                                        var $3189 = $3192;
                                        break;
                                };
                                var $3187 = $3189;
                                break;
                            case 'Maybe.none':
                                var $3193 = Bool$false;
                                var $3187 = $3193;
                                break;
                        };
                        var $3112 = $3187;
                        break;
                    case 'Kindelia.Term.word':
                        var self = _type$4;
                        switch (self._) {
                            case 'Kindelia.Type.word':
                                var $3195 = Bool$true;
                                var $3194 = $3195;
                                break;
                            case 'Kindelia.Type.data':
                                var $3196 = Bool$false;
                                var $3194 = $3196;
                                break;
                        };
                        var $3112 = $3194;
                        break;
                };
                var $3111 = $3112;
                break;
            case 'BBT.bin':
                var self = _term$3;
                switch (self._) {
                    case 'Kindelia.Term.var':
                        var $3198 = self.name;
                        var self = Map$get$($3198, _context$1);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3200 = self.value;
                                var $3201 = Kindelia$equal$($3200, _type$4);
                                var $3199 = $3201;
                                break;
                            case 'Maybe.none':
                                var $3202 = Bool$false;
                                var $3199 = $3202;
                                break;
                        };
                        var $3197 = $3199;
                        break;
                    case 'Kindelia.Term.call':
                        var $3203 = self.bond;
                        var $3204 = self.args;
                        var self = Kindelia$get_bond$(_world$2, $3203);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3206 = self.value;
                                var _bond$14 = $3206;
                                var self = _bond$14;
                                switch (self._) {
                                    case 'Kindelia.Bond.new':
                                        var $3208 = self.args;
                                        var $3209 = self.otyp;
                                        var _otyp$20 = Kindelia$equal$($3209, _type$4);
                                        var _ityp$21 = List$mapped$($3208, Pair$snd);
                                        var _args$22 = List$zip$($3204, _ityp$21);
                                        var _args$23 = List$all$((_x$23 => {
                                            var $3211 = Kindelia$check$(_context$1, _world$2, (() => {
                                                var self = _x$23;
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3212 = self.fst;
                                                        var $3213 = $3212;
                                                        return $3213;
                                                };
                                            })(), (() => {
                                                var self = _x$23;
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3214 = self.snd;
                                                        var $3215 = $3214;
                                                        return $3215;
                                                };
                                            })(), _caller$5);
                                            return $3211;
                                        }), _args$22);
                                        var $3210 = (_otyp$20 && _args$23);
                                        var $3207 = $3210;
                                        break;
                                };
                                var $3205 = $3207;
                                break;
                            case 'Maybe.none':
                                var $3216 = Bool$false;
                                var $3205 = $3216;
                                break;
                        };
                        var $3197 = $3205;
                        break;
                    case 'Kindelia.Term.let':
                        var $3217 = self.name;
                        var $3218 = self.type;
                        var $3219 = self.expr;
                        var $3220 = self.body;
                        var _expr$15 = Kindelia$check$(_context$1, _world$2, $3219, $3218, _caller$5);
                        var _ctx2$16 = Map$set$($3217, $3218, _context$1);
                        var _body$17 = Kindelia$check$(_ctx2$16, _world$2, $3220, _type$4, _caller$5);
                        var $3221 = (_expr$15 && _body$17);
                        var $3197 = $3221;
                        break;
                    case 'Kindelia.Term.create':
                        var $3222 = self.ctor;
                        var $3223 = self.vals;
                        var self = _type$4;
                        switch (self._) {
                            case 'Kindelia.Type.data':
                                var $3225 = self.name;
                                var self = Kindelia$get_data$(_world$2, $3225);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $3227 = self.value;
                                        var _data$15 = $3227;
                                        var self = _data$15;
                                        switch (self._) {
                                            case 'Kindelia.Data.new':
                                                var $3229 = self.constructors;
                                                var self = List$get$($3222, $3229);
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $3231 = self.value;
                                                        var _ctor$19 = $3231;
                                                        var self = _ctor$19;
                                                        switch (self._) {
                                                            case 'Kindelia.Constructor.new':
                                                                var $3233 = self.args;
                                                                var _size$22 = ((list_length($3223)) === (list_length($3233)));
                                                                var _ftyp$23 = List$mapped$($3233, Pair$snd);
                                                                var _vals$24 = List$zip$($3223, _ftyp$23);
                                                                var _vals$25 = List$all$((_x$25 => {
                                                                    var $3235 = Kindelia$check$(_context$1, _world$2, (() => {
                                                                        var self = _x$25;
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $3236 = self.fst;
                                                                                var $3237 = $3236;
                                                                                return $3237;
                                                                        };
                                                                    })(), (() => {
                                                                        var self = _x$25;
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $3238 = self.snd;
                                                                                var $3239 = $3238;
                                                                                return $3239;
                                                                        };
                                                                    })(), _caller$5);
                                                                    return $3235;
                                                                }), _vals$24);
                                                                var $3234 = (_size$22 && _vals$25);
                                                                var $3232 = $3234;
                                                                break;
                                                        };
                                                        var $3230 = $3232;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $3240 = Bool$false;
                                                        var $3230 = $3240;
                                                        break;
                                                };
                                                var $3228 = $3230;
                                                break;
                                        };
                                        var $3226 = $3228;
                                        break;
                                    case 'Maybe.none':
                                        var $3241 = Bool$false;
                                        var $3226 = $3241;
                                        break;
                                };
                                var $3224 = $3226;
                                break;
                            case 'Kindelia.Type.word':
                                var $3242 = Bool$false;
                                var $3224 = $3242;
                                break;
                        };
                        var $3197 = $3224;
                        break;
                    case 'Kindelia.Term.match':
                        var $3243 = self.name;
                        var $3244 = self.data;
                        var $3245 = self.cses;
                        var self = Kindelia$get_data$(_world$2, $3244);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3247 = self.value;
                                var _data$15 = $3247;
                                var self = _data$15;
                                switch (self._) {
                                    case 'Kindelia.Data.new':
                                        var $3249 = self.constructors;
                                        var _size$18 = ((list_length($3245)) === (list_length($3249)));
                                        var _expr$19 = Kindelia$check$(_context$1, _world$2, Kindelia$Term$var$($3243), Kindelia$Type$data$($3244), _caller$5);
                                        var _cses$20 = List$zipped_with$($3245, $3249, (_case_body$20 => _case_ctor$21 => {
                                            var _nams$22 = List$map$((_args$22 => {
                                                var $3252 = ($3243 + ("." + (() => {
                                                    var self = _args$22;
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $3253 = self.fst;
                                                            var $3254 = $3253;
                                                            return $3254;
                                                    };
                                                })()));
                                                return $3252;
                                            }), (() => {
                                                var self = _case_ctor$21;
                                                switch (self._) {
                                                    case 'Kindelia.Constructor.new':
                                                        var $3255 = self.args;
                                                        var $3256 = $3255;
                                                        return $3256;
                                                };
                                            })());
                                            var _typs$23 = List$mapped$((() => {
                                                var self = _case_ctor$21;
                                                switch (self._) {
                                                    case 'Kindelia.Constructor.new':
                                                        var $3257 = self.args;
                                                        var $3258 = $3257;
                                                        return $3258;
                                                };
                                            })(), Pair$snd);
                                            var _ctx2$24 = Kindelia$extend$(_context$1, List$zip$(_nams$22, _typs$23));
                                            var $3251 = Kindelia$check$(_ctx2$24, _world$2, _case_body$20, _type$4, _caller$5);
                                            return $3251;
                                        }));
                                        var $3250 = (_size$18 && List$and$(_cses$20));
                                        var $3248 = $3250;
                                        break;
                                };
                                var $3246 = $3248;
                                break;
                            case 'Maybe.none':
                                var $3259 = Bool$false;
                                var $3246 = $3259;
                                break;
                        };
                        var $3197 = $3246;
                        break;
                    case 'Kindelia.Term.compare':
                        var $3260 = self.val0;
                        var $3261 = self.val1;
                        var $3262 = self.iflt;
                        var $3263 = self.ifeq;
                        var $3264 = self.ifgt;
                        var _val0$16 = Kindelia$check$(_context$1, _world$2, $3260, Kindelia$Type$word, _caller$5);
                        var _val1$17 = Kindelia$check$(_context$1, _world$2, $3261, Kindelia$Type$word, _caller$5);
                        var _iflt$18 = Kindelia$check$(_context$1, _world$2, $3262, _type$4, _caller$5);
                        var _ifeq$19 = Kindelia$check$(_context$1, _world$2, $3263, _type$4, _caller$5);
                        var _ifgt$20 = Kindelia$check$(_context$1, _world$2, $3264, _type$4, _caller$5);
                        var $3265 = (_val0$16 && (_val1$17 && (_iflt$18 && (_ifeq$19 && _ifgt$20))));
                        var $3197 = $3265;
                        break;
                    case 'Kindelia.Term.operate':
                        var $3266 = self.val0;
                        var $3267 = self.val1;
                        var _val0$14 = Kindelia$check$(_context$1, _world$2, $3266, Kindelia$Type$word, _caller$5);
                        var _val1$15 = Kindelia$check$(_context$1, _world$2, $3267, Kindelia$Type$word, _caller$5);
                        var $3268 = (_val0$14 && _val1$15);
                        var $3197 = $3268;
                        break;
                    case 'Kindelia.Term.bind':
                        var $3269 = self.bond;
                        var $3270 = self.expr;
                        var $3271 = self.cont;
                        var self = Kindelia$get_bond$(_world$2, $3269);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3273 = self.value;
                                var _bond$15 = $3273;
                                var self = _bond$15;
                                switch (self._) {
                                    case 'Kindelia.Bond.new':
                                        var $3275 = self.args;
                                        var $3276 = self.otyp;
                                        var _notf$21 = List$is_empty$($3275);
                                        var _expr$22 = Kindelia$check$(_context$1, _world$2, $3270, $3276, _caller$5);
                                        var _cont$23 = Kindelia$check$(_context$1, _world$2, $3271, _type$4, _caller$5);
                                        var $3277 = (_notf$21 && (_expr$22 && _cont$23));
                                        var $3274 = $3277;
                                        break;
                                };
                                var $3272 = $3274;
                                break;
                            case 'Maybe.none':
                                var $3278 = Bool$false;
                                var $3272 = $3278;
                                break;
                        };
                        var $3197 = $3272;
                        break;
                    case 'Kindelia.Term.word':
                        var self = _type$4;
                        switch (self._) {
                            case 'Kindelia.Type.word':
                                var $3280 = Bool$true;
                                var $3279 = $3280;
                                break;
                            case 'Kindelia.Type.data':
                                var $3281 = Bool$false;
                                var $3279 = $3281;
                                break;
                        };
                        var $3197 = $3279;
                        break;
                };
                var $3111 = $3197;
                break;
        };
        return $3111;
    };
    const Kindelia$check = x0 => x1 => x2 => x3 => x4 => Kindelia$check$(x0, x1, x2, x3, x4);

    function Kindelia$sanitize$many$(_world$1, _table$2, _fresh$3, _terms$4) {
        var self = _terms$4;
        switch (self._) {
            case 'List.cons':
                var $3283 = self.head;
                var $3284 = self.tail;
                var self = Kindelia$sanitize$(_world$1, _table$2, _fresh$3, $3283);
                switch (self._) {
                    case 'Pair.new':
                        var $3286 = self.fst;
                        var $3287 = self.snd;
                        var self = Kindelia$sanitize$many$(_world$1, _table$2, $3286, $3284);
                        switch (self._) {
                            case 'Pair.new':
                                var $3289 = self.fst;
                                var $3290 = self.snd;
                                var $3291 = Pair$new$($3289, List$cons$($3287, $3290));
                                var $3288 = $3291;
                                break;
                        };
                        var $3285 = $3288;
                        break;
                };
                var $3282 = $3285;
                break;
            case 'List.nil':
                var $3292 = Pair$new$(_fresh$3, List$nil);
                var $3282 = $3292;
                break;
        };
        return $3282;
    };
    const Kindelia$sanitize$many = x0 => x1 => x2 => x3 => Kindelia$sanitize$many$(x0, x1, x2, x3);

    function Triple$new$(_fst$4, _snd$5, _trd$6) {
        var $3293 = ({
            _: 'Triple.new',
            'fst': _fst$4,
            'snd': _snd$5,
            'trd': _trd$6
        });
        return $3293;
    };
    const Triple$new = x0 => x1 => x2 => Triple$new$(x0, x1, x2);

    function Kindelia$rename$(_table$1, _fresh$2, _old_name$3) {
        var _new_name$4 = ("$" + Nat$show$(_fresh$2));
        var _table$5 = Map$set$(_old_name$3, _new_name$4, _table$1);
        var _fresh$6 = Nat$succ$(_fresh$2);
        var $3294 = Triple$new$(_table$5, _fresh$6, _new_name$4);
        return $3294;
    };
    const Kindelia$rename = x0 => x1 => x2 => Kindelia$rename$(x0, x1, x2);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Kindelia$sanitize$cases$(_world$1, _table$2, _fresh$3, _old_name$4, _new_name$5, _ctrs$6, _cses$7) {
        var self = _ctrs$6;
        switch (self._) {
            case 'List.cons':
                var $3296 = self.head;
                var $3297 = self.tail;
                var self = _cses$7;
                switch (self._) {
                    case 'List.cons':
                        var $3299 = self.head;
                        var $3300 = self.tail;
                        var _new_table$12 = _table$2;
                        var _new_table$13 = (() => {
                            var $3303 = _new_table$12;
                            var self = $3296;
                            switch (self._) {
                                case 'Kindelia.Constructor.new':
                                    var $3305 = self.args;
                                    var $3306 = $3305;
                                    var $3304 = $3306;
                                    break;
                            };
                            let _new_table$14 = $3303;
                            let _field$13;
                            while ($3304._ === 'List.cons') {
                                _field$13 = $3304.head;
                                var $3303 = Map$set$((_old_name$4 + ("." + (() => {
                                    var self = _field$13;
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $3307 = self.fst;
                                            var $3308 = $3307;
                                            return $3308;
                                    };
                                })())), (_new_name$5 + ("." + (() => {
                                    var self = _field$13;
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $3309 = self.fst;
                                            var $3310 = $3309;
                                            return $3310;
                                    };
                                })())), _new_table$14);
                                _new_table$14 = $3303;
                                $3304 = $3304.tail;
                            }
                            return _new_table$14;
                        })();
                        var self = Kindelia$sanitize$(_world$1, _new_table$13, _fresh$3, $3299);
                        switch (self._) {
                            case 'Pair.new':
                                var $3311 = self.fst;
                                var $3312 = self.snd;
                                var self = Kindelia$sanitize$cases$(_world$1, _table$2, $3311, _old_name$4, _new_name$5, $3297, $3300);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $3314 = self.fst;
                                        var $3315 = self.snd;
                                        var $3316 = Pair$new$($3314, List$cons$($3312, $3315));
                                        var $3313 = $3316;
                                        break;
                                };
                                var $3301 = $3313;
                                break;
                        };
                        var $3298 = $3301;
                        break;
                    case 'List.nil':
                        var $3317 = Pair$new$(_fresh$3, List$nil);
                        var $3298 = $3317;
                        break;
                };
                var $3295 = $3298;
                break;
            case 'List.nil':
                var self = _cses$7;
                switch (self._) {
                    case 'List.nil':
                    case 'List.cons':
                        var $3319 = Pair$new$(_fresh$3, List$nil);
                        var $3318 = $3319;
                        break;
                };
                var $3295 = $3318;
                break;
        };
        return $3295;
    };
    const Kindelia$sanitize$cases = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Kindelia$sanitize$cases$(x0, x1, x2, x3, x4, x5, x6);

    function Kindelia$sanitize$(_world$1, _table$2, _fresh$3, _term$4) {
        var self = _term$4;
        switch (self._) {
            case 'Kindelia.Term.var':
                var $3321 = self.name;
                var _term$6 = Kindelia$Term$var$(Maybe$default$(Map$get$($3321, _table$2), $3321));
                var $3322 = Pair$new$(_fresh$3, _term$6);
                var $3320 = $3322;
                break;
            case 'Kindelia.Term.call':
                var $3323 = self.bond;
                var $3324 = self.args;
                var self = Kindelia$sanitize$many$(_world$1, _table$2, _fresh$3, $3324);
                switch (self._) {
                    case 'Pair.new':
                        var $3326 = self.fst;
                        var $3327 = self.snd;
                        var $3328 = Pair$new$($3326, Kindelia$Term$call$($3323, $3327));
                        var $3325 = $3328;
                        break;
                };
                var $3320 = $3325;
                break;
            case 'Kindelia.Term.let':
                var $3329 = self.name;
                var $3330 = self.type;
                var $3331 = self.expr;
                var $3332 = self.body;
                var self = Kindelia$sanitize$(_world$1, _table$2, _fresh$3, $3331);
                switch (self._) {
                    case 'Pair.new':
                        var $3334 = self.fst;
                        var $3335 = self.snd;
                        var self = Kindelia$rename$(_table$2, $3334, $3329);
                        switch (self._) {
                            case 'Triple.new':
                                var $3337 = self.fst;
                                var $3338 = self.snd;
                                var $3339 = self.trd;
                                var self = Kindelia$sanitize$(_world$1, $3337, $3338, $3332);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $3341 = self.fst;
                                        var $3342 = self.snd;
                                        var $3343 = Pair$new$($3341, Kindelia$Term$let$($3339, $3330, $3335, $3342));
                                        var $3340 = $3343;
                                        break;
                                };
                                var $3336 = $3340;
                                break;
                        };
                        var $3333 = $3336;
                        break;
                };
                var $3320 = $3333;
                break;
            case 'Kindelia.Term.create':
                var $3344 = self.ctor;
                var $3345 = self.vals;
                var self = Kindelia$sanitize$many$(_world$1, _table$2, _fresh$3, $3345);
                switch (self._) {
                    case 'Pair.new':
                        var $3347 = self.fst;
                        var $3348 = self.snd;
                        var $3349 = Pair$new$($3347, Kindelia$Term$create$($3344, $3348));
                        var $3346 = $3349;
                        break;
                };
                var $3320 = $3346;
                break;
            case 'Kindelia.Term.match':
                var $3350 = self.name;
                var $3351 = self.data;
                var $3352 = self.cses;
                var _ctrs$8 = Maybe$default$(Kindelia$get_constructors$(_world$1, $3351), List$nil);
                var _old_name$9 = $3350;
                var _new_name$10 = Maybe$default$(Map$get$($3350, _table$2), $3350);
                var self = Kindelia$sanitize$cases$(_world$1, _table$2, _fresh$3, _old_name$9, _new_name$10, _ctrs$8, $3352);
                switch (self._) {
                    case 'Pair.new':
                        var $3354 = self.fst;
                        var $3355 = self.snd;
                        var $3356 = Pair$new$($3354, Kindelia$Term$match$(_new_name$10, $3351, $3355));
                        var $3353 = $3356;
                        break;
                };
                var $3320 = $3353;
                break;
            case 'Kindelia.Term.word':
                var $3357 = self.numb;
                var $3358 = Pair$new$(_fresh$3, Kindelia$Term$word$($3357));
                var $3320 = $3358;
                break;
            case 'Kindelia.Term.compare':
                var $3359 = self.val0;
                var $3360 = self.val1;
                var $3361 = self.iflt;
                var $3362 = self.ifeq;
                var $3363 = self.ifgt;
                var self = Kindelia$sanitize$(_world$1, _table$2, _fresh$3, $3359);
                switch (self._) {
                    case 'Pair.new':
                        var $3365 = self.fst;
                        var $3366 = self.snd;
                        var self = Kindelia$sanitize$(_world$1, _table$2, $3365, $3360);
                        switch (self._) {
                            case 'Pair.new':
                                var $3368 = self.fst;
                                var $3369 = self.snd;
                                var self = Kindelia$sanitize$(_world$1, _table$2, $3368, $3361);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $3371 = self.fst;
                                        var $3372 = self.snd;
                                        var self = Kindelia$sanitize$(_world$1, _table$2, $3371, $3362);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $3374 = self.fst;
                                                var $3375 = self.snd;
                                                var self = Kindelia$sanitize$(_world$1, _table$2, $3374, $3363);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3377 = self.fst;
                                                        var $3378 = self.snd;
                                                        var $3379 = Pair$new$($3377, Kindelia$Term$compare$($3366, $3369, $3372, $3375, $3378));
                                                        var $3376 = $3379;
                                                        break;
                                                };
                                                var $3373 = $3376;
                                                break;
                                        };
                                        var $3370 = $3373;
                                        break;
                                };
                                var $3367 = $3370;
                                break;
                        };
                        var $3364 = $3367;
                        break;
                };
                var $3320 = $3364;
                break;
            case 'Kindelia.Term.operate':
                var $3380 = self.oper;
                var $3381 = self.val0;
                var $3382 = self.val1;
                var self = Kindelia$sanitize$(_world$1, _table$2, _fresh$3, $3381);
                switch (self._) {
                    case 'Pair.new':
                        var $3384 = self.fst;
                        var $3385 = self.snd;
                        var self = Kindelia$sanitize$(_world$1, _table$2, $3384, $3382);
                        switch (self._) {
                            case 'Pair.new':
                                var $3387 = self.fst;
                                var $3388 = self.snd;
                                var $3389 = Pair$new$($3387, Kindelia$Term$operate$($3380, $3385, $3388));
                                var $3386 = $3389;
                                break;
                        };
                        var $3383 = $3386;
                        break;
                };
                var $3320 = $3383;
                break;
            case 'Kindelia.Term.bind':
                var $3390 = self.bond;
                var $3391 = self.expr;
                var $3392 = self.cont;
                var self = Kindelia$get_bond$(_world$1, $3390);
                switch (self._) {
                    case 'Maybe.some':
                        var $3394 = self.value;
                        var _bond$9 = $3394;
                        var self = _bond$9;
                        switch (self._) {
                            case 'Kindelia.Bond.new':
                                var self = Kindelia$sanitize$(_world$1, _table$2, _fresh$3, $3391);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $3397 = self.fst;
                                        var $3398 = self.snd;
                                        var self = Kindelia$sanitize$(_world$1, _table$2, $3397, $3392);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $3400 = self.fst;
                                                var $3401 = self.snd;
                                                var $3402 = Pair$new$($3400, Kindelia$Term$bind$($3390, $3398, $3401));
                                                var $3399 = $3402;
                                                break;
                                        };
                                        var $3396 = $3399;
                                        break;
                                };
                                var $3395 = $3396;
                                break;
                        };
                        var $3393 = $3395;
                        break;
                    case 'Maybe.none':
                        var $3403 = Pair$new$(_fresh$3, _term$4);
                        var $3393 = $3403;
                        break;
                };
                var $3320 = $3393;
                break;
        };
        return $3320;
    };
    const Kindelia$sanitize = x0 => x1 => x2 => x3 => Kindelia$sanitize$(x0, x1, x2, x3);

    function Kindelia$Runtime$(_A$1) {
        var $3404 = null;
        return $3404;
    };
    const Kindelia$Runtime = x0 => Kindelia$Runtime$(x0);

    function Kindelia$Runtime$new$(_world$2, _subst$3, _fresh$4, _gas$5, _term$6) {
        var $3405 = ({
            _: 'Kindelia.Runtime.new',
            'world': _world$2,
            'subst': _subst$3,
            'fresh': _fresh$4,
            'gas': _gas$5,
            'term': _term$6
        });
        return $3405;
    };
    const Kindelia$Runtime$new = x0 => x1 => x2 => x3 => x4 => Kindelia$Runtime$new$(x0, x1, x2, x3, x4);

    function List$imapped$(_as$2, _f$4) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $3407 = self.head;
                var $3408 = self.tail;
                var $3409 = List$cons$(_f$4(0n)($3407), List$imapped$($3408, (_n$7 => {
                    var $3410 = _f$4(Nat$succ$(_n$7));
                    return $3410;
                })));
                var $3406 = $3409;
                break;
            case 'List.nil':
                var $3411 = List$nil;
                var $3406 = $3411;
                break;
        };
        return $3406;
    };
    const List$imapped = x0 => x1 => List$imapped$(x0, x1);
    const Kindelia$cost$subs = 1n;
    const Kindelia$cost$alloc = 1n;

    function Kindelia$cost$copy$(_ctor_arity$1) {
        var $3412 = (1n + ((Kindelia$cost$subs + Kindelia$cost$alloc) * _ctor_arity$1));
        return $3412;
    };
    const Kindelia$cost$copy = x0 => Kindelia$cost$copy$(x0);

    function Triple$(_A$1, _B$2, _C$3) {
        var $3413 = null;
        return $3413;
    };
    const Triple = x0 => x1 => x2 => Triple$(x0, x1, x2);

    function Kindelia$rename$many$(_table$1, _fresh$2, _names$3) {
        var self = _names$3;
        switch (self._) {
            case 'List.cons':
                var $3415 = self.head;
                var $3416 = self.tail;
                var self = Kindelia$rename$(_table$1, _fresh$2, $3415);
                switch (self._) {
                    case 'Triple.new':
                        var $3418 = self.fst;
                        var $3419 = self.snd;
                        var $3420 = self.trd;
                        var self = Kindelia$rename$many$($3418, $3419, $3416);
                        switch (self._) {
                            case 'Triple.new':
                                var $3422 = self.fst;
                                var $3423 = self.snd;
                                var $3424 = self.trd;
                                var $3425 = Triple$new$($3422, $3423, List$cons$($3420, $3424));
                                var $3421 = $3425;
                                break;
                        };
                        var $3417 = $3421;
                        break;
                };
                var $3414 = $3417;
                break;
            case 'List.nil':
                var $3426 = Triple$new$(_table$1, _fresh$2, List$nil);
                var $3414 = $3426;
                break;
        };
        return $3414;
    };
    const Kindelia$rename$many = x0 => x1 => x2 => Kindelia$rename$many$(x0, x1, x2);

    function Kindelia$cost$create$(_ctor_arity$1) {
        var $3427 = (1n + (Kindelia$cost$alloc * _ctor_arity$1));
        return $3427;
    };
    const Kindelia$cost$create = x0 => Kindelia$cost$create$(x0);
    const Kindelia$cost$let = Kindelia$cost$subs;

    function Kindelia$cost$match$(_ctor_arity$1) {
        var $3428 = (1n + (Kindelia$cost$subs * _ctor_arity$1));
        return $3428;
    };
    const Kindelia$cost$match = x0 => Kindelia$cost$match$(x0);
    const U64$ltn = a0 => a1 => (a0 < a1);
    const U64$eql = a0 => a1 => (a0 === a1);

    function U64$cmp$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $3430 = Cmp$ltn;
            var $3429 = $3430;
        } else {
            var self = (_a$1 === _b$2);
            if (self) {
                var $3432 = Cmp$eql;
                var $3431 = $3432;
            } else {
                var $3433 = Cmp$gtn;
                var $3431 = $3433;
            };
            var $3429 = $3431;
        };
        return $3429;
    };
    const U64$cmp = x0 => x1 => U64$cmp$(x0, x1);
    const Kindelia$cost$compare = 1n;
    const U64$add = a0 => a1 => ((a0 + a1) & 0xFFFFFFFFFFFFFFFFn);
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
                        var $3434 = self.pred;
                        var $3435 = Word$bit_length$go$($3434, Nat$succ$(_c$3), _n$4);
                        return $3435;
                    case 'Word.i':
                        var $3436 = self.pred;
                        var $3437 = Word$bit_length$go$($3436, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $3437;
                    case 'Word.e':
                        var $3438 = _n$4;
                        return $3438;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $3439 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $3439;
    };
    const Word$bit_length = x0 => Word$bit_length$(x0);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $3441 = Bool$false;
                var $3440 = $3441;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $3442 = Bool$true;
                var $3440 = $3442;
                break;
        };
        return $3440;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $3443 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $3443;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $3445 = self.pred;
                var $3446 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $3448 = self.pred;
                            var $3449 = (_a$pred$9 => {
                                var $3450 = Word$o$(Word$or$(_a$pred$9, $3448));
                                return $3450;
                            });
                            var $3447 = $3449;
                            break;
                        case 'Word.i':
                            var $3451 = self.pred;
                            var $3452 = (_a$pred$9 => {
                                var $3453 = Word$i$(Word$or$(_a$pred$9, $3451));
                                return $3453;
                            });
                            var $3447 = $3452;
                            break;
                        case 'Word.e':
                            var $3454 = (_a$pred$7 => {
                                var $3455 = Word$e;
                                return $3455;
                            });
                            var $3447 = $3454;
                            break;
                    };
                    var $3447 = $3447($3445);
                    return $3447;
                });
                var $3444 = $3446;
                break;
            case 'Word.i':
                var $3456 = self.pred;
                var $3457 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $3459 = self.pred;
                            var $3460 = (_a$pred$9 => {
                                var $3461 = Word$i$(Word$or$(_a$pred$9, $3459));
                                return $3461;
                            });
                            var $3458 = $3460;
                            break;
                        case 'Word.i':
                            var $3462 = self.pred;
                            var $3463 = (_a$pred$9 => {
                                var $3464 = Word$i$(Word$or$(_a$pred$9, $3462));
                                return $3464;
                            });
                            var $3458 = $3463;
                            break;
                        case 'Word.e':
                            var $3465 = (_a$pred$7 => {
                                var $3466 = Word$e;
                                return $3466;
                            });
                            var $3458 = $3465;
                            break;
                    };
                    var $3458 = $3458($3456);
                    return $3458;
                });
                var $3444 = $3457;
                break;
            case 'Word.e':
                var $3467 = (_b$4 => {
                    var $3468 = Word$e;
                    return $3468;
                });
                var $3444 = $3467;
                break;
        };
        var $3444 = $3444(_b$3);
        return $3444;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right$one$go$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $3470 = self.pred;
                var $3471 = Word$o$(Word$shift_right$one$go$($3470));
                var $3469 = $3471;
                break;
            case 'Word.i':
                var $3472 = self.pred;
                var $3473 = Word$i$(Word$shift_right$one$go$($3472));
                var $3469 = $3473;
                break;
            case 'Word.e':
                var $3474 = Word$o$(Word$e);
                var $3469 = $3474;
                break;
        };
        return $3469;
    };
    const Word$shift_right$one$go = x0 => Word$shift_right$one$go$(x0);

    function Word$shift_right$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $3476 = self.pred;
                var $3477 = Word$shift_right$one$go$($3476);
                var $3475 = $3477;
                break;
            case 'Word.i':
                var $3478 = self.pred;
                var $3479 = Word$shift_right$one$go$($3478);
                var $3475 = $3479;
                break;
            case 'Word.e':
                var $3480 = Word$e;
                var $3475 = $3480;
                break;
        };
        return $3475;
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
                    var $3481 = _value$2;
                    return $3481;
                } else {
                    var $3482 = (self - 1n);
                    var $3483 = Word$shift_right$(Word$shift_right$one$(_value$2), $3482);
                    return $3483;
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
                    var $3484 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $3484;
                } else {
                    var $3485 = Pair$new$(Bool$false, _value$5);
                    var self = $3485;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $3486 = self.fst;
                        var $3487 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $3489 = $3487;
                            var $3488 = $3489;
                        } else {
                            var $3490 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right$(_shift_copy$4, 1n);
                            var self = $3486;
                            if (self) {
                                var $3492 = Word$div$go$($3490, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $3487);
                                var $3491 = $3492;
                            } else {
                                var $3493 = Word$div$go$($3490, _sub_copy$3, _new_shift_copy$9, $3487);
                                var $3491 = $3493;
                            };
                            var $3488 = $3491;
                        };
                        return $3488;
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
            var $3495 = Word$to_zero$(_a$2);
            var $3494 = $3495;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_b$3, _shift$6);
            var $3496 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $3494 = $3496;
        };
        return $3494;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U64$div = a0 => a1 => ((a0 / a1) & 0xFFFFFFFFFFFFFFFFn);

    function Word$mod$(_a$2, _b$3) {
        var _q$4 = Word$div$(_a$2, _b$3);
        var $3497 = Word$sub$(_a$2, Word$mul$(_b$3, _q$4));
        return $3497;
    };
    const Word$mod = x0 => x1 => Word$mod$(x0, x1);
    const U64$mod = a0 => a1 => (a0 % a1);
    const U64$or = a0 => a1 => (a0 | a1);

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $3499 = self.pred;
                var $3500 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $3502 = self.pred;
                            var $3503 = (_a$pred$9 => {
                                var $3504 = Word$o$(Word$and$(_a$pred$9, $3502));
                                return $3504;
                            });
                            var $3501 = $3503;
                            break;
                        case 'Word.i':
                            var $3505 = self.pred;
                            var $3506 = (_a$pred$9 => {
                                var $3507 = Word$o$(Word$and$(_a$pred$9, $3505));
                                return $3507;
                            });
                            var $3501 = $3506;
                            break;
                        case 'Word.e':
                            var $3508 = (_a$pred$7 => {
                                var $3509 = Word$e;
                                return $3509;
                            });
                            var $3501 = $3508;
                            break;
                    };
                    var $3501 = $3501($3499);
                    return $3501;
                });
                var $3498 = $3500;
                break;
            case 'Word.i':
                var $3510 = self.pred;
                var $3511 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $3513 = self.pred;
                            var $3514 = (_a$pred$9 => {
                                var $3515 = Word$o$(Word$and$(_a$pred$9, $3513));
                                return $3515;
                            });
                            var $3512 = $3514;
                            break;
                        case 'Word.i':
                            var $3516 = self.pred;
                            var $3517 = (_a$pred$9 => {
                                var $3518 = Word$i$(Word$and$(_a$pred$9, $3516));
                                return $3518;
                            });
                            var $3512 = $3517;
                            break;
                        case 'Word.e':
                            var $3519 = (_a$pred$7 => {
                                var $3520 = Word$e;
                                return $3520;
                            });
                            var $3512 = $3519;
                            break;
                    };
                    var $3512 = $3512($3510);
                    return $3512;
                });
                var $3498 = $3511;
                break;
            case 'Word.e':
                var $3521 = (_b$4 => {
                    var $3522 = Word$e;
                    return $3522;
                });
                var $3498 = $3521;
                break;
        };
        var $3498 = $3498(_b$3);
        return $3498;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U64$and = a0 => a1 => (a0 & a1);

    function Word$xor$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $3524 = self.pred;
                var $3525 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $3527 = self.pred;
                            var $3528 = (_a$pred$9 => {
                                var $3529 = Word$o$(Word$xor$(_a$pred$9, $3527));
                                return $3529;
                            });
                            var $3526 = $3528;
                            break;
                        case 'Word.i':
                            var $3530 = self.pred;
                            var $3531 = (_a$pred$9 => {
                                var $3532 = Word$i$(Word$xor$(_a$pred$9, $3530));
                                return $3532;
                            });
                            var $3526 = $3531;
                            break;
                        case 'Word.e':
                            var $3533 = (_a$pred$7 => {
                                var $3534 = Word$e;
                                return $3534;
                            });
                            var $3526 = $3533;
                            break;
                    };
                    var $3526 = $3526($3524);
                    return $3526;
                });
                var $3523 = $3525;
                break;
            case 'Word.i':
                var $3535 = self.pred;
                var $3536 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $3538 = self.pred;
                            var $3539 = (_a$pred$9 => {
                                var $3540 = Word$i$(Word$xor$(_a$pred$9, $3538));
                                return $3540;
                            });
                            var $3537 = $3539;
                            break;
                        case 'Word.i':
                            var $3541 = self.pred;
                            var $3542 = (_a$pred$9 => {
                                var $3543 = Word$o$(Word$xor$(_a$pred$9, $3541));
                                return $3543;
                            });
                            var $3537 = $3542;
                            break;
                        case 'Word.e':
                            var $3544 = (_a$pred$7 => {
                                var $3545 = Word$e;
                                return $3545;
                            });
                            var $3537 = $3544;
                            break;
                    };
                    var $3537 = $3537($3535);
                    return $3537;
                });
                var $3523 = $3536;
                break;
            case 'Word.e':
                var $3546 = (_b$4 => {
                    var $3547 = Word$e;
                    return $3547;
                });
                var $3523 = $3546;
                break;
        };
        var $3523 = $3523(_b$3);
        return $3523;
    };
    const Word$xor = x0 => x1 => Word$xor$(x0, x1);
    const U64$xor = a0 => a1 => (a0 ^ a1);
    const Kindelia$cost$operate = 1n;
    const Kindelia$cost$bind = 1n;

    function Kindelia$reduce$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'Kindelia.Runtime.new':
                var $3549 = self.world;
                var $3550 = self.subst;
                var $3551 = self.fresh;
                var $3552 = self.gas;
                var $3553 = self.term;
                var self = $3553;
                switch (self._) {
                    case 'Kindelia.Term.var':
                        var $3555 = self.name;
                        var _term$8 = Maybe$default$(Map$get$($3555, $3550), $3553);
                        var self = Kindelia$reduce$(Kindelia$Runtime$new$($3549, $3550, $3551, $3552, _term$8));
                        switch (self._) {
                            case 'Kindelia.Runtime.new':
                                var $3557 = self.world;
                                var $3558 = self.subst;
                                var $3559 = self.fresh;
                                var $3560 = self.gas;
                                var $3561 = self.term;
                                var self = $3561;
                                switch (self._) {
                                    case 'Kindelia.Term.var':
                                        var $3563 = self.name;
                                        var $3564 = Kindelia$Runtime$new$($3557, Map$set$($3563, $3561, $3558), $3559, $3560, $3561);
                                        var $3562 = $3564;
                                        break;
                                    case 'Kindelia.Term.let':
                                        var $3565 = self.name;
                                        var $3566 = Kindelia$Runtime$new$($3557, Map$set$($3565, $3561, $3558), $3559, $3560, $3561);
                                        var $3562 = $3566;
                                        break;
                                    case 'Kindelia.Term.create':
                                        var $3567 = self.ctor;
                                        var $3568 = self.vals;
                                        var _ivals$16 = List$imapped$($3568, (_i$16 => _x$17 => {
                                            var $3570 = Pair$new$(("$" + Nat$show$(($3559 + _i$16))), _x$17);
                                            return $3570;
                                        }));
                                        var _subst$17 = Kindelia$extend$($3558, _ivals$16);
                                        var _term$18 = Kindelia$Term$create$($3567, List$map$((_x$18 => {
                                            var $3571 = Kindelia$Term$var$((() => {
                                                var self = _x$18;
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3572 = self.fst;
                                                        var $3573 = $3572;
                                                        return $3573;
                                                };
                                            })());
                                            return $3571;
                                        }), _ivals$16));
                                        var _subst$19 = Map$set$($3555, _term$18, _subst$17);
                                        var _size$20 = (list_length(_ivals$16));
                                        var _fresh$21 = ($3559 + _size$20);
                                        var _gas$22 = (Kindelia$cost$copy$(_size$20) + $3560);
                                        var $3569 = Kindelia$Runtime$new$($3557, _subst$19, _fresh$21, _gas$22, _term$18);
                                        var $3562 = $3569;
                                        break;
                                    case 'Kindelia.Term.match':
                                        var $3574 = self.name;
                                        var $3575 = Kindelia$Runtime$new$($3557, Map$set$($3574, $3561, $3558), $3559, $3560, $3561);
                                        var $3562 = $3575;
                                        break;
                                    case 'Kindelia.Term.call':
                                    case 'Kindelia.Term.word':
                                    case 'Kindelia.Term.compare':
                                    case 'Kindelia.Term.operate':
                                    case 'Kindelia.Term.bind':
                                        var $3576 = Kindelia$Runtime$new$($3557, Map$set$($3555, $3561, $3558), $3559, $3560, $3561);
                                        var $3562 = $3576;
                                        break;
                                };
                                var $3556 = $3562;
                                break;
                        };
                        var $3554 = $3556;
                        break;
                    case 'Kindelia.Term.call':
                        var $3577 = self.bond;
                        var $3578 = self.args;
                        var self = Kindelia$get_bond$($3549, $3577);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3580 = self.value;
                                var _bond$10 = $3580;
                                var self = _bond$10;
                                switch (self._) {
                                    case 'Kindelia.Bond.new':
                                        var $3582 = self.args;
                                        var $3583 = self.main;
                                        var _inam$16 = List$mapped$($3582, Pair$fst);
                                        var self = Kindelia$rename$many$(Map$from_list$(List$nil), $3551, _inam$16);
                                        switch (self._) {
                                            case 'Triple.new':
                                                var $3585 = self.fst;
                                                var $3586 = self.snd;
                                                var $3587 = self.trd;
                                                var self = Kindelia$sanitize$($3549, $3585, $3586, $3583);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3589 = self.fst;
                                                        var $3590 = self.snd;
                                                        var _subst$22 = Kindelia$extend$($3550, List$zip$($3587, $3578));
                                                        var _gas$23 = (Kindelia$cost$create$((list_length($3578))) + $3552);
                                                        var $3591 = Kindelia$reduce$(Kindelia$Runtime$new$($3549, _subst$22, $3589, _gas$23, $3590));
                                                        var $3588 = $3591;
                                                        break;
                                                };
                                                var $3584 = $3588;
                                                break;
                                        };
                                        var $3581 = $3584;
                                        break;
                                };
                                var $3579 = $3581;
                                break;
                            case 'Maybe.none':
                                var $3592 = _state$1;
                                var $3579 = $3592;
                                break;
                        };
                        var $3554 = $3579;
                        break;
                    case 'Kindelia.Term.let':
                        var $3593 = self.name;
                        var $3594 = self.expr;
                        var $3595 = self.body;
                        var _subst$11 = Map$set$($3593, $3594, $3550);
                        var _gas$12 = (Kindelia$cost$let + $3552);
                        var $3596 = Kindelia$reduce$(Kindelia$Runtime$new$($3549, _subst$11, $3551, _gas$12, $3595));
                        var $3554 = $3596;
                        break;
                    case 'Kindelia.Term.match':
                        var $3597 = self.name;
                        var $3598 = self.data;
                        var $3599 = self.cses;
                        var self = Kindelia$reduce$(Kindelia$Runtime$new$($3549, $3550, $3551, $3552, Maybe$default$(Map$get$($3597, $3550), Kindelia$Term$word$(0n))));
                        switch (self._) {
                            case 'Kindelia.Runtime.new':
                                var $3601 = self.world;
                                var $3602 = self.subst;
                                var $3603 = self.fresh;
                                var $3604 = self.gas;
                                var $3605 = self.term;
                                var self = $3605;
                                switch (self._) {
                                    case 'Kindelia.Term.create':
                                        var $3607 = self.ctor;
                                        var $3608 = self.vals;
                                        var self = Kindelia$get_data$($3601, $3598);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $3610 = self.value;
                                                var _data$18 = $3610;
                                                var self = _data$18;
                                                switch (self._) {
                                                    case 'Kindelia.Data.new':
                                                        var $3612 = self.constructors;
                                                        var self = List$get$($3607, $3612);
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $3614 = self.value;
                                                                var _ctor$22 = $3614;
                                                                var self = _ctor$22;
                                                                switch (self._) {
                                                                    case 'Kindelia.Constructor.new':
                                                                        var self = List$get$($3607, $3599);
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $3617 = self.value;
                                                                                var _nams$26 = List$map$((_args$26 => {
                                                                                    var $3619 = ($3597 + ("." + (() => {
                                                                                        var self = _args$26;
                                                                                        switch (self._) {
                                                                                            case 'Pair.new':
                                                                                                var $3620 = self.fst;
                                                                                                var $3621 = $3620;
                                                                                                return $3621;
                                                                                        };
                                                                                    })()));
                                                                                    return $3619;
                                                                                }), (() => {
                                                                                    var self = _ctor$22;
                                                                                    switch (self._) {
                                                                                        case 'Kindelia.Constructor.new':
                                                                                            var $3622 = self.args;
                                                                                            var $3623 = $3622;
                                                                                            return $3623;
                                                                                    };
                                                                                })());
                                                                                var _subst$27 = Kindelia$extend$($3602, List$zip$(_nams$26, $3608));
                                                                                var _gas$28 = (Kindelia$cost$match$((list_length($3608))) + $3604);
                                                                                var $3618 = Kindelia$reduce$(Kindelia$Runtime$new$($3601, _subst$27, $3603, _gas$28, $3617));
                                                                                var $3616 = $3618;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $3624 = _state$1;
                                                                                var $3616 = $3624;
                                                                                break;
                                                                        };
                                                                        var $3615 = $3616;
                                                                        break;
                                                                };
                                                                var $3613 = $3615;
                                                                break;
                                                            case 'Maybe.none':
                                                                var $3625 = _state$1;
                                                                var $3613 = $3625;
                                                                break;
                                                        };
                                                        var $3611 = $3613;
                                                        break;
                                                };
                                                var $3609 = $3611;
                                                break;
                                            case 'Maybe.none':
                                                var $3626 = _state$1;
                                                var $3609 = $3626;
                                                break;
                                        };
                                        var $3606 = $3609;
                                        break;
                                    case 'Kindelia.Term.var':
                                    case 'Kindelia.Term.call':
                                    case 'Kindelia.Term.let':
                                    case 'Kindelia.Term.match':
                                    case 'Kindelia.Term.word':
                                    case 'Kindelia.Term.compare':
                                    case 'Kindelia.Term.operate':
                                    case 'Kindelia.Term.bind':
                                        var $3627 = _state$1;
                                        var $3606 = $3627;
                                        break;
                                };
                                var $3600 = $3606;
                                break;
                        };
                        var $3554 = $3600;
                        break;
                    case 'Kindelia.Term.compare':
                        var $3628 = self.val0;
                        var $3629 = self.val1;
                        var $3630 = self.iflt;
                        var $3631 = self.ifeq;
                        var $3632 = self.ifgt;
                        var self = Kindelia$reduce$(Kindelia$Runtime$new$($3549, $3550, $3551, $3552, $3628));
                        switch (self._) {
                            case 'Kindelia.Runtime.new':
                                var $3634 = self.world;
                                var $3635 = self.subst;
                                var $3636 = self.fresh;
                                var $3637 = self.gas;
                                var $3638 = self.term;
                                var self = Kindelia$reduce$(Kindelia$Runtime$new$($3634, $3635, $3636, $3637, $3629));
                                switch (self._) {
                                    case 'Kindelia.Runtime.new':
                                        var $3640 = self.world;
                                        var $3641 = self.subst;
                                        var $3642 = self.fresh;
                                        var $3643 = self.gas;
                                        var $3644 = self.term;
                                        var self = $3638;
                                        switch (self._) {
                                            case 'Kindelia.Term.word':
                                                var $3646 = self.numb;
                                                var self = $3644;
                                                switch (self._) {
                                                    case 'Kindelia.Term.word':
                                                        var $3648 = self.numb;
                                                        var self = U64$cmp$($3646, $3648);
                                                        switch (self._) {
                                                            case 'Cmp.ltn':
                                                                var $3650 = $3630;
                                                                var $3649 = $3650;
                                                                break;
                                                            case 'Cmp.eql':
                                                                var $3651 = $3631;
                                                                var $3649 = $3651;
                                                                break;
                                                            case 'Cmp.gtn':
                                                                var $3652 = $3632;
                                                                var $3649 = $3652;
                                                                break;
                                                        };
                                                        var $3647 = $3649;
                                                        break;
                                                    case 'Kindelia.Term.var':
                                                    case 'Kindelia.Term.call':
                                                    case 'Kindelia.Term.let':
                                                    case 'Kindelia.Term.create':
                                                    case 'Kindelia.Term.match':
                                                    case 'Kindelia.Term.compare':
                                                    case 'Kindelia.Term.operate':
                                                    case 'Kindelia.Term.bind':
                                                        var $3653 = $3553;
                                                        var $3647 = $3653;
                                                        break;
                                                };
                                                var _term$22 = $3647;
                                                break;
                                            case 'Kindelia.Term.var':
                                                var self = $3644;
                                                switch (self._) {
                                                    case 'Kindelia.Term.var':
                                                    case 'Kindelia.Term.call':
                                                    case 'Kindelia.Term.let':
                                                    case 'Kindelia.Term.create':
                                                    case 'Kindelia.Term.match':
                                                    case 'Kindelia.Term.word':
                                                    case 'Kindelia.Term.compare':
                                                    case 'Kindelia.Term.operate':
                                                    case 'Kindelia.Term.bind':
                                                        var $3655 = $3553;
                                                        var $3654 = $3655;
                                                        break;
                                                };
                                                var _term$22 = $3654;
                                                break;
                                            case 'Kindelia.Term.call':
                                            case 'Kindelia.Term.create':
                                                var self = $3644;
                                                switch (self._) {
                                                    case 'Kindelia.Term.var':
                                                    case 'Kindelia.Term.call':
                                                    case 'Kindelia.Term.let':
                                                    case 'Kindelia.Term.create':
                                                    case 'Kindelia.Term.match':
                                                    case 'Kindelia.Term.word':
                                                    case 'Kindelia.Term.compare':
                                                    case 'Kindelia.Term.operate':
                                                    case 'Kindelia.Term.bind':
                                                        var $3657 = $3553;
                                                        var $3656 = $3657;
                                                        break;
                                                };
                                                var _term$22 = $3656;
                                                break;
                                            case 'Kindelia.Term.let':
                                                var self = $3644;
                                                switch (self._) {
                                                    case 'Kindelia.Term.var':
                                                    case 'Kindelia.Term.call':
                                                    case 'Kindelia.Term.let':
                                                    case 'Kindelia.Term.create':
                                                    case 'Kindelia.Term.match':
                                                    case 'Kindelia.Term.word':
                                                    case 'Kindelia.Term.compare':
                                                    case 'Kindelia.Term.operate':
                                                    case 'Kindelia.Term.bind':
                                                        var $3659 = $3553;
                                                        var $3658 = $3659;
                                                        break;
                                                };
                                                var _term$22 = $3658;
                                                break;
                                            case 'Kindelia.Term.match':
                                            case 'Kindelia.Term.operate':
                                            case 'Kindelia.Term.bind':
                                                var self = $3644;
                                                switch (self._) {
                                                    case 'Kindelia.Term.var':
                                                    case 'Kindelia.Term.call':
                                                    case 'Kindelia.Term.let':
                                                    case 'Kindelia.Term.create':
                                                    case 'Kindelia.Term.match':
                                                    case 'Kindelia.Term.word':
                                                    case 'Kindelia.Term.compare':
                                                    case 'Kindelia.Term.operate':
                                                    case 'Kindelia.Term.bind':
                                                        var $3661 = $3553;
                                                        var $3660 = $3661;
                                                        break;
                                                };
                                                var _term$22 = $3660;
                                                break;
                                            case 'Kindelia.Term.compare':
                                                var self = $3644;
                                                switch (self._) {
                                                    case 'Kindelia.Term.var':
                                                    case 'Kindelia.Term.call':
                                                    case 'Kindelia.Term.let':
                                                    case 'Kindelia.Term.create':
                                                    case 'Kindelia.Term.match':
                                                    case 'Kindelia.Term.word':
                                                    case 'Kindelia.Term.compare':
                                                    case 'Kindelia.Term.operate':
                                                    case 'Kindelia.Term.bind':
                                                        var $3663 = $3553;
                                                        var $3662 = $3663;
                                                        break;
                                                };
                                                var _term$22 = $3662;
                                                break;
                                        };
                                        var _gas$23 = (Kindelia$cost$compare + $3643);
                                        var $3645 = Kindelia$Runtime$new$($3640, $3641, $3642, _gas$23, _term$22);
                                        var $3639 = $3645;
                                        break;
                                };
                                var $3633 = $3639;
                                break;
                        };
                        var $3554 = $3633;
                        break;
                    case 'Kindelia.Term.operate':
                        var $3664 = self.oper;
                        var $3665 = self.val0;
                        var $3666 = self.val1;
                        var self = Kindelia$reduce$(Kindelia$Runtime$new$($3549, $3550, $3551, $3552, $3665));
                        switch (self._) {
                            case 'Kindelia.Runtime.new':
                                var $3668 = self.world;
                                var $3669 = self.subst;
                                var $3670 = self.fresh;
                                var $3671 = self.gas;
                                var $3672 = self.term;
                                var self = Kindelia$reduce$(Kindelia$Runtime$new$($3668, $3669, $3670, $3671, $3666));
                                switch (self._) {
                                    case 'Kindelia.Runtime.new':
                                        var $3674 = self.world;
                                        var $3675 = self.subst;
                                        var $3676 = self.fresh;
                                        var $3677 = self.gas;
                                        var $3678 = self.term;
                                        var self = $3672;
                                        switch (self._) {
                                            case 'Kindelia.Term.word':
                                                var $3680 = self.numb;
                                                var self = $3678;
                                                switch (self._) {
                                                    case 'Kindelia.Term.word':
                                                        var $3682 = self.numb;
                                                        var self = $3664;
                                                        switch (self._) {
                                                            case 'Kindelia.Operation.add':
                                                                var $3684 = Kindelia$Term$word$((($3680 + $3682) & 0xFFFFFFFFFFFFFFFFn));
                                                                var $3683 = $3684;
                                                                break;
                                                            case 'Kindelia.Operation.sub':
                                                                var $3685 = Kindelia$Term$word$((($3680 - $3682) & 0xFFFFFFFFFFFFFFFFn));
                                                                var $3683 = $3685;
                                                                break;
                                                            case 'Kindelia.Operation.mul':
                                                                var $3686 = Kindelia$Term$word$((($3680 * $3682) & 0xFFFFFFFFFFFFFFFFn));
                                                                var $3683 = $3686;
                                                                break;
                                                            case 'Kindelia.Operation.div':
                                                                var $3687 = Kindelia$Term$word$((($3680 / $3682) & 0xFFFFFFFFFFFFFFFFn));
                                                                var $3683 = $3687;
                                                                break;
                                                            case 'Kindelia.Operation.mod':
                                                                var $3688 = Kindelia$Term$word$(($3680 % $3682));
                                                                var $3683 = $3688;
                                                                break;
                                                            case 'Kindelia.Operation.or':
                                                                var $3689 = Kindelia$Term$word$(($3680 | $3682));
                                                                var $3683 = $3689;
                                                                break;
                                                            case 'Kindelia.Operation.and':
                                                                var $3690 = Kindelia$Term$word$(($3680 & $3682));
                                                                var $3683 = $3690;
                                                                break;
                                                            case 'Kindelia.Operation.xor':
                                                                var $3691 = Kindelia$Term$word$(($3680 ^ $3682));
                                                                var $3683 = $3691;
                                                                break;
                                                        };
                                                        var $3681 = $3683;
                                                        break;
                                                    case 'Kindelia.Term.var':
                                                    case 'Kindelia.Term.call':
                                                    case 'Kindelia.Term.let':
                                                    case 'Kindelia.Term.create':
                                                    case 'Kindelia.Term.match':
                                                    case 'Kindelia.Term.compare':
                                                    case 'Kindelia.Term.operate':
                                                    case 'Kindelia.Term.bind':
                                                        var $3692 = $3553;
                                                        var $3681 = $3692;
                                                        break;
                                                };
                                                var _term$20 = $3681;
                                                break;
                                            case 'Kindelia.Term.var':
                                                var self = $3678;
                                                switch (self._) {
                                                    case 'Kindelia.Term.var':
                                                    case 'Kindelia.Term.call':
                                                    case 'Kindelia.Term.let':
                                                    case 'Kindelia.Term.create':
                                                    case 'Kindelia.Term.match':
                                                    case 'Kindelia.Term.word':
                                                    case 'Kindelia.Term.compare':
                                                    case 'Kindelia.Term.operate':
                                                    case 'Kindelia.Term.bind':
                                                        var $3694 = $3553;
                                                        var $3693 = $3694;
                                                        break;
                                                };
                                                var _term$20 = $3693;
                                                break;
                                            case 'Kindelia.Term.call':
                                            case 'Kindelia.Term.create':
                                                var self = $3678;
                                                switch (self._) {
                                                    case 'Kindelia.Term.var':
                                                    case 'Kindelia.Term.call':
                                                    case 'Kindelia.Term.let':
                                                    case 'Kindelia.Term.create':
                                                    case 'Kindelia.Term.match':
                                                    case 'Kindelia.Term.word':
                                                    case 'Kindelia.Term.compare':
                                                    case 'Kindelia.Term.operate':
                                                    case 'Kindelia.Term.bind':
                                                        var $3696 = $3553;
                                                        var $3695 = $3696;
                                                        break;
                                                };
                                                var _term$20 = $3695;
                                                break;
                                            case 'Kindelia.Term.let':
                                                var self = $3678;
                                                switch (self._) {
                                                    case 'Kindelia.Term.var':
                                                    case 'Kindelia.Term.call':
                                                    case 'Kindelia.Term.let':
                                                    case 'Kindelia.Term.create':
                                                    case 'Kindelia.Term.match':
                                                    case 'Kindelia.Term.word':
                                                    case 'Kindelia.Term.compare':
                                                    case 'Kindelia.Term.operate':
                                                    case 'Kindelia.Term.bind':
                                                        var $3698 = $3553;
                                                        var $3697 = $3698;
                                                        break;
                                                };
                                                var _term$20 = $3697;
                                                break;
                                            case 'Kindelia.Term.match':
                                            case 'Kindelia.Term.operate':
                                            case 'Kindelia.Term.bind':
                                                var self = $3678;
                                                switch (self._) {
                                                    case 'Kindelia.Term.var':
                                                    case 'Kindelia.Term.call':
                                                    case 'Kindelia.Term.let':
                                                    case 'Kindelia.Term.create':
                                                    case 'Kindelia.Term.match':
                                                    case 'Kindelia.Term.word':
                                                    case 'Kindelia.Term.compare':
                                                    case 'Kindelia.Term.operate':
                                                    case 'Kindelia.Term.bind':
                                                        var $3700 = $3553;
                                                        var $3699 = $3700;
                                                        break;
                                                };
                                                var _term$20 = $3699;
                                                break;
                                            case 'Kindelia.Term.compare':
                                                var self = $3678;
                                                switch (self._) {
                                                    case 'Kindelia.Term.var':
                                                    case 'Kindelia.Term.call':
                                                    case 'Kindelia.Term.let':
                                                    case 'Kindelia.Term.create':
                                                    case 'Kindelia.Term.match':
                                                    case 'Kindelia.Term.word':
                                                    case 'Kindelia.Term.compare':
                                                    case 'Kindelia.Term.operate':
                                                    case 'Kindelia.Term.bind':
                                                        var $3702 = $3553;
                                                        var $3701 = $3702;
                                                        break;
                                                };
                                                var _term$20 = $3701;
                                                break;
                                        };
                                        var _gas$21 = (Kindelia$cost$operate + $3677);
                                        var $3679 = Kindelia$Runtime$new$($3674, $3675, $3676, _gas$21, _term$20);
                                        var $3673 = $3679;
                                        break;
                                };
                                var $3667 = $3673;
                                break;
                        };
                        var $3554 = $3667;
                        break;
                    case 'Kindelia.Term.bind':
                        var $3703 = self.bond;
                        var $3704 = self.expr;
                        var $3705 = self.cont;
                        var self = Kindelia$get_bond$($3549, $3703);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3707 = self.value;
                                var _bond$11 = $3707;
                                var self = _bond$11;
                                switch (self._) {
                                    case 'Kindelia.Bond.new':
                                        var self = Kindelia$normalize$(Kindelia$Runtime$new$($3549, $3550, $3551, $3552, $3704));
                                        switch (self._) {
                                            case 'Kindelia.Runtime.new':
                                                var $3710 = self.world;
                                                var $3711 = self.subst;
                                                var $3712 = self.fresh;
                                                var $3713 = self.gas;
                                                var $3714 = self.term;
                                                var _entry$22 = Kindelia$Entry$bond$((() => {
                                                    var self = _bond$11;
                                                    switch (self._) {
                                                        case 'Kindelia.Bond.new':
                                                            var $3716 = self.name;
                                                            var $3717 = self.ownr;
                                                            var $3718 = self.args;
                                                            var $3719 = self.otyp;
                                                            var $3720 = Kindelia$Bond$new$($3716, $3717, $3718, $3719, $3714);
                                                            return $3720;
                                                    };
                                                })());
                                                var self = $3710;
                                                switch (self._) {
                                                    case 'Kindelia.World.new':
                                                        var $3721 = self.names;
                                                        var $3722 = self.entry;
                                                        var $3723 = Kindelia$World$new$($3721, Map$set$($3703, _entry$22, $3722));
                                                        var _world$23 = $3723;
                                                        break;
                                                };
                                                var _gas$24 = (Kindelia$cost$bind + $3713);
                                                var $3715 = Kindelia$reduce$(Kindelia$Runtime$new$(_world$23, $3711, $3712, _gas$24, $3705));
                                                var $3709 = $3715;
                                                break;
                                        };
                                        var $3708 = $3709;
                                        break;
                                };
                                var $3706 = $3708;
                                break;
                            case 'Maybe.none':
                                var $3724 = _state$1;
                                var $3706 = $3724;
                                break;
                        };
                        var $3554 = $3706;
                        break;
                    case 'Kindelia.Term.create':
                    case 'Kindelia.Term.word':
                        var $3725 = _state$1;
                        var $3554 = $3725;
                        break;
                };
                var $3548 = $3554;
                break;
        };
        return $3548;
    };
    const Kindelia$reduce = x0 => Kindelia$reduce$(x0);

    function Kindelia$normalize$many$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'Kindelia.Runtime.new':
                var $3727 = self.world;
                var $3728 = self.subst;
                var $3729 = self.fresh;
                var $3730 = self.gas;
                var $3731 = self.term;
                var self = $3731;
                switch (self._) {
                    case 'List.cons':
                        var $3733 = self.head;
                        var $3734 = self.tail;
                        var self = Kindelia$normalize$(Kindelia$Runtime$new$($3727, $3728, $3729, $3730, $3733));
                        switch (self._) {
                            case 'Kindelia.Runtime.new':
                                var $3736 = self.world;
                                var $3737 = self.subst;
                                var $3738 = self.fresh;
                                var $3739 = self.gas;
                                var $3740 = self.term;
                                var self = Kindelia$normalize$many$(Kindelia$Runtime$new$($3736, $3737, $3738, $3739, $3734));
                                switch (self._) {
                                    case 'Kindelia.Runtime.new':
                                        var $3742 = self.world;
                                        var $3743 = self.subst;
                                        var $3744 = self.fresh;
                                        var $3745 = self.gas;
                                        var $3746 = self.term;
                                        var $3747 = Kindelia$Runtime$new$($3742, $3743, $3744, $3745, List$cons$($3740, $3746));
                                        var $3741 = $3747;
                                        break;
                                };
                                var $3735 = $3741;
                                break;
                        };
                        var $3732 = $3735;
                        break;
                    case 'List.nil':
                        var $3748 = _state$1;
                        var $3732 = $3748;
                        break;
                };
                var $3726 = $3732;
                break;
        };
        return $3726;
    };
    const Kindelia$normalize$many = x0 => Kindelia$normalize$many$(x0);

    function Kindelia$normalize$cases$(_ctrs$1, _name$2, _state$3) {
        var self = _state$3;
        switch (self._) {
            case 'Kindelia.Runtime.new':
                var $3750 = self.world;
                var $3751 = self.subst;
                var $3752 = self.fresh;
                var $3753 = self.gas;
                var $3754 = self.term;
                var self = _ctrs$1;
                switch (self._) {
                    case 'List.cons':
                        var $3756 = self.head;
                        var $3757 = self.tail;
                        var self = $3754;
                        switch (self._) {
                            case 'List.cons':
                                var $3759 = self.head;
                                var $3760 = self.tail;
                                var _nams$13 = List$map$((_args$13 => {
                                    var $3762 = (_name$2 + ("." + (() => {
                                        var self = _args$13;
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $3763 = self.fst;
                                                var $3764 = $3763;
                                                return $3764;
                                        };
                                    })()));
                                    return $3762;
                                }), (() => {
                                    var self = $3756;
                                    switch (self._) {
                                        case 'Kindelia.Constructor.new':
                                            var $3765 = self.args;
                                            var $3766 = $3765;
                                            return $3766;
                                    };
                                })());
                                var _vals$14 = List$map$(Kindelia$Term$var, _nams$13);
                                var _subst$15 = Kindelia$extend$($3751, List$zip$(_nams$13, _vals$14));
                                var self = Kindelia$normalize$(Kindelia$Runtime$new$($3750, _subst$15, $3752, $3753, $3759));
                                switch (self._) {
                                    case 'Kindelia.Runtime.new':
                                        var $3767 = self.world;
                                        var $3768 = self.subst;
                                        var $3769 = self.fresh;
                                        var $3770 = self.gas;
                                        var $3771 = self.term;
                                        var self = Kindelia$normalize$cases$($3757, _name$2, Kindelia$Runtime$new$($3767, $3768, $3769, $3770, $3760));
                                        switch (self._) {
                                            case 'Kindelia.Runtime.new':
                                                var $3773 = self.world;
                                                var $3774 = self.subst;
                                                var $3775 = self.fresh;
                                                var $3776 = self.gas;
                                                var $3777 = self.term;
                                                var $3778 = Kindelia$Runtime$new$($3773, $3774, $3775, $3776, List$cons$($3771, $3777));
                                                var $3772 = $3778;
                                                break;
                                        };
                                        var $3761 = $3772;
                                        break;
                                };
                                var $3758 = $3761;
                                break;
                            case 'List.nil':
                                var $3779 = _state$3;
                                var $3758 = $3779;
                                break;
                        };
                        var $3755 = $3758;
                        break;
                    case 'List.nil':
                        var self = $3754;
                        switch (self._) {
                            case 'List.nil':
                            case 'List.cons':
                                var $3781 = _state$3;
                                var $3780 = $3781;
                                break;
                        };
                        var $3755 = $3780;
                        break;
                };
                var $3749 = $3755;
                break;
        };
        return $3749;
    };
    const Kindelia$normalize$cases = x0 => x1 => x2 => Kindelia$normalize$cases$(x0, x1, x2);

    function Kindelia$normalize$(_state$1) {
        var self = Kindelia$reduce$(_state$1);
        switch (self._) {
            case 'Kindelia.Runtime.new':
                var $3783 = self.world;
                var $3784 = self.subst;
                var $3785 = self.fresh;
                var $3786 = self.gas;
                var $3787 = self.term;
                var self = $3787;
                switch (self._) {
                    case 'Kindelia.Term.create':
                        var $3789 = self.ctor;
                        var $3790 = self.vals;
                        var self = Kindelia$normalize$many$(Kindelia$Runtime$new$($3783, $3784, $3785, $3786, $3790));
                        switch (self._) {
                            case 'Kindelia.Runtime.new':
                                var $3792 = self.world;
                                var $3793 = self.subst;
                                var $3794 = self.fresh;
                                var $3795 = self.gas;
                                var $3796 = self.term;
                                var $3797 = Kindelia$Runtime$new$($3792, $3793, $3794, $3795, Kindelia$Term$create$($3789, $3796));
                                var $3791 = $3797;
                                break;
                        };
                        var $3788 = $3791;
                        break;
                    case 'Kindelia.Term.match':
                        var $3798 = self.name;
                        var $3799 = self.data;
                        var $3800 = self.cses;
                        var self = Kindelia$get_constructors$($3783, $3799);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3802 = self.value;
                                var _ctrs$11 = $3802;
                                var self = _ctrs$11;
                                switch (self._) {
                                    case 'List.nil':
                                        var self = Kindelia$normalize$cases$(_ctrs$11, $3798, Kindelia$Runtime$new$($3783, $3784, $3785, $3786, $3800));
                                        switch (self._) {
                                            case 'Kindelia.Runtime.new':
                                                var $3805 = self.world;
                                                var $3806 = self.subst;
                                                var $3807 = self.fresh;
                                                var $3808 = self.gas;
                                                var $3809 = self.term;
                                                var $3810 = Kindelia$Runtime$new$($3805, $3806, $3807, $3808, Kindelia$Term$match$($3798, $3799, $3809));
                                                var $3804 = $3810;
                                                break;
                                        };
                                        var $3803 = $3804;
                                        break;
                                    case 'List.cons':
                                        var self = Kindelia$normalize$cases$(_ctrs$11, $3798, Kindelia$Runtime$new$($3783, $3784, $3785, $3786, $3800));
                                        switch (self._) {
                                            case 'Kindelia.Runtime.new':
                                                var $3812 = self.world;
                                                var $3813 = self.subst;
                                                var $3814 = self.fresh;
                                                var $3815 = self.gas;
                                                var $3816 = self.term;
                                                var $3817 = Kindelia$Runtime$new$($3812, $3813, $3814, $3815, Kindelia$Term$match$($3798, $3799, $3816));
                                                var $3811 = $3817;
                                                break;
                                        };
                                        var $3803 = $3811;
                                        break;
                                };
                                var $3801 = $3803;
                                break;
                            case 'Maybe.none':
                                var $3818 = Kindelia$Runtime$new$($3783, $3784, $3785, $3786, $3787);
                                var $3801 = $3818;
                                break;
                        };
                        var $3788 = $3801;
                        break;
                    case 'Kindelia.Term.compare':
                        var $3819 = self.val0;
                        var $3820 = self.val1;
                        var $3821 = self.iflt;
                        var $3822 = self.ifeq;
                        var $3823 = self.ifgt;
                        var self = Kindelia$normalize$(Kindelia$Runtime$new$($3783, $3784, $3785, $3786, $3819));
                        switch (self._) {
                            case 'Kindelia.Runtime.new':
                                var $3825 = self.world;
                                var $3826 = self.subst;
                                var $3827 = self.fresh;
                                var $3828 = self.gas;
                                var $3829 = self.term;
                                var self = Kindelia$normalize$(Kindelia$Runtime$new$($3825, $3826, $3827, $3828, $3820));
                                switch (self._) {
                                    case 'Kindelia.Runtime.new':
                                        var $3831 = self.world;
                                        var $3832 = self.subst;
                                        var $3833 = self.fresh;
                                        var $3834 = self.gas;
                                        var $3835 = self.term;
                                        var self = Kindelia$normalize$(Kindelia$Runtime$new$($3831, $3832, $3833, $3834, $3821));
                                        switch (self._) {
                                            case 'Kindelia.Runtime.new':
                                                var $3837 = self.world;
                                                var $3838 = self.subst;
                                                var $3839 = self.fresh;
                                                var $3840 = self.gas;
                                                var $3841 = self.term;
                                                var self = Kindelia$normalize$(Kindelia$Runtime$new$($3837, $3838, $3839, $3840, $3822));
                                                switch (self._) {
                                                    case 'Kindelia.Runtime.new':
                                                        var $3843 = self.world;
                                                        var $3844 = self.subst;
                                                        var $3845 = self.fresh;
                                                        var $3846 = self.gas;
                                                        var $3847 = self.term;
                                                        var self = Kindelia$normalize$(Kindelia$Runtime$new$($3843, $3844, $3845, $3846, $3823));
                                                        switch (self._) {
                                                            case 'Kindelia.Runtime.new':
                                                                var $3849 = self.world;
                                                                var $3850 = self.subst;
                                                                var $3851 = self.fresh;
                                                                var $3852 = self.gas;
                                                                var $3853 = self.term;
                                                                var $3854 = Kindelia$Runtime$new$($3849, $3850, $3851, $3852, Kindelia$Term$compare$($3829, $3835, $3841, $3847, $3853));
                                                                var $3848 = $3854;
                                                                break;
                                                        };
                                                        var $3842 = $3848;
                                                        break;
                                                };
                                                var $3836 = $3842;
                                                break;
                                        };
                                        var $3830 = $3836;
                                        break;
                                };
                                var $3824 = $3830;
                                break;
                        };
                        var $3788 = $3824;
                        break;
                    case 'Kindelia.Term.operate':
                        var $3855 = self.oper;
                        var $3856 = self.val0;
                        var $3857 = self.val1;
                        var self = Kindelia$normalize$(Kindelia$Runtime$new$($3783, $3784, $3785, $3786, $3856));
                        switch (self._) {
                            case 'Kindelia.Runtime.new':
                                var $3859 = self.world;
                                var $3860 = self.subst;
                                var $3861 = self.fresh;
                                var $3862 = self.gas;
                                var $3863 = self.term;
                                var self = Kindelia$normalize$(Kindelia$Runtime$new$($3859, $3860, $3861, $3862, $3857));
                                switch (self._) {
                                    case 'Kindelia.Runtime.new':
                                        var $3865 = self.world;
                                        var $3866 = self.subst;
                                        var $3867 = self.fresh;
                                        var $3868 = self.gas;
                                        var $3869 = self.term;
                                        var $3870 = Kindelia$Runtime$new$($3865, $3866, $3867, $3868, Kindelia$Term$operate$($3855, $3863, $3869));
                                        var $3864 = $3870;
                                        break;
                                };
                                var $3858 = $3864;
                                break;
                        };
                        var $3788 = $3858;
                        break;
                    case 'Kindelia.Term.bind':
                        var $3871 = self.bond;
                        var $3872 = self.expr;
                        var $3873 = self.cont;
                        var self = Kindelia$get_bond$($3783, $3871);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3875 = self.value;
                                var _bond$11 = $3875;
                                var self = _bond$11;
                                switch (self._) {
                                    case 'Kindelia.Bond.new':
                                        var self = Kindelia$normalize$(Kindelia$Runtime$new$($3783, $3784, $3785, $3786, $3872));
                                        switch (self._) {
                                            case 'Kindelia.Runtime.new':
                                                var $3878 = self.world;
                                                var $3879 = self.subst;
                                                var $3880 = self.fresh;
                                                var $3881 = self.gas;
                                                var $3882 = self.term;
                                                var self = Kindelia$normalize$(Kindelia$Runtime$new$($3878, $3879, $3880, $3881, $3873));
                                                switch (self._) {
                                                    case 'Kindelia.Runtime.new':
                                                        var $3884 = self.world;
                                                        var $3885 = self.subst;
                                                        var $3886 = self.fresh;
                                                        var $3887 = self.gas;
                                                        var $3888 = self.term;
                                                        var $3889 = Kindelia$Runtime$new$($3884, $3885, $3886, $3887, Kindelia$Term$bind$($3871, $3882, $3888));
                                                        var $3883 = $3889;
                                                        break;
                                                };
                                                var $3877 = $3883;
                                                break;
                                        };
                                        var $3876 = $3877;
                                        break;
                                };
                                var $3874 = $3876;
                                break;
                            case 'Maybe.none':
                                var $3890 = _state$1;
                                var $3874 = $3890;
                                break;
                        };
                        var $3788 = $3874;
                        break;
                    case 'Kindelia.Term.var':
                    case 'Kindelia.Term.call':
                    case 'Kindelia.Term.let':
                    case 'Kindelia.Term.word':
                        var $3891 = Kindelia$Runtime$new$($3783, $3784, $3785, $3786, $3787);
                        var $3788 = $3891;
                        break;
                };
                var $3782 = $3788;
                break;
        };
        return $3782;
    };
    const Kindelia$normalize = x0 => Kindelia$normalize$(x0);

    function Kindelia$show$type$(_world$1, _type$2) {
        var self = _type$2;
        switch (self._) {
            case 'Kindelia.Type.data':
                var $3893 = self.name;
                var $3894 = $3893;
                var $3892 = $3894;
                break;
            case 'Kindelia.Type.word':
                var $3895 = "#word";
                var $3892 = $3895;
                break;
        };
        return $3892;
    };
    const Kindelia$show$type = x0 => x1 => Kindelia$show$type$(x0, x1);

    function Word$show$(_size$1, _a$2) {
        var $3896 = Nat$show$(Word$to_nat$(_a$2));
        return $3896;
    };
    const Word$show = x0 => x1 => Word$show$(x0, x1);
    const U64$show = a0 => (String(a0));

    function Kindelia$show$term$(_world$1, _type$2, _term$3) {
        var self = _term$3;
        switch (self._) {
            case 'Kindelia.Term.var':
                var $3898 = self.name;
                var $3899 = $3898;
                var $3897 = $3899;
                break;
            case 'Kindelia.Term.call':
                var $3900 = self.bond;
                var $3901 = self.args;
                var self = Kindelia$get_bond$(_world$1, $3900);
                switch (self._) {
                    case 'Maybe.some':
                        var $3903 = self.value;
                        var _bond$7 = $3903;
                        var self = _bond$7;
                        switch (self._) {
                            case 'Kindelia.Bond.new':
                                var $3905 = self.args;
                                var _args$13 = List$zipped_with$($3905, $3901, (_inp$13 => _arg$14 => {
                                    var $3907 = Kindelia$show$term$(_world$1, (() => {
                                        var self = _inp$13;
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $3908 = self.snd;
                                                var $3909 = $3908;
                                                return $3909;
                                        };
                                    })(), _arg$14);
                                    return $3907;
                                }));
                                var $3906 = ($3900 + ("(" + (String$join$(",", _args$13) + ")")));
                                var $3904 = $3906;
                                break;
                        };
                        var $3902 = $3904;
                        break;
                    case 'Maybe.none':
                        var $3910 = "[call?]";
                        var $3902 = $3910;
                        break;
                };
                var $3897 = $3902;
                break;
            case 'Kindelia.Term.let':
                var $3911 = self.name;
                var $3912 = self.type;
                var $3913 = self.expr;
                var $3914 = self.body;
                var _name$8 = $3911;
                var _etyp$9 = Kindelia$show$type$(_world$1, $3912);
                var _expr$10 = Kindelia$show$term$(_world$1, $3912, $3913);
                var _body$11 = Kindelia$show$term$(_world$1, _type$2, $3914);
                var $3915 = ("let " + (_name$8 + (" : " + (_etyp$9 + (" = " + (_expr$10 + (" " + _body$11)))))));
                var $3897 = $3915;
                break;
            case 'Kindelia.Term.create':
                var $3916 = self.ctor;
                var $3917 = self.vals;
                var self = _type$2;
                switch (self._) {
                    case 'Kindelia.Type.data':
                        var $3919 = self.name;
                        var self = Kindelia$get_data$(_world$1, $3919);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3921 = self.value;
                                var _data$8 = $3921;
                                var self = _data$8;
                                switch (self._) {
                                    case 'Kindelia.Data.new':
                                        var $3923 = self.name;
                                        var $3924 = self.constructors;
                                        var self = List$get$($3916, $3924);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $3926 = self.value;
                                                var _ctor$12 = $3926;
                                                var self = _ctor$12;
                                                switch (self._) {
                                                    case 'Kindelia.Constructor.new':
                                                        var $3928 = self.name;
                                                        var $3929 = self.args;
                                                        var _atyp$15 = List$mapped$($3929, (_x$15 => {
                                                            var self = _x$15;
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $3932 = self.snd;
                                                                    var $3933 = $3932;
                                                                    var $3931 = $3933;
                                                                    break;
                                                            };
                                                            return $3931;
                                                        }));
                                                        var _vals$16 = List$zipped_with$($3917, (() => {
                                                            var self = _ctor$12;
                                                            switch (self._) {
                                                                case 'Kindelia.Constructor.new':
                                                                    var $3934 = self.args;
                                                                    var $3935 = $3934;
                                                                    return $3935;
                                                            };
                                                        })(), (_val$16 => _arg$17 => {
                                                            var $3936 = Kindelia$show$term$(_world$1, (() => {
                                                                var self = _arg$17;
                                                                switch (self._) {
                                                                    case 'Pair.new':
                                                                        var $3937 = self.snd;
                                                                        var $3938 = $3937;
                                                                        return $3938;
                                                                };
                                                            })(), _val$16);
                                                            return $3936;
                                                        }));
                                                        var $3930 = ($3923 + ("@" + ($3928 + ("{" + (String$join$(",", _vals$16) + "}")))));
                                                        var $3927 = $3930;
                                                        break;
                                                };
                                                var $3925 = $3927;
                                                break;
                                            case 'Maybe.none':
                                                var $3939 = "[create?]";
                                                var $3925 = $3939;
                                                break;
                                        };
                                        var $3922 = $3925;
                                        break;
                                };
                                var $3920 = $3922;
                                break;
                            case 'Maybe.none':
                                var $3940 = "[create?]";
                                var $3920 = $3940;
                                break;
                        };
                        var $3918 = $3920;
                        break;
                    case 'Kindelia.Type.word':
                        var $3941 = (Nat$show$($3916) + ("{" + (String$join$(",", List$mapped$($3917, Kindelia$show$term(_world$1)(Kindelia$Type$word))) + "}")));
                        var $3918 = $3941;
                        break;
                };
                var $3897 = $3918;
                break;
            case 'Kindelia.Term.match':
                var $3942 = self.name;
                var $3943 = self.data;
                var $3944 = self.cses;
                var self = Kindelia$get_data$(_world$1, $3943);
                switch (self._) {
                    case 'Maybe.some':
                        var $3946 = self.value;
                        var _data$8 = $3946;
                        var self = _data$8;
                        switch (self._) {
                            case 'Kindelia.Data.new':
                                var $3948 = self.constructors;
                                var _name$11 = $3942;
                                var _cses$12 = List$zipped_with$($3948, $3944, (_case_ctor$12 => _case_body$13 => {
                                    var $3950 = ((() => {
                                        var self = _case_ctor$12;
                                        switch (self._) {
                                            case 'Kindelia.Constructor.new':
                                                var $3951 = self.name;
                                                var $3952 = $3951;
                                                return $3952;
                                        };
                                    })() + (": " + Kindelia$show$term$(_world$1, _type$2, _case_body$13)));
                                    return $3950;
                                }));
                                var $3949 = ("case " + (_name$11 + (" : " + ($3943 + (" { " + (String$join$(", ", _cses$12) + " }"))))));
                                var $3947 = $3949;
                                break;
                        };
                        var $3945 = $3947;
                        break;
                    case 'Maybe.none':
                        var $3953 = "?";
                        var $3945 = $3953;
                        break;
                };
                var $3897 = $3945;
                break;
            case 'Kindelia.Term.word':
                var $3954 = self.numb;
                var $3955 = ("#" + (String($3954)));
                var $3897 = $3955;
                break;
            case 'Kindelia.Term.compare':
                var $3956 = self.val0;
                var $3957 = self.val1;
                var $3958 = self.iflt;
                var $3959 = self.ifeq;
                var $3960 = self.ifgt;
                var _val0$9 = Kindelia$show$term$(_world$1, Kindelia$Type$word, $3956);
                var _val1$10 = Kindelia$show$term$(_world$1, Kindelia$Type$word, $3957);
                var _iflt$11 = Kindelia$show$term$(_world$1, _type$2, $3958);
                var _ifeq$12 = Kindelia$show$term$(_world$1, _type$2, $3959);
                var _ifgt$13 = Kindelia$show$term$(_world$1, _type$2, $3960);
                var $3961 = ("compare " + (_val0$9 + (" " + (_val1$10 + (" { _<_: " + (_iflt$11 + (" _=_: " + (_ifeq$12 + (" _>_: " + (_ifgt$13 + " }"))))))))));
                var $3897 = $3961;
                break;
            case 'Kindelia.Term.operate':
                var $3962 = self.oper;
                var $3963 = self.val0;
                var $3964 = self.val1;
                var self = $3962;
                switch (self._) {
                    case 'Kindelia.Operation.add':
                        var $3966 = "+";
                        var _oper$7 = $3966;
                        break;
                    case 'Kindelia.Operation.sub':
                        var $3967 = "-";
                        var _oper$7 = $3967;
                        break;
                    case 'Kindelia.Operation.mul':
                        var $3968 = "*";
                        var _oper$7 = $3968;
                        break;
                    case 'Kindelia.Operation.div':
                        var $3969 = "/";
                        var _oper$7 = $3969;
                        break;
                    case 'Kindelia.Operation.mod':
                        var $3970 = "%";
                        var _oper$7 = $3970;
                        break;
                    case 'Kindelia.Operation.or':
                        var $3971 = "|";
                        var _oper$7 = $3971;
                        break;
                    case 'Kindelia.Operation.and':
                        var $3972 = "&";
                        var _oper$7 = $3972;
                        break;
                    case 'Kindelia.Operation.xor':
                        var $3973 = "^";
                        var _oper$7 = $3973;
                        break;
                };
                var _val0$8 = Kindelia$show$term$(_world$1, Kindelia$Type$word, $3963);
                var _val1$9 = Kindelia$show$term$(_world$1, Kindelia$Type$word, $3964);
                var $3965 = (_oper$7 + ("(" + (_val0$8 + ("," + (_val1$9 + ")")))));
                var $3897 = $3965;
                break;
            case 'Kindelia.Term.bind':
                var $3974 = self.bond;
                var $3975 = self.expr;
                var $3976 = self.cont;
                var self = Kindelia$get_bond$(_world$1, $3974);
                switch (self._) {
                    case 'Maybe.some':
                        var $3978 = self.value;
                        var _bond$8 = $3978;
                        var self = _bond$8;
                        switch (self._) {
                            case 'Kindelia.Bond.new':
                                var $3980 = self.otyp;
                                var _expr$14 = Kindelia$show$term$(_world$1, $3980, $3975);
                                var _cont$15 = Kindelia$show$term$(_world$1, _type$2, $3976);
                                var $3981 = ("bind " + ($3974 + (" { " + (_expr$14 + (" } " + _cont$15)))));
                                var $3979 = $3981;
                                break;
                        };
                        var $3977 = $3979;
                        break;
                    case 'Maybe.none':
                        var $3982 = "[bind?]";
                        var $3977 = $3982;
                        break;
                };
                var $3897 = $3977;
                break;
        };
        return $3897;
    };
    const Kindelia$show$term = x0 => x1 => x2 => Kindelia$show$term$(x0, x1, x2);

    function Kindelia$transact$(_world$1, _transaction$2) {
        var self = _transaction$2;
        switch (self._) {
            case 'Kindelia.Transaction.new_data':
                var $3984 = self.data;
                var _data$4 = $3984;
                var self = _data$4;
                switch (self._) {
                    case 'Kindelia.Data.new':
                        var $3986 = self.name;
                        var self = Map$get$($3986, (() => {
                            var self = _world$1;
                            switch (self._) {
                                case 'Kindelia.World.new':
                                    var $3988 = self.entry;
                                    var $3989 = $3988;
                                    return $3989;
                            };
                        })());
                        switch (self._) {
                            case 'Maybe.none':
                                var self = _world$1;
                                switch (self._) {
                                    case 'Kindelia.World.new':
                                        var $3991 = self.names;
                                        var $3992 = self.entry;
                                        var $3993 = Kindelia$World$new$($3991, Map$set$($3986, Kindelia$Entry$data$(_data$4), $3992));
                                        var _world$7 = $3993;
                                        break;
                                };
                                var $3990 = Maybe$some$(Pair$new$(_world$7, ("[data] " + $3986)));
                                var $3987 = $3990;
                                break;
                            case 'Maybe.some':
                                var $3994 = Maybe$none;
                                var $3987 = $3994;
                                break;
                        };
                        var $3985 = $3987;
                        break;
                };
                var $3983 = $3985;
                break;
            case 'Kindelia.Transaction.new_bond':
                var $3995 = self.bond;
                var _bond$4 = $3995;
                var self = _bond$4;
                switch (self._) {
                    case 'Kindelia.Bond.new':
                        var $3997 = self.name;
                        var $3998 = self.args;
                        var $3999 = self.otyp;
                        var $4000 = self.main;
                        var self = Map$get$($3997, (() => {
                            var self = _world$1;
                            switch (self._) {
                                case 'Kindelia.World.new':
                                    var $4002 = self.entry;
                                    var $4003 = $4002;
                                    return $4003;
                            };
                        })());
                        switch (self._) {
                            case 'Maybe.none':
                                var self = _world$1;
                                switch (self._) {
                                    case 'Kindelia.World.new':
                                        var $4005 = self.names;
                                        var $4006 = self.entry;
                                        var $4007 = Kindelia$World$new$($4005, Map$set$($3997, Kindelia$Entry$bond$(_bond$4), $4006));
                                        var _world$10 = $4007;
                                        break;
                                };
                                var self = List$unzip$($3998);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $4008 = self.fst;
                                        var $4009 = self.snd;
                                        var _context$13 = Kindelia$extend$(Map$from_list$(List$nil), List$zip$($4008, $4009));
                                        var self = Kindelia$check$(_context$13, _world$10, $4000, $3999, Maybe$some$($3997));
                                        if (self) {
                                            var $4011 = Maybe$some$(Pair$new$(_world$10, ("[bond] " + $3997)));
                                            var $4010 = $4011;
                                        } else {
                                            var $4012 = Maybe$none;
                                            var $4010 = $4012;
                                        };
                                        var $4004 = $4010;
                                        break;
                                };
                                var $4001 = $4004;
                                break;
                            case 'Maybe.some':
                                var $4013 = Maybe$none;
                                var $4001 = $4013;
                                break;
                        };
                        var $3996 = $4001;
                        break;
                };
                var $3983 = $3996;
                break;
            case 'Kindelia.Transaction.new_eval':
                var $4014 = self.eval;
                var _eval$4 = $4014;
                var self = _eval$4;
                switch (self._) {
                    case 'Kindelia.Eval.new':
                        var $4016 = self.term;
                        var $4017 = self.type;
                        var self = Kindelia$check$(Map$from_list$(List$nil), _world$1, $4016, $4017, Maybe$none);
                        if (self) {
                            var _fresh$7 = 0n;
                            var self = Kindelia$sanitize$(_world$1, Map$from_list$(List$nil), _fresh$7, $4016);
                            switch (self._) {
                                case 'Pair.new':
                                    var $4020 = self.fst;
                                    var $4021 = self.snd;
                                    var self = $4017;
                                    switch (self._) {
                                        case 'Kindelia.Type.word':
                                        case 'Kindelia.Type.data':
                                            var $4023 = Kindelia$normalize$(Kindelia$Runtime$new$(_world$1, Map$from_list$(List$nil), $4020, 0n, $4021));
                                            var self = $4023;
                                            break;
                                    };
                                    switch (self._) {
                                        case 'Kindelia.Runtime.new':
                                            var $4024 = self.world;
                                            var $4025 = self.gas;
                                            var $4026 = self.term;
                                            var $4027 = Maybe$some$(Pair$new$($4024, ("[eval] " + ("(gas: " + (Nat$show$($4025) + (") " + Kindelia$show$term$($4024, $4017, $4026)))))));
                                            var $4022 = $4027;
                                            break;
                                    };
                                    var $4019 = $4022;
                                    break;
                            };
                            var $4018 = $4019;
                        } else {
                            var $4028 = Maybe$none;
                            var $4018 = $4028;
                        };
                        var $4015 = $4018;
                        break;
                };
                var $3983 = $4015;
                break;
            case 'Kindelia.Transaction.new_name':
                var $4029 = self.name;
                var _name$4 = $4029;
                var self = _world$1;
                switch (self._) {
                    case 'Kindelia.World.new':
                        var $4031 = self.entry;
                        var $4032 = Kindelia$World$new$(List$concat$((() => {
                            var self = _world$1;
                            switch (self._) {
                                case 'Kindelia.World.new':
                                    var $4033 = self.names;
                                    var $4034 = $4033;
                                    return $4034;
                            };
                        })(), List$cons$(_name$4, List$nil)), $4031);
                        var _world$5 = $4032;
                        break;
                };
                var $4030 = Maybe$some$(Pair$new$(_world$5, ("[name] " + _name$4)));
                var $3983 = $4030;
                break;
        };
        return $3983;
    };
    const Kindelia$transact = x0 => x1 => Kindelia$transact$(x0, x1);

    function Kindelia$api$run$go$transactions$(_world$1, _block_number$2, _code$3, _transactions$4) {
        var self = _transactions$4;
        switch (self._) {
            case 'List.cons':
                var $4036 = self.head;
                var $4037 = self.tail;
                var self = Kindelia$transact$(_world$1, $4036);
                switch (self._) {
                    case 'Maybe.some':
                        var $4039 = self.value;
                        var self = $4039;
                        switch (self._) {
                            case 'Pair.new':
                                var $4041 = self.fst;
                                var $4042 = self.snd;
                                var $4043 = IO$monad$((_m$bind$10 => _m$pure$11 => {
                                    var $4044 = _m$bind$10;
                                    return $4044;
                                }))(IO$print$(("- " + $4042)))((_$10 => {
                                    var $4045 = Kindelia$api$run$go$transactions$($4041, _block_number$2, _code$3, $4037);
                                    return $4045;
                                }));
                                var $4040 = $4043;
                                break;
                        };
                        var $4038 = $4040;
                        break;
                    case 'Maybe.none':
                        var $4046 = IO$monad$((_m$bind$7 => _m$pure$8 => {
                            var $4047 = _m$bind$7;
                            return $4047;
                        }))(IO$print$("- [fail]"))((_$7 => {
                            var $4048 = Kindelia$api$run$go$transactions$(_world$1, _block_number$2, _code$3, $4037);
                            return $4048;
                        }));
                        var $4038 = $4046;
                        break;
                };
                var $4035 = $4038;
                break;
            case 'List.nil':
                var $4049 = IO$monad$((_m$bind$5 => _m$pure$6 => {
                    var $4050 = _m$bind$5;
                    return $4050;
                }))(IO$print$(""))((_$5 => {
                    var $4051 = Kindelia$api$run$go$(_world$1, Nat$succ$(_block_number$2), _code$3);
                    return $4051;
                }));
                var $4035 = $4049;
                break;
        };
        return $4035;
    };
    const Kindelia$api$run$go$transactions = x0 => x1 => x2 => x3 => Kindelia$api$run$go$transactions$(x0, x1, x2, x3);

    function Kindelia$api$run$go$(_world$1, _block_number$2, _code$3) {
        var _parsed$4 = Kindelia$parse$block$(_world$1)(Parser$State$new$(Maybe$none, "", 0n, 0n, _code$3));
        var self = _parsed$4;
        switch (self._) {
            case 'Parser.Reply.error':
                var $4053 = self.err;
                var self = $4053;
                switch (self._) {
                    case 'Parser.Error.new':
                        var $4055 = self.nam;
                        var $4056 = self.ini;
                        var $4057 = self.idx;
                        var $4058 = self.msg;
                        var self = ($4057 < String$length$(_code$3));
                        if (self) {
                            var _err$10 = ($4058 + (() => {
                                var self = $4055;
                                if (self.length === 0) {
                                    var $4061 = "";
                                    return $4061;
                                } else {
                                    var $4062 = self.charCodeAt(0);
                                    var $4063 = self.slice(1);
                                    var $4064 = (" Inside " + ($4055 + ":"));
                                    return $4064;
                                };
                            })());
                            var _hig$11 = Kind$Code$highlight$(_code$3, $4056, $4057, Nat$succ$($4057));
                            var _str$12 = String$flatten$(List$cons$(_err$10, List$cons$("\u{a}", List$cons$(_hig$11, List$nil))));
                            var $4060 = IO$monad$((_m$bind$13 => _m$pure$14 => {
                                var $4065 = _m$bind$13;
                                return $4065;
                            }))(IO$print$(("Error parsing block #" + Nat$show$(_block_number$2))))((_$13 => {
                                var $4066 = IO$print$(_str$12);
                                return $4066;
                            }));
                            var $4059 = $4060;
                        } else {
                            var $4067 = IO$print$("Done.");
                            var $4059 = $4067;
                        };
                        var $4054 = $4059;
                        break;
                };
                var $4052 = $4054;
                break;
            case 'Parser.Reply.value':
                var $4068 = self.pst;
                var $4069 = self.val;
                var _block$7 = $4069;
                var $4070 = IO$monad$((_m$bind$8 => _m$pure$9 => {
                    var $4071 = _m$bind$8;
                    return $4071;
                }))(IO$print$(("Block #" + Nat$show$(_block_number$2))))((_$8 => {
                    var _bits_0$9 = Kindelia$serialize$block$(_world$1, _block$7);
                    var _bits_1$10 = Kindelia$serialize$block$(_world$1, (() => {
                        var self = Kindelia$deserialize$block$(_world$1, _bits_0$9);
                        switch (self._) {
                            case 'Pair.new':
                                var $4073 = self.snd;
                                var $4074 = $4073;
                                return $4074;
                        };
                    })());
                    var $4072 = IO$monad$((_m$bind$11 => _m$pure$12 => {
                        var $4075 = _m$bind$11;
                        return $4075;
                    }))(IO$print$(("$ " + (Bits$hex$encode$(_bits_0$9) + (" " + (() => {
                        var self = (_bits_1$10 === _bits_0$9);
                        if (self) {
                            var $4076 = "ok";
                            return $4076;
                        } else {
                            var $4077 = "bad_serialization";
                            return $4077;
                        };
                    })())))))((_$11 => {
                        var $4078 = Kindelia$api$run$go$transactions$(_world$1, _block_number$2, (() => {
                            var self = $4068;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $4079 = self.str;
                                    var $4080 = $4079;
                                    return $4080;
                            };
                        })(), _block$7);
                        return $4078;
                    }));
                    return $4072;
                }));
                var $4052 = $4070;
                break;
        };
        return $4052;
    };
    const Kindelia$api$run$go = x0 => x1 => x2 => Kindelia$api$run$go$(x0, x1, x2);
    const Kindelia$genesis = Kindelia$World$new$(List$nil, Map$from_list$(List$nil));

    function Kindelia$api$run$(_code$1) {
        var $4081 = Kindelia$api$run$go$(Kindelia$genesis, 0n, _code$1);
        return $4081;
    };
    const Kindelia$api$run = x0 => Kindelia$api$run$(x0);
    const Kindelia = (() => {
        var _x$1 = Kindelia$api$run;
        var $4082 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $4083 = _m$pure$3;
            return $4083;
        }))(Unit$new);
        return $4082;
    })();
    return {
        '$main$': () => run(Kindelia),
        'run': run,
        'Parser.Reply': Parser$Reply,
        'Parser.Reply.error': Parser$Reply$error,
        'Parser.Error.new': Parser$Error$new,
        'Parser.Reply.fail': Parser$Reply$fail,
        'Maybe.some': Maybe$some,
        'Maybe': Maybe,
        'Maybe.none': Maybe$none,
        'Bool.false': Bool$false,
        'Bool.true': Bool$true,
        'Nat.gtn': Nat$gtn,
        'Parser.Error.combine': Parser$Error$combine,
        'Parser.Error.maybe_combine': Parser$Error$maybe_combine,
        'Parser.State.new': Parser$State$new,
        'Parser.Reply.value': Parser$Reply$value,
        'Parser.choice': Parser$choice,
        'List': List,
        'List.cons': List$cons,
        'Parser': Parser,
        'List.nil': List$nil,
        'Parser.many.go': Parser$many$go,
        'Parser.many': Parser$many,
        'Unit.new': Unit$new,
        'String.cons': String$cons,
        'String.concat': String$concat,
        'Cmp.as_eql': Cmp$as_eql,
        'Cmp.ltn': Cmp$ltn,
        'Cmp.gtn': Cmp$gtn,
        'Word.cmp.go': Word$cmp$go,
        'Cmp.eql': Cmp$eql,
        'Word.cmp': Word$cmp,
        'Word.eql': Word$eql,
        'Nat.succ': Nat$succ,
        'Nat.zero': Nat$zero,
        'U16.eql': U16$eql,
        'String.nil': String$nil,
        'Parser.text.go': Parser$text$go,
        'Parser.text': Parser$text,
        'Parser.eof': Parser$eof,
        'List.reverse.go': List$reverse$go,
        'List.reverse': List$reverse,
        'Parser.until.go': Parser$until$go,
        'Parser.until': Parser$until,
        'Parser.one': Parser$one,
        'Kindelia.parse.ignore': Kindelia$parse$ignore,
        'Kindelia.parse.text': Kindelia$parse$text,
        'Parser.letter': Parser$letter,
        'Bool.and': Bool$and,
        'Cmp.as_lte': Cmp$as_lte,
        'Word.lte': Word$lte,
        'U16.lte': U16$lte,
        'U16.btw': U16$btw,
        'Kindelia.parse.letter': Kindelia$parse$letter,
        'List.fold': List$fold,
        'Kindelia.parse.name': Kindelia$parse$name,
        'Parser.wrap': Parser$wrap,
        'Pair': Pair,
        'Parser.maybe': Parser$maybe,
        'Kindelia.Type.word': Kindelia$Type$word,
        'Kindelia.Type.data': Kindelia$Type$data,
        'Kindelia.parse.type': Kindelia$parse$type,
        'Pair.new': Pair$new,
        'Kindelia.parse.ann': Kindelia$parse$ann,
        'Kindelia.Constructor.new': Kindelia$Constructor$new,
        'Kindelia.parse.constructor': Kindelia$parse$constructor,
        'Kindelia.Data.new': Kindelia$Data$new,
        'Kindelia.parse.data': Kindelia$parse$data,
        'Kindelia.Transaction.new_data': Kindelia$Transaction$new_data,
        'Kindelia.Term.let': Kindelia$Term$let,
        'Kindelia.parse.term.let': Kindelia$parse$term$let,
        'Maybe.bind': Maybe$bind,
        'Maybe.monad': Maybe$monad,
        'BBT.lookup': BBT$lookup,
        'Cmp.as_ltn': Cmp$as_ltn,
        'Word.ltn': Word$ltn,
        'U16.ltn': U16$ltn,
        'U16.cmp': U16$cmp,
        'String.cmp': String$cmp,
        'Map.get': Map$get,
        'BBT': BBT,
        'Map': Map,
        'Kindelia.get_data': Kindelia$get_data,
        'Parser.fail': Parser$fail,
        'List.find': List$find,
        'String.eql': String$eql,
        'Kindelia.parse.term.create.fields': Kindelia$parse$term$create$fields,
        'List.mapped': List$mapped,
        'Pair.fst': Pair$fst,
        'Maybe.default': Maybe$default,
        'List.find_index.go': List$find_index$go,
        'List.find_index': List$find_index,
        'Kindelia.Term.create': Kindelia$Term$create,
        'Kindelia.parse.term.create': Kindelia$parse$term$create,
        'Kindelia.parse.term.match.cases': Kindelia$parse$term$match$cases,
        'Kindelia.Term.match': Kindelia$Term$match,
        'Kindelia.parse.term.match': Kindelia$parse$term$match,
        'Parser.many1': Parser$many1,
        'Parser.digit': Parser$digit,
        'Nat.add': Nat$add,
        'Nat.mul': Nat$mul,
        'Nat.from_base.go': Nat$from_base$go,
        'Nat.from_base': Nat$from_base,
        'Parser.nat': Parser$nat,
        'Nat.gte': Nat$gte,
        'Nat.pow': Nat$pow,
        'Kindelia.Term.word': Kindelia$Term$word,
        'U64.new': U64$new,
        'Nat.apply': Nat$apply,
        'Word': Word,
        'Word.e': Word$e,
        'Word.i': Word$i,
        'Word.o': Word$o,
        'Word.inc': Word$inc,
        'Word.zero': Word$zero,
        'Nat.to_word': Nat$to_word,
        'Nat.to_u64': Nat$to_u64,
        'Kindelia.parse.term.word': Kindelia$parse$term$word,
        'Kindelia.Term.compare': Kindelia$Term$compare,
        'Kindelia.parse.term.compare': Kindelia$parse$term$compare,
        'Kindelia.Operation.add': Kindelia$Operation$add,
        'Kindelia.Operation.sub': Kindelia$Operation$sub,
        'Kindelia.Operation.mul': Kindelia$Operation$mul,
        'Kindelia.Operation.div': Kindelia$Operation$div,
        'Kindelia.Operation.mod': Kindelia$Operation$mod,
        'Kindelia.Operation.or': Kindelia$Operation$or,
        'Kindelia.Operation.and': Kindelia$Operation$and,
        'Kindelia.Operation.xor': Kindelia$Operation$xor,
        'Kindelia.parse.term.operation': Kindelia$parse$term$operation,
        'Kindelia.Term.operate': Kindelia$Term$operate,
        'Kindelia.parse.term.operate': Kindelia$parse$term$operate,
        'Kindelia.Term.bind': Kindelia$Term$bind,
        'Kindelia.parse.term.bind': Kindelia$parse$term$bind,
        'Kindelia.Term.call': Kindelia$Term$call,
        'Kindelia.parse.term.call': Kindelia$parse$term$call,
        'Kindelia.Term.var': Kindelia$Term$var,
        'Kindelia.parse.term.var': Kindelia$parse$term$var,
        'Kindelia.parse.term': Kindelia$parse$term,
        'Kindelia.Bond.new': Kindelia$Bond$new,
        'Kindelia.parse.bond': Kindelia$parse$bond,
        'Kindelia.Transaction.new_bond': Kindelia$Transaction$new_bond,
        'Kindelia.Eval.new': Kindelia$Eval$new,
        'Kindelia.parse.eval': Kindelia$parse$eval,
        'Kindelia.Transaction.new_eval': Kindelia$Transaction$new_eval,
        'Kindelia.Transaction.new_name': Kindelia$Transaction$new_name,
        'Kindelia.parse.transaction': Kindelia$parse$transaction,
        'Kindelia.World.new': Kindelia$World$new,
        'BBT.bin': BBT$bin,
        'U32.new': U32$new,
        'Nat.to_u32': Nat$to_u32,
        'BBT.tip': BBT$tip,
        'BBT.singleton': BBT$singleton,
        'BBT.size': BBT$size,
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
        'U32.ltn': U32$ltn,
        'U32.from_nat': U32$from_nat,
        'BBT.node': BBT$node,
        'Cmp.as_gtn': Cmp$as_gtn,
        'Word.gtn': Word$gtn,
        'U32.gtn': U32$gtn,
        'BBT.balance': BBT$balance,
        'BBT.insert': BBT$insert,
        'Map.set': Map$set,
        'Kindelia.Entry.bond': Kindelia$Entry$bond,
        'Kindelia.parse.block': Kindelia$parse$block,
        'IO': IO,
        'Nat.ltn': Nat$ltn,
        'String.length.go': String$length$go,
        'String.length': String$length,
        'String.flatten.go': String$flatten$go,
        'String.flatten': String$flatten,
        'String.join.go': String$join$go,
        'String.join': String$join,
        'Kind.Code.highlight.end': Kind$Code$highlight$end,
        'Maybe.extract': Maybe$extract,
        'Nat.is_zero': Nat$is_zero,
        'Nat.double': Nat$double,
        'Nat.pred': Nat$pred,
        'String.reverse.go': String$reverse$go,
        'String.reverse': String$reverse,
        'String.pad_right': String$pad_right,
        'String.pad_left': String$pad_left,
        'Nat.lte': Nat$lte,
        'Nat.sub': Nat$sub,
        'Nat.div_mod.go': Nat$div_mod$go,
        'Nat.div_mod': Nat$div_mod,
        'Nat.to_base.go': Nat$to_base$go,
        'Nat.to_base': Nat$to_base,
        'Pair.snd': Pair$snd,
        'Nat.mod': Nat$mod,
        'List.at': List$at,
        'Nat.show_digit': Nat$show_digit,
        'Nat.to_string_base': Nat$to_string_base,
        'Nat.show': Nat$show,
        'Bool.not': Bool$not,
        'U16.new': U16$new,
        'Nat.to_u16': Nat$to_u16,
        'Kind.Code.color': Kind$Code$color,
        'Nat.eql': Nat$eql,
        'List.take': List$take,
        'Kind.Code.highlight.go': Kind$Code$highlight$go,
        'Kind.Code.highlight': Kind$Code$highlight,
        'IO.ask': IO$ask,
        'IO.bind': IO$bind,
        'IO.end': IO$end,
        'IO.monad': IO$monad,
        'IO.put_string': IO$put_string,
        'IO.print': IO$print,
        'Bits.e': Bits$e,
        'Bits.o': Bits$o,
        'Word.subber': Word$subber,
        'Word.sub': Word$sub,
        'U16.sub': U16$sub,
        'U16.add': U16$add,
        'Nat.div': Nat$div,
        'Bits.i': Bits$i,
        'Kindelia.serialize.fixlen': Kindelia$serialize$fixlen,
        'Word.fold': Word$fold,
        'Word.to_nat': Word$to_nat,
        'U16.to_nat': U16$to_nat,
        'Bits.concat': Bits$concat,
        'Kindelia.serialize.name': Kindelia$serialize$name,
        'Kindelia.serialize.list': Kindelia$serialize$list,
        'Kindelia.serialize.pair': Kindelia$serialize$pair,
        'Kindelia.serialize.type': Kindelia$serialize$type,
        'Kindelia.serialize.constructor': Kindelia$serialize$constructor,
        'Kindelia.serialize.data': Kindelia$serialize$data,
        'Kindelia.serialize.varlen.go': Kindelia$serialize$varlen$go,
        'Kindelia.serialize.varlen': Kindelia$serialize$varlen,
        'Kindelia.serialize.name.local': Kindelia$serialize$name$local,
        'List.map': List$map,
        'List.concat': List$concat,
        'Kindelia.serialize.cases': Kindelia$serialize$cases,
        'Kindelia.get_constructors': Kindelia$get_constructors,
        'U64.to_nat': U64$to_nat,
        'Kindelia.serialize.term': Kindelia$serialize$term,
        'Kindelia.serialize.bond': Kindelia$serialize$bond,
        'Kindelia.serialize.eval': Kindelia$serialize$eval,
        'Kindelia.serialize.transaction': Kindelia$serialize$transaction,
        'Kindelia.serialize.block': Kindelia$serialize$block,
        'Bits.is_empty': Bits$is_empty,
        'Kindelia.deserialize.fixlen': Kindelia$deserialize$fixlen,
        'U16.from_nat': U16$from_nat,
        'Kindelia.deserialize.name': Kindelia$deserialize$name,
        'Kindelia.deserialize.list': Kindelia$deserialize$list,
        'Kindelia.deserialize.pair': Kindelia$deserialize$pair,
        'Kindelia.deserialize.type': Kindelia$deserialize$type,
        'Kindelia.deserialize.constructor': Kindelia$deserialize$constructor,
        'Kindelia.deserialize.data': Kindelia$deserialize$data,
        'U64.from_nat': U64$from_nat,
        'Kindelia.deserialize.varlen.go': Kindelia$deserialize$varlen$go,
        'Kindelia.deserialize.varlen': Kindelia$deserialize$varlen,
        'List.get': List$get,
        'Kindelia.deserialize.name.local': Kindelia$deserialize$name$local,
        'Kindelia.deserialize.cases': Kindelia$deserialize$cases,
        'Kindelia.deserialize.term': Kindelia$deserialize$term,
        'Kindelia.deserialize.bond': Kindelia$deserialize$bond,
        'Kindelia.deserialize.eval': Kindelia$deserialize$eval,
        'Kindelia.deserialize.transaction': Kindelia$deserialize$transaction,
        'Kindelia.deserialize.block': Kindelia$deserialize$block,
        'Bits.hex.encode': Bits$hex$encode,
        'Bits.eql': Bits$eql,
        'Kindelia.Entry.data': Kindelia$Entry$data,
        'List.unzip': List$unzip,
        'Kindelia.extend': Kindelia$extend,
        'BBT.from_list.go': BBT$from_list$go,
        'BBT.from_list': BBT$from_list,
        'Map.from_list': Map$from_list,
        'List.zip': List$zip,
        'Kindelia.equal': Kindelia$equal,
        'Kindelia.get_bond': Kindelia$get_bond,
        'List.all': List$all,
        'List.length': List$length,
        'List.zip_with': List$zip_with,
        'List.zipped_with': List$zipped_with,
        'List.and': List$and,
        'List.is_empty': List$is_empty,
        'Kindelia.check': Kindelia$check,
        'Kindelia.sanitize.many': Kindelia$sanitize$many,
        'Triple.new': Triple$new,
        'Kindelia.rename': Kindelia$rename,
        'List.for': List$for,
        'Kindelia.sanitize.cases': Kindelia$sanitize$cases,
        'Kindelia.sanitize': Kindelia$sanitize,
        'Kindelia.Runtime': Kindelia$Runtime,
        'Kindelia.Runtime.new': Kindelia$Runtime$new,
        'List.imapped': List$imapped,
        'Kindelia.cost.subs': Kindelia$cost$subs,
        'Kindelia.cost.alloc': Kindelia$cost$alloc,
        'Kindelia.cost.copy': Kindelia$cost$copy,
        'Triple': Triple,
        'Kindelia.rename.many': Kindelia$rename$many,
        'Kindelia.cost.create': Kindelia$cost$create,
        'Kindelia.cost.let': Kindelia$cost$let,
        'Kindelia.cost.match': Kindelia$cost$match,
        'U64.ltn': U64$ltn,
        'U64.eql': U64$eql,
        'U64.cmp': U64$cmp,
        'Kindelia.cost.compare': Kindelia$cost$compare,
        'U64.add': U64$add,
        'U64.sub': U64$sub,
        'U64.mul': U64$mul,
        'Word.bit_length.go': Word$bit_length$go,
        'Word.bit_length': Word$bit_length,
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
        'Kindelia.cost.operate': Kindelia$cost$operate,
        'Kindelia.cost.bind': Kindelia$cost$bind,
        'Kindelia.reduce': Kindelia$reduce,
        'Kindelia.normalize.many': Kindelia$normalize$many,
        'Kindelia.normalize.cases': Kindelia$normalize$cases,
        'Kindelia.normalize': Kindelia$normalize,
        'Kindelia.show.type': Kindelia$show$type,
        'Word.show': Word$show,
        'U64.show': U64$show,
        'Kindelia.show.term': Kindelia$show$term,
        'Kindelia.transact': Kindelia$transact,
        'Kindelia.api.run.go.transactions': Kindelia$api$run$go$transactions,
        'Kindelia.api.run.go': Kindelia$api$run$go,
        'Kindelia.genesis': Kindelia$genesis,
        'Kindelia.api.run': Kindelia$api$run,
        'Kindelia': Kindelia,
    };
})();
module.exports['$main$']();