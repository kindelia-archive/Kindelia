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

    function Kindelia$Data$new$(_name$1, _ctrs$2) {
        var $462 = ({
            _: 'Kindelia.Data.new',
            'name': _name$1,
            'ctrs': _ctrs$2
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
                                                                                                var $885 = self.ctrs;
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
                                                                                                                                                                                                            var $942 = self.ctrs;
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

    function Kindelia$parse$term$match$cases$(_world$1, _ctrs$2) {
        var self = _ctrs$2;
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
                                                                                                                        var $1101 = self.ctrs;
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
                var _reply$7 = Kindelia$parse$text$("#add", _pst$1);
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
                var _reply$7 = Kindelia$parse$text$("#sub", _pst$1);
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
                var _reply$7 = Kindelia$parse$text$("#mul", _pst$1);
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
                var _reply$7 = Kindelia$parse$text$("#div", _pst$1);
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
                var _reply$7 = Kindelia$parse$text$("#mod", _pst$1);
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
                var _reply$7 = Kindelia$parse$text$("#or", _pst$1);
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
                var _reply$7 = Kindelia$parse$text$("#and", _pst$1);
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
                var _reply$7 = Kindelia$parse$text$("#xor", _pst$1);
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

    function Kindelia$Auth$new$(_bond$1, _args$2) {
        var $1998 = ({
            _: 'Kindelia.Auth.new',
            'bond': _bond$1,
            'args': _args$2
        });
        return $1998;
    };
    const Kindelia$Auth$new = x0 => x1 => Kindelia$Auth$new$(x0, x1);

    function Kindelia$Eval$new$(_auth$1, _term$2, _type$3) {
        var $1999 = ({
            _: 'Kindelia.Eval.new',
            'auth': _auth$1,
            'term': _term$2,
            'type': _type$3
        });
        return $1999;
    };
    const Kindelia$Eval$new = x0 => x1 => x2 => Kindelia$Eval$new$(x0, x1, x2);

    function Kindelia$parse$eval$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $2001 = self.err;
                var _reply$8 = Kindelia$parse$text$("eval", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2003 = self.err;
                        var self = $2001;
                        switch (self._) {
                            case 'Maybe.some':
                                var $2005 = self.value;
                                var $2006 = Parser$Reply$error$(Parser$Error$combine$($2005, $2003));
                                var $2004 = $2006;
                                break;
                            case 'Maybe.none':
                                var $2007 = Parser$Reply$error$($2003);
                                var $2004 = $2007;
                                break;
                        };
                        var $2002 = $2004;
                        break;
                    case 'Parser.Reply.value':
                        var $2008 = self.pst;
                        var self = $2008;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $2010 = self.err;
                                var $2011 = self.nam;
                                var $2012 = self.ini;
                                var $2013 = self.idx;
                                var $2014 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2001, $2010), $2011, $2012, $2013, $2014);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $2016 = self.err;
                                        var _reply$22 = Parser$maybe$((_pst$22 => {
                                            var self = _pst$22;
                                            switch (self._) {
                                                case 'Parser.State.new':
                                                    var $2019 = self.err;
                                                    var _reply$28 = Kindelia$parse$term$call$(_world$1, _pst$22);
                                                    var self = _reply$28;
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $2021 = self.err;
                                                            var self = $2019;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $2023 = self.value;
                                                                    var $2024 = Parser$Reply$error$(Parser$Error$combine$($2023, $2021));
                                                                    var $2022 = $2024;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $2025 = Parser$Reply$error$($2021);
                                                                    var $2022 = $2025;
                                                                    break;
                                                            };
                                                            var $2020 = $2022;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $2026 = self.pst;
                                                            var $2027 = self.val;
                                                            var self = $2026;
                                                            switch (self._) {
                                                                case 'Parser.State.new':
                                                                    var $2029 = self.err;
                                                                    var $2030 = self.nam;
                                                                    var $2031 = self.ini;
                                                                    var $2032 = self.idx;
                                                                    var $2033 = self.str;
                                                                    var _reply$pst$36 = Parser$State$new$(Parser$Error$maybe_combine$($2019, $2029), $2030, $2031, $2032, $2033);
                                                                    var $2034 = Parser$Reply$value$(_reply$pst$36, (() => {
                                                                        var self = $2027;
                                                                        switch (self._) {
                                                                            case 'Kindelia.Term.call':
                                                                                var $2035 = self.bond;
                                                                                var $2036 = self.args;
                                                                                var $2037 = Maybe$some$(Kindelia$Auth$new$($2035, $2036));
                                                                                return $2037;
                                                                            case 'Kindelia.Term.var':
                                                                            case 'Kindelia.Term.let':
                                                                            case 'Kindelia.Term.create':
                                                                            case 'Kindelia.Term.match':
                                                                            case 'Kindelia.Term.word':
                                                                            case 'Kindelia.Term.compare':
                                                                            case 'Kindelia.Term.operate':
                                                                            case 'Kindelia.Term.bind':
                                                                                var $2038 = Maybe$none;
                                                                                return $2038;
                                                                        };
                                                                    })());
                                                                    var $2028 = $2034;
                                                                    break;
                                                            };
                                                            var $2020 = $2028;
                                                            break;
                                                    };
                                                    var $2018 = $2020;
                                                    break;
                                            };
                                            return $2018;
                                        }), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2039 = self.err;
                                                var self = $2016;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $2041 = self.value;
                                                        var $2042 = Parser$Reply$error$(Parser$Error$combine$($2041, $2039));
                                                        var $2040 = $2042;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $2043 = Parser$Reply$error$($2039);
                                                        var $2040 = $2043;
                                                        break;
                                                };
                                                var $2017 = $2040;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2044 = self.pst;
                                                var $2045 = self.val;
                                                var self = $2044;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $2047 = self.err;
                                                        var $2048 = self.nam;
                                                        var $2049 = self.ini;
                                                        var $2050 = self.idx;
                                                        var $2051 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2016, $2047), $2048, $2049, $2050, $2051);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $2053 = self.err;
                                                                var _reply$36 = Kindelia$parse$text$("{", _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $2055 = self.err;
                                                                        var self = $2053;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $2057 = self.value;
                                                                                var $2058 = Parser$Reply$error$(Parser$Error$combine$($2057, $2055));
                                                                                var $2056 = $2058;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $2059 = Parser$Reply$error$($2055);
                                                                                var $2056 = $2059;
                                                                                break;
                                                                        };
                                                                        var $2054 = $2056;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $2060 = self.pst;
                                                                        var self = $2060;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $2062 = self.err;
                                                                                var $2063 = self.nam;
                                                                                var $2064 = self.ini;
                                                                                var $2065 = self.idx;
                                                                                var $2066 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($2053, $2062), $2063, $2064, $2065, $2066);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $2068 = self.err;
                                                                                        var _reply$50 = Kindelia$parse$term$(_world$1)(_reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $2070 = self.err;
                                                                                                var self = $2068;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $2072 = self.value;
                                                                                                        var $2073 = Parser$Reply$error$(Parser$Error$combine$($2072, $2070));
                                                                                                        var $2071 = $2073;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $2074 = Parser$Reply$error$($2070);
                                                                                                        var $2071 = $2074;
                                                                                                        break;
                                                                                                };
                                                                                                var $2069 = $2071;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $2075 = self.pst;
                                                                                                var $2076 = self.val;
                                                                                                var self = $2075;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $2078 = self.err;
                                                                                                        var $2079 = self.nam;
                                                                                                        var $2080 = self.ini;
                                                                                                        var $2081 = self.idx;
                                                                                                        var $2082 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($2068, $2078), $2079, $2080, $2081, $2082);
                                                                                                        var self = _reply$pst$58;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $2084 = self.err;
                                                                                                                var _reply$64 = Kindelia$parse$text$("}", _reply$pst$58);
                                                                                                                var self = _reply$64;
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $2086 = self.err;
                                                                                                                        var self = $2084;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Maybe.some':
                                                                                                                                var $2088 = self.value;
                                                                                                                                var $2089 = Parser$Reply$error$(Parser$Error$combine$($2088, $2086));
                                                                                                                                var $2087 = $2089;
                                                                                                                                break;
                                                                                                                            case 'Maybe.none':
                                                                                                                                var $2090 = Parser$Reply$error$($2086);
                                                                                                                                var $2087 = $2090;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $2085 = $2087;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $2091 = self.pst;
                                                                                                                        var self = $2091;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $2093 = self.err;
                                                                                                                                var $2094 = self.nam;
                                                                                                                                var $2095 = self.ini;
                                                                                                                                var $2096 = self.idx;
                                                                                                                                var $2097 = self.str;
                                                                                                                                var _reply$pst$72 = Parser$State$new$(Parser$Error$maybe_combine$($2084, $2093), $2094, $2095, $2096, $2097);
                                                                                                                                var self = _reply$pst$72;
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.State.new':
                                                                                                                                        var $2099 = self.err;
                                                                                                                                        var _reply$78 = Kindelia$parse$text$(":", _reply$pst$72);
                                                                                                                                        var self = _reply$78;
                                                                                                                                        switch (self._) {
                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                var $2101 = self.err;
                                                                                                                                                var self = $2099;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                        var $2103 = self.value;
                                                                                                                                                        var $2104 = Parser$Reply$error$(Parser$Error$combine$($2103, $2101));
                                                                                                                                                        var $2102 = $2104;
                                                                                                                                                        break;
                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                        var $2105 = Parser$Reply$error$($2101);
                                                                                                                                                        var $2102 = $2105;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $2100 = $2102;
                                                                                                                                                break;
                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                var $2106 = self.pst;
                                                                                                                                                var self = $2106;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                        var $2108 = self.err;
                                                                                                                                                        var $2109 = self.nam;
                                                                                                                                                        var $2110 = self.ini;
                                                                                                                                                        var $2111 = self.idx;
                                                                                                                                                        var $2112 = self.str;
                                                                                                                                                        var _reply$pst$86 = Parser$State$new$(Parser$Error$maybe_combine$($2099, $2108), $2109, $2110, $2111, $2112);
                                                                                                                                                        var self = _reply$pst$86;
                                                                                                                                                        switch (self._) {
                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                var $2114 = self.err;
                                                                                                                                                                var _reply$92 = Kindelia$parse$type$(_world$1)(_reply$pst$86);
                                                                                                                                                                var self = _reply$92;
                                                                                                                                                                switch (self._) {
                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                        var $2116 = self.err;
                                                                                                                                                                        var self = $2114;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                var $2118 = self.value;
                                                                                                                                                                                var $2119 = Parser$Reply$error$(Parser$Error$combine$($2118, $2116));
                                                                                                                                                                                var $2117 = $2119;
                                                                                                                                                                                break;
                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                var $2120 = Parser$Reply$error$($2116);
                                                                                                                                                                                var $2117 = $2120;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $2115 = $2117;
                                                                                                                                                                        break;
                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                        var $2121 = self.pst;
                                                                                                                                                                        var $2122 = self.val;
                                                                                                                                                                        var self = $2121;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                var $2124 = self.err;
                                                                                                                                                                                var $2125 = self.nam;
                                                                                                                                                                                var $2126 = self.ini;
                                                                                                                                                                                var $2127 = self.idx;
                                                                                                                                                                                var $2128 = self.str;
                                                                                                                                                                                var _reply$pst$100 = Parser$State$new$(Parser$Error$maybe_combine$($2114, $2124), $2125, $2126, $2127, $2128);
                                                                                                                                                                                var self = $2045;
                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                                                        var $2130 = self.value;
                                                                                                                                                                                        var self = $2130;
                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                                var $2132 = self.value;
                                                                                                                                                                                                var $2133 = Maybe$some$($2132);
                                                                                                                                                                                                var $2131 = $2133;
                                                                                                                                                                                                break;
                                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                                var $2134 = Maybe$none;
                                                                                                                                                                                                var $2131 = $2134;
                                                                                                                                                                                                break;
                                                                                                                                                                                        };
                                                                                                                                                                                        var _auth$101 = $2131;
                                                                                                                                                                                        break;
                                                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                                                        var $2135 = Maybe$none;
                                                                                                                                                                                        var _auth$101 = $2135;
                                                                                                                                                                                        break;
                                                                                                                                                                                };
                                                                                                                                                                                var $2129 = Parser$Reply$value$(_reply$pst$100, Kindelia$Eval$new$(_auth$101, $2076, $2122));
                                                                                                                                                                                var $2123 = $2129;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $2115 = $2123;
                                                                                                                                                                        break;
                                                                                                                                                                };
                                                                                                                                                                var $2113 = $2115;
                                                                                                                                                                break;
                                                                                                                                                        };
                                                                                                                                                        var $2107 = $2113;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $2100 = $2107;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $2098 = $2100;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $2092 = $2098;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $2085 = $2092;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $2083 = $2085;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $2077 = $2083;
                                                                                                        break;
                                                                                                };
                                                                                                var $2069 = $2077;
                                                                                                break;
                                                                                        };
                                                                                        var $2067 = $2069;
                                                                                        break;
                                                                                };
                                                                                var $2061 = $2067;
                                                                                break;
                                                                        };
                                                                        var $2054 = $2061;
                                                                        break;
                                                                };
                                                                var $2052 = $2054;
                                                                break;
                                                        };
                                                        var $2046 = $2052;
                                                        break;
                                                };
                                                var $2017 = $2046;
                                                break;
                                        };
                                        var $2015 = $2017;
                                        break;
                                };
                                var $2009 = $2015;
                                break;
                        };
                        var $2002 = $2009;
                        break;
                };
                var $2000 = $2002;
                break;
        };
        return $2000;
    };
    const Kindelia$parse$eval = x0 => x1 => Kindelia$parse$eval$(x0, x1);

    function Kindelia$Transaction$new_eval$(_eval$1) {
        var $2136 = ({
            _: 'Kindelia.Transaction.new_eval',
            'eval': _eval$1
        });
        return $2136;
    };
    const Kindelia$Transaction$new_eval = x0 => Kindelia$Transaction$new_eval$(x0);

    function Kindelia$Transaction$new_name$(_name$1) {
        var $2137 = ({
            _: 'Kindelia.Transaction.new_name',
            'name': _name$1
        });
        return $2137;
    };
    const Kindelia$Transaction$new_name = x0 => Kindelia$Transaction$new_name$(x0);

    function Kindelia$parse$transaction$(_world$1) {
        var $2138 = Parser$choice(List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2140 = self.err;
                    var _reply$8 = Kindelia$parse$data$(_world$1, _pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2142 = self.err;
                            var self = $2140;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2144 = self.value;
                                    var $2145 = Parser$Reply$error$(Parser$Error$combine$($2144, $2142));
                                    var $2143 = $2145;
                                    break;
                                case 'Maybe.none':
                                    var $2146 = Parser$Reply$error$($2142);
                                    var $2143 = $2146;
                                    break;
                            };
                            var $2141 = $2143;
                            break;
                        case 'Parser.Reply.value':
                            var $2147 = self.pst;
                            var $2148 = self.val;
                            var self = $2147;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2150 = self.err;
                                    var $2151 = self.nam;
                                    var $2152 = self.ini;
                                    var $2153 = self.idx;
                                    var $2154 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2140, $2150), $2151, $2152, $2153, $2154);
                                    var $2155 = Parser$Reply$value$(_reply$pst$16, Kindelia$Transaction$new_data$($2148));
                                    var $2149 = $2155;
                                    break;
                            };
                            var $2141 = $2149;
                            break;
                    };
                    var $2139 = $2141;
                    break;
            };
            return $2139;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2157 = self.err;
                    var _reply$8 = Kindelia$parse$bond$(_world$1, _pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2159 = self.err;
                            var self = $2157;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2161 = self.value;
                                    var $2162 = Parser$Reply$error$(Parser$Error$combine$($2161, $2159));
                                    var $2160 = $2162;
                                    break;
                                case 'Maybe.none':
                                    var $2163 = Parser$Reply$error$($2159);
                                    var $2160 = $2163;
                                    break;
                            };
                            var $2158 = $2160;
                            break;
                        case 'Parser.Reply.value':
                            var $2164 = self.pst;
                            var $2165 = self.val;
                            var self = $2164;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2167 = self.err;
                                    var $2168 = self.nam;
                                    var $2169 = self.ini;
                                    var $2170 = self.idx;
                                    var $2171 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2157, $2167), $2168, $2169, $2170, $2171);
                                    var $2172 = Parser$Reply$value$(_reply$pst$16, Kindelia$Transaction$new_bond$($2165));
                                    var $2166 = $2172;
                                    break;
                            };
                            var $2158 = $2166;
                            break;
                    };
                    var $2156 = $2158;
                    break;
            };
            return $2156;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2174 = self.err;
                    var _reply$8 = Kindelia$parse$eval$(_world$1, _pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2176 = self.err;
                            var self = $2174;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2178 = self.value;
                                    var $2179 = Parser$Reply$error$(Parser$Error$combine$($2178, $2176));
                                    var $2177 = $2179;
                                    break;
                                case 'Maybe.none':
                                    var $2180 = Parser$Reply$error$($2176);
                                    var $2177 = $2180;
                                    break;
                            };
                            var $2175 = $2177;
                            break;
                        case 'Parser.Reply.value':
                            var $2181 = self.pst;
                            var $2182 = self.val;
                            var self = $2181;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2184 = self.err;
                                    var $2185 = self.nam;
                                    var $2186 = self.ini;
                                    var $2187 = self.idx;
                                    var $2188 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2174, $2184), $2185, $2186, $2187, $2188);
                                    var $2189 = Parser$Reply$value$(_reply$pst$16, Kindelia$Transaction$new_eval$($2182));
                                    var $2183 = $2189;
                                    break;
                            };
                            var $2175 = $2183;
                            break;
                    };
                    var $2173 = $2175;
                    break;
            };
            return $2173;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2191 = self.err;
                    var _reply$8 = Kindelia$parse$text$("name ", _pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2193 = self.err;
                            var self = $2191;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2195 = self.value;
                                    var $2196 = Parser$Reply$error$(Parser$Error$combine$($2195, $2193));
                                    var $2194 = $2196;
                                    break;
                                case 'Maybe.none':
                                    var $2197 = Parser$Reply$error$($2193);
                                    var $2194 = $2197;
                                    break;
                            };
                            var $2192 = $2194;
                            break;
                        case 'Parser.Reply.value':
                            var $2198 = self.pst;
                            var self = $2198;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2200 = self.err;
                                    var $2201 = self.nam;
                                    var $2202 = self.ini;
                                    var $2203 = self.idx;
                                    var $2204 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2191, $2200), $2201, $2202, $2203, $2204);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $2206 = self.err;
                                            var _reply$22 = Kindelia$parse$name$(_reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2208 = self.err;
                                                    var self = $2206;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $2210 = self.value;
                                                            var $2211 = Parser$Reply$error$(Parser$Error$combine$($2210, $2208));
                                                            var $2209 = $2211;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $2212 = Parser$Reply$error$($2208);
                                                            var $2209 = $2212;
                                                            break;
                                                    };
                                                    var $2207 = $2209;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2213 = self.pst;
                                                    var $2214 = self.val;
                                                    var self = $2213;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $2216 = self.err;
                                                            var $2217 = self.nam;
                                                            var $2218 = self.ini;
                                                            var $2219 = self.idx;
                                                            var $2220 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2206, $2216), $2217, $2218, $2219, $2220);
                                                            var $2221 = Parser$Reply$value$(_reply$pst$30, Kindelia$Transaction$new_name$($2214));
                                                            var $2215 = $2221;
                                                            break;
                                                    };
                                                    var $2207 = $2215;
                                                    break;
                                            };
                                            var $2205 = $2207;
                                            break;
                                    };
                                    var $2199 = $2205;
                                    break;
                            };
                            var $2192 = $2199;
                            break;
                    };
                    var $2190 = $2192;
                    break;
            };
            return $2190;
        }), List$nil)))));
        return $2138;
    };
    const Kindelia$parse$transaction = x0 => Kindelia$parse$transaction$(x0);

    function Kindelia$World$new$(_names$1, _entry$2) {
        var $2222 = ({
            _: 'Kindelia.World.new',
            'names': _names$1,
            'entry': _entry$2
        });
        return $2222;
    };
    const Kindelia$World$new = x0 => x1 => Kindelia$World$new$(x0, x1);

    function BBT$bin$(_size$3, _key$4, _val$5, _left$6, _right$7) {
        var $2223 = ({
            _: 'BBT.bin',
            'size': _size$3,
            'key': _key$4,
            'val': _val$5,
            'left': _left$6,
            'right': _right$7
        });
        return $2223;
    };
    const BBT$bin = x0 => x1 => x2 => x3 => x4 => BBT$bin$(x0, x1, x2, x3, x4);

    function U32$new$(_value$1) {
        var $2224 = word_to_u32(_value$1);
        return $2224;
    };
    const U32$new = x0 => U32$new$(x0);
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);
    const BBT$tip = ({
        _: 'BBT.tip'
    });

    function BBT$singleton$(_key$3, _val$4) {
        var $2225 = BBT$bin$(1, _key$3, _val$4, BBT$tip, BBT$tip);
        return $2225;
    };
    const BBT$singleton = x0 => x1 => BBT$singleton$(x0, x1);

    function BBT$size$(_map$3) {
        var self = _map$3;
        switch (self._) {
            case 'BBT.bin':
                var $2227 = self.size;
                var $2228 = $2227;
                var $2226 = $2228;
                break;
            case 'BBT.tip':
                var $2229 = 0;
                var $2226 = $2229;
                break;
        };
        return $2226;
    };
    const BBT$size = x0 => BBT$size$(x0);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $2231 = self.pred;
                var $2232 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $2234 = self.pred;
                            var $2235 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2237 = Word$i$(Word$adder$(_a$pred$10, $2234, Bool$false));
                                    var $2236 = $2237;
                                } else {
                                    var $2238 = Word$o$(Word$adder$(_a$pred$10, $2234, Bool$false));
                                    var $2236 = $2238;
                                };
                                return $2236;
                            });
                            var $2233 = $2235;
                            break;
                        case 'Word.i':
                            var $2239 = self.pred;
                            var $2240 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2242 = Word$o$(Word$adder$(_a$pred$10, $2239, Bool$true));
                                    var $2241 = $2242;
                                } else {
                                    var $2243 = Word$i$(Word$adder$(_a$pred$10, $2239, Bool$false));
                                    var $2241 = $2243;
                                };
                                return $2241;
                            });
                            var $2233 = $2240;
                            break;
                        case 'Word.e':
                            var $2244 = (_a$pred$8 => {
                                var $2245 = Word$e;
                                return $2245;
                            });
                            var $2233 = $2244;
                            break;
                    };
                    var $2233 = $2233($2231);
                    return $2233;
                });
                var $2230 = $2232;
                break;
            case 'Word.i':
                var $2246 = self.pred;
                var $2247 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $2249 = self.pred;
                            var $2250 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2252 = Word$o$(Word$adder$(_a$pred$10, $2249, Bool$true));
                                    var $2251 = $2252;
                                } else {
                                    var $2253 = Word$i$(Word$adder$(_a$pred$10, $2249, Bool$false));
                                    var $2251 = $2253;
                                };
                                return $2251;
                            });
                            var $2248 = $2250;
                            break;
                        case 'Word.i':
                            var $2254 = self.pred;
                            var $2255 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2257 = Word$i$(Word$adder$(_a$pred$10, $2254, Bool$true));
                                    var $2256 = $2257;
                                } else {
                                    var $2258 = Word$o$(Word$adder$(_a$pred$10, $2254, Bool$true));
                                    var $2256 = $2258;
                                };
                                return $2256;
                            });
                            var $2248 = $2255;
                            break;
                        case 'Word.e':
                            var $2259 = (_a$pred$8 => {
                                var $2260 = Word$e;
                                return $2260;
                            });
                            var $2248 = $2259;
                            break;
                    };
                    var $2248 = $2248($2246);
                    return $2248;
                });
                var $2230 = $2247;
                break;
            case 'Word.e':
                var $2261 = (_b$5 => {
                    var $2262 = Word$e;
                    return $2262;
                });
                var $2230 = $2261;
                break;
        };
        var $2230 = $2230(_b$3);
        return $2230;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $2263 = Word$adder$(_a$2, _b$3, Bool$false);
        return $2263;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);

    function Word$shift_left$one$go$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $2265 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $2267 = Word$i$(Word$shift_left$one$go$($2265, Bool$false));
                    var $2266 = $2267;
                } else {
                    var $2268 = Word$o$(Word$shift_left$one$go$($2265, Bool$false));
                    var $2266 = $2268;
                };
                var $2264 = $2266;
                break;
            case 'Word.i':
                var $2269 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $2271 = Word$i$(Word$shift_left$one$go$($2269, Bool$true));
                    var $2270 = $2271;
                } else {
                    var $2272 = Word$o$(Word$shift_left$one$go$($2269, Bool$true));
                    var $2270 = $2272;
                };
                var $2264 = $2270;
                break;
            case 'Word.e':
                var $2273 = Word$e;
                var $2264 = $2273;
                break;
        };
        return $2264;
    };
    const Word$shift_left$one$go = x0 => x1 => Word$shift_left$one$go$(x0, x1);

    function Word$shift_left$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $2275 = self.pred;
                var $2276 = Word$o$(Word$shift_left$one$go$($2275, Bool$false));
                var $2274 = $2276;
                break;
            case 'Word.i':
                var $2277 = self.pred;
                var $2278 = Word$o$(Word$shift_left$one$go$($2277, Bool$true));
                var $2274 = $2278;
                break;
            case 'Word.e':
                var $2279 = Word$e;
                var $2274 = $2279;
                break;
        };
        return $2274;
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
                    var $2280 = _value$2;
                    return $2280;
                } else {
                    var $2281 = (self - 1n);
                    var $2282 = Word$shift_left$(Word$shift_left$one$(_value$2), $2281);
                    return $2282;
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
                        var $2283 = self.pred;
                        var $2284 = Word$mul$go$($2283, Word$shift_left$(_b$4, 1n), _acc$5);
                        return $2284;
                    case 'Word.i':
                        var $2285 = self.pred;
                        var $2286 = Word$mul$go$($2285, Word$shift_left$(_b$4, 1n), Word$add$(_b$4, _acc$5));
                        return $2286;
                    case 'Word.e':
                        var $2287 = _acc$5;
                        return $2287;
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
                var $2289 = self.pred;
                var $2290 = Word$o$(Word$to_zero$($2289));
                var $2288 = $2290;
                break;
            case 'Word.i':
                var $2291 = self.pred;
                var $2292 = Word$o$(Word$to_zero$($2291));
                var $2288 = $2292;
                break;
            case 'Word.e':
                var $2293 = Word$e;
                var $2288 = $2293;
                break;
        };
        return $2288;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $2294 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $2294;
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
        var $2295 = BBT$bin$(_new_size$9, _key$3, _val$4, _left$5, _right$6);
        return $2295;
    };
    const BBT$node = x0 => x1 => x2 => x3 => BBT$node$(x0, x1, x2, x3);

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $2297 = Bool$false;
                var $2296 = $2297;
                break;
            case 'Cmp.gtn':
                var $2298 = Bool$true;
                var $2296 = $2298;
                break;
        };
        return $2296;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Word$gtn$(_a$2, _b$3) {
        var $2299 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $2299;
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
            var $2301 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
            var $2300 = $2301;
        } else {
            var self = (_size_r$8 > _w_x_size_l$10);
            if (self) {
                var self = _r$6;
                switch (self._) {
                    case 'BBT.bin':
                        var $2304 = self.key;
                        var $2305 = self.val;
                        var $2306 = self.left;
                        var $2307 = self.right;
                        var _size_rl$17 = BBT$size$($2306);
                        var _size_rr$18 = BBT$size$($2307);
                        var self = (_size_rl$17 < _size_rr$18);
                        if (self) {
                            var _new_key$19 = $2304;
                            var _new_val$20 = $2305;
                            var _new_left$21 = BBT$node$(_k$3, _v$4, _l$5, $2306);
                            var _new_right$22 = $2307;
                            var $2309 = BBT$node$(_new_key$19, _new_val$20, _new_left$21, _new_right$22);
                            var $2308 = $2309;
                        } else {
                            var self = $2306;
                            switch (self._) {
                                case 'BBT.bin':
                                    var $2311 = self.key;
                                    var $2312 = self.val;
                                    var $2313 = self.left;
                                    var $2314 = self.right;
                                    var _new_key$24 = $2311;
                                    var _new_val$25 = $2312;
                                    var _new_left$26 = BBT$node$(_k$3, _v$4, _l$5, $2313);
                                    var _new_right$27 = BBT$node$($2304, $2305, $2314, $2307);
                                    var $2315 = BBT$node$(_new_key$24, _new_val$25, _new_left$26, _new_right$27);
                                    var $2310 = $2315;
                                    break;
                                case 'BBT.tip':
                                    var $2316 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
                                    var $2310 = $2316;
                                    break;
                            };
                            var $2308 = $2310;
                        };
                        var $2303 = $2308;
                        break;
                    case 'BBT.tip':
                        var $2317 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
                        var $2303 = $2317;
                        break;
                };
                var $2302 = $2303;
            } else {
                var self = (_size_l$7 > _w_x_size_r$11);
                if (self) {
                    var self = _l$5;
                    switch (self._) {
                        case 'BBT.bin':
                            var $2320 = self.key;
                            var $2321 = self.val;
                            var $2322 = self.left;
                            var $2323 = self.right;
                            var _size_ll$17 = BBT$size$($2322);
                            var _size_lr$18 = BBT$size$($2323);
                            var self = (_size_lr$18 < _size_ll$17);
                            if (self) {
                                var _new_key$19 = $2320;
                                var _new_val$20 = $2321;
                                var _new_left$21 = $2322;
                                var _new_right$22 = BBT$node$(_k$3, _v$4, $2323, _r$6);
                                var $2325 = BBT$node$(_new_key$19, _new_val$20, _new_left$21, _new_right$22);
                                var $2324 = $2325;
                            } else {
                                var self = $2323;
                                switch (self._) {
                                    case 'BBT.bin':
                                        var $2327 = self.key;
                                        var $2328 = self.val;
                                        var $2329 = self.left;
                                        var $2330 = self.right;
                                        var _new_key$24 = $2327;
                                        var _new_val$25 = $2328;
                                        var _new_left$26 = BBT$node$($2320, $2321, $2322, $2329);
                                        var _new_right$27 = BBT$node$(_k$3, _v$4, $2330, _r$6);
                                        var $2331 = BBT$node$(_new_key$24, _new_val$25, _new_left$26, _new_right$27);
                                        var $2326 = $2331;
                                        break;
                                    case 'BBT.tip':
                                        var $2332 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
                                        var $2326 = $2332;
                                        break;
                                };
                                var $2324 = $2326;
                            };
                            var $2319 = $2324;
                            break;
                        case 'BBT.tip':
                            var $2333 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
                            var $2319 = $2333;
                            break;
                    };
                    var $2318 = $2319;
                } else {
                    var $2334 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
                    var $2318 = $2334;
                };
                var $2302 = $2318;
            };
            var $2300 = $2302;
        };
        return $2300;
    };
    const BBT$balance = x0 => x1 => x2 => x3 => BBT$balance$(x0, x1, x2, x3);

    function BBT$insert$(_cmp$3, _key$4, _val$5, _map$6) {
        var self = _map$6;
        switch (self._) {
            case 'BBT.bin':
                var $2336 = self.key;
                var $2337 = self.val;
                var $2338 = self.left;
                var $2339 = self.right;
                var self = _cmp$3(_key$4)($2336);
                switch (self._) {
                    case 'Cmp.ltn':
                        var _new_key$12 = $2336;
                        var _new_val$13 = $2337;
                        var _new_left$14 = BBT$insert$(_cmp$3, _key$4, _val$5, $2338);
                        var _new_right$15 = $2339;
                        var $2341 = BBT$balance$(_new_key$12, _new_val$13, _new_left$14, _new_right$15);
                        var $2340 = $2341;
                        break;
                    case 'Cmp.eql':
                        var $2342 = BBT$node$(_key$4, _val$5, $2338, $2339);
                        var $2340 = $2342;
                        break;
                    case 'Cmp.gtn':
                        var _new_key$12 = $2336;
                        var _new_val$13 = $2337;
                        var _new_left$14 = $2338;
                        var _new_right$15 = BBT$insert$(_cmp$3, _key$4, _val$5, $2339);
                        var $2343 = BBT$balance$(_new_key$12, _new_val$13, _new_left$14, _new_right$15);
                        var $2340 = $2343;
                        break;
                };
                var $2335 = $2340;
                break;
            case 'BBT.tip':
                var $2344 = BBT$singleton$(_key$4, _val$5);
                var $2335 = $2344;
                break;
        };
        return $2335;
    };
    const BBT$insert = x0 => x1 => x2 => x3 => BBT$insert$(x0, x1, x2, x3);

    function Map$set$(_key$2, _val$3, _map$4) {
        var $2345 = BBT$insert$(String$cmp, _key$2, _val$3, _map$4);
        return $2345;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function Kindelia$Entry$bond$(_value$1) {
        var $2346 = ({
            _: 'Kindelia.Entry.bond',
            'value': _value$1
        });
        return $2346;
    };
    const Kindelia$Entry$bond = x0 => Kindelia$Entry$bond$(x0);

    function Kindelia$parse$block$(_world$1) {
        var $2347 = Parser$choice(List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2349 = self.err;
                    var _reply$8 = Kindelia$parse$transaction$(_world$1)(_pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2351 = self.err;
                            var self = $2349;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2353 = self.value;
                                    var $2354 = Parser$Reply$error$(Parser$Error$combine$($2353, $2351));
                                    var $2352 = $2354;
                                    break;
                                case 'Maybe.none':
                                    var $2355 = Parser$Reply$error$($2351);
                                    var $2352 = $2355;
                                    break;
                            };
                            var $2350 = $2352;
                            break;
                        case 'Parser.Reply.value':
                            var $2356 = self.pst;
                            var $2357 = self.val;
                            var self = $2356;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2359 = self.err;
                                    var $2360 = self.nam;
                                    var $2361 = self.ini;
                                    var $2362 = self.idx;
                                    var $2363 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2349, $2359), $2360, $2361, $2362, $2363);
                                    var self = $2357;
                                    switch (self._) {
                                        case 'Kindelia.Transaction.new_bond':
                                            var $2365 = self.bond;
                                            var self = _world$1;
                                            switch (self._) {
                                                case 'Kindelia.World.new':
                                                    var $2367 = self.names;
                                                    var $2368 = self.entry;
                                                    var $2369 = Kindelia$World$new$($2367, Map$set$((() => {
                                                        var self = $2365;
                                                        switch (self._) {
                                                            case 'Kindelia.Bond.new':
                                                                var $2370 = self.name;
                                                                var $2371 = $2370;
                                                                return $2371;
                                                        };
                                                    })(), Kindelia$Entry$bond$($2365), $2368));
                                                    var $2366 = $2369;
                                                    break;
                                            };
                                            var _world$17 = $2366;
                                            break;
                                        case 'Kindelia.Transaction.new_data':
                                        case 'Kindelia.Transaction.new_eval':
                                        case 'Kindelia.Transaction.new_name':
                                            var $2372 = _world$1;
                                            var _world$17 = $2372;
                                            break;
                                    };
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $2373 = self.err;
                                            var _reply$23 = Kindelia$parse$block$(_world$17)(_reply$pst$16);
                                            var self = _reply$23;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2375 = self.err;
                                                    var self = $2373;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $2377 = self.value;
                                                            var $2378 = Parser$Reply$error$(Parser$Error$combine$($2377, $2375));
                                                            var $2376 = $2378;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $2379 = Parser$Reply$error$($2375);
                                                            var $2376 = $2379;
                                                            break;
                                                    };
                                                    var $2374 = $2376;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2380 = self.pst;
                                                    var $2381 = self.val;
                                                    var self = $2380;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $2383 = self.err;
                                                            var $2384 = self.nam;
                                                            var $2385 = self.ini;
                                                            var $2386 = self.idx;
                                                            var $2387 = self.str;
                                                            var _reply$pst$31 = Parser$State$new$(Parser$Error$maybe_combine$($2373, $2383), $2384, $2385, $2386, $2387);
                                                            var $2388 = Parser$Reply$value$(_reply$pst$31, List$cons$($2357, $2381));
                                                            var $2382 = $2388;
                                                            break;
                                                    };
                                                    var $2374 = $2382;
                                                    break;
                                            };
                                            var $2364 = $2374;
                                            break;
                                    };
                                    var $2358 = $2364;
                                    break;
                            };
                            var $2350 = $2358;
                            break;
                    };
                    var $2348 = $2350;
                    break;
            };
            return $2348;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2390 = self.err;
                    var _reply$8 = Kindelia$parse$text$("save", _pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2392 = self.err;
                            var self = $2390;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2394 = self.value;
                                    var $2395 = Parser$Reply$error$(Parser$Error$combine$($2394, $2392));
                                    var $2393 = $2395;
                                    break;
                                case 'Maybe.none':
                                    var $2396 = Parser$Reply$error$($2392);
                                    var $2393 = $2396;
                                    break;
                            };
                            var $2391 = $2393;
                            break;
                        case 'Parser.Reply.value':
                            var $2397 = self.pst;
                            var self = $2397;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2399 = self.err;
                                    var $2400 = self.nam;
                                    var $2401 = self.ini;
                                    var $2402 = self.idx;
                                    var $2403 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2390, $2399), $2400, $2401, $2402, $2403);
                                    var $2404 = Parser$Reply$value$(_reply$pst$16, List$nil);
                                    var $2398 = $2404;
                                    break;
                            };
                            var $2391 = $2398;
                            break;
                    };
                    var $2389 = $2391;
                    break;
            };
            return $2389;
        }), List$nil)));
        return $2347;
    };
    const Kindelia$parse$block = x0 => Kindelia$parse$block$(x0);

    function IO$(_A$1) {
        var $2405 = null;
        return $2405;
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
                    var $2406 = _n$2;
                    return $2406;
                } else {
                    var $2407 = self.charCodeAt(0);
                    var $2408 = self.slice(1);
                    var $2409 = String$length$go$($2408, Nat$succ$(_n$2));
                    return $2409;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$length$go = x0 => x1 => String$length$go$(x0, x1);

    function String$length$(_xs$1) {
        var $2410 = String$length$go$(_xs$1, 0n);
        return $2410;
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
                        var $2411 = self.head;
                        var $2412 = self.tail;
                        var $2413 = String$flatten$go$($2412, (_res$2 + $2411));
                        return $2413;
                    case 'List.nil':
                        var $2414 = _res$2;
                        return $2414;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$flatten$go = x0 => x1 => String$flatten$go$(x0, x1);

    function String$flatten$(_xs$1) {
        var $2415 = String$flatten$go$(_xs$1, "");
        return $2415;
    };
    const String$flatten = x0 => String$flatten$(x0);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $2417 = self.head;
                var $2418 = self.tail;
                var $2419 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $2420 = "";
                        return $2420;
                    } else {
                        var $2421 = _sep$1;
                        return $2421;
                    };
                })(), List$cons$($2417, List$cons$(String$join$go$(_sep$1, $2418, Bool$false), List$nil))));
                var $2416 = $2419;
                break;
            case 'List.nil':
                var $2422 = "";
                var $2416 = $2422;
                break;
        };
        return $2416;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $2423 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $2423;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function Kind$Code$highlight$end$(_col$1, _row$2, _res$3) {
        var $2424 = String$join$("\u{a}", _res$3);
        return $2424;
    };
    const Kind$Code$highlight$end = x0 => x1 => x2 => Kind$Code$highlight$end$(x0, x1, x2);

    function Maybe$extract$(_m$2, _a$4, _f$5) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $2426 = self.value;
                var $2427 = _f$5($2426);
                var $2425 = $2427;
                break;
            case 'Maybe.none':
                var $2428 = _a$4;
                var $2425 = $2428;
                break;
        };
        return $2425;
    };
    const Maybe$extract = x0 => x1 => x2 => Maybe$extract$(x0, x1, x2);

    function Nat$is_zero$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $2430 = Bool$true;
            var $2429 = $2430;
        } else {
            var $2431 = (self - 1n);
            var $2432 = Bool$false;
            var $2429 = $2432;
        };
        return $2429;
    };
    const Nat$is_zero = x0 => Nat$is_zero$(x0);

    function Nat$double$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $2434 = Nat$zero;
            var $2433 = $2434;
        } else {
            var $2435 = (self - 1n);
            var $2436 = Nat$succ$(Nat$succ$(Nat$double$($2435)));
            var $2433 = $2436;
        };
        return $2433;
    };
    const Nat$double = x0 => Nat$double$(x0);

    function Nat$pred$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $2438 = Nat$zero;
            var $2437 = $2438;
        } else {
            var $2439 = (self - 1n);
            var $2440 = $2439;
            var $2437 = $2440;
        };
        return $2437;
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
                    var $2441 = _res$2;
                    return $2441;
                } else {
                    var $2442 = self.charCodeAt(0);
                    var $2443 = self.slice(1);
                    var $2444 = String$reverse$go$($2443, String$cons$($2442, _res$2));
                    return $2444;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$reverse$go = x0 => x1 => String$reverse$go$(x0, x1);

    function String$reverse$(_xs$1) {
        var $2445 = String$reverse$go$(_xs$1, String$nil);
        return $2445;
    };
    const String$reverse = x0 => String$reverse$(x0);

    function String$pad_right$(_size$1, _chr$2, _str$3) {
        var self = _size$1;
        if (self === 0n) {
            var $2447 = _str$3;
            var $2446 = $2447;
        } else {
            var $2448 = (self - 1n);
            var self = _str$3;
            if (self.length === 0) {
                var $2450 = String$cons$(_chr$2, String$pad_right$($2448, _chr$2, ""));
                var $2449 = $2450;
            } else {
                var $2451 = self.charCodeAt(0);
                var $2452 = self.slice(1);
                var $2453 = String$cons$($2451, String$pad_right$($2448, _chr$2, $2452));
                var $2449 = $2453;
            };
            var $2446 = $2449;
        };
        return $2446;
    };
    const String$pad_right = x0 => x1 => x2 => String$pad_right$(x0, x1, x2);

    function String$pad_left$(_size$1, _chr$2, _str$3) {
        var $2454 = String$reverse$(String$pad_right$(_size$1, _chr$2, String$reverse$(_str$3)));
        return $2454;
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
                    var $2455 = Nat$div_mod$go$(_n$1, Nat$succ$(_d$2), (_r$3 - _n$1 <= 0n ? 0n : _r$3 - _n$1));
                    return $2455;
                } else {
                    var $2456 = Pair$new$(_d$2, _r$3);
                    return $2456;
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
                        var $2457 = self.fst;
                        var $2458 = self.snd;
                        var self = $2457;
                        if (self === 0n) {
                            var $2460 = List$cons$($2458, _res$3);
                            var $2459 = $2460;
                        } else {
                            var $2461 = (self - 1n);
                            var $2462 = Nat$to_base$go$(_base$1, $2457, List$cons$($2458, _res$3));
                            var $2459 = $2462;
                        };
                        return $2459;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $2463 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $2463;
    };
    const Nat$to_base = x0 => x1 => Nat$to_base$(x0, x1);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $2465 = self.snd;
                var $2466 = $2465;
                var $2464 = $2466;
                break;
        };
        return $2464;
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
                        var $2467 = self.head;
                        var $2468 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $2470 = Maybe$some$($2467);
                            var $2469 = $2470;
                        } else {
                            var $2471 = (self - 1n);
                            var $2472 = List$at$($2471, $2468);
                            var $2469 = $2472;
                        };
                        return $2469;
                    case 'List.nil':
                        var $2473 = Maybe$none;
                        return $2473;
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
                    var $2476 = self.value;
                    var $2477 = $2476;
                    var $2475 = $2477;
                    break;
                case 'Maybe.none':
                    var $2478 = 35;
                    var $2475 = $2478;
                    break;
            };
            var $2474 = $2475;
        } else {
            var $2479 = 35;
            var $2474 = $2479;
        };
        return $2474;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $2480 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $2481 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $2481;
        }));
        return $2480;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $2482 = Nat$to_string_base$(10n, _n$1);
        return $2482;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const Bool$not = a0 => (!a0);

    function U16$new$(_value$1) {
        var $2483 = word_to_u16(_value$1);
        return $2483;
    };
    const U16$new = x0 => U16$new$(x0);
    const Nat$to_u16 = a0 => (Number(a0) & 0xFFFF);

    function Kind$Code$color$(_col$1, _str$2) {
        var $2484 = String$cons$(27, ("[" + (_col$1 + ("m" + (_str$2 + String$cons$(27, "[0m"))))));
        return $2484;
    };
    const Kind$Code$color = x0 => x1 => Kind$Code$color$(x0, x1);
    const Nat$eql = a0 => a1 => (a0 === a1);

    function List$take$(_n$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $2486 = self.head;
                var $2487 = self.tail;
                var self = _n$2;
                if (self === 0n) {
                    var $2489 = List$nil;
                    var $2488 = $2489;
                } else {
                    var $2490 = (self - 1n);
                    var $2491 = List$cons$($2486, List$take$($2490, $2487));
                    var $2488 = $2491;
                };
                var $2485 = $2488;
                break;
            case 'List.nil':
                var $2492 = List$nil;
                var $2485 = $2492;
                break;
        };
        return $2485;
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
                    var $2494 = Kind$Code$highlight$end$(_col$5, _row$6, List$reverse$(_res$9));
                    var $2493 = $2494;
                } else {
                    var $2495 = self.charCodeAt(0);
                    var $2496 = self.slice(1);
                    var self = ($2495 === 10);
                    if (self) {
                        var _stp$13 = Maybe$extract$(_lft$7, Bool$false, Nat$is_zero);
                        var self = _stp$13;
                        if (self) {
                            var $2499 = Kind$Code$highlight$end$(_col$5, _row$6, List$reverse$(_res$9));
                            var $2498 = $2499;
                        } else {
                            var _siz$14 = Nat$succ$(Nat$double$(_spa$10));
                            var self = _ix1$4;
                            if (self === 0n) {
                                var self = _lft$7;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2502 = self.value;
                                        var $2503 = Maybe$some$(Nat$pred$($2502));
                                        var $2501 = $2503;
                                        break;
                                    case 'Maybe.none':
                                        var $2504 = Maybe$some$(_spa$10);
                                        var $2501 = $2504;
                                        break;
                                };
                                var _lft$15 = $2501;
                            } else {
                                var $2505 = (self - 1n);
                                var $2506 = _lft$7;
                                var _lft$15 = $2506;
                            };
                            var _ixi$16 = Nat$pred$(_ixi$2);
                            var _ix0$17 = Nat$pred$(_ix0$3);
                            var _ix1$18 = Nat$pred$(_ix1$4);
                            var _col$19 = 0n;
                            var _row$20 = Nat$succ$(_row$6);
                            var _res$21 = List$cons$(String$reverse$(_lin$8), _res$9);
                            var _lin$22 = String$reverse$(String$flatten$(List$cons$(String$pad_left$(4n, 32, Nat$show$(_row$20)), List$cons$(" | ", List$nil))));
                            var $2500 = Kind$Code$highlight$go$($2496, _ixi$16, _ix0$17, _ix1$18, _col$19, _row$20, _lft$15, _lin$22, _res$21);
                            var $2498 = $2500;
                        };
                        var $2497 = $2498;
                    } else {
                        var _chr$13 = String$cons$($2495, String$nil);
                        var self = (Nat$is_zero$(_ix0$3) && (!Nat$is_zero$(_ix1$4)));
                        if (self) {
                            var $2508 = String$reverse$(Kind$Code$color$("41", Kind$Code$color$("37", _chr$13)));
                            var _chr$14 = $2508;
                        } else {
                            var self = (Nat$is_zero$(_ixi$2) && (!Nat$is_zero$(_ix1$4)));
                            if (self) {
                                var $2510 = String$reverse$(Kind$Code$color$("31", Kind$Code$color$("4", _chr$13)));
                                var $2509 = $2510;
                            } else {
                                var $2511 = _chr$13;
                                var $2509 = $2511;
                            };
                            var _chr$14 = $2509;
                        };
                        var self = (_ix0$3 === 1n);
                        if (self) {
                            var $2512 = List$take$(_spa$10, _res$9);
                            var _res$15 = $2512;
                        } else {
                            var $2513 = _res$9;
                            var _res$15 = $2513;
                        };
                        var _ixi$16 = Nat$pred$(_ixi$2);
                        var _ix0$17 = Nat$pred$(_ix0$3);
                        var _ix1$18 = Nat$pred$(_ix1$4);
                        var _col$19 = Nat$succ$(_col$5);
                        var _lin$20 = String$flatten$(List$cons$(_chr$14, List$cons$(_lin$8, List$nil)));
                        var $2507 = Kind$Code$highlight$go$($2496, _ixi$16, _ix0$17, _ix1$18, _col$19, _row$6, _lft$7, _lin$20, _res$15);
                        var $2497 = $2507;
                    };
                    var $2493 = $2497;
                };
                return $2493;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$Code$highlight$go = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => Kind$Code$highlight$go$(x0, x1, x2, x3, x4, x5, x6, x7, x8);

    function Kind$Code$highlight$(_code$1, _init$2, _idx0$3, _idx1$4) {
        var $2514 = Kind$Code$highlight$go$((_code$1 + " \u{a}"), _init$2, _idx0$3, _idx1$4, 0n, 1n, Maybe$none, String$reverse$("   1 | "), List$nil);
        return $2514;
    };
    const Kind$Code$highlight = x0 => x1 => x2 => x3 => Kind$Code$highlight$(x0, x1, x2, x3);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $2515 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $2515;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $2517 = self.value;
                var $2518 = _f$4($2517);
                var $2516 = $2518;
                break;
            case 'IO.ask':
                var $2519 = self.query;
                var $2520 = self.param;
                var $2521 = self.then;
                var $2522 = IO$ask$($2519, $2520, (_x$8 => {
                    var $2523 = IO$bind$($2521(_x$8), _f$4);
                    return $2523;
                }));
                var $2516 = $2522;
                break;
        };
        return $2516;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $2524 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $2524;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $2525 = _new$2(IO$bind)(IO$end);
        return $2525;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function IO$put_string$(_text$1) {
        var $2526 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $2527 = IO$end$(Unit$new);
            return $2527;
        }));
        return $2526;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function IO$print$(_text$1) {
        var $2528 = IO$put_string$((_text$1 + "\u{a}"));
        return $2528;
    };
    const IO$print = x0 => IO$print$(x0);
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $2530 = self.pred;
                var $2531 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $2533 = self.pred;
                            var $2534 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2536 = Word$i$(Word$subber$(_a$pred$10, $2533, Bool$true));
                                    var $2535 = $2536;
                                } else {
                                    var $2537 = Word$o$(Word$subber$(_a$pred$10, $2533, Bool$false));
                                    var $2535 = $2537;
                                };
                                return $2535;
                            });
                            var $2532 = $2534;
                            break;
                        case 'Word.i':
                            var $2538 = self.pred;
                            var $2539 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2541 = Word$o$(Word$subber$(_a$pred$10, $2538, Bool$true));
                                    var $2540 = $2541;
                                } else {
                                    var $2542 = Word$i$(Word$subber$(_a$pred$10, $2538, Bool$true));
                                    var $2540 = $2542;
                                };
                                return $2540;
                            });
                            var $2532 = $2539;
                            break;
                        case 'Word.e':
                            var $2543 = (_a$pred$8 => {
                                var $2544 = Word$e;
                                return $2544;
                            });
                            var $2532 = $2543;
                            break;
                    };
                    var $2532 = $2532($2530);
                    return $2532;
                });
                var $2529 = $2531;
                break;
            case 'Word.i':
                var $2545 = self.pred;
                var $2546 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $2548 = self.pred;
                            var $2549 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2551 = Word$o$(Word$subber$(_a$pred$10, $2548, Bool$false));
                                    var $2550 = $2551;
                                } else {
                                    var $2552 = Word$i$(Word$subber$(_a$pred$10, $2548, Bool$false));
                                    var $2550 = $2552;
                                };
                                return $2550;
                            });
                            var $2547 = $2549;
                            break;
                        case 'Word.i':
                            var $2553 = self.pred;
                            var $2554 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2556 = Word$i$(Word$subber$(_a$pred$10, $2553, Bool$true));
                                    var $2555 = $2556;
                                } else {
                                    var $2557 = Word$o$(Word$subber$(_a$pred$10, $2553, Bool$false));
                                    var $2555 = $2557;
                                };
                                return $2555;
                            });
                            var $2547 = $2554;
                            break;
                        case 'Word.e':
                            var $2558 = (_a$pred$8 => {
                                var $2559 = Word$e;
                                return $2559;
                            });
                            var $2547 = $2558;
                            break;
                    };
                    var $2547 = $2547($2545);
                    return $2547;
                });
                var $2529 = $2546;
                break;
            case 'Word.e':
                var $2560 = (_b$5 => {
                    var $2561 = Word$e;
                    return $2561;
                });
                var $2529 = $2560;
                break;
        };
        var $2529 = $2529(_b$3);
        return $2529;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $2562 = Word$subber$(_a$2, _b$3, Bool$false);
        return $2562;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);
    const U16$sub = a0 => a1 => ((a0 - a1) & 0xFFFF);
    const U16$add = a0 => a1 => ((a0 + a1) & 0xFFFF);
    const Nat$div = a0 => a1 => (a0 / a1);
    const Bits$i = a0 => (a0 + '1');

    function Kindelia$serialize$fixlen$(_size$1, _value$2) {
        var self = _size$1;
        if (self === 0n) {
            var $2564 = Bits$e;
            var $2563 = $2564;
        } else {
            var $2565 = (self - 1n);
            var self = ((_value$2 % 2n) === 0n);
            if (self) {
                var $2567 = (Kindelia$serialize$fixlen$($2565, (_value$2 / 2n)) + '0');
                var $2566 = $2567;
            } else {
                var $2568 = (Kindelia$serialize$fixlen$($2565, (_value$2 / 2n)) + '1');
                var $2566 = $2568;
            };
            var $2563 = $2566;
        };
        return $2563;
    };
    const Kindelia$serialize$fixlen = x0 => x1 => Kindelia$serialize$fixlen$(x0, x1);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $2570 = self.pred;
                var $2571 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $2570));
                var $2569 = $2571;
                break;
            case 'Word.i':
                var $2572 = self.pred;
                var $2573 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $2572));
                var $2569 = $2573;
                break;
            case 'Word.e':
                var $2574 = _nil$3;
                var $2569 = $2574;
                break;
        };
        return $2569;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);

    function Word$to_nat$(_word$2) {
        var $2575 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $2576 = Nat$succ$((2n * _x$4));
            return $2576;
        }), _word$2);
        return $2575;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);
    const U16$to_nat = a0 => (BigInt(a0));
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Kindelia$serialize$name$(_name$1) {
        var self = _name$1;
        if (self.length === 0) {
            var $2578 = (Bits$e + '0');
            var $2577 = $2578;
        } else {
            var $2579 = self.charCodeAt(0);
            var $2580 = self.slice(1);
            var self = U16$btw$(48, $2579, 57);
            if (self) {
                var $2582 = (($2579 - 48) & 0xFFFF);
                var _numb$4 = $2582;
            } else {
                var self = U16$btw$(65, $2579, 90);
                if (self) {
                    var $2584 = (((($2579 - 65) & 0xFFFF) + 10) & 0xFFFF);
                    var $2583 = $2584;
                } else {
                    var self = U16$btw$(97, $2579, 122);
                    if (self) {
                        var $2586 = (((($2579 - 97) & 0xFFFF) + 36) & 0xFFFF);
                        var $2585 = $2586;
                    } else {
                        var self = U16$btw$(95, $2579, 95);
                        if (self) {
                            var $2588 = 62;
                            var $2587 = $2588;
                        } else {
                            var $2589 = 63;
                            var $2587 = $2589;
                        };
                        var $2585 = $2587;
                    };
                    var $2583 = $2585;
                };
                var _numb$4 = $2583;
            };
            var _head$5 = Kindelia$serialize$fixlen$(6n, (BigInt(_numb$4)));
            var _tail$6 = Kindelia$serialize$name$($2580);
            var $2581 = ((_tail$6 + _head$5) + '1');
            var $2577 = $2581;
        };
        return $2577;
    };
    const Kindelia$serialize$name = x0 => Kindelia$serialize$name$(x0);

    function Kindelia$serialize$list$(_item$2, _list$3) {
        var self = _list$3;
        switch (self._) {
            case 'List.cons':
                var $2591 = self.head;
                var $2592 = self.tail;
                var $2593 = ((Kindelia$serialize$list$(_item$2, $2592) + _item$2($2591)) + '1');
                var $2590 = $2593;
                break;
            case 'List.nil':
                var $2594 = (Bits$e + '0');
                var $2590 = $2594;
                break;
        };
        return $2590;
    };
    const Kindelia$serialize$list = x0 => x1 => Kindelia$serialize$list$(x0, x1);

    function Kindelia$serialize$pair$(_first$3, _second$4, _pair$5) {
        var self = _pair$5;
        switch (self._) {
            case 'Pair.new':
                var $2596 = self.fst;
                var $2597 = self.snd;
                var _fst$8 = _first$3($2596);
                var _snd$9 = _second$4($2597);
                var $2598 = (_snd$9 + _fst$8);
                var $2595 = $2598;
                break;
        };
        return $2595;
    };
    const Kindelia$serialize$pair = x0 => x1 => x2 => Kindelia$serialize$pair$(x0, x1, x2);

    function Kindelia$serialize$type$(_world$1, _typ$2) {
        var self = _typ$2;
        switch (self._) {
            case 'Kindelia.Type.data':
                var $2600 = self.name;
                var $2601 = (Kindelia$serialize$name$($2600) + '1');
                var $2599 = $2601;
                break;
            case 'Kindelia.Type.word':
                var $2602 = (Bits$e + '0');
                var $2599 = $2602;
                break;
        };
        return $2599;
    };
    const Kindelia$serialize$type = x0 => x1 => Kindelia$serialize$type$(x0, x1);

    function Kindelia$serialize$constructor$(_world$1, _ctor$2) {
        var self = _ctor$2;
        switch (self._) {
            case 'Kindelia.Constructor.new':
                var $2604 = self.name;
                var $2605 = self.args;
                var _name$5 = Kindelia$serialize$name$($2604);
                var _args$6 = Kindelia$serialize$list$(Kindelia$serialize$pair(Kindelia$serialize$name)(Kindelia$serialize$type(_world$1)), $2605);
                var $2606 = (_args$6 + _name$5);
                var $2603 = $2606;
                break;
        };
        return $2603;
    };
    const Kindelia$serialize$constructor = x0 => x1 => Kindelia$serialize$constructor$(x0, x1);

    function Kindelia$serialize$data$(_world$1, _data$2) {
        var self = _data$2;
        switch (self._) {
            case 'Kindelia.Data.new':
                var $2608 = self.name;
                var $2609 = self.ctrs;
                var _name$5 = Kindelia$serialize$name$($2608);
                var _ctrs$6 = Kindelia$serialize$list$(Kindelia$serialize$constructor(_world$1), $2609);
                var $2610 = (_ctrs$6 + _name$5);
                var $2607 = $2610;
                break;
        };
        return $2607;
    };
    const Kindelia$serialize$data = x0 => x1 => Kindelia$serialize$data$(x0, x1);

    function Kindelia$serialize$varlen$go$(_value$1) {
        var self = _value$1;
        if (self === 0n) {
            var $2612 = Bits$e;
            var $2611 = $2612;
        } else {
            var $2613 = (self - 1n);
            var self = (_value$1 === 1n);
            if (self) {
                var $2615 = (Bits$e + '0');
                var $2614 = $2615;
            } else {
                var self = ((_value$1 % 2n) === 0n);
                if (self) {
                    var $2617 = ((Kindelia$serialize$varlen$go$((_value$1 / 2n)) + '0') + '1');
                    var $2616 = $2617;
                } else {
                    var $2618 = ((Kindelia$serialize$varlen$go$((_value$1 / 2n)) + '1') + '1');
                    var $2616 = $2618;
                };
                var $2614 = $2616;
            };
            var $2611 = $2614;
        };
        return $2611;
    };
    const Kindelia$serialize$varlen$go = x0 => Kindelia$serialize$varlen$go$(x0);

    function Kindelia$serialize$varlen$(_value$1) {
        var $2619 = Kindelia$serialize$varlen$go$((_value$1 + 1n));
        return $2619;
    };
    const Kindelia$serialize$varlen = x0 => Kindelia$serialize$varlen$(x0);

    function Kindelia$serialize$name$local$(_world$1, _vars$2, _name$3) {
        var self = List$find_index$(_vars$2, a1 => (_name$3 === a1));
        switch (self._) {
            case 'Maybe.some':
                var $2621 = self.value;
                var $2622 = Kindelia$serialize$varlen$($2621);
                var $2620 = $2622;
                break;
            case 'Maybe.none':
                var $2623 = Bits$e;
                var $2620 = $2623;
                break;
        };
        return $2620;
    };
    const Kindelia$serialize$name$local = x0 => x1 => x2 => Kindelia$serialize$name$local$(x0, x1, x2);

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $2625 = self.head;
                var $2626 = self.tail;
                var $2627 = List$cons$(_f$3($2625), List$map$(_f$3, $2626));
                var $2624 = $2627;
                break;
            case 'List.nil':
                var $2628 = List$nil;
                var $2624 = $2628;
                break;
        };
        return $2624;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $2630 = self.head;
                var $2631 = self.tail;
                var $2632 = List$cons$($2630, List$concat$($2631, _bs$3));
                var $2629 = $2632;
                break;
            case 'List.nil':
                var $2633 = _bs$3;
                var $2629 = $2633;
                break;
        };
        return $2629;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function Kindelia$serialize$cases$(_world$1, _vars$2, _name$3, _ctors$4, _cases$5) {
        var self = _ctors$4;
        switch (self._) {
            case 'List.cons':
                var $2635 = self.head;
                var $2636 = self.tail;
                var self = _cases$5;
                switch (self._) {
                    case 'List.cons':
                        var $2638 = self.head;
                        var $2639 = self.tail;
                        var _flds$10 = List$map$((_args$10 => {
                            var $2641 = (_name$3 + ("." + (() => {
                                var self = _args$10;
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2642 = self.fst;
                                        var $2643 = $2642;
                                        return $2643;
                                };
                            })()));
                            return $2641;
                        }), (() => {
                            var self = $2635;
                            switch (self._) {
                                case 'Kindelia.Constructor.new':
                                    var $2644 = self.args;
                                    var $2645 = $2644;
                                    return $2645;
                            };
                        })());
                        var _head$11 = Kindelia$serialize$term$(_world$1, List$concat$(List$reverse$(_flds$10), _vars$2), $2638);
                        var _tail$12 = Kindelia$serialize$cases$(_world$1, _vars$2, _name$3, $2636, $2639);
                        var $2640 = (_tail$12 + _head$11);
                        var $2637 = $2640;
                        break;
                    case 'List.nil':
                        var $2646 = Bits$e;
                        var $2637 = $2646;
                        break;
                };
                var $2634 = $2637;
                break;
            case 'List.nil':
                var self = _cases$5;
                switch (self._) {
                    case 'List.nil':
                    case 'List.cons':
                        var $2648 = Bits$e;
                        var $2647 = $2648;
                        break;
                };
                var $2634 = $2647;
                break;
        };
        return $2634;
    };
    const Kindelia$serialize$cases = x0 => x1 => x2 => x3 => x4 => Kindelia$serialize$cases$(x0, x1, x2, x3, x4);

    function Kindelia$get_ctrs$(_world$1, _name$2) {
        var self = Kindelia$get_data$(_world$1, _name$2);
        switch (self._) {
            case 'Maybe.some':
                var $2650 = self.value;
                var $2651 = Maybe$some$((() => {
                    var self = $2650;
                    switch (self._) {
                        case 'Kindelia.Data.new':
                            var $2652 = self.ctrs;
                            var $2653 = $2652;
                            return $2653;
                    };
                })());
                var $2649 = $2651;
                break;
            case 'Maybe.none':
                var $2654 = Maybe$none;
                var $2649 = $2654;
                break;
        };
        return $2649;
    };
    const Kindelia$get_ctrs = x0 => x1 => Kindelia$get_ctrs$(x0, x1);
    const U64$to_nat = a0 => (a0);

    function Kindelia$serialize$term$(_world$1, _vars$2, _term$3) {
        var self = _term$3;
        switch (self._) {
            case 'Kindelia.Term.var':
                var $2656 = self.name;
                var $2657 = (Kindelia$serialize$name$local$(_world$1, _vars$2, $2656) + '0');
                var $2655 = $2657;
                break;
            case 'Kindelia.Term.call':
                var $2658 = self.bond;
                var $2659 = self.args;
                var _bond$6 = Kindelia$serialize$name$($2658);
                var _args$7 = Kindelia$serialize$list$(Kindelia$serialize$term(_world$1)(_vars$2), $2659);
                var $2660 = (((((_args$7 + _bond$6) + '0') + '0') + '1') + '1');
                var $2655 = $2660;
                break;
            case 'Kindelia.Term.let':
                var $2661 = self.name;
                var $2662 = self.type;
                var $2663 = self.expr;
                var $2664 = self.body;
                var _name$8 = Kindelia$serialize$name$($2661);
                var _type$9 = Kindelia$serialize$type$(_world$1, $2662);
                var _expr$10 = Kindelia$serialize$term$(_world$1, _vars$2, $2663);
                var _body$11 = Kindelia$serialize$term$(_world$1, List$cons$($2661, _vars$2), $2664);
                var $2665 = (((((((_body$11 + _expr$10) + _type$9) + _name$8) + '0') + '0') + '0') + '1');
                var $2655 = $2665;
                break;
            case 'Kindelia.Term.create':
                var $2666 = self.ctor;
                var $2667 = self.vals;
                var _ctor$6 = Kindelia$serialize$varlen$($2666);
                var _vals$7 = Kindelia$serialize$list$(Kindelia$serialize$term(_world$1)(_vars$2), $2667);
                var $2668 = (((((_vals$7 + _ctor$6) + '0') + '1') + '0') + '1');
                var $2655 = $2668;
                break;
            case 'Kindelia.Term.match':
                var $2669 = self.name;
                var $2670 = self.data;
                var $2671 = self.cses;
                var _name$7 = Kindelia$serialize$name$local$(_world$1, _vars$2, $2669);
                var _data$8 = Kindelia$serialize$name$($2670);
                var _cses$9 = Kindelia$serialize$cases$(_world$1, _vars$2, $2669, Maybe$default$(Kindelia$get_ctrs$(_world$1, $2670), List$nil), $2671);
                var $2672 = ((((((_cses$9 + _data$8) + _name$7) + '0') + '1') + '1') + '1');
                var $2655 = $2672;
                break;
            case 'Kindelia.Term.word':
                var $2673 = self.numb;
                var _numb$5 = Kindelia$serialize$fixlen$(64n, ($2673));
                var $2674 = ((((_numb$5 + '1') + '0') + '0') + '1');
                var $2655 = $2674;
                break;
            case 'Kindelia.Term.compare':
                var $2675 = self.val0;
                var $2676 = self.val1;
                var $2677 = self.iflt;
                var $2678 = self.ifeq;
                var $2679 = self.ifgt;
                var _val0$9 = Kindelia$serialize$term$(_world$1, _vars$2, $2675);
                var _val1$10 = Kindelia$serialize$term$(_world$1, _vars$2, $2676);
                var _iflt$11 = Kindelia$serialize$term$(_world$1, _vars$2, $2677);
                var _ifeq$12 = Kindelia$serialize$term$(_world$1, _vars$2, $2678);
                var _ifgt$13 = Kindelia$serialize$term$(_world$1, _vars$2, $2679);
                var $2680 = ((((((((_ifgt$13 + _ifeq$12) + _iflt$11) + _val1$10) + _val0$9) + '1') + '0') + '1') + '1');
                var $2655 = $2680;
                break;
            case 'Kindelia.Term.operate':
                var $2681 = self.oper;
                var $2682 = self.val0;
                var $2683 = self.val1;
                var _oper$7 = Kindelia$serialize$fixlen$(3n, (() => {
                    var self = $2681;
                    switch (self._) {
                        case 'Kindelia.Operation.add':
                            var $2685 = 0n;
                            return $2685;
                        case 'Kindelia.Operation.sub':
                            var $2686 = 1n;
                            return $2686;
                        case 'Kindelia.Operation.mul':
                            var $2687 = 2n;
                            return $2687;
                        case 'Kindelia.Operation.div':
                            var $2688 = 3n;
                            return $2688;
                        case 'Kindelia.Operation.mod':
                            var $2689 = 4n;
                            return $2689;
                        case 'Kindelia.Operation.or':
                            var $2690 = 5n;
                            return $2690;
                        case 'Kindelia.Operation.and':
                            var $2691 = 6n;
                            return $2691;
                        case 'Kindelia.Operation.xor':
                            var $2692 = 7n;
                            return $2692;
                    };
                })());
                var _val0$8 = Kindelia$serialize$term$(_world$1, _vars$2, $2682);
                var _val1$9 = Kindelia$serialize$term$(_world$1, _vars$2, $2683);
                var $2684 = ((((((_val1$9 + _val0$8) + _oper$7) + '1') + '1') + '0') + '1');
                var $2655 = $2684;
                break;
            case 'Kindelia.Term.bind':
                var $2693 = self.bond;
                var $2694 = self.expr;
                var $2695 = self.cont;
                var _bond$7 = Kindelia$serialize$name$($2693);
                var _expr$8 = Kindelia$serialize$term$(_world$1, _vars$2, $2694);
                var _cont$9 = Kindelia$serialize$term$(_world$1, _vars$2, $2695);
                var $2696 = ((((((_cont$9 + _expr$8) + _bond$7) + '1') + '1') + '1') + '1');
                var $2655 = $2696;
                break;
        };
        return $2655;
    };
    const Kindelia$serialize$term = x0 => x1 => x2 => Kindelia$serialize$term$(x0, x1, x2);

    function Kindelia$serialize$bond$(_world$1, _bond$2) {
        var self = _bond$2;
        switch (self._) {
            case 'Kindelia.Bond.new':
                var $2698 = self.name;
                var $2699 = self.ownr;
                var $2700 = self.args;
                var $2701 = self.otyp;
                var $2702 = self.main;
                var _name$8 = Kindelia$serialize$name$($2698);
                var _ownr$9 = Kindelia$serialize$list$(Kindelia$serialize$name, $2699);
                var _args$10 = Kindelia$serialize$list$(Kindelia$serialize$pair(Kindelia$serialize$name)(Kindelia$serialize$type(_world$1)), $2700);
                var _otyp$11 = Kindelia$serialize$type$(_world$1, $2701);
                var _inam$12 = List$reverse$(List$mapped$($2700, Pair$fst));
                var _main$13 = Kindelia$serialize$term$(_world$1, _inam$12, $2702);
                var $2703 = (((_main$13 + _otyp$11) + _args$10) + _name$8);
                var $2697 = $2703;
                break;
        };
        return $2697;
    };
    const Kindelia$serialize$bond = x0 => x1 => Kindelia$serialize$bond$(x0, x1);

    function Kindelia$serialize$maybe$(_item$2, _maybe$3) {
        var self = _maybe$3;
        switch (self._) {
            case 'Maybe.some':
                var $2705 = self.value;
                var $2706 = (_item$2($2705) + '1');
                var $2704 = $2706;
                break;
            case 'Maybe.none':
                var $2707 = (Bits$e + '0');
                var $2704 = $2707;
                break;
        };
        return $2704;
    };
    const Kindelia$serialize$maybe = x0 => x1 => Kindelia$serialize$maybe$(x0, x1);

    function Kindelia$serialize$auth$(_world$1, _auth$2) {
        var self = _auth$2;
        switch (self._) {
            case 'Kindelia.Auth.new':
                var $2709 = self.bond;
                var $2710 = self.args;
                var _bond$5 = Kindelia$serialize$name$($2709);
                var _args$6 = Kindelia$serialize$list$(Kindelia$serialize$term(_world$1)(List$nil), $2710);
                var $2711 = ((_args$6 + _bond$5) + '1');
                var $2708 = $2711;
                break;
        };
        return $2708;
    };
    const Kindelia$serialize$auth = x0 => x1 => Kindelia$serialize$auth$(x0, x1);

    function Kindelia$serialize$eval$(_world$1, _eval$2) {
        var self = _eval$2;
        switch (self._) {
            case 'Kindelia.Eval.new':
                var $2713 = self.auth;
                var $2714 = self.term;
                var $2715 = self.type;
                var _auth$6 = Kindelia$serialize$maybe$(Kindelia$serialize$auth(_world$1), $2713);
                var _term$7 = Kindelia$serialize$term$(_world$1, List$nil, $2714);
                var _type$8 = Kindelia$serialize$type$(_world$1, $2715);
                var $2716 = ((_auth$6 + _type$8) + _term$7);
                var $2712 = $2716;
                break;
        };
        return $2712;
    };
    const Kindelia$serialize$eval = x0 => x1 => Kindelia$serialize$eval$(x0, x1);

    function Kindelia$serialize$transaction$(_world$1, _transaction$2) {
        var self = _transaction$2;
        switch (self._) {
            case 'Kindelia.Transaction.new_data':
                var $2718 = self.data;
                var _data$4 = Kindelia$serialize$data$(_world$1, $2718);
                var $2719 = ((_data$4 + '0') + '0');
                var $2717 = $2719;
                break;
            case 'Kindelia.Transaction.new_bond':
                var $2720 = self.bond;
                var _bond$4 = Kindelia$serialize$bond$(_world$1, $2720);
                var $2721 = ((_bond$4 + '0') + '1');
                var $2717 = $2721;
                break;
            case 'Kindelia.Transaction.new_eval':
                var $2722 = self.eval;
                var _term$4 = Kindelia$serialize$eval$(_world$1, $2722);
                var $2723 = ((_term$4 + '1') + '0');
                var $2717 = $2723;
                break;
            case 'Kindelia.Transaction.new_name':
                var $2724 = self.name;
                var _name$4 = Kindelia$serialize$name$($2724);
                var $2725 = ((_name$4 + '1') + '1');
                var $2717 = $2725;
                break;
        };
        return $2717;
    };
    const Kindelia$serialize$transaction = x0 => x1 => Kindelia$serialize$transaction$(x0, x1);

    function Kindelia$serialize$block$(_world$1, _block$2) {
        var self = _block$2;
        switch (self._) {
            case 'List.cons':
                var $2727 = self.head;
                var $2728 = self.tail;
                var _head$5 = Kindelia$serialize$transaction$(_world$1, $2727);
                var _tail$6 = Kindelia$serialize$block$(_world$1, $2728);
                var $2729 = (_tail$6 + _head$5);
                var $2726 = $2729;
                break;
            case 'List.nil':
                var $2730 = Bits$e;
                var $2726 = $2730;
                break;
        };
        return $2726;
    };
    const Kindelia$serialize$block = x0 => x1 => Kindelia$serialize$block$(x0, x1);

    function Bits$is_empty$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $2732 = Bool$true;
                var $2731 = $2732;
                break;
            case 'o':
            case 'i':
                var $2733 = Bool$false;
                var $2731 = $2733;
                break;
        };
        return $2731;
    };
    const Bits$is_empty = x0 => Bits$is_empty$(x0);

    function Kindelia$deserialize$fixlen$(_size$1, _bits$2) {
        var self = _size$1;
        if (self === 0n) {
            var $2735 = Pair$new$(_bits$2, 0n);
            var $2734 = $2735;
        } else {
            var $2736 = (self - 1n);
            var self = _bits$2;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $2738 = self.slice(0, -1);
                    var self = Kindelia$deserialize$fixlen$($2736, $2738);
                    switch (self._) {
                        case 'Pair.new':
                            var $2740 = self.fst;
                            var $2741 = self.snd;
                            var $2742 = Pair$new$($2740, ($2741 * 2n));
                            var $2739 = $2742;
                            break;
                    };
                    var $2737 = $2739;
                    break;
                case 'i':
                    var $2743 = self.slice(0, -1);
                    var self = Kindelia$deserialize$fixlen$($2736, $2743);
                    switch (self._) {
                        case 'Pair.new':
                            var $2745 = self.fst;
                            var $2746 = self.snd;
                            var $2747 = Pair$new$($2745, (($2746 * 2n) + 1n));
                            var $2744 = $2747;
                            break;
                    };
                    var $2737 = $2744;
                    break;
                case 'e':
                    var $2748 = Pair$new$(Bits$e, 0n);
                    var $2737 = $2748;
                    break;
            };
            var $2734 = $2737;
        };
        return $2734;
    };
    const Kindelia$deserialize$fixlen = x0 => x1 => Kindelia$deserialize$fixlen$(x0, x1);
    const U16$from_nat = a0 => (Number(a0) & 0xFFFF);

    function Kindelia$deserialize$name$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2750 = self.slice(0, -1);
                var $2751 = Pair$new$($2750, "");
                var $2749 = $2751;
                break;
            case 'i':
                var $2752 = self.slice(0, -1);
                var self = Kindelia$deserialize$fixlen$(6n, $2752);
                switch (self._) {
                    case 'Pair.new':
                        var $2754 = self.fst;
                        var $2755 = self.snd;
                        var self = Kindelia$deserialize$name$($2754);
                        switch (self._) {
                            case 'Pair.new':
                                var $2757 = self.fst;
                                var $2758 = self.snd;
                                var _numb$7 = (Number($2755) & 0xFFFF);
                                var self = U16$btw$(0, _numb$7, 9);
                                if (self) {
                                    var $2760 = ((_numb$7 + 48) & 0xFFFF);
                                    var _head$8 = $2760;
                                } else {
                                    var self = U16$btw$(10, _numb$7, 35);
                                    if (self) {
                                        var $2762 = ((((_numb$7 - 10) & 0xFFFF) + 65) & 0xFFFF);
                                        var $2761 = $2762;
                                    } else {
                                        var self = U16$btw$(36, _numb$7, 61);
                                        if (self) {
                                            var $2764 = ((((_numb$7 - 36) & 0xFFFF) + 97) & 0xFFFF);
                                            var $2763 = $2764;
                                        } else {
                                            var self = U16$btw$(62, _numb$7, 62);
                                            if (self) {
                                                var $2766 = 95;
                                                var $2765 = $2766;
                                            } else {
                                                var $2767 = 46;
                                                var $2765 = $2767;
                                            };
                                            var $2763 = $2765;
                                        };
                                        var $2761 = $2763;
                                    };
                                    var _head$8 = $2761;
                                };
                                var $2759 = Pair$new$($2757, String$cons$(_head$8, $2758));
                                var $2756 = $2759;
                                break;
                        };
                        var $2753 = $2756;
                        break;
                };
                var $2749 = $2753;
                break;
            case 'e':
                var $2768 = Pair$new$(Bits$e, "");
                var $2749 = $2768;
                break;
        };
        return $2749;
    };
    const Kindelia$deserialize$name = x0 => Kindelia$deserialize$name$(x0);

    function Kindelia$deserialize$list$(_item$2, _bits$3) {
        var self = _bits$3;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2770 = self.slice(0, -1);
                var $2771 = Pair$new$($2770, List$nil);
                var $2769 = $2771;
                break;
            case 'i':
                var $2772 = self.slice(0, -1);
                var self = _item$2($2772);
                switch (self._) {
                    case 'Pair.new':
                        var $2774 = self.fst;
                        var $2775 = self.snd;
                        var self = Kindelia$deserialize$list$(_item$2, $2774);
                        switch (self._) {
                            case 'Pair.new':
                                var $2777 = self.fst;
                                var $2778 = self.snd;
                                var $2779 = Pair$new$($2777, List$cons$($2775, $2778));
                                var $2776 = $2779;
                                break;
                        };
                        var $2773 = $2776;
                        break;
                };
                var $2769 = $2773;
                break;
            case 'e':
                var $2780 = Pair$new$(Bits$e, List$nil);
                var $2769 = $2780;
                break;
        };
        return $2769;
    };
    const Kindelia$deserialize$list = x0 => x1 => Kindelia$deserialize$list$(x0, x1);

    function Kindelia$deserialize$pair$(_first$3, _second$4, _bits$5) {
        var self = _first$3(_bits$5);
        switch (self._) {
            case 'Pair.new':
                var $2782 = self.fst;
                var $2783 = self.snd;
                var self = _second$4($2782);
                switch (self._) {
                    case 'Pair.new':
                        var $2785 = self.fst;
                        var $2786 = self.snd;
                        var $2787 = Pair$new$($2785, Pair$new$($2783, $2786));
                        var $2784 = $2787;
                        break;
                };
                var $2781 = $2784;
                break;
        };
        return $2781;
    };
    const Kindelia$deserialize$pair = x0 => x1 => x2 => Kindelia$deserialize$pair$(x0, x1, x2);

    function Kindelia$deserialize$type$(_world$1, _bits$2) {
        var self = Kindelia$deserialize$fixlen$(1n, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $2789 = self.fst;
                var $2790 = self.snd;
                var self = ($2790 === 0n);
                if (self) {
                    var $2792 = Pair$new$($2789, Kindelia$Type$word);
                    var $2791 = $2792;
                } else {
                    var self = ($2790 === 1n);
                    if (self) {
                        var self = Kindelia$deserialize$name$($2789);
                        switch (self._) {
                            case 'Pair.new':
                                var $2795 = self.fst;
                                var $2796 = self.snd;
                                var $2797 = Pair$new$($2795, Kindelia$Type$data$($2796));
                                var $2794 = $2797;
                                break;
                        };
                        var $2793 = $2794;
                    } else {
                        var $2798 = Pair$new$($2789, Kindelia$Type$word);
                        var $2793 = $2798;
                    };
                    var $2791 = $2793;
                };
                var $2788 = $2791;
                break;
        };
        return $2788;
    };
    const Kindelia$deserialize$type = x0 => x1 => Kindelia$deserialize$type$(x0, x1);

    function Kindelia$deserialize$constructor$(_world$1, _bits$2) {
        var self = Kindelia$deserialize$name$(_bits$2);
        switch (self._) {
            case 'Pair.new':
                var $2800 = self.fst;
                var $2801 = self.snd;
                var self = Kindelia$deserialize$list$(Kindelia$deserialize$pair(Kindelia$deserialize$name)(Kindelia$deserialize$type(_world$1)), $2800);
                switch (self._) {
                    case 'Pair.new':
                        var $2803 = self.fst;
                        var $2804 = self.snd;
                        var $2805 = Pair$new$($2803, Kindelia$Constructor$new$($2801, $2804));
                        var $2802 = $2805;
                        break;
                };
                var $2799 = $2802;
                break;
        };
        return $2799;
    };
    const Kindelia$deserialize$constructor = x0 => x1 => Kindelia$deserialize$constructor$(x0, x1);

    function Kindelia$deserialize$data$(_world$1, _bits$2) {
        var self = Kindelia$deserialize$name$(_bits$2);
        switch (self._) {
            case 'Pair.new':
                var $2807 = self.fst;
                var $2808 = self.snd;
                var self = Kindelia$deserialize$list$(Kindelia$deserialize$constructor(_world$1), $2807);
                switch (self._) {
                    case 'Pair.new':
                        var $2810 = self.fst;
                        var $2811 = self.snd;
                        var $2812 = Pair$new$($2810, Kindelia$Data$new$($2808, $2811));
                        var $2809 = $2812;
                        break;
                };
                var $2806 = $2809;
                break;
        };
        return $2806;
    };
    const Kindelia$deserialize$data = x0 => x1 => Kindelia$deserialize$data$(x0, x1);
    const U64$from_nat = a0 => (a0 & 0xFFFFFFFFFFFFFFFFn);

    function Kindelia$deserialize$varlen$go$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2814 = self.slice(0, -1);
                var $2815 = Pair$new$($2814, 1n);
                var $2813 = $2815;
                break;
            case 'i':
                var $2816 = self.slice(0, -1);
                var self = $2816;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $2818 = self.slice(0, -1);
                        var self = Kindelia$deserialize$varlen$go$($2818);
                        switch (self._) {
                            case 'Pair.new':
                                var $2820 = self.fst;
                                var $2821 = self.snd;
                                var $2822 = Pair$new$($2820, ($2821 * 2n));
                                var $2819 = $2822;
                                break;
                        };
                        var $2817 = $2819;
                        break;
                    case 'i':
                        var $2823 = self.slice(0, -1);
                        var self = Kindelia$deserialize$varlen$go$($2823);
                        switch (self._) {
                            case 'Pair.new':
                                var $2825 = self.fst;
                                var $2826 = self.snd;
                                var $2827 = Pair$new$($2825, (($2826 * 2n) + 1n));
                                var $2824 = $2827;
                                break;
                        };
                        var $2817 = $2824;
                        break;
                    case 'e':
                        var $2828 = Pair$new$($2816, 0n);
                        var $2817 = $2828;
                        break;
                };
                var $2813 = $2817;
                break;
            case 'e':
                var $2829 = Pair$new$(Bits$e, 0n);
                var $2813 = $2829;
                break;
        };
        return $2813;
    };
    const Kindelia$deserialize$varlen$go = x0 => Kindelia$deserialize$varlen$go$(x0);

    function Kindelia$deserialize$varlen$(_bits$1) {
        var self = Kindelia$deserialize$varlen$go$(_bits$1);
        switch (self._) {
            case 'Pair.new':
                var $2831 = self.fst;
                var $2832 = self.snd;
                var $2833 = Pair$new$($2831, ($2832 - 1n <= 0n ? 0n : $2832 - 1n));
                var $2830 = $2833;
                break;
        };
        return $2830;
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
                        var $2834 = self.head;
                        var $2835 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $2837 = Maybe$some$($2834);
                            var $2836 = $2837;
                        } else {
                            var $2838 = (self - 1n);
                            var $2839 = List$get$($2838, $2835);
                            var $2836 = $2839;
                        };
                        return $2836;
                    case 'List.nil':
                        var $2840 = Maybe$none;
                        return $2840;
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
                var $2842 = self.fst;
                var $2843 = self.snd;
                var $2844 = Pair$new$($2842, Maybe$default$(List$get$($2843, _vars$2), ""));
                var $2841 = $2844;
                break;
        };
        return $2841;
    };
    const Kindelia$deserialize$name$local = x0 => x1 => x2 => Kindelia$deserialize$name$local$(x0, x1, x2);

    function Kindelia$deserialize$cases$(_world$1, _vars$2, _name$3, _ctors$4, _bits$5) {
        var self = _ctors$4;
        switch (self._) {
            case 'List.cons':
                var $2846 = self.head;
                var $2847 = self.tail;
                var _flds$8 = List$map$((_args$8 => {
                    var $2849 = (_name$3 + ("." + (() => {
                        var self = _args$8;
                        switch (self._) {
                            case 'Pair.new':
                                var $2850 = self.fst;
                                var $2851 = $2850;
                                return $2851;
                        };
                    })()));
                    return $2849;
                }), (() => {
                    var self = $2846;
                    switch (self._) {
                        case 'Kindelia.Constructor.new':
                            var $2852 = self.args;
                            var $2853 = $2852;
                            return $2853;
                    };
                })());
                var self = Kindelia$deserialize$term$(_world$1, List$concat$(List$reverse$(_flds$8), _vars$2), _bits$5);
                switch (self._) {
                    case 'Pair.new':
                        var $2854 = self.fst;
                        var $2855 = self.snd;
                        var self = Kindelia$deserialize$cases$(_world$1, _vars$2, _name$3, $2847, $2854);
                        switch (self._) {
                            case 'Pair.new':
                                var $2857 = self.fst;
                                var $2858 = self.snd;
                                var $2859 = Pair$new$($2857, List$cons$($2855, $2858));
                                var $2856 = $2859;
                                break;
                        };
                        var $2848 = $2856;
                        break;
                };
                var $2845 = $2848;
                break;
            case 'List.nil':
                var $2860 = Pair$new$(_bits$5, List$nil);
                var $2845 = $2860;
                break;
        };
        return $2845;
    };
    const Kindelia$deserialize$cases = x0 => x1 => x2 => x3 => x4 => Kindelia$deserialize$cases$(x0, x1, x2, x3, x4);

    function Kindelia$deserialize$term$(_world$1, _vars$2, _bits$3) {
        var self = _bits$3;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2862 = self.slice(0, -1);
                var self = Kindelia$deserialize$name$local$(_world$1, _vars$2, $2862);
                switch (self._) {
                    case 'Pair.new':
                        var $2864 = self.fst;
                        var $2865 = self.snd;
                        var $2866 = Pair$new$($2864, Kindelia$Term$var$($2865));
                        var $2863 = $2866;
                        break;
                };
                var $2861 = $2863;
                break;
            case 'i':
                var $2867 = self.slice(0, -1);
                var self = Kindelia$deserialize$fixlen$(3n, $2867);
                switch (self._) {
                    case 'Pair.new':
                        var $2869 = self.fst;
                        var $2870 = self.snd;
                        var self = ($2870 === 0n);
                        if (self) {
                            var self = Kindelia$deserialize$name$($2869);
                            switch (self._) {
                                case 'Pair.new':
                                    var $2873 = self.fst;
                                    var $2874 = self.snd;
                                    var self = Kindelia$deserialize$type$(_world$1, $2873);
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $2876 = self.fst;
                                            var $2877 = self.snd;
                                            var self = Kindelia$deserialize$term$(_world$1, _vars$2, $2876);
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $2879 = self.fst;
                                                    var $2880 = self.snd;
                                                    var self = Kindelia$deserialize$term$(_world$1, List$cons$($2874, _vars$2), $2879);
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $2882 = self.fst;
                                                            var $2883 = self.snd;
                                                            var $2884 = Pair$new$($2882, Kindelia$Term$let$($2874, $2877, $2880, $2883));
                                                            var $2881 = $2884;
                                                            break;
                                                    };
                                                    var $2878 = $2881;
                                                    break;
                                            };
                                            var $2875 = $2878;
                                            break;
                                    };
                                    var $2872 = $2875;
                                    break;
                            };
                            var $2871 = $2872;
                        } else {
                            var self = ($2870 === 1n);
                            if (self) {
                                var self = Kindelia$deserialize$name$($2869);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2887 = self.fst;
                                        var $2888 = self.snd;
                                        var self = Kindelia$deserialize$list$(Kindelia$deserialize$term(_world$1)(_vars$2), $2887);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $2890 = self.fst;
                                                var $2891 = self.snd;
                                                var $2892 = Pair$new$($2890, Kindelia$Term$call$($2888, $2891));
                                                var $2889 = $2892;
                                                break;
                                        };
                                        var $2886 = $2889;
                                        break;
                                };
                                var $2885 = $2886;
                            } else {
                                var self = ($2870 === 2n);
                                if (self) {
                                    var self = Kindelia$deserialize$varlen$($2869);
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $2895 = self.fst;
                                            var $2896 = self.snd;
                                            var self = Kindelia$deserialize$list$(Kindelia$deserialize$term(_world$1)(_vars$2), $2895);
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $2898 = self.fst;
                                                    var $2899 = self.snd;
                                                    var $2900 = Pair$new$($2898, Kindelia$Term$create$($2896, $2899));
                                                    var $2897 = $2900;
                                                    break;
                                            };
                                            var $2894 = $2897;
                                            break;
                                    };
                                    var $2893 = $2894;
                                } else {
                                    var self = ($2870 === 3n);
                                    if (self) {
                                        var self = Kindelia$deserialize$name$local$(_world$1, _vars$2, $2869);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $2903 = self.fst;
                                                var $2904 = self.snd;
                                                var self = Kindelia$deserialize$name$($2903);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $2906 = self.fst;
                                                        var $2907 = self.snd;
                                                        var self = Kindelia$deserialize$cases$(_world$1, _vars$2, $2904, Maybe$default$(Kindelia$get_ctrs$(_world$1, $2907), List$nil), $2906);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $2909 = self.fst;
                                                                var $2910 = self.snd;
                                                                var $2911 = Pair$new$($2909, Kindelia$Term$match$($2904, $2907, $2910));
                                                                var $2908 = $2911;
                                                                break;
                                                        };
                                                        var $2905 = $2908;
                                                        break;
                                                };
                                                var $2902 = $2905;
                                                break;
                                        };
                                        var $2901 = $2902;
                                    } else {
                                        var self = ($2870 === 4n);
                                        if (self) {
                                            var self = Kindelia$deserialize$fixlen$(64n, $2869);
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $2914 = self.fst;
                                                    var $2915 = self.snd;
                                                    var $2916 = Pair$new$($2914, Kindelia$Term$word$(($2915 & 0xFFFFFFFFFFFFFFFFn)));
                                                    var $2913 = $2916;
                                                    break;
                                            };
                                            var $2912 = $2913;
                                        } else {
                                            var self = ($2870 === 5n);
                                            if (self) {
                                                var self = Kindelia$deserialize$term$(_world$1, _vars$2, $2869);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $2919 = self.fst;
                                                        var $2920 = self.snd;
                                                        var self = Kindelia$deserialize$term$(_world$1, _vars$2, $2919);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $2922 = self.fst;
                                                                var $2923 = self.snd;
                                                                var self = Kindelia$deserialize$term$(_world$1, _vars$2, $2922);
                                                                switch (self._) {
                                                                    case 'Pair.new':
                                                                        var $2925 = self.fst;
                                                                        var $2926 = self.snd;
                                                                        var self = Kindelia$deserialize$term$(_world$1, _vars$2, $2925);
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $2928 = self.fst;
                                                                                var $2929 = self.snd;
                                                                                var self = Kindelia$deserialize$term$(_world$1, _vars$2, $2928);
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $2931 = self.fst;
                                                                                        var $2932 = self.snd;
                                                                                        var $2933 = Pair$new$($2931, Kindelia$Term$compare$($2920, $2923, $2926, $2929, $2932));
                                                                                        var $2930 = $2933;
                                                                                        break;
                                                                                };
                                                                                var $2927 = $2930;
                                                                                break;
                                                                        };
                                                                        var $2924 = $2927;
                                                                        break;
                                                                };
                                                                var $2921 = $2924;
                                                                break;
                                                        };
                                                        var $2918 = $2921;
                                                        break;
                                                };
                                                var $2917 = $2918;
                                            } else {
                                                var self = ($2870 === 6n);
                                                if (self) {
                                                    var self = Kindelia$deserialize$fixlen$(3n, $2869);
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $2936 = self.fst;
                                                            var $2937 = self.snd;
                                                            var self = Kindelia$deserialize$term$(_world$1, _vars$2, $2936);
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $2939 = self.fst;
                                                                    var $2940 = self.snd;
                                                                    var self = Kindelia$deserialize$term$(_world$1, _vars$2, $2939);
                                                                    switch (self._) {
                                                                        case 'Pair.new':
                                                                            var $2942 = self.fst;
                                                                            var $2943 = self.snd;
                                                                            var self = ($2937 === 0n);
                                                                            if (self) {
                                                                                var $2945 = Kindelia$Operation$add;
                                                                                var _oper$13 = $2945;
                                                                            } else {
                                                                                var self = ($2937 === 1n);
                                                                                if (self) {
                                                                                    var $2947 = Kindelia$Operation$sub;
                                                                                    var $2946 = $2947;
                                                                                } else {
                                                                                    var self = ($2937 === 2n);
                                                                                    if (self) {
                                                                                        var $2949 = Kindelia$Operation$mul;
                                                                                        var $2948 = $2949;
                                                                                    } else {
                                                                                        var self = ($2937 === 3n);
                                                                                        if (self) {
                                                                                            var $2951 = Kindelia$Operation$div;
                                                                                            var $2950 = $2951;
                                                                                        } else {
                                                                                            var self = ($2937 === 4n);
                                                                                            if (self) {
                                                                                                var $2953 = Kindelia$Operation$mod;
                                                                                                var $2952 = $2953;
                                                                                            } else {
                                                                                                var self = ($2937 === 5n);
                                                                                                if (self) {
                                                                                                    var $2955 = Kindelia$Operation$or;
                                                                                                    var $2954 = $2955;
                                                                                                } else {
                                                                                                    var self = ($2937 === 6n);
                                                                                                    if (self) {
                                                                                                        var $2957 = Kindelia$Operation$and;
                                                                                                        var $2956 = $2957;
                                                                                                    } else {
                                                                                                        var self = ($2937 === 7n);
                                                                                                        if (self) {
                                                                                                            var $2959 = Kindelia$Operation$xor;
                                                                                                            var $2958 = $2959;
                                                                                                        } else {
                                                                                                            var $2960 = Kindelia$Operation$add;
                                                                                                            var $2958 = $2960;
                                                                                                        };
                                                                                                        var $2956 = $2958;
                                                                                                    };
                                                                                                    var $2954 = $2956;
                                                                                                };
                                                                                                var $2952 = $2954;
                                                                                            };
                                                                                            var $2950 = $2952;
                                                                                        };
                                                                                        var $2948 = $2950;
                                                                                    };
                                                                                    var $2946 = $2948;
                                                                                };
                                                                                var _oper$13 = $2946;
                                                                            };
                                                                            var $2944 = Pair$new$($2942, Kindelia$Term$operate$(_oper$13, $2940, $2943));
                                                                            var $2941 = $2944;
                                                                            break;
                                                                    };
                                                                    var $2938 = $2941;
                                                                    break;
                                                            };
                                                            var $2935 = $2938;
                                                            break;
                                                    };
                                                    var $2934 = $2935;
                                                } else {
                                                    var self = ($2870 === 7n);
                                                    if (self) {
                                                        var self = Kindelia$deserialize$name$($2869);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $2963 = self.fst;
                                                                var $2964 = self.snd;
                                                                var self = Kindelia$deserialize$term$(_world$1, _vars$2, $2963);
                                                                switch (self._) {
                                                                    case 'Pair.new':
                                                                        var $2966 = self.fst;
                                                                        var $2967 = self.snd;
                                                                        var self = Kindelia$deserialize$term$(_world$1, _vars$2, $2966);
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $2969 = self.fst;
                                                                                var $2970 = self.snd;
                                                                                var $2971 = Pair$new$($2969, Kindelia$Term$bind$($2964, $2967, $2970));
                                                                                var $2968 = $2971;
                                                                                break;
                                                                        };
                                                                        var $2965 = $2968;
                                                                        break;
                                                                };
                                                                var $2962 = $2965;
                                                                break;
                                                        };
                                                        var $2961 = $2962;
                                                    } else {
                                                        var $2972 = Pair$new$($2869, Kindelia$Term$word$(0n));
                                                        var $2961 = $2972;
                                                    };
                                                    var $2934 = $2961;
                                                };
                                                var $2917 = $2934;
                                            };
                                            var $2912 = $2917;
                                        };
                                        var $2901 = $2912;
                                    };
                                    var $2893 = $2901;
                                };
                                var $2885 = $2893;
                            };
                            var $2871 = $2885;
                        };
                        var $2868 = $2871;
                        break;
                };
                var $2861 = $2868;
                break;
            case 'e':
                var $2973 = Pair$new$(_bits$3, Kindelia$Term$word$(0n));
                var $2861 = $2973;
                break;
        };
        return $2861;
    };
    const Kindelia$deserialize$term = x0 => x1 => x2 => Kindelia$deserialize$term$(x0, x1, x2);

    function Kindelia$deserialize$bond$(_world$1, _bits$2) {
        var self = Kindelia$deserialize$name$(_bits$2);
        switch (self._) {
            case 'Pair.new':
                var $2975 = self.fst;
                var $2976 = self.snd;
                var self = Kindelia$deserialize$list$(Kindelia$deserialize$name, $2975);
                switch (self._) {
                    case 'Pair.new':
                        var $2978 = self.fst;
                        var $2979 = self.snd;
                        var self = Kindelia$deserialize$list$(Kindelia$deserialize$pair(Kindelia$deserialize$name)(Kindelia$deserialize$type(_world$1)), $2978);
                        switch (self._) {
                            case 'Pair.new':
                                var $2981 = self.fst;
                                var $2982 = self.snd;
                                var self = Kindelia$deserialize$type$(_world$1, $2981);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2984 = self.fst;
                                        var $2985 = self.snd;
                                        var _inam$11 = List$reverse$(List$mapped$($2982, Pair$fst));
                                        var self = Kindelia$deserialize$term$(_world$1, _inam$11, $2984);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $2987 = self.fst;
                                                var $2988 = self.snd;
                                                var $2989 = Pair$new$($2987, Kindelia$Bond$new$($2976, $2979, $2982, $2985, $2988));
                                                var $2986 = $2989;
                                                break;
                                        };
                                        var $2983 = $2986;
                                        break;
                                };
                                var $2980 = $2983;
                                break;
                        };
                        var $2977 = $2980;
                        break;
                };
                var $2974 = $2977;
                break;
        };
        return $2974;
    };
    const Kindelia$deserialize$bond = x0 => x1 => Kindelia$deserialize$bond$(x0, x1);

    function Kindelia$deserialize$maybe$(_item$2, _bits$3) {
        var self = _bits$3;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2991 = self.slice(0, -1);
                var $2992 = Pair$new$($2991, Maybe$none);
                var $2990 = $2992;
                break;
            case 'i':
                var $2993 = self.slice(0, -1);
                var self = _item$2($2993);
                switch (self._) {
                    case 'Pair.new':
                        var $2995 = self.fst;
                        var $2996 = self.snd;
                        var $2997 = Pair$new$($2995, Maybe$some$($2996));
                        var $2994 = $2997;
                        break;
                };
                var $2990 = $2994;
                break;
            case 'e':
                var $2998 = Pair$new$(Bits$e, Maybe$none);
                var $2990 = $2998;
                break;
        };
        return $2990;
    };
    const Kindelia$deserialize$maybe = x0 => x1 => Kindelia$deserialize$maybe$(x0, x1);

    function Kindelia$deserialize$auth$(_world$1, _bits$2) {
        var self = Kindelia$deserialize$name$(_bits$2);
        switch (self._) {
            case 'Pair.new':
                var $3000 = self.fst;
                var $3001 = self.snd;
                var self = Kindelia$deserialize$list$(Kindelia$deserialize$term(_world$1)(List$nil), $3000);
                switch (self._) {
                    case 'Pair.new':
                        var $3003 = self.fst;
                        var $3004 = self.snd;
                        var $3005 = Pair$new$($3003, Kindelia$Auth$new$($3001, $3004));
                        var $3002 = $3005;
                        break;
                };
                var $2999 = $3002;
                break;
        };
        return $2999;
    };
    const Kindelia$deserialize$auth = x0 => x1 => Kindelia$deserialize$auth$(x0, x1);

    function Kindelia$deserialize$eval$(_world$1, _bits$2) {
        var self = Kindelia$deserialize$maybe$(Kindelia$deserialize$auth(_world$1), _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $3007 = self.fst;
                var $3008 = self.snd;
                var self = Kindelia$deserialize$term$(_world$1, List$nil, $3007);
                switch (self._) {
                    case 'Pair.new':
                        var $3010 = self.fst;
                        var $3011 = self.snd;
                        var self = Kindelia$deserialize$type$(_world$1, $3010);
                        switch (self._) {
                            case 'Pair.new':
                                var $3013 = self.fst;
                                var $3014 = self.snd;
                                var $3015 = Pair$new$($3013, Kindelia$Eval$new$($3008, $3011, $3014));
                                var $3012 = $3015;
                                break;
                        };
                        var $3009 = $3012;
                        break;
                };
                var $3006 = $3009;
                break;
        };
        return $3006;
    };
    const Kindelia$deserialize$eval = x0 => x1 => Kindelia$deserialize$eval$(x0, x1);

    function Kindelia$deserialize$transaction$(_world$1, _bits$2) {
        var self = Kindelia$deserialize$fixlen$(2n, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $3017 = self.fst;
                var $3018 = self.snd;
                var self = ($3018 === 0n);
                if (self) {
                    var self = Kindelia$deserialize$data$(_world$1, $3017);
                    switch (self._) {
                        case 'Pair.new':
                            var $3021 = self.fst;
                            var $3022 = self.snd;
                            var $3023 = Pair$new$($3021, Kindelia$Transaction$new_data$($3022));
                            var $3020 = $3023;
                            break;
                    };
                    var $3019 = $3020;
                } else {
                    var self = ($3018 === 1n);
                    if (self) {
                        var self = Kindelia$deserialize$bond$(_world$1, $3017);
                        switch (self._) {
                            case 'Pair.new':
                                var $3026 = self.fst;
                                var $3027 = self.snd;
                                var $3028 = Pair$new$($3026, Kindelia$Transaction$new_bond$($3027));
                                var $3025 = $3028;
                                break;
                        };
                        var $3024 = $3025;
                    } else {
                        var self = ($3018 === 2n);
                        if (self) {
                            var self = Kindelia$deserialize$eval$(_world$1, $3017);
                            switch (self._) {
                                case 'Pair.new':
                                    var $3031 = self.fst;
                                    var $3032 = self.snd;
                                    var $3033 = Pair$new$($3031, Kindelia$Transaction$new_eval$($3032));
                                    var $3030 = $3033;
                                    break;
                            };
                            var $3029 = $3030;
                        } else {
                            var self = ($3018 === 3n);
                            if (self) {
                                var self = Kindelia$deserialize$name$($3017);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $3036 = self.fst;
                                        var $3037 = self.snd;
                                        var $3038 = Pair$new$($3036, Kindelia$Transaction$new_name$($3037));
                                        var $3035 = $3038;
                                        break;
                                };
                                var $3034 = $3035;
                            } else {
                                var $3039 = Pair$new$($3017, Kindelia$Transaction$new_data$(Kindelia$Data$new$("", List$nil)));
                                var $3034 = $3039;
                            };
                            var $3029 = $3034;
                        };
                        var $3024 = $3029;
                    };
                    var $3019 = $3024;
                };
                var $3016 = $3019;
                break;
        };
        return $3016;
    };
    const Kindelia$deserialize$transaction = x0 => x1 => Kindelia$deserialize$transaction$(x0, x1);

    function Kindelia$deserialize$block$(_world$1, _bits$2) {
        var self = Bits$is_empty$(_bits$2);
        if (self) {
            var $3041 = Pair$new$(Bits$e, List$nil);
            var $3040 = $3041;
        } else {
            var self = Kindelia$deserialize$transaction$(_world$1, _bits$2);
            switch (self._) {
                case 'Pair.new':
                    var $3043 = self.fst;
                    var $3044 = self.snd;
                    var self = Kindelia$deserialize$block$(_world$1, $3043);
                    switch (self._) {
                        case 'Pair.new':
                            var $3046 = self.fst;
                            var $3047 = self.snd;
                            var $3048 = Pair$new$($3046, List$cons$($3044, $3047));
                            var $3045 = $3048;
                            break;
                    };
                    var $3042 = $3045;
                    break;
            };
            var $3040 = $3042;
        };
        return $3040;
    };
    const Kindelia$deserialize$block = x0 => x1 => Kindelia$deserialize$block$(x0, x1);

    function Bits$hex$encode$(_x$1) {
        var self = _x$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $3050 = self.slice(0, -1);
                var self = $3050;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $3052 = self.slice(0, -1);
                        var self = $3052;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $3054 = self.slice(0, -1);
                                var self = $3054;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3056 = self.slice(0, -1);
                                        var $3057 = ("0" + Bits$hex$encode$($3056));
                                        var $3055 = $3057;
                                        break;
                                    case 'i':
                                        var $3058 = self.slice(0, -1);
                                        var $3059 = ("8" + Bits$hex$encode$($3058));
                                        var $3055 = $3059;
                                        break;
                                    case 'e':
                                        var $3060 = "0";
                                        var $3055 = $3060;
                                        break;
                                };
                                var $3053 = $3055;
                                break;
                            case 'i':
                                var $3061 = self.slice(0, -1);
                                var self = $3061;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3063 = self.slice(0, -1);
                                        var $3064 = ("4" + Bits$hex$encode$($3063));
                                        var $3062 = $3064;
                                        break;
                                    case 'i':
                                        var $3065 = self.slice(0, -1);
                                        var $3066 = ("c" + Bits$hex$encode$($3065));
                                        var $3062 = $3066;
                                        break;
                                    case 'e':
                                        var $3067 = "4";
                                        var $3062 = $3067;
                                        break;
                                };
                                var $3053 = $3062;
                                break;
                            case 'e':
                                var $3068 = "0";
                                var $3053 = $3068;
                                break;
                        };
                        var $3051 = $3053;
                        break;
                    case 'i':
                        var $3069 = self.slice(0, -1);
                        var self = $3069;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $3071 = self.slice(0, -1);
                                var self = $3071;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3073 = self.slice(0, -1);
                                        var $3074 = ("2" + Bits$hex$encode$($3073));
                                        var $3072 = $3074;
                                        break;
                                    case 'i':
                                        var $3075 = self.slice(0, -1);
                                        var $3076 = ("a" + Bits$hex$encode$($3075));
                                        var $3072 = $3076;
                                        break;
                                    case 'e':
                                        var $3077 = "2";
                                        var $3072 = $3077;
                                        break;
                                };
                                var $3070 = $3072;
                                break;
                            case 'i':
                                var $3078 = self.slice(0, -1);
                                var self = $3078;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3080 = self.slice(0, -1);
                                        var $3081 = ("6" + Bits$hex$encode$($3080));
                                        var $3079 = $3081;
                                        break;
                                    case 'i':
                                        var $3082 = self.slice(0, -1);
                                        var $3083 = ("e" + Bits$hex$encode$($3082));
                                        var $3079 = $3083;
                                        break;
                                    case 'e':
                                        var $3084 = "6";
                                        var $3079 = $3084;
                                        break;
                                };
                                var $3070 = $3079;
                                break;
                            case 'e':
                                var $3085 = "2";
                                var $3070 = $3085;
                                break;
                        };
                        var $3051 = $3070;
                        break;
                    case 'e':
                        var $3086 = "0";
                        var $3051 = $3086;
                        break;
                };
                var $3049 = $3051;
                break;
            case 'i':
                var $3087 = self.slice(0, -1);
                var self = $3087;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $3089 = self.slice(0, -1);
                        var self = $3089;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $3091 = self.slice(0, -1);
                                var self = $3091;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3093 = self.slice(0, -1);
                                        var $3094 = ("1" + Bits$hex$encode$($3093));
                                        var $3092 = $3094;
                                        break;
                                    case 'i':
                                        var $3095 = self.slice(0, -1);
                                        var $3096 = ("9" + Bits$hex$encode$($3095));
                                        var $3092 = $3096;
                                        break;
                                    case 'e':
                                        var $3097 = "1";
                                        var $3092 = $3097;
                                        break;
                                };
                                var $3090 = $3092;
                                break;
                            case 'i':
                                var $3098 = self.slice(0, -1);
                                var self = $3098;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3100 = self.slice(0, -1);
                                        var $3101 = ("5" + Bits$hex$encode$($3100));
                                        var $3099 = $3101;
                                        break;
                                    case 'i':
                                        var $3102 = self.slice(0, -1);
                                        var $3103 = ("d" + Bits$hex$encode$($3102));
                                        var $3099 = $3103;
                                        break;
                                    case 'e':
                                        var $3104 = "5";
                                        var $3099 = $3104;
                                        break;
                                };
                                var $3090 = $3099;
                                break;
                            case 'e':
                                var $3105 = "1";
                                var $3090 = $3105;
                                break;
                        };
                        var $3088 = $3090;
                        break;
                    case 'i':
                        var $3106 = self.slice(0, -1);
                        var self = $3106;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $3108 = self.slice(0, -1);
                                var self = $3108;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3110 = self.slice(0, -1);
                                        var $3111 = ("3" + Bits$hex$encode$($3110));
                                        var $3109 = $3111;
                                        break;
                                    case 'i':
                                        var $3112 = self.slice(0, -1);
                                        var $3113 = ("b" + Bits$hex$encode$($3112));
                                        var $3109 = $3113;
                                        break;
                                    case 'e':
                                        var $3114 = "3";
                                        var $3109 = $3114;
                                        break;
                                };
                                var $3107 = $3109;
                                break;
                            case 'i':
                                var $3115 = self.slice(0, -1);
                                var self = $3115;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3117 = self.slice(0, -1);
                                        var $3118 = ("7" + Bits$hex$encode$($3117));
                                        var $3116 = $3118;
                                        break;
                                    case 'i':
                                        var $3119 = self.slice(0, -1);
                                        var $3120 = ("f" + Bits$hex$encode$($3119));
                                        var $3116 = $3120;
                                        break;
                                    case 'e':
                                        var $3121 = "7";
                                        var $3116 = $3121;
                                        break;
                                };
                                var $3107 = $3116;
                                break;
                            case 'e':
                                var $3122 = "3";
                                var $3107 = $3122;
                                break;
                        };
                        var $3088 = $3107;
                        break;
                    case 'e':
                        var $3123 = "1";
                        var $3088 = $3123;
                        break;
                };
                var $3049 = $3088;
                break;
            case 'e':
                var $3124 = "";
                var $3049 = $3124;
                break;
        };
        return $3049;
    };
    const Bits$hex$encode = x0 => Bits$hex$encode$(x0);
    const Bits$eql = a0 => a1 => (a1 === a0);

    function Kindelia$Entry$data$(_value$1) {
        var $3125 = ({
            _: 'Kindelia.Entry.data',
            'value': _value$1
        });
        return $3125;
    };
    const Kindelia$Entry$data = x0 => Kindelia$Entry$data$(x0);

    function List$unzip$(_xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $3127 = self.head;
                var $3128 = self.tail;
                var _rec$6 = List$unzip$($3128);
                var self = $3127;
                switch (self._) {
                    case 'Pair.new':
                        var $3130 = self.fst;
                        var $3131 = self.snd;
                        var self = _rec$6;
                        switch (self._) {
                            case 'Pair.new':
                                var $3133 = self.fst;
                                var $3134 = self.snd;
                                var $3135 = Pair$new$(List$cons$($3130, $3133), List$cons$($3131, $3134));
                                var $3132 = $3135;
                                break;
                        };
                        var $3129 = $3132;
                        break;
                };
                var $3126 = $3129;
                break;
            case 'List.nil':
                var $3136 = Pair$new$(List$nil, List$nil);
                var $3126 = $3136;
                break;
        };
        return $3126;
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
                        var $3137 = self.head;
                        var $3138 = self.tail;
                        var $3139 = Kindelia$extend$(Map$set$((() => {
                            var self = $3137;
                            switch (self._) {
                                case 'Pair.new':
                                    var $3140 = self.fst;
                                    var $3141 = $3140;
                                    return $3141;
                            };
                        })(), (() => {
                            var self = $3137;
                            switch (self._) {
                                case 'Pair.new':
                                    var $3142 = self.snd;
                                    var $3143 = $3142;
                                    return $3143;
                            };
                        })(), _map$2), $3138);
                        return $3139;
                    case 'List.nil':
                        var $3144 = _map$2;
                        return $3144;
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
                        var $3145 = self.head;
                        var $3146 = self.tail;
                        var _key$8 = Pair$fst$($3145);
                        var _val$9 = Pair$snd$($3145);
                        var _new_acc$10 = BBT$insert$(_cmp$3, _key$8, _val$9, _acc$4);
                        var $3147 = BBT$from_list$go$(_cmp$3, _new_acc$10, $3146);
                        return $3147;
                    case 'List.nil':
                        var $3148 = _acc$4;
                        return $3148;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BBT$from_list$go = x0 => x1 => x2 => BBT$from_list$go$(x0, x1, x2);

    function BBT$from_list$(_cmp$3, _xs$4) {
        var $3149 = BBT$from_list$go$(_cmp$3, BBT$tip, _xs$4);
        return $3149;
    };
    const BBT$from_list = x0 => x1 => BBT$from_list$(x0, x1);

    function Map$from_list$(_xs$2) {
        var $3150 = BBT$from_list$(String$cmp, _xs$2);
        return $3150;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.cons':
                var $3152 = self.head;
                var $3153 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.cons':
                        var $3155 = self.head;
                        var $3156 = self.tail;
                        var $3157 = List$cons$(Pair$new$($3152, $3155), List$zip$($3153, $3156));
                        var $3154 = $3157;
                        break;
                    case 'List.nil':
                        var $3158 = List$nil;
                        var $3154 = $3158;
                        break;
                };
                var $3151 = $3154;
                break;
            case 'List.nil':
                var $3159 = List$nil;
                var $3151 = $3159;
                break;
        };
        return $3151;
    };
    const List$zip = x0 => x1 => List$zip$(x0, x1);

    function Kindelia$equal$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Kindelia.Type.data':
                var $3161 = self.name;
                var self = _b$2;
                switch (self._) {
                    case 'Kindelia.Type.data':
                        var $3163 = self.name;
                        var $3164 = ($3161 === $3163);
                        var $3162 = $3164;
                        break;
                    case 'Kindelia.Type.word':
                        var $3165 = Bool$false;
                        var $3162 = $3165;
                        break;
                };
                var $3160 = $3162;
                break;
            case 'Kindelia.Type.word':
                var self = _b$2;
                switch (self._) {
                    case 'Kindelia.Type.word':
                        var $3167 = Bool$true;
                        var $3166 = $3167;
                        break;
                    case 'Kindelia.Type.data':
                        var $3168 = Bool$false;
                        var $3166 = $3168;
                        break;
                };
                var $3160 = $3166;
                break;
        };
        return $3160;
    };
    const Kindelia$equal = x0 => x1 => Kindelia$equal$(x0, x1);

    function Kindelia$get_bond$(_world$1, _name$2) {
        var $3169 = Maybe$monad$((_m$bind$3 => _m$pure$4 => {
            var $3170 = _m$bind$3;
            return $3170;
        }))(Map$get$(_name$2, (() => {
            var self = _world$1;
            switch (self._) {
                case 'Kindelia.World.new':
                    var $3171 = self.entry;
                    var $3172 = $3171;
                    return $3172;
            };
        })()))((_entry$3 => {
            var self = _entry$3;
            switch (self._) {
                case 'Kindelia.Entry.bond':
                    var $3174 = self.value;
                    var $3175 = Maybe$some$($3174);
                    var $3173 = $3175;
                    break;
                case 'Kindelia.Entry.data':
                    var $3176 = Maybe$none;
                    var $3173 = $3176;
                    break;
            };
            return $3173;
        }));
        return $3169;
    };
    const Kindelia$get_bond = x0 => x1 => Kindelia$get_bond$(x0, x1);
    const List$length = a0 => (list_length(a0));

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
                        var $3177 = self.head;
                        var $3178 = self.tail;
                        var self = _cond$2($3177);
                        if (self) {
                            var $3180 = List$all$(_cond$2, $3178);
                            var $3179 = $3180;
                        } else {
                            var $3181 = Bool$false;
                            var $3179 = $3181;
                        };
                        return $3179;
                    case 'List.nil':
                        var $3182 = Bool$true;
                        return $3182;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$all = x0 => x1 => List$all$(x0, x1);

    function List$zip_with$(_f$4, _as$5, _bs$6) {
        var self = _as$5;
        switch (self._) {
            case 'List.cons':
                var $3184 = self.head;
                var $3185 = self.tail;
                var self = _bs$6;
                switch (self._) {
                    case 'List.cons':
                        var $3187 = self.head;
                        var $3188 = self.tail;
                        var $3189 = List$cons$(_f$4($3184)($3187), List$zip_with$(_f$4, $3185, $3188));
                        var $3186 = $3189;
                        break;
                    case 'List.nil':
                        var $3190 = List$nil;
                        var $3186 = $3190;
                        break;
                };
                var $3183 = $3186;
                break;
            case 'List.nil':
                var $3191 = List$nil;
                var $3183 = $3191;
                break;
        };
        return $3183;
    };
    const List$zip_with = x0 => x1 => x2 => List$zip_with$(x0, x1, x2);

    function List$zipped_with$(_as$3, _bs$4, _f$6) {
        var $3192 = List$zip_with$(_f$6, _as$3, _bs$4);
        return $3192;
    };
    const List$zipped_with = x0 => x1 => x2 => List$zipped_with$(x0, x1, x2);

    function List$and$(_list$1) {
        var $3193 = List$all$((_x$2 => {
            var $3194 = _x$2;
            return $3194;
        }), _list$1);
        return $3193;
    };
    const List$and = x0 => List$and$(x0);

    function List$is_empty$(_list$2) {
        var self = _list$2;
        switch (self._) {
            case 'List.nil':
                var $3196 = Bool$true;
                var $3195 = $3196;
                break;
            case 'List.cons':
                var $3197 = Bool$false;
                var $3195 = $3197;
                break;
        };
        return $3195;
    };
    const List$is_empty = x0 => List$is_empty$(x0);

    function Kindelia$check$(_context$1, _world$2, _term$3, _type$4) {
        var self = _context$1;
        switch (self._) {
            case 'BBT.tip':
                var self = _term$3;
                switch (self._) {
                    case 'Kindelia.Term.var':
                        var $3200 = self.name;
                        var self = Map$get$($3200, _context$1);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3202 = self.value;
                                var $3203 = Kindelia$equal$($3202, _type$4);
                                var $3201 = $3203;
                                break;
                            case 'Maybe.none':
                                var $3204 = Bool$false;
                                var $3201 = $3204;
                                break;
                        };
                        var $3199 = $3201;
                        break;
                    case 'Kindelia.Term.call':
                        var $3205 = self.bond;
                        var $3206 = self.args;
                        var self = Kindelia$get_bond$(_world$2, $3205);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3208 = self.value;
                                var _bond$8 = $3208;
                                var self = _bond$8;
                                switch (self._) {
                                    case 'Kindelia.Bond.new':
                                        var $3210 = self.args;
                                        var $3211 = self.otyp;
                                        var _size$14 = ((list_length($3206)) === (list_length($3210)));
                                        var _otyp$15 = Kindelia$equal$($3211, _type$4);
                                        var _args$16 = List$zip$($3206, List$map$((_x$16 => {
                                            var self = _x$16;
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $3214 = self.snd;
                                                    var $3215 = $3214;
                                                    var $3213 = $3215;
                                                    break;
                                            };
                                            return $3213;
                                        }), $3210));
                                        var _args$17 = List$all$((_x$17 => {
                                            var $3216 = Kindelia$check$(_context$1, _world$2, (() => {
                                                var self = _x$17;
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3217 = self.fst;
                                                        var $3218 = $3217;
                                                        return $3218;
                                                };
                                            })(), (() => {
                                                var self = _x$17;
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3219 = self.snd;
                                                        var $3220 = $3219;
                                                        return $3220;
                                                };
                                            })());
                                            return $3216;
                                        }), _args$16);
                                        var $3212 = (_size$14 && (_otyp$15 && _args$17));
                                        var $3209 = $3212;
                                        break;
                                };
                                var $3207 = $3209;
                                break;
                            case 'Maybe.none':
                                var $3221 = Bool$false;
                                var $3207 = $3221;
                                break;
                        };
                        var $3199 = $3207;
                        break;
                    case 'Kindelia.Term.let':
                        var $3222 = self.name;
                        var $3223 = self.type;
                        var $3224 = self.expr;
                        var $3225 = self.body;
                        var _expr$9 = Kindelia$check$(_context$1, _world$2, $3224, $3223);
                        var _body$10 = Kindelia$check$(Map$set$($3222, $3223, _context$1), _world$2, $3225, _type$4);
                        var $3226 = (_expr$9 && _body$10);
                        var $3199 = $3226;
                        break;
                    case 'Kindelia.Term.create':
                        var $3227 = self.ctor;
                        var $3228 = self.vals;
                        var self = _type$4;
                        switch (self._) {
                            case 'Kindelia.Type.data':
                                var $3230 = self.name;
                                var self = Kindelia$get_data$(_world$2, $3230);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $3232 = self.value;
                                        var _data$9 = $3232;
                                        var self = _data$9;
                                        switch (self._) {
                                            case 'Kindelia.Data.new':
                                                var $3234 = self.ctrs;
                                                var self = List$get$($3227, $3234);
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $3236 = self.value;
                                                        var _ctor$13 = $3236;
                                                        var self = _ctor$13;
                                                        switch (self._) {
                                                            case 'Kindelia.Constructor.new':
                                                                var $3238 = self.args;
                                                                var _size$16 = ((list_length($3228)) === (list_length($3238)));
                                                                var _vals$17 = List$zip$($3228, List$map$((_x$17 => {
                                                                    var self = _x$17;
                                                                    switch (self._) {
                                                                        case 'Pair.new':
                                                                            var $3241 = self.snd;
                                                                            var $3242 = $3241;
                                                                            var $3240 = $3242;
                                                                            break;
                                                                    };
                                                                    return $3240;
                                                                }), $3238));
                                                                var _vals$18 = List$all$((_x$18 => {
                                                                    var $3243 = Kindelia$check$(_context$1, _world$2, (() => {
                                                                        var self = _x$18;
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $3244 = self.fst;
                                                                                var $3245 = $3244;
                                                                                return $3245;
                                                                        };
                                                                    })(), (() => {
                                                                        var self = _x$18;
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $3246 = self.snd;
                                                                                var $3247 = $3246;
                                                                                return $3247;
                                                                        };
                                                                    })());
                                                                    return $3243;
                                                                }), _vals$17);
                                                                var $3239 = (_size$16 && _vals$18);
                                                                var $3237 = $3239;
                                                                break;
                                                        };
                                                        var $3235 = $3237;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $3248 = Bool$false;
                                                        var $3235 = $3248;
                                                        break;
                                                };
                                                var $3233 = $3235;
                                                break;
                                        };
                                        var $3231 = $3233;
                                        break;
                                    case 'Maybe.none':
                                        var $3249 = Bool$false;
                                        var $3231 = $3249;
                                        break;
                                };
                                var $3229 = $3231;
                                break;
                            case 'Kindelia.Type.word':
                                var $3250 = Bool$false;
                                var $3229 = $3250;
                                break;
                        };
                        var $3199 = $3229;
                        break;
                    case 'Kindelia.Term.match':
                        var $3251 = self.name;
                        var $3252 = self.data;
                        var $3253 = self.cses;
                        var self = Kindelia$get_data$(_world$2, $3252);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3255 = self.value;
                                var _data$9 = $3255;
                                var self = _data$9;
                                switch (self._) {
                                    case 'Kindelia.Data.new':
                                        var $3257 = self.ctrs;
                                        var _size$12 = ((list_length($3253)) === (list_length($3257)));
                                        var _expr$13 = Kindelia$check$(_context$1, _world$2, Kindelia$Term$var$($3251), Kindelia$Type$data$($3252));
                                        var _cses$14 = List$zipped_with$($3253, $3257, (_case_body$14 => _case_ctor$15 => {
                                            var _args$16 = List$map$((_arg$16 => {
                                                var $3260 = Pair$new$(($3251 + ("." + (() => {
                                                    var self = _arg$16;
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $3261 = self.fst;
                                                            var $3262 = $3261;
                                                            return $3262;
                                                    };
                                                })())), (() => {
                                                    var self = _arg$16;
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $3263 = self.snd;
                                                            var $3264 = $3263;
                                                            return $3264;
                                                    };
                                                })());
                                                return $3260;
                                            }), (() => {
                                                var self = _case_ctor$15;
                                                switch (self._) {
                                                    case 'Kindelia.Constructor.new':
                                                        var $3265 = self.args;
                                                        var $3266 = $3265;
                                                        return $3266;
                                                };
                                            })());
                                            var _ctx2$17 = Kindelia$extend$(_context$1, _args$16);
                                            var $3259 = Kindelia$check$(_ctx2$17, _world$2, _case_body$14, _type$4);
                                            return $3259;
                                        }));
                                        var $3258 = (_size$12 && List$and$(_cses$14));
                                        var $3256 = $3258;
                                        break;
                                };
                                var $3254 = $3256;
                                break;
                            case 'Maybe.none':
                                var $3267 = Bool$false;
                                var $3254 = $3267;
                                break;
                        };
                        var $3199 = $3254;
                        break;
                    case 'Kindelia.Term.compare':
                        var $3268 = self.val0;
                        var $3269 = self.val1;
                        var $3270 = self.iflt;
                        var $3271 = self.ifeq;
                        var $3272 = self.ifgt;
                        var _val0$10 = Kindelia$check$(_context$1, _world$2, $3268, Kindelia$Type$word);
                        var _val1$11 = Kindelia$check$(_context$1, _world$2, $3269, Kindelia$Type$word);
                        var _iflt$12 = Kindelia$check$(_context$1, _world$2, $3270, _type$4);
                        var _ifeq$13 = Kindelia$check$(_context$1, _world$2, $3271, _type$4);
                        var _ifgt$14 = Kindelia$check$(_context$1, _world$2, $3272, _type$4);
                        var $3273 = (_val0$10 && (_val1$11 && (_iflt$12 && (_ifeq$13 && _ifgt$14))));
                        var $3199 = $3273;
                        break;
                    case 'Kindelia.Term.operate':
                        var $3274 = self.val0;
                        var $3275 = self.val1;
                        var _val0$8 = Kindelia$check$(_context$1, _world$2, $3274, Kindelia$Type$word);
                        var _val1$9 = Kindelia$check$(_context$1, _world$2, $3275, Kindelia$Type$word);
                        var $3276 = (_val0$8 && _val1$9);
                        var $3199 = $3276;
                        break;
                    case 'Kindelia.Term.bind':
                        var $3277 = self.bond;
                        var $3278 = self.expr;
                        var $3279 = self.cont;
                        var self = Kindelia$get_bond$(_world$2, $3277);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3281 = self.value;
                                var _bond$9 = $3281;
                                var self = _bond$9;
                                switch (self._) {
                                    case 'Kindelia.Bond.new':
                                        var $3283 = self.args;
                                        var $3284 = self.otyp;
                                        var _notf$15 = List$is_empty$($3283);
                                        var _expr$16 = Kindelia$check$(_context$1, _world$2, $3278, $3284);
                                        var _cont$17 = Kindelia$check$(_context$1, _world$2, $3279, _type$4);
                                        var $3285 = (_notf$15 && (_expr$16 && _cont$17));
                                        var $3282 = $3285;
                                        break;
                                };
                                var $3280 = $3282;
                                break;
                            case 'Maybe.none':
                                var $3286 = Bool$false;
                                var $3280 = $3286;
                                break;
                        };
                        var $3199 = $3280;
                        break;
                    case 'Kindelia.Term.word':
                        var self = _type$4;
                        switch (self._) {
                            case 'Kindelia.Type.word':
                                var $3288 = Bool$true;
                                var $3287 = $3288;
                                break;
                            case 'Kindelia.Type.data':
                                var $3289 = Bool$false;
                                var $3287 = $3289;
                                break;
                        };
                        var $3199 = $3287;
                        break;
                };
                var $3198 = $3199;
                break;
            case 'BBT.bin':
                var self = _term$3;
                switch (self._) {
                    case 'Kindelia.Term.var':
                        var $3291 = self.name;
                        var self = Map$get$($3291, _context$1);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3293 = self.value;
                                var $3294 = Kindelia$equal$($3293, _type$4);
                                var $3292 = $3294;
                                break;
                            case 'Maybe.none':
                                var $3295 = Bool$false;
                                var $3292 = $3295;
                                break;
                        };
                        var $3290 = $3292;
                        break;
                    case 'Kindelia.Term.call':
                        var $3296 = self.bond;
                        var $3297 = self.args;
                        var self = Kindelia$get_bond$(_world$2, $3296);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3299 = self.value;
                                var _bond$13 = $3299;
                                var self = _bond$13;
                                switch (self._) {
                                    case 'Kindelia.Bond.new':
                                        var $3301 = self.args;
                                        var $3302 = self.otyp;
                                        var _size$19 = ((list_length($3297)) === (list_length($3301)));
                                        var _otyp$20 = Kindelia$equal$($3302, _type$4);
                                        var _args$21 = List$zip$($3297, List$map$((_x$21 => {
                                            var self = _x$21;
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $3305 = self.snd;
                                                    var $3306 = $3305;
                                                    var $3304 = $3306;
                                                    break;
                                            };
                                            return $3304;
                                        }), $3301));
                                        var _args$22 = List$all$((_x$22 => {
                                            var $3307 = Kindelia$check$(_context$1, _world$2, (() => {
                                                var self = _x$22;
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3308 = self.fst;
                                                        var $3309 = $3308;
                                                        return $3309;
                                                };
                                            })(), (() => {
                                                var self = _x$22;
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3310 = self.snd;
                                                        var $3311 = $3310;
                                                        return $3311;
                                                };
                                            })());
                                            return $3307;
                                        }), _args$21);
                                        var $3303 = (_size$19 && (_otyp$20 && _args$22));
                                        var $3300 = $3303;
                                        break;
                                };
                                var $3298 = $3300;
                                break;
                            case 'Maybe.none':
                                var $3312 = Bool$false;
                                var $3298 = $3312;
                                break;
                        };
                        var $3290 = $3298;
                        break;
                    case 'Kindelia.Term.let':
                        var $3313 = self.name;
                        var $3314 = self.type;
                        var $3315 = self.expr;
                        var $3316 = self.body;
                        var _expr$14 = Kindelia$check$(_context$1, _world$2, $3315, $3314);
                        var _body$15 = Kindelia$check$(Map$set$($3313, $3314, _context$1), _world$2, $3316, _type$4);
                        var $3317 = (_expr$14 && _body$15);
                        var $3290 = $3317;
                        break;
                    case 'Kindelia.Term.create':
                        var $3318 = self.ctor;
                        var $3319 = self.vals;
                        var self = _type$4;
                        switch (self._) {
                            case 'Kindelia.Type.data':
                                var $3321 = self.name;
                                var self = Kindelia$get_data$(_world$2, $3321);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $3323 = self.value;
                                        var _data$14 = $3323;
                                        var self = _data$14;
                                        switch (self._) {
                                            case 'Kindelia.Data.new':
                                                var $3325 = self.ctrs;
                                                var self = List$get$($3318, $3325);
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $3327 = self.value;
                                                        var _ctor$18 = $3327;
                                                        var self = _ctor$18;
                                                        switch (self._) {
                                                            case 'Kindelia.Constructor.new':
                                                                var $3329 = self.args;
                                                                var _size$21 = ((list_length($3319)) === (list_length($3329)));
                                                                var _vals$22 = List$zip$($3319, List$map$((_x$22 => {
                                                                    var self = _x$22;
                                                                    switch (self._) {
                                                                        case 'Pair.new':
                                                                            var $3332 = self.snd;
                                                                            var $3333 = $3332;
                                                                            var $3331 = $3333;
                                                                            break;
                                                                    };
                                                                    return $3331;
                                                                }), $3329));
                                                                var _vals$23 = List$all$((_x$23 => {
                                                                    var $3334 = Kindelia$check$(_context$1, _world$2, (() => {
                                                                        var self = _x$23;
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $3335 = self.fst;
                                                                                var $3336 = $3335;
                                                                                return $3336;
                                                                        };
                                                                    })(), (() => {
                                                                        var self = _x$23;
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $3337 = self.snd;
                                                                                var $3338 = $3337;
                                                                                return $3338;
                                                                        };
                                                                    })());
                                                                    return $3334;
                                                                }), _vals$22);
                                                                var $3330 = (_size$21 && _vals$23);
                                                                var $3328 = $3330;
                                                                break;
                                                        };
                                                        var $3326 = $3328;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $3339 = Bool$false;
                                                        var $3326 = $3339;
                                                        break;
                                                };
                                                var $3324 = $3326;
                                                break;
                                        };
                                        var $3322 = $3324;
                                        break;
                                    case 'Maybe.none':
                                        var $3340 = Bool$false;
                                        var $3322 = $3340;
                                        break;
                                };
                                var $3320 = $3322;
                                break;
                            case 'Kindelia.Type.word':
                                var $3341 = Bool$false;
                                var $3320 = $3341;
                                break;
                        };
                        var $3290 = $3320;
                        break;
                    case 'Kindelia.Term.match':
                        var $3342 = self.name;
                        var $3343 = self.data;
                        var $3344 = self.cses;
                        var self = Kindelia$get_data$(_world$2, $3343);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3346 = self.value;
                                var _data$14 = $3346;
                                var self = _data$14;
                                switch (self._) {
                                    case 'Kindelia.Data.new':
                                        var $3348 = self.ctrs;
                                        var _size$17 = ((list_length($3344)) === (list_length($3348)));
                                        var _expr$18 = Kindelia$check$(_context$1, _world$2, Kindelia$Term$var$($3342), Kindelia$Type$data$($3343));
                                        var _cses$19 = List$zipped_with$($3344, $3348, (_case_body$19 => _case_ctor$20 => {
                                            var _args$21 = List$map$((_arg$21 => {
                                                var $3351 = Pair$new$(($3342 + ("." + (() => {
                                                    var self = _arg$21;
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $3352 = self.fst;
                                                            var $3353 = $3352;
                                                            return $3353;
                                                    };
                                                })())), (() => {
                                                    var self = _arg$21;
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $3354 = self.snd;
                                                            var $3355 = $3354;
                                                            return $3355;
                                                    };
                                                })());
                                                return $3351;
                                            }), (() => {
                                                var self = _case_ctor$20;
                                                switch (self._) {
                                                    case 'Kindelia.Constructor.new':
                                                        var $3356 = self.args;
                                                        var $3357 = $3356;
                                                        return $3357;
                                                };
                                            })());
                                            var _ctx2$22 = Kindelia$extend$(_context$1, _args$21);
                                            var $3350 = Kindelia$check$(_ctx2$22, _world$2, _case_body$19, _type$4);
                                            return $3350;
                                        }));
                                        var $3349 = (_size$17 && List$and$(_cses$19));
                                        var $3347 = $3349;
                                        break;
                                };
                                var $3345 = $3347;
                                break;
                            case 'Maybe.none':
                                var $3358 = Bool$false;
                                var $3345 = $3358;
                                break;
                        };
                        var $3290 = $3345;
                        break;
                    case 'Kindelia.Term.compare':
                        var $3359 = self.val0;
                        var $3360 = self.val1;
                        var $3361 = self.iflt;
                        var $3362 = self.ifeq;
                        var $3363 = self.ifgt;
                        var _val0$15 = Kindelia$check$(_context$1, _world$2, $3359, Kindelia$Type$word);
                        var _val1$16 = Kindelia$check$(_context$1, _world$2, $3360, Kindelia$Type$word);
                        var _iflt$17 = Kindelia$check$(_context$1, _world$2, $3361, _type$4);
                        var _ifeq$18 = Kindelia$check$(_context$1, _world$2, $3362, _type$4);
                        var _ifgt$19 = Kindelia$check$(_context$1, _world$2, $3363, _type$4);
                        var $3364 = (_val0$15 && (_val1$16 && (_iflt$17 && (_ifeq$18 && _ifgt$19))));
                        var $3290 = $3364;
                        break;
                    case 'Kindelia.Term.operate':
                        var $3365 = self.val0;
                        var $3366 = self.val1;
                        var _val0$13 = Kindelia$check$(_context$1, _world$2, $3365, Kindelia$Type$word);
                        var _val1$14 = Kindelia$check$(_context$1, _world$2, $3366, Kindelia$Type$word);
                        var $3367 = (_val0$13 && _val1$14);
                        var $3290 = $3367;
                        break;
                    case 'Kindelia.Term.bind':
                        var $3368 = self.bond;
                        var $3369 = self.expr;
                        var $3370 = self.cont;
                        var self = Kindelia$get_bond$(_world$2, $3368);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3372 = self.value;
                                var _bond$14 = $3372;
                                var self = _bond$14;
                                switch (self._) {
                                    case 'Kindelia.Bond.new':
                                        var $3374 = self.args;
                                        var $3375 = self.otyp;
                                        var _notf$20 = List$is_empty$($3374);
                                        var _expr$21 = Kindelia$check$(_context$1, _world$2, $3369, $3375);
                                        var _cont$22 = Kindelia$check$(_context$1, _world$2, $3370, _type$4);
                                        var $3376 = (_notf$20 && (_expr$21 && _cont$22));
                                        var $3373 = $3376;
                                        break;
                                };
                                var $3371 = $3373;
                                break;
                            case 'Maybe.none':
                                var $3377 = Bool$false;
                                var $3371 = $3377;
                                break;
                        };
                        var $3290 = $3371;
                        break;
                    case 'Kindelia.Term.word':
                        var self = _type$4;
                        switch (self._) {
                            case 'Kindelia.Type.word':
                                var $3379 = Bool$true;
                                var $3378 = $3379;
                                break;
                            case 'Kindelia.Type.data':
                                var $3380 = Bool$false;
                                var $3378 = $3380;
                                break;
                        };
                        var $3290 = $3378;
                        break;
                };
                var $3198 = $3290;
                break;
        };
        return $3198;
    };
    const Kindelia$check = x0 => x1 => x2 => x3 => Kindelia$check$(x0, x1, x2, x3);

    function Kindelia$Runtime$(_A$1) {
        var $3381 = null;
        return $3381;
    };
    const Kindelia$Runtime = x0 => Kindelia$Runtime$(x0);

    function Kindelia$Runtime$new$(_world$2, _subst$3, _fresh$4, _gas$5, _term$6) {
        var $3382 = ({
            _: 'Kindelia.Runtime.new',
            'world': _world$2,
            'subst': _subst$3,
            'fresh': _fresh$4,
            'gas': _gas$5,
            'term': _term$6
        });
        return $3382;
    };
    const Kindelia$Runtime$new = x0 => x1 => x2 => x3 => x4 => Kindelia$Runtime$new$(x0, x1, x2, x3, x4);

    function Triple$(_A$1, _B$2, _C$3) {
        var $3383 = null;
        return $3383;
    };
    const Triple = x0 => x1 => x2 => Triple$(x0, x1, x2);

    function Triple$new$(_fst$4, _snd$5, _trd$6) {
        var $3384 = ({
            _: 'Triple.new',
            'fst': _fst$4,
            'snd': _snd$5,
            'trd': _trd$6
        });
        return $3384;
    };
    const Triple$new = x0 => x1 => x2 => Triple$new$(x0, x1, x2);

    function Kindelia$rename$(_table$1, _fresh$2, _old_name$3) {
        var _new_name$4 = ("$" + Nat$show$(_fresh$2));
        var _table$5 = Map$set$(_old_name$3, _new_name$4, _table$1);
        var _fresh$6 = Nat$succ$(_fresh$2);
        var $3385 = Triple$new$(_table$5, _fresh$6, _new_name$4);
        return $3385;
    };
    const Kindelia$rename = x0 => x1 => x2 => Kindelia$rename$(x0, x1, x2);

    function Kindelia$rename$many$(_table$1, _fresh$2, _names$3) {
        var self = _names$3;
        switch (self._) {
            case 'List.cons':
                var $3387 = self.head;
                var $3388 = self.tail;
                var self = Kindelia$rename$(_table$1, _fresh$2, $3387);
                switch (self._) {
                    case 'Triple.new':
                        var $3390 = self.fst;
                        var $3391 = self.snd;
                        var $3392 = self.trd;
                        var self = Kindelia$rename$many$($3390, $3391, $3388);
                        switch (self._) {
                            case 'Triple.new':
                                var $3394 = self.fst;
                                var $3395 = self.snd;
                                var $3396 = self.trd;
                                var $3397 = Triple$new$($3394, $3395, List$cons$($3392, $3396));
                                var $3393 = $3397;
                                break;
                        };
                        var $3389 = $3393;
                        break;
                };
                var $3386 = $3389;
                break;
            case 'List.nil':
                var $3398 = Triple$new$(_table$1, _fresh$2, List$nil);
                var $3386 = $3398;
                break;
        };
        return $3386;
    };
    const Kindelia$rename$many = x0 => x1 => x2 => Kindelia$rename$many$(x0, x1, x2);

    function Kindelia$sanitize$many$(_world$1, _table$2, _fresh$3, _terms$4) {
        var self = _terms$4;
        switch (self._) {
            case 'List.cons':
                var $3400 = self.head;
                var $3401 = self.tail;
                var self = Kindelia$sanitize$(_world$1, _table$2, _fresh$3, $3400);
                switch (self._) {
                    case 'Pair.new':
                        var $3403 = self.fst;
                        var $3404 = self.snd;
                        var self = Kindelia$sanitize$many$(_world$1, _table$2, $3403, $3401);
                        switch (self._) {
                            case 'Pair.new':
                                var $3406 = self.fst;
                                var $3407 = self.snd;
                                var $3408 = Pair$new$($3406, List$cons$($3404, $3407));
                                var $3405 = $3408;
                                break;
                        };
                        var $3402 = $3405;
                        break;
                };
                var $3399 = $3402;
                break;
            case 'List.nil':
                var $3409 = Pair$new$(_fresh$3, List$nil);
                var $3399 = $3409;
                break;
        };
        return $3399;
    };
    const Kindelia$sanitize$many = x0 => x1 => x2 => x3 => Kindelia$sanitize$many$(x0, x1, x2, x3);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Kindelia$sanitize$cases$(_world$1, _table$2, _fresh$3, _old_name$4, _new_name$5, _ctrs$6, _cses$7) {
        var self = _ctrs$6;
        switch (self._) {
            case 'List.cons':
                var $3411 = self.head;
                var $3412 = self.tail;
                var self = _cses$7;
                switch (self._) {
                    case 'List.cons':
                        var $3414 = self.head;
                        var $3415 = self.tail;
                        var _new_table$12 = _table$2;
                        var _new_table$13 = (() => {
                            var $3418 = _new_table$12;
                            var self = $3411;
                            switch (self._) {
                                case 'Kindelia.Constructor.new':
                                    var $3420 = self.args;
                                    var $3421 = $3420;
                                    var $3419 = $3421;
                                    break;
                            };
                            let _new_table$14 = $3418;
                            let _field$13;
                            while ($3419._ === 'List.cons') {
                                _field$13 = $3419.head;
                                var $3418 = Map$set$((_old_name$4 + ("." + (() => {
                                    var self = _field$13;
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $3422 = self.fst;
                                            var $3423 = $3422;
                                            return $3423;
                                    };
                                })())), (_new_name$5 + ("." + (() => {
                                    var self = _field$13;
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $3424 = self.fst;
                                            var $3425 = $3424;
                                            return $3425;
                                    };
                                })())), _new_table$14);
                                _new_table$14 = $3418;
                                $3419 = $3419.tail;
                            }
                            return _new_table$14;
                        })();
                        var self = Kindelia$sanitize$(_world$1, _new_table$13, _fresh$3, $3414);
                        switch (self._) {
                            case 'Pair.new':
                                var $3426 = self.fst;
                                var $3427 = self.snd;
                                var self = Kindelia$sanitize$cases$(_world$1, _table$2, $3426, _old_name$4, _new_name$5, $3412, $3415);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $3429 = self.fst;
                                        var $3430 = self.snd;
                                        var $3431 = Pair$new$($3429, List$cons$($3427, $3430));
                                        var $3428 = $3431;
                                        break;
                                };
                                var $3416 = $3428;
                                break;
                        };
                        var $3413 = $3416;
                        break;
                    case 'List.nil':
                        var $3432 = Pair$new$(_fresh$3, List$nil);
                        var $3413 = $3432;
                        break;
                };
                var $3410 = $3413;
                break;
            case 'List.nil':
                var self = _cses$7;
                switch (self._) {
                    case 'List.nil':
                    case 'List.cons':
                        var $3434 = Pair$new$(_fresh$3, List$nil);
                        var $3433 = $3434;
                        break;
                };
                var $3410 = $3433;
                break;
        };
        return $3410;
    };
    const Kindelia$sanitize$cases = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Kindelia$sanitize$cases$(x0, x1, x2, x3, x4, x5, x6);

    function Kindelia$sanitize$(_world$1, _table$2, _fresh$3, _term$4) {
        var self = _term$4;
        switch (self._) {
            case 'Kindelia.Term.var':
                var $3436 = self.name;
                var _term$6 = Kindelia$Term$var$(Maybe$default$(Map$get$($3436, _table$2), $3436));
                var $3437 = Pair$new$(_fresh$3, _term$6);
                var $3435 = $3437;
                break;
            case 'Kindelia.Term.call':
                var $3438 = self.bond;
                var $3439 = self.args;
                var self = Kindelia$sanitize$many$(_world$1, _table$2, _fresh$3, $3439);
                switch (self._) {
                    case 'Pair.new':
                        var $3441 = self.fst;
                        var $3442 = self.snd;
                        var $3443 = Pair$new$($3441, Kindelia$Term$call$($3438, $3442));
                        var $3440 = $3443;
                        break;
                };
                var $3435 = $3440;
                break;
            case 'Kindelia.Term.let':
                var $3444 = self.name;
                var $3445 = self.type;
                var $3446 = self.expr;
                var $3447 = self.body;
                var self = Kindelia$sanitize$(_world$1, _table$2, _fresh$3, $3446);
                switch (self._) {
                    case 'Pair.new':
                        var $3449 = self.fst;
                        var $3450 = self.snd;
                        var self = Kindelia$rename$(_table$2, $3449, $3444);
                        switch (self._) {
                            case 'Triple.new':
                                var $3452 = self.fst;
                                var $3453 = self.snd;
                                var $3454 = self.trd;
                                var self = Kindelia$sanitize$(_world$1, $3452, $3453, $3447);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $3456 = self.fst;
                                        var $3457 = self.snd;
                                        var $3458 = Pair$new$($3456, Kindelia$Term$let$($3454, $3445, $3450, $3457));
                                        var $3455 = $3458;
                                        break;
                                };
                                var $3451 = $3455;
                                break;
                        };
                        var $3448 = $3451;
                        break;
                };
                var $3435 = $3448;
                break;
            case 'Kindelia.Term.create':
                var $3459 = self.ctor;
                var $3460 = self.vals;
                var self = Kindelia$sanitize$many$(_world$1, _table$2, _fresh$3, $3460);
                switch (self._) {
                    case 'Pair.new':
                        var $3462 = self.fst;
                        var $3463 = self.snd;
                        var $3464 = Pair$new$($3462, Kindelia$Term$create$($3459, $3463));
                        var $3461 = $3464;
                        break;
                };
                var $3435 = $3461;
                break;
            case 'Kindelia.Term.match':
                var $3465 = self.name;
                var $3466 = self.data;
                var $3467 = self.cses;
                var _ctrs$8 = Maybe$default$(Kindelia$get_ctrs$(_world$1, $3466), List$nil);
                var _old_name$9 = $3465;
                var _new_name$10 = Maybe$default$(Map$get$($3465, _table$2), $3465);
                var self = Kindelia$sanitize$cases$(_world$1, _table$2, _fresh$3, _old_name$9, _new_name$10, _ctrs$8, $3467);
                switch (self._) {
                    case 'Pair.new':
                        var $3469 = self.fst;
                        var $3470 = self.snd;
                        var $3471 = Pair$new$($3469, Kindelia$Term$match$(_new_name$10, $3466, $3470));
                        var $3468 = $3471;
                        break;
                };
                var $3435 = $3468;
                break;
            case 'Kindelia.Term.word':
                var $3472 = self.numb;
                var $3473 = Pair$new$(_fresh$3, Kindelia$Term$word$($3472));
                var $3435 = $3473;
                break;
            case 'Kindelia.Term.compare':
                var $3474 = self.val0;
                var $3475 = self.val1;
                var $3476 = self.iflt;
                var $3477 = self.ifeq;
                var $3478 = self.ifgt;
                var self = Kindelia$sanitize$(_world$1, _table$2, _fresh$3, $3474);
                switch (self._) {
                    case 'Pair.new':
                        var $3480 = self.fst;
                        var $3481 = self.snd;
                        var self = Kindelia$sanitize$(_world$1, _table$2, $3480, $3475);
                        switch (self._) {
                            case 'Pair.new':
                                var $3483 = self.fst;
                                var $3484 = self.snd;
                                var self = Kindelia$sanitize$(_world$1, _table$2, $3483, $3476);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $3486 = self.fst;
                                        var $3487 = self.snd;
                                        var self = Kindelia$sanitize$(_world$1, _table$2, $3486, $3477);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $3489 = self.fst;
                                                var $3490 = self.snd;
                                                var self = Kindelia$sanitize$(_world$1, _table$2, $3489, $3478);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3492 = self.fst;
                                                        var $3493 = self.snd;
                                                        var $3494 = Pair$new$($3492, Kindelia$Term$compare$($3481, $3484, $3487, $3490, $3493));
                                                        var $3491 = $3494;
                                                        break;
                                                };
                                                var $3488 = $3491;
                                                break;
                                        };
                                        var $3485 = $3488;
                                        break;
                                };
                                var $3482 = $3485;
                                break;
                        };
                        var $3479 = $3482;
                        break;
                };
                var $3435 = $3479;
                break;
            case 'Kindelia.Term.operate':
                var $3495 = self.oper;
                var $3496 = self.val0;
                var $3497 = self.val1;
                var self = Kindelia$sanitize$(_world$1, _table$2, _fresh$3, $3496);
                switch (self._) {
                    case 'Pair.new':
                        var $3499 = self.fst;
                        var $3500 = self.snd;
                        var self = Kindelia$sanitize$(_world$1, _table$2, $3499, $3497);
                        switch (self._) {
                            case 'Pair.new':
                                var $3502 = self.fst;
                                var $3503 = self.snd;
                                var $3504 = Pair$new$($3502, Kindelia$Term$operate$($3495, $3500, $3503));
                                var $3501 = $3504;
                                break;
                        };
                        var $3498 = $3501;
                        break;
                };
                var $3435 = $3498;
                break;
            case 'Kindelia.Term.bind':
                var $3505 = self.bond;
                var $3506 = self.expr;
                var $3507 = self.cont;
                var self = Kindelia$get_bond$(_world$1, $3505);
                switch (self._) {
                    case 'Maybe.some':
                        var $3509 = self.value;
                        var _bond$9 = $3509;
                        var self = _bond$9;
                        switch (self._) {
                            case 'Kindelia.Bond.new':
                                var self = Kindelia$sanitize$(_world$1, _table$2, _fresh$3, $3506);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $3512 = self.fst;
                                        var $3513 = self.snd;
                                        var self = Kindelia$sanitize$(_world$1, _table$2, $3512, $3507);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $3515 = self.fst;
                                                var $3516 = self.snd;
                                                var $3517 = Pair$new$($3515, Kindelia$Term$bind$($3505, $3513, $3516));
                                                var $3514 = $3517;
                                                break;
                                        };
                                        var $3511 = $3514;
                                        break;
                                };
                                var $3510 = $3511;
                                break;
                        };
                        var $3508 = $3510;
                        break;
                    case 'Maybe.none':
                        var $3518 = Pair$new$(_fresh$3, _term$4);
                        var $3508 = $3518;
                        break;
                };
                var $3435 = $3508;
                break;
        };
        return $3435;
    };
    const Kindelia$sanitize = x0 => x1 => x2 => x3 => Kindelia$sanitize$(x0, x1, x2, x3);

    function Kindelia$normalize$many$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'Kindelia.Runtime.new':
                var $3520 = self.world;
                var $3521 = self.subst;
                var $3522 = self.fresh;
                var $3523 = self.gas;
                var $3524 = self.term;
                var self = $3524;
                switch (self._) {
                    case 'List.cons':
                        var $3526 = self.head;
                        var $3527 = self.tail;
                        var self = Kindelia$normalize$(Kindelia$Runtime$new$($3520, $3521, $3522, $3523, $3526));
                        switch (self._) {
                            case 'Kindelia.Runtime.new':
                                var $3529 = self.world;
                                var $3530 = self.subst;
                                var $3531 = self.fresh;
                                var $3532 = self.gas;
                                var $3533 = self.term;
                                var self = Kindelia$normalize$many$(Kindelia$Runtime$new$($3529, $3530, $3531, $3532, $3527));
                                switch (self._) {
                                    case 'Kindelia.Runtime.new':
                                        var $3535 = self.world;
                                        var $3536 = self.subst;
                                        var $3537 = self.fresh;
                                        var $3538 = self.gas;
                                        var $3539 = self.term;
                                        var $3540 = Kindelia$Runtime$new$($3535, $3536, $3537, $3538, List$cons$($3533, $3539));
                                        var $3534 = $3540;
                                        break;
                                };
                                var $3528 = $3534;
                                break;
                        };
                        var $3525 = $3528;
                        break;
                    case 'List.nil':
                        var $3541 = _state$1;
                        var $3525 = $3541;
                        break;
                };
                var $3519 = $3525;
                break;
        };
        return $3519;
    };
    const Kindelia$normalize$many = x0 => Kindelia$normalize$many$(x0);
    const Kindelia$cost$alloc = 1n;

    function Kindelia$cost$create$(_ctor_arity$1) {
        var $3542 = (1n + (Kindelia$cost$alloc * _ctor_arity$1));
        return $3542;
    };
    const Kindelia$cost$create = x0 => Kindelia$cost$create$(x0);
    const Kindelia$cost$subs = 1n;
    const Kindelia$cost$let = Kindelia$cost$subs;

    function Kindelia$cost$match$(_ctor_arity$1) {
        var $3543 = (1n + (Kindelia$cost$subs * _ctor_arity$1));
        return $3543;
    };
    const Kindelia$cost$match = x0 => Kindelia$cost$match$(x0);
    const U64$ltn = a0 => a1 => (a0 < a1);
    const U64$eql = a0 => a1 => (a0 === a1);

    function U64$cmp$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $3545 = Cmp$ltn;
            var $3544 = $3545;
        } else {
            var self = (_a$1 === _b$2);
            if (self) {
                var $3547 = Cmp$eql;
                var $3546 = $3547;
            } else {
                var $3548 = Cmp$gtn;
                var $3546 = $3548;
            };
            var $3544 = $3546;
        };
        return $3544;
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
                        var $3549 = self.pred;
                        var $3550 = Word$bit_length$go$($3549, Nat$succ$(_c$3), _n$4);
                        return $3550;
                    case 'Word.i':
                        var $3551 = self.pred;
                        var $3552 = Word$bit_length$go$($3551, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $3552;
                    case 'Word.e':
                        var $3553 = _n$4;
                        return $3553;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $3554 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $3554;
    };
    const Word$bit_length = x0 => Word$bit_length$(x0);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $3556 = Bool$false;
                var $3555 = $3556;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $3557 = Bool$true;
                var $3555 = $3557;
                break;
        };
        return $3555;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $3558 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $3558;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $3560 = self.pred;
                var $3561 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $3563 = self.pred;
                            var $3564 = (_a$pred$9 => {
                                var $3565 = Word$o$(Word$or$(_a$pred$9, $3563));
                                return $3565;
                            });
                            var $3562 = $3564;
                            break;
                        case 'Word.i':
                            var $3566 = self.pred;
                            var $3567 = (_a$pred$9 => {
                                var $3568 = Word$i$(Word$or$(_a$pred$9, $3566));
                                return $3568;
                            });
                            var $3562 = $3567;
                            break;
                        case 'Word.e':
                            var $3569 = (_a$pred$7 => {
                                var $3570 = Word$e;
                                return $3570;
                            });
                            var $3562 = $3569;
                            break;
                    };
                    var $3562 = $3562($3560);
                    return $3562;
                });
                var $3559 = $3561;
                break;
            case 'Word.i':
                var $3571 = self.pred;
                var $3572 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $3574 = self.pred;
                            var $3575 = (_a$pred$9 => {
                                var $3576 = Word$i$(Word$or$(_a$pred$9, $3574));
                                return $3576;
                            });
                            var $3573 = $3575;
                            break;
                        case 'Word.i':
                            var $3577 = self.pred;
                            var $3578 = (_a$pred$9 => {
                                var $3579 = Word$i$(Word$or$(_a$pred$9, $3577));
                                return $3579;
                            });
                            var $3573 = $3578;
                            break;
                        case 'Word.e':
                            var $3580 = (_a$pred$7 => {
                                var $3581 = Word$e;
                                return $3581;
                            });
                            var $3573 = $3580;
                            break;
                    };
                    var $3573 = $3573($3571);
                    return $3573;
                });
                var $3559 = $3572;
                break;
            case 'Word.e':
                var $3582 = (_b$4 => {
                    var $3583 = Word$e;
                    return $3583;
                });
                var $3559 = $3582;
                break;
        };
        var $3559 = $3559(_b$3);
        return $3559;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right$one$go$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $3585 = self.pred;
                var $3586 = Word$o$(Word$shift_right$one$go$($3585));
                var $3584 = $3586;
                break;
            case 'Word.i':
                var $3587 = self.pred;
                var $3588 = Word$i$(Word$shift_right$one$go$($3587));
                var $3584 = $3588;
                break;
            case 'Word.e':
                var $3589 = Word$o$(Word$e);
                var $3584 = $3589;
                break;
        };
        return $3584;
    };
    const Word$shift_right$one$go = x0 => Word$shift_right$one$go$(x0);

    function Word$shift_right$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $3591 = self.pred;
                var $3592 = Word$shift_right$one$go$($3591);
                var $3590 = $3592;
                break;
            case 'Word.i':
                var $3593 = self.pred;
                var $3594 = Word$shift_right$one$go$($3593);
                var $3590 = $3594;
                break;
            case 'Word.e':
                var $3595 = Word$e;
                var $3590 = $3595;
                break;
        };
        return $3590;
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
                    var $3596 = _value$2;
                    return $3596;
                } else {
                    var $3597 = (self - 1n);
                    var $3598 = Word$shift_right$(Word$shift_right$one$(_value$2), $3597);
                    return $3598;
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
                    var $3599 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $3599;
                } else {
                    var $3600 = Pair$new$(Bool$false, _value$5);
                    var self = $3600;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $3601 = self.fst;
                        var $3602 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $3604 = $3602;
                            var $3603 = $3604;
                        } else {
                            var $3605 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right$(_shift_copy$4, 1n);
                            var self = $3601;
                            if (self) {
                                var $3607 = Word$div$go$($3605, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $3602);
                                var $3606 = $3607;
                            } else {
                                var $3608 = Word$div$go$($3605, _sub_copy$3, _new_shift_copy$9, $3602);
                                var $3606 = $3608;
                            };
                            var $3603 = $3606;
                        };
                        return $3603;
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
            var $3610 = Word$to_zero$(_a$2);
            var $3609 = $3610;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_b$3, _shift$6);
            var $3611 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $3609 = $3611;
        };
        return $3609;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U64$div = a0 => a1 => ((a0 / a1) & 0xFFFFFFFFFFFFFFFFn);

    function Word$mod$(_a$2, _b$3) {
        var _q$4 = Word$div$(_a$2, _b$3);
        var $3612 = Word$sub$(_a$2, Word$mul$(_b$3, _q$4));
        return $3612;
    };
    const Word$mod = x0 => x1 => Word$mod$(x0, x1);
    const U64$mod = a0 => a1 => (a0 % a1);
    const U64$or = a0 => a1 => (a0 | a1);

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $3614 = self.pred;
                var $3615 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $3617 = self.pred;
                            var $3618 = (_a$pred$9 => {
                                var $3619 = Word$o$(Word$and$(_a$pred$9, $3617));
                                return $3619;
                            });
                            var $3616 = $3618;
                            break;
                        case 'Word.i':
                            var $3620 = self.pred;
                            var $3621 = (_a$pred$9 => {
                                var $3622 = Word$o$(Word$and$(_a$pred$9, $3620));
                                return $3622;
                            });
                            var $3616 = $3621;
                            break;
                        case 'Word.e':
                            var $3623 = (_a$pred$7 => {
                                var $3624 = Word$e;
                                return $3624;
                            });
                            var $3616 = $3623;
                            break;
                    };
                    var $3616 = $3616($3614);
                    return $3616;
                });
                var $3613 = $3615;
                break;
            case 'Word.i':
                var $3625 = self.pred;
                var $3626 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $3628 = self.pred;
                            var $3629 = (_a$pred$9 => {
                                var $3630 = Word$o$(Word$and$(_a$pred$9, $3628));
                                return $3630;
                            });
                            var $3627 = $3629;
                            break;
                        case 'Word.i':
                            var $3631 = self.pred;
                            var $3632 = (_a$pred$9 => {
                                var $3633 = Word$i$(Word$and$(_a$pred$9, $3631));
                                return $3633;
                            });
                            var $3627 = $3632;
                            break;
                        case 'Word.e':
                            var $3634 = (_a$pred$7 => {
                                var $3635 = Word$e;
                                return $3635;
                            });
                            var $3627 = $3634;
                            break;
                    };
                    var $3627 = $3627($3625);
                    return $3627;
                });
                var $3613 = $3626;
                break;
            case 'Word.e':
                var $3636 = (_b$4 => {
                    var $3637 = Word$e;
                    return $3637;
                });
                var $3613 = $3636;
                break;
        };
        var $3613 = $3613(_b$3);
        return $3613;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U64$and = a0 => a1 => (a0 & a1);

    function Word$xor$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $3639 = self.pred;
                var $3640 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $3642 = self.pred;
                            var $3643 = (_a$pred$9 => {
                                var $3644 = Word$o$(Word$xor$(_a$pred$9, $3642));
                                return $3644;
                            });
                            var $3641 = $3643;
                            break;
                        case 'Word.i':
                            var $3645 = self.pred;
                            var $3646 = (_a$pred$9 => {
                                var $3647 = Word$i$(Word$xor$(_a$pred$9, $3645));
                                return $3647;
                            });
                            var $3641 = $3646;
                            break;
                        case 'Word.e':
                            var $3648 = (_a$pred$7 => {
                                var $3649 = Word$e;
                                return $3649;
                            });
                            var $3641 = $3648;
                            break;
                    };
                    var $3641 = $3641($3639);
                    return $3641;
                });
                var $3638 = $3640;
                break;
            case 'Word.i':
                var $3650 = self.pred;
                var $3651 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $3653 = self.pred;
                            var $3654 = (_a$pred$9 => {
                                var $3655 = Word$i$(Word$xor$(_a$pred$9, $3653));
                                return $3655;
                            });
                            var $3652 = $3654;
                            break;
                        case 'Word.i':
                            var $3656 = self.pred;
                            var $3657 = (_a$pred$9 => {
                                var $3658 = Word$o$(Word$xor$(_a$pred$9, $3656));
                                return $3658;
                            });
                            var $3652 = $3657;
                            break;
                        case 'Word.e':
                            var $3659 = (_a$pred$7 => {
                                var $3660 = Word$e;
                                return $3660;
                            });
                            var $3652 = $3659;
                            break;
                    };
                    var $3652 = $3652($3650);
                    return $3652;
                });
                var $3638 = $3651;
                break;
            case 'Word.e':
                var $3661 = (_b$4 => {
                    var $3662 = Word$e;
                    return $3662;
                });
                var $3638 = $3661;
                break;
        };
        var $3638 = $3638(_b$3);
        return $3638;
    };
    const Word$xor = x0 => x1 => Word$xor$(x0, x1);
    const U64$xor = a0 => a1 => (a0 ^ a1);
    const Kindelia$cost$operate = 1n;
    const Kindelia$cost$bind = 1n;

    function Kindelia$reduce$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'Kindelia.Runtime.new':
                var $3664 = self.world;
                var $3665 = self.subst;
                var $3666 = self.fresh;
                var $3667 = self.gas;
                var $3668 = self.term;
                var self = $3668;
                switch (self._) {
                    case 'Kindelia.Term.var':
                        var $3670 = self.name;
                        var _term$8 = Maybe$default$(Map$get$($3670, $3665), $3668);
                        var self = Kindelia$reduce$(Kindelia$Runtime$new$($3664, $3665, $3666, $3667, _term$8));
                        switch (self._) {
                            case 'Kindelia.Runtime.new':
                                var $3672 = self.world;
                                var $3673 = self.subst;
                                var $3674 = self.fresh;
                                var $3675 = self.gas;
                                var $3676 = self.term;
                                var $3677 = Kindelia$Runtime$new$($3672, Map$set$($3670, $3676, $3673), $3674, $3675, $3676);
                                var $3671 = $3677;
                                break;
                        };
                        var $3669 = $3671;
                        break;
                    case 'Kindelia.Term.call':
                        var $3678 = self.bond;
                        var $3679 = self.args;
                        var self = Kindelia$get_bond$($3664, $3678);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3681 = self.value;
                                var _bond$10 = $3681;
                                var self = _bond$10;
                                switch (self._) {
                                    case 'Kindelia.Bond.new':
                                        var $3683 = self.args;
                                        var $3684 = self.main;
                                        var _inam$16 = List$mapped$($3683, Pair$fst);
                                        var self = Kindelia$rename$many$(Map$from_list$(List$nil), $3666, _inam$16);
                                        switch (self._) {
                                            case 'Triple.new':
                                                var $3686 = self.fst;
                                                var $3687 = self.snd;
                                                var $3688 = self.trd;
                                                var self = Kindelia$sanitize$($3664, $3686, $3687, $3684);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3690 = self.fst;
                                                        var $3691 = self.snd;
                                                        var self = Kindelia$normalize$many$(Kindelia$Runtime$new$($3664, $3665, $3690, $3667, $3679));
                                                        switch (self._) {
                                                            case 'Kindelia.Runtime.new':
                                                                var $3693 = self.world;
                                                                var $3694 = self.subst;
                                                                var $3695 = self.fresh;
                                                                var $3696 = self.gas;
                                                                var $3697 = self.term;
                                                                var _subst$27 = Kindelia$extend$($3694, List$zip$($3688, $3697));
                                                                var _gas$28 = (Kindelia$cost$create$((list_length($3679))) + $3696);
                                                                var $3698 = Kindelia$reduce$(Kindelia$Runtime$new$($3693, _subst$27, $3695, _gas$28, $3691));
                                                                var $3692 = $3698;
                                                                break;
                                                        };
                                                        var $3689 = $3692;
                                                        break;
                                                };
                                                var $3685 = $3689;
                                                break;
                                        };
                                        var $3682 = $3685;
                                        break;
                                };
                                var $3680 = $3682;
                                break;
                            case 'Maybe.none':
                                var $3699 = _state$1;
                                var $3680 = $3699;
                                break;
                        };
                        var $3669 = $3680;
                        break;
                    case 'Kindelia.Term.let':
                        var $3700 = self.name;
                        var $3701 = self.expr;
                        var $3702 = self.body;
                        var self = Kindelia$normalize$(Kindelia$Runtime$new$($3664, $3665, $3666, $3667, $3701));
                        switch (self._) {
                            case 'Kindelia.Runtime.new':
                                var $3704 = self.world;
                                var $3705 = self.subst;
                                var $3706 = self.fresh;
                                var $3707 = self.gas;
                                var $3708 = self.term;
                                var _subst$16 = Map$set$($3700, $3708, $3705);
                                var _gas$17 = (Kindelia$cost$let + $3707);
                                var $3709 = Kindelia$reduce$(Kindelia$Runtime$new$($3704, _subst$16, $3706, _gas$17, $3702));
                                var $3703 = $3709;
                                break;
                        };
                        var $3669 = $3703;
                        break;
                    case 'Kindelia.Term.match':
                        var $3710 = self.name;
                        var $3711 = self.data;
                        var $3712 = self.cses;
                        var self = Kindelia$reduce$(Kindelia$Runtime$new$($3664, $3665, $3666, $3667, Maybe$default$(Map$get$($3710, $3665), Kindelia$Term$word$(0n))));
                        switch (self._) {
                            case 'Kindelia.Runtime.new':
                                var $3714 = self.world;
                                var $3715 = self.subst;
                                var $3716 = self.fresh;
                                var $3717 = self.gas;
                                var $3718 = self.term;
                                var self = $3718;
                                switch (self._) {
                                    case 'Kindelia.Term.create':
                                        var $3720 = self.ctor;
                                        var $3721 = self.vals;
                                        var self = Kindelia$get_data$($3714, $3711);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $3723 = self.value;
                                                var _data$18 = $3723;
                                                var self = _data$18;
                                                switch (self._) {
                                                    case 'Kindelia.Data.new':
                                                        var $3725 = self.ctrs;
                                                        var self = List$get$($3720, $3725);
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $3727 = self.value;
                                                                var _ctor$22 = $3727;
                                                                var self = _ctor$22;
                                                                switch (self._) {
                                                                    case 'Kindelia.Constructor.new':
                                                                        var self = List$get$($3720, $3712);
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $3730 = self.value;
                                                                                var _nams$26 = List$map$((_args$26 => {
                                                                                    var $3732 = ($3710 + ("." + (() => {
                                                                                        var self = _args$26;
                                                                                        switch (self._) {
                                                                                            case 'Pair.new':
                                                                                                var $3733 = self.fst;
                                                                                                var $3734 = $3733;
                                                                                                return $3734;
                                                                                        };
                                                                                    })()));
                                                                                    return $3732;
                                                                                }), (() => {
                                                                                    var self = _ctor$22;
                                                                                    switch (self._) {
                                                                                        case 'Kindelia.Constructor.new':
                                                                                            var $3735 = self.args;
                                                                                            var $3736 = $3735;
                                                                                            return $3736;
                                                                                    };
                                                                                })());
                                                                                var _subst$27 = Kindelia$extend$($3715, List$zip$(_nams$26, $3721));
                                                                                var _gas$28 = (Kindelia$cost$match$((list_length($3721))) + $3717);
                                                                                var $3731 = Kindelia$reduce$(Kindelia$Runtime$new$($3714, _subst$27, $3716, _gas$28, $3730));
                                                                                var $3729 = $3731;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $3737 = _state$1;
                                                                                var $3729 = $3737;
                                                                                break;
                                                                        };
                                                                        var $3728 = $3729;
                                                                        break;
                                                                };
                                                                var $3726 = $3728;
                                                                break;
                                                            case 'Maybe.none':
                                                                var $3738 = _state$1;
                                                                var $3726 = $3738;
                                                                break;
                                                        };
                                                        var $3724 = $3726;
                                                        break;
                                                };
                                                var $3722 = $3724;
                                                break;
                                            case 'Maybe.none':
                                                var $3739 = _state$1;
                                                var $3722 = $3739;
                                                break;
                                        };
                                        var $3719 = $3722;
                                        break;
                                    case 'Kindelia.Term.var':
                                    case 'Kindelia.Term.call':
                                    case 'Kindelia.Term.let':
                                    case 'Kindelia.Term.match':
                                    case 'Kindelia.Term.word':
                                    case 'Kindelia.Term.compare':
                                    case 'Kindelia.Term.operate':
                                    case 'Kindelia.Term.bind':
                                        var $3740 = _state$1;
                                        var $3719 = $3740;
                                        break;
                                };
                                var $3713 = $3719;
                                break;
                        };
                        var $3669 = $3713;
                        break;
                    case 'Kindelia.Term.compare':
                        var $3741 = self.val0;
                        var $3742 = self.val1;
                        var $3743 = self.iflt;
                        var $3744 = self.ifeq;
                        var $3745 = self.ifgt;
                        var self = Kindelia$reduce$(Kindelia$Runtime$new$($3664, $3665, $3666, $3667, $3741));
                        switch (self._) {
                            case 'Kindelia.Runtime.new':
                                var $3747 = self.world;
                                var $3748 = self.subst;
                                var $3749 = self.fresh;
                                var $3750 = self.gas;
                                var $3751 = self.term;
                                var self = Kindelia$reduce$(Kindelia$Runtime$new$($3747, $3748, $3749, $3750, $3742));
                                switch (self._) {
                                    case 'Kindelia.Runtime.new':
                                        var $3753 = self.world;
                                        var $3754 = self.subst;
                                        var $3755 = self.fresh;
                                        var $3756 = self.gas;
                                        var $3757 = self.term;
                                        var self = $3751;
                                        switch (self._) {
                                            case 'Kindelia.Term.word':
                                                var $3759 = self.numb;
                                                var self = $3757;
                                                switch (self._) {
                                                    case 'Kindelia.Term.word':
                                                        var $3761 = self.numb;
                                                        var self = U64$cmp$($3759, $3761);
                                                        switch (self._) {
                                                            case 'Cmp.ltn':
                                                                var $3763 = $3743;
                                                                var $3762 = $3763;
                                                                break;
                                                            case 'Cmp.eql':
                                                                var $3764 = $3744;
                                                                var $3762 = $3764;
                                                                break;
                                                            case 'Cmp.gtn':
                                                                var $3765 = $3745;
                                                                var $3762 = $3765;
                                                                break;
                                                        };
                                                        var $3760 = $3762;
                                                        break;
                                                    case 'Kindelia.Term.var':
                                                    case 'Kindelia.Term.call':
                                                    case 'Kindelia.Term.let':
                                                    case 'Kindelia.Term.create':
                                                    case 'Kindelia.Term.match':
                                                    case 'Kindelia.Term.compare':
                                                    case 'Kindelia.Term.operate':
                                                    case 'Kindelia.Term.bind':
                                                        var $3766 = $3668;
                                                        var $3760 = $3766;
                                                        break;
                                                };
                                                var _term$22 = $3760;
                                                break;
                                            case 'Kindelia.Term.var':
                                                var self = $3757;
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
                                                        var $3768 = $3668;
                                                        var $3767 = $3768;
                                                        break;
                                                };
                                                var _term$22 = $3767;
                                                break;
                                            case 'Kindelia.Term.call':
                                            case 'Kindelia.Term.create':
                                                var self = $3757;
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
                                                        var $3770 = $3668;
                                                        var $3769 = $3770;
                                                        break;
                                                };
                                                var _term$22 = $3769;
                                                break;
                                            case 'Kindelia.Term.let':
                                                var self = $3757;
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
                                                        var $3772 = $3668;
                                                        var $3771 = $3772;
                                                        break;
                                                };
                                                var _term$22 = $3771;
                                                break;
                                            case 'Kindelia.Term.match':
                                            case 'Kindelia.Term.operate':
                                            case 'Kindelia.Term.bind':
                                                var self = $3757;
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
                                                        var $3774 = $3668;
                                                        var $3773 = $3774;
                                                        break;
                                                };
                                                var _term$22 = $3773;
                                                break;
                                            case 'Kindelia.Term.compare':
                                                var self = $3757;
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
                                                        var $3776 = $3668;
                                                        var $3775 = $3776;
                                                        break;
                                                };
                                                var _term$22 = $3775;
                                                break;
                                        };
                                        var _gas$23 = (Kindelia$cost$compare + $3756);
                                        var $3758 = Kindelia$Runtime$new$($3753, $3754, $3755, _gas$23, _term$22);
                                        var $3752 = $3758;
                                        break;
                                };
                                var $3746 = $3752;
                                break;
                        };
                        var $3669 = $3746;
                        break;
                    case 'Kindelia.Term.operate':
                        var $3777 = self.oper;
                        var $3778 = self.val0;
                        var $3779 = self.val1;
                        var self = Kindelia$reduce$(Kindelia$Runtime$new$($3664, $3665, $3666, $3667, $3778));
                        switch (self._) {
                            case 'Kindelia.Runtime.new':
                                var $3781 = self.world;
                                var $3782 = self.subst;
                                var $3783 = self.fresh;
                                var $3784 = self.gas;
                                var $3785 = self.term;
                                var self = Kindelia$reduce$(Kindelia$Runtime$new$($3781, $3782, $3783, $3784, $3779));
                                switch (self._) {
                                    case 'Kindelia.Runtime.new':
                                        var $3787 = self.world;
                                        var $3788 = self.subst;
                                        var $3789 = self.fresh;
                                        var $3790 = self.gas;
                                        var $3791 = self.term;
                                        var self = $3785;
                                        switch (self._) {
                                            case 'Kindelia.Term.word':
                                                var $3793 = self.numb;
                                                var self = $3791;
                                                switch (self._) {
                                                    case 'Kindelia.Term.word':
                                                        var $3795 = self.numb;
                                                        var self = $3777;
                                                        switch (self._) {
                                                            case 'Kindelia.Operation.add':
                                                                var $3797 = Kindelia$Term$word$((($3793 + $3795) & 0xFFFFFFFFFFFFFFFFn));
                                                                var $3796 = $3797;
                                                                break;
                                                            case 'Kindelia.Operation.sub':
                                                                var $3798 = Kindelia$Term$word$((($3793 - $3795) & 0xFFFFFFFFFFFFFFFFn));
                                                                var $3796 = $3798;
                                                                break;
                                                            case 'Kindelia.Operation.mul':
                                                                var $3799 = Kindelia$Term$word$((($3793 * $3795) & 0xFFFFFFFFFFFFFFFFn));
                                                                var $3796 = $3799;
                                                                break;
                                                            case 'Kindelia.Operation.div':
                                                                var $3800 = Kindelia$Term$word$((($3793 / $3795) & 0xFFFFFFFFFFFFFFFFn));
                                                                var $3796 = $3800;
                                                                break;
                                                            case 'Kindelia.Operation.mod':
                                                                var $3801 = Kindelia$Term$word$(($3793 % $3795));
                                                                var $3796 = $3801;
                                                                break;
                                                            case 'Kindelia.Operation.or':
                                                                var $3802 = Kindelia$Term$word$(($3793 | $3795));
                                                                var $3796 = $3802;
                                                                break;
                                                            case 'Kindelia.Operation.and':
                                                                var $3803 = Kindelia$Term$word$(($3793 & $3795));
                                                                var $3796 = $3803;
                                                                break;
                                                            case 'Kindelia.Operation.xor':
                                                                var $3804 = Kindelia$Term$word$(($3793 ^ $3795));
                                                                var $3796 = $3804;
                                                                break;
                                                        };
                                                        var $3794 = $3796;
                                                        break;
                                                    case 'Kindelia.Term.var':
                                                    case 'Kindelia.Term.call':
                                                    case 'Kindelia.Term.let':
                                                    case 'Kindelia.Term.create':
                                                    case 'Kindelia.Term.match':
                                                    case 'Kindelia.Term.compare':
                                                    case 'Kindelia.Term.operate':
                                                    case 'Kindelia.Term.bind':
                                                        var $3805 = $3668;
                                                        var $3794 = $3805;
                                                        break;
                                                };
                                                var _term$20 = $3794;
                                                break;
                                            case 'Kindelia.Term.var':
                                                var self = $3791;
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
                                                        var $3807 = $3668;
                                                        var $3806 = $3807;
                                                        break;
                                                };
                                                var _term$20 = $3806;
                                                break;
                                            case 'Kindelia.Term.call':
                                            case 'Kindelia.Term.create':
                                                var self = $3791;
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
                                                        var $3809 = $3668;
                                                        var $3808 = $3809;
                                                        break;
                                                };
                                                var _term$20 = $3808;
                                                break;
                                            case 'Kindelia.Term.let':
                                                var self = $3791;
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
                                                        var $3811 = $3668;
                                                        var $3810 = $3811;
                                                        break;
                                                };
                                                var _term$20 = $3810;
                                                break;
                                            case 'Kindelia.Term.match':
                                            case 'Kindelia.Term.operate':
                                            case 'Kindelia.Term.bind':
                                                var self = $3791;
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
                                                        var $3813 = $3668;
                                                        var $3812 = $3813;
                                                        break;
                                                };
                                                var _term$20 = $3812;
                                                break;
                                            case 'Kindelia.Term.compare':
                                                var self = $3791;
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
                                                        var $3815 = $3668;
                                                        var $3814 = $3815;
                                                        break;
                                                };
                                                var _term$20 = $3814;
                                                break;
                                        };
                                        var _gas$21 = (Kindelia$cost$operate + $3790);
                                        var $3792 = Kindelia$Runtime$new$($3787, $3788, $3789, _gas$21, _term$20);
                                        var $3786 = $3792;
                                        break;
                                };
                                var $3780 = $3786;
                                break;
                        };
                        var $3669 = $3780;
                        break;
                    case 'Kindelia.Term.bind':
                        var $3816 = self.bond;
                        var $3817 = self.expr;
                        var $3818 = self.cont;
                        var self = Kindelia$get_bond$($3664, $3816);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3820 = self.value;
                                var _bond$11 = $3820;
                                var self = _bond$11;
                                switch (self._) {
                                    case 'Kindelia.Bond.new':
                                        var self = Kindelia$normalize$(Kindelia$Runtime$new$($3664, $3665, $3666, $3667, $3817));
                                        switch (self._) {
                                            case 'Kindelia.Runtime.new':
                                                var $3823 = self.world;
                                                var $3824 = self.subst;
                                                var $3825 = self.fresh;
                                                var $3826 = self.gas;
                                                var $3827 = self.term;
                                                var _entry$22 = Kindelia$Entry$bond$((() => {
                                                    var self = _bond$11;
                                                    switch (self._) {
                                                        case 'Kindelia.Bond.new':
                                                            var $3829 = self.name;
                                                            var $3830 = self.ownr;
                                                            var $3831 = self.args;
                                                            var $3832 = self.otyp;
                                                            var $3833 = Kindelia$Bond$new$($3829, $3830, $3831, $3832, $3827);
                                                            return $3833;
                                                    };
                                                })());
                                                var self = $3823;
                                                switch (self._) {
                                                    case 'Kindelia.World.new':
                                                        var $3834 = self.names;
                                                        var $3835 = self.entry;
                                                        var $3836 = Kindelia$World$new$($3834, Map$set$($3816, _entry$22, $3835));
                                                        var _world$23 = $3836;
                                                        break;
                                                };
                                                var _gas$24 = (Kindelia$cost$bind + $3826);
                                                var $3828 = Kindelia$reduce$(Kindelia$Runtime$new$(_world$23, $3824, $3825, _gas$24, $3818));
                                                var $3822 = $3828;
                                                break;
                                        };
                                        var $3821 = $3822;
                                        break;
                                };
                                var $3819 = $3821;
                                break;
                            case 'Maybe.none':
                                var $3837 = _state$1;
                                var $3819 = $3837;
                                break;
                        };
                        var $3669 = $3819;
                        break;
                    case 'Kindelia.Term.create':
                    case 'Kindelia.Term.word':
                        var $3838 = _state$1;
                        var $3669 = $3838;
                        break;
                };
                var $3663 = $3669;
                break;
        };
        return $3663;
    };
    const Kindelia$reduce = x0 => Kindelia$reduce$(x0);

    function Kindelia$normalize$cases$(_ctrs$1, _name$2, _state$3) {
        var self = _state$3;
        switch (self._) {
            case 'Kindelia.Runtime.new':
                var $3840 = self.world;
                var $3841 = self.subst;
                var $3842 = self.fresh;
                var $3843 = self.gas;
                var $3844 = self.term;
                var self = _ctrs$1;
                switch (self._) {
                    case 'List.cons':
                        var $3846 = self.head;
                        var $3847 = self.tail;
                        var self = $3844;
                        switch (self._) {
                            case 'List.cons':
                                var $3849 = self.head;
                                var $3850 = self.tail;
                                var _nams$13 = List$map$((_args$13 => {
                                    var $3852 = (_name$2 + ("." + (() => {
                                        var self = _args$13;
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $3853 = self.fst;
                                                var $3854 = $3853;
                                                return $3854;
                                        };
                                    })()));
                                    return $3852;
                                }), (() => {
                                    var self = $3846;
                                    switch (self._) {
                                        case 'Kindelia.Constructor.new':
                                            var $3855 = self.args;
                                            var $3856 = $3855;
                                            return $3856;
                                    };
                                })());
                                var _vals$14 = List$map$(Kindelia$Term$var, _nams$13);
                                var _subst$15 = Kindelia$extend$($3841, List$zip$(_nams$13, _vals$14));
                                var self = Kindelia$normalize$(Kindelia$Runtime$new$($3840, _subst$15, $3842, $3843, $3849));
                                switch (self._) {
                                    case 'Kindelia.Runtime.new':
                                        var $3857 = self.world;
                                        var $3858 = self.subst;
                                        var $3859 = self.fresh;
                                        var $3860 = self.gas;
                                        var $3861 = self.term;
                                        var self = Kindelia$normalize$cases$($3847, _name$2, Kindelia$Runtime$new$($3857, $3858, $3859, $3860, $3850));
                                        switch (self._) {
                                            case 'Kindelia.Runtime.new':
                                                var $3863 = self.world;
                                                var $3864 = self.subst;
                                                var $3865 = self.fresh;
                                                var $3866 = self.gas;
                                                var $3867 = self.term;
                                                var $3868 = Kindelia$Runtime$new$($3863, $3864, $3865, $3866, List$cons$($3861, $3867));
                                                var $3862 = $3868;
                                                break;
                                        };
                                        var $3851 = $3862;
                                        break;
                                };
                                var $3848 = $3851;
                                break;
                            case 'List.nil':
                                var $3869 = _state$3;
                                var $3848 = $3869;
                                break;
                        };
                        var $3845 = $3848;
                        break;
                    case 'List.nil':
                        var self = $3844;
                        switch (self._) {
                            case 'List.nil':
                            case 'List.cons':
                                var $3871 = _state$3;
                                var $3870 = $3871;
                                break;
                        };
                        var $3845 = $3870;
                        break;
                };
                var $3839 = $3845;
                break;
        };
        return $3839;
    };
    const Kindelia$normalize$cases = x0 => x1 => x2 => Kindelia$normalize$cases$(x0, x1, x2);

    function Kindelia$normalize$(_state$1) {
        var self = Kindelia$reduce$(_state$1);
        switch (self._) {
            case 'Kindelia.Runtime.new':
                var $3873 = self.world;
                var $3874 = self.subst;
                var $3875 = self.fresh;
                var $3876 = self.gas;
                var $3877 = self.term;
                var self = $3877;
                switch (self._) {
                    case 'Kindelia.Term.create':
                        var $3879 = self.ctor;
                        var $3880 = self.vals;
                        var self = Kindelia$normalize$many$(Kindelia$Runtime$new$($3873, $3874, $3875, $3876, $3880));
                        switch (self._) {
                            case 'Kindelia.Runtime.new':
                                var $3882 = self.world;
                                var $3883 = self.subst;
                                var $3884 = self.fresh;
                                var $3885 = self.gas;
                                var $3886 = self.term;
                                var $3887 = Kindelia$Runtime$new$($3882, $3883, $3884, $3885, Kindelia$Term$create$($3879, $3886));
                                var $3881 = $3887;
                                break;
                        };
                        var $3878 = $3881;
                        break;
                    case 'Kindelia.Term.match':
                        var $3888 = self.name;
                        var $3889 = self.data;
                        var $3890 = self.cses;
                        var self = Kindelia$get_ctrs$($3873, $3889);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3892 = self.value;
                                var _ctrs$11 = $3892;
                                var self = _ctrs$11;
                                switch (self._) {
                                    case 'List.nil':
                                        var self = Kindelia$normalize$cases$(_ctrs$11, $3888, Kindelia$Runtime$new$($3873, $3874, $3875, $3876, $3890));
                                        switch (self._) {
                                            case 'Kindelia.Runtime.new':
                                                var $3895 = self.world;
                                                var $3896 = self.subst;
                                                var $3897 = self.fresh;
                                                var $3898 = self.gas;
                                                var $3899 = self.term;
                                                var $3900 = Kindelia$Runtime$new$($3895, $3896, $3897, $3898, Kindelia$Term$match$($3888, $3889, $3899));
                                                var $3894 = $3900;
                                                break;
                                        };
                                        var $3893 = $3894;
                                        break;
                                    case 'List.cons':
                                        var self = Kindelia$normalize$cases$(_ctrs$11, $3888, Kindelia$Runtime$new$($3873, $3874, $3875, $3876, $3890));
                                        switch (self._) {
                                            case 'Kindelia.Runtime.new':
                                                var $3902 = self.world;
                                                var $3903 = self.subst;
                                                var $3904 = self.fresh;
                                                var $3905 = self.gas;
                                                var $3906 = self.term;
                                                var $3907 = Kindelia$Runtime$new$($3902, $3903, $3904, $3905, Kindelia$Term$match$($3888, $3889, $3906));
                                                var $3901 = $3907;
                                                break;
                                        };
                                        var $3893 = $3901;
                                        break;
                                };
                                var $3891 = $3893;
                                break;
                            case 'Maybe.none':
                                var $3908 = Kindelia$Runtime$new$($3873, $3874, $3875, $3876, $3877);
                                var $3891 = $3908;
                                break;
                        };
                        var $3878 = $3891;
                        break;
                    case 'Kindelia.Term.compare':
                        var $3909 = self.val0;
                        var $3910 = self.val1;
                        var $3911 = self.iflt;
                        var $3912 = self.ifeq;
                        var $3913 = self.ifgt;
                        var self = Kindelia$normalize$(Kindelia$Runtime$new$($3873, $3874, $3875, $3876, $3909));
                        switch (self._) {
                            case 'Kindelia.Runtime.new':
                                var $3915 = self.world;
                                var $3916 = self.subst;
                                var $3917 = self.fresh;
                                var $3918 = self.gas;
                                var $3919 = self.term;
                                var self = Kindelia$normalize$(Kindelia$Runtime$new$($3915, $3916, $3917, $3918, $3910));
                                switch (self._) {
                                    case 'Kindelia.Runtime.new':
                                        var $3921 = self.world;
                                        var $3922 = self.subst;
                                        var $3923 = self.fresh;
                                        var $3924 = self.gas;
                                        var $3925 = self.term;
                                        var self = Kindelia$normalize$(Kindelia$Runtime$new$($3921, $3922, $3923, $3924, $3911));
                                        switch (self._) {
                                            case 'Kindelia.Runtime.new':
                                                var $3927 = self.world;
                                                var $3928 = self.subst;
                                                var $3929 = self.fresh;
                                                var $3930 = self.gas;
                                                var $3931 = self.term;
                                                var self = Kindelia$normalize$(Kindelia$Runtime$new$($3927, $3928, $3929, $3930, $3912));
                                                switch (self._) {
                                                    case 'Kindelia.Runtime.new':
                                                        var $3933 = self.world;
                                                        var $3934 = self.subst;
                                                        var $3935 = self.fresh;
                                                        var $3936 = self.gas;
                                                        var $3937 = self.term;
                                                        var self = Kindelia$normalize$(Kindelia$Runtime$new$($3933, $3934, $3935, $3936, $3913));
                                                        switch (self._) {
                                                            case 'Kindelia.Runtime.new':
                                                                var $3939 = self.world;
                                                                var $3940 = self.subst;
                                                                var $3941 = self.fresh;
                                                                var $3942 = self.gas;
                                                                var $3943 = self.term;
                                                                var $3944 = Kindelia$Runtime$new$($3939, $3940, $3941, $3942, Kindelia$Term$compare$($3919, $3925, $3931, $3937, $3943));
                                                                var $3938 = $3944;
                                                                break;
                                                        };
                                                        var $3932 = $3938;
                                                        break;
                                                };
                                                var $3926 = $3932;
                                                break;
                                        };
                                        var $3920 = $3926;
                                        break;
                                };
                                var $3914 = $3920;
                                break;
                        };
                        var $3878 = $3914;
                        break;
                    case 'Kindelia.Term.operate':
                        var $3945 = self.oper;
                        var $3946 = self.val0;
                        var $3947 = self.val1;
                        var self = Kindelia$normalize$(Kindelia$Runtime$new$($3873, $3874, $3875, $3876, $3946));
                        switch (self._) {
                            case 'Kindelia.Runtime.new':
                                var $3949 = self.world;
                                var $3950 = self.subst;
                                var $3951 = self.fresh;
                                var $3952 = self.gas;
                                var $3953 = self.term;
                                var self = Kindelia$normalize$(Kindelia$Runtime$new$($3949, $3950, $3951, $3952, $3947));
                                switch (self._) {
                                    case 'Kindelia.Runtime.new':
                                        var $3955 = self.world;
                                        var $3956 = self.subst;
                                        var $3957 = self.fresh;
                                        var $3958 = self.gas;
                                        var $3959 = self.term;
                                        var $3960 = Kindelia$Runtime$new$($3955, $3956, $3957, $3958, Kindelia$Term$operate$($3945, $3953, $3959));
                                        var $3954 = $3960;
                                        break;
                                };
                                var $3948 = $3954;
                                break;
                        };
                        var $3878 = $3948;
                        break;
                    case 'Kindelia.Term.bind':
                        var $3961 = self.bond;
                        var $3962 = self.expr;
                        var $3963 = self.cont;
                        var self = Kindelia$get_bond$($3873, $3961);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3965 = self.value;
                                var _bond$11 = $3965;
                                var self = _bond$11;
                                switch (self._) {
                                    case 'Kindelia.Bond.new':
                                        var self = Kindelia$normalize$(Kindelia$Runtime$new$($3873, $3874, $3875, $3876, $3962));
                                        switch (self._) {
                                            case 'Kindelia.Runtime.new':
                                                var $3968 = self.world;
                                                var $3969 = self.subst;
                                                var $3970 = self.fresh;
                                                var $3971 = self.gas;
                                                var $3972 = self.term;
                                                var self = Kindelia$normalize$(Kindelia$Runtime$new$($3968, $3969, $3970, $3971, $3963));
                                                switch (self._) {
                                                    case 'Kindelia.Runtime.new':
                                                        var $3974 = self.world;
                                                        var $3975 = self.subst;
                                                        var $3976 = self.fresh;
                                                        var $3977 = self.gas;
                                                        var $3978 = self.term;
                                                        var $3979 = Kindelia$Runtime$new$($3974, $3975, $3976, $3977, Kindelia$Term$bind$($3961, $3972, $3978));
                                                        var $3973 = $3979;
                                                        break;
                                                };
                                                var $3967 = $3973;
                                                break;
                                        };
                                        var $3966 = $3967;
                                        break;
                                };
                                var $3964 = $3966;
                                break;
                            case 'Maybe.none':
                                var $3980 = _state$1;
                                var $3964 = $3980;
                                break;
                        };
                        var $3878 = $3964;
                        break;
                    case 'Kindelia.Term.var':
                    case 'Kindelia.Term.call':
                    case 'Kindelia.Term.let':
                    case 'Kindelia.Term.word':
                        var $3981 = Kindelia$Runtime$new$($3873, $3874, $3875, $3876, $3877);
                        var $3878 = $3981;
                        break;
                };
                var $3872 = $3878;
                break;
        };
        return $3872;
    };
    const Kindelia$normalize = x0 => Kindelia$normalize$(x0);

    function Kindelia$show$type$(_world$1, _type$2) {
        var self = _type$2;
        switch (self._) {
            case 'Kindelia.Type.data':
                var $3983 = self.name;
                var $3984 = $3983;
                var $3982 = $3984;
                break;
            case 'Kindelia.Type.word':
                var $3985 = "#word";
                var $3982 = $3985;
                break;
        };
        return $3982;
    };
    const Kindelia$show$type = x0 => x1 => Kindelia$show$type$(x0, x1);

    function Word$show$(_size$1, _a$2) {
        var $3986 = Nat$show$(Word$to_nat$(_a$2));
        return $3986;
    };
    const Word$show = x0 => x1 => Word$show$(x0, x1);
    const U64$show = a0 => (String(a0));

    function Kindelia$show$term$(_world$1, _type$2, _term$3) {
        var self = _term$3;
        switch (self._) {
            case 'Kindelia.Term.var':
                var $3988 = self.name;
                var $3989 = $3988;
                var $3987 = $3989;
                break;
            case 'Kindelia.Term.call':
                var $3990 = self.bond;
                var $3991 = self.args;
                var self = Kindelia$get_bond$(_world$1, $3990);
                switch (self._) {
                    case 'Maybe.some':
                        var $3993 = self.value;
                        var _bond$7 = $3993;
                        var self = _bond$7;
                        switch (self._) {
                            case 'Kindelia.Bond.new':
                                var $3995 = self.args;
                                var _args$13 = List$zipped_with$($3995, $3991, (_inp$13 => _arg$14 => {
                                    var $3997 = Kindelia$show$term$(_world$1, (() => {
                                        var self = _inp$13;
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $3998 = self.snd;
                                                var $3999 = $3998;
                                                return $3999;
                                        };
                                    })(), _arg$14);
                                    return $3997;
                                }));
                                var $3996 = ($3990 + ("(" + (String$join$(",", _args$13) + ")")));
                                var $3994 = $3996;
                                break;
                        };
                        var $3992 = $3994;
                        break;
                    case 'Maybe.none':
                        var $4000 = "[call?]";
                        var $3992 = $4000;
                        break;
                };
                var $3987 = $3992;
                break;
            case 'Kindelia.Term.let':
                var $4001 = self.name;
                var $4002 = self.type;
                var $4003 = self.expr;
                var $4004 = self.body;
                var _name$8 = $4001;
                var _etyp$9 = Kindelia$show$type$(_world$1, $4002);
                var _expr$10 = Kindelia$show$term$(_world$1, $4002, $4003);
                var _body$11 = Kindelia$show$term$(_world$1, _type$2, $4004);
                var $4005 = ("let " + (_name$8 + (" : " + (_etyp$9 + (" = " + (_expr$10 + (" " + _body$11)))))));
                var $3987 = $4005;
                break;
            case 'Kindelia.Term.create':
                var $4006 = self.ctor;
                var $4007 = self.vals;
                var self = _type$2;
                switch (self._) {
                    case 'Kindelia.Type.data':
                        var $4009 = self.name;
                        var self = Kindelia$get_data$(_world$1, $4009);
                        switch (self._) {
                            case 'Maybe.some':
                                var $4011 = self.value;
                                var _data$8 = $4011;
                                var self = _data$8;
                                switch (self._) {
                                    case 'Kindelia.Data.new':
                                        var $4013 = self.name;
                                        var $4014 = self.ctrs;
                                        var self = List$get$($4006, $4014);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $4016 = self.value;
                                                var _ctor$12 = $4016;
                                                var self = _ctor$12;
                                                switch (self._) {
                                                    case 'Kindelia.Constructor.new':
                                                        var $4018 = self.name;
                                                        var $4019 = self.args;
                                                        var _atyp$15 = List$mapped$($4019, (_x$15 => {
                                                            var self = _x$15;
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $4022 = self.snd;
                                                                    var $4023 = $4022;
                                                                    var $4021 = $4023;
                                                                    break;
                                                            };
                                                            return $4021;
                                                        }));
                                                        var _vals$16 = List$zipped_with$($4007, (() => {
                                                            var self = _ctor$12;
                                                            switch (self._) {
                                                                case 'Kindelia.Constructor.new':
                                                                    var $4024 = self.args;
                                                                    var $4025 = $4024;
                                                                    return $4025;
                                                            };
                                                        })(), (_val$16 => _arg$17 => {
                                                            var $4026 = Kindelia$show$term$(_world$1, (() => {
                                                                var self = _arg$17;
                                                                switch (self._) {
                                                                    case 'Pair.new':
                                                                        var $4027 = self.snd;
                                                                        var $4028 = $4027;
                                                                        return $4028;
                                                                };
                                                            })(), _val$16);
                                                            return $4026;
                                                        }));
                                                        var $4020 = ($4013 + ("@" + ($4018 + ("{" + (String$join$(",", _vals$16) + "}")))));
                                                        var $4017 = $4020;
                                                        break;
                                                };
                                                var $4015 = $4017;
                                                break;
                                            case 'Maybe.none':
                                                var $4029 = "[create?]";
                                                var $4015 = $4029;
                                                break;
                                        };
                                        var $4012 = $4015;
                                        break;
                                };
                                var $4010 = $4012;
                                break;
                            case 'Maybe.none':
                                var $4030 = "[create?]";
                                var $4010 = $4030;
                                break;
                        };
                        var $4008 = $4010;
                        break;
                    case 'Kindelia.Type.word':
                        var $4031 = (Nat$show$($4006) + ("{" + (String$join$(",", List$mapped$($4007, Kindelia$show$term(_world$1)(Kindelia$Type$word))) + "}")));
                        var $4008 = $4031;
                        break;
                };
                var $3987 = $4008;
                break;
            case 'Kindelia.Term.match':
                var $4032 = self.name;
                var $4033 = self.data;
                var $4034 = self.cses;
                var self = Kindelia$get_data$(_world$1, $4033);
                switch (self._) {
                    case 'Maybe.some':
                        var $4036 = self.value;
                        var _data$8 = $4036;
                        var self = _data$8;
                        switch (self._) {
                            case 'Kindelia.Data.new':
                                var $4038 = self.ctrs;
                                var _name$11 = $4032;
                                var _cses$12 = List$zipped_with$($4038, $4034, (_case_ctor$12 => _case_body$13 => {
                                    var $4040 = ((() => {
                                        var self = _case_ctor$12;
                                        switch (self._) {
                                            case 'Kindelia.Constructor.new':
                                                var $4041 = self.name;
                                                var $4042 = $4041;
                                                return $4042;
                                        };
                                    })() + (": " + Kindelia$show$term$(_world$1, _type$2, _case_body$13)));
                                    return $4040;
                                }));
                                var $4039 = ("case " + (_name$11 + (" : " + ($4033 + (" { " + (String$join$(", ", _cses$12) + " }"))))));
                                var $4037 = $4039;
                                break;
                        };
                        var $4035 = $4037;
                        break;
                    case 'Maybe.none':
                        var $4043 = "?";
                        var $4035 = $4043;
                        break;
                };
                var $3987 = $4035;
                break;
            case 'Kindelia.Term.word':
                var $4044 = self.numb;
                var $4045 = ("#" + (String($4044)));
                var $3987 = $4045;
                break;
            case 'Kindelia.Term.compare':
                var $4046 = self.val0;
                var $4047 = self.val1;
                var $4048 = self.iflt;
                var $4049 = self.ifeq;
                var $4050 = self.ifgt;
                var _val0$9 = Kindelia$show$term$(_world$1, Kindelia$Type$word, $4046);
                var _val1$10 = Kindelia$show$term$(_world$1, Kindelia$Type$word, $4047);
                var _iflt$11 = Kindelia$show$term$(_world$1, _type$2, $4048);
                var _ifeq$12 = Kindelia$show$term$(_world$1, _type$2, $4049);
                var _ifgt$13 = Kindelia$show$term$(_world$1, _type$2, $4050);
                var $4051 = ("compare " + (_val0$9 + (" " + (_val1$10 + (" { _<_: " + (_iflt$11 + (" _=_: " + (_ifeq$12 + (" _>_: " + (_ifgt$13 + " }"))))))))));
                var $3987 = $4051;
                break;
            case 'Kindelia.Term.operate':
                var $4052 = self.oper;
                var $4053 = self.val0;
                var $4054 = self.val1;
                var self = $4052;
                switch (self._) {
                    case 'Kindelia.Operation.add':
                        var $4056 = "#add";
                        var _oper$7 = $4056;
                        break;
                    case 'Kindelia.Operation.sub':
                        var $4057 = "#sub";
                        var _oper$7 = $4057;
                        break;
                    case 'Kindelia.Operation.mul':
                        var $4058 = "#mul";
                        var _oper$7 = $4058;
                        break;
                    case 'Kindelia.Operation.div':
                        var $4059 = "#div";
                        var _oper$7 = $4059;
                        break;
                    case 'Kindelia.Operation.mod':
                        var $4060 = "#mod";
                        var _oper$7 = $4060;
                        break;
                    case 'Kindelia.Operation.or':
                        var $4061 = "#or";
                        var _oper$7 = $4061;
                        break;
                    case 'Kindelia.Operation.and':
                        var $4062 = "#and";
                        var _oper$7 = $4062;
                        break;
                    case 'Kindelia.Operation.xor':
                        var $4063 = "#xor";
                        var _oper$7 = $4063;
                        break;
                };
                var _val0$8 = Kindelia$show$term$(_world$1, Kindelia$Type$word, $4053);
                var _val1$9 = Kindelia$show$term$(_world$1, Kindelia$Type$word, $4054);
                var $4055 = (_oper$7 + ("(" + (_val0$8 + ("," + (_val1$9 + ")")))));
                var $3987 = $4055;
                break;
            case 'Kindelia.Term.bind':
                var $4064 = self.bond;
                var $4065 = self.expr;
                var $4066 = self.cont;
                var self = Kindelia$get_bond$(_world$1, $4064);
                switch (self._) {
                    case 'Maybe.some':
                        var $4068 = self.value;
                        var _bond$8 = $4068;
                        var self = _bond$8;
                        switch (self._) {
                            case 'Kindelia.Bond.new':
                                var $4070 = self.otyp;
                                var _expr$14 = Kindelia$show$term$(_world$1, $4070, $4065);
                                var _cont$15 = Kindelia$show$term$(_world$1, _type$2, $4066);
                                var $4071 = ("bind " + ($4064 + (" { " + (_expr$14 + (" } " + _cont$15)))));
                                var $4069 = $4071;
                                break;
                        };
                        var $4067 = $4069;
                        break;
                    case 'Maybe.none':
                        var $4072 = "[bind?]";
                        var $4067 = $4072;
                        break;
                };
                var $3987 = $4067;
                break;
        };
        return $3987;
    };
    const Kindelia$show$term = x0 => x1 => x2 => Kindelia$show$term$(x0, x1, x2);

    function Kindelia$transact$(_world$1, _transaction$2) {
        var self = _transaction$2;
        switch (self._) {
            case 'Kindelia.Transaction.new_data':
                var $4074 = self.data;
                var _data$4 = $4074;
                var self = _data$4;
                switch (self._) {
                    case 'Kindelia.Data.new':
                        var $4076 = self.name;
                        var self = Map$get$($4076, (() => {
                            var self = _world$1;
                            switch (self._) {
                                case 'Kindelia.World.new':
                                    var $4078 = self.entry;
                                    var $4079 = $4078;
                                    return $4079;
                            };
                        })());
                        switch (self._) {
                            case 'Maybe.none':
                                var self = _world$1;
                                switch (self._) {
                                    case 'Kindelia.World.new':
                                        var $4081 = self.names;
                                        var $4082 = self.entry;
                                        var $4083 = Kindelia$World$new$($4081, Map$set$($4076, Kindelia$Entry$data$(_data$4), $4082));
                                        var _world$7 = $4083;
                                        break;
                                };
                                var $4080 = Maybe$some$(Pair$new$(_world$7, ("[data] " + $4076)));
                                var $4077 = $4080;
                                break;
                            case 'Maybe.some':
                                var $4084 = Maybe$none;
                                var $4077 = $4084;
                                break;
                        };
                        var $4075 = $4077;
                        break;
                };
                var $4073 = $4075;
                break;
            case 'Kindelia.Transaction.new_bond':
                var $4085 = self.bond;
                var _bond$4 = $4085;
                var self = _bond$4;
                switch (self._) {
                    case 'Kindelia.Bond.new':
                        var $4087 = self.name;
                        var $4088 = self.args;
                        var $4089 = self.otyp;
                        var $4090 = self.main;
                        var self = Map$get$($4087, (() => {
                            var self = _world$1;
                            switch (self._) {
                                case 'Kindelia.World.new':
                                    var $4092 = self.entry;
                                    var $4093 = $4092;
                                    return $4093;
                            };
                        })());
                        switch (self._) {
                            case 'Maybe.none':
                                var self = _world$1;
                                switch (self._) {
                                    case 'Kindelia.World.new':
                                        var $4095 = self.names;
                                        var $4096 = self.entry;
                                        var $4097 = Kindelia$World$new$($4095, Map$set$($4087, Kindelia$Entry$bond$(_bond$4), $4096));
                                        var _world$10 = $4097;
                                        break;
                                };
                                var self = List$unzip$($4088);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $4098 = self.fst;
                                        var $4099 = self.snd;
                                        var _context$13 = Kindelia$extend$(Map$from_list$(List$nil), List$zip$($4098, $4099));
                                        var self = Kindelia$check$(_context$13, _world$10, $4090, $4089);
                                        if (self) {
                                            var $4101 = Maybe$some$(Pair$new$(_world$10, ("[bond] " + $4087)));
                                            var $4100 = $4101;
                                        } else {
                                            var $4102 = Maybe$none;
                                            var $4100 = $4102;
                                        };
                                        var $4094 = $4100;
                                        break;
                                };
                                var $4091 = $4094;
                                break;
                            case 'Maybe.some':
                                var $4103 = Maybe$none;
                                var $4091 = $4103;
                                break;
                        };
                        var $4086 = $4091;
                        break;
                };
                var $4073 = $4086;
                break;
            case 'Kindelia.Transaction.new_eval':
                var $4104 = self.eval;
                var _eval$4 = $4104;
                var self = _eval$4;
                switch (self._) {
                    case 'Kindelia.Eval.new':
                        var $4106 = self.auth;
                        var $4107 = self.term;
                        var $4108 = self.type;
                        var self = $4106;
                        switch (self._) {
                            case 'Maybe.some':
                                var $4110 = self.value;
                                var _call$9 = Kindelia$Term$call$((() => {
                                    var self = $4110;
                                    switch (self._) {
                                        case 'Kindelia.Auth.new':
                                            var $4112 = self.bond;
                                            var $4113 = $4112;
                                            return $4113;
                                    };
                                })(), (() => {
                                    var self = $4110;
                                    switch (self._) {
                                        case 'Kindelia.Auth.new':
                                            var $4114 = self.args;
                                            var $4115 = $4114;
                                            return $4115;
                                    };
                                })());
                                var self = Kindelia$check$(Map$from_list$(List$nil), _world$1, _call$9, Kindelia$Type$word);
                                if (self) {
                                    var self = Kindelia$normalize$(Kindelia$Runtime$new$(_world$1, Map$from_list$(List$nil), 0n, 0n, _call$9));
                                    switch (self._) {
                                        case 'Kindelia.Runtime.new':
                                            var $4117 = self.term;
                                            var self = $4117;
                                            switch (self._) {
                                                case 'Kindelia.Term.word':
                                                    var $4119 = self.numb;
                                                    var $4120 = ($4119 === 1n);
                                                    var $4118 = $4120;
                                                    break;
                                                case 'Kindelia.Term.var':
                                                case 'Kindelia.Term.call':
                                                case 'Kindelia.Term.let':
                                                case 'Kindelia.Term.create':
                                                case 'Kindelia.Term.match':
                                                case 'Kindelia.Term.compare':
                                                case 'Kindelia.Term.operate':
                                                case 'Kindelia.Term.bind':
                                                    var $4121 = Bool$false;
                                                    var $4118 = $4121;
                                                    break;
                                            };
                                            var $4116 = $4118;
                                            break;
                                    };
                                    var $4111 = $4116;
                                } else {
                                    var $4122 = Bool$false;
                                    var $4111 = $4122;
                                };
                                var _auth$8 = $4111;
                                break;
                            case 'Maybe.none':
                                var $4123 = Bool$true;
                                var _auth$8 = $4123;
                                break;
                        };
                        var self = (_auth$8 && Kindelia$check$(Map$from_list$(List$nil), _world$1, $4107, $4108));
                        if (self) {
                            var self = Kindelia$sanitize$(_world$1, Map$from_list$(List$nil), 0n, $4107);
                            switch (self._) {
                                case 'Pair.new':
                                    var $4125 = self.fst;
                                    var $4126 = self.snd;
                                    var self = Kindelia$normalize$(Kindelia$Runtime$new$(_world$1, Map$from_list$(List$nil), $4125, 0n, $4126));
                                    switch (self._) {
                                        case 'Kindelia.Runtime.new':
                                            var $4128 = self.world;
                                            var $4129 = self.gas;
                                            var $4130 = self.term;
                                            var $4131 = Maybe$some$(Pair$new$($4128, ("[eval] " + ("<$" + (Nat$show$($4129) + ("> " + Kindelia$show$term$($4128, $4108, $4130)))))));
                                            var $4127 = $4131;
                                            break;
                                    };
                                    var $4124 = $4127;
                                    break;
                            };
                            var $4109 = $4124;
                        } else {
                            var $4132 = Maybe$none;
                            var $4109 = $4132;
                        };
                        var $4105 = $4109;
                        break;
                };
                var $4073 = $4105;
                break;
            case 'Kindelia.Transaction.new_name':
                var $4133 = self.name;
                var _name$4 = $4133;
                var self = _world$1;
                switch (self._) {
                    case 'Kindelia.World.new':
                        var $4135 = self.entry;
                        var $4136 = Kindelia$World$new$(List$concat$((() => {
                            var self = _world$1;
                            switch (self._) {
                                case 'Kindelia.World.new':
                                    var $4137 = self.names;
                                    var $4138 = $4137;
                                    return $4138;
                            };
                        })(), List$cons$(_name$4, List$nil)), $4135);
                        var _world$5 = $4136;
                        break;
                };
                var $4134 = Maybe$some$(Pair$new$(_world$5, ("[name] " + _name$4)));
                var $4073 = $4134;
                break;
        };
        return $4073;
    };
    const Kindelia$transact = x0 => x1 => Kindelia$transact$(x0, x1);

    function Kindelia$api$run$go$transactions$(_world$1, _block_number$2, _code$3, _transactions$4) {
        var self = _transactions$4;
        switch (self._) {
            case 'List.cons':
                var $4140 = self.head;
                var $4141 = self.tail;
                var self = Kindelia$transact$(_world$1, $4140);
                switch (self._) {
                    case 'Maybe.some':
                        var $4143 = self.value;
                        var self = $4143;
                        switch (self._) {
                            case 'Pair.new':
                                var $4145 = self.fst;
                                var $4146 = self.snd;
                                var $4147 = IO$monad$((_m$bind$10 => _m$pure$11 => {
                                    var $4148 = _m$bind$10;
                                    return $4148;
                                }))(IO$print$(("- " + $4146)))((_$10 => {
                                    var $4149 = Kindelia$api$run$go$transactions$($4145, _block_number$2, _code$3, $4141);
                                    return $4149;
                                }));
                                var $4144 = $4147;
                                break;
                        };
                        var $4142 = $4144;
                        break;
                    case 'Maybe.none':
                        var $4150 = IO$monad$((_m$bind$7 => _m$pure$8 => {
                            var $4151 = _m$bind$7;
                            return $4151;
                        }))(IO$print$("- [fail]"))((_$7 => {
                            var $4152 = Kindelia$api$run$go$transactions$(_world$1, _block_number$2, _code$3, $4141);
                            return $4152;
                        }));
                        var $4142 = $4150;
                        break;
                };
                var $4139 = $4142;
                break;
            case 'List.nil':
                var $4153 = IO$monad$((_m$bind$5 => _m$pure$6 => {
                    var $4154 = _m$bind$5;
                    return $4154;
                }))(IO$print$(""))((_$5 => {
                    var $4155 = Kindelia$api$run$go$(_world$1, Nat$succ$(_block_number$2), _code$3);
                    return $4155;
                }));
                var $4139 = $4153;
                break;
        };
        return $4139;
    };
    const Kindelia$api$run$go$transactions = x0 => x1 => x2 => x3 => Kindelia$api$run$go$transactions$(x0, x1, x2, x3);

    function Kindelia$api$run$go$(_world$1, _block_number$2, _code$3) {
        var _parsed$4 = Kindelia$parse$block$(_world$1)(Parser$State$new$(Maybe$none, "", 0n, 0n, _code$3));
        var self = _parsed$4;
        switch (self._) {
            case 'Parser.Reply.error':
                var $4157 = self.err;
                var self = $4157;
                switch (self._) {
                    case 'Parser.Error.new':
                        var $4159 = self.nam;
                        var $4160 = self.ini;
                        var $4161 = self.idx;
                        var $4162 = self.msg;
                        var self = ($4161 < String$length$(_code$3));
                        if (self) {
                            var _err$10 = ($4162 + (() => {
                                var self = $4159;
                                if (self.length === 0) {
                                    var $4165 = "";
                                    return $4165;
                                } else {
                                    var $4166 = self.charCodeAt(0);
                                    var $4167 = self.slice(1);
                                    var $4168 = (" Inside " + ($4159 + ":"));
                                    return $4168;
                                };
                            })());
                            var _hig$11 = Kind$Code$highlight$(_code$3, $4160, $4161, Nat$succ$($4161));
                            var _str$12 = String$flatten$(List$cons$(_err$10, List$cons$("\u{a}", List$cons$(_hig$11, List$nil))));
                            var $4164 = IO$monad$((_m$bind$13 => _m$pure$14 => {
                                var $4169 = _m$bind$13;
                                return $4169;
                            }))(IO$print$(("Error parsing block #" + Nat$show$(_block_number$2))))((_$13 => {
                                var $4170 = IO$print$(_str$12);
                                return $4170;
                            }));
                            var $4163 = $4164;
                        } else {
                            var $4171 = IO$print$("Done.");
                            var $4163 = $4171;
                        };
                        var $4158 = $4163;
                        break;
                };
                var $4156 = $4158;
                break;
            case 'Parser.Reply.value':
                var $4172 = self.pst;
                var $4173 = self.val;
                var _block$7 = $4173;
                var $4174 = IO$monad$((_m$bind$8 => _m$pure$9 => {
                    var $4175 = _m$bind$8;
                    return $4175;
                }))(IO$print$(("Block #" + Nat$show$(_block_number$2))))((_$8 => {
                    var _bits_0$9 = Kindelia$serialize$block$(_world$1, _block$7);
                    var _bits_1$10 = Kindelia$serialize$block$(_world$1, (() => {
                        var self = Kindelia$deserialize$block$(_world$1, _bits_0$9);
                        switch (self._) {
                            case 'Pair.new':
                                var $4177 = self.snd;
                                var $4178 = $4177;
                                return $4178;
                        };
                    })());
                    var $4176 = IO$monad$((_m$bind$11 => _m$pure$12 => {
                        var $4179 = _m$bind$11;
                        return $4179;
                    }))(IO$print$(("$ " + (Bits$hex$encode$(_bits_0$9) + (" " + (() => {
                        var self = (_bits_1$10 === _bits_0$9);
                        if (self) {
                            var $4180 = "ok";
                            return $4180;
                        } else {
                            var $4181 = "bad_serialization";
                            return $4181;
                        };
                    })())))))((_$11 => {
                        var $4182 = Kindelia$api$run$go$transactions$(_world$1, _block_number$2, (() => {
                            var self = $4172;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $4183 = self.str;
                                    var $4184 = $4183;
                                    return $4184;
                            };
                        })(), _block$7);
                        return $4182;
                    }));
                    return $4176;
                }));
                var $4156 = $4174;
                break;
        };
        return $4156;
    };
    const Kindelia$api$run$go = x0 => x1 => x2 => Kindelia$api$run$go$(x0, x1, x2);
    const Kindelia$genesis = Kindelia$World$new$(List$nil, Map$from_list$(List$nil));

    function Kindelia$api$run$(_code$1) {
        var $4185 = Kindelia$api$run$go$(Kindelia$genesis, 0n, _code$1);
        return $4185;
    };
    const Kindelia$api$run = x0 => Kindelia$api$run$(x0);
    const Kindelia = (() => {
        var _x$1 = Kindelia$api$run;
        var $4186 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $4187 = _m$pure$3;
            return $4187;
        }))(Unit$new);
        return $4186;
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
        'Kindelia.Auth.new': Kindelia$Auth$new,
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
        'Kindelia.get_ctrs': Kindelia$get_ctrs,
        'U64.to_nat': U64$to_nat,
        'Kindelia.serialize.term': Kindelia$serialize$term,
        'Kindelia.serialize.bond': Kindelia$serialize$bond,
        'Kindelia.serialize.maybe': Kindelia$serialize$maybe,
        'Kindelia.serialize.auth': Kindelia$serialize$auth,
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
        'Kindelia.deserialize.maybe': Kindelia$deserialize$maybe,
        'Kindelia.deserialize.auth': Kindelia$deserialize$auth,
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
        'List.length': List$length,
        'List.all': List$all,
        'List.zip_with': List$zip_with,
        'List.zipped_with': List$zipped_with,
        'List.and': List$and,
        'List.is_empty': List$is_empty,
        'Kindelia.check': Kindelia$check,
        'Kindelia.Runtime': Kindelia$Runtime,
        'Kindelia.Runtime.new': Kindelia$Runtime$new,
        'Triple': Triple,
        'Triple.new': Triple$new,
        'Kindelia.rename': Kindelia$rename,
        'Kindelia.rename.many': Kindelia$rename$many,
        'Kindelia.sanitize.many': Kindelia$sanitize$many,
        'List.for': List$for,
        'Kindelia.sanitize.cases': Kindelia$sanitize$cases,
        'Kindelia.sanitize': Kindelia$sanitize,
        'Kindelia.normalize.many': Kindelia$normalize$many,
        'Kindelia.cost.alloc': Kindelia$cost$alloc,
        'Kindelia.cost.create': Kindelia$cost$create,
        'Kindelia.cost.subs': Kindelia$cost$subs,
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