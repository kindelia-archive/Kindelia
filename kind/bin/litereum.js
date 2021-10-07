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

    function List$(_A$1) {
        var $30 = null;
        return $30;
    };
    const List = x0 => List$(x0);

    function Parser$Reply$error$(_err$2) {
        var $31 = ({
            _: 'Parser.Reply.error',
            'err': _err$2
        });
        return $31;
    };
    const Parser$Reply$error = x0 => Parser$Reply$error$(x0);
    const Bool$false = false;
    const Bool$true = true;
    const Nat$gtn = a0 => a1 => (a0 > a1);

    function Parser$Error$combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Parser.Error.new':
                var $33 = self.idx;
                var self = _b$2;
                switch (self._) {
                    case 'Parser.Error.new':
                        var $35 = self.idx;
                        var self = ($33 > $35);
                        if (self) {
                            var $37 = _a$1;
                            var $36 = $37;
                        } else {
                            var $38 = _b$2;
                            var $36 = $38;
                        };
                        var $34 = $36;
                        break;
                };
                var $32 = $34;
                break;
        };
        return $32;
    };
    const Parser$Error$combine = x0 => x1 => Parser$Error$combine$(x0, x1);

    function List$cons$(_head$2, _tail$3) {
        var $39 = ({
            _: 'List.cons',
            'head': _head$2,
            'tail': _tail$3
        });
        return $39;
    };
    const List$cons = x0 => x1 => List$cons$(x0, x1);

    function Parser$Reply$value$(_pst$2, _val$3) {
        var $40 = ({
            _: 'Parser.Reply.value',
            'pst': _pst$2,
            'val': _val$3
        });
        return $40;
    };
    const Parser$Reply$value = x0 => x1 => Parser$Reply$value$(x0, x1);

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
                        var $41 = self.head;
                        var $42 = self.tail;
                        var $43 = List$reverse$go$($42, List$cons$($41, _res$3));
                        return $43;
                    case 'List.nil':
                        var $44 = _res$3;
                        return $44;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$reverse$go = x0 => x1 => List$reverse$go$(x0, x1);
    const List$nil = ({
        _: 'List.nil'
    });

    function List$reverse$(_xs$2) {
        var $45 = List$reverse$go$(_xs$2, List$nil);
        return $45;
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
                        var $47 = self.err;
                        var _reply$8 = _parse$3(_pst$5);
                        var self = _reply$8;
                        switch (self._) {
                            case 'Parser.Reply.error':
                                var $49 = self.err;
                                var $50 = Parser$Reply$error$(Parser$Error$combine$($49, $47));
                                var $48 = $50;
                                break;
                            case 'Parser.Reply.value':
                                var $51 = self.pst;
                                var $52 = self.val;
                                var $53 = Parser$until$go$(_until$2, _parse$3, List$cons$($52, _values$4), $51);
                                var $48 = $53;
                                break;
                        };
                        var $46 = $48;
                        break;
                    case 'Parser.Reply.value':
                        var $54 = self.pst;
                        var $55 = Parser$Reply$value$($54, List$reverse$(_values$4));
                        var $46 = $55;
                        break;
                };
                return $46;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$until$go = x0 => x1 => x2 => x3 => Parser$until$go$(x0, x1, x2, x3);

    function Parser$until$(_until$2, _parse$3) {
        var $56 = Parser$until$go(_until$2)(_parse$3)(List$nil);
        return $56;
    };
    const Parser$until = x0 => x1 => Parser$until$(x0, x1);

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
                                var $58 = self.pst;
                                var $59 = self.val;
                                var $60 = Parser$many$go$(_parse$2, (_xs$12 => {
                                    var $61 = _values$3(List$cons$($59, _xs$12));
                                    return $61;
                                }), $58);
                                var $57 = $60;
                                break;
                            case 'Parser.Reply.error':
                                var $62 = Parser$Reply$value$(_pst$4, _values$3(List$nil));
                                var $57 = $62;
                                break;
                        };
                        return $57;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$many$go = x0 => x1 => x2 => Parser$many$go$(x0, x1, x2);

    function Parser$many$(_parser$2) {
        var $63 = Parser$many$go(_parser$2)((_x$3 => {
            var $64 = _x$3;
            return $64;
        }));
        return $63;
    };
    const Parser$many = x0 => Parser$many$(x0);

    function Parser$Error$new$(_nam$1, _ini$2, _idx$3, _msg$4) {
        var $65 = ({
            _: 'Parser.Error.new',
            'nam': _nam$1,
            'ini': _ini$2,
            'idx': _idx$3,
            'msg': _msg$4
        });
        return $65;
    };
    const Parser$Error$new = x0 => x1 => x2 => x3 => Parser$Error$new$(x0, x1, x2, x3);

    function Parser$Reply$fail$(_nam$2, _ini$3, _idx$4, _msg$5) {
        var $66 = Parser$Reply$error$(Parser$Error$new$(_nam$2, _ini$3, _idx$4, _msg$5));
        return $66;
    };
    const Parser$Reply$fail = x0 => x1 => x2 => x3 => Parser$Reply$fail$(x0, x1, x2, x3);

    function Maybe$some$(_value$2) {
        var $67 = ({
            _: 'Maybe.some',
            'value': _value$2
        });
        return $67;
    };
    const Maybe$some = x0 => Maybe$some$(x0);

    function Maybe$(_A$1) {
        var $68 = null;
        return $68;
    };
    const Maybe = x0 => Maybe$(x0);
    const Maybe$none = ({
        _: 'Maybe.none'
    });

    function Parser$Error$maybe_combine$(_a$1, _b$2) {
        var self = _a$1;
        switch (self._) {
            case 'Maybe.some':
                var $70 = self.value;
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.some':
                        var $72 = self.value;
                        var $73 = Maybe$some$(Parser$Error$combine$($70, $72));
                        var $71 = $73;
                        break;
                    case 'Maybe.none':
                        var $74 = _a$1;
                        var $71 = $74;
                        break;
                };
                var $69 = $71;
                break;
            case 'Maybe.none':
                var self = _b$2;
                switch (self._) {
                    case 'Maybe.none':
                        var $76 = Maybe$none;
                        var $75 = $76;
                        break;
                    case 'Maybe.some':
                        var $77 = _b$2;
                        var $75 = $77;
                        break;
                };
                var $69 = $75;
                break;
        };
        return $69;
    };
    const Parser$Error$maybe_combine = x0 => x1 => Parser$Error$maybe_combine$(x0, x1);

    function Parser$State$new$(_err$1, _nam$2, _ini$3, _idx$4, _str$5) {
        var $78 = ({
            _: 'Parser.State.new',
            'err': _err$1,
            'nam': _nam$2,
            'ini': _ini$3,
            'idx': _idx$4,
            'str': _str$5
        });
        return $78;
    };
    const Parser$State$new = x0 => x1 => x2 => x3 => x4 => Parser$State$new$(x0, x1, x2, x3, x4);

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
                        var $79 = self.err;
                        var $80 = self.nam;
                        var $81 = self.ini;
                        var $82 = self.idx;
                        var $83 = self.str;
                        var self = _pars$2;
                        switch (self._) {
                            case 'List.cons':
                                var $85 = self.head;
                                var $86 = self.tail;
                                var _parsed$11 = $85(_pst$3);
                                var self = _parsed$11;
                                switch (self._) {
                                    case 'Parser.Reply.error':
                                        var $88 = self.err;
                                        var _cur_err$13 = Maybe$some$($88);
                                        var _far_err$14 = Parser$Error$maybe_combine$($79, _cur_err$13);
                                        var _new_pst$15 = Parser$State$new$(_far_err$14, $80, $81, $82, $83);
                                        var $89 = Parser$choice$($86, _new_pst$15);
                                        var $87 = $89;
                                        break;
                                    case 'Parser.Reply.value':
                                        var $90 = self.pst;
                                        var $91 = self.val;
                                        var $92 = Parser$Reply$value$($90, $91);
                                        var $87 = $92;
                                        break;
                                };
                                var $84 = $87;
                                break;
                            case 'List.nil':
                                var self = $79;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $94 = self.value;
                                        var $95 = Parser$Reply$error$($94);
                                        var $93 = $95;
                                        break;
                                    case 'Maybe.none':
                                        var $96 = Parser$Reply$fail$($80, $81, $82, "No parse.");
                                        var $93 = $96;
                                        break;
                                };
                                var $84 = $93;
                                break;
                        };
                        return $84;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Parser$choice = x0 => x1 => Parser$choice$(x0, x1);

    function Parser$(_V$1) {
        var $97 = null;
        return $97;
    };
    const Parser = x0 => Parser$(x0);
    const Unit$new = null;

    function String$cons$(_head$1, _tail$2) {
        var $98 = (String.fromCharCode(_head$1) + _tail$2);
        return $98;
    };
    const String$cons = x0 => x1 => String$cons$(x0, x1);
    const String$concat = a0 => a1 => (a0 + a1);

    function Cmp$as_eql$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.gtn':
                var $100 = Bool$false;
                var $99 = $100;
                break;
            case 'Cmp.eql':
                var $101 = Bool$true;
                var $99 = $101;
                break;
        };
        return $99;
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
                var $103 = self.pred;
                var $104 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $106 = self.pred;
                            var $107 = (_a$pred$10 => {
                                var $108 = Word$cmp$go$(_a$pred$10, $106, _c$4);
                                return $108;
                            });
                            var $105 = $107;
                            break;
                        case 'Word.i':
                            var $109 = self.pred;
                            var $110 = (_a$pred$10 => {
                                var $111 = Word$cmp$go$(_a$pred$10, $109, Cmp$ltn);
                                return $111;
                            });
                            var $105 = $110;
                            break;
                        case 'Word.e':
                            var $112 = (_a$pred$8 => {
                                var $113 = _c$4;
                                return $113;
                            });
                            var $105 = $112;
                            break;
                    };
                    var $105 = $105($103);
                    return $105;
                });
                var $102 = $104;
                break;
            case 'Word.i':
                var $114 = self.pred;
                var $115 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $117 = self.pred;
                            var $118 = (_a$pred$10 => {
                                var $119 = Word$cmp$go$(_a$pred$10, $117, Cmp$gtn);
                                return $119;
                            });
                            var $116 = $118;
                            break;
                        case 'Word.i':
                            var $120 = self.pred;
                            var $121 = (_a$pred$10 => {
                                var $122 = Word$cmp$go$(_a$pred$10, $120, _c$4);
                                return $122;
                            });
                            var $116 = $121;
                            break;
                        case 'Word.e':
                            var $123 = (_a$pred$8 => {
                                var $124 = _c$4;
                                return $124;
                            });
                            var $116 = $123;
                            break;
                    };
                    var $116 = $116($114);
                    return $116;
                });
                var $102 = $115;
                break;
            case 'Word.e':
                var $125 = (_b$5 => {
                    var $126 = _c$4;
                    return $126;
                });
                var $102 = $125;
                break;
        };
        var $102 = $102(_b$3);
        return $102;
    };
    const Word$cmp$go = x0 => x1 => x2 => Word$cmp$go$(x0, x1, x2);
    const Cmp$eql = ({
        _: 'Cmp.eql'
    });

    function Word$cmp$(_a$2, _b$3) {
        var $127 = Word$cmp$go$(_a$2, _b$3, Cmp$eql);
        return $127;
    };
    const Word$cmp = x0 => x1 => Word$cmp$(x0, x1);

    function Word$eql$(_a$2, _b$3) {
        var $128 = Cmp$as_eql$(Word$cmp$(_a$2, _b$3));
        return $128;
    };
    const Word$eql = x0 => x1 => Word$eql$(x0, x1);

    function Nat$succ$(_pred$1) {
        var $129 = 1n + _pred$1;
        return $129;
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
                        var $130 = self.err;
                        var $131 = self.nam;
                        var $132 = self.ini;
                        var $133 = self.idx;
                        var $134 = self.str;
                        var self = _text$3;
                        if (self.length === 0) {
                            var $136 = Parser$Reply$value$(_pst$4, Unit$new);
                            var $135 = $136;
                        } else {
                            var $137 = self.charCodeAt(0);
                            var $138 = self.slice(1);
                            var self = $134;
                            if (self.length === 0) {
                                var _error_msg$12 = ("Expected \'" + (_ini_txt$2 + "\', found end of file."));
                                var $140 = Parser$Reply$fail$($131, $132, _ini_idx$1, _error_msg$12);
                                var $139 = $140;
                            } else {
                                var $141 = self.charCodeAt(0);
                                var $142 = self.slice(1);
                                var self = ($137 === $141);
                                if (self) {
                                    var _pst$14 = Parser$State$new$($130, $131, $132, Nat$succ$($133), $142);
                                    var $144 = Parser$text$go$(_ini_idx$1, _ini_txt$2, $138, _pst$14);
                                    var $143 = $144;
                                } else {
                                    var _chr$14 = String$cons$($141, String$nil);
                                    var _err$15 = ("Expected \'" + (_ini_txt$2 + ("\', found \'" + (_chr$14 + "\'."))));
                                    var $145 = Parser$Reply$fail$($131, $132, _ini_idx$1, _err$15);
                                    var $143 = $145;
                                };
                                var $139 = $143;
                            };
                            var $135 = $139;
                        };
                        return $135;
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
                var $147 = self.idx;
                var self = Parser$text$go$($147, _text$1, _text$1, _pst$2);
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $149 = self.err;
                        var $150 = Parser$Reply$error$($149);
                        var $148 = $150;
                        break;
                    case 'Parser.Reply.value':
                        var $151 = self.pst;
                        var $152 = self.val;
                        var $153 = Parser$Reply$value$($151, $152);
                        var $148 = $153;
                        break;
                };
                var $146 = $148;
                break;
        };
        return $146;
    };
    const Parser$text = x0 => x1 => Parser$text$(x0, x1);

    function Parser$eof$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $155 = self.nam;
                var $156 = self.ini;
                var $157 = self.idx;
                var $158 = self.str;
                var self = $158;
                if (self.length === 0) {
                    var $160 = Parser$Reply$value$(_pst$1, Unit$new);
                    var $159 = $160;
                } else {
                    var $161 = self.charCodeAt(0);
                    var $162 = self.slice(1);
                    var $163 = Parser$Reply$fail$($155, $156, $157, "Expected end-of-file.");
                    var $159 = $163;
                };
                var $154 = $159;
                break;
        };
        return $154;
    };
    const Parser$eof = x0 => Parser$eof$(x0);

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
    const Litereum$parse$ignore = Parser$many$(Parser$choice(List$cons$(Parser$text(" "), List$cons$(Parser$text("\u{9}"), List$cons$(Parser$text("\u{d}"), List$cons$(Parser$text("\u{a}"), List$cons$((_pst$1 => {
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

    function Litereum$parse$text$(_text$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $207 = self.err;
                var _reply$8 = Litereum$parse$ignore(_pst$2);
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
    const Litereum$parse$text = x0 => x1 => Litereum$parse$text$(x0, x1);

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
    const Litereum$parse$letter = Parser$letter((_chr$1 => {
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

    function Litereum$parse$name$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $259 = self.err;
                var _reply$7 = Litereum$parse$ignore(_pst$1);
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
                                        var _reply$21 = Litereum$parse$letter(_reply$pst$15);
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
                                                                var _reply$35 = Parser$many$(Litereum$parse$letter)(_reply$pst$29);
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
    const Litereum$parse$name = x0 => Litereum$parse$name$(x0);

    function Litereum$Transaction$new_name$(_name$1) {
        var $306 = ({
            _: 'Litereum.Transaction.new_name',
            'name': _name$1
        });
        return $306;
    };
    const Litereum$Transaction$new_name = x0 => Litereum$Transaction$new_name$(x0);

    function Parser$wrap$(_opens$2, _parse$3, _close$4, _pst$5) {
        var self = _pst$5;
        switch (self._) {
            case 'Parser.State.new':
                var $308 = self.err;
                var _reply$11 = _opens$2(_pst$5);
                var self = _reply$11;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $310 = self.err;
                        var self = $308;
                        switch (self._) {
                            case 'Maybe.some':
                                var $312 = self.value;
                                var $313 = Parser$Reply$error$(Parser$Error$combine$($312, $310));
                                var $311 = $313;
                                break;
                            case 'Maybe.none':
                                var $314 = Parser$Reply$error$($310);
                                var $311 = $314;
                                break;
                        };
                        var $309 = $311;
                        break;
                    case 'Parser.Reply.value':
                        var $315 = self.pst;
                        var self = $315;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $317 = self.err;
                                var $318 = self.nam;
                                var $319 = self.ini;
                                var $320 = self.idx;
                                var $321 = self.str;
                                var _reply$pst$19 = Parser$State$new$(Parser$Error$maybe_combine$($308, $317), $318, $319, $320, $321);
                                var $322 = Parser$until$(_close$4, _parse$3)(_reply$pst$19);
                                var $316 = $322;
                                break;
                        };
                        var $309 = $316;
                        break;
                };
                var $307 = $309;
                break;
        };
        return $307;
    };
    const Parser$wrap = x0 => x1 => x2 => x3 => Parser$wrap$(x0, x1, x2, x3);

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

    function Pair$(_A$1, _B$2) {
        var $329 = null;
        return $329;
    };
    const Pair = x0 => x1 => Pair$(x0, x1);

    function Litereum$Type$effect$(_rety$1) {
        var $330 = ({
            _: 'Litereum.Type.effect',
            'rety': _rety$1
        });
        return $330;
    };
    const Litereum$Type$effect = x0 => Litereum$Type$effect$(x0);
    const Litereum$Type$word = ({
        _: 'Litereum.Type.word'
    });

    function Litereum$Type$data$(_name$1) {
        var $331 = ({
            _: 'Litereum.Type.data',
            'name': _name$1
        });
        return $331;
    };
    const Litereum$Type$data = x0 => Litereum$Type$data$(x0);

    function Litereum$parse$type$(_world$1) {
        var $332 = Parser$choice(List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $334 = self.err;
                    var _reply$8 = Litereum$parse$text$("&", _pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $336 = self.err;
                            var self = $334;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $338 = self.value;
                                    var $339 = Parser$Reply$error$(Parser$Error$combine$($338, $336));
                                    var $337 = $339;
                                    break;
                                case 'Maybe.none':
                                    var $340 = Parser$Reply$error$($336);
                                    var $337 = $340;
                                    break;
                            };
                            var $335 = $337;
                            break;
                        case 'Parser.Reply.value':
                            var $341 = self.pst;
                            var self = $341;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $343 = self.err;
                                    var $344 = self.nam;
                                    var $345 = self.ini;
                                    var $346 = self.idx;
                                    var $347 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($334, $343), $344, $345, $346, $347);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $349 = self.err;
                                            var _reply$22 = Litereum$parse$type$(_world$1)(_reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $351 = self.err;
                                                    var self = $349;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $353 = self.value;
                                                            var $354 = Parser$Reply$error$(Parser$Error$combine$($353, $351));
                                                            var $352 = $354;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $355 = Parser$Reply$error$($351);
                                                            var $352 = $355;
                                                            break;
                                                    };
                                                    var $350 = $352;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $356 = self.pst;
                                                    var $357 = self.val;
                                                    var self = $356;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $359 = self.err;
                                                            var $360 = self.nam;
                                                            var $361 = self.ini;
                                                            var $362 = self.idx;
                                                            var $363 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($349, $359), $360, $361, $362, $363);
                                                            var $364 = Parser$Reply$value$(_reply$pst$30, Litereum$Type$effect$($357));
                                                            var $358 = $364;
                                                            break;
                                                    };
                                                    var $350 = $358;
                                                    break;
                                            };
                                            var $348 = $350;
                                            break;
                                    };
                                    var $342 = $348;
                                    break;
                            };
                            var $335 = $342;
                            break;
                    };
                    var $333 = $335;
                    break;
            };
            return $333;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $366 = self.err;
                    var _reply$8 = Litereum$parse$text$("#word", _pst$2);
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
                                    var $380 = Parser$Reply$value$(_reply$pst$16, Litereum$Type$word);
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
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $382 = self.err;
                    var _reply$8 = Litereum$parse$name$(_pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $384 = self.err;
                            var self = $382;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $386 = self.value;
                                    var $387 = Parser$Reply$error$(Parser$Error$combine$($386, $384));
                                    var $385 = $387;
                                    break;
                                case 'Maybe.none':
                                    var $388 = Parser$Reply$error$($384);
                                    var $385 = $388;
                                    break;
                            };
                            var $383 = $385;
                            break;
                        case 'Parser.Reply.value':
                            var $389 = self.pst;
                            var $390 = self.val;
                            var self = $389;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $392 = self.err;
                                    var $393 = self.nam;
                                    var $394 = self.ini;
                                    var $395 = self.idx;
                                    var $396 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($382, $392), $393, $394, $395, $396);
                                    var $397 = Parser$Reply$value$(_reply$pst$16, Litereum$Type$data$($390));
                                    var $391 = $397;
                                    break;
                            };
                            var $383 = $391;
                            break;
                    };
                    var $381 = $383;
                    break;
            };
            return $381;
        }), List$nil))));
        return $332;
    };
    const Litereum$parse$type = x0 => Litereum$parse$type$(x0);

    function Pair$new$(_fst$3, _snd$4) {
        var $398 = ({
            _: 'Pair.new',
            'fst': _fst$3,
            'snd': _snd$4
        });
        return $398;
    };
    const Pair$new = x0 => x1 => Pair$new$(x0, x1);

    function Litereum$parse$ann$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $400 = self.err;
                var _reply$8 = Parser$maybe$(Litereum$parse$text(","), _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $402 = self.err;
                        var self = $400;
                        switch (self._) {
                            case 'Maybe.some':
                                var $404 = self.value;
                                var $405 = Parser$Reply$error$(Parser$Error$combine$($404, $402));
                                var $403 = $405;
                                break;
                            case 'Maybe.none':
                                var $406 = Parser$Reply$error$($402);
                                var $403 = $406;
                                break;
                        };
                        var $401 = $403;
                        break;
                    case 'Parser.Reply.value':
                        var $407 = self.pst;
                        var self = $407;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $409 = self.err;
                                var $410 = self.nam;
                                var $411 = self.ini;
                                var $412 = self.idx;
                                var $413 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($400, $409), $410, $411, $412, $413);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $415 = self.err;
                                        var _reply$22 = Litereum$parse$name$(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $417 = self.err;
                                                var self = $415;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $419 = self.value;
                                                        var $420 = Parser$Reply$error$(Parser$Error$combine$($419, $417));
                                                        var $418 = $420;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $421 = Parser$Reply$error$($417);
                                                        var $418 = $421;
                                                        break;
                                                };
                                                var $416 = $418;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $422 = self.pst;
                                                var $423 = self.val;
                                                var self = $422;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $425 = self.err;
                                                        var $426 = self.nam;
                                                        var $427 = self.ini;
                                                        var $428 = self.idx;
                                                        var $429 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($415, $425), $426, $427, $428, $429);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $431 = self.err;
                                                                var _reply$36 = Litereum$parse$text$(":", _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $433 = self.err;
                                                                        var self = $431;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $435 = self.value;
                                                                                var $436 = Parser$Reply$error$(Parser$Error$combine$($435, $433));
                                                                                var $434 = $436;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $437 = Parser$Reply$error$($433);
                                                                                var $434 = $437;
                                                                                break;
                                                                        };
                                                                        var $432 = $434;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $438 = self.pst;
                                                                        var self = $438;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $440 = self.err;
                                                                                var $441 = self.nam;
                                                                                var $442 = self.ini;
                                                                                var $443 = self.idx;
                                                                                var $444 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($431, $440), $441, $442, $443, $444);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $446 = self.err;
                                                                                        var _reply$50 = Litereum$parse$type$(_world$1)(_reply$pst$44);
                                                                                        var self = _reply$50;
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
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($446, $456), $457, $458, $459, $460);
                                                                                                        var $461 = Parser$Reply$value$(_reply$pst$58, Pair$new$($423, $454));
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
                                                                        var $432 = $439;
                                                                        break;
                                                                };
                                                                var $430 = $432;
                                                                break;
                                                        };
                                                        var $424 = $430;
                                                        break;
                                                };
                                                var $416 = $424;
                                                break;
                                        };
                                        var $414 = $416;
                                        break;
                                };
                                var $408 = $414;
                                break;
                        };
                        var $401 = $408;
                        break;
                };
                var $399 = $401;
                break;
        };
        return $399;
    };
    const Litereum$parse$ann = x0 => x1 => Litereum$parse$ann$(x0, x1);

    function List$mapped$(_as$2, _f$4) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $463 = self.head;
                var $464 = self.tail;
                var $465 = List$cons$(_f$4($463), List$mapped$($464, _f$4));
                var $462 = $465;
                break;
            case 'List.nil':
                var $466 = List$nil;
                var $462 = $466;
                break;
        };
        return $462;
    };
    const List$mapped = x0 => x1 => List$mapped$(x0, x1);

    function Litereum$Constructor$new$(_name$1, _field_names$2, _field_types$3) {
        var $467 = ({
            _: 'Litereum.Constructor.new',
            'name': _name$1,
            'field_names': _field_names$2,
            'field_types': _field_types$3
        });
        return $467;
    };
    const Litereum$Constructor$new = x0 => x1 => x2 => Litereum$Constructor$new$(x0, x1, x2);

    function Litereum$parse$constructor$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $469 = self.err;
                var _reply$8 = Litereum$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $471 = self.err;
                        var self = $469;
                        switch (self._) {
                            case 'Maybe.some':
                                var $473 = self.value;
                                var $474 = Parser$Reply$error$(Parser$Error$combine$($473, $471));
                                var $472 = $474;
                                break;
                            case 'Maybe.none':
                                var $475 = Parser$Reply$error$($471);
                                var $472 = $475;
                                break;
                        };
                        var $470 = $472;
                        break;
                    case 'Parser.Reply.value':
                        var $476 = self.pst;
                        var $477 = self.val;
                        var self = $476;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $479 = self.err;
                                var $480 = self.nam;
                                var $481 = self.ini;
                                var $482 = self.idx;
                                var $483 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($469, $479), $480, $481, $482, $483);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $485 = self.err;
                                        var _reply$22 = Parser$wrap$(Litereum$parse$text("{"), Litereum$parse$ann(_world$1), Litereum$parse$text("}"), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $487 = self.err;
                                                var self = $485;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $489 = self.value;
                                                        var $490 = Parser$Reply$error$(Parser$Error$combine$($489, $487));
                                                        var $488 = $490;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $491 = Parser$Reply$error$($487);
                                                        var $488 = $491;
                                                        break;
                                                };
                                                var $486 = $488;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $492 = self.pst;
                                                var $493 = self.val;
                                                var self = $492;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $495 = self.err;
                                                        var $496 = self.nam;
                                                        var $497 = self.ini;
                                                        var $498 = self.idx;
                                                        var $499 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($485, $495), $496, $497, $498, $499);
                                                        var _nams$31 = List$mapped$($493, (_x$31 => {
                                                            var self = _x$31;
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $502 = self.fst;
                                                                    var $503 = $502;
                                                                    var $501 = $503;
                                                                    break;
                                                            };
                                                            return $501;
                                                        }));
                                                        var _typs$32 = List$mapped$($493, (_x$32 => {
                                                            var self = _x$32;
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $505 = self.snd;
                                                                    var $506 = $505;
                                                                    var $504 = $506;
                                                                    break;
                                                            };
                                                            return $504;
                                                        }));
                                                        var $500 = Parser$Reply$value$(_reply$pst$30, Litereum$Constructor$new$($477, _nams$31, _typs$32));
                                                        var $494 = $500;
                                                        break;
                                                };
                                                var $486 = $494;
                                                break;
                                        };
                                        var $484 = $486;
                                        break;
                                };
                                var $478 = $484;
                                break;
                        };
                        var $470 = $478;
                        break;
                };
                var $468 = $470;
                break;
        };
        return $468;
    };
    const Litereum$parse$constructor = x0 => x1 => Litereum$parse$constructor$(x0, x1);

    function Litereum$Data$new$(_name$1, _constructors$2) {
        var $507 = ({
            _: 'Litereum.Data.new',
            'name': _name$1,
            'constructors': _constructors$2
        });
        return $507;
    };
    const Litereum$Data$new = x0 => x1 => Litereum$Data$new$(x0, x1);

    function Litereum$parse$data$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $509 = self.err;
                var _reply$8 = Litereum$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $511 = self.err;
                        var self = $509;
                        switch (self._) {
                            case 'Maybe.some':
                                var $513 = self.value;
                                var $514 = Parser$Reply$error$(Parser$Error$combine$($513, $511));
                                var $512 = $514;
                                break;
                            case 'Maybe.none':
                                var $515 = Parser$Reply$error$($511);
                                var $512 = $515;
                                break;
                        };
                        var $510 = $512;
                        break;
                    case 'Parser.Reply.value':
                        var $516 = self.pst;
                        var $517 = self.val;
                        var self = $516;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $519 = self.err;
                                var $520 = self.nam;
                                var $521 = self.ini;
                                var $522 = self.idx;
                                var $523 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($509, $519), $520, $521, $522, $523);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $525 = self.err;
                                        var _reply$22 = Parser$wrap$(Litereum$parse$text("{"), (_pst$22 => {
                                            var self = _pst$22;
                                            switch (self._) {
                                                case 'Parser.State.new':
                                                    var $528 = self.err;
                                                    var _reply$28 = Parser$maybe$(Litereum$parse$text(","), _pst$22);
                                                    var self = _reply$28;
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $530 = self.err;
                                                            var self = $528;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $532 = self.value;
                                                                    var $533 = Parser$Reply$error$(Parser$Error$combine$($532, $530));
                                                                    var $531 = $533;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $534 = Parser$Reply$error$($530);
                                                                    var $531 = $534;
                                                                    break;
                                                            };
                                                            var $529 = $531;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $535 = self.pst;
                                                            var self = $535;
                                                            switch (self._) {
                                                                case 'Parser.State.new':
                                                                    var $537 = self.err;
                                                                    var $538 = self.nam;
                                                                    var $539 = self.ini;
                                                                    var $540 = self.idx;
                                                                    var $541 = self.str;
                                                                    var _reply$pst$36 = Parser$State$new$(Parser$Error$maybe_combine$($528, $537), $538, $539, $540, $541);
                                                                    var $542 = Litereum$parse$constructor$(_world$1, _reply$pst$36);
                                                                    var $536 = $542;
                                                                    break;
                                                            };
                                                            var $529 = $536;
                                                            break;
                                                    };
                                                    var $527 = $529;
                                                    break;
                                            };
                                            return $527;
                                        }), Litereum$parse$text("}"), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $543 = self.err;
                                                var self = $525;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $545 = self.value;
                                                        var $546 = Parser$Reply$error$(Parser$Error$combine$($545, $543));
                                                        var $544 = $546;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $547 = Parser$Reply$error$($543);
                                                        var $544 = $547;
                                                        break;
                                                };
                                                var $526 = $544;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $548 = self.pst;
                                                var $549 = self.val;
                                                var self = $548;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $551 = self.err;
                                                        var $552 = self.nam;
                                                        var $553 = self.ini;
                                                        var $554 = self.idx;
                                                        var $555 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($525, $551), $552, $553, $554, $555);
                                                        var $556 = Parser$Reply$value$(_reply$pst$30, Litereum$Data$new$($517, $549));
                                                        var $550 = $556;
                                                        break;
                                                };
                                                var $526 = $550;
                                                break;
                                        };
                                        var $524 = $526;
                                        break;
                                };
                                var $518 = $524;
                                break;
                        };
                        var $510 = $518;
                        break;
                };
                var $508 = $510;
                break;
        };
        return $508;
    };
    const Litereum$parse$data = x0 => x1 => Litereum$parse$data$(x0, x1);

    function Litereum$Transaction$new_data$(_data$1) {
        var $557 = ({
            _: 'Litereum.Transaction.new_data',
            'data': _data$1
        });
        return $557;
    };
    const Litereum$Transaction$new_data = x0 => Litereum$Transaction$new_data$(x0);

    function Litereum$Term$let$(_name$1, _type$2, _expr$3, _body$4) {
        var $558 = ({
            _: 'Litereum.Term.let',
            'name': _name$1,
            'type': _type$2,
            'expr': _expr$3,
            'body': _body$4
        });
        return $558;
    };
    const Litereum$Term$let = x0 => x1 => x2 => x3 => Litereum$Term$let$(x0, x1, x2, x3);

    function Litereum$parse$term$let$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $560 = self.err;
                var _reply$8 = Litereum$parse$text$("let", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $562 = self.err;
                        var self = $560;
                        switch (self._) {
                            case 'Maybe.some':
                                var $564 = self.value;
                                var $565 = Parser$Reply$error$(Parser$Error$combine$($564, $562));
                                var $563 = $565;
                                break;
                            case 'Maybe.none':
                                var $566 = Parser$Reply$error$($562);
                                var $563 = $566;
                                break;
                        };
                        var $561 = $563;
                        break;
                    case 'Parser.Reply.value':
                        var $567 = self.pst;
                        var self = $567;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $569 = self.err;
                                var $570 = self.nam;
                                var $571 = self.ini;
                                var $572 = self.idx;
                                var $573 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($560, $569), $570, $571, $572, $573);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $575 = self.err;
                                        var _reply$22 = Litereum$parse$name$(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $577 = self.err;
                                                var self = $575;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $579 = self.value;
                                                        var $580 = Parser$Reply$error$(Parser$Error$combine$($579, $577));
                                                        var $578 = $580;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $581 = Parser$Reply$error$($577);
                                                        var $578 = $581;
                                                        break;
                                                };
                                                var $576 = $578;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $582 = self.pst;
                                                var $583 = self.val;
                                                var self = $582;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $585 = self.err;
                                                        var $586 = self.nam;
                                                        var $587 = self.ini;
                                                        var $588 = self.idx;
                                                        var $589 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($575, $585), $586, $587, $588, $589);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $591 = self.err;
                                                                var _reply$36 = Litereum$parse$text$(":", _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $593 = self.err;
                                                                        var self = $591;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $595 = self.value;
                                                                                var $596 = Parser$Reply$error$(Parser$Error$combine$($595, $593));
                                                                                var $594 = $596;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $597 = Parser$Reply$error$($593);
                                                                                var $594 = $597;
                                                                                break;
                                                                        };
                                                                        var $592 = $594;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $598 = self.pst;
                                                                        var self = $598;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $600 = self.err;
                                                                                var $601 = self.nam;
                                                                                var $602 = self.ini;
                                                                                var $603 = self.idx;
                                                                                var $604 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($591, $600), $601, $602, $603, $604);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $606 = self.err;
                                                                                        var _reply$50 = Litereum$parse$type$(_world$1)(_reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $608 = self.err;
                                                                                                var self = $606;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $610 = self.value;
                                                                                                        var $611 = Parser$Reply$error$(Parser$Error$combine$($610, $608));
                                                                                                        var $609 = $611;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $612 = Parser$Reply$error$($608);
                                                                                                        var $609 = $612;
                                                                                                        break;
                                                                                                };
                                                                                                var $607 = $609;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $613 = self.pst;
                                                                                                var $614 = self.val;
                                                                                                var self = $613;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $616 = self.err;
                                                                                                        var $617 = self.nam;
                                                                                                        var $618 = self.ini;
                                                                                                        var $619 = self.idx;
                                                                                                        var $620 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($606, $616), $617, $618, $619, $620);
                                                                                                        var self = _reply$pst$58;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $622 = self.err;
                                                                                                                var _reply$64 = Litereum$parse$text$("=", _reply$pst$58);
                                                                                                                var self = _reply$64;
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $624 = self.err;
                                                                                                                        var self = $622;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Maybe.some':
                                                                                                                                var $626 = self.value;
                                                                                                                                var $627 = Parser$Reply$error$(Parser$Error$combine$($626, $624));
                                                                                                                                var $625 = $627;
                                                                                                                                break;
                                                                                                                            case 'Maybe.none':
                                                                                                                                var $628 = Parser$Reply$error$($624);
                                                                                                                                var $625 = $628;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $623 = $625;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $629 = self.pst;
                                                                                                                        var self = $629;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $631 = self.err;
                                                                                                                                var $632 = self.nam;
                                                                                                                                var $633 = self.ini;
                                                                                                                                var $634 = self.idx;
                                                                                                                                var $635 = self.str;
                                                                                                                                var _reply$pst$72 = Parser$State$new$(Parser$Error$maybe_combine$($622, $631), $632, $633, $634, $635);
                                                                                                                                var self = _reply$pst$72;
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.State.new':
                                                                                                                                        var $637 = self.err;
                                                                                                                                        var _reply$78 = Litereum$parse$term$(_world$1)(_reply$pst$72);
                                                                                                                                        var self = _reply$78;
                                                                                                                                        switch (self._) {
                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                var $639 = self.err;
                                                                                                                                                var self = $637;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                        var $641 = self.value;
                                                                                                                                                        var $642 = Parser$Reply$error$(Parser$Error$combine$($641, $639));
                                                                                                                                                        var $640 = $642;
                                                                                                                                                        break;
                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                        var $643 = Parser$Reply$error$($639);
                                                                                                                                                        var $640 = $643;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $638 = $640;
                                                                                                                                                break;
                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                var $644 = self.pst;
                                                                                                                                                var $645 = self.val;
                                                                                                                                                var self = $644;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                        var $647 = self.err;
                                                                                                                                                        var $648 = self.nam;
                                                                                                                                                        var $649 = self.ini;
                                                                                                                                                        var $650 = self.idx;
                                                                                                                                                        var $651 = self.str;
                                                                                                                                                        var _reply$pst$86 = Parser$State$new$(Parser$Error$maybe_combine$($637, $647), $648, $649, $650, $651);
                                                                                                                                                        var self = _reply$pst$86;
                                                                                                                                                        switch (self._) {
                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                var $653 = self.err;
                                                                                                                                                                var _reply$92 = Parser$maybe$(Litereum$parse$text(";"), _reply$pst$86);
                                                                                                                                                                var self = _reply$92;
                                                                                                                                                                switch (self._) {
                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                        var $655 = self.err;
                                                                                                                                                                        var self = $653;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                var $657 = self.value;
                                                                                                                                                                                var $658 = Parser$Reply$error$(Parser$Error$combine$($657, $655));
                                                                                                                                                                                var $656 = $658;
                                                                                                                                                                                break;
                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                var $659 = Parser$Reply$error$($655);
                                                                                                                                                                                var $656 = $659;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $654 = $656;
                                                                                                                                                                        break;
                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                        var $660 = self.pst;
                                                                                                                                                                        var self = $660;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                var $662 = self.err;
                                                                                                                                                                                var $663 = self.nam;
                                                                                                                                                                                var $664 = self.ini;
                                                                                                                                                                                var $665 = self.idx;
                                                                                                                                                                                var $666 = self.str;
                                                                                                                                                                                var _reply$pst$100 = Parser$State$new$(Parser$Error$maybe_combine$($653, $662), $663, $664, $665, $666);
                                                                                                                                                                                var self = _reply$pst$100;
                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                        var $668 = self.err;
                                                                                                                                                                                        var _reply$106 = Litereum$parse$term$(_world$1)(_reply$pst$100);
                                                                                                                                                                                        var self = _reply$106;
                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                                                                var $670 = self.err;
                                                                                                                                                                                                var self = $668;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                                                                        var $672 = self.value;
                                                                                                                                                                                                        var $673 = Parser$Reply$error$(Parser$Error$combine$($672, $670));
                                                                                                                                                                                                        var $671 = $673;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                                                                        var $674 = Parser$Reply$error$($670);
                                                                                                                                                                                                        var $671 = $674;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $669 = $671;
                                                                                                                                                                                                break;
                                                                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                                                                var $675 = self.pst;
                                                                                                                                                                                                var $676 = self.val;
                                                                                                                                                                                                var self = $675;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                        var $678 = self.err;
                                                                                                                                                                                                        var $679 = self.nam;
                                                                                                                                                                                                        var $680 = self.ini;
                                                                                                                                                                                                        var $681 = self.idx;
                                                                                                                                                                                                        var $682 = self.str;
                                                                                                                                                                                                        var _reply$pst$114 = Parser$State$new$(Parser$Error$maybe_combine$($668, $678), $679, $680, $681, $682);
                                                                                                                                                                                                        var $683 = Parser$Reply$value$(_reply$pst$114, Litereum$Term$let$($583, $614, $645, $676));
                                                                                                                                                                                                        var $677 = $683;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $669 = $677;
                                                                                                                                                                                                break;
                                                                                                                                                                                        };
                                                                                                                                                                                        var $667 = $669;
                                                                                                                                                                                        break;
                                                                                                                                                                                };
                                                                                                                                                                                var $661 = $667;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $654 = $661;
                                                                                                                                                                        break;
                                                                                                                                                                };
                                                                                                                                                                var $652 = $654;
                                                                                                                                                                break;
                                                                                                                                                        };
                                                                                                                                                        var $646 = $652;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $638 = $646;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $636 = $638;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $630 = $636;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $623 = $630;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $621 = $623;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $615 = $621;
                                                                                                        break;
                                                                                                };
                                                                                                var $607 = $615;
                                                                                                break;
                                                                                        };
                                                                                        var $605 = $607;
                                                                                        break;
                                                                                };
                                                                                var $599 = $605;
                                                                                break;
                                                                        };
                                                                        var $592 = $599;
                                                                        break;
                                                                };
                                                                var $590 = $592;
                                                                break;
                                                        };
                                                        var $584 = $590;
                                                        break;
                                                };
                                                var $576 = $584;
                                                break;
                                        };
                                        var $574 = $576;
                                        break;
                                };
                                var $568 = $574;
                                break;
                        };
                        var $561 = $568;
                        break;
                };
                var $559 = $561;
                break;
        };
        return $559;
    };
    const Litereum$parse$term$let = x0 => x1 => Litereum$parse$term$let$(x0, x1);

    function Litereum$Term$create$(_ctor$1, _vals$2) {
        var $684 = ({
            _: 'Litereum.Term.create',
            'ctor': _ctor$1,
            'vals': _vals$2
        });
        return $684;
    };
    const Litereum$Term$create = x0 => x1 => Litereum$Term$create$(x0, x1);

    function Litereum$parse$term$create$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $686 = self.err;
                var _reply$8 = Litereum$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $688 = self.err;
                        var self = $686;
                        switch (self._) {
                            case 'Maybe.some':
                                var $690 = self.value;
                                var $691 = Parser$Reply$error$(Parser$Error$combine$($690, $688));
                                var $689 = $691;
                                break;
                            case 'Maybe.none':
                                var $692 = Parser$Reply$error$($688);
                                var $689 = $692;
                                break;
                        };
                        var $687 = $689;
                        break;
                    case 'Parser.Reply.value':
                        var $693 = self.pst;
                        var $694 = self.val;
                        var self = $693;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $696 = self.err;
                                var $697 = self.nam;
                                var $698 = self.ini;
                                var $699 = self.idx;
                                var $700 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($686, $696), $697, $698, $699, $700);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $702 = self.err;
                                        var _reply$22 = Parser$wrap$(Litereum$parse$text("{"), Litereum$parse$term$(_world$1), Litereum$parse$text("}"), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $704 = self.err;
                                                var self = $702;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $706 = self.value;
                                                        var $707 = Parser$Reply$error$(Parser$Error$combine$($706, $704));
                                                        var $705 = $707;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $708 = Parser$Reply$error$($704);
                                                        var $705 = $708;
                                                        break;
                                                };
                                                var $703 = $705;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $709 = self.pst;
                                                var $710 = self.val;
                                                var self = $709;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $712 = self.err;
                                                        var $713 = self.nam;
                                                        var $714 = self.ini;
                                                        var $715 = self.idx;
                                                        var $716 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($702, $712), $713, $714, $715, $716);
                                                        var $717 = Parser$Reply$value$(_reply$pst$30, Litereum$Term$create$($694, $710));
                                                        var $711 = $717;
                                                        break;
                                                };
                                                var $703 = $711;
                                                break;
                                        };
                                        var $701 = $703;
                                        break;
                                };
                                var $695 = $701;
                                break;
                        };
                        var $687 = $695;
                        break;
                };
                var $685 = $687;
                break;
        };
        return $685;
    };
    const Litereum$parse$term$create = x0 => x1 => Litereum$parse$term$create$(x0, x1);

    function Maybe$bind$(_m$3, _f$4) {
        var self = _m$3;
        switch (self._) {
            case 'Maybe.some':
                var $719 = self.value;
                var $720 = _f$4($719);
                var $718 = $720;
                break;
            case 'Maybe.none':
                var $721 = Maybe$none;
                var $718 = $721;
                break;
        };
        return $718;
    };
    const Maybe$bind = x0 => x1 => Maybe$bind$(x0, x1);

    function Maybe$monad$(_new$2) {
        var $722 = _new$2(Maybe$bind)(Maybe$some);
        return $722;
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
                        var $723 = self.key;
                        var $724 = self.val;
                        var $725 = self.left;
                        var $726 = self.right;
                        var self = _cmp$3(_key$4)($723);
                        switch (self._) {
                            case 'Cmp.ltn':
                                var $728 = BBT$lookup$(_cmp$3, _key$4, $725);
                                var $727 = $728;
                                break;
                            case 'Cmp.eql':
                                var $729 = Maybe$some$($724);
                                var $727 = $729;
                                break;
                            case 'Cmp.gtn':
                                var $730 = BBT$lookup$(_cmp$3, _key$4, $726);
                                var $727 = $730;
                                break;
                        };
                        return $727;
                    case 'BBT.tip':
                        var $731 = Maybe$none;
                        return $731;
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
                var $733 = Bool$true;
                var $732 = $733;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $734 = Bool$false;
                var $732 = $734;
                break;
        };
        return $732;
    };
    const Cmp$as_ltn = x0 => Cmp$as_ltn$(x0);

    function Word$ltn$(_a$2, _b$3) {
        var $735 = Cmp$as_ltn$(Word$cmp$(_a$2, _b$3));
        return $735;
    };
    const Word$ltn = x0 => x1 => Word$ltn$(x0, x1);
    const U16$ltn = a0 => a1 => (a0 < a1);

    function U16$cmp$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $737 = Cmp$ltn;
            var $736 = $737;
        } else {
            var self = (_a$1 === _b$2);
            if (self) {
                var $739 = Cmp$eql;
                var $738 = $739;
            } else {
                var $740 = Cmp$gtn;
                var $738 = $740;
            };
            var $736 = $738;
        };
        return $736;
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
                        var $742 = Cmp$eql;
                        var $741 = $742;
                    } else {
                        var $743 = self.charCodeAt(0);
                        var $744 = self.slice(1);
                        var $745 = Cmp$ltn;
                        var $741 = $745;
                    };
                    return $741;
                } else {
                    var $746 = self.charCodeAt(0);
                    var $747 = self.slice(1);
                    var self = _b$2;
                    if (self.length === 0) {
                        var $749 = Cmp$gtn;
                        var $748 = $749;
                    } else {
                        var $750 = self.charCodeAt(0);
                        var $751 = self.slice(1);
                        var self = U16$cmp$($746, $750);
                        switch (self._) {
                            case 'Cmp.ltn':
                                var $753 = Cmp$ltn;
                                var $752 = $753;
                                break;
                            case 'Cmp.eql':
                                var $754 = String$cmp$($747, $751);
                                var $752 = $754;
                                break;
                            case 'Cmp.gtn':
                                var $755 = Cmp$gtn;
                                var $752 = $755;
                                break;
                        };
                        var $748 = $752;
                    };
                    return $748;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$cmp = x0 => x1 => String$cmp$(x0, x1);

    function Map$get$(_key$2, _map$3) {
        var $756 = BBT$lookup$(String$cmp, _key$2, _map$3);
        return $756;
    };
    const Map$get = x0 => x1 => Map$get$(x0, x1);

    function Litereum$get_data$(_world$1, _name$2) {
        var self = _world$1;
        switch (self._) {
            case 'Litereum.World.new':
                var $758 = self.entry;
                var $759 = Maybe$monad$((_m$bind$7 => _m$pure$8 => {
                    var $760 = _m$bind$7;
                    return $760;
                }))(Map$get$(_name$2, $758))((_entry$7 => {
                    var self = _entry$7;
                    switch (self._) {
                        case 'Litereum.Entry.data':
                            var $762 = self.value;
                            var $763 = Maybe$some$($762);
                            var $761 = $763;
                            break;
                        case 'Litereum.Entry.bond':
                            var $764 = Maybe$none;
                            var $761 = $764;
                            break;
                    };
                    return $761;
                }));
                var $757 = $759;
                break;
        };
        return $757;
    };
    const Litereum$get_data = x0 => x1 => Litereum$get_data$(x0, x1);

    function Parser$fail$(_error$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var $766 = self.nam;
                var $767 = self.ini;
                var $768 = self.idx;
                var $769 = Parser$Reply$fail$($766, $767, $768, _error$2);
                var $765 = $769;
                break;
        };
        return $765;
    };
    const Parser$fail = x0 => x1 => Parser$fail$(x0, x1);

    function Litereum$parse$term$match$cases$(_world$1, _constructors$2) {
        var self = _constructors$2;
        switch (self._) {
            case 'List.cons':
                var $771 = self.head;
                var $772 = self.tail;
                var _ctor$5 = $771;
                var self = _ctor$5;
                switch (self._) {
                    case 'Litereum.Constructor.new':
                        var $774 = self.name;
                        var $775 = (_pst$9 => {
                            var self = _pst$9;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $777 = self.err;
                                    var _reply$15 = Litereum$parse$text$($774, _pst$9);
                                    var self = _reply$15;
                                    switch (self._) {
                                        case 'Parser.Reply.error':
                                            var $779 = self.err;
                                            var self = $777;
                                            switch (self._) {
                                                case 'Maybe.some':
                                                    var $781 = self.value;
                                                    var $782 = Parser$Reply$error$(Parser$Error$combine$($781, $779));
                                                    var $780 = $782;
                                                    break;
                                                case 'Maybe.none':
                                                    var $783 = Parser$Reply$error$($779);
                                                    var $780 = $783;
                                                    break;
                                            };
                                            var $778 = $780;
                                            break;
                                        case 'Parser.Reply.value':
                                            var $784 = self.pst;
                                            var self = $784;
                                            switch (self._) {
                                                case 'Parser.State.new':
                                                    var $786 = self.err;
                                                    var $787 = self.nam;
                                                    var $788 = self.ini;
                                                    var $789 = self.idx;
                                                    var $790 = self.str;
                                                    var _reply$pst$23 = Parser$State$new$(Parser$Error$maybe_combine$($777, $786), $787, $788, $789, $790);
                                                    var self = _reply$pst$23;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $792 = self.err;
                                                            var _reply$29 = Litereum$parse$text$(":", _reply$pst$23);
                                                            var self = _reply$29;
                                                            switch (self._) {
                                                                case 'Parser.Reply.error':
                                                                    var $794 = self.err;
                                                                    var self = $792;
                                                                    switch (self._) {
                                                                        case 'Maybe.some':
                                                                            var $796 = self.value;
                                                                            var $797 = Parser$Reply$error$(Parser$Error$combine$($796, $794));
                                                                            var $795 = $797;
                                                                            break;
                                                                        case 'Maybe.none':
                                                                            var $798 = Parser$Reply$error$($794);
                                                                            var $795 = $798;
                                                                            break;
                                                                    };
                                                                    var $793 = $795;
                                                                    break;
                                                                case 'Parser.Reply.value':
                                                                    var $799 = self.pst;
                                                                    var self = $799;
                                                                    switch (self._) {
                                                                        case 'Parser.State.new':
                                                                            var $801 = self.err;
                                                                            var $802 = self.nam;
                                                                            var $803 = self.ini;
                                                                            var $804 = self.idx;
                                                                            var $805 = self.str;
                                                                            var _reply$pst$37 = Parser$State$new$(Parser$Error$maybe_combine$($792, $801), $802, $803, $804, $805);
                                                                            var self = _reply$pst$37;
                                                                            switch (self._) {
                                                                                case 'Parser.State.new':
                                                                                    var $807 = self.err;
                                                                                    var _reply$43 = Litereum$parse$term$(_world$1)(_reply$pst$37);
                                                                                    var self = _reply$43;
                                                                                    switch (self._) {
                                                                                        case 'Parser.Reply.error':
                                                                                            var $809 = self.err;
                                                                                            var self = $807;
                                                                                            switch (self._) {
                                                                                                case 'Maybe.some':
                                                                                                    var $811 = self.value;
                                                                                                    var $812 = Parser$Reply$error$(Parser$Error$combine$($811, $809));
                                                                                                    var $810 = $812;
                                                                                                    break;
                                                                                                case 'Maybe.none':
                                                                                                    var $813 = Parser$Reply$error$($809);
                                                                                                    var $810 = $813;
                                                                                                    break;
                                                                                            };
                                                                                            var $808 = $810;
                                                                                            break;
                                                                                        case 'Parser.Reply.value':
                                                                                            var $814 = self.pst;
                                                                                            var $815 = self.val;
                                                                                            var self = $814;
                                                                                            switch (self._) {
                                                                                                case 'Parser.State.new':
                                                                                                    var $817 = self.err;
                                                                                                    var $818 = self.nam;
                                                                                                    var $819 = self.ini;
                                                                                                    var $820 = self.idx;
                                                                                                    var $821 = self.str;
                                                                                                    var _reply$pst$51 = Parser$State$new$(Parser$Error$maybe_combine$($807, $817), $818, $819, $820, $821);
                                                                                                    var self = _reply$pst$51;
                                                                                                    switch (self._) {
                                                                                                        case 'Parser.State.new':
                                                                                                            var $823 = self.err;
                                                                                                            var _reply$57 = Parser$maybe$(Litereum$parse$text(","), _reply$pst$51);
                                                                                                            var self = _reply$57;
                                                                                                            switch (self._) {
                                                                                                                case 'Parser.Reply.error':
                                                                                                                    var $825 = self.err;
                                                                                                                    var self = $823;
                                                                                                                    switch (self._) {
                                                                                                                        case 'Maybe.some':
                                                                                                                            var $827 = self.value;
                                                                                                                            var $828 = Parser$Reply$error$(Parser$Error$combine$($827, $825));
                                                                                                                            var $826 = $828;
                                                                                                                            break;
                                                                                                                        case 'Maybe.none':
                                                                                                                            var $829 = Parser$Reply$error$($825);
                                                                                                                            var $826 = $829;
                                                                                                                            break;
                                                                                                                    };
                                                                                                                    var $824 = $826;
                                                                                                                    break;
                                                                                                                case 'Parser.Reply.value':
                                                                                                                    var $830 = self.pst;
                                                                                                                    var self = $830;
                                                                                                                    switch (self._) {
                                                                                                                        case 'Parser.State.new':
                                                                                                                            var $832 = self.err;
                                                                                                                            var $833 = self.nam;
                                                                                                                            var $834 = self.ini;
                                                                                                                            var $835 = self.idx;
                                                                                                                            var $836 = self.str;
                                                                                                                            var _reply$pst$65 = Parser$State$new$(Parser$Error$maybe_combine$($823, $832), $833, $834, $835, $836);
                                                                                                                            var self = _reply$pst$65;
                                                                                                                            switch (self._) {
                                                                                                                                case 'Parser.State.new':
                                                                                                                                    var $838 = self.err;
                                                                                                                                    var _reply$71 = Litereum$parse$term$match$cases$(_world$1, $772)(_reply$pst$65);
                                                                                                                                    var self = _reply$71;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Parser.Reply.error':
                                                                                                                                            var $840 = self.err;
                                                                                                                                            var self = $838;
                                                                                                                                            switch (self._) {
                                                                                                                                                case 'Maybe.some':
                                                                                                                                                    var $842 = self.value;
                                                                                                                                                    var $843 = Parser$Reply$error$(Parser$Error$combine$($842, $840));
                                                                                                                                                    var $841 = $843;
                                                                                                                                                    break;
                                                                                                                                                case 'Maybe.none':
                                                                                                                                                    var $844 = Parser$Reply$error$($840);
                                                                                                                                                    var $841 = $844;
                                                                                                                                                    break;
                                                                                                                                            };
                                                                                                                                            var $839 = $841;
                                                                                                                                            break;
                                                                                                                                        case 'Parser.Reply.value':
                                                                                                                                            var $845 = self.pst;
                                                                                                                                            var $846 = self.val;
                                                                                                                                            var self = $845;
                                                                                                                                            switch (self._) {
                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                    var $848 = self.err;
                                                                                                                                                    var $849 = self.nam;
                                                                                                                                                    var $850 = self.ini;
                                                                                                                                                    var $851 = self.idx;
                                                                                                                                                    var $852 = self.str;
                                                                                                                                                    var _reply$pst$79 = Parser$State$new$(Parser$Error$maybe_combine$($838, $848), $849, $850, $851, $852);
                                                                                                                                                    var $853 = Parser$Reply$value$(_reply$pst$79, List$cons$($815, $846));
                                                                                                                                                    var $847 = $853;
                                                                                                                                                    break;
                                                                                                                                            };
                                                                                                                                            var $839 = $847;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $837 = $839;
                                                                                                                                    break;
                                                                                                                            };
                                                                                                                            var $831 = $837;
                                                                                                                            break;
                                                                                                                    };
                                                                                                                    var $824 = $831;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $822 = $824;
                                                                                                            break;
                                                                                                    };
                                                                                                    var $816 = $822;
                                                                                                    break;
                                                                                            };
                                                                                            var $808 = $816;
                                                                                            break;
                                                                                    };
                                                                                    var $806 = $808;
                                                                                    break;
                                                                            };
                                                                            var $800 = $806;
                                                                            break;
                                                                    };
                                                                    var $793 = $800;
                                                                    break;
                                                            };
                                                            var $791 = $793;
                                                            break;
                                                    };
                                                    var $785 = $791;
                                                    break;
                                            };
                                            var $778 = $785;
                                            break;
                                    };
                                    var $776 = $778;
                                    break;
                            };
                            return $776;
                        });
                        var $773 = $775;
                        break;
                };
                var $770 = $773;
                break;
            case 'List.nil':
                var $854 = (_pst$3 => {
                    var $855 = Parser$Reply$value$(_pst$3, List$nil);
                    return $855;
                });
                var $770 = $854;
                break;
        };
        return $770;
    };
    const Litereum$parse$term$match$cases = x0 => x1 => Litereum$parse$term$match$cases$(x0, x1);

    function Litereum$Term$match$(_name$1, _data$2, _cses$3) {
        var $856 = ({
            _: 'Litereum.Term.match',
            'name': _name$1,
            'data': _data$2,
            'cses': _cses$3
        });
        return $856;
    };
    const Litereum$Term$match = x0 => x1 => x2 => Litereum$Term$match$(x0, x1, x2);

    function Litereum$parse$term$match$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $858 = self.err;
                var _reply$8 = Litereum$parse$text$("case ", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $860 = self.err;
                        var self = $858;
                        switch (self._) {
                            case 'Maybe.some':
                                var $862 = self.value;
                                var $863 = Parser$Reply$error$(Parser$Error$combine$($862, $860));
                                var $861 = $863;
                                break;
                            case 'Maybe.none':
                                var $864 = Parser$Reply$error$($860);
                                var $861 = $864;
                                break;
                        };
                        var $859 = $861;
                        break;
                    case 'Parser.Reply.value':
                        var $865 = self.pst;
                        var self = $865;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $867 = self.err;
                                var $868 = self.nam;
                                var $869 = self.ini;
                                var $870 = self.idx;
                                var $871 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($858, $867), $868, $869, $870, $871);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $873 = self.err;
                                        var _reply$22 = Litereum$parse$name$(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $875 = self.err;
                                                var self = $873;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $877 = self.value;
                                                        var $878 = Parser$Reply$error$(Parser$Error$combine$($877, $875));
                                                        var $876 = $878;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $879 = Parser$Reply$error$($875);
                                                        var $876 = $879;
                                                        break;
                                                };
                                                var $874 = $876;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $880 = self.pst;
                                                var $881 = self.val;
                                                var self = $880;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $883 = self.err;
                                                        var $884 = self.nam;
                                                        var $885 = self.ini;
                                                        var $886 = self.idx;
                                                        var $887 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($873, $883), $884, $885, $886, $887);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $889 = self.err;
                                                                var _reply$36 = Litereum$parse$text$(":", _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $891 = self.err;
                                                                        var self = $889;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $893 = self.value;
                                                                                var $894 = Parser$Reply$error$(Parser$Error$combine$($893, $891));
                                                                                var $892 = $894;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $895 = Parser$Reply$error$($891);
                                                                                var $892 = $895;
                                                                                break;
                                                                        };
                                                                        var $890 = $892;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $896 = self.pst;
                                                                        var self = $896;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $898 = self.err;
                                                                                var $899 = self.nam;
                                                                                var $900 = self.ini;
                                                                                var $901 = self.idx;
                                                                                var $902 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($889, $898), $899, $900, $901, $902);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $904 = self.err;
                                                                                        var _reply$50 = Litereum$parse$name$(_reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $906 = self.err;
                                                                                                var self = $904;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $908 = self.value;
                                                                                                        var $909 = Parser$Reply$error$(Parser$Error$combine$($908, $906));
                                                                                                        var $907 = $909;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $910 = Parser$Reply$error$($906);
                                                                                                        var $907 = $910;
                                                                                                        break;
                                                                                                };
                                                                                                var $905 = $907;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $911 = self.pst;
                                                                                                var $912 = self.val;
                                                                                                var self = $911;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $914 = self.err;
                                                                                                        var $915 = self.nam;
                                                                                                        var $916 = self.ini;
                                                                                                        var $917 = self.idx;
                                                                                                        var $918 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($904, $914), $915, $916, $917, $918);
                                                                                                        var self = Litereum$get_data$(_world$1, $912);
                                                                                                        switch (self._) {
                                                                                                            case 'Maybe.some':
                                                                                                                var $920 = self.value;
                                                                                                                var _data$60 = $920;
                                                                                                                var self = _data$60;
                                                                                                                switch (self._) {
                                                                                                                    case 'Litereum.Data.new':
                                                                                                                        var $922 = self.constructors;
                                                                                                                        var $923 = (_pst$63 => {
                                                                                                                            var self = _pst$63;
                                                                                                                            switch (self._) {
                                                                                                                                case 'Parser.State.new':
                                                                                                                                    var $925 = self.err;
                                                                                                                                    var _reply$69 = Litereum$parse$text$("{", _pst$63);
                                                                                                                                    var self = _reply$69;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Parser.Reply.error':
                                                                                                                                            var $927 = self.err;
                                                                                                                                            var self = $925;
                                                                                                                                            switch (self._) {
                                                                                                                                                case 'Maybe.some':
                                                                                                                                                    var $929 = self.value;
                                                                                                                                                    var $930 = Parser$Reply$error$(Parser$Error$combine$($929, $927));
                                                                                                                                                    var $928 = $930;
                                                                                                                                                    break;
                                                                                                                                                case 'Maybe.none':
                                                                                                                                                    var $931 = Parser$Reply$error$($927);
                                                                                                                                                    var $928 = $931;
                                                                                                                                                    break;
                                                                                                                                            };
                                                                                                                                            var $926 = $928;
                                                                                                                                            break;
                                                                                                                                        case 'Parser.Reply.value':
                                                                                                                                            var $932 = self.pst;
                                                                                                                                            var self = $932;
                                                                                                                                            switch (self._) {
                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                    var $934 = self.err;
                                                                                                                                                    var $935 = self.nam;
                                                                                                                                                    var $936 = self.ini;
                                                                                                                                                    var $937 = self.idx;
                                                                                                                                                    var $938 = self.str;
                                                                                                                                                    var _reply$pst$77 = Parser$State$new$(Parser$Error$maybe_combine$($925, $934), $935, $936, $937, $938);
                                                                                                                                                    var self = _reply$pst$77;
                                                                                                                                                    switch (self._) {
                                                                                                                                                        case 'Parser.State.new':
                                                                                                                                                            var $940 = self.err;
                                                                                                                                                            var _reply$83 = Litereum$parse$term$match$cases$(_world$1, $922)(_reply$pst$77);
                                                                                                                                                            var self = _reply$83;
                                                                                                                                                            switch (self._) {
                                                                                                                                                                case 'Parser.Reply.error':
                                                                                                                                                                    var $942 = self.err;
                                                                                                                                                                    var self = $940;
                                                                                                                                                                    switch (self._) {
                                                                                                                                                                        case 'Maybe.some':
                                                                                                                                                                            var $944 = self.value;
                                                                                                                                                                            var $945 = Parser$Reply$error$(Parser$Error$combine$($944, $942));
                                                                                                                                                                            var $943 = $945;
                                                                                                                                                                            break;
                                                                                                                                                                        case 'Maybe.none':
                                                                                                                                                                            var $946 = Parser$Reply$error$($942);
                                                                                                                                                                            var $943 = $946;
                                                                                                                                                                            break;
                                                                                                                                                                    };
                                                                                                                                                                    var $941 = $943;
                                                                                                                                                                    break;
                                                                                                                                                                case 'Parser.Reply.value':
                                                                                                                                                                    var $947 = self.pst;
                                                                                                                                                                    var $948 = self.val;
                                                                                                                                                                    var self = $947;
                                                                                                                                                                    switch (self._) {
                                                                                                                                                                        case 'Parser.State.new':
                                                                                                                                                                            var $950 = self.err;
                                                                                                                                                                            var $951 = self.nam;
                                                                                                                                                                            var $952 = self.ini;
                                                                                                                                                                            var $953 = self.idx;
                                                                                                                                                                            var $954 = self.str;
                                                                                                                                                                            var _reply$pst$91 = Parser$State$new$(Parser$Error$maybe_combine$($940, $950), $951, $952, $953, $954);
                                                                                                                                                                            var self = _reply$pst$91;
                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                                                    var $956 = self.err;
                                                                                                                                                                                    var _reply$97 = Litereum$parse$text$("}", _reply$pst$91);
                                                                                                                                                                                    var self = _reply$97;
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
                                                                                                                                                                                                    var _reply$pst$105 = Parser$State$new$(Parser$Error$maybe_combine$($956, $965), $966, $967, $968, $969);
                                                                                                                                                                                                    var $970 = Parser$Reply$value$(_reply$pst$105, Litereum$Term$match$($881, $912, $948));
                                                                                                                                                                                                    var $964 = $970;
                                                                                                                                                                                                    break;
                                                                                                                                                                                            };
                                                                                                                                                                                            var $957 = $964;
                                                                                                                                                                                            break;
                                                                                                                                                                                    };
                                                                                                                                                                                    var $955 = $957;
                                                                                                                                                                                    break;
                                                                                                                                                                            };
                                                                                                                                                                            var $949 = $955;
                                                                                                                                                                            break;
                                                                                                                                                                    };
                                                                                                                                                                    var $941 = $949;
                                                                                                                                                                    break;
                                                                                                                                                            };
                                                                                                                                                            var $939 = $941;
                                                                                                                                                            break;
                                                                                                                                                    };
                                                                                                                                                    var $933 = $939;
                                                                                                                                                    break;
                                                                                                                                            };
                                                                                                                                            var $926 = $933;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $924 = $926;
                                                                                                                                    break;
                                                                                                                            };
                                                                                                                            return $924;
                                                                                                                        });
                                                                                                                        var $921 = $923;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $919 = $921;
                                                                                                                break;
                                                                                                            case 'Maybe.none':
                                                                                                                var $971 = Parser$fail("Type not found.");
                                                                                                                var $919 = $971;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $919 = $919(_reply$pst$58);
                                                                                                        var $913 = $919;
                                                                                                        break;
                                                                                                };
                                                                                                var $905 = $913;
                                                                                                break;
                                                                                        };
                                                                                        var $903 = $905;
                                                                                        break;
                                                                                };
                                                                                var $897 = $903;
                                                                                break;
                                                                        };
                                                                        var $890 = $897;
                                                                        break;
                                                                };
                                                                var $888 = $890;
                                                                break;
                                                        };
                                                        var $882 = $888;
                                                        break;
                                                };
                                                var $874 = $882;
                                                break;
                                        };
                                        var $872 = $874;
                                        break;
                                };
                                var $866 = $872;
                                break;
                        };
                        var $859 = $866;
                        break;
                };
                var $857 = $859;
                break;
        };
        return $857;
    };
    const Litereum$parse$term$match = x0 => x1 => Litereum$parse$term$match$(x0, x1);

    function Parser$many1$(_parser$2, _pst$3) {
        var self = _pst$3;
        switch (self._) {
            case 'Parser.State.new':
                var $973 = self.err;
                var _reply$9 = _parser$2(_pst$3);
                var self = _reply$9;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $975 = self.err;
                        var self = $973;
                        switch (self._) {
                            case 'Maybe.some':
                                var $977 = self.value;
                                var $978 = Parser$Reply$error$(Parser$Error$combine$($977, $975));
                                var $976 = $978;
                                break;
                            case 'Maybe.none':
                                var $979 = Parser$Reply$error$($975);
                                var $976 = $979;
                                break;
                        };
                        var $974 = $976;
                        break;
                    case 'Parser.Reply.value':
                        var $980 = self.pst;
                        var $981 = self.val;
                        var self = $980;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $983 = self.err;
                                var $984 = self.nam;
                                var $985 = self.ini;
                                var $986 = self.idx;
                                var $987 = self.str;
                                var _reply$pst$17 = Parser$State$new$(Parser$Error$maybe_combine$($973, $983), $984, $985, $986, $987);
                                var self = _reply$pst$17;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $989 = self.err;
                                        var _reply$23 = Parser$many$(_parser$2)(_reply$pst$17);
                                        var self = _reply$23;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $991 = self.err;
                                                var self = $989;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $993 = self.value;
                                                        var $994 = Parser$Reply$error$(Parser$Error$combine$($993, $991));
                                                        var $992 = $994;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $995 = Parser$Reply$error$($991);
                                                        var $992 = $995;
                                                        break;
                                                };
                                                var $990 = $992;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $996 = self.pst;
                                                var $997 = self.val;
                                                var self = $996;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $999 = self.err;
                                                        var $1000 = self.nam;
                                                        var $1001 = self.ini;
                                                        var $1002 = self.idx;
                                                        var $1003 = self.str;
                                                        var _reply$pst$31 = Parser$State$new$(Parser$Error$maybe_combine$($989, $999), $1000, $1001, $1002, $1003);
                                                        var $1004 = Parser$Reply$value$(_reply$pst$31, List$cons$($981, $997));
                                                        var $998 = $1004;
                                                        break;
                                                };
                                                var $990 = $998;
                                                break;
                                        };
                                        var $988 = $990;
                                        break;
                                };
                                var $982 = $988;
                                break;
                        };
                        var $974 = $982;
                        break;
                };
                var $972 = $974;
                break;
        };
        return $972;
    };
    const Parser$many1 = x0 => x1 => Parser$many1$(x0, x1);

    function Parser$digit$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1006 = self.err;
                var $1007 = self.nam;
                var $1008 = self.ini;
                var $1009 = self.idx;
                var $1010 = self.str;
                var self = $1010;
                if (self.length === 0) {
                    var $1012 = Parser$Reply$fail$($1007, $1008, $1009, "Not a digit.");
                    var $1011 = $1012;
                } else {
                    var $1013 = self.charCodeAt(0);
                    var $1014 = self.slice(1);
                    var _pst$9 = Parser$State$new$($1006, $1007, $1008, Nat$succ$($1009), $1014);
                    var self = ($1013 === 48);
                    if (self) {
                        var $1016 = Parser$Reply$value$(_pst$9, 0n);
                        var $1015 = $1016;
                    } else {
                        var self = ($1013 === 49);
                        if (self) {
                            var $1018 = Parser$Reply$value$(_pst$9, 1n);
                            var $1017 = $1018;
                        } else {
                            var self = ($1013 === 50);
                            if (self) {
                                var $1020 = Parser$Reply$value$(_pst$9, 2n);
                                var $1019 = $1020;
                            } else {
                                var self = ($1013 === 51);
                                if (self) {
                                    var $1022 = Parser$Reply$value$(_pst$9, 3n);
                                    var $1021 = $1022;
                                } else {
                                    var self = ($1013 === 52);
                                    if (self) {
                                        var $1024 = Parser$Reply$value$(_pst$9, 4n);
                                        var $1023 = $1024;
                                    } else {
                                        var self = ($1013 === 53);
                                        if (self) {
                                            var $1026 = Parser$Reply$value$(_pst$9, 5n);
                                            var $1025 = $1026;
                                        } else {
                                            var self = ($1013 === 54);
                                            if (self) {
                                                var $1028 = Parser$Reply$value$(_pst$9, 6n);
                                                var $1027 = $1028;
                                            } else {
                                                var self = ($1013 === 55);
                                                if (self) {
                                                    var $1030 = Parser$Reply$value$(_pst$9, 7n);
                                                    var $1029 = $1030;
                                                } else {
                                                    var self = ($1013 === 56);
                                                    if (self) {
                                                        var $1032 = Parser$Reply$value$(_pst$9, 8n);
                                                        var $1031 = $1032;
                                                    } else {
                                                        var self = ($1013 === 57);
                                                        if (self) {
                                                            var $1034 = Parser$Reply$value$(_pst$9, 9n);
                                                            var $1033 = $1034;
                                                        } else {
                                                            var $1035 = Parser$Reply$fail$($1007, $1008, $1009, "Not a digit.");
                                                            var $1033 = $1035;
                                                        };
                                                        var $1031 = $1033;
                                                    };
                                                    var $1029 = $1031;
                                                };
                                                var $1027 = $1029;
                                            };
                                            var $1025 = $1027;
                                        };
                                        var $1023 = $1025;
                                    };
                                    var $1021 = $1023;
                                };
                                var $1019 = $1021;
                            };
                            var $1017 = $1019;
                        };
                        var $1015 = $1017;
                    };
                    var $1011 = $1015;
                };
                var $1005 = $1011;
                break;
        };
        return $1005;
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
                        var $1036 = self.head;
                        var $1037 = self.tail;
                        var $1038 = Nat$from_base$go$(_b$1, $1037, (_b$1 * _p$3), (($1036 * _p$3) + _res$4));
                        return $1038;
                    case 'List.nil':
                        var $1039 = _res$4;
                        return $1039;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$from_base$go = x0 => x1 => x2 => x3 => Nat$from_base$go$(x0, x1, x2, x3);

    function Nat$from_base$(_base$1, _ds$2) {
        var $1040 = Nat$from_base$go$(_base$1, List$reverse$(_ds$2), 1n, 0n);
        return $1040;
    };
    const Nat$from_base = x0 => x1 => Nat$from_base$(x0, x1);

    function Parser$nat$(_pst$1) {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1042 = self.err;
                var _reply$7 = Parser$many1$(Parser$digit, _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1044 = self.err;
                        var self = $1042;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1046 = self.value;
                                var $1047 = Parser$Reply$error$(Parser$Error$combine$($1046, $1044));
                                var $1045 = $1047;
                                break;
                            case 'Maybe.none':
                                var $1048 = Parser$Reply$error$($1044);
                                var $1045 = $1048;
                                break;
                        };
                        var $1043 = $1045;
                        break;
                    case 'Parser.Reply.value':
                        var $1049 = self.pst;
                        var $1050 = self.val;
                        var self = $1049;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1052 = self.err;
                                var $1053 = self.nam;
                                var $1054 = self.ini;
                                var $1055 = self.idx;
                                var $1056 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1042, $1052), $1053, $1054, $1055, $1056);
                                var $1057 = Parser$Reply$value$(_reply$pst$15, Nat$from_base$(10n, $1050));
                                var $1051 = $1057;
                                break;
                        };
                        var $1043 = $1051;
                        break;
                };
                var $1041 = $1043;
                break;
        };
        return $1041;
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
                    var $1058 = _x$1;
                    return $1058;
                } else {
                    var $1059 = (self - 1n);
                    var $1060 = Nat$pow$aux$(_x$1, $1059, (_aux$3 * 2n));
                    return $1060;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$pow$aux = x0 => x1 => x2 => Nat$pow$aux$(x0, x1, x2);
    const Nat$pow = a0 => a1 => (a0 ** a1);

    function Litereum$Term$word$(_numb$1) {
        var $1061 = ({
            _: 'Litereum.Term.word',
            'numb': _numb$1
        });
        return $1061;
    };
    const Litereum$Term$word = x0 => Litereum$Term$word$(x0);

    function U64$new$(_value$1) {
        var $1062 = word_to_u64(_value$1);
        return $1062;
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
                    var $1063 = _x$4;
                    return $1063;
                } else {
                    var $1064 = (self - 1n);
                    var $1065 = Nat$apply$($1064, _f$3, _f$3(_x$4));
                    return $1065;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$apply = x0 => x1 => x2 => Nat$apply$(x0, x1, x2);

    function Word$(_size$1) {
        var $1066 = null;
        return $1066;
    };
    const Word = x0 => Word$(x0);
    const Word$e = ({
        _: 'Word.e'
    });

    function Word$i$(_pred$2) {
        var $1067 = ({
            _: 'Word.i',
            'pred': _pred$2
        });
        return $1067;
    };
    const Word$i = x0 => Word$i$(x0);

    function Word$o$(_pred$2) {
        var $1068 = ({
            _: 'Word.o',
            'pred': _pred$2
        });
        return $1068;
    };
    const Word$o = x0 => Word$o$(x0);

    function Word$inc$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $1070 = self.pred;
                var $1071 = Word$i$($1070);
                var $1069 = $1071;
                break;
            case 'Word.i':
                var $1072 = self.pred;
                var $1073 = Word$o$(Word$inc$($1072));
                var $1069 = $1073;
                break;
            case 'Word.e':
                var $1074 = Word$e;
                var $1069 = $1074;
                break;
        };
        return $1069;
    };
    const Word$inc = x0 => Word$inc$(x0);

    function Word$zero$(_size$1) {
        var self = _size$1;
        if (self === 0n) {
            var $1076 = Word$e;
            var $1075 = $1076;
        } else {
            var $1077 = (self - 1n);
            var $1078 = Word$o$(Word$zero$($1077));
            var $1075 = $1078;
        };
        return $1075;
    };
    const Word$zero = x0 => Word$zero$(x0);

    function Nat$to_word$(_size$1, _n$2) {
        var $1079 = Nat$apply$(_n$2, Word$inc, Word$zero$(_size$1));
        return $1079;
    };
    const Nat$to_word = x0 => x1 => Nat$to_word$(x0, x1);
    const Nat$to_u64 = a0 => (a0 & 0xFFFFFFFFFFFFFFFFn);

    function Litereum$parse$term$word$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1081 = self.err;
                var _reply$8 = Litereum$parse$text$("#", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1083 = self.err;
                        var self = $1081;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1085 = self.value;
                                var $1086 = Parser$Reply$error$(Parser$Error$combine$($1085, $1083));
                                var $1084 = $1086;
                                break;
                            case 'Maybe.none':
                                var $1087 = Parser$Reply$error$($1083);
                                var $1084 = $1087;
                                break;
                        };
                        var $1082 = $1084;
                        break;
                    case 'Parser.Reply.value':
                        var $1088 = self.pst;
                        var self = $1088;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1090 = self.err;
                                var $1091 = self.nam;
                                var $1092 = self.ini;
                                var $1093 = self.idx;
                                var $1094 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1081, $1090), $1091, $1092, $1093, $1094);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1096 = self.err;
                                        var _reply$22 = Parser$nat$(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1098 = self.err;
                                                var self = $1096;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1100 = self.value;
                                                        var $1101 = Parser$Reply$error$(Parser$Error$combine$($1100, $1098));
                                                        var $1099 = $1101;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1102 = Parser$Reply$error$($1098);
                                                        var $1099 = $1102;
                                                        break;
                                                };
                                                var $1097 = $1099;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1103 = self.pst;
                                                var $1104 = self.val;
                                                var self = $1103;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1106 = self.err;
                                                        var $1107 = self.nam;
                                                        var $1108 = self.ini;
                                                        var $1109 = self.idx;
                                                        var $1110 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1096, $1106), $1107, $1108, $1109, $1110);
                                                        var self = ($1104 >= (2n ** 64n));
                                                        if (self) {
                                                            var $1112 = Parser$fail("Number out of bound");
                                                            var $1111 = $1112;
                                                        } else {
                                                            var $1113 = (_pst$31 => {
                                                                var $1114 = Parser$Reply$value$(_pst$31, Litereum$Term$word$(($1104 & 0xFFFFFFFFFFFFFFFFn)));
                                                                return $1114;
                                                            });
                                                            var $1111 = $1113;
                                                        };
                                                        var $1111 = $1111(_reply$pst$30);
                                                        var $1105 = $1111;
                                                        break;
                                                };
                                                var $1097 = $1105;
                                                break;
                                        };
                                        var $1095 = $1097;
                                        break;
                                };
                                var $1089 = $1095;
                                break;
                        };
                        var $1082 = $1089;
                        break;
                };
                var $1080 = $1082;
                break;
        };
        return $1080;
    };
    const Litereum$parse$term$word = x0 => x1 => Litereum$parse$term$word$(x0, x1);

    function Litereum$Term$compare$(_val0$1, _val1$2, _iflt$3, _ifeq$4, _ifgt$5) {
        var $1115 = ({
            _: 'Litereum.Term.compare',
            'val0': _val0$1,
            'val1': _val1$2,
            'iflt': _iflt$3,
            'ifeq': _ifeq$4,
            'ifgt': _ifgt$5
        });
        return $1115;
    };
    const Litereum$Term$compare = x0 => x1 => x2 => x3 => x4 => Litereum$Term$compare$(x0, x1, x2, x3, x4);

    function Litereum$parse$term$compare$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1117 = self.err;
                var _reply$8 = Litereum$parse$text$("compare", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1119 = self.err;
                        var self = $1117;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1121 = self.value;
                                var $1122 = Parser$Reply$error$(Parser$Error$combine$($1121, $1119));
                                var $1120 = $1122;
                                break;
                            case 'Maybe.none':
                                var $1123 = Parser$Reply$error$($1119);
                                var $1120 = $1123;
                                break;
                        };
                        var $1118 = $1120;
                        break;
                    case 'Parser.Reply.value':
                        var $1124 = self.pst;
                        var self = $1124;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1126 = self.err;
                                var $1127 = self.nam;
                                var $1128 = self.ini;
                                var $1129 = self.idx;
                                var $1130 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1117, $1126), $1127, $1128, $1129, $1130);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1132 = self.err;
                                        var _reply$22 = Litereum$parse$term$(_world$1)(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1134 = self.err;
                                                var self = $1132;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1136 = self.value;
                                                        var $1137 = Parser$Reply$error$(Parser$Error$combine$($1136, $1134));
                                                        var $1135 = $1137;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1138 = Parser$Reply$error$($1134);
                                                        var $1135 = $1138;
                                                        break;
                                                };
                                                var $1133 = $1135;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1139 = self.pst;
                                                var $1140 = self.val;
                                                var self = $1139;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1142 = self.err;
                                                        var $1143 = self.nam;
                                                        var $1144 = self.ini;
                                                        var $1145 = self.idx;
                                                        var $1146 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1132, $1142), $1143, $1144, $1145, $1146);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $1148 = self.err;
                                                                var _reply$36 = Litereum$parse$term$(_world$1)(_reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1150 = self.err;
                                                                        var self = $1148;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $1152 = self.value;
                                                                                var $1153 = Parser$Reply$error$(Parser$Error$combine$($1152, $1150));
                                                                                var $1151 = $1153;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $1154 = Parser$Reply$error$($1150);
                                                                                var $1151 = $1154;
                                                                                break;
                                                                        };
                                                                        var $1149 = $1151;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1155 = self.pst;
                                                                        var $1156 = self.val;
                                                                        var self = $1155;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $1158 = self.err;
                                                                                var $1159 = self.nam;
                                                                                var $1160 = self.ini;
                                                                                var $1161 = self.idx;
                                                                                var $1162 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($1148, $1158), $1159, $1160, $1161, $1162);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $1164 = self.err;
                                                                                        var _reply$50 = Litereum$parse$text$("{", _reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1166 = self.err;
                                                                                                var self = $1164;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $1168 = self.value;
                                                                                                        var $1169 = Parser$Reply$error$(Parser$Error$combine$($1168, $1166));
                                                                                                        var $1167 = $1169;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $1170 = Parser$Reply$error$($1166);
                                                                                                        var $1167 = $1170;
                                                                                                        break;
                                                                                                };
                                                                                                var $1165 = $1167;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1171 = self.pst;
                                                                                                var self = $1171;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $1173 = self.err;
                                                                                                        var $1174 = self.nam;
                                                                                                        var $1175 = self.ini;
                                                                                                        var $1176 = self.idx;
                                                                                                        var $1177 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($1164, $1173), $1174, $1175, $1176, $1177);
                                                                                                        var self = _reply$pst$58;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $1179 = self.err;
                                                                                                                var _reply$64 = Litereum$parse$text$("_<_:", _reply$pst$58);
                                                                                                                var self = _reply$64;
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $1181 = self.err;
                                                                                                                        var self = $1179;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Maybe.some':
                                                                                                                                var $1183 = self.value;
                                                                                                                                var $1184 = Parser$Reply$error$(Parser$Error$combine$($1183, $1181));
                                                                                                                                var $1182 = $1184;
                                                                                                                                break;
                                                                                                                            case 'Maybe.none':
                                                                                                                                var $1185 = Parser$Reply$error$($1181);
                                                                                                                                var $1182 = $1185;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1180 = $1182;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $1186 = self.pst;
                                                                                                                        var self = $1186;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $1188 = self.err;
                                                                                                                                var $1189 = self.nam;
                                                                                                                                var $1190 = self.ini;
                                                                                                                                var $1191 = self.idx;
                                                                                                                                var $1192 = self.str;
                                                                                                                                var _reply$pst$72 = Parser$State$new$(Parser$Error$maybe_combine$($1179, $1188), $1189, $1190, $1191, $1192);
                                                                                                                                var self = _reply$pst$72;
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.State.new':
                                                                                                                                        var $1194 = self.err;
                                                                                                                                        var _reply$78 = Litereum$parse$term$(_world$1)(_reply$pst$72);
                                                                                                                                        var self = _reply$78;
                                                                                                                                        switch (self._) {
                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                var $1196 = self.err;
                                                                                                                                                var self = $1194;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                        var $1198 = self.value;
                                                                                                                                                        var $1199 = Parser$Reply$error$(Parser$Error$combine$($1198, $1196));
                                                                                                                                                        var $1197 = $1199;
                                                                                                                                                        break;
                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                        var $1200 = Parser$Reply$error$($1196);
                                                                                                                                                        var $1197 = $1200;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1195 = $1197;
                                                                                                                                                break;
                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                var $1201 = self.pst;
                                                                                                                                                var $1202 = self.val;
                                                                                                                                                var self = $1201;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                        var $1204 = self.err;
                                                                                                                                                        var $1205 = self.nam;
                                                                                                                                                        var $1206 = self.ini;
                                                                                                                                                        var $1207 = self.idx;
                                                                                                                                                        var $1208 = self.str;
                                                                                                                                                        var _reply$pst$86 = Parser$State$new$(Parser$Error$maybe_combine$($1194, $1204), $1205, $1206, $1207, $1208);
                                                                                                                                                        var self = _reply$pst$86;
                                                                                                                                                        switch (self._) {
                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                var $1210 = self.err;
                                                                                                                                                                var _reply$92 = Litereum$parse$text$("_=_:", _reply$pst$86);
                                                                                                                                                                var self = _reply$92;
                                                                                                                                                                switch (self._) {
                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                        var $1212 = self.err;
                                                                                                                                                                        var self = $1210;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                var $1214 = self.value;
                                                                                                                                                                                var $1215 = Parser$Reply$error$(Parser$Error$combine$($1214, $1212));
                                                                                                                                                                                var $1213 = $1215;
                                                                                                                                                                                break;
                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                var $1216 = Parser$Reply$error$($1212);
                                                                                                                                                                                var $1213 = $1216;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $1211 = $1213;
                                                                                                                                                                        break;
                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                        var $1217 = self.pst;
                                                                                                                                                                        var self = $1217;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                var $1219 = self.err;
                                                                                                                                                                                var $1220 = self.nam;
                                                                                                                                                                                var $1221 = self.ini;
                                                                                                                                                                                var $1222 = self.idx;
                                                                                                                                                                                var $1223 = self.str;
                                                                                                                                                                                var _reply$pst$100 = Parser$State$new$(Parser$Error$maybe_combine$($1210, $1219), $1220, $1221, $1222, $1223);
                                                                                                                                                                                var self = _reply$pst$100;
                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                        var $1225 = self.err;
                                                                                                                                                                                        var _reply$106 = Litereum$parse$term$(_world$1)(_reply$pst$100);
                                                                                                                                                                                        var self = _reply$106;
                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                                                                var $1227 = self.err;
                                                                                                                                                                                                var self = $1225;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                                                                        var $1229 = self.value;
                                                                                                                                                                                                        var $1230 = Parser$Reply$error$(Parser$Error$combine$($1229, $1227));
                                                                                                                                                                                                        var $1228 = $1230;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                                                                        var $1231 = Parser$Reply$error$($1227);
                                                                                                                                                                                                        var $1228 = $1231;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $1226 = $1228;
                                                                                                                                                                                                break;
                                                                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                                                                var $1232 = self.pst;
                                                                                                                                                                                                var $1233 = self.val;
                                                                                                                                                                                                var self = $1232;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                        var $1235 = self.err;
                                                                                                                                                                                                        var $1236 = self.nam;
                                                                                                                                                                                                        var $1237 = self.ini;
                                                                                                                                                                                                        var $1238 = self.idx;
                                                                                                                                                                                                        var $1239 = self.str;
                                                                                                                                                                                                        var _reply$pst$114 = Parser$State$new$(Parser$Error$maybe_combine$($1225, $1235), $1236, $1237, $1238, $1239);
                                                                                                                                                                                                        var self = _reply$pst$114;
                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                                                var $1241 = self.err;
                                                                                                                                                                                                                var _reply$120 = Litereum$parse$text$("_>_:", _reply$pst$114);
                                                                                                                                                                                                                var self = _reply$120;
                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                                                                        var $1243 = self.err;
                                                                                                                                                                                                                        var self = $1241;
                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                                                                var $1245 = self.value;
                                                                                                                                                                                                                                var $1246 = Parser$Reply$error$(Parser$Error$combine$($1245, $1243));
                                                                                                                                                                                                                                var $1244 = $1246;
                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                                                                var $1247 = Parser$Reply$error$($1243);
                                                                                                                                                                                                                                var $1244 = $1247;
                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                        };
                                                                                                                                                                                                                        var $1242 = $1244;
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                                                                        var $1248 = self.pst;
                                                                                                                                                                                                                        var self = $1248;
                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                                                                var $1250 = self.err;
                                                                                                                                                                                                                                var $1251 = self.nam;
                                                                                                                                                                                                                                var $1252 = self.ini;
                                                                                                                                                                                                                                var $1253 = self.idx;
                                                                                                                                                                                                                                var $1254 = self.str;
                                                                                                                                                                                                                                var _reply$pst$128 = Parser$State$new$(Parser$Error$maybe_combine$($1241, $1250), $1251, $1252, $1253, $1254);
                                                                                                                                                                                                                                var self = _reply$pst$128;
                                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                                                        var $1256 = self.err;
                                                                                                                                                                                                                                        var _reply$134 = Litereum$parse$term$(_world$1)(_reply$pst$128);
                                                                                                                                                                                                                                        var self = _reply$134;
                                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                                                                                                                var $1258 = self.err;
                                                                                                                                                                                                                                                var self = $1256;
                                                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                                                                                                                        var $1260 = self.value;
                                                                                                                                                                                                                                                        var $1261 = Parser$Reply$error$(Parser$Error$combine$($1260, $1258));
                                                                                                                                                                                                                                                        var $1259 = $1261;
                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                                                                                                                        var $1262 = Parser$Reply$error$($1258);
                                                                                                                                                                                                                                                        var $1259 = $1262;
                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                var $1257 = $1259;
                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                                                                                                                var $1263 = self.pst;
                                                                                                                                                                                                                                                var $1264 = self.val;
                                                                                                                                                                                                                                                var self = $1263;
                                                                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                                                                        var $1266 = self.err;
                                                                                                                                                                                                                                                        var $1267 = self.nam;
                                                                                                                                                                                                                                                        var $1268 = self.ini;
                                                                                                                                                                                                                                                        var $1269 = self.idx;
                                                                                                                                                                                                                                                        var $1270 = self.str;
                                                                                                                                                                                                                                                        var _reply$pst$142 = Parser$State$new$(Parser$Error$maybe_combine$($1256, $1266), $1267, $1268, $1269, $1270);
                                                                                                                                                                                                                                                        var self = _reply$pst$142;
                                                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                                                                                                var $1272 = self.err;
                                                                                                                                                                                                                                                                var _reply$148 = Litereum$parse$text$("}", _reply$pst$142);
                                                                                                                                                                                                                                                                var self = _reply$148;
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
                                                                                                                                                                                                                                                                        var self = $1279;
                                                                                                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                                                                                                                var $1281 = self.err;
                                                                                                                                                                                                                                                                                var $1282 = self.nam;
                                                                                                                                                                                                                                                                                var $1283 = self.ini;
                                                                                                                                                                                                                                                                                var $1284 = self.idx;
                                                                                                                                                                                                                                                                                var $1285 = self.str;
                                                                                                                                                                                                                                                                                var _reply$pst$156 = Parser$State$new$(Parser$Error$maybe_combine$($1272, $1281), $1282, $1283, $1284, $1285);
                                                                                                                                                                                                                                                                                var $1286 = Parser$Reply$value$(_reply$pst$156, Litereum$Term$compare$($1140, $1156, $1202, $1233, $1264));
                                                                                                                                                                                                                                                                                var $1280 = $1286;
                                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                                                        var $1273 = $1280;
                                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                                var $1271 = $1273;
                                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                                        var $1265 = $1271;
                                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                                var $1257 = $1265;
                                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                                        };
                                                                                                                                                                                                                                        var $1255 = $1257;
                                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                                };
                                                                                                                                                                                                                                var $1249 = $1255;
                                                                                                                                                                                                                                break;
                                                                                                                                                                                                                        };
                                                                                                                                                                                                                        var $1242 = $1249;
                                                                                                                                                                                                                        break;
                                                                                                                                                                                                                };
                                                                                                                                                                                                                var $1240 = $1242;
                                                                                                                                                                                                                break;
                                                                                                                                                                                                        };
                                                                                                                                                                                                        var $1234 = $1240;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $1226 = $1234;
                                                                                                                                                                                                break;
                                                                                                                                                                                        };
                                                                                                                                                                                        var $1224 = $1226;
                                                                                                                                                                                        break;
                                                                                                                                                                                };
                                                                                                                                                                                var $1218 = $1224;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $1211 = $1218;
                                                                                                                                                                        break;
                                                                                                                                                                };
                                                                                                                                                                var $1209 = $1211;
                                                                                                                                                                break;
                                                                                                                                                        };
                                                                                                                                                        var $1203 = $1209;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1195 = $1203;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $1193 = $1195;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $1187 = $1193;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1180 = $1187;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $1178 = $1180;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1172 = $1178;
                                                                                                        break;
                                                                                                };
                                                                                                var $1165 = $1172;
                                                                                                break;
                                                                                        };
                                                                                        var $1163 = $1165;
                                                                                        break;
                                                                                };
                                                                                var $1157 = $1163;
                                                                                break;
                                                                        };
                                                                        var $1149 = $1157;
                                                                        break;
                                                                };
                                                                var $1147 = $1149;
                                                                break;
                                                        };
                                                        var $1141 = $1147;
                                                        break;
                                                };
                                                var $1133 = $1141;
                                                break;
                                        };
                                        var $1131 = $1133;
                                        break;
                                };
                                var $1125 = $1131;
                                break;
                        };
                        var $1118 = $1125;
                        break;
                };
                var $1116 = $1118;
                break;
        };
        return $1116;
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
                var $1288 = self.err;
                var _reply$7 = Litereum$parse$text$("+", _pst$1);
                var self = _reply$7;
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
                        var self = $1295;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1297 = self.err;
                                var $1298 = self.nam;
                                var $1299 = self.ini;
                                var $1300 = self.idx;
                                var $1301 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1288, $1297), $1298, $1299, $1300, $1301);
                                var $1302 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$add));
                                var $1296 = $1302;
                                break;
                        };
                        var $1289 = $1296;
                        break;
                };
                var $1287 = $1289;
                break;
        };
        return $1287;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1304 = self.err;
                var _reply$7 = Litereum$parse$text$("-", _pst$1);
                var self = _reply$7;
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
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1304, $1313), $1314, $1315, $1316, $1317);
                                var $1318 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$sub));
                                var $1312 = $1318;
                                break;
                        };
                        var $1305 = $1312;
                        break;
                };
                var $1303 = $1305;
                break;
        };
        return $1303;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1320 = self.err;
                var _reply$7 = Litereum$parse$text$("*", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1322 = self.err;
                        var self = $1320;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1324 = self.value;
                                var $1325 = Parser$Reply$error$(Parser$Error$combine$($1324, $1322));
                                var $1323 = $1325;
                                break;
                            case 'Maybe.none':
                                var $1326 = Parser$Reply$error$($1322);
                                var $1323 = $1326;
                                break;
                        };
                        var $1321 = $1323;
                        break;
                    case 'Parser.Reply.value':
                        var $1327 = self.pst;
                        var self = $1327;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1329 = self.err;
                                var $1330 = self.nam;
                                var $1331 = self.ini;
                                var $1332 = self.idx;
                                var $1333 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1320, $1329), $1330, $1331, $1332, $1333);
                                var $1334 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$mul));
                                var $1328 = $1334;
                                break;
                        };
                        var $1321 = $1328;
                        break;
                };
                var $1319 = $1321;
                break;
        };
        return $1319;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1336 = self.err;
                var _reply$7 = Litereum$parse$text$("/", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1338 = self.err;
                        var self = $1336;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1340 = self.value;
                                var $1341 = Parser$Reply$error$(Parser$Error$combine$($1340, $1338));
                                var $1339 = $1341;
                                break;
                            case 'Maybe.none':
                                var $1342 = Parser$Reply$error$($1338);
                                var $1339 = $1342;
                                break;
                        };
                        var $1337 = $1339;
                        break;
                    case 'Parser.Reply.value':
                        var $1343 = self.pst;
                        var self = $1343;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1345 = self.err;
                                var $1346 = self.nam;
                                var $1347 = self.ini;
                                var $1348 = self.idx;
                                var $1349 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1336, $1345), $1346, $1347, $1348, $1349);
                                var $1350 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$div));
                                var $1344 = $1350;
                                break;
                        };
                        var $1337 = $1344;
                        break;
                };
                var $1335 = $1337;
                break;
        };
        return $1335;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1352 = self.err;
                var _reply$7 = Litereum$parse$text$("%", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1354 = self.err;
                        var self = $1352;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1356 = self.value;
                                var $1357 = Parser$Reply$error$(Parser$Error$combine$($1356, $1354));
                                var $1355 = $1357;
                                break;
                            case 'Maybe.none':
                                var $1358 = Parser$Reply$error$($1354);
                                var $1355 = $1358;
                                break;
                        };
                        var $1353 = $1355;
                        break;
                    case 'Parser.Reply.value':
                        var $1359 = self.pst;
                        var self = $1359;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1361 = self.err;
                                var $1362 = self.nam;
                                var $1363 = self.ini;
                                var $1364 = self.idx;
                                var $1365 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1352, $1361), $1362, $1363, $1364, $1365);
                                var $1366 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$mod));
                                var $1360 = $1366;
                                break;
                        };
                        var $1353 = $1360;
                        break;
                };
                var $1351 = $1353;
                break;
        };
        return $1351;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1368 = self.err;
                var _reply$7 = Litereum$parse$text$("|", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1370 = self.err;
                        var self = $1368;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1372 = self.value;
                                var $1373 = Parser$Reply$error$(Parser$Error$combine$($1372, $1370));
                                var $1371 = $1373;
                                break;
                            case 'Maybe.none':
                                var $1374 = Parser$Reply$error$($1370);
                                var $1371 = $1374;
                                break;
                        };
                        var $1369 = $1371;
                        break;
                    case 'Parser.Reply.value':
                        var $1375 = self.pst;
                        var self = $1375;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1377 = self.err;
                                var $1378 = self.nam;
                                var $1379 = self.ini;
                                var $1380 = self.idx;
                                var $1381 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1368, $1377), $1378, $1379, $1380, $1381);
                                var $1382 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$or));
                                var $1376 = $1382;
                                break;
                        };
                        var $1369 = $1376;
                        break;
                };
                var $1367 = $1369;
                break;
        };
        return $1367;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1384 = self.err;
                var _reply$7 = Litereum$parse$text$("&", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1386 = self.err;
                        var self = $1384;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1388 = self.value;
                                var $1389 = Parser$Reply$error$(Parser$Error$combine$($1388, $1386));
                                var $1387 = $1389;
                                break;
                            case 'Maybe.none':
                                var $1390 = Parser$Reply$error$($1386);
                                var $1387 = $1390;
                                break;
                        };
                        var $1385 = $1387;
                        break;
                    case 'Parser.Reply.value':
                        var $1391 = self.pst;
                        var self = $1391;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1393 = self.err;
                                var $1394 = self.nam;
                                var $1395 = self.ini;
                                var $1396 = self.idx;
                                var $1397 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1384, $1393), $1394, $1395, $1396, $1397);
                                var $1398 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$and));
                                var $1392 = $1398;
                                break;
                        };
                        var $1385 = $1392;
                        break;
                };
                var $1383 = $1385;
                break;
        };
        return $1383;
    }), List$cons$((_pst$1 => {
        var self = _pst$1;
        switch (self._) {
            case 'Parser.State.new':
                var $1400 = self.err;
                var _reply$7 = Litereum$parse$text$("^", _pst$1);
                var self = _reply$7;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1402 = self.err;
                        var self = $1400;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1404 = self.value;
                                var $1405 = Parser$Reply$error$(Parser$Error$combine$($1404, $1402));
                                var $1403 = $1405;
                                break;
                            case 'Maybe.none':
                                var $1406 = Parser$Reply$error$($1402);
                                var $1403 = $1406;
                                break;
                        };
                        var $1401 = $1403;
                        break;
                    case 'Parser.Reply.value':
                        var $1407 = self.pst;
                        var self = $1407;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1409 = self.err;
                                var $1410 = self.nam;
                                var $1411 = self.ini;
                                var $1412 = self.idx;
                                var $1413 = self.str;
                                var _reply$pst$15 = Parser$State$new$(Parser$Error$maybe_combine$($1400, $1409), $1410, $1411, $1412, $1413);
                                var $1414 = Parser$Reply$value$(_reply$pst$15, Maybe$some$(Litereum$Operation$xor));
                                var $1408 = $1414;
                                break;
                        };
                        var $1401 = $1408;
                        break;
                };
                var $1399 = $1401;
                break;
        };
        return $1399;
    }), List$cons$((_pst$1 => {
        var $1415 = Parser$Reply$value$(_pst$1, Maybe$none);
        return $1415;
    }), List$nil))))))))));

    function Litereum$Term$operate$(_oper$1, _val0$2, _val1$3) {
        var $1416 = ({
            _: 'Litereum.Term.operate',
            'oper': _oper$1,
            'val0': _val0$2,
            'val1': _val1$3
        });
        return $1416;
    };
    const Litereum$Term$operate = x0 => x1 => x2 => Litereum$Term$operate$(x0, x1, x2);

    function Litereum$parse$term$operate$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1418 = self.err;
                var _reply$8 = Litereum$parse$term$operation(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1420 = self.err;
                        var self = $1418;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1422 = self.value;
                                var $1423 = Parser$Reply$error$(Parser$Error$combine$($1422, $1420));
                                var $1421 = $1423;
                                break;
                            case 'Maybe.none':
                                var $1424 = Parser$Reply$error$($1420);
                                var $1421 = $1424;
                                break;
                        };
                        var $1419 = $1421;
                        break;
                    case 'Parser.Reply.value':
                        var $1425 = self.pst;
                        var $1426 = self.val;
                        var self = $1425;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1428 = self.err;
                                var $1429 = self.nam;
                                var $1430 = self.ini;
                                var $1431 = self.idx;
                                var $1432 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1418, $1428), $1429, $1430, $1431, $1432);
                                var self = $1426;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $1434 = self.value;
                                        var $1435 = (_pst$18 => {
                                            var self = _pst$18;
                                            switch (self._) {
                                                case 'Parser.State.new':
                                                    var $1437 = self.err;
                                                    var _reply$24 = Litereum$parse$text$("(", _pst$18);
                                                    var self = _reply$24;
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $1439 = self.err;
                                                            var self = $1437;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $1441 = self.value;
                                                                    var $1442 = Parser$Reply$error$(Parser$Error$combine$($1441, $1439));
                                                                    var $1440 = $1442;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $1443 = Parser$Reply$error$($1439);
                                                                    var $1440 = $1443;
                                                                    break;
                                                            };
                                                            var $1438 = $1440;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $1444 = self.pst;
                                                            var self = $1444;
                                                            switch (self._) {
                                                                case 'Parser.State.new':
                                                                    var $1446 = self.err;
                                                                    var $1447 = self.nam;
                                                                    var $1448 = self.ini;
                                                                    var $1449 = self.idx;
                                                                    var $1450 = self.str;
                                                                    var _reply$pst$32 = Parser$State$new$(Parser$Error$maybe_combine$($1437, $1446), $1447, $1448, $1449, $1450);
                                                                    var self = _reply$pst$32;
                                                                    switch (self._) {
                                                                        case 'Parser.State.new':
                                                                            var $1452 = self.err;
                                                                            var _reply$38 = Litereum$parse$term$(_world$1)(_reply$pst$32);
                                                                            var self = _reply$38;
                                                                            switch (self._) {
                                                                                case 'Parser.Reply.error':
                                                                                    var $1454 = self.err;
                                                                                    var self = $1452;
                                                                                    switch (self._) {
                                                                                        case 'Maybe.some':
                                                                                            var $1456 = self.value;
                                                                                            var $1457 = Parser$Reply$error$(Parser$Error$combine$($1456, $1454));
                                                                                            var $1455 = $1457;
                                                                                            break;
                                                                                        case 'Maybe.none':
                                                                                            var $1458 = Parser$Reply$error$($1454);
                                                                                            var $1455 = $1458;
                                                                                            break;
                                                                                    };
                                                                                    var $1453 = $1455;
                                                                                    break;
                                                                                case 'Parser.Reply.value':
                                                                                    var $1459 = self.pst;
                                                                                    var $1460 = self.val;
                                                                                    var self = $1459;
                                                                                    switch (self._) {
                                                                                        case 'Parser.State.new':
                                                                                            var $1462 = self.err;
                                                                                            var $1463 = self.nam;
                                                                                            var $1464 = self.ini;
                                                                                            var $1465 = self.idx;
                                                                                            var $1466 = self.str;
                                                                                            var _reply$pst$46 = Parser$State$new$(Parser$Error$maybe_combine$($1452, $1462), $1463, $1464, $1465, $1466);
                                                                                            var self = _reply$pst$46;
                                                                                            switch (self._) {
                                                                                                case 'Parser.State.new':
                                                                                                    var $1468 = self.err;
                                                                                                    var _reply$52 = Parser$maybe$(Litereum$parse$text(","), _reply$pst$46);
                                                                                                    var self = _reply$52;
                                                                                                    switch (self._) {
                                                                                                        case 'Parser.Reply.error':
                                                                                                            var $1470 = self.err;
                                                                                                            var self = $1468;
                                                                                                            switch (self._) {
                                                                                                                case 'Maybe.some':
                                                                                                                    var $1472 = self.value;
                                                                                                                    var $1473 = Parser$Reply$error$(Parser$Error$combine$($1472, $1470));
                                                                                                                    var $1471 = $1473;
                                                                                                                    break;
                                                                                                                case 'Maybe.none':
                                                                                                                    var $1474 = Parser$Reply$error$($1470);
                                                                                                                    var $1471 = $1474;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $1469 = $1471;
                                                                                                            break;
                                                                                                        case 'Parser.Reply.value':
                                                                                                            var $1475 = self.pst;
                                                                                                            var self = $1475;
                                                                                                            switch (self._) {
                                                                                                                case 'Parser.State.new':
                                                                                                                    var $1477 = self.err;
                                                                                                                    var $1478 = self.nam;
                                                                                                                    var $1479 = self.ini;
                                                                                                                    var $1480 = self.idx;
                                                                                                                    var $1481 = self.str;
                                                                                                                    var _reply$pst$60 = Parser$State$new$(Parser$Error$maybe_combine$($1468, $1477), $1478, $1479, $1480, $1481);
                                                                                                                    var self = _reply$pst$60;
                                                                                                                    switch (self._) {
                                                                                                                        case 'Parser.State.new':
                                                                                                                            var $1483 = self.err;
                                                                                                                            var _reply$66 = Litereum$parse$term$(_world$1)(_reply$pst$60);
                                                                                                                            var self = _reply$66;
                                                                                                                            switch (self._) {
                                                                                                                                case 'Parser.Reply.error':
                                                                                                                                    var $1485 = self.err;
                                                                                                                                    var self = $1483;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Maybe.some':
                                                                                                                                            var $1487 = self.value;
                                                                                                                                            var $1488 = Parser$Reply$error$(Parser$Error$combine$($1487, $1485));
                                                                                                                                            var $1486 = $1488;
                                                                                                                                            break;
                                                                                                                                        case 'Maybe.none':
                                                                                                                                            var $1489 = Parser$Reply$error$($1485);
                                                                                                                                            var $1486 = $1489;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1484 = $1486;
                                                                                                                                    break;
                                                                                                                                case 'Parser.Reply.value':
                                                                                                                                    var $1490 = self.pst;
                                                                                                                                    var $1491 = self.val;
                                                                                                                                    var self = $1490;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Parser.State.new':
                                                                                                                                            var $1493 = self.err;
                                                                                                                                            var $1494 = self.nam;
                                                                                                                                            var $1495 = self.ini;
                                                                                                                                            var $1496 = self.idx;
                                                                                                                                            var $1497 = self.str;
                                                                                                                                            var _reply$pst$74 = Parser$State$new$(Parser$Error$maybe_combine$($1483, $1493), $1494, $1495, $1496, $1497);
                                                                                                                                            var self = _reply$pst$74;
                                                                                                                                            switch (self._) {
                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                    var $1499 = self.err;
                                                                                                                                                    var _reply$80 = Litereum$parse$text$(")", _reply$pst$74);
                                                                                                                                                    var self = _reply$80;
                                                                                                                                                    switch (self._) {
                                                                                                                                                        case 'Parser.Reply.error':
                                                                                                                                                            var $1501 = self.err;
                                                                                                                                                            var self = $1499;
                                                                                                                                                            switch (self._) {
                                                                                                                                                                case 'Maybe.some':
                                                                                                                                                                    var $1503 = self.value;
                                                                                                                                                                    var $1504 = Parser$Reply$error$(Parser$Error$combine$($1503, $1501));
                                                                                                                                                                    var $1502 = $1504;
                                                                                                                                                                    break;
                                                                                                                                                                case 'Maybe.none':
                                                                                                                                                                    var $1505 = Parser$Reply$error$($1501);
                                                                                                                                                                    var $1502 = $1505;
                                                                                                                                                                    break;
                                                                                                                                                            };
                                                                                                                                                            var $1500 = $1502;
                                                                                                                                                            break;
                                                                                                                                                        case 'Parser.Reply.value':
                                                                                                                                                            var $1506 = self.pst;
                                                                                                                                                            var self = $1506;
                                                                                                                                                            switch (self._) {
                                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                                    var $1508 = self.err;
                                                                                                                                                                    var $1509 = self.nam;
                                                                                                                                                                    var $1510 = self.ini;
                                                                                                                                                                    var $1511 = self.idx;
                                                                                                                                                                    var $1512 = self.str;
                                                                                                                                                                    var _reply$pst$88 = Parser$State$new$(Parser$Error$maybe_combine$($1499, $1508), $1509, $1510, $1511, $1512);
                                                                                                                                                                    var $1513 = Parser$Reply$value$(_reply$pst$88, Litereum$Term$operate$($1434, $1460, $1491));
                                                                                                                                                                    var $1507 = $1513;
                                                                                                                                                                    break;
                                                                                                                                                            };
                                                                                                                                                            var $1500 = $1507;
                                                                                                                                                            break;
                                                                                                                                                    };
                                                                                                                                                    var $1498 = $1500;
                                                                                                                                                    break;
                                                                                                                                            };
                                                                                                                                            var $1492 = $1498;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1484 = $1492;
                                                                                                                                    break;
                                                                                                                            };
                                                                                                                            var $1482 = $1484;
                                                                                                                            break;
                                                                                                                    };
                                                                                                                    var $1476 = $1482;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $1469 = $1476;
                                                                                                            break;
                                                                                                    };
                                                                                                    var $1467 = $1469;
                                                                                                    break;
                                                                                            };
                                                                                            var $1461 = $1467;
                                                                                            break;
                                                                                    };
                                                                                    var $1453 = $1461;
                                                                                    break;
                                                                            };
                                                                            var $1451 = $1453;
                                                                            break;
                                                                    };
                                                                    var $1445 = $1451;
                                                                    break;
                                                            };
                                                            var $1438 = $1445;
                                                            break;
                                                    };
                                                    var $1436 = $1438;
                                                    break;
                                            };
                                            return $1436;
                                        });
                                        var $1433 = $1435;
                                        break;
                                    case 'Maybe.none':
                                        var $1514 = Parser$fail("Not an operation.");
                                        var $1433 = $1514;
                                        break;
                                };
                                var $1433 = $1433(_reply$pst$16);
                                var $1427 = $1433;
                                break;
                        };
                        var $1419 = $1427;
                        break;
                };
                var $1417 = $1419;
                break;
        };
        return $1417;
    };
    const Litereum$parse$term$operate = x0 => x1 => Litereum$parse$term$operate$(x0, x1);

    function Litereum$Term$bind$(_bond$1, _main$2, _body$3) {
        var $1515 = ({
            _: 'Litereum.Term.bind',
            'bond': _bond$1,
            'main': _main$2,
            'body': _body$3
        });
        return $1515;
    };
    const Litereum$Term$bind = x0 => x1 => x2 => Litereum$Term$bind$(x0, x1, x2);

    function Litereum$parse$term$bind$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1517 = self.err;
                var _reply$8 = Litereum$parse$text$("bind", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1519 = self.err;
                        var self = $1517;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1521 = self.value;
                                var $1522 = Parser$Reply$error$(Parser$Error$combine$($1521, $1519));
                                var $1520 = $1522;
                                break;
                            case 'Maybe.none':
                                var $1523 = Parser$Reply$error$($1519);
                                var $1520 = $1523;
                                break;
                        };
                        var $1518 = $1520;
                        break;
                    case 'Parser.Reply.value':
                        var $1524 = self.pst;
                        var self = $1524;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1526 = self.err;
                                var $1527 = self.nam;
                                var $1528 = self.ini;
                                var $1529 = self.idx;
                                var $1530 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1517, $1526), $1527, $1528, $1529, $1530);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1532 = self.err;
                                        var _reply$22 = Litereum$parse$name$(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1534 = self.err;
                                                var self = $1532;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1536 = self.value;
                                                        var $1537 = Parser$Reply$error$(Parser$Error$combine$($1536, $1534));
                                                        var $1535 = $1537;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1538 = Parser$Reply$error$($1534);
                                                        var $1535 = $1538;
                                                        break;
                                                };
                                                var $1533 = $1535;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1539 = self.pst;
                                                var $1540 = self.val;
                                                var self = $1539;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1542 = self.err;
                                                        var $1543 = self.nam;
                                                        var $1544 = self.ini;
                                                        var $1545 = self.idx;
                                                        var $1546 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1532, $1542), $1543, $1544, $1545, $1546);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $1548 = self.err;
                                                                var _reply$36 = Litereum$parse$text$("{", _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $1550 = self.err;
                                                                        var self = $1548;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $1552 = self.value;
                                                                                var $1553 = Parser$Reply$error$(Parser$Error$combine$($1552, $1550));
                                                                                var $1551 = $1553;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $1554 = Parser$Reply$error$($1550);
                                                                                var $1551 = $1554;
                                                                                break;
                                                                        };
                                                                        var $1549 = $1551;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $1555 = self.pst;
                                                                        var self = $1555;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $1557 = self.err;
                                                                                var $1558 = self.nam;
                                                                                var $1559 = self.ini;
                                                                                var $1560 = self.idx;
                                                                                var $1561 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($1548, $1557), $1558, $1559, $1560, $1561);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $1563 = self.err;
                                                                                        var _reply$50 = Litereum$parse$term$(_world$1)(_reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $1565 = self.err;
                                                                                                var self = $1563;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $1567 = self.value;
                                                                                                        var $1568 = Parser$Reply$error$(Parser$Error$combine$($1567, $1565));
                                                                                                        var $1566 = $1568;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $1569 = Parser$Reply$error$($1565);
                                                                                                        var $1566 = $1569;
                                                                                                        break;
                                                                                                };
                                                                                                var $1564 = $1566;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $1570 = self.pst;
                                                                                                var $1571 = self.val;
                                                                                                var self = $1570;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $1573 = self.err;
                                                                                                        var $1574 = self.nam;
                                                                                                        var $1575 = self.ini;
                                                                                                        var $1576 = self.idx;
                                                                                                        var $1577 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($1563, $1573), $1574, $1575, $1576, $1577);
                                                                                                        var self = _reply$pst$58;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $1579 = self.err;
                                                                                                                var _reply$64 = Litereum$parse$text$("}", _reply$pst$58);
                                                                                                                var self = _reply$64;
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $1581 = self.err;
                                                                                                                        var self = $1579;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Maybe.some':
                                                                                                                                var $1583 = self.value;
                                                                                                                                var $1584 = Parser$Reply$error$(Parser$Error$combine$($1583, $1581));
                                                                                                                                var $1582 = $1584;
                                                                                                                                break;
                                                                                                                            case 'Maybe.none':
                                                                                                                                var $1585 = Parser$Reply$error$($1581);
                                                                                                                                var $1582 = $1585;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1580 = $1582;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $1586 = self.pst;
                                                                                                                        var self = $1586;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $1588 = self.err;
                                                                                                                                var $1589 = self.nam;
                                                                                                                                var $1590 = self.ini;
                                                                                                                                var $1591 = self.idx;
                                                                                                                                var $1592 = self.str;
                                                                                                                                var _reply$pst$72 = Parser$State$new$(Parser$Error$maybe_combine$($1579, $1588), $1589, $1590, $1591, $1592);
                                                                                                                                var self = _reply$pst$72;
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.State.new':
                                                                                                                                        var $1594 = self.err;
                                                                                                                                        var _reply$78 = Litereum$parse$term$(_world$1)(_reply$pst$72);
                                                                                                                                        var self = _reply$78;
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
                                                                                                                                                        var _reply$pst$86 = Parser$State$new$(Parser$Error$maybe_combine$($1594, $1604), $1605, $1606, $1607, $1608);
                                                                                                                                                        var $1609 = Parser$Reply$value$(_reply$pst$86, Litereum$Term$bind$($1540, $1571, $1602));
                                                                                                                                                        var $1603 = $1609;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1595 = $1603;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $1593 = $1595;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $1587 = $1593;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1580 = $1587;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $1578 = $1580;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $1572 = $1578;
                                                                                                        break;
                                                                                                };
                                                                                                var $1564 = $1572;
                                                                                                break;
                                                                                        };
                                                                                        var $1562 = $1564;
                                                                                        break;
                                                                                };
                                                                                var $1556 = $1562;
                                                                                break;
                                                                        };
                                                                        var $1549 = $1556;
                                                                        break;
                                                                };
                                                                var $1547 = $1549;
                                                                break;
                                                        };
                                                        var $1541 = $1547;
                                                        break;
                                                };
                                                var $1533 = $1541;
                                                break;
                                        };
                                        var $1531 = $1533;
                                        break;
                                };
                                var $1525 = $1531;
                                break;
                        };
                        var $1518 = $1525;
                        break;
                };
                var $1516 = $1518;
                break;
        };
        return $1516;
    };
    const Litereum$parse$term$bind = x0 => x1 => Litereum$parse$term$bind$(x0, x1);

    function Litereum$Term$run$(_name$1, _type$2, _expr$3, _body$4) {
        var $1610 = ({
            _: 'Litereum.Term.run',
            'name': _name$1,
            'type': _type$2,
            'expr': _expr$3,
            'body': _body$4
        });
        return $1610;
    };
    const Litereum$Term$run = x0 => x1 => x2 => x3 => Litereum$Term$run$(x0, x1, x2, x3);

    function Litereum$parse$term$run$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1612 = self.err;
                var _reply$8 = Litereum$parse$text$("run", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1614 = self.err;
                        var self = $1612;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1616 = self.value;
                                var $1617 = Parser$Reply$error$(Parser$Error$combine$($1616, $1614));
                                var $1615 = $1617;
                                break;
                            case 'Maybe.none':
                                var $1618 = Parser$Reply$error$($1614);
                                var $1615 = $1618;
                                break;
                        };
                        var $1613 = $1615;
                        break;
                    case 'Parser.Reply.value':
                        var $1619 = self.pst;
                        var self = $1619;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1621 = self.err;
                                var $1622 = self.nam;
                                var $1623 = self.ini;
                                var $1624 = self.idx;
                                var $1625 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1612, $1621), $1622, $1623, $1624, $1625);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1627 = self.err;
                                        var _reply$22 = Parser$choice$(List$cons$((_pst$22 => {
                                            var self = _pst$22;
                                            switch (self._) {
                                                case 'Parser.State.new':
                                                    var $1630 = self.err;
                                                    var _reply$28 = Litereum$parse$name$(_pst$22);
                                                    var self = _reply$28;
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $1632 = self.err;
                                                            var self = $1630;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $1634 = self.value;
                                                                    var $1635 = Parser$Reply$error$(Parser$Error$combine$($1634, $1632));
                                                                    var $1633 = $1635;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $1636 = Parser$Reply$error$($1632);
                                                                    var $1633 = $1636;
                                                                    break;
                                                            };
                                                            var $1631 = $1633;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $1637 = self.pst;
                                                            var $1638 = self.val;
                                                            var self = $1637;
                                                            switch (self._) {
                                                                case 'Parser.State.new':
                                                                    var $1640 = self.err;
                                                                    var $1641 = self.nam;
                                                                    var $1642 = self.ini;
                                                                    var $1643 = self.idx;
                                                                    var $1644 = self.str;
                                                                    var _reply$pst$36 = Parser$State$new$(Parser$Error$maybe_combine$($1630, $1640), $1641, $1642, $1643, $1644);
                                                                    var self = _reply$pst$36;
                                                                    switch (self._) {
                                                                        case 'Parser.State.new':
                                                                            var $1646 = self.err;
                                                                            var _reply$42 = Litereum$parse$text$(":", _reply$pst$36);
                                                                            var self = _reply$42;
                                                                            switch (self._) {
                                                                                case 'Parser.Reply.error':
                                                                                    var $1648 = self.err;
                                                                                    var self = $1646;
                                                                                    switch (self._) {
                                                                                        case 'Maybe.some':
                                                                                            var $1650 = self.value;
                                                                                            var $1651 = Parser$Reply$error$(Parser$Error$combine$($1650, $1648));
                                                                                            var $1649 = $1651;
                                                                                            break;
                                                                                        case 'Maybe.none':
                                                                                            var $1652 = Parser$Reply$error$($1648);
                                                                                            var $1649 = $1652;
                                                                                            break;
                                                                                    };
                                                                                    var $1647 = $1649;
                                                                                    break;
                                                                                case 'Parser.Reply.value':
                                                                                    var $1653 = self.pst;
                                                                                    var self = $1653;
                                                                                    switch (self._) {
                                                                                        case 'Parser.State.new':
                                                                                            var $1655 = self.err;
                                                                                            var $1656 = self.nam;
                                                                                            var $1657 = self.ini;
                                                                                            var $1658 = self.idx;
                                                                                            var $1659 = self.str;
                                                                                            var _reply$pst$50 = Parser$State$new$(Parser$Error$maybe_combine$($1646, $1655), $1656, $1657, $1658, $1659);
                                                                                            var self = _reply$pst$50;
                                                                                            switch (self._) {
                                                                                                case 'Parser.State.new':
                                                                                                    var $1661 = self.err;
                                                                                                    var _reply$56 = Litereum$parse$type$(_world$1)(_reply$pst$50);
                                                                                                    var self = _reply$56;
                                                                                                    switch (self._) {
                                                                                                        case 'Parser.Reply.error':
                                                                                                            var $1663 = self.err;
                                                                                                            var self = $1661;
                                                                                                            switch (self._) {
                                                                                                                case 'Maybe.some':
                                                                                                                    var $1665 = self.value;
                                                                                                                    var $1666 = Parser$Reply$error$(Parser$Error$combine$($1665, $1663));
                                                                                                                    var $1664 = $1666;
                                                                                                                    break;
                                                                                                                case 'Maybe.none':
                                                                                                                    var $1667 = Parser$Reply$error$($1663);
                                                                                                                    var $1664 = $1667;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $1662 = $1664;
                                                                                                            break;
                                                                                                        case 'Parser.Reply.value':
                                                                                                            var $1668 = self.pst;
                                                                                                            var $1669 = self.val;
                                                                                                            var self = $1668;
                                                                                                            switch (self._) {
                                                                                                                case 'Parser.State.new':
                                                                                                                    var $1671 = self.err;
                                                                                                                    var $1672 = self.nam;
                                                                                                                    var $1673 = self.ini;
                                                                                                                    var $1674 = self.idx;
                                                                                                                    var $1675 = self.str;
                                                                                                                    var _reply$pst$64 = Parser$State$new$(Parser$Error$maybe_combine$($1661, $1671), $1672, $1673, $1674, $1675);
                                                                                                                    var self = _reply$pst$64;
                                                                                                                    switch (self._) {
                                                                                                                        case 'Parser.State.new':
                                                                                                                            var $1677 = self.err;
                                                                                                                            var _reply$70 = Litereum$parse$text$("=", _reply$pst$64);
                                                                                                                            var self = _reply$70;
                                                                                                                            switch (self._) {
                                                                                                                                case 'Parser.Reply.error':
                                                                                                                                    var $1679 = self.err;
                                                                                                                                    var self = $1677;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Maybe.some':
                                                                                                                                            var $1681 = self.value;
                                                                                                                                            var $1682 = Parser$Reply$error$(Parser$Error$combine$($1681, $1679));
                                                                                                                                            var $1680 = $1682;
                                                                                                                                            break;
                                                                                                                                        case 'Maybe.none':
                                                                                                                                            var $1683 = Parser$Reply$error$($1679);
                                                                                                                                            var $1680 = $1683;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1678 = $1680;
                                                                                                                                    break;
                                                                                                                                case 'Parser.Reply.value':
                                                                                                                                    var $1684 = self.pst;
                                                                                                                                    var self = $1684;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Parser.State.new':
                                                                                                                                            var $1686 = self.err;
                                                                                                                                            var $1687 = self.nam;
                                                                                                                                            var $1688 = self.ini;
                                                                                                                                            var $1689 = self.idx;
                                                                                                                                            var $1690 = self.str;
                                                                                                                                            var _reply$pst$78 = Parser$State$new$(Parser$Error$maybe_combine$($1677, $1686), $1687, $1688, $1689, $1690);
                                                                                                                                            var $1691 = Parser$Reply$value$(_reply$pst$78, Pair$new$($1638, $1669));
                                                                                                                                            var $1685 = $1691;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1678 = $1685;
                                                                                                                                    break;
                                                                                                                            };
                                                                                                                            var $1676 = $1678;
                                                                                                                            break;
                                                                                                                    };
                                                                                                                    var $1670 = $1676;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $1662 = $1670;
                                                                                                            break;
                                                                                                    };
                                                                                                    var $1660 = $1662;
                                                                                                    break;
                                                                                            };
                                                                                            var $1654 = $1660;
                                                                                            break;
                                                                                    };
                                                                                    var $1647 = $1654;
                                                                                    break;
                                                                            };
                                                                            var $1645 = $1647;
                                                                            break;
                                                                    };
                                                                    var $1639 = $1645;
                                                                    break;
                                                            };
                                                            var $1631 = $1639;
                                                            break;
                                                    };
                                                    var $1629 = $1631;
                                                    break;
                                            };
                                            return $1629;
                                        }), List$cons$((_pst$22 => {
                                            var $1692 = Parser$Reply$value$(_pst$22, Pair$new$("", Litereum$Type$word));
                                            return $1692;
                                        }), List$nil)), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1693 = self.err;
                                                var self = $1627;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1695 = self.value;
                                                        var $1696 = Parser$Reply$error$(Parser$Error$combine$($1695, $1693));
                                                        var $1694 = $1696;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1697 = Parser$Reply$error$($1693);
                                                        var $1694 = $1697;
                                                        break;
                                                };
                                                var $1628 = $1694;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1698 = self.pst;
                                                var $1699 = self.val;
                                                var self = $1698;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1701 = self.err;
                                                        var $1702 = self.nam;
                                                        var $1703 = self.ini;
                                                        var $1704 = self.idx;
                                                        var $1705 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1627, $1701), $1702, $1703, $1704, $1705);
                                                        var self = $1699;
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $1707 = self.fst;
                                                                var $1708 = self.snd;
                                                                var $1709 = (_pst$33 => {
                                                                    var self = _pst$33;
                                                                    switch (self._) {
                                                                        case 'Parser.State.new':
                                                                            var $1711 = self.err;
                                                                            var _reply$39 = Litereum$parse$term$(_world$1)(_pst$33);
                                                                            var self = _reply$39;
                                                                            switch (self._) {
                                                                                case 'Parser.Reply.error':
                                                                                    var $1713 = self.err;
                                                                                    var self = $1711;
                                                                                    switch (self._) {
                                                                                        case 'Maybe.some':
                                                                                            var $1715 = self.value;
                                                                                            var $1716 = Parser$Reply$error$(Parser$Error$combine$($1715, $1713));
                                                                                            var $1714 = $1716;
                                                                                            break;
                                                                                        case 'Maybe.none':
                                                                                            var $1717 = Parser$Reply$error$($1713);
                                                                                            var $1714 = $1717;
                                                                                            break;
                                                                                    };
                                                                                    var $1712 = $1714;
                                                                                    break;
                                                                                case 'Parser.Reply.value':
                                                                                    var $1718 = self.pst;
                                                                                    var $1719 = self.val;
                                                                                    var self = $1718;
                                                                                    switch (self._) {
                                                                                        case 'Parser.State.new':
                                                                                            var $1721 = self.err;
                                                                                            var $1722 = self.nam;
                                                                                            var $1723 = self.ini;
                                                                                            var $1724 = self.idx;
                                                                                            var $1725 = self.str;
                                                                                            var _reply$pst$47 = Parser$State$new$(Parser$Error$maybe_combine$($1711, $1721), $1722, $1723, $1724, $1725);
                                                                                            var self = _reply$pst$47;
                                                                                            switch (self._) {
                                                                                                case 'Parser.State.new':
                                                                                                    var $1727 = self.err;
                                                                                                    var _reply$53 = Parser$maybe$(Litereum$parse$text(";"), _reply$pst$47);
                                                                                                    var self = _reply$53;
                                                                                                    switch (self._) {
                                                                                                        case 'Parser.Reply.error':
                                                                                                            var $1729 = self.err;
                                                                                                            var self = $1727;
                                                                                                            switch (self._) {
                                                                                                                case 'Maybe.some':
                                                                                                                    var $1731 = self.value;
                                                                                                                    var $1732 = Parser$Reply$error$(Parser$Error$combine$($1731, $1729));
                                                                                                                    var $1730 = $1732;
                                                                                                                    break;
                                                                                                                case 'Maybe.none':
                                                                                                                    var $1733 = Parser$Reply$error$($1729);
                                                                                                                    var $1730 = $1733;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $1728 = $1730;
                                                                                                            break;
                                                                                                        case 'Parser.Reply.value':
                                                                                                            var $1734 = self.pst;
                                                                                                            var self = $1734;
                                                                                                            switch (self._) {
                                                                                                                case 'Parser.State.new':
                                                                                                                    var $1736 = self.err;
                                                                                                                    var $1737 = self.nam;
                                                                                                                    var $1738 = self.ini;
                                                                                                                    var $1739 = self.idx;
                                                                                                                    var $1740 = self.str;
                                                                                                                    var _reply$pst$61 = Parser$State$new$(Parser$Error$maybe_combine$($1727, $1736), $1737, $1738, $1739, $1740);
                                                                                                                    var self = _reply$pst$61;
                                                                                                                    switch (self._) {
                                                                                                                        case 'Parser.State.new':
                                                                                                                            var $1742 = self.err;
                                                                                                                            var _reply$67 = Litereum$parse$term$(_world$1)(_reply$pst$61);
                                                                                                                            var self = _reply$67;
                                                                                                                            switch (self._) {
                                                                                                                                case 'Parser.Reply.error':
                                                                                                                                    var $1744 = self.err;
                                                                                                                                    var self = $1742;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Maybe.some':
                                                                                                                                            var $1746 = self.value;
                                                                                                                                            var $1747 = Parser$Reply$error$(Parser$Error$combine$($1746, $1744));
                                                                                                                                            var $1745 = $1747;
                                                                                                                                            break;
                                                                                                                                        case 'Maybe.none':
                                                                                                                                            var $1748 = Parser$Reply$error$($1744);
                                                                                                                                            var $1745 = $1748;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1743 = $1745;
                                                                                                                                    break;
                                                                                                                                case 'Parser.Reply.value':
                                                                                                                                    var $1749 = self.pst;
                                                                                                                                    var $1750 = self.val;
                                                                                                                                    var self = $1749;
                                                                                                                                    switch (self._) {
                                                                                                                                        case 'Parser.State.new':
                                                                                                                                            var $1752 = self.err;
                                                                                                                                            var $1753 = self.nam;
                                                                                                                                            var $1754 = self.ini;
                                                                                                                                            var $1755 = self.idx;
                                                                                                                                            var $1756 = self.str;
                                                                                                                                            var _reply$pst$75 = Parser$State$new$(Parser$Error$maybe_combine$($1742, $1752), $1753, $1754, $1755, $1756);
                                                                                                                                            var $1757 = Parser$Reply$value$(_reply$pst$75, Litereum$Term$run$($1707, $1708, $1719, $1750));
                                                                                                                                            var $1751 = $1757;
                                                                                                                                            break;
                                                                                                                                    };
                                                                                                                                    var $1743 = $1751;
                                                                                                                                    break;
                                                                                                                            };
                                                                                                                            var $1741 = $1743;
                                                                                                                            break;
                                                                                                                    };
                                                                                                                    var $1735 = $1741;
                                                                                                                    break;
                                                                                                            };
                                                                                                            var $1728 = $1735;
                                                                                                            break;
                                                                                                    };
                                                                                                    var $1726 = $1728;
                                                                                                    break;
                                                                                            };
                                                                                            var $1720 = $1726;
                                                                                            break;
                                                                                    };
                                                                                    var $1712 = $1720;
                                                                                    break;
                                                                            };
                                                                            var $1710 = $1712;
                                                                            break;
                                                                    };
                                                                    return $1710;
                                                                });
                                                                var $1706 = $1709;
                                                                break;
                                                        };
                                                        var $1706 = $1706(_reply$pst$30);
                                                        var $1700 = $1706;
                                                        break;
                                                };
                                                var $1628 = $1700;
                                                break;
                                        };
                                        var $1626 = $1628;
                                        break;
                                };
                                var $1620 = $1626;
                                break;
                        };
                        var $1613 = $1620;
                        break;
                };
                var $1611 = $1613;
                break;
        };
        return $1611;
    };
    const Litereum$parse$term$run = x0 => x1 => Litereum$parse$term$run$(x0, x1);

    function Litereum$Term$return$(_expr$1) {
        var $1758 = ({
            _: 'Litereum.Term.return',
            'expr': _expr$1
        });
        return $1758;
    };
    const Litereum$Term$return = x0 => Litereum$Term$return$(x0);

    function Litereum$parse$term$return$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1760 = self.err;
                var _reply$8 = Litereum$parse$text$("return", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1762 = self.err;
                        var self = $1760;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1764 = self.value;
                                var $1765 = Parser$Reply$error$(Parser$Error$combine$($1764, $1762));
                                var $1763 = $1765;
                                break;
                            case 'Maybe.none':
                                var $1766 = Parser$Reply$error$($1762);
                                var $1763 = $1766;
                                break;
                        };
                        var $1761 = $1763;
                        break;
                    case 'Parser.Reply.value':
                        var $1767 = self.pst;
                        var self = $1767;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1769 = self.err;
                                var $1770 = self.nam;
                                var $1771 = self.ini;
                                var $1772 = self.idx;
                                var $1773 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1760, $1769), $1770, $1771, $1772, $1773);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1775 = self.err;
                                        var _reply$22 = Litereum$parse$term$(_world$1)(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1777 = self.err;
                                                var self = $1775;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1779 = self.value;
                                                        var $1780 = Parser$Reply$error$(Parser$Error$combine$($1779, $1777));
                                                        var $1778 = $1780;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1781 = Parser$Reply$error$($1777);
                                                        var $1778 = $1781;
                                                        break;
                                                };
                                                var $1776 = $1778;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1782 = self.pst;
                                                var $1783 = self.val;
                                                var self = $1782;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1785 = self.err;
                                                        var $1786 = self.nam;
                                                        var $1787 = self.ini;
                                                        var $1788 = self.idx;
                                                        var $1789 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1775, $1785), $1786, $1787, $1788, $1789);
                                                        var $1790 = Parser$Reply$value$(_reply$pst$30, Litereum$Term$return$($1783));
                                                        var $1784 = $1790;
                                                        break;
                                                };
                                                var $1776 = $1784;
                                                break;
                                        };
                                        var $1774 = $1776;
                                        break;
                                };
                                var $1768 = $1774;
                                break;
                        };
                        var $1761 = $1768;
                        break;
                };
                var $1759 = $1761;
                break;
        };
        return $1759;
    };
    const Litereum$parse$term$return = x0 => x1 => Litereum$parse$term$return$(x0, x1);

    function Litereum$Term$call$(_bond$1, _args$2) {
        var $1791 = ({
            _: 'Litereum.Term.call',
            'bond': _bond$1,
            'args': _args$2
        });
        return $1791;
    };
    const Litereum$Term$call = x0 => x1 => Litereum$Term$call$(x0, x1);

    function Litereum$parse$term$call$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1793 = self.err;
                var _reply$8 = Litereum$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1795 = self.err;
                        var self = $1793;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1797 = self.value;
                                var $1798 = Parser$Reply$error$(Parser$Error$combine$($1797, $1795));
                                var $1796 = $1798;
                                break;
                            case 'Maybe.none':
                                var $1799 = Parser$Reply$error$($1795);
                                var $1796 = $1799;
                                break;
                        };
                        var $1794 = $1796;
                        break;
                    case 'Parser.Reply.value':
                        var $1800 = self.pst;
                        var $1801 = self.val;
                        var self = $1800;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1803 = self.err;
                                var $1804 = self.nam;
                                var $1805 = self.ini;
                                var $1806 = self.idx;
                                var $1807 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1793, $1803), $1804, $1805, $1806, $1807);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1809 = self.err;
                                        var _reply$22 = Parser$wrap$(Litereum$parse$text("("), (_pst$22 => {
                                            var self = _pst$22;
                                            switch (self._) {
                                                case 'Parser.State.new':
                                                    var $1812 = self.err;
                                                    var _reply$28 = Parser$maybe$(Litereum$parse$text(","), _pst$22);
                                                    var self = _reply$28;
                                                    switch (self._) {
                                                        case 'Parser.Reply.error':
                                                            var $1814 = self.err;
                                                            var self = $1812;
                                                            switch (self._) {
                                                                case 'Maybe.some':
                                                                    var $1816 = self.value;
                                                                    var $1817 = Parser$Reply$error$(Parser$Error$combine$($1816, $1814));
                                                                    var $1815 = $1817;
                                                                    break;
                                                                case 'Maybe.none':
                                                                    var $1818 = Parser$Reply$error$($1814);
                                                                    var $1815 = $1818;
                                                                    break;
                                                            };
                                                            var $1813 = $1815;
                                                            break;
                                                        case 'Parser.Reply.value':
                                                            var $1819 = self.pst;
                                                            var self = $1819;
                                                            switch (self._) {
                                                                case 'Parser.State.new':
                                                                    var $1821 = self.err;
                                                                    var $1822 = self.nam;
                                                                    var $1823 = self.ini;
                                                                    var $1824 = self.idx;
                                                                    var $1825 = self.str;
                                                                    var _reply$pst$36 = Parser$State$new$(Parser$Error$maybe_combine$($1812, $1821), $1822, $1823, $1824, $1825);
                                                                    var $1826 = Litereum$parse$term$(_world$1)(_reply$pst$36);
                                                                    var $1820 = $1826;
                                                                    break;
                                                            };
                                                            var $1813 = $1820;
                                                            break;
                                                    };
                                                    var $1811 = $1813;
                                                    break;
                                            };
                                            return $1811;
                                        }), Litereum$parse$text(")"), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1827 = self.err;
                                                var self = $1809;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1829 = self.value;
                                                        var $1830 = Parser$Reply$error$(Parser$Error$combine$($1829, $1827));
                                                        var $1828 = $1830;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1831 = Parser$Reply$error$($1827);
                                                        var $1828 = $1831;
                                                        break;
                                                };
                                                var $1810 = $1828;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1832 = self.pst;
                                                var $1833 = self.val;
                                                var self = $1832;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1835 = self.err;
                                                        var $1836 = self.nam;
                                                        var $1837 = self.ini;
                                                        var $1838 = self.idx;
                                                        var $1839 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1809, $1835), $1836, $1837, $1838, $1839);
                                                        var $1840 = Parser$Reply$value$(_reply$pst$30, Litereum$Term$call$($1801, $1833));
                                                        var $1834 = $1840;
                                                        break;
                                                };
                                                var $1810 = $1834;
                                                break;
                                        };
                                        var $1808 = $1810;
                                        break;
                                };
                                var $1802 = $1808;
                                break;
                        };
                        var $1794 = $1802;
                        break;
                };
                var $1792 = $1794;
                break;
        };
        return $1792;
    };
    const Litereum$parse$term$call = x0 => x1 => Litereum$parse$term$call$(x0, x1);

    function Litereum$Term$var$(_name$1) {
        var $1841 = ({
            _: 'Litereum.Term.var',
            'name': _name$1
        });
        return $1841;
    };
    const Litereum$Term$var = x0 => Litereum$Term$var$(x0);

    function Litereum$parse$term$var$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1843 = self.err;
                var _reply$8 = Litereum$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1845 = self.err;
                        var self = $1843;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1847 = self.value;
                                var $1848 = Parser$Reply$error$(Parser$Error$combine$($1847, $1845));
                                var $1846 = $1848;
                                break;
                            case 'Maybe.none':
                                var $1849 = Parser$Reply$error$($1845);
                                var $1846 = $1849;
                                break;
                        };
                        var $1844 = $1846;
                        break;
                    case 'Parser.Reply.value':
                        var $1850 = self.pst;
                        var $1851 = self.val;
                        var self = $1850;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1853 = self.err;
                                var $1854 = self.nam;
                                var $1855 = self.ini;
                                var $1856 = self.idx;
                                var $1857 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1843, $1853), $1854, $1855, $1856, $1857);
                                var $1858 = Parser$Reply$value$(_reply$pst$16, Litereum$Term$var$($1851));
                                var $1852 = $1858;
                                break;
                        };
                        var $1844 = $1852;
                        break;
                };
                var $1842 = $1844;
                break;
        };
        return $1842;
    };
    const Litereum$parse$term$var = x0 => x1 => Litereum$parse$term$var$(x0, x1);

    function Litereum$parse$term$(_world$1) {
        var $1859 = Parser$choice(List$cons$(Litereum$parse$term$let(_world$1), List$cons$(Litereum$parse$term$create(_world$1), List$cons$(Litereum$parse$term$match(_world$1), List$cons$(Litereum$parse$term$word(_world$1), List$cons$(Litereum$parse$term$compare(_world$1), List$cons$(Litereum$parse$term$operate(_world$1), List$cons$(Litereum$parse$term$bind(_world$1), List$cons$(Litereum$parse$term$run(_world$1), List$cons$(Litereum$parse$term$return(_world$1), List$cons$(Litereum$parse$term$call(_world$1), List$cons$(Litereum$parse$term$var(_world$1), List$nil))))))))))));
        return $1859;
    };
    const Litereum$parse$term = x0 => Litereum$parse$term$(x0);

    function Litereum$Bond$new$(_name$1, _input_names$2, _input_types$3, _output_type$4, _main$5, _owners$6) {
        var $1860 = ({
            _: 'Litereum.Bond.new',
            'name': _name$1,
            'input_names': _input_names$2,
            'input_types': _input_types$3,
            'output_type': _output_type$4,
            'main': _main$5,
            'owners': _owners$6
        });
        return $1860;
    };
    const Litereum$Bond$new = x0 => x1 => x2 => x3 => x4 => x5 => Litereum$Bond$new$(x0, x1, x2, x3, x4, x5);

    function Litereum$parse$bond$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $1862 = self.err;
                var _reply$8 = Litereum$parse$name$(_pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $1864 = self.err;
                        var self = $1862;
                        switch (self._) {
                            case 'Maybe.some':
                                var $1866 = self.value;
                                var $1867 = Parser$Reply$error$(Parser$Error$combine$($1866, $1864));
                                var $1865 = $1867;
                                break;
                            case 'Maybe.none':
                                var $1868 = Parser$Reply$error$($1864);
                                var $1865 = $1868;
                                break;
                        };
                        var $1863 = $1865;
                        break;
                    case 'Parser.Reply.value':
                        var $1869 = self.pst;
                        var $1870 = self.val;
                        var self = $1869;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $1872 = self.err;
                                var $1873 = self.nam;
                                var $1874 = self.ini;
                                var $1875 = self.idx;
                                var $1876 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($1862, $1872), $1873, $1874, $1875, $1876);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $1878 = self.err;
                                        var _reply$22 = Parser$wrap$(Litereum$parse$text("("), Litereum$parse$ann(_world$1), Litereum$parse$text(")"), _reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $1880 = self.err;
                                                var self = $1878;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $1882 = self.value;
                                                        var $1883 = Parser$Reply$error$(Parser$Error$combine$($1882, $1880));
                                                        var $1881 = $1883;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $1884 = Parser$Reply$error$($1880);
                                                        var $1881 = $1884;
                                                        break;
                                                };
                                                var $1879 = $1881;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $1885 = self.pst;
                                                var $1886 = self.val;
                                                var self = $1885;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $1888 = self.err;
                                                        var $1889 = self.nam;
                                                        var $1890 = self.ini;
                                                        var $1891 = self.idx;
                                                        var $1892 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($1878, $1888), $1889, $1890, $1891, $1892);
                                                        var _iarg$31 = List$mapped$($1886, (_x$31 => {
                                                            var self = _x$31;
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $1895 = self.fst;
                                                                    var $1896 = $1895;
                                                                    var $1894 = $1896;
                                                                    break;
                                                            };
                                                            return $1894;
                                                        }));
                                                        var _ityp$32 = List$mapped$($1886, (_x$32 => {
                                                            var self = _x$32;
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $1898 = self.snd;
                                                                    var $1899 = $1898;
                                                                    var $1897 = $1899;
                                                                    break;
                                                            };
                                                            return $1897;
                                                        }));
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $1900 = self.err;
                                                                var _reply$38 = Litereum$parse$text$(":", _reply$pst$30);
                                                                var self = _reply$38;
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
                                                                                var _reply$pst$46 = Parser$State$new$(Parser$Error$maybe_combine$($1900, $1909), $1910, $1911, $1912, $1913);
                                                                                var self = _reply$pst$46;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $1915 = self.err;
                                                                                        var _reply$52 = Litereum$parse$type$(_world$1)(_reply$pst$46);
                                                                                        var self = _reply$52;
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
                                                                                                        var _reply$pst$60 = Parser$State$new$(Parser$Error$maybe_combine$($1915, $1925), $1926, $1927, $1928, $1929);
                                                                                                        var self = _reply$pst$60;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $1931 = self.err;
                                                                                                                var _reply$66 = Litereum$parse$text$("{", _reply$pst$60);
                                                                                                                var self = _reply$66;
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $1933 = self.err;
                                                                                                                        var self = $1931;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Maybe.some':
                                                                                                                                var $1935 = self.value;
                                                                                                                                var $1936 = Parser$Reply$error$(Parser$Error$combine$($1935, $1933));
                                                                                                                                var $1934 = $1936;
                                                                                                                                break;
                                                                                                                            case 'Maybe.none':
                                                                                                                                var $1937 = Parser$Reply$error$($1933);
                                                                                                                                var $1934 = $1937;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1932 = $1934;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $1938 = self.pst;
                                                                                                                        var self = $1938;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $1940 = self.err;
                                                                                                                                var $1941 = self.nam;
                                                                                                                                var $1942 = self.ini;
                                                                                                                                var $1943 = self.idx;
                                                                                                                                var $1944 = self.str;
                                                                                                                                var _reply$pst$74 = Parser$State$new$(Parser$Error$maybe_combine$($1931, $1940), $1941, $1942, $1943, $1944);
                                                                                                                                var self = _reply$pst$74;
                                                                                                                                switch (self._) {
                                                                                                                                    case 'Parser.State.new':
                                                                                                                                        var $1946 = self.err;
                                                                                                                                        var _reply$80 = Litereum$parse$term$(_world$1)(_reply$pst$74);
                                                                                                                                        var self = _reply$80;
                                                                                                                                        switch (self._) {
                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                var $1948 = self.err;
                                                                                                                                                var self = $1946;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                        var $1950 = self.value;
                                                                                                                                                        var $1951 = Parser$Reply$error$(Parser$Error$combine$($1950, $1948));
                                                                                                                                                        var $1949 = $1951;
                                                                                                                                                        break;
                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                        var $1952 = Parser$Reply$error$($1948);
                                                                                                                                                        var $1949 = $1952;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1947 = $1949;
                                                                                                                                                break;
                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                var $1953 = self.pst;
                                                                                                                                                var $1954 = self.val;
                                                                                                                                                var self = $1953;
                                                                                                                                                switch (self._) {
                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                        var $1956 = self.err;
                                                                                                                                                        var $1957 = self.nam;
                                                                                                                                                        var $1958 = self.ini;
                                                                                                                                                        var $1959 = self.idx;
                                                                                                                                                        var $1960 = self.str;
                                                                                                                                                        var _reply$pst$88 = Parser$State$new$(Parser$Error$maybe_combine$($1946, $1956), $1957, $1958, $1959, $1960);
                                                                                                                                                        var self = _reply$pst$88;
                                                                                                                                                        switch (self._) {
                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                var $1962 = self.err;
                                                                                                                                                                var _reply$94 = Litereum$parse$text$("}", _reply$pst$88);
                                                                                                                                                                var self = _reply$94;
                                                                                                                                                                switch (self._) {
                                                                                                                                                                    case 'Parser.Reply.error':
                                                                                                                                                                        var $1964 = self.err;
                                                                                                                                                                        var self = $1962;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Maybe.some':
                                                                                                                                                                                var $1966 = self.value;
                                                                                                                                                                                var $1967 = Parser$Reply$error$(Parser$Error$combine$($1966, $1964));
                                                                                                                                                                                var $1965 = $1967;
                                                                                                                                                                                break;
                                                                                                                                                                            case 'Maybe.none':
                                                                                                                                                                                var $1968 = Parser$Reply$error$($1964);
                                                                                                                                                                                var $1965 = $1968;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $1963 = $1965;
                                                                                                                                                                        break;
                                                                                                                                                                    case 'Parser.Reply.value':
                                                                                                                                                                        var $1969 = self.pst;
                                                                                                                                                                        var self = $1969;
                                                                                                                                                                        switch (self._) {
                                                                                                                                                                            case 'Parser.State.new':
                                                                                                                                                                                var $1971 = self.err;
                                                                                                                                                                                var $1972 = self.nam;
                                                                                                                                                                                var $1973 = self.ini;
                                                                                                                                                                                var $1974 = self.idx;
                                                                                                                                                                                var $1975 = self.str;
                                                                                                                                                                                var _reply$pst$102 = Parser$State$new$(Parser$Error$maybe_combine$($1962, $1971), $1972, $1973, $1974, $1975);
                                                                                                                                                                                var self = _reply$pst$102;
                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                        var $1977 = self.err;
                                                                                                                                                                                        var _reply$108 = Parser$many$((_pst$108 => {
                                                                                                                                                                                            var self = _pst$108;
                                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                                                                    var $1980 = self.err;
                                                                                                                                                                                                    var _reply$114 = Litereum$parse$text$("@", _pst$108);
                                                                                                                                                                                                    var self = _reply$114;
                                                                                                                                                                                                    switch (self._) {
                                                                                                                                                                                                        case 'Parser.Reply.error':
                                                                                                                                                                                                            var $1982 = self.err;
                                                                                                                                                                                                            var self = $1980;
                                                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                                                case 'Maybe.some':
                                                                                                                                                                                                                    var $1984 = self.value;
                                                                                                                                                                                                                    var $1985 = Parser$Reply$error$(Parser$Error$combine$($1984, $1982));
                                                                                                                                                                                                                    var $1983 = $1985;
                                                                                                                                                                                                                    break;
                                                                                                                                                                                                                case 'Maybe.none':
                                                                                                                                                                                                                    var $1986 = Parser$Reply$error$($1982);
                                                                                                                                                                                                                    var $1983 = $1986;
                                                                                                                                                                                                                    break;
                                                                                                                                                                                                            };
                                                                                                                                                                                                            var $1981 = $1983;
                                                                                                                                                                                                            break;
                                                                                                                                                                                                        case 'Parser.Reply.value':
                                                                                                                                                                                                            var $1987 = self.pst;
                                                                                                                                                                                                            var self = $1987;
                                                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                                                case 'Parser.State.new':
                                                                                                                                                                                                                    var $1989 = self.err;
                                                                                                                                                                                                                    var $1990 = self.nam;
                                                                                                                                                                                                                    var $1991 = self.ini;
                                                                                                                                                                                                                    var $1992 = self.idx;
                                                                                                                                                                                                                    var $1993 = self.str;
                                                                                                                                                                                                                    var _reply$pst$122 = Parser$State$new$(Parser$Error$maybe_combine$($1980, $1989), $1990, $1991, $1992, $1993);
                                                                                                                                                                                                                    var self = _reply$pst$122;
                                                                                                                                                                                                                    switch (self._) {
                                                                                                                                                                                                                        case 'Parser.State.new':
                                                                                                                                                                                                                            var $1995 = self.err;
                                                                                                                                                                                                                            var _reply$128 = Litereum$parse$name$(_reply$pst$122);
                                                                                                                                                                                                                            var self = _reply$128;
                                                                                                                                                                                                                            switch (self._) {
                                                                                                                                                                                                                                case 'Parser.Reply.error':
                                                                                                                                                                                                                                    var $1997 = self.err;
                                                                                                                                                                                                                                    var self = $1995;
                                                                                                                                                                                                                                    switch (self._) {
                                                                                                                                                                                                                                        case 'Maybe.some':
                                                                                                                                                                                                                                            var $1999 = self.value;
                                                                                                                                                                                                                                            var $2000 = Parser$Reply$error$(Parser$Error$combine$($1999, $1997));
                                                                                                                                                                                                                                            var $1998 = $2000;
                                                                                                                                                                                                                                            break;
                                                                                                                                                                                                                                        case 'Maybe.none':
                                                                                                                                                                                                                                            var $2001 = Parser$Reply$error$($1997);
                                                                                                                                                                                                                                            var $1998 = $2001;
                                                                                                                                                                                                                                            break;
                                                                                                                                                                                                                                    };
                                                                                                                                                                                                                                    var $1996 = $1998;
                                                                                                                                                                                                                                    break;
                                                                                                                                                                                                                                case 'Parser.Reply.value':
                                                                                                                                                                                                                                    var $2002 = self.pst;
                                                                                                                                                                                                                                    var $2003 = self.val;
                                                                                                                                                                                                                                    var self = $2002;
                                                                                                                                                                                                                                    switch (self._) {
                                                                                                                                                                                                                                        case 'Parser.State.new':
                                                                                                                                                                                                                                            var $2005 = self.err;
                                                                                                                                                                                                                                            var $2006 = self.nam;
                                                                                                                                                                                                                                            var $2007 = self.ini;
                                                                                                                                                                                                                                            var $2008 = self.idx;
                                                                                                                                                                                                                                            var $2009 = self.str;
                                                                                                                                                                                                                                            var _reply$pst$136 = Parser$State$new$(Parser$Error$maybe_combine$($1995, $2005), $2006, $2007, $2008, $2009);
                                                                                                                                                                                                                                            var $2010 = Parser$Reply$value$(_reply$pst$136, $2003);
                                                                                                                                                                                                                                            var $2004 = $2010;
                                                                                                                                                                                                                                            break;
                                                                                                                                                                                                                                    };
                                                                                                                                                                                                                                    var $1996 = $2004;
                                                                                                                                                                                                                                    break;
                                                                                                                                                                                                                            };
                                                                                                                                                                                                                            var $1994 = $1996;
                                                                                                                                                                                                                            break;
                                                                                                                                                                                                                    };
                                                                                                                                                                                                                    var $1988 = $1994;
                                                                                                                                                                                                                    break;
                                                                                                                                                                                                            };
                                                                                                                                                                                                            var $1981 = $1988;
                                                                                                                                                                                                            break;
                                                                                                                                                                                                    };
                                                                                                                                                                                                    var $1979 = $1981;
                                                                                                                                                                                                    break;
                                                                                                                                                                                            };
                                                                                                                                                                                            return $1979;
                                                                                                                                                                                        }))(_reply$pst$102);
                                                                                                                                                                                        var self = _reply$108;
                                                                                                                                                                                        switch (self._) {
                                                                                                                                                                                            case 'Parser.Reply.error':
                                                                                                                                                                                                var $2011 = self.err;
                                                                                                                                                                                                var self = $1977;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Maybe.some':
                                                                                                                                                                                                        var $2013 = self.value;
                                                                                                                                                                                                        var $2014 = Parser$Reply$error$(Parser$Error$combine$($2013, $2011));
                                                                                                                                                                                                        var $2012 = $2014;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                    case 'Maybe.none':
                                                                                                                                                                                                        var $2015 = Parser$Reply$error$($2011);
                                                                                                                                                                                                        var $2012 = $2015;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $1978 = $2012;
                                                                                                                                                                                                break;
                                                                                                                                                                                            case 'Parser.Reply.value':
                                                                                                                                                                                                var $2016 = self.pst;
                                                                                                                                                                                                var $2017 = self.val;
                                                                                                                                                                                                var self = $2016;
                                                                                                                                                                                                switch (self._) {
                                                                                                                                                                                                    case 'Parser.State.new':
                                                                                                                                                                                                        var $2019 = self.err;
                                                                                                                                                                                                        var $2020 = self.nam;
                                                                                                                                                                                                        var $2021 = self.ini;
                                                                                                                                                                                                        var $2022 = self.idx;
                                                                                                                                                                                                        var $2023 = self.str;
                                                                                                                                                                                                        var _reply$pst$116 = Parser$State$new$(Parser$Error$maybe_combine$($1977, $2019), $2020, $2021, $2022, $2023);
                                                                                                                                                                                                        var $2024 = Parser$Reply$value$(_reply$pst$116, Litereum$Bond$new$($1870, _iarg$31, _ityp$32, $1923, $1954, $2017));
                                                                                                                                                                                                        var $2018 = $2024;
                                                                                                                                                                                                        break;
                                                                                                                                                                                                };
                                                                                                                                                                                                var $1978 = $2018;
                                                                                                                                                                                                break;
                                                                                                                                                                                        };
                                                                                                                                                                                        var $1976 = $1978;
                                                                                                                                                                                        break;
                                                                                                                                                                                };
                                                                                                                                                                                var $1970 = $1976;
                                                                                                                                                                                break;
                                                                                                                                                                        };
                                                                                                                                                                        var $1963 = $1970;
                                                                                                                                                                        break;
                                                                                                                                                                };
                                                                                                                                                                var $1961 = $1963;
                                                                                                                                                                break;
                                                                                                                                                        };
                                                                                                                                                        var $1955 = $1961;
                                                                                                                                                        break;
                                                                                                                                                };
                                                                                                                                                var $1947 = $1955;
                                                                                                                                                break;
                                                                                                                                        };
                                                                                                                                        var $1945 = $1947;
                                                                                                                                        break;
                                                                                                                                };
                                                                                                                                var $1939 = $1945;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $1932 = $1939;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $1930 = $1932;
                                                                                                                break;
                                                                                                        };
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
                                                                var $1893 = $1901;
                                                                break;
                                                        };
                                                        var $1887 = $1893;
                                                        break;
                                                };
                                                var $1879 = $1887;
                                                break;
                                        };
                                        var $1877 = $1879;
                                        break;
                                };
                                var $1871 = $1877;
                                break;
                        };
                        var $1863 = $1871;
                        break;
                };
                var $1861 = $1863;
                break;
        };
        return $1861;
    };
    const Litereum$parse$bond = x0 => x1 => Litereum$parse$bond$(x0, x1);

    function Litereum$Transaction$new_bond$(_bond$1) {
        var $2025 = ({
            _: 'Litereum.Transaction.new_bond',
            'bond': _bond$1
        });
        return $2025;
    };
    const Litereum$Transaction$new_bond = x0 => Litereum$Transaction$new_bond$(x0);

    function Litereum$Eval$new$(_term$1, _type$2) {
        var $2026 = ({
            _: 'Litereum.Eval.new',
            'term': _term$1,
            'type': _type$2
        });
        return $2026;
    };
    const Litereum$Eval$new = x0 => x1 => Litereum$Eval$new$(x0, x1);

    function Litereum$parse$eval$(_world$1, _pst$2) {
        var self = _pst$2;
        switch (self._) {
            case 'Parser.State.new':
                var $2028 = self.err;
                var _reply$8 = Litereum$parse$text$("{", _pst$2);
                var self = _reply$8;
                switch (self._) {
                    case 'Parser.Reply.error':
                        var $2030 = self.err;
                        var self = $2028;
                        switch (self._) {
                            case 'Maybe.some':
                                var $2032 = self.value;
                                var $2033 = Parser$Reply$error$(Parser$Error$combine$($2032, $2030));
                                var $2031 = $2033;
                                break;
                            case 'Maybe.none':
                                var $2034 = Parser$Reply$error$($2030);
                                var $2031 = $2034;
                                break;
                        };
                        var $2029 = $2031;
                        break;
                    case 'Parser.Reply.value':
                        var $2035 = self.pst;
                        var self = $2035;
                        switch (self._) {
                            case 'Parser.State.new':
                                var $2037 = self.err;
                                var $2038 = self.nam;
                                var $2039 = self.ini;
                                var $2040 = self.idx;
                                var $2041 = self.str;
                                var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2028, $2037), $2038, $2039, $2040, $2041);
                                var self = _reply$pst$16;
                                switch (self._) {
                                    case 'Parser.State.new':
                                        var $2043 = self.err;
                                        var _reply$22 = Litereum$parse$term$(_world$1)(_reply$pst$16);
                                        var self = _reply$22;
                                        switch (self._) {
                                            case 'Parser.Reply.error':
                                                var $2045 = self.err;
                                                var self = $2043;
                                                switch (self._) {
                                                    case 'Maybe.some':
                                                        var $2047 = self.value;
                                                        var $2048 = Parser$Reply$error$(Parser$Error$combine$($2047, $2045));
                                                        var $2046 = $2048;
                                                        break;
                                                    case 'Maybe.none':
                                                        var $2049 = Parser$Reply$error$($2045);
                                                        var $2046 = $2049;
                                                        break;
                                                };
                                                var $2044 = $2046;
                                                break;
                                            case 'Parser.Reply.value':
                                                var $2050 = self.pst;
                                                var $2051 = self.val;
                                                var self = $2050;
                                                switch (self._) {
                                                    case 'Parser.State.new':
                                                        var $2053 = self.err;
                                                        var $2054 = self.nam;
                                                        var $2055 = self.ini;
                                                        var $2056 = self.idx;
                                                        var $2057 = self.str;
                                                        var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2043, $2053), $2054, $2055, $2056, $2057);
                                                        var self = _reply$pst$30;
                                                        switch (self._) {
                                                            case 'Parser.State.new':
                                                                var $2059 = self.err;
                                                                var _reply$36 = Litereum$parse$text$("}", _reply$pst$30);
                                                                var self = _reply$36;
                                                                switch (self._) {
                                                                    case 'Parser.Reply.error':
                                                                        var $2061 = self.err;
                                                                        var self = $2059;
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $2063 = self.value;
                                                                                var $2064 = Parser$Reply$error$(Parser$Error$combine$($2063, $2061));
                                                                                var $2062 = $2064;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $2065 = Parser$Reply$error$($2061);
                                                                                var $2062 = $2065;
                                                                                break;
                                                                        };
                                                                        var $2060 = $2062;
                                                                        break;
                                                                    case 'Parser.Reply.value':
                                                                        var $2066 = self.pst;
                                                                        var self = $2066;
                                                                        switch (self._) {
                                                                            case 'Parser.State.new':
                                                                                var $2068 = self.err;
                                                                                var $2069 = self.nam;
                                                                                var $2070 = self.ini;
                                                                                var $2071 = self.idx;
                                                                                var $2072 = self.str;
                                                                                var _reply$pst$44 = Parser$State$new$(Parser$Error$maybe_combine$($2059, $2068), $2069, $2070, $2071, $2072);
                                                                                var self = _reply$pst$44;
                                                                                switch (self._) {
                                                                                    case 'Parser.State.new':
                                                                                        var $2074 = self.err;
                                                                                        var _reply$50 = Litereum$parse$text$(":", _reply$pst$44);
                                                                                        var self = _reply$50;
                                                                                        switch (self._) {
                                                                                            case 'Parser.Reply.error':
                                                                                                var $2076 = self.err;
                                                                                                var self = $2074;
                                                                                                switch (self._) {
                                                                                                    case 'Maybe.some':
                                                                                                        var $2078 = self.value;
                                                                                                        var $2079 = Parser$Reply$error$(Parser$Error$combine$($2078, $2076));
                                                                                                        var $2077 = $2079;
                                                                                                        break;
                                                                                                    case 'Maybe.none':
                                                                                                        var $2080 = Parser$Reply$error$($2076);
                                                                                                        var $2077 = $2080;
                                                                                                        break;
                                                                                                };
                                                                                                var $2075 = $2077;
                                                                                                break;
                                                                                            case 'Parser.Reply.value':
                                                                                                var $2081 = self.pst;
                                                                                                var self = $2081;
                                                                                                switch (self._) {
                                                                                                    case 'Parser.State.new':
                                                                                                        var $2083 = self.err;
                                                                                                        var $2084 = self.nam;
                                                                                                        var $2085 = self.ini;
                                                                                                        var $2086 = self.idx;
                                                                                                        var $2087 = self.str;
                                                                                                        var _reply$pst$58 = Parser$State$new$(Parser$Error$maybe_combine$($2074, $2083), $2084, $2085, $2086, $2087);
                                                                                                        var self = _reply$pst$58;
                                                                                                        switch (self._) {
                                                                                                            case 'Parser.State.new':
                                                                                                                var $2089 = self.err;
                                                                                                                var _reply$64 = Litereum$parse$type$(_world$1)(_reply$pst$58);
                                                                                                                var self = _reply$64;
                                                                                                                switch (self._) {
                                                                                                                    case 'Parser.Reply.error':
                                                                                                                        var $2091 = self.err;
                                                                                                                        var self = $2089;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Maybe.some':
                                                                                                                                var $2093 = self.value;
                                                                                                                                var $2094 = Parser$Reply$error$(Parser$Error$combine$($2093, $2091));
                                                                                                                                var $2092 = $2094;
                                                                                                                                break;
                                                                                                                            case 'Maybe.none':
                                                                                                                                var $2095 = Parser$Reply$error$($2091);
                                                                                                                                var $2092 = $2095;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $2090 = $2092;
                                                                                                                        break;
                                                                                                                    case 'Parser.Reply.value':
                                                                                                                        var $2096 = self.pst;
                                                                                                                        var $2097 = self.val;
                                                                                                                        var self = $2096;
                                                                                                                        switch (self._) {
                                                                                                                            case 'Parser.State.new':
                                                                                                                                var $2099 = self.err;
                                                                                                                                var $2100 = self.nam;
                                                                                                                                var $2101 = self.ini;
                                                                                                                                var $2102 = self.idx;
                                                                                                                                var $2103 = self.str;
                                                                                                                                var _reply$pst$72 = Parser$State$new$(Parser$Error$maybe_combine$($2089, $2099), $2100, $2101, $2102, $2103);
                                                                                                                                var $2104 = Parser$Reply$value$(_reply$pst$72, Litereum$Eval$new$($2051, $2097));
                                                                                                                                var $2098 = $2104;
                                                                                                                                break;
                                                                                                                        };
                                                                                                                        var $2090 = $2098;
                                                                                                                        break;
                                                                                                                };
                                                                                                                var $2088 = $2090;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $2082 = $2088;
                                                                                                        break;
                                                                                                };
                                                                                                var $2075 = $2082;
                                                                                                break;
                                                                                        };
                                                                                        var $2073 = $2075;
                                                                                        break;
                                                                                };
                                                                                var $2067 = $2073;
                                                                                break;
                                                                        };
                                                                        var $2060 = $2067;
                                                                        break;
                                                                };
                                                                var $2058 = $2060;
                                                                break;
                                                        };
                                                        var $2052 = $2058;
                                                        break;
                                                };
                                                var $2044 = $2052;
                                                break;
                                        };
                                        var $2042 = $2044;
                                        break;
                                };
                                var $2036 = $2042;
                                break;
                        };
                        var $2029 = $2036;
                        break;
                };
                var $2027 = $2029;
                break;
        };
        return $2027;
    };
    const Litereum$parse$eval = x0 => x1 => Litereum$parse$eval$(x0, x1);

    function Litereum$Transaction$new_eval$(_eval$1) {
        var $2105 = ({
            _: 'Litereum.Transaction.new_eval',
            'eval': _eval$1
        });
        return $2105;
    };
    const Litereum$Transaction$new_eval = x0 => Litereum$Transaction$new_eval$(x0);

    function Litereum$parse$transaction$(_world$1) {
        var $2106 = Parser$choice(List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2108 = self.err;
                    var _reply$8 = Litereum$parse$text$("name", _pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2110 = self.err;
                            var self = $2108;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2112 = self.value;
                                    var $2113 = Parser$Reply$error$(Parser$Error$combine$($2112, $2110));
                                    var $2111 = $2113;
                                    break;
                                case 'Maybe.none':
                                    var $2114 = Parser$Reply$error$($2110);
                                    var $2111 = $2114;
                                    break;
                            };
                            var $2109 = $2111;
                            break;
                        case 'Parser.Reply.value':
                            var $2115 = self.pst;
                            var self = $2115;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2117 = self.err;
                                    var $2118 = self.nam;
                                    var $2119 = self.ini;
                                    var $2120 = self.idx;
                                    var $2121 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2108, $2117), $2118, $2119, $2120, $2121);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $2123 = self.err;
                                            var _reply$22 = Litereum$parse$name$(_reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2125 = self.err;
                                                    var self = $2123;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $2127 = self.value;
                                                            var $2128 = Parser$Reply$error$(Parser$Error$combine$($2127, $2125));
                                                            var $2126 = $2128;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $2129 = Parser$Reply$error$($2125);
                                                            var $2126 = $2129;
                                                            break;
                                                    };
                                                    var $2124 = $2126;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2130 = self.pst;
                                                    var $2131 = self.val;
                                                    var self = $2130;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $2133 = self.err;
                                                            var $2134 = self.nam;
                                                            var $2135 = self.ini;
                                                            var $2136 = self.idx;
                                                            var $2137 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2123, $2133), $2134, $2135, $2136, $2137);
                                                            var $2138 = Parser$Reply$value$(_reply$pst$30, Litereum$Transaction$new_name$($2131));
                                                            var $2132 = $2138;
                                                            break;
                                                    };
                                                    var $2124 = $2132;
                                                    break;
                                            };
                                            var $2122 = $2124;
                                            break;
                                    };
                                    var $2116 = $2122;
                                    break;
                            };
                            var $2109 = $2116;
                            break;
                    };
                    var $2107 = $2109;
                    break;
            };
            return $2107;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2140 = self.err;
                    var _reply$8 = Litereum$parse$text$("type", _pst$2);
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
                            var self = $2147;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2149 = self.err;
                                    var $2150 = self.nam;
                                    var $2151 = self.ini;
                                    var $2152 = self.idx;
                                    var $2153 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2140, $2149), $2150, $2151, $2152, $2153);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $2155 = self.err;
                                            var _reply$22 = Litereum$parse$data$(_world$1, _reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2157 = self.err;
                                                    var self = $2155;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $2159 = self.value;
                                                            var $2160 = Parser$Reply$error$(Parser$Error$combine$($2159, $2157));
                                                            var $2158 = $2160;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $2161 = Parser$Reply$error$($2157);
                                                            var $2158 = $2161;
                                                            break;
                                                    };
                                                    var $2156 = $2158;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2162 = self.pst;
                                                    var $2163 = self.val;
                                                    var self = $2162;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $2165 = self.err;
                                                            var $2166 = self.nam;
                                                            var $2167 = self.ini;
                                                            var $2168 = self.idx;
                                                            var $2169 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2155, $2165), $2166, $2167, $2168, $2169);
                                                            var $2170 = Parser$Reply$value$(_reply$pst$30, Litereum$Transaction$new_data$($2163));
                                                            var $2164 = $2170;
                                                            break;
                                                    };
                                                    var $2156 = $2164;
                                                    break;
                                            };
                                            var $2154 = $2156;
                                            break;
                                    };
                                    var $2148 = $2154;
                                    break;
                            };
                            var $2141 = $2148;
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
                    var $2172 = self.err;
                    var _reply$8 = Litereum$parse$text$("bond", _pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2174 = self.err;
                            var self = $2172;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2176 = self.value;
                                    var $2177 = Parser$Reply$error$(Parser$Error$combine$($2176, $2174));
                                    var $2175 = $2177;
                                    break;
                                case 'Maybe.none':
                                    var $2178 = Parser$Reply$error$($2174);
                                    var $2175 = $2178;
                                    break;
                            };
                            var $2173 = $2175;
                            break;
                        case 'Parser.Reply.value':
                            var $2179 = self.pst;
                            var self = $2179;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2181 = self.err;
                                    var $2182 = self.nam;
                                    var $2183 = self.ini;
                                    var $2184 = self.idx;
                                    var $2185 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2172, $2181), $2182, $2183, $2184, $2185);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $2187 = self.err;
                                            var _reply$22 = Litereum$parse$bond$(_world$1, _reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2189 = self.err;
                                                    var self = $2187;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $2191 = self.value;
                                                            var $2192 = Parser$Reply$error$(Parser$Error$combine$($2191, $2189));
                                                            var $2190 = $2192;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $2193 = Parser$Reply$error$($2189);
                                                            var $2190 = $2193;
                                                            break;
                                                    };
                                                    var $2188 = $2190;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2194 = self.pst;
                                                    var $2195 = self.val;
                                                    var self = $2194;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $2197 = self.err;
                                                            var $2198 = self.nam;
                                                            var $2199 = self.ini;
                                                            var $2200 = self.idx;
                                                            var $2201 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2187, $2197), $2198, $2199, $2200, $2201);
                                                            var $2202 = Parser$Reply$value$(_reply$pst$30, Litereum$Transaction$new_bond$($2195));
                                                            var $2196 = $2202;
                                                            break;
                                                    };
                                                    var $2188 = $2196;
                                                    break;
                                            };
                                            var $2186 = $2188;
                                            break;
                                    };
                                    var $2180 = $2186;
                                    break;
                            };
                            var $2173 = $2180;
                            break;
                    };
                    var $2171 = $2173;
                    break;
            };
            return $2171;
        }), List$cons$((_pst$2 => {
            var self = _pst$2;
            switch (self._) {
                case 'Parser.State.new':
                    var $2204 = self.err;
                    var _reply$8 = Litereum$parse$text$("eval", _pst$2);
                    var self = _reply$8;
                    switch (self._) {
                        case 'Parser.Reply.error':
                            var $2206 = self.err;
                            var self = $2204;
                            switch (self._) {
                                case 'Maybe.some':
                                    var $2208 = self.value;
                                    var $2209 = Parser$Reply$error$(Parser$Error$combine$($2208, $2206));
                                    var $2207 = $2209;
                                    break;
                                case 'Maybe.none':
                                    var $2210 = Parser$Reply$error$($2206);
                                    var $2207 = $2210;
                                    break;
                            };
                            var $2205 = $2207;
                            break;
                        case 'Parser.Reply.value':
                            var $2211 = self.pst;
                            var self = $2211;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $2213 = self.err;
                                    var $2214 = self.nam;
                                    var $2215 = self.ini;
                                    var $2216 = self.idx;
                                    var $2217 = self.str;
                                    var _reply$pst$16 = Parser$State$new$(Parser$Error$maybe_combine$($2204, $2213), $2214, $2215, $2216, $2217);
                                    var self = _reply$pst$16;
                                    switch (self._) {
                                        case 'Parser.State.new':
                                            var $2219 = self.err;
                                            var _reply$22 = Litereum$parse$eval$(_world$1, _reply$pst$16);
                                            var self = _reply$22;
                                            switch (self._) {
                                                case 'Parser.Reply.error':
                                                    var $2221 = self.err;
                                                    var self = $2219;
                                                    switch (self._) {
                                                        case 'Maybe.some':
                                                            var $2223 = self.value;
                                                            var $2224 = Parser$Reply$error$(Parser$Error$combine$($2223, $2221));
                                                            var $2222 = $2224;
                                                            break;
                                                        case 'Maybe.none':
                                                            var $2225 = Parser$Reply$error$($2221);
                                                            var $2222 = $2225;
                                                            break;
                                                    };
                                                    var $2220 = $2222;
                                                    break;
                                                case 'Parser.Reply.value':
                                                    var $2226 = self.pst;
                                                    var $2227 = self.val;
                                                    var self = $2226;
                                                    switch (self._) {
                                                        case 'Parser.State.new':
                                                            var $2229 = self.err;
                                                            var $2230 = self.nam;
                                                            var $2231 = self.ini;
                                                            var $2232 = self.idx;
                                                            var $2233 = self.str;
                                                            var _reply$pst$30 = Parser$State$new$(Parser$Error$maybe_combine$($2219, $2229), $2230, $2231, $2232, $2233);
                                                            var $2234 = Parser$Reply$value$(_reply$pst$30, Litereum$Transaction$new_eval$($2227));
                                                            var $2228 = $2234;
                                                            break;
                                                    };
                                                    var $2220 = $2228;
                                                    break;
                                            };
                                            var $2218 = $2220;
                                            break;
                                    };
                                    var $2212 = $2218;
                                    break;
                            };
                            var $2205 = $2212;
                            break;
                    };
                    var $2203 = $2205;
                    break;
            };
            return $2203;
        }), List$nil)))));
        return $2106;
    };
    const Litereum$parse$transaction = x0 => Litereum$parse$transaction$(x0);

    function Litereum$parse$block$(_world$1) {
        var $2235 = Parser$until$(Litereum$parse$text("save"), Litereum$parse$transaction$(_world$1));
        return $2235;
    };
    const Litereum$parse$block = x0 => Litereum$parse$block$(x0);

    function IO$(_A$1) {
        var $2236 = null;
        return $2236;
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
                    var $2237 = _n$2;
                    return $2237;
                } else {
                    var $2238 = self.charCodeAt(0);
                    var $2239 = self.slice(1);
                    var $2240 = String$length$go$($2239, Nat$succ$(_n$2));
                    return $2240;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$length$go = x0 => x1 => String$length$go$(x0, x1);

    function String$length$(_xs$1) {
        var $2241 = String$length$go$(_xs$1, 0n);
        return $2241;
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
                        var $2242 = self.head;
                        var $2243 = self.tail;
                        var $2244 = String$flatten$go$($2243, (_res$2 + $2242));
                        return $2244;
                    case 'List.nil':
                        var $2245 = _res$2;
                        return $2245;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$flatten$go = x0 => x1 => String$flatten$go$(x0, x1);

    function String$flatten$(_xs$1) {
        var $2246 = String$flatten$go$(_xs$1, "");
        return $2246;
    };
    const String$flatten = x0 => String$flatten$(x0);

    function String$join$go$(_sep$1, _list$2, _fst$3) {
        var self = _list$2;
        switch (self._) {
            case 'List.cons':
                var $2248 = self.head;
                var $2249 = self.tail;
                var $2250 = String$flatten$(List$cons$((() => {
                    var self = _fst$3;
                    if (self) {
                        var $2251 = "";
                        return $2251;
                    } else {
                        var $2252 = _sep$1;
                        return $2252;
                    };
                })(), List$cons$($2248, List$cons$(String$join$go$(_sep$1, $2249, Bool$false), List$nil))));
                var $2247 = $2250;
                break;
            case 'List.nil':
                var $2253 = "";
                var $2247 = $2253;
                break;
        };
        return $2247;
    };
    const String$join$go = x0 => x1 => x2 => String$join$go$(x0, x1, x2);

    function String$join$(_sep$1, _list$2) {
        var $2254 = String$join$go$(_sep$1, _list$2, Bool$true);
        return $2254;
    };
    const String$join = x0 => x1 => String$join$(x0, x1);

    function Kind$Code$highlight$end$(_col$1, _row$2, _res$3) {
        var $2255 = String$join$("\u{a}", _res$3);
        return $2255;
    };
    const Kind$Code$highlight$end = x0 => x1 => x2 => Kind$Code$highlight$end$(x0, x1, x2);

    function Maybe$extract$(_m$2, _a$4, _f$5) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $2257 = self.value;
                var $2258 = _f$5($2257);
                var $2256 = $2258;
                break;
            case 'Maybe.none':
                var $2259 = _a$4;
                var $2256 = $2259;
                break;
        };
        return $2256;
    };
    const Maybe$extract = x0 => x1 => x2 => Maybe$extract$(x0, x1, x2);

    function Nat$is_zero$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $2261 = Bool$true;
            var $2260 = $2261;
        } else {
            var $2262 = (self - 1n);
            var $2263 = Bool$false;
            var $2260 = $2263;
        };
        return $2260;
    };
    const Nat$is_zero = x0 => Nat$is_zero$(x0);

    function Nat$double$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $2265 = Nat$zero;
            var $2264 = $2265;
        } else {
            var $2266 = (self - 1n);
            var $2267 = Nat$succ$(Nat$succ$(Nat$double$($2266)));
            var $2264 = $2267;
        };
        return $2264;
    };
    const Nat$double = x0 => Nat$double$(x0);

    function Nat$pred$(_n$1) {
        var self = _n$1;
        if (self === 0n) {
            var $2269 = Nat$zero;
            var $2268 = $2269;
        } else {
            var $2270 = (self - 1n);
            var $2271 = $2270;
            var $2268 = $2271;
        };
        return $2268;
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
                    var $2272 = _res$2;
                    return $2272;
                } else {
                    var $2273 = self.charCodeAt(0);
                    var $2274 = self.slice(1);
                    var $2275 = String$reverse$go$($2274, String$cons$($2273, _res$2));
                    return $2275;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const String$reverse$go = x0 => x1 => String$reverse$go$(x0, x1);

    function String$reverse$(_xs$1) {
        var $2276 = String$reverse$go$(_xs$1, String$nil);
        return $2276;
    };
    const String$reverse = x0 => String$reverse$(x0);

    function String$pad_right$(_size$1, _chr$2, _str$3) {
        var self = _size$1;
        if (self === 0n) {
            var $2278 = _str$3;
            var $2277 = $2278;
        } else {
            var $2279 = (self - 1n);
            var self = _str$3;
            if (self.length === 0) {
                var $2281 = String$cons$(_chr$2, String$pad_right$($2279, _chr$2, ""));
                var $2280 = $2281;
            } else {
                var $2282 = self.charCodeAt(0);
                var $2283 = self.slice(1);
                var $2284 = String$cons$($2282, String$pad_right$($2279, _chr$2, $2283));
                var $2280 = $2284;
            };
            var $2277 = $2280;
        };
        return $2277;
    };
    const String$pad_right = x0 => x1 => x2 => String$pad_right$(x0, x1, x2);

    function String$pad_left$(_size$1, _chr$2, _str$3) {
        var $2285 = String$reverse$(String$pad_right$(_size$1, _chr$2, String$reverse$(_str$3)));
        return $2285;
    };
    const String$pad_left = x0 => x1 => x2 => String$pad_left$(x0, x1, x2);

    function Either$(_A$1, _B$2) {
        var $2286 = null;
        return $2286;
    };
    const Either = x0 => x1 => Either$(x0, x1);

    function Either$left$(_value$3) {
        var $2287 = ({
            _: 'Either.left',
            'value': _value$3
        });
        return $2287;
    };
    const Either$left = x0 => Either$left$(x0);

    function Either$right$(_value$3) {
        var $2288 = ({
            _: 'Either.right',
            'value': _value$3
        });
        return $2288;
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
                    var $2289 = Either$left$(_n$1);
                    return $2289;
                } else {
                    var $2290 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $2292 = Either$right$(Nat$succ$($2290));
                        var $2291 = $2292;
                    } else {
                        var $2293 = (self - 1n);
                        var $2294 = Nat$sub_rem$($2293, $2290);
                        var $2291 = $2294;
                    };
                    return $2291;
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
                        var $2295 = self.value;
                        var $2296 = Nat$div_mod$go$($2295, _m$2, Nat$succ$(_d$3));
                        return $2296;
                    case 'Either.right':
                        var $2297 = Pair$new$(_d$3, _n$1);
                        return $2297;
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
                        var $2298 = self.fst;
                        var $2299 = self.snd;
                        var self = $2298;
                        if (self === 0n) {
                            var $2301 = List$cons$($2299, _res$3);
                            var $2300 = $2301;
                        } else {
                            var $2302 = (self - 1n);
                            var $2303 = Nat$to_base$go$(_base$1, $2298, List$cons$($2299, _res$3));
                            var $2300 = $2303;
                        };
                        return $2300;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Nat$to_base$go = x0 => x1 => x2 => Nat$to_base$go$(x0, x1, x2);

    function Nat$to_base$(_base$1, _nat$2) {
        var $2304 = Nat$to_base$go$(_base$1, _nat$2, List$nil);
        return $2304;
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
                    var $2305 = Nat$mod$go$(_n$1, _r$3, _m$2);
                    return $2305;
                } else {
                    var $2306 = (self - 1n);
                    var self = _n$1;
                    if (self === 0n) {
                        var $2308 = _r$3;
                        var $2307 = $2308;
                    } else {
                        var $2309 = (self - 1n);
                        var $2310 = Nat$mod$go$($2309, $2306, Nat$succ$(_r$3));
                        var $2307 = $2310;
                    };
                    return $2307;
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
                        var $2311 = self.head;
                        var $2312 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $2314 = Maybe$some$($2311);
                            var $2313 = $2314;
                        } else {
                            var $2315 = (self - 1n);
                            var $2316 = List$at$($2315, $2312);
                            var $2313 = $2316;
                        };
                        return $2313;
                    case 'List.nil':
                        var $2317 = Maybe$none;
                        return $2317;
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
                    var $2320 = self.value;
                    var $2321 = $2320;
                    var $2319 = $2321;
                    break;
                case 'Maybe.none':
                    var $2322 = 35;
                    var $2319 = $2322;
                    break;
            };
            var $2318 = $2319;
        } else {
            var $2323 = 35;
            var $2318 = $2323;
        };
        return $2318;
    };
    const Nat$show_digit = x0 => x1 => Nat$show_digit$(x0, x1);

    function Nat$to_string_base$(_base$1, _nat$2) {
        var $2324 = List$fold$(Nat$to_base$(_base$1, _nat$2), String$nil, (_n$3 => _str$4 => {
            var $2325 = String$cons$(Nat$show_digit$(_base$1, _n$3), _str$4);
            return $2325;
        }));
        return $2324;
    };
    const Nat$to_string_base = x0 => x1 => Nat$to_string_base$(x0, x1);

    function Nat$show$(_n$1) {
        var $2326 = Nat$to_string_base$(10n, _n$1);
        return $2326;
    };
    const Nat$show = x0 => Nat$show$(x0);
    const Bool$not = a0 => (!a0);

    function U16$new$(_value$1) {
        var $2327 = word_to_u16(_value$1);
        return $2327;
    };
    const U16$new = x0 => U16$new$(x0);
    const Nat$to_u16 = a0 => (Number(a0) & 0xFFFF);

    function Kind$Code$color$(_col$1, _str$2) {
        var $2328 = String$cons$(27, ("[" + (_col$1 + ("m" + (_str$2 + String$cons$(27, "[0m"))))));
        return $2328;
    };
    const Kind$Code$color = x0 => x1 => Kind$Code$color$(x0, x1);
    const Nat$eql = a0 => a1 => (a0 === a1);

    function List$take$(_n$2, _xs$3) {
        var self = _xs$3;
        switch (self._) {
            case 'List.cons':
                var $2330 = self.head;
                var $2331 = self.tail;
                var self = _n$2;
                if (self === 0n) {
                    var $2333 = List$nil;
                    var $2332 = $2333;
                } else {
                    var $2334 = (self - 1n);
                    var $2335 = List$cons$($2330, List$take$($2334, $2331));
                    var $2332 = $2335;
                };
                var $2329 = $2332;
                break;
            case 'List.nil':
                var $2336 = List$nil;
                var $2329 = $2336;
                break;
        };
        return $2329;
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
                    var $2338 = Kind$Code$highlight$end$(_col$5, _row$6, List$reverse$(_res$9));
                    var $2337 = $2338;
                } else {
                    var $2339 = self.charCodeAt(0);
                    var $2340 = self.slice(1);
                    var self = ($2339 === 10);
                    if (self) {
                        var _stp$13 = Maybe$extract$(_lft$7, Bool$false, Nat$is_zero);
                        var self = _stp$13;
                        if (self) {
                            var $2343 = Kind$Code$highlight$end$(_col$5, _row$6, List$reverse$(_res$9));
                            var $2342 = $2343;
                        } else {
                            var _siz$14 = Nat$succ$(Nat$double$(_spa$10));
                            var self = _ix1$4;
                            if (self === 0n) {
                                var self = _lft$7;
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $2346 = self.value;
                                        var $2347 = Maybe$some$(Nat$pred$($2346));
                                        var $2345 = $2347;
                                        break;
                                    case 'Maybe.none':
                                        var $2348 = Maybe$some$(_spa$10);
                                        var $2345 = $2348;
                                        break;
                                };
                                var _lft$15 = $2345;
                            } else {
                                var $2349 = (self - 1n);
                                var $2350 = _lft$7;
                                var _lft$15 = $2350;
                            };
                            var _ixi$16 = Nat$pred$(_ixi$2);
                            var _ix0$17 = Nat$pred$(_ix0$3);
                            var _ix1$18 = Nat$pred$(_ix1$4);
                            var _col$19 = 0n;
                            var _row$20 = Nat$succ$(_row$6);
                            var _res$21 = List$cons$(String$reverse$(_lin$8), _res$9);
                            var _lin$22 = String$reverse$(String$flatten$(List$cons$(String$pad_left$(4n, 32, Nat$show$(_row$20)), List$cons$(" | ", List$nil))));
                            var $2344 = Kind$Code$highlight$go$($2340, _ixi$16, _ix0$17, _ix1$18, _col$19, _row$20, _lft$15, _lin$22, _res$21);
                            var $2342 = $2344;
                        };
                        var $2341 = $2342;
                    } else {
                        var _chr$13 = String$cons$($2339, String$nil);
                        var self = (Nat$is_zero$(_ix0$3) && (!Nat$is_zero$(_ix1$4)));
                        if (self) {
                            var $2352 = String$reverse$(Kind$Code$color$("41", Kind$Code$color$("37", _chr$13)));
                            var _chr$14 = $2352;
                        } else {
                            var self = (Nat$is_zero$(_ixi$2) && (!Nat$is_zero$(_ix1$4)));
                            if (self) {
                                var $2354 = String$reverse$(Kind$Code$color$("31", Kind$Code$color$("4", _chr$13)));
                                var $2353 = $2354;
                            } else {
                                var $2355 = _chr$13;
                                var $2353 = $2355;
                            };
                            var _chr$14 = $2353;
                        };
                        var self = (_ix0$3 === 1n);
                        if (self) {
                            var $2356 = List$take$(_spa$10, _res$9);
                            var _res$15 = $2356;
                        } else {
                            var $2357 = _res$9;
                            var _res$15 = $2357;
                        };
                        var _ixi$16 = Nat$pred$(_ixi$2);
                        var _ix0$17 = Nat$pred$(_ix0$3);
                        var _ix1$18 = Nat$pred$(_ix1$4);
                        var _col$19 = Nat$succ$(_col$5);
                        var _lin$20 = String$flatten$(List$cons$(_chr$14, List$cons$(_lin$8, List$nil)));
                        var $2351 = Kind$Code$highlight$go$($2340, _ixi$16, _ix0$17, _ix1$18, _col$19, _row$6, _lft$7, _lin$20, _res$15);
                        var $2341 = $2351;
                    };
                    var $2337 = $2341;
                };
                return $2337;
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Kind$Code$highlight$go = x0 => x1 => x2 => x3 => x4 => x5 => x6 => x7 => x8 => Kind$Code$highlight$go$(x0, x1, x2, x3, x4, x5, x6, x7, x8);

    function Kind$Code$highlight$(_code$1, _init$2, _idx0$3, _idx1$4) {
        var $2358 = Kind$Code$highlight$go$((_code$1 + " \u{a}"), _init$2, _idx0$3, _idx1$4, 0n, 1n, Maybe$none, String$reverse$("   1 | "), List$nil);
        return $2358;
    };
    const Kind$Code$highlight = x0 => x1 => x2 => x3 => Kind$Code$highlight$(x0, x1, x2, x3);

    function IO$ask$(_query$2, _param$3, _then$4) {
        var $2359 = ({
            _: 'IO.ask',
            'query': _query$2,
            'param': _param$3,
            'then': _then$4
        });
        return $2359;
    };
    const IO$ask = x0 => x1 => x2 => IO$ask$(x0, x1, x2);

    function IO$bind$(_a$3, _f$4) {
        var self = _a$3;
        switch (self._) {
            case 'IO.end':
                var $2361 = self.value;
                var $2362 = _f$4($2361);
                var $2360 = $2362;
                break;
            case 'IO.ask':
                var $2363 = self.query;
                var $2364 = self.param;
                var $2365 = self.then;
                var $2366 = IO$ask$($2363, $2364, (_x$8 => {
                    var $2367 = IO$bind$($2365(_x$8), _f$4);
                    return $2367;
                }));
                var $2360 = $2366;
                break;
        };
        return $2360;
    };
    const IO$bind = x0 => x1 => IO$bind$(x0, x1);

    function IO$end$(_value$2) {
        var $2368 = ({
            _: 'IO.end',
            'value': _value$2
        });
        return $2368;
    };
    const IO$end = x0 => IO$end$(x0);

    function IO$monad$(_new$2) {
        var $2369 = _new$2(IO$bind)(IO$end);
        return $2369;
    };
    const IO$monad = x0 => IO$monad$(x0);

    function IO$put_string$(_text$1) {
        var $2370 = IO$ask$("put_string", _text$1, (_skip$2 => {
            var $2371 = IO$end$(Unit$new);
            return $2371;
        }));
        return $2370;
    };
    const IO$put_string = x0 => IO$put_string$(x0);

    function IO$print$(_text$1) {
        var $2372 = IO$put_string$((_text$1 + "\u{a}"));
        return $2372;
    };
    const IO$print = x0 => IO$print$(x0);
    const Bits$e = '';
    const Bits$o = a0 => (a0 + '0');

    function Word$subber$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $2374 = self.pred;
                var $2375 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $2377 = self.pred;
                            var $2378 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2380 = Word$i$(Word$subber$(_a$pred$10, $2377, Bool$true));
                                    var $2379 = $2380;
                                } else {
                                    var $2381 = Word$o$(Word$subber$(_a$pred$10, $2377, Bool$false));
                                    var $2379 = $2381;
                                };
                                return $2379;
                            });
                            var $2376 = $2378;
                            break;
                        case 'Word.i':
                            var $2382 = self.pred;
                            var $2383 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2385 = Word$o$(Word$subber$(_a$pred$10, $2382, Bool$true));
                                    var $2384 = $2385;
                                } else {
                                    var $2386 = Word$i$(Word$subber$(_a$pred$10, $2382, Bool$true));
                                    var $2384 = $2386;
                                };
                                return $2384;
                            });
                            var $2376 = $2383;
                            break;
                        case 'Word.e':
                            var $2387 = (_a$pred$8 => {
                                var $2388 = Word$e;
                                return $2388;
                            });
                            var $2376 = $2387;
                            break;
                    };
                    var $2376 = $2376($2374);
                    return $2376;
                });
                var $2373 = $2375;
                break;
            case 'Word.i':
                var $2389 = self.pred;
                var $2390 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $2392 = self.pred;
                            var $2393 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2395 = Word$o$(Word$subber$(_a$pred$10, $2392, Bool$false));
                                    var $2394 = $2395;
                                } else {
                                    var $2396 = Word$i$(Word$subber$(_a$pred$10, $2392, Bool$false));
                                    var $2394 = $2396;
                                };
                                return $2394;
                            });
                            var $2391 = $2393;
                            break;
                        case 'Word.i':
                            var $2397 = self.pred;
                            var $2398 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2400 = Word$i$(Word$subber$(_a$pred$10, $2397, Bool$true));
                                    var $2399 = $2400;
                                } else {
                                    var $2401 = Word$o$(Word$subber$(_a$pred$10, $2397, Bool$false));
                                    var $2399 = $2401;
                                };
                                return $2399;
                            });
                            var $2391 = $2398;
                            break;
                        case 'Word.e':
                            var $2402 = (_a$pred$8 => {
                                var $2403 = Word$e;
                                return $2403;
                            });
                            var $2391 = $2402;
                            break;
                    };
                    var $2391 = $2391($2389);
                    return $2391;
                });
                var $2373 = $2390;
                break;
            case 'Word.e':
                var $2404 = (_b$5 => {
                    var $2405 = Word$e;
                    return $2405;
                });
                var $2373 = $2404;
                break;
        };
        var $2373 = $2373(_b$3);
        return $2373;
    };
    const Word$subber = x0 => x1 => x2 => Word$subber$(x0, x1, x2);

    function Word$sub$(_a$2, _b$3) {
        var $2406 = Word$subber$(_a$2, _b$3, Bool$false);
        return $2406;
    };
    const Word$sub = x0 => x1 => Word$sub$(x0, x1);
    const U16$sub = a0 => a1 => ((a0 - a1) & 0xFFFF);

    function Word$adder$(_a$2, _b$3, _c$4) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $2408 = self.pred;
                var $2409 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $2411 = self.pred;
                            var $2412 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2414 = Word$i$(Word$adder$(_a$pred$10, $2411, Bool$false));
                                    var $2413 = $2414;
                                } else {
                                    var $2415 = Word$o$(Word$adder$(_a$pred$10, $2411, Bool$false));
                                    var $2413 = $2415;
                                };
                                return $2413;
                            });
                            var $2410 = $2412;
                            break;
                        case 'Word.i':
                            var $2416 = self.pred;
                            var $2417 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2419 = Word$o$(Word$adder$(_a$pred$10, $2416, Bool$true));
                                    var $2418 = $2419;
                                } else {
                                    var $2420 = Word$i$(Word$adder$(_a$pred$10, $2416, Bool$false));
                                    var $2418 = $2420;
                                };
                                return $2418;
                            });
                            var $2410 = $2417;
                            break;
                        case 'Word.e':
                            var $2421 = (_a$pred$8 => {
                                var $2422 = Word$e;
                                return $2422;
                            });
                            var $2410 = $2421;
                            break;
                    };
                    var $2410 = $2410($2408);
                    return $2410;
                });
                var $2407 = $2409;
                break;
            case 'Word.i':
                var $2423 = self.pred;
                var $2424 = (_b$7 => {
                    var self = _b$7;
                    switch (self._) {
                        case 'Word.o':
                            var $2426 = self.pred;
                            var $2427 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2429 = Word$o$(Word$adder$(_a$pred$10, $2426, Bool$true));
                                    var $2428 = $2429;
                                } else {
                                    var $2430 = Word$i$(Word$adder$(_a$pred$10, $2426, Bool$false));
                                    var $2428 = $2430;
                                };
                                return $2428;
                            });
                            var $2425 = $2427;
                            break;
                        case 'Word.i':
                            var $2431 = self.pred;
                            var $2432 = (_a$pred$10 => {
                                var self = _c$4;
                                if (self) {
                                    var $2434 = Word$i$(Word$adder$(_a$pred$10, $2431, Bool$true));
                                    var $2433 = $2434;
                                } else {
                                    var $2435 = Word$o$(Word$adder$(_a$pred$10, $2431, Bool$true));
                                    var $2433 = $2435;
                                };
                                return $2433;
                            });
                            var $2425 = $2432;
                            break;
                        case 'Word.e':
                            var $2436 = (_a$pred$8 => {
                                var $2437 = Word$e;
                                return $2437;
                            });
                            var $2425 = $2436;
                            break;
                    };
                    var $2425 = $2425($2423);
                    return $2425;
                });
                var $2407 = $2424;
                break;
            case 'Word.e':
                var $2438 = (_b$5 => {
                    var $2439 = Word$e;
                    return $2439;
                });
                var $2407 = $2438;
                break;
        };
        var $2407 = $2407(_b$3);
        return $2407;
    };
    const Word$adder = x0 => x1 => x2 => Word$adder$(x0, x1, x2);

    function Word$add$(_a$2, _b$3) {
        var $2440 = Word$adder$(_a$2, _b$3, Bool$false);
        return $2440;
    };
    const Word$add = x0 => x1 => Word$add$(x0, x1);
    const U16$add = a0 => a1 => ((a0 + a1) & 0xFFFF);

    function Pair$fst$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $2442 = self.fst;
                var $2443 = $2442;
                var $2441 = $2443;
                break;
        };
        return $2441;
    };
    const Pair$fst = x0 => Pair$fst$(x0);
    const Nat$div = a0 => a1 => (a0 / a1);
    const Bits$i = a0 => (a0 + '1');

    function Litereum$serialize$fixlen$(_size$1, _value$2) {
        var self = _size$1;
        if (self === 0n) {
            var $2445 = Bits$e;
            var $2444 = $2445;
        } else {
            var $2446 = (self - 1n);
            var self = ((_value$2 % 2n) === 0n);
            if (self) {
                var $2448 = (Litereum$serialize$fixlen$($2446, (_value$2 / 2n)) + '0');
                var $2447 = $2448;
            } else {
                var $2449 = (Litereum$serialize$fixlen$($2446, (_value$2 / 2n)) + '1');
                var $2447 = $2449;
            };
            var $2444 = $2447;
        };
        return $2444;
    };
    const Litereum$serialize$fixlen = x0 => x1 => Litereum$serialize$fixlen$(x0, x1);

    function Word$fold$(_nil$3, _w0$4, _w1$5, _word$6) {
        var self = _word$6;
        switch (self._) {
            case 'Word.o':
                var $2451 = self.pred;
                var $2452 = _w0$4(Word$fold$(_nil$3, _w0$4, _w1$5, $2451));
                var $2450 = $2452;
                break;
            case 'Word.i':
                var $2453 = self.pred;
                var $2454 = _w1$5(Word$fold$(_nil$3, _w0$4, _w1$5, $2453));
                var $2450 = $2454;
                break;
            case 'Word.e':
                var $2455 = _nil$3;
                var $2450 = $2455;
                break;
        };
        return $2450;
    };
    const Word$fold = x0 => x1 => x2 => x3 => Word$fold$(x0, x1, x2, x3);

    function Word$to_nat$(_word$2) {
        var $2456 = Word$fold$(0n, a1 => (2n * a1), (_x$4 => {
            var $2457 = Nat$succ$((2n * _x$4));
            return $2457;
        }), _word$2);
        return $2456;
    };
    const Word$to_nat = x0 => Word$to_nat$(x0);
    const U16$to_nat = a0 => (BigInt(a0));
    const Bits$concat = a0 => a1 => (a1 + a0);

    function Litereum$serialize$name$new$(_name$1) {
        var self = _name$1;
        if (self.length === 0) {
            var $2459 = (Bits$e + '0');
            var $2458 = $2459;
        } else {
            var $2460 = self.charCodeAt(0);
            var $2461 = self.slice(1);
            var self = U16$btw$(48, $2460, 57);
            if (self) {
                var $2463 = (($2460 - 48) & 0xFFFF);
                var _numb$4 = $2463;
            } else {
                var self = U16$btw$(65, $2460, 90);
                if (self) {
                    var $2465 = (((($2460 - 65) & 0xFFFF) + 10) & 0xFFFF);
                    var $2464 = $2465;
                } else {
                    var self = U16$btw$(97, $2460, 122);
                    if (self) {
                        var $2467 = (((($2460 - 97) & 0xFFFF) + 36) & 0xFFFF);
                        var $2466 = $2467;
                    } else {
                        var self = U16$btw$(95, $2460, 95);
                        if (self) {
                            var $2469 = 62;
                            var $2468 = $2469;
                        } else {
                            var $2470 = 63;
                            var $2468 = $2470;
                        };
                        var $2466 = $2468;
                    };
                    var $2464 = $2466;
                };
                var _numb$4 = $2464;
            };
            var _head$5 = Litereum$serialize$fixlen$(6n, (BigInt(_numb$4)));
            var _tail$6 = Litereum$serialize$name$new$($2461);
            var $2462 = ((_tail$6 + _head$5) + '1');
            var $2458 = $2462;
        };
        return $2458;
    };
    const Litereum$serialize$name$new = x0 => Litereum$serialize$name$new$(x0);

    function Litereum$serialize$varlen$go$(_value$1) {
        var self = _value$1;
        if (self === 0n) {
            var $2472 = Bits$e;
            var $2471 = $2472;
        } else {
            var $2473 = (self - 1n);
            var self = (_value$1 === 1n);
            if (self) {
                var $2475 = (Bits$e + '0');
                var $2474 = $2475;
            } else {
                var self = ((_value$1 % 2n) === 0n);
                if (self) {
                    var $2477 = ((Litereum$serialize$varlen$go$((_value$1 / 2n)) + '0') + '1');
                    var $2476 = $2477;
                } else {
                    var $2478 = ((Litereum$serialize$varlen$go$((_value$1 / 2n)) + '1') + '1');
                    var $2476 = $2478;
                };
                var $2474 = $2476;
            };
            var $2471 = $2474;
        };
        return $2471;
    };
    const Litereum$serialize$varlen$go = x0 => Litereum$serialize$varlen$go$(x0);

    function Litereum$serialize$varlen$(_value$1) {
        var $2479 = Litereum$serialize$varlen$go$((_value$1 + 1n));
        return $2479;
    };
    const Litereum$serialize$varlen = x0 => Litereum$serialize$varlen$(x0);

    function Litereum$serialize$name$(_world$1, _name$2) {
        var self = _world$1;
        switch (self._) {
            case 'Litereum.World.new':
                var $2481 = self.name_to_index;
                var self = Map$get$(_name$2, $2481);
                switch (self._) {
                    case 'Maybe.some':
                        var $2483 = self.value;
                        var $2484 = (Litereum$serialize$varlen$($2483) + '1');
                        var $2482 = $2484;
                        break;
                    case 'Maybe.none':
                        var $2485 = (Litereum$serialize$name$new$(_name$2) + '0');
                        var $2482 = $2485;
                        break;
                };
                var $2480 = $2482;
                break;
        };
        return $2480;
    };
    const Litereum$serialize$name = x0 => x1 => Litereum$serialize$name$(x0, x1);

    function Litereum$serialize$list$(_item$2, _list$3) {
        var self = _list$3;
        switch (self._) {
            case 'List.cons':
                var $2487 = self.head;
                var $2488 = self.tail;
                var $2489 = ((Litereum$serialize$list$(_item$2, $2488) + _item$2($2487)) + '1');
                var $2486 = $2489;
                break;
            case 'List.nil':
                var $2490 = (Bits$e + '0');
                var $2486 = $2490;
                break;
        };
        return $2486;
    };
    const Litereum$serialize$list = x0 => x1 => Litereum$serialize$list$(x0, x1);

    function Litereum$serialize$type$(_world$1, _typ$2) {
        var self = _typ$2;
        switch (self._) {
            case 'Litereum.Type.data':
                var $2492 = self.name;
                var $2493 = ((Litereum$serialize$name$(_world$1, $2492) + '0') + '1');
                var $2491 = $2493;
                break;
            case 'Litereum.Type.effect':
                var $2494 = self.rety;
                var $2495 = ((Litereum$serialize$type$(_world$1, $2494) + '1') + '0');
                var $2491 = $2495;
                break;
            case 'Litereum.Type.word':
                var $2496 = ((Bits$e + '0') + '0');
                var $2491 = $2496;
                break;
        };
        return $2491;
    };
    const Litereum$serialize$type = x0 => x1 => Litereum$serialize$type$(x0, x1);

    function Litereum$serialize$constructor$(_world$1, _ctor$2) {
        var self = _ctor$2;
        switch (self._) {
            case 'Litereum.Constructor.new':
                var $2498 = self.name;
                var $2499 = self.field_names;
                var $2500 = self.field_types;
                var _name$6 = Litereum$serialize$name$(_world$1, $2498);
                var _nams$7 = Litereum$serialize$list$(Litereum$serialize$name(_world$1), $2499);
                var _typs$8 = Litereum$serialize$list$(Litereum$serialize$type(_world$1), $2500);
                var $2501 = ((_typs$8 + _nams$7) + _name$6);
                var $2497 = $2501;
                break;
        };
        return $2497;
    };
    const Litereum$serialize$constructor = x0 => x1 => Litereum$serialize$constructor$(x0, x1);

    function Litereum$serialize$data$(_world$1, _data$2) {
        var self = _data$2;
        switch (self._) {
            case 'Litereum.Data.new':
                var $2503 = self.name;
                var $2504 = self.constructors;
                var _name$5 = Litereum$serialize$name$(_world$1, $2503);
                var _ctrs$6 = Litereum$serialize$list$(Litereum$serialize$constructor(_world$1), $2504);
                var $2505 = (_ctrs$6 + _name$5);
                var $2502 = $2505;
                break;
        };
        return $2502;
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
                        var $2506 = self.head;
                        var $2507 = self.tail;
                        var self = _f$3($2506);
                        if (self) {
                            var $2509 = Maybe$some$(_i$4);
                            var $2508 = $2509;
                        } else {
                            var $2510 = List$find_index$go$($2507, _f$3, Nat$succ$(_i$4));
                            var $2508 = $2510;
                        };
                        return $2508;
                    case 'List.nil':
                        var $2511 = Maybe$none;
                        return $2511;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$find_index$go = x0 => x1 => x2 => List$find_index$go$(x0, x1, x2);

    function List$find_index$(_xs$2, _f$3) {
        var $2512 = List$find_index$go$(_xs$2, _f$3, Nat$zero);
        return $2512;
    };
    const List$find_index = x0 => x1 => List$find_index$(x0, x1);
    const String$eql = a0 => a1 => (a0 === a1);

    function Litereum$serialize$name$local$(_world$1, _vars$2, _name$3) {
        var self = List$find_index$(_vars$2, a1 => (_name$3 === a1));
        switch (self._) {
            case 'Maybe.some':
                var $2514 = self.value;
                var $2515 = Litereum$serialize$varlen$($2514);
                var $2513 = $2515;
                break;
            case 'Maybe.none':
                var $2516 = Bits$e;
                var $2513 = $2516;
                break;
        };
        return $2513;
    };
    const Litereum$serialize$name$local = x0 => x1 => x2 => Litereum$serialize$name$local$(x0, x1, x2);

    function List$map$(_f$3, _as$4) {
        var self = _as$4;
        switch (self._) {
            case 'List.cons':
                var $2518 = self.head;
                var $2519 = self.tail;
                var $2520 = List$cons$(_f$3($2518), List$map$(_f$3, $2519));
                var $2517 = $2520;
                break;
            case 'List.nil':
                var $2521 = List$nil;
                var $2517 = $2521;
                break;
        };
        return $2517;
    };
    const List$map = x0 => x1 => List$map$(x0, x1);

    function List$concat$(_as$2, _bs$3) {
        var self = _as$2;
        switch (self._) {
            case 'List.cons':
                var $2523 = self.head;
                var $2524 = self.tail;
                var $2525 = List$cons$($2523, List$concat$($2524, _bs$3));
                var $2522 = $2525;
                break;
            case 'List.nil':
                var $2526 = _bs$3;
                var $2522 = $2526;
                break;
        };
        return $2522;
    };
    const List$concat = x0 => x1 => List$concat$(x0, x1);

    function Litereum$serialize$cases$(_world$1, _vars$2, _name$3, _ctors$4, _cases$5) {
        var self = _ctors$4;
        switch (self._) {
            case 'List.cons':
                var $2528 = self.head;
                var $2529 = self.tail;
                var self = _cases$5;
                switch (self._) {
                    case 'List.cons':
                        var $2531 = self.head;
                        var $2532 = self.tail;
                        var _flds$10 = List$map$(a1 => ((_name$3 + ".") + a1), (() => {
                            var self = $2528;
                            switch (self._) {
                                case 'Litereum.Constructor.new':
                                    var $2534 = self.field_names;
                                    var $2535 = $2534;
                                    return $2535;
                            };
                        })());
                        var _head$11 = Litereum$serialize$term$(_world$1, List$concat$(List$reverse$(_flds$10), _vars$2), $2531);
                        var _tail$12 = Litereum$serialize$cases$(_world$1, _vars$2, _name$3, $2529, $2532);
                        var $2533 = (_tail$12 + _head$11);
                        var $2530 = $2533;
                        break;
                    case 'List.nil':
                        var $2536 = Bits$e;
                        var $2530 = $2536;
                        break;
                };
                var $2527 = $2530;
                break;
            case 'List.nil':
                var self = _cases$5;
                switch (self._) {
                    case 'List.nil':
                    case 'List.cons':
                        var $2538 = Bits$e;
                        var $2537 = $2538;
                        break;
                };
                var $2527 = $2537;
                break;
        };
        return $2527;
    };
    const Litereum$serialize$cases = x0 => x1 => x2 => x3 => x4 => Litereum$serialize$cases$(x0, x1, x2, x3, x4);

    function Maybe$default$(_m$2, _a$3) {
        var self = _m$2;
        switch (self._) {
            case 'Maybe.some':
                var $2540 = self.value;
                var $2541 = $2540;
                var $2539 = $2541;
                break;
            case 'Maybe.none':
                var $2542 = _a$3;
                var $2539 = $2542;
                break;
        };
        return $2539;
    };
    const Maybe$default = x0 => x1 => Maybe$default$(x0, x1);

    function Litereum$get_constructors$(_world$1, _name$2) {
        var self = Litereum$get_data$(_world$1, _name$2);
        switch (self._) {
            case 'Maybe.some':
                var $2544 = self.value;
                var $2545 = Maybe$some$((() => {
                    var self = $2544;
                    switch (self._) {
                        case 'Litereum.Data.new':
                            var $2546 = self.constructors;
                            var $2547 = $2546;
                            return $2547;
                    };
                })());
                var $2543 = $2545;
                break;
            case 'Maybe.none':
                var $2548 = Maybe$none;
                var $2543 = $2548;
                break;
        };
        return $2543;
    };
    const Litereum$get_constructors = x0 => x1 => Litereum$get_constructors$(x0, x1);
    const U64$to_nat = a0 => (a0);

    function Litereum$get_bond$(_world$1, _name$2) {
        var self = _world$1;
        switch (self._) {
            case 'Litereum.World.new':
                var $2550 = self.entry;
                var $2551 = Maybe$monad$((_m$bind$7 => _m$pure$8 => {
                    var $2552 = _m$bind$7;
                    return $2552;
                }))(Map$get$(_name$2, $2550))((_entry$7 => {
                    var self = _entry$7;
                    switch (self._) {
                        case 'Litereum.Entry.bond':
                            var $2554 = self.value;
                            var $2555 = Maybe$some$($2554);
                            var $2553 = $2555;
                            break;
                        case 'Litereum.Entry.data':
                            var $2556 = Maybe$none;
                            var $2553 = $2556;
                            break;
                    };
                    return $2553;
                }));
                var $2549 = $2551;
                break;
        };
        return $2549;
    };
    const Litereum$get_bond = x0 => x1 => Litereum$get_bond$(x0, x1);

    function Litereum$serialize$term$(_world$1, _vars$2, _term$3) {
        var self = _term$3;
        switch (self._) {
            case 'Litereum.Term.var':
                var $2558 = self.name;
                var $2559 = (Litereum$serialize$name$local$(_world$1, _vars$2, $2558) + '0');
                var $2557 = $2559;
                break;
            case 'Litereum.Term.call':
                var $2560 = self.bond;
                var $2561 = self.args;
                var _bond$6 = Litereum$serialize$name$(_world$1, $2560);
                var _args$7 = Litereum$serialize$list$(Litereum$serialize$term(_world$1)(_vars$2), $2561);
                var $2562 = (((((_args$7 + _bond$6) + '0') + '0') + '1') + '1');
                var $2557 = $2562;
                break;
            case 'Litereum.Term.let':
                var $2563 = self.name;
                var $2564 = self.type;
                var $2565 = self.expr;
                var $2566 = self.body;
                var _name$8 = Litereum$serialize$name$(_world$1, $2563);
                var _type$9 = Litereum$serialize$type$(_world$1, $2564);
                var _expr$10 = Litereum$serialize$term$(_world$1, _vars$2, $2565);
                var _body$11 = Litereum$serialize$term$(_world$1, List$cons$($2563, _vars$2), $2566);
                var $2567 = (((((((_body$11 + _expr$10) + _type$9) + _name$8) + '0') + '0') + '0') + '1');
                var $2557 = $2567;
                break;
            case 'Litereum.Term.create':
                var $2568 = self.ctor;
                var $2569 = self.vals;
                var _ctor$6 = Litereum$serialize$name$(_world$1, $2568);
                var _vals$7 = Litereum$serialize$list$(Litereum$serialize$term(_world$1)(_vars$2), $2569);
                var $2570 = (((((_vals$7 + _ctor$6) + '0') + '1') + '0') + '1');
                var $2557 = $2570;
                break;
            case 'Litereum.Term.match':
                var $2571 = self.name;
                var $2572 = self.data;
                var $2573 = self.cses;
                var _name$7 = Litereum$serialize$name$local$(_world$1, _vars$2, $2571);
                var _data$8 = Litereum$serialize$name$(_world$1, $2572);
                var _cses$9 = Litereum$serialize$cases$(_world$1, _vars$2, $2571, Maybe$default$(Litereum$get_constructors$(_world$1, $2572), List$nil), $2573);
                var $2574 = ((((((_cses$9 + _data$8) + _name$7) + '0') + '1') + '1') + '1');
                var $2557 = $2574;
                break;
            case 'Litereum.Term.word':
                var $2575 = self.numb;
                var _numb$5 = Litereum$serialize$fixlen$(64n, ($2575));
                var $2576 = ((((_numb$5 + '1') + '0') + '0') + '1');
                var $2557 = $2576;
                break;
            case 'Litereum.Term.compare':
                var $2577 = self.val0;
                var $2578 = self.val1;
                var $2579 = self.iflt;
                var $2580 = self.ifeq;
                var $2581 = self.ifgt;
                var _val0$9 = Litereum$serialize$term$(_world$1, _vars$2, $2577);
                var _val1$10 = Litereum$serialize$term$(_world$1, _vars$2, $2578);
                var _iflt$11 = Litereum$serialize$term$(_world$1, _vars$2, $2579);
                var _ifeq$12 = Litereum$serialize$term$(_world$1, _vars$2, $2580);
                var _ifgt$13 = Litereum$serialize$term$(_world$1, _vars$2, $2581);
                var $2582 = ((((((((_ifgt$13 + _ifeq$12) + _iflt$11) + _val1$10) + _val0$9) + '1') + '0') + '1') + '1');
                var $2557 = $2582;
                break;
            case 'Litereum.Term.operate':
                var $2583 = self.oper;
                var $2584 = self.val0;
                var $2585 = self.val1;
                var _oper$7 = Litereum$serialize$fixlen$(3n, (() => {
                    var self = $2583;
                    switch (self._) {
                        case 'Litereum.Operation.add':
                            var $2587 = 0n;
                            return $2587;
                        case 'Litereum.Operation.sub':
                            var $2588 = 1n;
                            return $2588;
                        case 'Litereum.Operation.mul':
                            var $2589 = 2n;
                            return $2589;
                        case 'Litereum.Operation.div':
                            var $2590 = 3n;
                            return $2590;
                        case 'Litereum.Operation.mod':
                            var $2591 = 4n;
                            return $2591;
                        case 'Litereum.Operation.or':
                            var $2592 = 5n;
                            return $2592;
                        case 'Litereum.Operation.and':
                            var $2593 = 6n;
                            return $2593;
                        case 'Litereum.Operation.xor':
                            var $2594 = 7n;
                            return $2594;
                    };
                })());
                var _val0$8 = Litereum$serialize$term$(_world$1, _vars$2, $2584);
                var _val1$9 = Litereum$serialize$term$(_world$1, _vars$2, $2585);
                var $2586 = ((((((_val1$9 + _val0$8) + _oper$7) + '1') + '1') + '0') + '1');
                var $2557 = $2586;
                break;
            case 'Litereum.Term.run':
                var $2595 = self.name;
                var $2596 = self.type;
                var $2597 = self.expr;
                var $2598 = self.body;
                var _name$8 = Litereum$serialize$name$(_world$1, $2595);
                var _type$9 = Litereum$serialize$type$(_world$1, $2596);
                var _expr$10 = Litereum$serialize$term$(_world$1, _vars$2, $2597);
                var _body$11 = Litereum$serialize$term$(_world$1, List$cons$($2595, _vars$2), $2598);
                var $2599 = (((((((((_body$11 + _expr$10) + _type$9) + _name$8) + '0') + '0') + '1') + '1') + '1') + '1');
                var $2557 = $2599;
                break;
            case 'Litereum.Term.bind':
                var $2600 = self.bond;
                var $2601 = self.main;
                var $2602 = self.body;
                var self = Litereum$get_bond$(_world$1, $2600);
                switch (self._) {
                    case 'Maybe.some':
                        var $2604 = self.value;
                        var _bond$8 = $2604;
                        var self = _bond$8;
                        switch (self._) {
                            case 'Litereum.Bond.new':
                                var $2606 = self.input_names;
                                var _name$15 = Litereum$serialize$name$(_world$1, $2600);
                                var _vrs2$16 = List$concat$(List$reverse$($2606), _vars$2);
                                var _main$17 = Litereum$serialize$term$(_world$1, _vrs2$16, $2601);
                                var _body$18 = Litereum$serialize$term$(_world$1, _vars$2, $2602);
                                var $2607 = ((((((((_body$18 + _main$17) + _name$15) + '0') + '1') + '1') + '1') + '1') + '1');
                                var $2605 = $2607;
                                break;
                        };
                        var $2603 = $2605;
                        break;
                    case 'Maybe.none':
                        var $2608 = Bits$e;
                        var $2603 = $2608;
                        break;
                };
                var $2557 = $2603;
                break;
            case 'Litereum.Term.return':
                var $2609 = self.expr;
                var _expr$5 = Litereum$serialize$term$(_world$1, _vars$2, $2609);
                var $2610 = ((((((_expr$5 + '1') + '0') + '1') + '1') + '1') + '1');
                var $2557 = $2610;
                break;
        };
        return $2557;
    };
    const Litereum$serialize$term = x0 => x1 => x2 => Litereum$serialize$term$(x0, x1, x2);

    function Litereum$serialize$bond$(_world$1, _bond$2) {
        var self = _bond$2;
        switch (self._) {
            case 'Litereum.Bond.new':
                var $2612 = self.name;
                var $2613 = self.input_names;
                var $2614 = self.input_types;
                var $2615 = self.output_type;
                var $2616 = self.main;
                var $2617 = self.owners;
                var _name$9 = Litereum$serialize$name$(_world$1, $2612);
                var _input_names$10 = Litereum$serialize$list$(Litereum$serialize$name(_world$1), $2613);
                var _input_types$11 = Litereum$serialize$list$(Litereum$serialize$type(_world$1), $2614);
                var _output_type$12 = Litereum$serialize$type$(_world$1, $2615);
                var _main$13 = Litereum$serialize$term$(_world$1, List$reverse$($2613), $2616);
                var _owners$14 = Litereum$serialize$list$(Litereum$serialize$name(_world$1), $2617);
                var $2618 = (((((_owners$14 + _main$13) + _output_type$12) + _input_types$11) + _input_names$10) + _name$9);
                var $2611 = $2618;
                break;
        };
        return $2611;
    };
    const Litereum$serialize$bond = x0 => x1 => Litereum$serialize$bond$(x0, x1);

    function Litereum$serialize$eval$(_world$1, _eval$2) {
        var self = _eval$2;
        switch (self._) {
            case 'Litereum.Eval.new':
                var $2620 = self.term;
                var $2621 = self.type;
                var _term$5 = Litereum$serialize$term$(_world$1, List$nil, $2620);
                var _type$6 = Litereum$serialize$type$(_world$1, $2621);
                var $2622 = (_type$6 + _term$5);
                var $2619 = $2622;
                break;
        };
        return $2619;
    };
    const Litereum$serialize$eval = x0 => x1 => Litereum$serialize$eval$(x0, x1);

    function Litereum$serialize$transaction$(_world$1, _transaction$2) {
        var self = _transaction$2;
        switch (self._) {
            case 'Litereum.Transaction.new_name':
                var $2624 = self.name;
                var _name$4 = Litereum$serialize$name$new$($2624);
                var $2625 = ((_name$4 + '0') + '0');
                var $2623 = $2625;
                break;
            case 'Litereum.Transaction.new_data':
                var $2626 = self.data;
                var _data$4 = Litereum$serialize$data$(_world$1, $2626);
                var $2627 = ((_data$4 + '0') + '1');
                var $2623 = $2627;
                break;
            case 'Litereum.Transaction.new_bond':
                var $2628 = self.bond;
                var _bond$4 = Litereum$serialize$bond$(_world$1, $2628);
                var $2629 = ((_bond$4 + '1') + '0');
                var $2623 = $2629;
                break;
            case 'Litereum.Transaction.new_eval':
                var $2630 = self.eval;
                var _term$4 = Litereum$serialize$eval$(_world$1, $2630);
                var $2631 = ((_term$4 + '1') + '1');
                var $2623 = $2631;
                break;
        };
        return $2623;
    };
    const Litereum$serialize$transaction = x0 => x1 => Litereum$serialize$transaction$(x0, x1);

    function Litereum$serialize$block$(_world$1, _block$2) {
        var self = _block$2;
        switch (self._) {
            case 'List.cons':
                var $2633 = self.head;
                var $2634 = self.tail;
                var _head$5 = Litereum$serialize$transaction$(_world$1, $2633);
                var _tail$6 = Litereum$serialize$block$(_world$1, $2634);
                var $2635 = (_tail$6 + _head$5);
                var $2632 = $2635;
                break;
            case 'List.nil':
                var $2636 = Bits$e;
                var $2632 = $2636;
                break;
        };
        return $2632;
    };
    const Litereum$serialize$block = x0 => x1 => Litereum$serialize$block$(x0, x1);

    function Bits$is_empty$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'e':
                var $2638 = Bool$true;
                var $2637 = $2638;
                break;
            case 'o':
            case 'i':
                var $2639 = Bool$false;
                var $2637 = $2639;
                break;
        };
        return $2637;
    };
    const Bits$is_empty = x0 => Bits$is_empty$(x0);

    function Litereum$deserialize$fixlen$(_size$1, _bits$2) {
        var self = _size$1;
        if (self === 0n) {
            var $2641 = Pair$new$(_bits$2, 0n);
            var $2640 = $2641;
        } else {
            var $2642 = (self - 1n);
            var self = _bits$2;
            switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                case 'o':
                    var $2644 = self.slice(0, -1);
                    var self = Litereum$deserialize$fixlen$($2642, $2644);
                    switch (self._) {
                        case 'Pair.new':
                            var $2646 = self.fst;
                            var $2647 = self.snd;
                            var $2648 = Pair$new$($2646, ($2647 * 2n));
                            var $2645 = $2648;
                            break;
                    };
                    var $2643 = $2645;
                    break;
                case 'i':
                    var $2649 = self.slice(0, -1);
                    var self = Litereum$deserialize$fixlen$($2642, $2649);
                    switch (self._) {
                        case 'Pair.new':
                            var $2651 = self.fst;
                            var $2652 = self.snd;
                            var $2653 = Pair$new$($2651, (($2652 * 2n) + 1n));
                            var $2650 = $2653;
                            break;
                    };
                    var $2643 = $2650;
                    break;
                case 'e':
                    var $2654 = Pair$new$(Bits$e, 0n);
                    var $2643 = $2654;
                    break;
            };
            var $2640 = $2643;
        };
        return $2640;
    };
    const Litereum$deserialize$fixlen = x0 => x1 => Litereum$deserialize$fixlen$(x0, x1);
    const U16$from_nat = a0 => (Number(a0) & 0xFFFF);

    function Litereum$deserialize$name$new$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2656 = self.slice(0, -1);
                var $2657 = Pair$new$($2656, "");
                var $2655 = $2657;
                break;
            case 'i':
                var $2658 = self.slice(0, -1);
                var self = Litereum$deserialize$fixlen$(6n, $2658);
                switch (self._) {
                    case 'Pair.new':
                        var $2660 = self.fst;
                        var $2661 = self.snd;
                        var self = Litereum$deserialize$name$new$($2660);
                        switch (self._) {
                            case 'Pair.new':
                                var $2663 = self.fst;
                                var $2664 = self.snd;
                                var _numb$7 = (Number($2661) & 0xFFFF);
                                var self = U16$btw$(0, _numb$7, 9);
                                if (self) {
                                    var $2666 = ((_numb$7 + 48) & 0xFFFF);
                                    var _head$8 = $2666;
                                } else {
                                    var self = U16$btw$(10, _numb$7, 35);
                                    if (self) {
                                        var $2668 = ((((_numb$7 - 10) & 0xFFFF) + 65) & 0xFFFF);
                                        var $2667 = $2668;
                                    } else {
                                        var self = U16$btw$(36, _numb$7, 61);
                                        if (self) {
                                            var $2670 = ((((_numb$7 - 36) & 0xFFFF) + 97) & 0xFFFF);
                                            var $2669 = $2670;
                                        } else {
                                            var self = U16$btw$(62, _numb$7, 62);
                                            if (self) {
                                                var $2672 = 95;
                                                var $2671 = $2672;
                                            } else {
                                                var $2673 = 46;
                                                var $2671 = $2673;
                                            };
                                            var $2669 = $2671;
                                        };
                                        var $2667 = $2669;
                                    };
                                    var _head$8 = $2667;
                                };
                                var $2665 = Pair$new$($2663, String$cons$(_head$8, $2664));
                                var $2662 = $2665;
                                break;
                        };
                        var $2659 = $2662;
                        break;
                };
                var $2655 = $2659;
                break;
            case 'e':
                var $2674 = Pair$new$(Bits$e, "");
                var $2655 = $2674;
                break;
        };
        return $2655;
    };
    const Litereum$deserialize$name$new = x0 => Litereum$deserialize$name$new$(x0);

    function Litereum$deserialize$varlen$go$(_bits$1) {
        var self = _bits$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2676 = self.slice(0, -1);
                var $2677 = Pair$new$($2676, 1n);
                var $2675 = $2677;
                break;
            case 'i':
                var $2678 = self.slice(0, -1);
                var self = $2678;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $2680 = self.slice(0, -1);
                        var self = Litereum$deserialize$varlen$go$($2680);
                        switch (self._) {
                            case 'Pair.new':
                                var $2682 = self.fst;
                                var $2683 = self.snd;
                                var $2684 = Pair$new$($2682, ($2683 * 2n));
                                var $2681 = $2684;
                                break;
                        };
                        var $2679 = $2681;
                        break;
                    case 'i':
                        var $2685 = self.slice(0, -1);
                        var self = Litereum$deserialize$varlen$go$($2685);
                        switch (self._) {
                            case 'Pair.new':
                                var $2687 = self.fst;
                                var $2688 = self.snd;
                                var $2689 = Pair$new$($2687, (($2688 * 2n) + 1n));
                                var $2686 = $2689;
                                break;
                        };
                        var $2679 = $2686;
                        break;
                    case 'e':
                        var $2690 = Pair$new$($2678, 0n);
                        var $2679 = $2690;
                        break;
                };
                var $2675 = $2679;
                break;
            case 'e':
                var $2691 = Pair$new$(Bits$e, 0n);
                var $2675 = $2691;
                break;
        };
        return $2675;
    };
    const Litereum$deserialize$varlen$go = x0 => Litereum$deserialize$varlen$go$(x0);
    const Nat$sub = a0 => a1 => (a0 - a1 <= 0n ? 0n : a0 - a1);

    function Litereum$deserialize$varlen$(_bits$1) {
        var self = Litereum$deserialize$varlen$go$(_bits$1);
        switch (self._) {
            case 'Pair.new':
                var $2693 = self.fst;
                var $2694 = self.snd;
                var $2695 = Pair$new$($2693, ($2694 - 1n <= 0n ? 0n : $2694 - 1n));
                var $2692 = $2695;
                break;
        };
        return $2692;
    };
    const Litereum$deserialize$varlen = x0 => Litereum$deserialize$varlen$(x0);

    function Litereum$deserialize$name$(_world$1, _bits$2) {
        var self = _world$1;
        switch (self._) {
            case 'Litereum.World.new':
                var $2697 = self.index_to_name;
                var self = _bits$2;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $2699 = self.slice(0, -1);
                        var $2700 = Litereum$deserialize$name$new$($2699);
                        var $2698 = $2700;
                        break;
                    case 'i':
                        var $2701 = self.slice(0, -1);
                        var self = Litereum$deserialize$varlen$($2701);
                        switch (self._) {
                            case 'Pair.new':
                                var $2703 = self.fst;
                                var $2704 = self.snd;
                                var $2705 = Pair$new$($2703, Maybe$default$(Map$get$(Nat$show$($2704), $2697), ""));
                                var $2702 = $2705;
                                break;
                        };
                        var $2698 = $2702;
                        break;
                    case 'e':
                        var $2706 = Pair$new$(_bits$2, "");
                        var $2698 = $2706;
                        break;
                };
                var $2696 = $2698;
                break;
        };
        return $2696;
    };
    const Litereum$deserialize$name = x0 => x1 => Litereum$deserialize$name$(x0, x1);

    function Litereum$deserialize$list$(_item$2, _bits$3) {
        var self = _bits$3;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2708 = self.slice(0, -1);
                var $2709 = Pair$new$($2708, List$nil);
                var $2707 = $2709;
                break;
            case 'i':
                var $2710 = self.slice(0, -1);
                var self = _item$2($2710);
                switch (self._) {
                    case 'Pair.new':
                        var $2712 = self.fst;
                        var $2713 = self.snd;
                        var self = Litereum$deserialize$list$(_item$2, $2712);
                        switch (self._) {
                            case 'Pair.new':
                                var $2715 = self.fst;
                                var $2716 = self.snd;
                                var $2717 = Pair$new$($2715, List$cons$($2713, $2716));
                                var $2714 = $2717;
                                break;
                        };
                        var $2711 = $2714;
                        break;
                };
                var $2707 = $2711;
                break;
            case 'e':
                var $2718 = Pair$new$(Bits$e, List$nil);
                var $2707 = $2718;
                break;
        };
        return $2707;
    };
    const Litereum$deserialize$list = x0 => x1 => Litereum$deserialize$list$(x0, x1);

    function Litereum$deserialize$type$(_world$1, _bits$2) {
        var self = Litereum$deserialize$fixlen$(2n, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $2720 = self.fst;
                var $2721 = self.snd;
                var self = ($2721 === 0n);
                if (self) {
                    var $2723 = Pair$new$($2720, Litereum$Type$word);
                    var $2722 = $2723;
                } else {
                    var self = ($2721 === 1n);
                    if (self) {
                        var self = Litereum$deserialize$name$(_world$1, $2720);
                        switch (self._) {
                            case 'Pair.new':
                                var $2726 = self.fst;
                                var $2727 = self.snd;
                                var $2728 = Pair$new$($2726, Litereum$Type$data$($2727));
                                var $2725 = $2728;
                                break;
                        };
                        var $2724 = $2725;
                    } else {
                        var self = ($2721 === 2n);
                        if (self) {
                            var self = Litereum$deserialize$type$(_world$1, $2720);
                            switch (self._) {
                                case 'Pair.new':
                                    var $2731 = self.fst;
                                    var $2732 = self.snd;
                                    var $2733 = Pair$new$($2731, Litereum$Type$effect$($2732));
                                    var $2730 = $2733;
                                    break;
                            };
                            var $2729 = $2730;
                        } else {
                            var $2734 = Pair$new$($2720, Litereum$Type$word);
                            var $2729 = $2734;
                        };
                        var $2724 = $2729;
                    };
                    var $2722 = $2724;
                };
                var $2719 = $2722;
                break;
        };
        return $2719;
    };
    const Litereum$deserialize$type = x0 => x1 => Litereum$deserialize$type$(x0, x1);

    function Litereum$deserialize$constructor$(_world$1, _bits$2) {
        var self = Litereum$deserialize$name$(_world$1, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $2736 = self.fst;
                var $2737 = self.snd;
                var self = Litereum$deserialize$list$(Litereum$deserialize$name(_world$1), $2736);
                switch (self._) {
                    case 'Pair.new':
                        var $2739 = self.fst;
                        var $2740 = self.snd;
                        var self = Litereum$deserialize$list$(Litereum$deserialize$type(_world$1), $2739);
                        switch (self._) {
                            case 'Pair.new':
                                var $2742 = self.fst;
                                var $2743 = self.snd;
                                var $2744 = Pair$new$($2742, Litereum$Constructor$new$($2737, $2740, $2743));
                                var $2741 = $2744;
                                break;
                        };
                        var $2738 = $2741;
                        break;
                };
                var $2735 = $2738;
                break;
        };
        return $2735;
    };
    const Litereum$deserialize$constructor = x0 => x1 => Litereum$deserialize$constructor$(x0, x1);

    function Litereum$deserialize$data$(_world$1, _bits$2) {
        var self = Litereum$deserialize$name$(_world$1, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $2746 = self.fst;
                var $2747 = self.snd;
                var self = Litereum$deserialize$list$(Litereum$deserialize$constructor(_world$1), $2746);
                switch (self._) {
                    case 'Pair.new':
                        var $2749 = self.fst;
                        var $2750 = self.snd;
                        var $2751 = Pair$new$($2749, Litereum$Data$new$($2747, $2750));
                        var $2748 = $2751;
                        break;
                };
                var $2745 = $2748;
                break;
        };
        return $2745;
    };
    const Litereum$deserialize$data = x0 => x1 => Litereum$deserialize$data$(x0, x1);
    const U64$from_nat = a0 => (a0 & 0xFFFFFFFFFFFFFFFFn);

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
                        var $2752 = self.head;
                        var $2753 = self.tail;
                        var self = _index$2;
                        if (self === 0n) {
                            var $2755 = Maybe$some$($2752);
                            var $2754 = $2755;
                        } else {
                            var $2756 = (self - 1n);
                            var $2757 = List$get$($2756, $2753);
                            var $2754 = $2757;
                        };
                        return $2754;
                    case 'List.nil':
                        var $2758 = Maybe$none;
                        return $2758;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$get = x0 => x1 => List$get$(x0, x1);

    function Litereum$deserialize$name$local$(_world$1, _vars$2, _bits$3) {
        var self = Litereum$deserialize$varlen$(_bits$3);
        switch (self._) {
            case 'Pair.new':
                var $2760 = self.fst;
                var $2761 = self.snd;
                var $2762 = Pair$new$($2760, Maybe$default$(List$get$($2761, _vars$2), ""));
                var $2759 = $2762;
                break;
        };
        return $2759;
    };
    const Litereum$deserialize$name$local = x0 => x1 => x2 => Litereum$deserialize$name$local$(x0, x1, x2);

    function Litereum$deserialize$cases$(_world$1, _vars$2, _name$3, _ctors$4, _bits$5) {
        var self = _ctors$4;
        switch (self._) {
            case 'List.cons':
                var $2764 = self.head;
                var $2765 = self.tail;
                var _flds$8 = List$map$(a1 => ((_name$3 + ".") + a1), (() => {
                    var self = $2764;
                    switch (self._) {
                        case 'Litereum.Constructor.new':
                            var $2767 = self.field_names;
                            var $2768 = $2767;
                            return $2768;
                    };
                })());
                var self = Litereum$deserialize$term$(_world$1, List$concat$(List$reverse$(_flds$8), _vars$2), _bits$5);
                switch (self._) {
                    case 'Pair.new':
                        var $2769 = self.fst;
                        var $2770 = self.snd;
                        var self = Litereum$deserialize$cases$(_world$1, _vars$2, _name$3, $2765, $2769);
                        switch (self._) {
                            case 'Pair.new':
                                var $2772 = self.fst;
                                var $2773 = self.snd;
                                var $2774 = Pair$new$($2772, List$cons$($2770, $2773));
                                var $2771 = $2774;
                                break;
                        };
                        var $2766 = $2771;
                        break;
                };
                var $2763 = $2766;
                break;
            case 'List.nil':
                var $2775 = Pair$new$(_bits$5, List$nil);
                var $2763 = $2775;
                break;
        };
        return $2763;
    };
    const Litereum$deserialize$cases = x0 => x1 => x2 => x3 => x4 => Litereum$deserialize$cases$(x0, x1, x2, x3, x4);

    function Litereum$deserialize$term$(_world$1, _vars$2, _bits$3) {
        var self = _bits$3;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2777 = self.slice(0, -1);
                var self = Litereum$deserialize$name$local$(_world$1, _vars$2, $2777);
                switch (self._) {
                    case 'Pair.new':
                        var $2779 = self.fst;
                        var $2780 = self.snd;
                        var $2781 = Pair$new$($2779, Litereum$Term$var$($2780));
                        var $2778 = $2781;
                        break;
                };
                var $2776 = $2778;
                break;
            case 'i':
                var $2782 = self.slice(0, -1);
                var self = Litereum$deserialize$fixlen$(3n, $2782);
                switch (self._) {
                    case 'Pair.new':
                        var $2784 = self.fst;
                        var $2785 = self.snd;
                        var self = ($2785 === 0n);
                        if (self) {
                            var self = Litereum$deserialize$name$(_world$1, $2784);
                            switch (self._) {
                                case 'Pair.new':
                                    var $2788 = self.fst;
                                    var $2789 = self.snd;
                                    var self = Litereum$deserialize$type$(_world$1, $2788);
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $2791 = self.fst;
                                            var $2792 = self.snd;
                                            var self = Litereum$deserialize$term$(_world$1, _vars$2, $2791);
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $2794 = self.fst;
                                                    var $2795 = self.snd;
                                                    var self = Litereum$deserialize$term$(_world$1, List$cons$($2789, _vars$2), $2794);
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $2797 = self.fst;
                                                            var $2798 = self.snd;
                                                            var $2799 = Pair$new$($2797, Litereum$Term$let$($2789, $2792, $2795, $2798));
                                                            var $2796 = $2799;
                                                            break;
                                                    };
                                                    var $2793 = $2796;
                                                    break;
                                            };
                                            var $2790 = $2793;
                                            break;
                                    };
                                    var $2787 = $2790;
                                    break;
                            };
                            var $2786 = $2787;
                        } else {
                            var self = ($2785 === 1n);
                            if (self) {
                                var self = Litereum$deserialize$name$(_world$1, $2784);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2802 = self.fst;
                                        var $2803 = self.snd;
                                        var self = Litereum$deserialize$list$(Litereum$deserialize$term(_world$1)(_vars$2), $2802);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $2805 = self.fst;
                                                var $2806 = self.snd;
                                                var $2807 = Pair$new$($2805, Litereum$Term$call$($2803, $2806));
                                                var $2804 = $2807;
                                                break;
                                        };
                                        var $2801 = $2804;
                                        break;
                                };
                                var $2800 = $2801;
                            } else {
                                var self = ($2785 === 2n);
                                if (self) {
                                    var self = Litereum$deserialize$name$(_world$1, $2784);
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $2810 = self.fst;
                                            var $2811 = self.snd;
                                            var self = Litereum$deserialize$list$(Litereum$deserialize$term(_world$1)(_vars$2), $2810);
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $2813 = self.fst;
                                                    var $2814 = self.snd;
                                                    var $2815 = Pair$new$($2813, Litereum$Term$create$($2811, $2814));
                                                    var $2812 = $2815;
                                                    break;
                                            };
                                            var $2809 = $2812;
                                            break;
                                    };
                                    var $2808 = $2809;
                                } else {
                                    var self = ($2785 === 3n);
                                    if (self) {
                                        var self = Litereum$deserialize$name$local$(_world$1, _vars$2, $2784);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $2818 = self.fst;
                                                var $2819 = self.snd;
                                                var self = Litereum$deserialize$name$(_world$1, $2818);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $2821 = self.fst;
                                                        var $2822 = self.snd;
                                                        var self = Litereum$deserialize$cases$(_world$1, _vars$2, $2819, Maybe$default$(Litereum$get_constructors$(_world$1, $2822), List$nil), $2821);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $2824 = self.fst;
                                                                var $2825 = self.snd;
                                                                var $2826 = Pair$new$($2824, Litereum$Term$match$($2819, $2822, $2825));
                                                                var $2823 = $2826;
                                                                break;
                                                        };
                                                        var $2820 = $2823;
                                                        break;
                                                };
                                                var $2817 = $2820;
                                                break;
                                        };
                                        var $2816 = $2817;
                                    } else {
                                        var self = ($2785 === 4n);
                                        if (self) {
                                            var self = Litereum$deserialize$fixlen$(64n, $2784);
                                            switch (self._) {
                                                case 'Pair.new':
                                                    var $2829 = self.fst;
                                                    var $2830 = self.snd;
                                                    var $2831 = Pair$new$($2829, Litereum$Term$word$(($2830 & 0xFFFFFFFFFFFFFFFFn)));
                                                    var $2828 = $2831;
                                                    break;
                                            };
                                            var $2827 = $2828;
                                        } else {
                                            var self = ($2785 === 5n);
                                            if (self) {
                                                var self = Litereum$deserialize$term$(_world$1, _vars$2, $2784);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $2834 = self.fst;
                                                        var $2835 = self.snd;
                                                        var self = Litereum$deserialize$term$(_world$1, _vars$2, $2834);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $2837 = self.fst;
                                                                var $2838 = self.snd;
                                                                var self = Litereum$deserialize$term$(_world$1, _vars$2, $2837);
                                                                switch (self._) {
                                                                    case 'Pair.new':
                                                                        var $2840 = self.fst;
                                                                        var $2841 = self.snd;
                                                                        var self = Litereum$deserialize$term$(_world$1, _vars$2, $2840);
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $2843 = self.fst;
                                                                                var $2844 = self.snd;
                                                                                var self = Litereum$deserialize$term$(_world$1, _vars$2, $2843);
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $2846 = self.fst;
                                                                                        var $2847 = self.snd;
                                                                                        var $2848 = Pair$new$($2846, Litereum$Term$compare$($2835, $2838, $2841, $2844, $2847));
                                                                                        var $2845 = $2848;
                                                                                        break;
                                                                                };
                                                                                var $2842 = $2845;
                                                                                break;
                                                                        };
                                                                        var $2839 = $2842;
                                                                        break;
                                                                };
                                                                var $2836 = $2839;
                                                                break;
                                                        };
                                                        var $2833 = $2836;
                                                        break;
                                                };
                                                var $2832 = $2833;
                                            } else {
                                                var self = ($2785 === 6n);
                                                if (self) {
                                                    var self = Litereum$deserialize$fixlen$(3n, $2784);
                                                    switch (self._) {
                                                        case 'Pair.new':
                                                            var $2851 = self.fst;
                                                            var $2852 = self.snd;
                                                            var self = Litereum$deserialize$term$(_world$1, _vars$2, $2851);
                                                            switch (self._) {
                                                                case 'Pair.new':
                                                                    var $2854 = self.fst;
                                                                    var $2855 = self.snd;
                                                                    var self = Litereum$deserialize$term$(_world$1, _vars$2, $2854);
                                                                    switch (self._) {
                                                                        case 'Pair.new':
                                                                            var $2857 = self.fst;
                                                                            var $2858 = self.snd;
                                                                            var self = ($2852 === 0n);
                                                                            if (self) {
                                                                                var $2860 = Litereum$Operation$add;
                                                                                var _oper$13 = $2860;
                                                                            } else {
                                                                                var self = ($2852 === 1n);
                                                                                if (self) {
                                                                                    var $2862 = Litereum$Operation$sub;
                                                                                    var $2861 = $2862;
                                                                                } else {
                                                                                    var self = ($2852 === 2n);
                                                                                    if (self) {
                                                                                        var $2864 = Litereum$Operation$mul;
                                                                                        var $2863 = $2864;
                                                                                    } else {
                                                                                        var self = ($2852 === 3n);
                                                                                        if (self) {
                                                                                            var $2866 = Litereum$Operation$div;
                                                                                            var $2865 = $2866;
                                                                                        } else {
                                                                                            var self = ($2852 === 4n);
                                                                                            if (self) {
                                                                                                var $2868 = Litereum$Operation$mod;
                                                                                                var $2867 = $2868;
                                                                                            } else {
                                                                                                var self = ($2852 === 5n);
                                                                                                if (self) {
                                                                                                    var $2870 = Litereum$Operation$or;
                                                                                                    var $2869 = $2870;
                                                                                                } else {
                                                                                                    var self = ($2852 === 6n);
                                                                                                    if (self) {
                                                                                                        var $2872 = Litereum$Operation$and;
                                                                                                        var $2871 = $2872;
                                                                                                    } else {
                                                                                                        var self = ($2852 === 7n);
                                                                                                        if (self) {
                                                                                                            var $2874 = Litereum$Operation$xor;
                                                                                                            var $2873 = $2874;
                                                                                                        } else {
                                                                                                            var $2875 = Litereum$Operation$add;
                                                                                                            var $2873 = $2875;
                                                                                                        };
                                                                                                        var $2871 = $2873;
                                                                                                    };
                                                                                                    var $2869 = $2871;
                                                                                                };
                                                                                                var $2867 = $2869;
                                                                                            };
                                                                                            var $2865 = $2867;
                                                                                        };
                                                                                        var $2863 = $2865;
                                                                                    };
                                                                                    var $2861 = $2863;
                                                                                };
                                                                                var _oper$13 = $2861;
                                                                            };
                                                                            var $2859 = Pair$new$($2857, Litereum$Term$operate$(_oper$13, $2855, $2858));
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
                                                    var self = ($2785 === 7n);
                                                    if (self) {
                                                        var self = Litereum$deserialize$fixlen$(2n, $2784);
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $2878 = self.fst;
                                                                var $2879 = self.snd;
                                                                var self = ($2879 === 0n);
                                                                if (self) {
                                                                    var self = Litereum$deserialize$name$(_world$1, $2878);
                                                                    switch (self._) {
                                                                        case 'Pair.new':
                                                                            var $2882 = self.fst;
                                                                            var $2883 = self.snd;
                                                                            var self = Litereum$deserialize$type$(_world$1, $2882);
                                                                            switch (self._) {
                                                                                case 'Pair.new':
                                                                                    var $2885 = self.fst;
                                                                                    var $2886 = self.snd;
                                                                                    var self = Litereum$deserialize$term$(_world$1, _vars$2, $2885);
                                                                                    switch (self._) {
                                                                                        case 'Pair.new':
                                                                                            var $2888 = self.fst;
                                                                                            var $2889 = self.snd;
                                                                                            var self = Litereum$deserialize$term$(_world$1, List$cons$($2883, _vars$2), $2888);
                                                                                            switch (self._) {
                                                                                                case 'Pair.new':
                                                                                                    var $2891 = self.fst;
                                                                                                    var $2892 = self.snd;
                                                                                                    var $2893 = Pair$new$($2891, Litereum$Term$run$($2883, $2886, $2889, $2892));
                                                                                                    var $2890 = $2893;
                                                                                                    break;
                                                                                            };
                                                                                            var $2887 = $2890;
                                                                                            break;
                                                                                    };
                                                                                    var $2884 = $2887;
                                                                                    break;
                                                                            };
                                                                            var $2881 = $2884;
                                                                            break;
                                                                    };
                                                                    var $2880 = $2881;
                                                                } else {
                                                                    var self = ($2879 === 1n);
                                                                    if (self) {
                                                                        var self = Litereum$deserialize$name$(_world$1, $2878);
                                                                        switch (self._) {
                                                                            case 'Pair.new':
                                                                                var $2896 = self.fst;
                                                                                var $2897 = self.snd;
                                                                                var self = Litereum$get_bond$(_world$1, $2897);
                                                                                switch (self._) {
                                                                                    case 'Maybe.some':
                                                                                        var $2899 = self.value;
                                                                                        var _bond$12 = $2899;
                                                                                        var self = _bond$12;
                                                                                        switch (self._) {
                                                                                            case 'Litereum.Bond.new':
                                                                                                var $2901 = self.input_names;
                                                                                                var _vrs2$19 = List$concat$(List$reverse$($2901), _vars$2);
                                                                                                var self = Litereum$deserialize$term$(_world$1, _vrs2$19, $2896);
                                                                                                switch (self._) {
                                                                                                    case 'Pair.new':
                                                                                                        var $2903 = self.fst;
                                                                                                        var $2904 = self.snd;
                                                                                                        var self = Litereum$deserialize$term$(_world$1, _vars$2, $2903);
                                                                                                        switch (self._) {
                                                                                                            case 'Pair.new':
                                                                                                                var $2906 = self.fst;
                                                                                                                var $2907 = self.snd;
                                                                                                                var $2908 = Pair$new$($2906, Litereum$Term$bind$($2897, $2904, $2907));
                                                                                                                var $2905 = $2908;
                                                                                                                break;
                                                                                                        };
                                                                                                        var $2902 = $2905;
                                                                                                        break;
                                                                                                };
                                                                                                var $2900 = $2902;
                                                                                                break;
                                                                                        };
                                                                                        var $2898 = $2900;
                                                                                        break;
                                                                                    case 'Maybe.none':
                                                                                        var $2909 = Pair$new$($2896, Litereum$Term$word$(0n));
                                                                                        var $2898 = $2909;
                                                                                        break;
                                                                                };
                                                                                var $2895 = $2898;
                                                                                break;
                                                                        };
                                                                        var $2894 = $2895;
                                                                    } else {
                                                                        var self = ($2879 === 2n);
                                                                        if (self) {
                                                                            var self = Litereum$deserialize$term$(_world$1, _vars$2, $2878);
                                                                            switch (self._) {
                                                                                case 'Pair.new':
                                                                                    var $2912 = self.fst;
                                                                                    var $2913 = self.snd;
                                                                                    var $2914 = Pair$new$($2912, Litereum$Term$return$($2913));
                                                                                    var $2911 = $2914;
                                                                                    break;
                                                                            };
                                                                            var $2910 = $2911;
                                                                        } else {
                                                                            var $2915 = Pair$new$($2878, Litereum$Term$word$(0n));
                                                                            var $2910 = $2915;
                                                                        };
                                                                        var $2894 = $2910;
                                                                    };
                                                                    var $2880 = $2894;
                                                                };
                                                                var $2877 = $2880;
                                                                break;
                                                        };
                                                        var $2876 = $2877;
                                                    } else {
                                                        var $2916 = Pair$new$($2784, Litereum$Term$word$(0n));
                                                        var $2876 = $2916;
                                                    };
                                                    var $2849 = $2876;
                                                };
                                                var $2832 = $2849;
                                            };
                                            var $2827 = $2832;
                                        };
                                        var $2816 = $2827;
                                    };
                                    var $2808 = $2816;
                                };
                                var $2800 = $2808;
                            };
                            var $2786 = $2800;
                        };
                        var $2783 = $2786;
                        break;
                };
                var $2776 = $2783;
                break;
            case 'e':
                var $2917 = Pair$new$(_bits$3, Litereum$Term$word$(0n));
                var $2776 = $2917;
                break;
        };
        return $2776;
    };
    const Litereum$deserialize$term = x0 => x1 => x2 => Litereum$deserialize$term$(x0, x1, x2);

    function Litereum$deserialize$bond$(_world$1, _bits$2) {
        var self = Litereum$deserialize$name$(_world$1, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $2919 = self.fst;
                var $2920 = self.snd;
                var self = Litereum$deserialize$list$(Litereum$deserialize$name(_world$1), $2919);
                switch (self._) {
                    case 'Pair.new':
                        var $2922 = self.fst;
                        var $2923 = self.snd;
                        var self = Litereum$deserialize$list$(Litereum$deserialize$type(_world$1), $2922);
                        switch (self._) {
                            case 'Pair.new':
                                var $2925 = self.fst;
                                var $2926 = self.snd;
                                var self = Litereum$deserialize$type$(_world$1, $2925);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2928 = self.fst;
                                        var $2929 = self.snd;
                                        var self = Litereum$deserialize$term$(_world$1, List$reverse$($2923), $2928);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $2931 = self.fst;
                                                var $2932 = self.snd;
                                                var self = Litereum$deserialize$list$(Litereum$deserialize$name(_world$1), $2931);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $2934 = self.fst;
                                                        var $2935 = self.snd;
                                                        var $2936 = Pair$new$($2934, Litereum$Bond$new$($2920, $2923, $2926, $2929, $2932, $2935));
                                                        var $2933 = $2936;
                                                        break;
                                                };
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
        return $2918;
    };
    const Litereum$deserialize$bond = x0 => x1 => Litereum$deserialize$bond$(x0, x1);

    function Litereum$deserialize$eval$(_world$1, _bits$2) {
        var self = Litereum$deserialize$term$(_world$1, List$nil, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $2938 = self.fst;
                var $2939 = self.snd;
                var self = Litereum$deserialize$type$(_world$1, $2938);
                switch (self._) {
                    case 'Pair.new':
                        var $2941 = self.fst;
                        var $2942 = self.snd;
                        var $2943 = Pair$new$($2941, Litereum$Eval$new$($2939, $2942));
                        var $2940 = $2943;
                        break;
                };
                var $2937 = $2940;
                break;
        };
        return $2937;
    };
    const Litereum$deserialize$eval = x0 => x1 => Litereum$deserialize$eval$(x0, x1);

    function Litereum$deserialize$transaction$(_world$1, _bits$2) {
        var self = Litereum$deserialize$fixlen$(2n, _bits$2);
        switch (self._) {
            case 'Pair.new':
                var $2945 = self.fst;
                var $2946 = self.snd;
                var self = ($2946 === 0n);
                if (self) {
                    var self = Litereum$deserialize$name$new$($2945);
                    switch (self._) {
                        case 'Pair.new':
                            var $2949 = self.fst;
                            var $2950 = self.snd;
                            var $2951 = Pair$new$($2949, Litereum$Transaction$new_name$($2950));
                            var $2948 = $2951;
                            break;
                    };
                    var $2947 = $2948;
                } else {
                    var self = ($2946 === 1n);
                    if (self) {
                        var self = Litereum$deserialize$data$(_world$1, $2945);
                        switch (self._) {
                            case 'Pair.new':
                                var $2954 = self.fst;
                                var $2955 = self.snd;
                                var $2956 = Pair$new$($2954, Litereum$Transaction$new_data$($2955));
                                var $2953 = $2956;
                                break;
                        };
                        var $2952 = $2953;
                    } else {
                        var self = ($2946 === 2n);
                        if (self) {
                            var self = Litereum$deserialize$bond$(_world$1, $2945);
                            switch (self._) {
                                case 'Pair.new':
                                    var $2959 = self.fst;
                                    var $2960 = self.snd;
                                    var $2961 = Pair$new$($2959, Litereum$Transaction$new_bond$($2960));
                                    var $2958 = $2961;
                                    break;
                            };
                            var $2957 = $2958;
                        } else {
                            var self = ($2946 === 3n);
                            if (self) {
                                var self = Litereum$deserialize$eval$(_world$1, $2945);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $2964 = self.fst;
                                        var $2965 = self.snd;
                                        var $2966 = Pair$new$($2964, Litereum$Transaction$new_eval$($2965));
                                        var $2963 = $2966;
                                        break;
                                };
                                var $2962 = $2963;
                            } else {
                                var $2967 = Pair$new$($2945, Litereum$Transaction$new_name$(""));
                                var $2962 = $2967;
                            };
                            var $2957 = $2962;
                        };
                        var $2952 = $2957;
                    };
                    var $2947 = $2952;
                };
                var $2944 = $2947;
                break;
        };
        return $2944;
    };
    const Litereum$deserialize$transaction = x0 => x1 => Litereum$deserialize$transaction$(x0, x1);

    function Litereum$deserialize$block$(_world$1, _bits$2) {
        var self = Bits$is_empty$(_bits$2);
        if (self) {
            var $2969 = Pair$new$(Bits$e, List$nil);
            var $2968 = $2969;
        } else {
            var self = Litereum$deserialize$transaction$(_world$1, _bits$2);
            switch (self._) {
                case 'Pair.new':
                    var $2971 = self.fst;
                    var $2972 = self.snd;
                    var self = Litereum$deserialize$block$(_world$1, $2971);
                    switch (self._) {
                        case 'Pair.new':
                            var $2974 = self.fst;
                            var $2975 = self.snd;
                            var $2976 = Pair$new$($2974, List$cons$($2972, $2975));
                            var $2973 = $2976;
                            break;
                    };
                    var $2970 = $2973;
                    break;
            };
            var $2968 = $2970;
        };
        return $2968;
    };
    const Litereum$deserialize$block = x0 => x1 => Litereum$deserialize$block$(x0, x1);

    function Bits$hex$encode$(_x$1) {
        var self = _x$1;
        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
            case 'o':
                var $2978 = self.slice(0, -1);
                var self = $2978;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $2980 = self.slice(0, -1);
                        var self = $2980;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $2982 = self.slice(0, -1);
                                var self = $2982;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $2984 = self.slice(0, -1);
                                        var $2985 = ("0" + Bits$hex$encode$($2984));
                                        var $2983 = $2985;
                                        break;
                                    case 'i':
                                        var $2986 = self.slice(0, -1);
                                        var $2987 = ("8" + Bits$hex$encode$($2986));
                                        var $2983 = $2987;
                                        break;
                                    case 'e':
                                        var $2988 = "0";
                                        var $2983 = $2988;
                                        break;
                                };
                                var $2981 = $2983;
                                break;
                            case 'i':
                                var $2989 = self.slice(0, -1);
                                var self = $2989;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $2991 = self.slice(0, -1);
                                        var $2992 = ("4" + Bits$hex$encode$($2991));
                                        var $2990 = $2992;
                                        break;
                                    case 'i':
                                        var $2993 = self.slice(0, -1);
                                        var $2994 = ("c" + Bits$hex$encode$($2993));
                                        var $2990 = $2994;
                                        break;
                                    case 'e':
                                        var $2995 = "4";
                                        var $2990 = $2995;
                                        break;
                                };
                                var $2981 = $2990;
                                break;
                            case 'e':
                                var $2996 = "0";
                                var $2981 = $2996;
                                break;
                        };
                        var $2979 = $2981;
                        break;
                    case 'i':
                        var $2997 = self.slice(0, -1);
                        var self = $2997;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $2999 = self.slice(0, -1);
                                var self = $2999;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3001 = self.slice(0, -1);
                                        var $3002 = ("2" + Bits$hex$encode$($3001));
                                        var $3000 = $3002;
                                        break;
                                    case 'i':
                                        var $3003 = self.slice(0, -1);
                                        var $3004 = ("a" + Bits$hex$encode$($3003));
                                        var $3000 = $3004;
                                        break;
                                    case 'e':
                                        var $3005 = "2";
                                        var $3000 = $3005;
                                        break;
                                };
                                var $2998 = $3000;
                                break;
                            case 'i':
                                var $3006 = self.slice(0, -1);
                                var self = $3006;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3008 = self.slice(0, -1);
                                        var $3009 = ("6" + Bits$hex$encode$($3008));
                                        var $3007 = $3009;
                                        break;
                                    case 'i':
                                        var $3010 = self.slice(0, -1);
                                        var $3011 = ("e" + Bits$hex$encode$($3010));
                                        var $3007 = $3011;
                                        break;
                                    case 'e':
                                        var $3012 = "6";
                                        var $3007 = $3012;
                                        break;
                                };
                                var $2998 = $3007;
                                break;
                            case 'e':
                                var $3013 = "2";
                                var $2998 = $3013;
                                break;
                        };
                        var $2979 = $2998;
                        break;
                    case 'e':
                        var $3014 = "0";
                        var $2979 = $3014;
                        break;
                };
                var $2977 = $2979;
                break;
            case 'i':
                var $3015 = self.slice(0, -1);
                var self = $3015;
                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                    case 'o':
                        var $3017 = self.slice(0, -1);
                        var self = $3017;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $3019 = self.slice(0, -1);
                                var self = $3019;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3021 = self.slice(0, -1);
                                        var $3022 = ("1" + Bits$hex$encode$($3021));
                                        var $3020 = $3022;
                                        break;
                                    case 'i':
                                        var $3023 = self.slice(0, -1);
                                        var $3024 = ("9" + Bits$hex$encode$($3023));
                                        var $3020 = $3024;
                                        break;
                                    case 'e':
                                        var $3025 = "1";
                                        var $3020 = $3025;
                                        break;
                                };
                                var $3018 = $3020;
                                break;
                            case 'i':
                                var $3026 = self.slice(0, -1);
                                var self = $3026;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3028 = self.slice(0, -1);
                                        var $3029 = ("5" + Bits$hex$encode$($3028));
                                        var $3027 = $3029;
                                        break;
                                    case 'i':
                                        var $3030 = self.slice(0, -1);
                                        var $3031 = ("d" + Bits$hex$encode$($3030));
                                        var $3027 = $3031;
                                        break;
                                    case 'e':
                                        var $3032 = "5";
                                        var $3027 = $3032;
                                        break;
                                };
                                var $3018 = $3027;
                                break;
                            case 'e':
                                var $3033 = "1";
                                var $3018 = $3033;
                                break;
                        };
                        var $3016 = $3018;
                        break;
                    case 'i':
                        var $3034 = self.slice(0, -1);
                        var self = $3034;
                        switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                            case 'o':
                                var $3036 = self.slice(0, -1);
                                var self = $3036;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3038 = self.slice(0, -1);
                                        var $3039 = ("3" + Bits$hex$encode$($3038));
                                        var $3037 = $3039;
                                        break;
                                    case 'i':
                                        var $3040 = self.slice(0, -1);
                                        var $3041 = ("b" + Bits$hex$encode$($3040));
                                        var $3037 = $3041;
                                        break;
                                    case 'e':
                                        var $3042 = "3";
                                        var $3037 = $3042;
                                        break;
                                };
                                var $3035 = $3037;
                                break;
                            case 'i':
                                var $3043 = self.slice(0, -1);
                                var self = $3043;
                                switch (self.length === 0 ? 'e' : self[self.length - 1] === '0' ? 'o' : 'i') {
                                    case 'o':
                                        var $3045 = self.slice(0, -1);
                                        var $3046 = ("7" + Bits$hex$encode$($3045));
                                        var $3044 = $3046;
                                        break;
                                    case 'i':
                                        var $3047 = self.slice(0, -1);
                                        var $3048 = ("f" + Bits$hex$encode$($3047));
                                        var $3044 = $3048;
                                        break;
                                    case 'e':
                                        var $3049 = "7";
                                        var $3044 = $3049;
                                        break;
                                };
                                var $3035 = $3044;
                                break;
                            case 'e':
                                var $3050 = "3";
                                var $3035 = $3050;
                                break;
                        };
                        var $3016 = $3035;
                        break;
                    case 'e':
                        var $3051 = "1";
                        var $3016 = $3051;
                        break;
                };
                var $2977 = $3016;
                break;
            case 'e':
                var $3052 = "";
                var $2977 = $3052;
                break;
        };
        return $2977;
    };
    const Bits$hex$encode = x0 => Bits$hex$encode$(x0);
    const Bits$eql = a0 => a1 => (a1 === a0);

    function BBT$(_K$1, _V$2) {
        var $3053 = null;
        return $3053;
    };
    const BBT = x0 => x1 => BBT$(x0, x1);

    function Map$(_V$1) {
        var $3054 = null;
        return $3054;
    };
    const Map = x0 => Map$(x0);

    function Litereum$World$new$(_name_count$1, _name_to_index$2, _index_to_name$3, _entry$4) {
        var $3055 = ({
            _: 'Litereum.World.new',
            'name_count': _name_count$1,
            'name_to_index': _name_to_index$2,
            'index_to_name': _index_to_name$3,
            'entry': _entry$4
        });
        return $3055;
    };
    const Litereum$World$new = x0 => x1 => x2 => x3 => Litereum$World$new$(x0, x1, x2, x3);

    function BBT$bin$(_size$3, _key$4, _val$5, _left$6, _right$7) {
        var $3056 = ({
            _: 'BBT.bin',
            'size': _size$3,
            'key': _key$4,
            'val': _val$5,
            'left': _left$6,
            'right': _right$7
        });
        return $3056;
    };
    const BBT$bin = x0 => x1 => x2 => x3 => x4 => BBT$bin$(x0, x1, x2, x3, x4);

    function U32$new$(_value$1) {
        var $3057 = word_to_u32(_value$1);
        return $3057;
    };
    const U32$new = x0 => U32$new$(x0);
    const Nat$to_u32 = a0 => (Number(a0) >>> 0);
    const BBT$tip = ({
        _: 'BBT.tip'
    });

    function BBT$singleton$(_key$3, _val$4) {
        var $3058 = BBT$bin$(1, _key$3, _val$4, BBT$tip, BBT$tip);
        return $3058;
    };
    const BBT$singleton = x0 => x1 => BBT$singleton$(x0, x1);

    function BBT$size$(_map$3) {
        var self = _map$3;
        switch (self._) {
            case 'BBT.bin':
                var $3060 = self.size;
                var $3061 = $3060;
                var $3059 = $3061;
                break;
            case 'BBT.tip':
                var $3062 = 0;
                var $3059 = $3062;
                break;
        };
        return $3059;
    };
    const BBT$size = x0 => BBT$size$(x0);
    const U32$add = a0 => a1 => ((a0 + a1) >>> 0);

    function Word$shift_left$one$go$(_word$2, _prev$3) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $3064 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $3066 = Word$i$(Word$shift_left$one$go$($3064, Bool$false));
                    var $3065 = $3066;
                } else {
                    var $3067 = Word$o$(Word$shift_left$one$go$($3064, Bool$false));
                    var $3065 = $3067;
                };
                var $3063 = $3065;
                break;
            case 'Word.i':
                var $3068 = self.pred;
                var self = _prev$3;
                if (self) {
                    var $3070 = Word$i$(Word$shift_left$one$go$($3068, Bool$true));
                    var $3069 = $3070;
                } else {
                    var $3071 = Word$o$(Word$shift_left$one$go$($3068, Bool$true));
                    var $3069 = $3071;
                };
                var $3063 = $3069;
                break;
            case 'Word.e':
                var $3072 = Word$e;
                var $3063 = $3072;
                break;
        };
        return $3063;
    };
    const Word$shift_left$one$go = x0 => x1 => Word$shift_left$one$go$(x0, x1);

    function Word$shift_left$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $3074 = self.pred;
                var $3075 = Word$o$(Word$shift_left$one$go$($3074, Bool$false));
                var $3073 = $3075;
                break;
            case 'Word.i':
                var $3076 = self.pred;
                var $3077 = Word$o$(Word$shift_left$one$go$($3076, Bool$true));
                var $3073 = $3077;
                break;
            case 'Word.e':
                var $3078 = Word$e;
                var $3073 = $3078;
                break;
        };
        return $3073;
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
                    var $3079 = _value$2;
                    return $3079;
                } else {
                    var $3080 = (self - 1n);
                    var $3081 = Word$shift_left$(Word$shift_left$one$(_value$2), $3080);
                    return $3081;
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
                        var $3082 = self.pred;
                        var $3083 = Word$mul$go$($3082, Word$shift_left$(_b$4, 1n), _acc$5);
                        return $3083;
                    case 'Word.i':
                        var $3084 = self.pred;
                        var $3085 = Word$mul$go$($3084, Word$shift_left$(_b$4, 1n), Word$add$(_b$4, _acc$5));
                        return $3085;
                    case 'Word.e':
                        var $3086 = _acc$5;
                        return $3086;
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
                var $3088 = self.pred;
                var $3089 = Word$o$(Word$to_zero$($3088));
                var $3087 = $3089;
                break;
            case 'Word.i':
                var $3090 = self.pred;
                var $3091 = Word$o$(Word$to_zero$($3090));
                var $3087 = $3091;
                break;
            case 'Word.e':
                var $3092 = Word$e;
                var $3087 = $3092;
                break;
        };
        return $3087;
    };
    const Word$to_zero = x0 => Word$to_zero$(x0);

    function Word$mul$(_a$2, _b$3) {
        var $3093 = Word$mul$go$(_a$2, _b$3, Word$to_zero$(_a$2));
        return $3093;
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
        var $3094 = BBT$bin$(_new_size$9, _key$3, _val$4, _left$5, _right$6);
        return $3094;
    };
    const BBT$node = x0 => x1 => x2 => x3 => BBT$node$(x0, x1, x2, x3);

    function Cmp$as_gtn$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
            case 'Cmp.eql':
                var $3096 = Bool$false;
                var $3095 = $3096;
                break;
            case 'Cmp.gtn':
                var $3097 = Bool$true;
                var $3095 = $3097;
                break;
        };
        return $3095;
    };
    const Cmp$as_gtn = x0 => Cmp$as_gtn$(x0);

    function Word$gtn$(_a$2, _b$3) {
        var $3098 = Cmp$as_gtn$(Word$cmp$(_a$2, _b$3));
        return $3098;
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
            var $3100 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
            var $3099 = $3100;
        } else {
            var self = (_size_r$8 > _w_x_size_l$10);
            if (self) {
                var self = _r$6;
                switch (self._) {
                    case 'BBT.bin':
                        var $3103 = self.key;
                        var $3104 = self.val;
                        var $3105 = self.left;
                        var $3106 = self.right;
                        var _size_rl$17 = BBT$size$($3105);
                        var _size_rr$18 = BBT$size$($3106);
                        var self = (_size_rl$17 < _size_rr$18);
                        if (self) {
                            var _new_key$19 = $3103;
                            var _new_val$20 = $3104;
                            var _new_left$21 = BBT$node$(_k$3, _v$4, _l$5, $3105);
                            var _new_right$22 = $3106;
                            var $3108 = BBT$node$(_new_key$19, _new_val$20, _new_left$21, _new_right$22);
                            var $3107 = $3108;
                        } else {
                            var self = $3105;
                            switch (self._) {
                                case 'BBT.bin':
                                    var $3110 = self.key;
                                    var $3111 = self.val;
                                    var $3112 = self.left;
                                    var $3113 = self.right;
                                    var _new_key$24 = $3110;
                                    var _new_val$25 = $3111;
                                    var _new_left$26 = BBT$node$(_k$3, _v$4, _l$5, $3112);
                                    var _new_right$27 = BBT$node$($3103, $3104, $3113, $3106);
                                    var $3114 = BBT$node$(_new_key$24, _new_val$25, _new_left$26, _new_right$27);
                                    var $3109 = $3114;
                                    break;
                                case 'BBT.tip':
                                    var $3115 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
                                    var $3109 = $3115;
                                    break;
                            };
                            var $3107 = $3109;
                        };
                        var $3102 = $3107;
                        break;
                    case 'BBT.tip':
                        var $3116 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
                        var $3102 = $3116;
                        break;
                };
                var $3101 = $3102;
            } else {
                var self = (_size_l$7 > _w_x_size_r$11);
                if (self) {
                    var self = _l$5;
                    switch (self._) {
                        case 'BBT.bin':
                            var $3119 = self.key;
                            var $3120 = self.val;
                            var $3121 = self.left;
                            var $3122 = self.right;
                            var _size_ll$17 = BBT$size$($3121);
                            var _size_lr$18 = BBT$size$($3122);
                            var self = (_size_lr$18 < _size_ll$17);
                            if (self) {
                                var _new_key$19 = $3119;
                                var _new_val$20 = $3120;
                                var _new_left$21 = $3121;
                                var _new_right$22 = BBT$node$(_k$3, _v$4, $3122, _r$6);
                                var $3124 = BBT$node$(_new_key$19, _new_val$20, _new_left$21, _new_right$22);
                                var $3123 = $3124;
                            } else {
                                var self = $3122;
                                switch (self._) {
                                    case 'BBT.bin':
                                        var $3126 = self.key;
                                        var $3127 = self.val;
                                        var $3128 = self.left;
                                        var $3129 = self.right;
                                        var _new_key$24 = $3126;
                                        var _new_val$25 = $3127;
                                        var _new_left$26 = BBT$node$($3119, $3120, $3121, $3128);
                                        var _new_right$27 = BBT$node$(_k$3, _v$4, $3129, _r$6);
                                        var $3130 = BBT$node$(_new_key$24, _new_val$25, _new_left$26, _new_right$27);
                                        var $3125 = $3130;
                                        break;
                                    case 'BBT.tip':
                                        var $3131 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
                                        var $3125 = $3131;
                                        break;
                                };
                                var $3123 = $3125;
                            };
                            var $3118 = $3123;
                            break;
                        case 'BBT.tip':
                            var $3132 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
                            var $3118 = $3132;
                            break;
                    };
                    var $3117 = $3118;
                } else {
                    var $3133 = BBT$node$(_k$3, _v$4, _l$5, _r$6);
                    var $3117 = $3133;
                };
                var $3101 = $3117;
            };
            var $3099 = $3101;
        };
        return $3099;
    };
    const BBT$balance = x0 => x1 => x2 => x3 => BBT$balance$(x0, x1, x2, x3);

    function BBT$insert$(_cmp$3, _key$4, _val$5, _map$6) {
        var self = _map$6;
        switch (self._) {
            case 'BBT.bin':
                var $3135 = self.key;
                var $3136 = self.val;
                var $3137 = self.left;
                var $3138 = self.right;
                var self = _cmp$3(_key$4)($3135);
                switch (self._) {
                    case 'Cmp.ltn':
                        var _new_key$12 = $3135;
                        var _new_val$13 = $3136;
                        var _new_left$14 = BBT$insert$(_cmp$3, _key$4, _val$5, $3137);
                        var _new_right$15 = $3138;
                        var $3140 = BBT$balance$(_new_key$12, _new_val$13, _new_left$14, _new_right$15);
                        var $3139 = $3140;
                        break;
                    case 'Cmp.eql':
                        var $3141 = BBT$node$(_key$4, _val$5, $3137, $3138);
                        var $3139 = $3141;
                        break;
                    case 'Cmp.gtn':
                        var _new_key$12 = $3135;
                        var _new_val$13 = $3136;
                        var _new_left$14 = $3137;
                        var _new_right$15 = BBT$insert$(_cmp$3, _key$4, _val$5, $3138);
                        var $3142 = BBT$balance$(_new_key$12, _new_val$13, _new_left$14, _new_right$15);
                        var $3139 = $3142;
                        break;
                };
                var $3134 = $3139;
                break;
            case 'BBT.tip':
                var $3143 = BBT$singleton$(_key$4, _val$5);
                var $3134 = $3143;
                break;
        };
        return $3134;
    };
    const BBT$insert = x0 => x1 => x2 => x3 => BBT$insert$(x0, x1, x2, x3);

    function Map$set$(_key$2, _val$3, _map$4) {
        var $3144 = BBT$insert$(String$cmp, _key$2, _val$3, _map$4);
        return $3144;
    };
    const Map$set = x0 => x1 => x2 => Map$set$(x0, x1, x2);

    function Litereum$Entry$data$(_value$1) {
        var $3145 = ({
            _: 'Litereum.Entry.data',
            'value': _value$1
        });
        return $3145;
    };
    const Litereum$Entry$data = x0 => Litereum$Entry$data$(x0);

    function Litereum$Entry$bond$(_value$1) {
        var $3146 = ({
            _: 'Litereum.Entry.bond',
            'value': _value$1
        });
        return $3146;
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
                        var $3147 = self.head;
                        var $3148 = self.tail;
                        var self = _vals$4;
                        switch (self._) {
                            case 'List.cons':
                                var $3150 = self.head;
                                var $3151 = self.tail;
                                var $3152 = Litereum$extend$(Map$set$($3147, $3150, _map$2), $3148, $3151);
                                var $3149 = $3152;
                                break;
                            case 'List.nil':
                                var $3153 = _map$2;
                                var $3149 = $3153;
                                break;
                        };
                        return $3149;
                    case 'List.nil':
                        var self = _vals$4;
                        switch (self._) {
                            case 'List.nil':
                            case 'List.cons':
                                var $3155 = _map$2;
                                var $3154 = $3155;
                                break;
                        };
                        return $3154;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Litereum$extend = x0 => x1 => x2 => Litereum$extend$(x0, x1, x2);

    function Pair$snd$(_pair$3) {
        var self = _pair$3;
        switch (self._) {
            case 'Pair.new':
                var $3157 = self.snd;
                var $3158 = $3157;
                var $3156 = $3158;
                break;
        };
        return $3156;
    };
    const Pair$snd = x0 => Pair$snd$(x0);

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
                        var $3159 = self.head;
                        var $3160 = self.tail;
                        var _key$8 = Pair$fst$($3159);
                        var _val$9 = Pair$snd$($3159);
                        var _new_acc$10 = BBT$insert$(_cmp$3, _key$8, _val$9, _acc$4);
                        var $3161 = BBT$from_list$go$(_cmp$3, _new_acc$10, $3160);
                        return $3161;
                    case 'List.nil':
                        var $3162 = _acc$4;
                        return $3162;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const BBT$from_list$go = x0 => x1 => x2 => BBT$from_list$go$(x0, x1, x2);

    function BBT$from_list$(_cmp$3, _xs$4) {
        var $3163 = BBT$from_list$go$(_cmp$3, BBT$tip, _xs$4);
        return $3163;
    };
    const BBT$from_list = x0 => x1 => BBT$from_list$(x0, x1);

    function Map$from_list$(_xs$2) {
        var $3164 = BBT$from_list$(String$cmp, _xs$2);
        return $3164;
    };
    const Map$from_list = x0 => Map$from_list$(x0);

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
                        var $3165 = self.name;
                        var self = _b$2;
                        switch (self._) {
                            case 'Litereum.Type.data':
                                var $3167 = self.name;
                                var $3168 = ($3165 === $3167);
                                var $3166 = $3168;
                                break;
                            case 'Litereum.Type.word':
                            case 'Litereum.Type.effect':
                                var $3169 = Bool$false;
                                var $3166 = $3169;
                                break;
                        };
                        return $3166;
                    case 'Litereum.Type.effect':
                        var $3170 = self.rety;
                        var self = _b$2;
                        switch (self._) {
                            case 'Litereum.Type.effect':
                                var $3172 = self.rety;
                                var $3173 = Litereum$equal$($3170, $3172);
                                var $3171 = $3173;
                                break;
                            case 'Litereum.Type.word':
                            case 'Litereum.Type.data':
                                var $3174 = Bool$false;
                                var $3171 = $3174;
                                break;
                        };
                        return $3171;
                    case 'Litereum.Type.word':
                        var self = _b$2;
                        switch (self._) {
                            case 'Litereum.Type.word':
                                var $3176 = Bool$true;
                                var $3175 = $3176;
                                break;
                            case 'Litereum.Type.data':
                            case 'Litereum.Type.effect':
                                var $3177 = Bool$false;
                                var $3175 = $3177;
                                break;
                        };
                        return $3175;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Litereum$equal = x0 => x1 => Litereum$equal$(x0, x1);

    function List$zip$(_as$3, _bs$4) {
        var self = _as$3;
        switch (self._) {
            case 'List.cons':
                var $3179 = self.head;
                var $3180 = self.tail;
                var self = _bs$4;
                switch (self._) {
                    case 'List.cons':
                        var $3182 = self.head;
                        var $3183 = self.tail;
                        var $3184 = List$cons$(Pair$new$($3179, $3182), List$zip$($3180, $3183));
                        var $3181 = $3184;
                        break;
                    case 'List.nil':
                        var $3185 = List$nil;
                        var $3181 = $3185;
                        break;
                };
                var $3178 = $3181;
                break;
            case 'List.nil':
                var $3186 = List$nil;
                var $3178 = $3186;
                break;
        };
        return $3178;
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
                        var $3187 = self.head;
                        var $3188 = self.tail;
                        var self = _cond$2($3187);
                        if (self) {
                            var $3190 = List$all$(_cond$2, $3188);
                            var $3189 = $3190;
                        } else {
                            var $3191 = Bool$false;
                            var $3189 = $3191;
                        };
                        return $3189;
                    case 'List.nil':
                        var $3192 = Bool$true;
                        return $3192;
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
                var $3194 = self.value;
                var $3195 = Maybe$some$(_f$4($3194));
                var $3193 = $3195;
                break;
            case 'Maybe.none':
                var $3196 = Maybe$none;
                var $3193 = $3196;
                break;
        };
        return $3193;
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
                        var $3197 = self.head;
                        var $3198 = self.tail;
                        var self = _f$3(_i$4)($3197);
                        if (self) {
                            var $3200 = Maybe$some$(Pair$new$(_i$4, $3197));
                            var $3199 = $3200;
                        } else {
                            var $3201 = List$ifind$go$($3198, _f$3, Nat$succ$(_i$4));
                            var $3199 = $3201;
                        };
                        return $3199;
                    case 'List.nil':
                        var $3202 = Maybe$none;
                        return $3202;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const List$ifind$go = x0 => x1 => x2 => List$ifind$go$(x0, x1, x2);

    function List$ifind$(_f$2, _xs$3) {
        var $3203 = List$ifind$go$(_xs$3, _f$2, Nat$zero);
        return $3203;
    };
    const List$ifind = x0 => x1 => List$ifind$(x0, x1);

    function Litereum$get_constructor_value$(_data$1, _name$2) {
        var $3204 = Maybe$mapped$(List$ifind$((_i$3 => _ctr$4 => {
            var $3205 = ((() => {
                var self = _ctr$4;
                switch (self._) {
                    case 'Litereum.Constructor.new':
                        var $3206 = self.name;
                        var $3207 = $3206;
                        return $3207;
                };
            })() === _name$2);
            return $3205;
        }), (() => {
            var self = _data$1;
            switch (self._) {
                case 'Litereum.Data.new':
                    var $3208 = self.constructors;
                    var $3209 = $3208;
                    return $3209;
            };
        })()), (_x$3 => {
            var self = _x$3;
            switch (self._) {
                case 'Pair.new':
                    var $3211 = self.snd;
                    var $3212 = $3211;
                    var $3210 = $3212;
                    break;
            };
            return $3210;
        }));
        return $3204;
    };
    const Litereum$get_constructor_value = x0 => x1 => Litereum$get_constructor_value$(x0, x1);
    const List$length = a0 => (list_length(a0));

    function List$zip_with$(_f$4, _as$5, _bs$6) {
        var self = _as$5;
        switch (self._) {
            case 'List.cons':
                var $3214 = self.head;
                var $3215 = self.tail;
                var self = _bs$6;
                switch (self._) {
                    case 'List.cons':
                        var $3217 = self.head;
                        var $3218 = self.tail;
                        var $3219 = List$cons$(_f$4($3214)($3217), List$zip_with$(_f$4, $3215, $3218));
                        var $3216 = $3219;
                        break;
                    case 'List.nil':
                        var $3220 = List$nil;
                        var $3216 = $3220;
                        break;
                };
                var $3213 = $3216;
                break;
            case 'List.nil':
                var $3221 = List$nil;
                var $3213 = $3221;
                break;
        };
        return $3213;
    };
    const List$zip_with = x0 => x1 => x2 => List$zip_with$(x0, x1, x2);

    function List$zipped_with$(_as$3, _bs$4, _f$6) {
        var $3222 = List$zip_with$(_f$6, _as$3, _bs$4);
        return $3222;
    };
    const List$zipped_with = x0 => x1 => x2 => List$zipped_with$(x0, x1, x2);

    function List$and$(_list$1) {
        var $3223 = List$all$((_x$2 => {
            var $3224 = _x$2;
            return $3224;
        }), _list$1);
        return $3223;
    };
    const List$and = x0 => List$and$(x0);

    function Litereum$check$(_context$1, _world$2, _term$3, _type$4) {
        var self = _context$1;
        switch (self._) {
            case 'BBT.tip':
                var self = _world$2;
                switch (self._) {
                    case 'Litereum.World.new':
                        var self = _term$3;
                        switch (self._) {
                            case 'Litereum.Term.var':
                                var $3228 = self.name;
                                var self = Map$get$($3228, _context$1);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $3230 = self.value;
                                        var $3231 = Litereum$equal$($3230, _type$4);
                                        var $3229 = $3231;
                                        break;
                                    case 'Maybe.none':
                                        var $3232 = Bool$false;
                                        var $3229 = $3232;
                                        break;
                                };
                                var $3227 = $3229;
                                break;
                            case 'Litereum.Term.call':
                                var $3233 = self.bond;
                                var $3234 = self.args;
                                var self = Litereum$get_bond$(_world$2, $3233);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $3236 = self.value;
                                        var _bond$12 = $3236;
                                        var self = _bond$12;
                                        switch (self._) {
                                            case 'Litereum.Bond.new':
                                                var $3238 = self.input_types;
                                                var $3239 = self.output_type;
                                                var _otyp$19 = Litereum$equal$($3239, _type$4);
                                                var _args$20 = List$zip$($3234, $3238);
                                                var _args$21 = List$all$((_x$21 => {
                                                    var $3241 = Litereum$check$(_context$1, _world$2, (() => {
                                                        var self = _x$21;
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $3242 = self.fst;
                                                                var $3243 = $3242;
                                                                return $3243;
                                                        };
                                                    })(), (() => {
                                                        var self = _x$21;
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $3244 = self.snd;
                                                                var $3245 = $3244;
                                                                return $3245;
                                                        };
                                                    })());
                                                    return $3241;
                                                }), _args$20);
                                                var $3240 = (_otyp$19 && _args$21);
                                                var $3237 = $3240;
                                                break;
                                        };
                                        var $3235 = $3237;
                                        break;
                                    case 'Maybe.none':
                                        var $3246 = Bool$false;
                                        var $3235 = $3246;
                                        break;
                                };
                                var $3227 = $3235;
                                break;
                            case 'Litereum.Term.let':
                                var $3247 = self.name;
                                var $3248 = self.type;
                                var $3249 = self.expr;
                                var $3250 = self.body;
                                var _expr$13 = Litereum$check$(_context$1, _world$2, $3249, $3248);
                                var _ctx2$14 = Map$set$($3247, $3248, _context$1);
                                var _body$15 = Litereum$check$(_ctx2$14, _world$2, $3250, _type$4);
                                var $3251 = (_expr$13 && _body$15);
                                var $3227 = $3251;
                                break;
                            case 'Litereum.Term.create':
                                var $3252 = self.ctor;
                                var $3253 = self.vals;
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.data':
                                        var $3255 = self.name;
                                        var self = Litereum$get_data$(_world$2, $3255);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $3257 = self.value;
                                                var _data$13 = $3257;
                                                var self = _data$13;
                                                switch (self._) {
                                                    case 'Litereum.Data.new':
                                                        var self = Litereum$get_constructor_value$(_data$13, $3252);
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $3260 = self.value;
                                                                var _ctor$17 = $3260;
                                                                var self = _ctor$17;
                                                                switch (self._) {
                                                                    case 'Litereum.Constructor.new':
                                                                        var $3262 = self.field_types;
                                                                        var _size$21 = ((list_length($3253)) === (list_length($3262)));
                                                                        var _vals$22 = List$zip$($3253, $3262);
                                                                        var _vals$23 = List$all$((_x$23 => {
                                                                            var $3264 = Litereum$check$(_context$1, _world$2, (() => {
                                                                                var self = _x$23;
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $3265 = self.fst;
                                                                                        var $3266 = $3265;
                                                                                        return $3266;
                                                                                };
                                                                            })(), (() => {
                                                                                var self = _x$23;
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $3267 = self.snd;
                                                                                        var $3268 = $3267;
                                                                                        return $3268;
                                                                                };
                                                                            })());
                                                                            return $3264;
                                                                        }), _vals$22);
                                                                        var $3263 = (_size$21 && _vals$23);
                                                                        var $3261 = $3263;
                                                                        break;
                                                                };
                                                                var $3259 = $3261;
                                                                break;
                                                            case 'Maybe.none':
                                                                var $3269 = Bool$false;
                                                                var $3259 = $3269;
                                                                break;
                                                        };
                                                        var $3258 = $3259;
                                                        break;
                                                };
                                                var $3256 = $3258;
                                                break;
                                            case 'Maybe.none':
                                                var $3270 = Bool$false;
                                                var $3256 = $3270;
                                                break;
                                        };
                                        var $3254 = $3256;
                                        break;
                                    case 'Litereum.Type.word':
                                    case 'Litereum.Type.effect':
                                        var $3271 = Bool$false;
                                        var $3254 = $3271;
                                        break;
                                };
                                var $3227 = $3254;
                                break;
                            case 'Litereum.Term.match':
                                var $3272 = self.name;
                                var $3273 = self.data;
                                var $3274 = self.cses;
                                var self = Litereum$get_data$(_world$2, $3273);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $3276 = self.value;
                                        var _data$13 = $3276;
                                        var self = _data$13;
                                        switch (self._) {
                                            case 'Litereum.Data.new':
                                                var $3278 = self.constructors;
                                                var _size$16 = ((list_length($3274)) === (list_length($3278)));
                                                var _expr$17 = Litereum$check$(_context$1, _world$2, Litereum$Term$var$($3272), Litereum$Type$data$($3273));
                                                var _cses$18 = List$zipped_with$($3274, $3278, (_case_body$18 => _case_ctor$19 => {
                                                    var _nams$20 = List$map$(a1 => (($3272 + ".") + a1), (() => {
                                                        var self = _case_ctor$19;
                                                        switch (self._) {
                                                            case 'Litereum.Constructor.new':
                                                                var $3281 = self.field_names;
                                                                var $3282 = $3281;
                                                                return $3282;
                                                        };
                                                    })());
                                                    var self = _case_ctor$19;
                                                    switch (self._) {
                                                        case 'Litereum.Constructor.new':
                                                            var $3283 = self.field_types;
                                                            var $3284 = $3283;
                                                            var _typs$21 = $3284;
                                                            break;
                                                    };
                                                    var _ctx2$22 = Litereum$extend$(_context$1, _nams$20, _typs$21);
                                                    var $3280 = Litereum$check$(_ctx2$22, _world$2, _case_body$18, _type$4);
                                                    return $3280;
                                                }));
                                                var $3279 = (_size$16 && List$and$(_cses$18));
                                                var $3277 = $3279;
                                                break;
                                        };
                                        var $3275 = $3277;
                                        break;
                                    case 'Maybe.none':
                                        var $3285 = Bool$false;
                                        var $3275 = $3285;
                                        break;
                                };
                                var $3227 = $3275;
                                break;
                            case 'Litereum.Term.compare':
                                var $3286 = self.val0;
                                var $3287 = self.iflt;
                                var $3288 = self.ifeq;
                                var $3289 = self.ifgt;
                                var _val0$14 = Litereum$check$(_context$1, _world$2, $3286, Litereum$Type$word);
                                var _val1$15 = Litereum$check$(_context$1, _world$2, $3286, Litereum$Type$word);
                                var _iflt$16 = Litereum$check$(_context$1, _world$2, $3287, _type$4);
                                var _ifeq$17 = Litereum$check$(_context$1, _world$2, $3288, _type$4);
                                var _ifgt$18 = Litereum$check$(_context$1, _world$2, $3289, _type$4);
                                var $3290 = (_val0$14 && (_val1$15 && (_iflt$16 && (_ifeq$17 && _ifgt$18))));
                                var $3227 = $3290;
                                break;
                            case 'Litereum.Term.operate':
                                var $3291 = self.val0;
                                var $3292 = self.val1;
                                var _val0$12 = Litereum$check$(_context$1, _world$2, $3291, Litereum$Type$word);
                                var _val1$13 = Litereum$check$(_context$1, _world$2, $3292, Litereum$Type$word);
                                var $3293 = (_val0$12 && _val1$13);
                                var $3227 = $3293;
                                break;
                            case 'Litereum.Term.run':
                                var $3294 = self.name;
                                var $3295 = self.type;
                                var $3296 = self.expr;
                                var $3297 = self.body;
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.word':
                                    case 'Litereum.Type.data':
                                        var $3299 = Bool$false;
                                        var $3298 = $3299;
                                        break;
                                    case 'Litereum.Type.effect':
                                        var _expr$14 = Litereum$check$(_context$1, _world$2, $3296, Litereum$Type$effect$($3295));
                                        var _ctx2$15 = Map$set$($3294, $3295, _context$1);
                                        var _body$16 = Litereum$check$(_ctx2$15, _world$2, $3297, _type$4);
                                        var $3300 = (_expr$14 && _body$16);
                                        var $3298 = $3300;
                                        break;
                                };
                                var $3227 = $3298;
                                break;
                            case 'Litereum.Term.bind':
                                var $3301 = self.bond;
                                var $3302 = self.main;
                                var $3303 = self.body;
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.word':
                                    case 'Litereum.Type.data':
                                        var $3305 = Bool$false;
                                        var $3304 = $3305;
                                        break;
                                    case 'Litereum.Type.effect':
                                        var self = Litereum$get_bond$(_world$2, $3301);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $3307 = self.value;
                                                var _bond$14 = $3307;
                                                var self = _bond$14;
                                                switch (self._) {
                                                    case 'Litereum.Bond.new':
                                                        var $3309 = self.input_names;
                                                        var $3310 = self.input_types;
                                                        var $3311 = self.output_type;
                                                        var _ctx2$21 = Litereum$extend$(_context$1, $3309, $3310);
                                                        var _main$22 = Litereum$check$(_ctx2$21, _world$2, $3302, $3311);
                                                        var _body$23 = Litereum$check$(_context$1, _world$2, $3303, _type$4);
                                                        var $3312 = (_main$22 && _body$23);
                                                        var $3308 = $3312;
                                                        break;
                                                };
                                                var $3306 = $3308;
                                                break;
                                            case 'Maybe.none':
                                                var $3313 = Bool$false;
                                                var $3306 = $3313;
                                                break;
                                        };
                                        var $3304 = $3306;
                                        break;
                                };
                                var $3227 = $3304;
                                break;
                            case 'Litereum.Term.return':
                                var $3314 = self.expr;
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.effect':
                                        var $3316 = self.rety;
                                        var $3317 = Litereum$check$(_context$1, _world$2, $3314, $3316);
                                        var $3315 = $3317;
                                        break;
                                    case 'Litereum.Type.word':
                                    case 'Litereum.Type.data':
                                        var $3318 = Bool$false;
                                        var $3315 = $3318;
                                        break;
                                };
                                var $3227 = $3315;
                                break;
                            case 'Litereum.Term.word':
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.word':
                                        var $3320 = Bool$true;
                                        var $3319 = $3320;
                                        break;
                                    case 'Litereum.Type.data':
                                    case 'Litereum.Type.effect':
                                        var $3321 = Bool$false;
                                        var $3319 = $3321;
                                        break;
                                };
                                var $3227 = $3319;
                                break;
                        };
                        var $3226 = $3227;
                        break;
                };
                var $3225 = $3226;
                break;
            case 'BBT.bin':
                var self = _world$2;
                switch (self._) {
                    case 'Litereum.World.new':
                        var self = _term$3;
                        switch (self._) {
                            case 'Litereum.Term.var':
                                var $3324 = self.name;
                                var self = Map$get$($3324, _context$1);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $3326 = self.value;
                                        var $3327 = Litereum$equal$($3326, _type$4);
                                        var $3325 = $3327;
                                        break;
                                    case 'Maybe.none':
                                        var $3328 = Bool$false;
                                        var $3325 = $3328;
                                        break;
                                };
                                var $3323 = $3325;
                                break;
                            case 'Litereum.Term.call':
                                var $3329 = self.bond;
                                var $3330 = self.args;
                                var self = Litereum$get_bond$(_world$2, $3329);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $3332 = self.value;
                                        var _bond$17 = $3332;
                                        var self = _bond$17;
                                        switch (self._) {
                                            case 'Litereum.Bond.new':
                                                var $3334 = self.input_types;
                                                var $3335 = self.output_type;
                                                var _otyp$24 = Litereum$equal$($3335, _type$4);
                                                var _args$25 = List$zip$($3330, $3334);
                                                var _args$26 = List$all$((_x$26 => {
                                                    var $3337 = Litereum$check$(_context$1, _world$2, (() => {
                                                        var self = _x$26;
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $3338 = self.fst;
                                                                var $3339 = $3338;
                                                                return $3339;
                                                        };
                                                    })(), (() => {
                                                        var self = _x$26;
                                                        switch (self._) {
                                                            case 'Pair.new':
                                                                var $3340 = self.snd;
                                                                var $3341 = $3340;
                                                                return $3341;
                                                        };
                                                    })());
                                                    return $3337;
                                                }), _args$25);
                                                var $3336 = (_otyp$24 && _args$26);
                                                var $3333 = $3336;
                                                break;
                                        };
                                        var $3331 = $3333;
                                        break;
                                    case 'Maybe.none':
                                        var $3342 = Bool$false;
                                        var $3331 = $3342;
                                        break;
                                };
                                var $3323 = $3331;
                                break;
                            case 'Litereum.Term.let':
                                var $3343 = self.name;
                                var $3344 = self.type;
                                var $3345 = self.expr;
                                var $3346 = self.body;
                                var _expr$18 = Litereum$check$(_context$1, _world$2, $3345, $3344);
                                var _ctx2$19 = Map$set$($3343, $3344, _context$1);
                                var _body$20 = Litereum$check$(_ctx2$19, _world$2, $3346, _type$4);
                                var $3347 = (_expr$18 && _body$20);
                                var $3323 = $3347;
                                break;
                            case 'Litereum.Term.create':
                                var $3348 = self.ctor;
                                var $3349 = self.vals;
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.data':
                                        var $3351 = self.name;
                                        var self = Litereum$get_data$(_world$2, $3351);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $3353 = self.value;
                                                var _data$18 = $3353;
                                                var self = _data$18;
                                                switch (self._) {
                                                    case 'Litereum.Data.new':
                                                        var self = Litereum$get_constructor_value$(_data$18, $3348);
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $3356 = self.value;
                                                                var _ctor$22 = $3356;
                                                                var self = _ctor$22;
                                                                switch (self._) {
                                                                    case 'Litereum.Constructor.new':
                                                                        var $3358 = self.field_types;
                                                                        var _size$26 = ((list_length($3349)) === (list_length($3358)));
                                                                        var _vals$27 = List$zip$($3349, $3358);
                                                                        var _vals$28 = List$all$((_x$28 => {
                                                                            var $3360 = Litereum$check$(_context$1, _world$2, (() => {
                                                                                var self = _x$28;
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $3361 = self.fst;
                                                                                        var $3362 = $3361;
                                                                                        return $3362;
                                                                                };
                                                                            })(), (() => {
                                                                                var self = _x$28;
                                                                                switch (self._) {
                                                                                    case 'Pair.new':
                                                                                        var $3363 = self.snd;
                                                                                        var $3364 = $3363;
                                                                                        return $3364;
                                                                                };
                                                                            })());
                                                                            return $3360;
                                                                        }), _vals$27);
                                                                        var $3359 = (_size$26 && _vals$28);
                                                                        var $3357 = $3359;
                                                                        break;
                                                                };
                                                                var $3355 = $3357;
                                                                break;
                                                            case 'Maybe.none':
                                                                var $3365 = Bool$false;
                                                                var $3355 = $3365;
                                                                break;
                                                        };
                                                        var $3354 = $3355;
                                                        break;
                                                };
                                                var $3352 = $3354;
                                                break;
                                            case 'Maybe.none':
                                                var $3366 = Bool$false;
                                                var $3352 = $3366;
                                                break;
                                        };
                                        var $3350 = $3352;
                                        break;
                                    case 'Litereum.Type.word':
                                    case 'Litereum.Type.effect':
                                        var $3367 = Bool$false;
                                        var $3350 = $3367;
                                        break;
                                };
                                var $3323 = $3350;
                                break;
                            case 'Litereum.Term.match':
                                var $3368 = self.name;
                                var $3369 = self.data;
                                var $3370 = self.cses;
                                var self = Litereum$get_data$(_world$2, $3369);
                                switch (self._) {
                                    case 'Maybe.some':
                                        var $3372 = self.value;
                                        var _data$18 = $3372;
                                        var self = _data$18;
                                        switch (self._) {
                                            case 'Litereum.Data.new':
                                                var $3374 = self.constructors;
                                                var _size$21 = ((list_length($3370)) === (list_length($3374)));
                                                var _expr$22 = Litereum$check$(_context$1, _world$2, Litereum$Term$var$($3368), Litereum$Type$data$($3369));
                                                var _cses$23 = List$zipped_with$($3370, $3374, (_case_body$23 => _case_ctor$24 => {
                                                    var _nams$25 = List$map$(a1 => (($3368 + ".") + a1), (() => {
                                                        var self = _case_ctor$24;
                                                        switch (self._) {
                                                            case 'Litereum.Constructor.new':
                                                                var $3377 = self.field_names;
                                                                var $3378 = $3377;
                                                                return $3378;
                                                        };
                                                    })());
                                                    var self = _case_ctor$24;
                                                    switch (self._) {
                                                        case 'Litereum.Constructor.new':
                                                            var $3379 = self.field_types;
                                                            var $3380 = $3379;
                                                            var _typs$26 = $3380;
                                                            break;
                                                    };
                                                    var _ctx2$27 = Litereum$extend$(_context$1, _nams$25, _typs$26);
                                                    var $3376 = Litereum$check$(_ctx2$27, _world$2, _case_body$23, _type$4);
                                                    return $3376;
                                                }));
                                                var $3375 = (_size$21 && List$and$(_cses$23));
                                                var $3373 = $3375;
                                                break;
                                        };
                                        var $3371 = $3373;
                                        break;
                                    case 'Maybe.none':
                                        var $3381 = Bool$false;
                                        var $3371 = $3381;
                                        break;
                                };
                                var $3323 = $3371;
                                break;
                            case 'Litereum.Term.compare':
                                var $3382 = self.val0;
                                var $3383 = self.iflt;
                                var $3384 = self.ifeq;
                                var $3385 = self.ifgt;
                                var _val0$19 = Litereum$check$(_context$1, _world$2, $3382, Litereum$Type$word);
                                var _val1$20 = Litereum$check$(_context$1, _world$2, $3382, Litereum$Type$word);
                                var _iflt$21 = Litereum$check$(_context$1, _world$2, $3383, _type$4);
                                var _ifeq$22 = Litereum$check$(_context$1, _world$2, $3384, _type$4);
                                var _ifgt$23 = Litereum$check$(_context$1, _world$2, $3385, _type$4);
                                var $3386 = (_val0$19 && (_val1$20 && (_iflt$21 && (_ifeq$22 && _ifgt$23))));
                                var $3323 = $3386;
                                break;
                            case 'Litereum.Term.operate':
                                var $3387 = self.val0;
                                var $3388 = self.val1;
                                var _val0$17 = Litereum$check$(_context$1, _world$2, $3387, Litereum$Type$word);
                                var _val1$18 = Litereum$check$(_context$1, _world$2, $3388, Litereum$Type$word);
                                var $3389 = (_val0$17 && _val1$18);
                                var $3323 = $3389;
                                break;
                            case 'Litereum.Term.run':
                                var $3390 = self.name;
                                var $3391 = self.type;
                                var $3392 = self.expr;
                                var $3393 = self.body;
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.word':
                                    case 'Litereum.Type.data':
                                        var $3395 = Bool$false;
                                        var $3394 = $3395;
                                        break;
                                    case 'Litereum.Type.effect':
                                        var _expr$19 = Litereum$check$(_context$1, _world$2, $3392, Litereum$Type$effect$($3391));
                                        var _ctx2$20 = Map$set$($3390, $3391, _context$1);
                                        var _body$21 = Litereum$check$(_ctx2$20, _world$2, $3393, _type$4);
                                        var $3396 = (_expr$19 && _body$21);
                                        var $3394 = $3396;
                                        break;
                                };
                                var $3323 = $3394;
                                break;
                            case 'Litereum.Term.bind':
                                var $3397 = self.bond;
                                var $3398 = self.main;
                                var $3399 = self.body;
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.word':
                                    case 'Litereum.Type.data':
                                        var $3401 = Bool$false;
                                        var $3400 = $3401;
                                        break;
                                    case 'Litereum.Type.effect':
                                        var self = Litereum$get_bond$(_world$2, $3397);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $3403 = self.value;
                                                var _bond$19 = $3403;
                                                var self = _bond$19;
                                                switch (self._) {
                                                    case 'Litereum.Bond.new':
                                                        var $3405 = self.input_names;
                                                        var $3406 = self.input_types;
                                                        var $3407 = self.output_type;
                                                        var _ctx2$26 = Litereum$extend$(_context$1, $3405, $3406);
                                                        var _main$27 = Litereum$check$(_ctx2$26, _world$2, $3398, $3407);
                                                        var _body$28 = Litereum$check$(_context$1, _world$2, $3399, _type$4);
                                                        var $3408 = (_main$27 && _body$28);
                                                        var $3404 = $3408;
                                                        break;
                                                };
                                                var $3402 = $3404;
                                                break;
                                            case 'Maybe.none':
                                                var $3409 = Bool$false;
                                                var $3402 = $3409;
                                                break;
                                        };
                                        var $3400 = $3402;
                                        break;
                                };
                                var $3323 = $3400;
                                break;
                            case 'Litereum.Term.return':
                                var $3410 = self.expr;
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.effect':
                                        var $3412 = self.rety;
                                        var $3413 = Litereum$check$(_context$1, _world$2, $3410, $3412);
                                        var $3411 = $3413;
                                        break;
                                    case 'Litereum.Type.word':
                                    case 'Litereum.Type.data':
                                        var $3414 = Bool$false;
                                        var $3411 = $3414;
                                        break;
                                };
                                var $3323 = $3411;
                                break;
                            case 'Litereum.Term.word':
                                var self = _type$4;
                                switch (self._) {
                                    case 'Litereum.Type.word':
                                        var $3416 = Bool$true;
                                        var $3415 = $3416;
                                        break;
                                    case 'Litereum.Type.data':
                                    case 'Litereum.Type.effect':
                                        var $3417 = Bool$false;
                                        var $3415 = $3417;
                                        break;
                                };
                                var $3323 = $3415;
                                break;
                        };
                        var $3322 = $3323;
                        break;
                };
                var $3225 = $3322;
                break;
        };
        return $3225;
    };
    const Litereum$check = x0 => x1 => x2 => x3 => Litereum$check$(x0, x1, x2, x3);

    function Litereum$sanitize$many$(_world$1, _table$2, _fresh$3, _terms$4) {
        var self = _terms$4;
        switch (self._) {
            case 'List.cons':
                var $3419 = self.head;
                var $3420 = self.tail;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $3419);
                switch (self._) {
                    case 'Pair.new':
                        var $3422 = self.fst;
                        var $3423 = self.snd;
                        var self = Litereum$sanitize$many$(_world$1, _table$2, $3422, $3420);
                        switch (self._) {
                            case 'Pair.new':
                                var $3425 = self.fst;
                                var $3426 = self.snd;
                                var $3427 = Pair$new$($3425, List$cons$($3423, $3426));
                                var $3424 = $3427;
                                break;
                        };
                        var $3421 = $3424;
                        break;
                };
                var $3418 = $3421;
                break;
            case 'List.nil':
                var $3428 = Pair$new$(_fresh$3, List$nil);
                var $3418 = $3428;
                break;
        };
        return $3418;
    };
    const Litereum$sanitize$many = x0 => x1 => x2 => x3 => Litereum$sanitize$many$(x0, x1, x2, x3);

    function Triple$new$(_fst$4, _snd$5, _trd$6) {
        var $3429 = ({
            _: 'Triple.new',
            'fst': _fst$4,
            'snd': _snd$5,
            'trd': _trd$6
        });
        return $3429;
    };
    const Triple$new = x0 => x1 => x2 => Triple$new$(x0, x1, x2);

    function Litereum$rename$(_table$1, _fresh$2, _old_name$3) {
        var _new_name$4 = ("$" + Nat$show$(_fresh$2));
        var _table$5 = Map$set$(_old_name$3, _new_name$4, _table$1);
        var _fresh$6 = Nat$succ$(_fresh$2);
        var $3430 = Triple$new$(_table$5, _fresh$6, _new_name$4);
        return $3430;
    };
    const Litereum$rename = x0 => x1 => x2 => Litereum$rename$(x0, x1, x2);
    const List$for = a0 => a1 => a2 => (list_for(a0)(a1)(a2));

    function Litereum$sanitize$cases$(_world$1, _table$2, _fresh$3, _old_name$4, _new_name$5, _ctrs$6, _cses$7) {
        var self = _ctrs$6;
        switch (self._) {
            case 'List.cons':
                var $3432 = self.head;
                var $3433 = self.tail;
                var self = _cses$7;
                switch (self._) {
                    case 'List.cons':
                        var $3435 = self.head;
                        var $3436 = self.tail;
                        var _new_table$12 = _table$2;
                        var _new_table$13 = (() => {
                            var $3439 = _new_table$12;
                            var self = $3432;
                            switch (self._) {
                                case 'Litereum.Constructor.new':
                                    var $3441 = self.field_names;
                                    var $3442 = $3441;
                                    var $3440 = $3442;
                                    break;
                            };
                            let _new_table$14 = $3439;
                            let _field$13;
                            while ($3440._ === 'List.cons') {
                                _field$13 = $3440.head;
                                var $3439 = Map$set$((_old_name$4 + ("." + _field$13)), (_new_name$5 + ("." + _field$13)), _new_table$14);
                                _new_table$14 = $3439;
                                $3440 = $3440.tail;
                            }
                            return _new_table$14;
                        })();
                        var self = Litereum$sanitize$(_world$1, _new_table$13, _fresh$3, $3435);
                        switch (self._) {
                            case 'Pair.new':
                                var $3443 = self.fst;
                                var $3444 = self.snd;
                                var self = Litereum$sanitize$cases$(_world$1, _table$2, $3443, _old_name$4, _new_name$5, $3433, $3436);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $3446 = self.fst;
                                        var $3447 = self.snd;
                                        var $3448 = Pair$new$($3446, List$cons$($3444, $3447));
                                        var $3445 = $3448;
                                        break;
                                };
                                var $3437 = $3445;
                                break;
                        };
                        var $3434 = $3437;
                        break;
                    case 'List.nil':
                        var $3449 = Pair$new$(_fresh$3, List$nil);
                        var $3434 = $3449;
                        break;
                };
                var $3431 = $3434;
                break;
            case 'List.nil':
                var self = _cses$7;
                switch (self._) {
                    case 'List.nil':
                    case 'List.cons':
                        var $3451 = Pair$new$(_fresh$3, List$nil);
                        var $3450 = $3451;
                        break;
                };
                var $3431 = $3450;
                break;
        };
        return $3431;
    };
    const Litereum$sanitize$cases = x0 => x1 => x2 => x3 => x4 => x5 => x6 => Litereum$sanitize$cases$(x0, x1, x2, x3, x4, x5, x6);

    function Triple$(_A$1, _B$2, _C$3) {
        var $3452 = null;
        return $3452;
    };
    const Triple = x0 => x1 => x2 => Triple$(x0, x1, x2);

    function Litereum$rename$many$(_table$1, _fresh$2, _names$3) {
        var self = _names$3;
        switch (self._) {
            case 'List.cons':
                var $3454 = self.head;
                var $3455 = self.tail;
                var self = Litereum$rename$(_table$1, _fresh$2, $3454);
                switch (self._) {
                    case 'Triple.new':
                        var $3457 = self.fst;
                        var $3458 = self.snd;
                        var $3459 = self.trd;
                        var self = Litereum$rename$many$($3457, $3458, $3455);
                        switch (self._) {
                            case 'Triple.new':
                                var $3461 = self.fst;
                                var $3462 = self.snd;
                                var $3463 = self.trd;
                                var $3464 = Triple$new$($3461, $3462, List$cons$($3459, $3463));
                                var $3460 = $3464;
                                break;
                        };
                        var $3456 = $3460;
                        break;
                };
                var $3453 = $3456;
                break;
            case 'List.nil':
                var $3465 = Triple$new$(_table$1, _fresh$2, List$nil);
                var $3453 = $3465;
                break;
        };
        return $3453;
    };
    const Litereum$rename$many = x0 => x1 => x2 => Litereum$rename$many$(x0, x1, x2);

    function Litereum$sanitize$(_world$1, _table$2, _fresh$3, _term$4) {
        var self = _term$4;
        switch (self._) {
            case 'Litereum.Term.var':
                var $3467 = self.name;
                var _term$6 = Litereum$Term$var$(Maybe$default$(Map$get$($3467, _table$2), $3467));
                var $3468 = Pair$new$(_fresh$3, _term$6);
                var $3466 = $3468;
                break;
            case 'Litereum.Term.call':
                var $3469 = self.bond;
                var $3470 = self.args;
                var self = Litereum$sanitize$many$(_world$1, _table$2, _fresh$3, $3470);
                switch (self._) {
                    case 'Pair.new':
                        var $3472 = self.fst;
                        var $3473 = self.snd;
                        var $3474 = Pair$new$($3472, Litereum$Term$call$($3469, $3473));
                        var $3471 = $3474;
                        break;
                };
                var $3466 = $3471;
                break;
            case 'Litereum.Term.let':
                var $3475 = self.name;
                var $3476 = self.type;
                var $3477 = self.expr;
                var $3478 = self.body;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $3477);
                switch (self._) {
                    case 'Pair.new':
                        var $3480 = self.fst;
                        var $3481 = self.snd;
                        var self = Litereum$rename$(_table$2, $3480, $3475);
                        switch (self._) {
                            case 'Triple.new':
                                var $3483 = self.fst;
                                var $3484 = self.snd;
                                var $3485 = self.trd;
                                var self = Litereum$sanitize$(_world$1, $3483, $3484, $3478);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $3487 = self.fst;
                                        var $3488 = self.snd;
                                        var $3489 = Pair$new$($3487, Litereum$Term$let$($3485, $3476, $3481, $3488));
                                        var $3486 = $3489;
                                        break;
                                };
                                var $3482 = $3486;
                                break;
                        };
                        var $3479 = $3482;
                        break;
                };
                var $3466 = $3479;
                break;
            case 'Litereum.Term.create':
                var $3490 = self.ctor;
                var $3491 = self.vals;
                var self = Litereum$sanitize$many$(_world$1, _table$2, _fresh$3, $3491);
                switch (self._) {
                    case 'Pair.new':
                        var $3493 = self.fst;
                        var $3494 = self.snd;
                        var $3495 = Pair$new$($3493, Litereum$Term$create$($3490, $3494));
                        var $3492 = $3495;
                        break;
                };
                var $3466 = $3492;
                break;
            case 'Litereum.Term.match':
                var $3496 = self.name;
                var $3497 = self.data;
                var $3498 = self.cses;
                var _ctrs$8 = Maybe$default$(Litereum$get_constructors$(_world$1, $3497), List$nil);
                var _old_name$9 = $3496;
                var _new_name$10 = Maybe$default$(Map$get$($3496, _table$2), $3496);
                var self = Litereum$sanitize$cases$(_world$1, _table$2, _fresh$3, _old_name$9, _new_name$10, _ctrs$8, $3498);
                switch (self._) {
                    case 'Pair.new':
                        var $3500 = self.fst;
                        var $3501 = self.snd;
                        var $3502 = Pair$new$($3500, Litereum$Term$match$(_new_name$10, $3497, $3501));
                        var $3499 = $3502;
                        break;
                };
                var $3466 = $3499;
                break;
            case 'Litereum.Term.word':
                var $3503 = self.numb;
                var $3504 = Pair$new$(_fresh$3, Litereum$Term$word$($3503));
                var $3466 = $3504;
                break;
            case 'Litereum.Term.compare':
                var $3505 = self.val0;
                var $3506 = self.val1;
                var $3507 = self.iflt;
                var $3508 = self.ifeq;
                var $3509 = self.ifgt;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $3505);
                switch (self._) {
                    case 'Pair.new':
                        var $3511 = self.fst;
                        var $3512 = self.snd;
                        var self = Litereum$sanitize$(_world$1, _table$2, $3511, $3506);
                        switch (self._) {
                            case 'Pair.new':
                                var $3514 = self.fst;
                                var $3515 = self.snd;
                                var self = Litereum$sanitize$(_world$1, _table$2, $3514, $3507);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $3517 = self.fst;
                                        var $3518 = self.snd;
                                        var self = Litereum$sanitize$(_world$1, _table$2, $3517, $3508);
                                        switch (self._) {
                                            case 'Pair.new':
                                                var $3520 = self.fst;
                                                var $3521 = self.snd;
                                                var self = Litereum$sanitize$(_world$1, _table$2, $3520, $3509);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3523 = self.fst;
                                                        var $3524 = self.snd;
                                                        var $3525 = Pair$new$($3523, Litereum$Term$compare$($3512, $3515, $3518, $3521, $3524));
                                                        var $3522 = $3525;
                                                        break;
                                                };
                                                var $3519 = $3522;
                                                break;
                                        };
                                        var $3516 = $3519;
                                        break;
                                };
                                var $3513 = $3516;
                                break;
                        };
                        var $3510 = $3513;
                        break;
                };
                var $3466 = $3510;
                break;
            case 'Litereum.Term.operate':
                var $3526 = self.oper;
                var $3527 = self.val0;
                var $3528 = self.val1;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $3527);
                switch (self._) {
                    case 'Pair.new':
                        var $3530 = self.fst;
                        var $3531 = self.snd;
                        var self = Litereum$sanitize$(_world$1, _table$2, $3530, $3528);
                        switch (self._) {
                            case 'Pair.new':
                                var $3533 = self.fst;
                                var $3534 = self.snd;
                                var $3535 = Pair$new$($3533, Litereum$Term$operate$($3526, $3531, $3534));
                                var $3532 = $3535;
                                break;
                        };
                        var $3529 = $3532;
                        break;
                };
                var $3466 = $3529;
                break;
            case 'Litereum.Term.run':
                var $3536 = self.name;
                var $3537 = self.type;
                var $3538 = self.expr;
                var $3539 = self.body;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $3538);
                switch (self._) {
                    case 'Pair.new':
                        var $3541 = self.fst;
                        var $3542 = self.snd;
                        var self = Litereum$rename$(_table$2, $3541, $3536);
                        switch (self._) {
                            case 'Triple.new':
                                var $3544 = self.fst;
                                var $3545 = self.snd;
                                var $3546 = self.trd;
                                var self = Litereum$sanitize$(_world$1, $3544, $3545, $3539);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $3548 = self.fst;
                                        var $3549 = self.snd;
                                        var $3550 = Pair$new$($3548, Litereum$Term$run$($3546, $3537, $3542, $3549));
                                        var $3547 = $3550;
                                        break;
                                };
                                var $3543 = $3547;
                                break;
                        };
                        var $3540 = $3543;
                        break;
                };
                var $3466 = $3540;
                break;
            case 'Litereum.Term.bind':
                var $3551 = self.bond;
                var $3552 = self.main;
                var $3553 = self.body;
                var self = Litereum$get_bond$(_world$1, $3551);
                switch (self._) {
                    case 'Maybe.some':
                        var $3555 = self.value;
                        var _bond$9 = $3555;
                        var self = _bond$9;
                        switch (self._) {
                            case 'Litereum.Bond.new':
                                var $3557 = self.input_names;
                                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $3553);
                                switch (self._) {
                                    case 'Pair.new':
                                        var $3559 = self.fst;
                                        var $3560 = self.snd;
                                        var self = Litereum$rename$many$(_table$2, $3559, $3557);
                                        switch (self._) {
                                            case 'Triple.new':
                                                var $3562 = self.fst;
                                                var $3563 = self.snd;
                                                var self = Litereum$sanitize$(_world$1, $3562, $3563, $3552);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3565 = self.fst;
                                                        var $3566 = self.snd;
                                                        var $3567 = Pair$new$($3565, Litereum$Term$bind$($3551, $3566, $3560));
                                                        var $3564 = $3567;
                                                        break;
                                                };
                                                var $3561 = $3564;
                                                break;
                                        };
                                        var $3558 = $3561;
                                        break;
                                };
                                var $3556 = $3558;
                                break;
                        };
                        var $3554 = $3556;
                        break;
                    case 'Maybe.none':
                        var $3568 = Pair$new$(_fresh$3, _term$4);
                        var $3554 = $3568;
                        break;
                };
                var $3466 = $3554;
                break;
            case 'Litereum.Term.return':
                var $3569 = self.expr;
                var self = Litereum$sanitize$(_world$1, _table$2, _fresh$3, $3569);
                switch (self._) {
                    case 'Pair.new':
                        var $3571 = self.fst;
                        var $3572 = self.snd;
                        var $3573 = Pair$new$($3571, Litereum$Term$return$($3572));
                        var $3570 = $3573;
                        break;
                };
                var $3466 = $3570;
                break;
        };
        return $3466;
    };
    const Litereum$sanitize = x0 => x1 => x2 => x3 => Litereum$sanitize$(x0, x1, x2, x3);

    function Litereum$Runtime$(_A$1) {
        var $3574 = null;
        return $3574;
    };
    const Litereum$Runtime = x0 => Litereum$Runtime$(x0);

    function Litereum$Runtime$new$(_world$2, _subst$3, _fresh$4, _gas$5, _term$6) {
        var $3575 = ({
            _: 'Litereum.Runtime.new',
            'world': _world$2,
            'subst': _subst$3,
            'fresh': _fresh$4,
            'gas': _gas$5,
            'term': _term$6
        });
        return $3575;
    };
    const Litereum$Runtime$new = x0 => x1 => x2 => x3 => x4 => Litereum$Runtime$new$(x0, x1, x2, x3, x4);

    function Litereum$get_constructor_index$(_data$1, _name$2) {
        var $3576 = Maybe$mapped$(List$ifind$((_i$3 => _ctr$4 => {
            var $3577 = ((() => {
                var self = _ctr$4;
                switch (self._) {
                    case 'Litereum.Constructor.new':
                        var $3578 = self.name;
                        var $3579 = $3578;
                        return $3579;
                };
            })() === _name$2);
            return $3577;
        }), (() => {
            var self = _data$1;
            switch (self._) {
                case 'Litereum.Data.new':
                    var $3580 = self.constructors;
                    var $3581 = $3580;
                    return $3581;
            };
        })()), (_x$3 => {
            var self = _x$3;
            switch (self._) {
                case 'Pair.new':
                    var $3583 = self.fst;
                    var $3584 = $3583;
                    var $3582 = $3584;
                    break;
            };
            return $3582;
        }));
        return $3576;
    };
    const Litereum$get_constructor_index = x0 => x1 => Litereum$get_constructor_index$(x0, x1);
    const U64$ltn = a0 => a1 => (a0 < a1);
    const U64$eql = a0 => a1 => (a0 === a1);

    function U64$cmp$(_a$1, _b$2) {
        var self = (_a$1 < _b$2);
        if (self) {
            var $3586 = Cmp$ltn;
            var $3585 = $3586;
        } else {
            var self = (_a$1 === _b$2);
            if (self) {
                var $3588 = Cmp$eql;
                var $3587 = $3588;
            } else {
                var $3589 = Cmp$gtn;
                var $3587 = $3589;
            };
            var $3585 = $3587;
        };
        return $3585;
    };
    const U64$cmp = x0 => x1 => U64$cmp$(x0, x1);
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
                        var $3590 = self.pred;
                        var $3591 = Word$bit_length$go$($3590, Nat$succ$(_c$3), _n$4);
                        return $3591;
                    case 'Word.i':
                        var $3592 = self.pred;
                        var $3593 = Word$bit_length$go$($3592, Nat$succ$(_c$3), Nat$succ$(_c$3));
                        return $3593;
                    case 'Word.e':
                        var $3594 = _n$4;
                        return $3594;
                };
            })();
            if (R.ctr === 'TCO') arg = R.arg;
            else return R;
        }
    };
    const Word$bit_length$go = x0 => x1 => x2 => Word$bit_length$go$(x0, x1, x2);

    function Word$bit_length$(_word$2) {
        var $3595 = Word$bit_length$go$(_word$2, 0n, 0n);
        return $3595;
    };
    const Word$bit_length = x0 => Word$bit_length$(x0);

    function Cmp$as_gte$(_cmp$1) {
        var self = _cmp$1;
        switch (self._) {
            case 'Cmp.ltn':
                var $3597 = Bool$false;
                var $3596 = $3597;
                break;
            case 'Cmp.eql':
            case 'Cmp.gtn':
                var $3598 = Bool$true;
                var $3596 = $3598;
                break;
        };
        return $3596;
    };
    const Cmp$as_gte = x0 => Cmp$as_gte$(x0);

    function Word$gte$(_a$2, _b$3) {
        var $3599 = Cmp$as_gte$(Word$cmp$(_a$2, _b$3));
        return $3599;
    };
    const Word$gte = x0 => x1 => Word$gte$(x0, x1);

    function Word$or$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $3601 = self.pred;
                var $3602 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $3604 = self.pred;
                            var $3605 = (_a$pred$9 => {
                                var $3606 = Word$o$(Word$or$(_a$pred$9, $3604));
                                return $3606;
                            });
                            var $3603 = $3605;
                            break;
                        case 'Word.i':
                            var $3607 = self.pred;
                            var $3608 = (_a$pred$9 => {
                                var $3609 = Word$i$(Word$or$(_a$pred$9, $3607));
                                return $3609;
                            });
                            var $3603 = $3608;
                            break;
                        case 'Word.e':
                            var $3610 = (_a$pred$7 => {
                                var $3611 = Word$e;
                                return $3611;
                            });
                            var $3603 = $3610;
                            break;
                    };
                    var $3603 = $3603($3601);
                    return $3603;
                });
                var $3600 = $3602;
                break;
            case 'Word.i':
                var $3612 = self.pred;
                var $3613 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $3615 = self.pred;
                            var $3616 = (_a$pred$9 => {
                                var $3617 = Word$i$(Word$or$(_a$pred$9, $3615));
                                return $3617;
                            });
                            var $3614 = $3616;
                            break;
                        case 'Word.i':
                            var $3618 = self.pred;
                            var $3619 = (_a$pred$9 => {
                                var $3620 = Word$i$(Word$or$(_a$pred$9, $3618));
                                return $3620;
                            });
                            var $3614 = $3619;
                            break;
                        case 'Word.e':
                            var $3621 = (_a$pred$7 => {
                                var $3622 = Word$e;
                                return $3622;
                            });
                            var $3614 = $3621;
                            break;
                    };
                    var $3614 = $3614($3612);
                    return $3614;
                });
                var $3600 = $3613;
                break;
            case 'Word.e':
                var $3623 = (_b$4 => {
                    var $3624 = Word$e;
                    return $3624;
                });
                var $3600 = $3623;
                break;
        };
        var $3600 = $3600(_b$3);
        return $3600;
    };
    const Word$or = x0 => x1 => Word$or$(x0, x1);

    function Word$shift_right$one$go$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $3626 = self.pred;
                var $3627 = Word$o$(Word$shift_right$one$go$($3626));
                var $3625 = $3627;
                break;
            case 'Word.i':
                var $3628 = self.pred;
                var $3629 = Word$i$(Word$shift_right$one$go$($3628));
                var $3625 = $3629;
                break;
            case 'Word.e':
                var $3630 = Word$o$(Word$e);
                var $3625 = $3630;
                break;
        };
        return $3625;
    };
    const Word$shift_right$one$go = x0 => Word$shift_right$one$go$(x0);

    function Word$shift_right$one$(_word$2) {
        var self = _word$2;
        switch (self._) {
            case 'Word.o':
                var $3632 = self.pred;
                var $3633 = Word$shift_right$one$go$($3632);
                var $3631 = $3633;
                break;
            case 'Word.i':
                var $3634 = self.pred;
                var $3635 = Word$shift_right$one$go$($3634);
                var $3631 = $3635;
                break;
            case 'Word.e':
                var $3636 = Word$e;
                var $3631 = $3636;
                break;
        };
        return $3631;
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
                    var $3637 = _value$2;
                    return $3637;
                } else {
                    var $3638 = (self - 1n);
                    var $3639 = Word$shift_right$(Word$shift_right$one$(_value$2), $3638);
                    return $3639;
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
                    var $3640 = Pair$new$(Bool$true, Word$or$(_value$5, _mask$6));
                    var self = $3640;
                } else {
                    var $3641 = Pair$new$(Bool$false, _value$5);
                    var self = $3641;
                };
                switch (self._) {
                    case 'Pair.new':
                        var $3642 = self.fst;
                        var $3643 = self.snd;
                        var self = _shift$2;
                        if (self === 0n) {
                            var $3645 = $3643;
                            var $3644 = $3645;
                        } else {
                            var $3646 = (self - 1n);
                            var _new_shift_copy$9 = Word$shift_right$(_shift_copy$4, 1n);
                            var self = $3642;
                            if (self) {
                                var $3648 = Word$div$go$($3646, Word$sub$(_sub_copy$3, _shift_copy$4), _new_shift_copy$9, $3643);
                                var $3647 = $3648;
                            } else {
                                var $3649 = Word$div$go$($3646, _sub_copy$3, _new_shift_copy$9, $3643);
                                var $3647 = $3649;
                            };
                            var $3644 = $3647;
                        };
                        return $3644;
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
            var $3651 = Word$to_zero$(_a$2);
            var $3650 = $3651;
        } else {
            var _shift$6 = (_a_bits$4 - _b_bits$5 <= 0n ? 0n : _a_bits$4 - _b_bits$5);
            var _shift_copy$7 = Word$shift_left$(_b$3, _shift$6);
            var $3652 = Word$div$go$(_shift$6, _a$2, _shift_copy$7, Word$to_zero$(_a$2));
            var $3650 = $3652;
        };
        return $3650;
    };
    const Word$div = x0 => x1 => Word$div$(x0, x1);
    const U64$div = a0 => a1 => ((a0 / a1) & 0xFFFFFFFFFFFFFFFFn);

    function Word$mod$(_a$2, _b$3) {
        var _q$4 = Word$div$(_a$2, _b$3);
        var $3653 = Word$sub$(_a$2, Word$mul$(_b$3, _q$4));
        return $3653;
    };
    const Word$mod = x0 => x1 => Word$mod$(x0, x1);
    const U64$mod = a0 => a1 => (a0 % a1);
    const U64$or = a0 => a1 => (a0 | a1);

    function Word$and$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $3655 = self.pred;
                var $3656 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $3658 = self.pred;
                            var $3659 = (_a$pred$9 => {
                                var $3660 = Word$o$(Word$and$(_a$pred$9, $3658));
                                return $3660;
                            });
                            var $3657 = $3659;
                            break;
                        case 'Word.i':
                            var $3661 = self.pred;
                            var $3662 = (_a$pred$9 => {
                                var $3663 = Word$o$(Word$and$(_a$pred$9, $3661));
                                return $3663;
                            });
                            var $3657 = $3662;
                            break;
                        case 'Word.e':
                            var $3664 = (_a$pred$7 => {
                                var $3665 = Word$e;
                                return $3665;
                            });
                            var $3657 = $3664;
                            break;
                    };
                    var $3657 = $3657($3655);
                    return $3657;
                });
                var $3654 = $3656;
                break;
            case 'Word.i':
                var $3666 = self.pred;
                var $3667 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $3669 = self.pred;
                            var $3670 = (_a$pred$9 => {
                                var $3671 = Word$o$(Word$and$(_a$pred$9, $3669));
                                return $3671;
                            });
                            var $3668 = $3670;
                            break;
                        case 'Word.i':
                            var $3672 = self.pred;
                            var $3673 = (_a$pred$9 => {
                                var $3674 = Word$i$(Word$and$(_a$pred$9, $3672));
                                return $3674;
                            });
                            var $3668 = $3673;
                            break;
                        case 'Word.e':
                            var $3675 = (_a$pred$7 => {
                                var $3676 = Word$e;
                                return $3676;
                            });
                            var $3668 = $3675;
                            break;
                    };
                    var $3668 = $3668($3666);
                    return $3668;
                });
                var $3654 = $3667;
                break;
            case 'Word.e':
                var $3677 = (_b$4 => {
                    var $3678 = Word$e;
                    return $3678;
                });
                var $3654 = $3677;
                break;
        };
        var $3654 = $3654(_b$3);
        return $3654;
    };
    const Word$and = x0 => x1 => Word$and$(x0, x1);
    const U64$and = a0 => a1 => (a0 & a1);

    function Word$xor$(_a$2, _b$3) {
        var self = _a$2;
        switch (self._) {
            case 'Word.o':
                var $3680 = self.pred;
                var $3681 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $3683 = self.pred;
                            var $3684 = (_a$pred$9 => {
                                var $3685 = Word$o$(Word$xor$(_a$pred$9, $3683));
                                return $3685;
                            });
                            var $3682 = $3684;
                            break;
                        case 'Word.i':
                            var $3686 = self.pred;
                            var $3687 = (_a$pred$9 => {
                                var $3688 = Word$i$(Word$xor$(_a$pred$9, $3686));
                                return $3688;
                            });
                            var $3682 = $3687;
                            break;
                        case 'Word.e':
                            var $3689 = (_a$pred$7 => {
                                var $3690 = Word$e;
                                return $3690;
                            });
                            var $3682 = $3689;
                            break;
                    };
                    var $3682 = $3682($3680);
                    return $3682;
                });
                var $3679 = $3681;
                break;
            case 'Word.i':
                var $3691 = self.pred;
                var $3692 = (_b$6 => {
                    var self = _b$6;
                    switch (self._) {
                        case 'Word.o':
                            var $3694 = self.pred;
                            var $3695 = (_a$pred$9 => {
                                var $3696 = Word$i$(Word$xor$(_a$pred$9, $3694));
                                return $3696;
                            });
                            var $3693 = $3695;
                            break;
                        case 'Word.i':
                            var $3697 = self.pred;
                            var $3698 = (_a$pred$9 => {
                                var $3699 = Word$o$(Word$xor$(_a$pred$9, $3697));
                                return $3699;
                            });
                            var $3693 = $3698;
                            break;
                        case 'Word.e':
                            var $3700 = (_a$pred$7 => {
                                var $3701 = Word$e;
                                return $3701;
                            });
                            var $3693 = $3700;
                            break;
                    };
                    var $3693 = $3693($3691);
                    return $3693;
                });
                var $3679 = $3692;
                break;
            case 'Word.e':
                var $3702 = (_b$4 => {
                    var $3703 = Word$e;
                    return $3703;
                });
                var $3679 = $3702;
                break;
        };
        var $3679 = $3679(_b$3);
        return $3679;
    };
    const Word$xor = x0 => x1 => Word$xor$(x0, x1);
    const U64$xor = a0 => a1 => (a0 ^ a1);

    function Litereum$reduce$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'Litereum.Runtime.new':
                var $3705 = self.world;
                var $3706 = self.subst;
                var $3707 = self.fresh;
                var $3708 = self.gas;
                var $3709 = self.term;
                var self = $3709;
                switch (self._) {
                    case 'Litereum.Term.var':
                        var $3711 = self.name;
                        var _term$8 = Maybe$default$(Map$get$($3711, $3706), $3709);
                        var self = Litereum$reduce$(Litereum$Runtime$new$($3705, $3706, $3707, $3708, _term$8));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3713 = self.world;
                                var $3714 = self.subst;
                                var $3715 = self.fresh;
                                var $3716 = self.gas;
                                var $3717 = self.term;
                                var $3718 = Litereum$Runtime$new$($3713, Map$set$($3711, $3717, $3714), $3715, $3716, $3717);
                                var $3712 = $3718;
                                break;
                        };
                        var $3710 = $3712;
                        break;
                    case 'Litereum.Term.call':
                        var $3719 = self.bond;
                        var $3720 = self.args;
                        var self = Litereum$get_bond$($3705, $3719);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3722 = self.value;
                                var _bond$10 = $3722;
                                var self = _bond$10;
                                switch (self._) {
                                    case 'Litereum.Bond.new':
                                        var $3724 = self.input_names;
                                        var $3725 = self.main;
                                        var self = Litereum$rename$many$(Map$from_list$(List$nil), $3707, $3724);
                                        switch (self._) {
                                            case 'Triple.new':
                                                var $3727 = self.fst;
                                                var $3728 = self.snd;
                                                var $3729 = self.trd;
                                                var self = Litereum$sanitize$($3705, $3727, $3728, $3725);
                                                switch (self._) {
                                                    case 'Pair.new':
                                                        var $3731 = self.fst;
                                                        var $3732 = self.snd;
                                                        var _subst$22 = Litereum$extend$($3706, $3729, $3720);
                                                        var $3733 = Litereum$reduce$(Litereum$Runtime$new$($3705, _subst$22, $3731, $3708, $3732));
                                                        var $3730 = $3733;
                                                        break;
                                                };
                                                var $3726 = $3730;
                                                break;
                                        };
                                        var $3723 = $3726;
                                        break;
                                };
                                var $3721 = $3723;
                                break;
                            case 'Maybe.none':
                                var $3734 = _state$1;
                                var $3721 = $3734;
                                break;
                        };
                        var $3710 = $3721;
                        break;
                    case 'Litereum.Term.let':
                        var $3735 = self.name;
                        var $3736 = self.expr;
                        var $3737 = self.body;
                        var $3738 = Litereum$reduce$(Litereum$Runtime$new$($3705, Map$set$($3735, $3736, $3706), $3707, $3708, $3737));
                        var $3710 = $3738;
                        break;
                    case 'Litereum.Term.match':
                        var $3739 = self.name;
                        var $3740 = self.data;
                        var $3741 = self.cses;
                        var self = Litereum$reduce$(Litereum$Runtime$new$($3705, $3706, $3707, $3708, Maybe$default$(Map$get$($3739, $3706), Litereum$Term$word$(0n))));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3743 = self.world;
                                var $3744 = self.subst;
                                var $3745 = self.fresh;
                                var $3746 = self.gas;
                                var $3747 = self.term;
                                var self = $3747;
                                switch (self._) {
                                    case 'Litereum.Term.create':
                                        var $3749 = self.ctor;
                                        var $3750 = self.vals;
                                        var self = Litereum$get_data$($3743, $3740);
                                        switch (self._) {
                                            case 'Maybe.some':
                                                var $3752 = self.value;
                                                var _data$18 = $3752;
                                                var self = _data$18;
                                                switch (self._) {
                                                    case 'Litereum.Data.new':
                                                        var self = Litereum$get_constructor_value$(_data$18, $3749);
                                                        switch (self._) {
                                                            case 'Maybe.some':
                                                                var $3755 = self.value;
                                                                var _ctor$22 = $3755;
                                                                var self = _ctor$22;
                                                                switch (self._) {
                                                                    case 'Litereum.Constructor.new':
                                                                        var self = Litereum$get_constructor_index$(_data$18, $3749);
                                                                        switch (self._) {
                                                                            case 'Maybe.some':
                                                                                var $3758 = self.value;
                                                                                var self = List$get$($3758, $3741);
                                                                                switch (self._) {
                                                                                    case 'Maybe.some':
                                                                                        var $3760 = self.value;
                                                                                        var _nams$28 = List$map$(a1 => (($3739 + ".") + a1), (() => {
                                                                                            var self = _ctor$22;
                                                                                            switch (self._) {
                                                                                                case 'Litereum.Constructor.new':
                                                                                                    var $3762 = self.field_names;
                                                                                                    var $3763 = $3762;
                                                                                                    return $3763;
                                                                                            };
                                                                                        })());
                                                                                        var _subst$29 = Litereum$extend$($3744, _nams$28, $3750);
                                                                                        var $3761 = Litereum$reduce$(Litereum$Runtime$new$($3743, _subst$29, $3745, $3746, $3760));
                                                                                        var $3759 = $3761;
                                                                                        break;
                                                                                    case 'Maybe.none':
                                                                                        var $3764 = _state$1;
                                                                                        var $3759 = $3764;
                                                                                        break;
                                                                                };
                                                                                var $3757 = $3759;
                                                                                break;
                                                                            case 'Maybe.none':
                                                                                var $3765 = _state$1;
                                                                                var $3757 = $3765;
                                                                                break;
                                                                        };
                                                                        var $3756 = $3757;
                                                                        break;
                                                                };
                                                                var $3754 = $3756;
                                                                break;
                                                            case 'Maybe.none':
                                                                var $3766 = _state$1;
                                                                var $3754 = $3766;
                                                                break;
                                                        };
                                                        var $3753 = $3754;
                                                        break;
                                                };
                                                var $3751 = $3753;
                                                break;
                                            case 'Maybe.none':
                                                var $3767 = _state$1;
                                                var $3751 = $3767;
                                                break;
                                        };
                                        var $3748 = $3751;
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
                                        var $3768 = _state$1;
                                        var $3748 = $3768;
                                        break;
                                };
                                var $3742 = $3748;
                                break;
                        };
                        var $3710 = $3742;
                        break;
                    case 'Litereum.Term.compare':
                        var $3769 = self.val0;
                        var $3770 = self.val1;
                        var $3771 = self.iflt;
                        var $3772 = self.ifeq;
                        var $3773 = self.ifgt;
                        var self = Litereum$reduce$(Litereum$Runtime$new$($3705, $3706, $3707, $3708, $3769));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3775 = self.world;
                                var $3776 = self.subst;
                                var $3777 = self.fresh;
                                var $3778 = self.gas;
                                var $3779 = self.term;
                                var self = Litereum$reduce$(Litereum$Runtime$new$($3775, $3776, $3777, $3778, $3770));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $3781 = self.world;
                                        var $3782 = self.subst;
                                        var $3783 = self.fresh;
                                        var $3784 = self.gas;
                                        var $3785 = self.term;
                                        var self = $3779;
                                        switch (self._) {
                                            case 'Litereum.Term.word':
                                                var $3787 = self.numb;
                                                var self = $3785;
                                                switch (self._) {
                                                    case 'Litereum.Term.word':
                                                        var $3789 = self.numb;
                                                        var self = U64$cmp$($3787, $3789);
                                                        switch (self._) {
                                                            case 'Cmp.ltn':
                                                                var $3791 = Litereum$reduce$(Litereum$Runtime$new$($3781, $3782, $3783, $3784, $3771));
                                                                var $3790 = $3791;
                                                                break;
                                                            case 'Cmp.eql':
                                                                var $3792 = Litereum$reduce$(Litereum$Runtime$new$($3781, $3782, $3783, $3784, $3772));
                                                                var $3790 = $3792;
                                                                break;
                                                            case 'Cmp.gtn':
                                                                var $3793 = Litereum$reduce$(Litereum$Runtime$new$($3781, $3782, $3783, $3784, $3773));
                                                                var $3790 = $3793;
                                                                break;
                                                        };
                                                        var $3788 = $3790;
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
                                                        var $3794 = _state$1;
                                                        var $3788 = $3794;
                                                        break;
                                                };
                                                var $3786 = $3788;
                                                break;
                                            case 'Litereum.Term.var':
                                            case 'Litereum.Term.return':
                                                var self = $3785;
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
                                                        var $3796 = _state$1;
                                                        var $3795 = $3796;
                                                        break;
                                                };
                                                var $3786 = $3795;
                                                break;
                                            case 'Litereum.Term.call':
                                            case 'Litereum.Term.create':
                                                var self = $3785;
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
                                                        var $3798 = _state$1;
                                                        var $3797 = $3798;
                                                        break;
                                                };
                                                var $3786 = $3797;
                                                break;
                                            case 'Litereum.Term.let':
                                            case 'Litereum.Term.run':
                                                var self = $3785;
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
                                                        var $3800 = _state$1;
                                                        var $3799 = $3800;
                                                        break;
                                                };
                                                var $3786 = $3799;
                                                break;
                                            case 'Litereum.Term.match':
                                            case 'Litereum.Term.operate':
                                            case 'Litereum.Term.bind':
                                                var self = $3785;
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
                                                        var $3802 = _state$1;
                                                        var $3801 = $3802;
                                                        break;
                                                };
                                                var $3786 = $3801;
                                                break;
                                            case 'Litereum.Term.compare':
                                                var self = $3785;
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
                                                        var $3804 = _state$1;
                                                        var $3803 = $3804;
                                                        break;
                                                };
                                                var $3786 = $3803;
                                                break;
                                        };
                                        var $3780 = $3786;
                                        break;
                                };
                                var $3774 = $3780;
                                break;
                        };
                        var $3710 = $3774;
                        break;
                    case 'Litereum.Term.operate':
                        var $3805 = self.oper;
                        var $3806 = self.val0;
                        var $3807 = self.val1;
                        var self = Litereum$reduce$(Litereum$Runtime$new$($3705, $3706, $3707, $3708, $3806));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3809 = self.world;
                                var $3810 = self.subst;
                                var $3811 = self.fresh;
                                var $3812 = self.gas;
                                var $3813 = self.term;
                                var self = Litereum$reduce$(Litereum$Runtime$new$($3809, $3810, $3811, $3812, $3807));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $3815 = self.world;
                                        var $3816 = self.subst;
                                        var $3817 = self.fresh;
                                        var $3818 = self.gas;
                                        var $3819 = self.term;
                                        var self = $3813;
                                        switch (self._) {
                                            case 'Litereum.Term.word':
                                                var $3821 = self.numb;
                                                var self = $3819;
                                                switch (self._) {
                                                    case 'Litereum.Term.word':
                                                        var $3823 = self.numb;
                                                        var self = $3805;
                                                        switch (self._) {
                                                            case 'Litereum.Operation.add':
                                                                var $3825 = Litereum$Runtime$new$($3815, $3816, $3817, $3818, Litereum$Term$word$((($3821 + $3823) & 0xFFFFFFFFFFFFFFFFn)));
                                                                var $3824 = $3825;
                                                                break;
                                                            case 'Litereum.Operation.sub':
                                                                var $3826 = Litereum$Runtime$new$($3815, $3816, $3817, $3818, Litereum$Term$word$((($3821 - $3823) & 0xFFFFFFFFFFFFFFFFn)));
                                                                var $3824 = $3826;
                                                                break;
                                                            case 'Litereum.Operation.mul':
                                                                var $3827 = Litereum$Runtime$new$($3815, $3816, $3817, $3818, Litereum$Term$word$((($3821 * $3823) & 0xFFFFFFFFFFFFFFFFn)));
                                                                var $3824 = $3827;
                                                                break;
                                                            case 'Litereum.Operation.div':
                                                                var $3828 = Litereum$Runtime$new$($3815, $3816, $3817, $3818, Litereum$Term$word$((($3821 / $3823) & 0xFFFFFFFFFFFFFFFFn)));
                                                                var $3824 = $3828;
                                                                break;
                                                            case 'Litereum.Operation.mod':
                                                                var $3829 = Litereum$Runtime$new$($3815, $3816, $3817, $3818, Litereum$Term$word$(($3821 % $3823)));
                                                                var $3824 = $3829;
                                                                break;
                                                            case 'Litereum.Operation.or':
                                                                var $3830 = Litereum$Runtime$new$($3815, $3816, $3817, $3818, Litereum$Term$word$(($3821 | $3823)));
                                                                var $3824 = $3830;
                                                                break;
                                                            case 'Litereum.Operation.and':
                                                                var $3831 = Litereum$Runtime$new$($3815, $3816, $3817, $3818, Litereum$Term$word$(($3821 & $3823)));
                                                                var $3824 = $3831;
                                                                break;
                                                            case 'Litereum.Operation.xor':
                                                                var $3832 = Litereum$Runtime$new$($3815, $3816, $3817, $3818, Litereum$Term$word$(($3821 ^ $3823)));
                                                                var $3824 = $3832;
                                                                break;
                                                        };
                                                        var $3822 = $3824;
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
                                                        var $3833 = _state$1;
                                                        var $3822 = $3833;
                                                        break;
                                                };
                                                var $3820 = $3822;
                                                break;
                                            case 'Litereum.Term.var':
                                            case 'Litereum.Term.return':
                                                var self = $3819;
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
                                                        var $3835 = _state$1;
                                                        var $3834 = $3835;
                                                        break;
                                                };
                                                var $3820 = $3834;
                                                break;
                                            case 'Litereum.Term.call':
                                            case 'Litereum.Term.create':
                                                var self = $3819;
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
                                                        var $3837 = _state$1;
                                                        var $3836 = $3837;
                                                        break;
                                                };
                                                var $3820 = $3836;
                                                break;
                                            case 'Litereum.Term.let':
                                            case 'Litereum.Term.run':
                                                var self = $3819;
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
                                                        var $3839 = _state$1;
                                                        var $3838 = $3839;
                                                        break;
                                                };
                                                var $3820 = $3838;
                                                break;
                                            case 'Litereum.Term.match':
                                            case 'Litereum.Term.operate':
                                            case 'Litereum.Term.bind':
                                                var self = $3819;
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
                                                        var $3841 = _state$1;
                                                        var $3840 = $3841;
                                                        break;
                                                };
                                                var $3820 = $3840;
                                                break;
                                            case 'Litereum.Term.compare':
                                                var self = $3819;
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
                                                        var $3843 = _state$1;
                                                        var $3842 = $3843;
                                                        break;
                                                };
                                                var $3820 = $3842;
                                                break;
                                        };
                                        var $3814 = $3820;
                                        break;
                                };
                                var $3808 = $3814;
                                break;
                        };
                        var $3710 = $3808;
                        break;
                    case 'Litereum.Term.create':
                    case 'Litereum.Term.word':
                    case 'Litereum.Term.run':
                    case 'Litereum.Term.bind':
                    case 'Litereum.Term.return':
                        var $3844 = _state$1;
                        var $3710 = $3844;
                        break;
                };
                var $3704 = $3710;
                break;
        };
        return $3704;
    };
    const Litereum$reduce = x0 => Litereum$reduce$(x0);

    function Litereum$normalize$many$(_state$1) {
        var self = _state$1;
        switch (self._) {
            case 'Litereum.Runtime.new':
                var $3846 = self.world;
                var $3847 = self.subst;
                var $3848 = self.fresh;
                var $3849 = self.gas;
                var $3850 = self.term;
                var self = $3850;
                switch (self._) {
                    case 'List.cons':
                        var $3852 = self.head;
                        var $3853 = self.tail;
                        var self = Litereum$normalize$(Litereum$Runtime$new$($3846, $3847, $3848, $3849, $3852));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3855 = self.world;
                                var $3856 = self.subst;
                                var $3857 = self.fresh;
                                var $3858 = self.gas;
                                var $3859 = self.term;
                                var self = Litereum$normalize$many$(Litereum$Runtime$new$($3855, $3856, $3857, $3858, $3853));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $3861 = self.world;
                                        var $3862 = self.subst;
                                        var $3863 = self.fresh;
                                        var $3864 = self.gas;
                                        var $3865 = self.term;
                                        var $3866 = Litereum$Runtime$new$($3861, $3862, $3863, $3864, List$cons$($3859, $3865));
                                        var $3860 = $3866;
                                        break;
                                };
                                var $3854 = $3860;
                                break;
                        };
                        var $3851 = $3854;
                        break;
                    case 'List.nil':
                        var $3867 = _state$1;
                        var $3851 = $3867;
                        break;
                };
                var $3845 = $3851;
                break;
        };
        return $3845;
    };
    const Litereum$normalize$many = x0 => Litereum$normalize$many$(x0);

    function Litereum$normalize$cases$(_ctrs$1, _name$2, _state$3) {
        var self = _state$3;
        switch (self._) {
            case 'Litereum.Runtime.new':
                var $3869 = self.world;
                var $3870 = self.subst;
                var $3871 = self.fresh;
                var $3872 = self.gas;
                var $3873 = self.term;
                var self = _ctrs$1;
                switch (self._) {
                    case 'List.cons':
                        var $3875 = self.head;
                        var $3876 = self.tail;
                        var self = $3873;
                        switch (self._) {
                            case 'List.cons':
                                var $3878 = self.head;
                                var $3879 = self.tail;
                                var _nams$13 = List$map$(a1 => ((_name$2 + ".") + a1), (() => {
                                    var self = $3875;
                                    switch (self._) {
                                        case 'Litereum.Constructor.new':
                                            var $3881 = self.field_names;
                                            var $3882 = $3881;
                                            return $3882;
                                    };
                                })());
                                var _vals$14 = List$map$(Litereum$Term$var, _nams$13);
                                var _subst$15 = Litereum$extend$($3870, _nams$13, _vals$14);
                                var self = Litereum$normalize$(Litereum$Runtime$new$($3869, _subst$15, $3871, $3872, $3878));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $3883 = self.world;
                                        var $3884 = self.subst;
                                        var $3885 = self.fresh;
                                        var $3886 = self.gas;
                                        var $3887 = self.term;
                                        var self = Litereum$normalize$cases$($3876, _name$2, Litereum$Runtime$new$($3883, $3884, $3885, $3886, $3879));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $3889 = self.world;
                                                var $3890 = self.subst;
                                                var $3891 = self.fresh;
                                                var $3892 = self.gas;
                                                var $3893 = self.term;
                                                var $3894 = Litereum$Runtime$new$($3889, $3890, $3891, $3892, List$cons$($3887, $3893));
                                                var $3888 = $3894;
                                                break;
                                        };
                                        var $3880 = $3888;
                                        break;
                                };
                                var $3877 = $3880;
                                break;
                            case 'List.nil':
                                var $3895 = _state$3;
                                var $3877 = $3895;
                                break;
                        };
                        var $3874 = $3877;
                        break;
                    case 'List.nil':
                        var self = $3873;
                        switch (self._) {
                            case 'List.nil':
                            case 'List.cons':
                                var $3897 = _state$3;
                                var $3896 = $3897;
                                break;
                        };
                        var $3874 = $3896;
                        break;
                };
                var $3868 = $3874;
                break;
        };
        return $3868;
    };
    const Litereum$normalize$cases = x0 => x1 => x2 => Litereum$normalize$cases$(x0, x1, x2);

    function Litereum$normalize$bound$(_names$1, _state$2) {
        var self = _state$2;
        switch (self._) {
            case 'Litereum.Runtime.new':
                var $3899 = self.world;
                var $3900 = self.subst;
                var $3901 = self.fresh;
                var $3902 = self.gas;
                var $3903 = self.term;
                var _subst$8 = Litereum$extend$($3900, _names$1, List$map$(Litereum$Term$var, _names$1));
                var $3904 = Litereum$normalize$(Litereum$Runtime$new$($3899, _subst$8, $3901, $3902, $3903));
                var $3898 = $3904;
                break;
        };
        return $3898;
    };
    const Litereum$normalize$bound = x0 => x1 => Litereum$normalize$bound$(x0, x1);

    function Litereum$normalize$(_state$1) {
        var self = Litereum$reduce$(_state$1);
        switch (self._) {
            case 'Litereum.Runtime.new':
                var $3906 = self.world;
                var $3907 = self.subst;
                var $3908 = self.fresh;
                var $3909 = self.gas;
                var $3910 = self.term;
                var self = $3910;
                switch (self._) {
                    case 'Litereum.Term.create':
                        var $3912 = self.ctor;
                        var $3913 = self.vals;
                        var self = Litereum$normalize$many$(Litereum$Runtime$new$($3906, $3907, $3908, $3909, $3913));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3915 = self.world;
                                var $3916 = self.subst;
                                var $3917 = self.fresh;
                                var $3918 = self.gas;
                                var $3919 = self.term;
                                var $3920 = Litereum$Runtime$new$($3915, $3916, $3917, $3918, Litereum$Term$create$($3912, $3919));
                                var $3914 = $3920;
                                break;
                        };
                        var $3911 = $3914;
                        break;
                    case 'Litereum.Term.match':
                        var $3921 = self.name;
                        var $3922 = self.data;
                        var $3923 = self.cses;
                        var self = Litereum$get_constructors$($3906, $3922);
                        switch (self._) {
                            case 'Maybe.some':
                                var $3925 = self.value;
                                var _ctrs$11 = $3925;
                                var self = _ctrs$11;
                                switch (self._) {
                                    case 'List.nil':
                                        var self = Litereum$normalize$cases$(_ctrs$11, $3921, Litereum$Runtime$new$($3906, $3907, $3908, $3909, $3923));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $3928 = self.world;
                                                var $3929 = self.subst;
                                                var $3930 = self.fresh;
                                                var $3931 = self.gas;
                                                var $3932 = self.term;
                                                var $3933 = Litereum$Runtime$new$($3928, $3929, $3930, $3931, Litereum$Term$match$($3921, $3922, $3932));
                                                var $3927 = $3933;
                                                break;
                                        };
                                        var $3926 = $3927;
                                        break;
                                    case 'List.cons':
                                        var self = Litereum$normalize$cases$(_ctrs$11, $3921, Litereum$Runtime$new$($3906, $3907, $3908, $3909, $3923));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $3935 = self.world;
                                                var $3936 = self.subst;
                                                var $3937 = self.fresh;
                                                var $3938 = self.gas;
                                                var $3939 = self.term;
                                                var $3940 = Litereum$Runtime$new$($3935, $3936, $3937, $3938, Litereum$Term$match$($3921, $3922, $3939));
                                                var $3934 = $3940;
                                                break;
                                        };
                                        var $3926 = $3934;
                                        break;
                                };
                                var $3924 = $3926;
                                break;
                            case 'Maybe.none':
                                var $3941 = Litereum$Runtime$new$($3906, $3907, $3908, $3909, $3910);
                                var $3924 = $3941;
                                break;
                        };
                        var $3911 = $3924;
                        break;
                    case 'Litereum.Term.compare':
                        var $3942 = self.val0;
                        var $3943 = self.val1;
                        var $3944 = self.iflt;
                        var $3945 = self.ifeq;
                        var $3946 = self.ifgt;
                        var self = Litereum$normalize$(Litereum$Runtime$new$($3906, $3907, $3908, $3909, $3942));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3948 = self.world;
                                var $3949 = self.subst;
                                var $3950 = self.fresh;
                                var $3951 = self.gas;
                                var $3952 = self.term;
                                var self = Litereum$normalize$(Litereum$Runtime$new$($3948, $3949, $3950, $3951, $3943));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $3954 = self.world;
                                        var $3955 = self.subst;
                                        var $3956 = self.fresh;
                                        var $3957 = self.gas;
                                        var $3958 = self.term;
                                        var self = Litereum$normalize$(Litereum$Runtime$new$($3954, $3955, $3956, $3957, $3944));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $3960 = self.world;
                                                var $3961 = self.subst;
                                                var $3962 = self.fresh;
                                                var $3963 = self.gas;
                                                var $3964 = self.term;
                                                var self = Litereum$normalize$(Litereum$Runtime$new$($3960, $3961, $3962, $3963, $3945));
                                                switch (self._) {
                                                    case 'Litereum.Runtime.new':
                                                        var $3966 = self.world;
                                                        var $3967 = self.subst;
                                                        var $3968 = self.fresh;
                                                        var $3969 = self.gas;
                                                        var $3970 = self.term;
                                                        var self = Litereum$normalize$(Litereum$Runtime$new$($3966, $3967, $3968, $3969, $3946));
                                                        switch (self._) {
                                                            case 'Litereum.Runtime.new':
                                                                var $3972 = self.world;
                                                                var $3973 = self.subst;
                                                                var $3974 = self.fresh;
                                                                var $3975 = self.gas;
                                                                var $3976 = self.term;
                                                                var $3977 = Litereum$Runtime$new$($3972, $3973, $3974, $3975, Litereum$Term$compare$($3952, $3958, $3964, $3970, $3976));
                                                                var $3971 = $3977;
                                                                break;
                                                        };
                                                        var $3965 = $3971;
                                                        break;
                                                };
                                                var $3959 = $3965;
                                                break;
                                        };
                                        var $3953 = $3959;
                                        break;
                                };
                                var $3947 = $3953;
                                break;
                        };
                        var $3911 = $3947;
                        break;
                    case 'Litereum.Term.operate':
                        var $3978 = self.oper;
                        var $3979 = self.val0;
                        var $3980 = self.val1;
                        var self = Litereum$normalize$(Litereum$Runtime$new$($3906, $3907, $3908, $3909, $3979));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3982 = self.world;
                                var $3983 = self.subst;
                                var $3984 = self.fresh;
                                var $3985 = self.gas;
                                var $3986 = self.term;
                                var self = Litereum$normalize$(Litereum$Runtime$new$($3982, $3983, $3984, $3985, $3980));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $3988 = self.world;
                                        var $3989 = self.subst;
                                        var $3990 = self.fresh;
                                        var $3991 = self.gas;
                                        var $3992 = self.term;
                                        var $3993 = Litereum$Runtime$new$($3988, $3989, $3990, $3991, Litereum$Term$operate$($3978, $3986, $3992));
                                        var $3987 = $3993;
                                        break;
                                };
                                var $3981 = $3987;
                                break;
                        };
                        var $3911 = $3981;
                        break;
                    case 'Litereum.Term.run':
                        var $3994 = self.name;
                        var $3995 = self.type;
                        var $3996 = self.expr;
                        var $3997 = self.body;
                        var self = Litereum$normalize$(Litereum$Runtime$new$($3906, $3907, $3908, $3909, $3996));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $3999 = self.world;
                                var $4000 = self.subst;
                                var $4001 = self.fresh;
                                var $4002 = self.gas;
                                var $4003 = self.term;
                                var self = Litereum$normalize$(Litereum$Runtime$new$($3999, $4000, $4001, $4002, $3997));
                                switch (self._) {
                                    case 'Litereum.Runtime.new':
                                        var $4005 = self.world;
                                        var $4006 = self.subst;
                                        var $4007 = self.fresh;
                                        var $4008 = self.gas;
                                        var $4009 = self.term;
                                        var $4010 = Litereum$Runtime$new$($4005, $4006, $4007, $4008, Litereum$Term$run$($3994, $3995, $4003, $4009));
                                        var $4004 = $4010;
                                        break;
                                };
                                var $3998 = $4004;
                                break;
                        };
                        var $3911 = $3998;
                        break;
                    case 'Litereum.Term.bind':
                        var $4011 = self.bond;
                        var $4012 = self.main;
                        var $4013 = self.body;
                        var self = Litereum$get_bond$($3906, $4011);
                        switch (self._) {
                            case 'Maybe.some':
                                var $4015 = self.value;
                                var _bond$11 = $4015;
                                var self = _bond$11;
                                switch (self._) {
                                    case 'Litereum.Bond.new':
                                        var $4017 = self.input_names;
                                        var self = Litereum$normalize$bound$($4017, Litereum$Runtime$new$($3906, $3907, $3908, $3909, $4012));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $4019 = self.world;
                                                var $4020 = self.subst;
                                                var $4021 = self.fresh;
                                                var $4022 = self.gas;
                                                var $4023 = self.term;
                                                var self = Litereum$normalize$(Litereum$Runtime$new$($4019, $4020, $4021, $4022, $4013));
                                                switch (self._) {
                                                    case 'Litereum.Runtime.new':
                                                        var $4025 = self.world;
                                                        var $4026 = self.subst;
                                                        var $4027 = self.fresh;
                                                        var $4028 = self.gas;
                                                        var $4029 = self.term;
                                                        var $4030 = Litereum$Runtime$new$($4025, $4026, $4027, $4028, Litereum$Term$bind$($4011, $4023, $4029));
                                                        var $4024 = $4030;
                                                        break;
                                                };
                                                var $4018 = $4024;
                                                break;
                                        };
                                        var $4016 = $4018;
                                        break;
                                };
                                var $4014 = $4016;
                                break;
                            case 'Maybe.none':
                                var $4031 = _state$1;
                                var $4014 = $4031;
                                break;
                        };
                        var $3911 = $4014;
                        break;
                    case 'Litereum.Term.return':
                        var $4032 = self.expr;
                        var self = Litereum$normalize$(Litereum$Runtime$new$($3906, $3907, $3908, $3909, $4032));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $4034 = self.world;
                                var $4035 = self.subst;
                                var $4036 = self.fresh;
                                var $4037 = self.gas;
                                var $4038 = self.term;
                                var $4039 = Litereum$Runtime$new$($4034, $4035, $4036, $4037, Litereum$Term$return$($4038));
                                var $4033 = $4039;
                                break;
                        };
                        var $3911 = $4033;
                        break;
                    case 'Litereum.Term.var':
                    case 'Litereum.Term.call':
                    case 'Litereum.Term.let':
                    case 'Litereum.Term.word':
                        var $4040 = Litereum$Runtime$new$($3906, $3907, $3908, $3909, $3910);
                        var $3911 = $4040;
                        break;
                };
                var $3905 = $3911;
                break;
        };
        return $3905;
    };
    const Litereum$normalize = x0 => Litereum$normalize$(x0);

    function Litereum$run$(_state$1) {
        var self = Litereum$reduce$(_state$1);
        switch (self._) {
            case 'Litereum.Runtime.new':
                var $4042 = self.world;
                var $4043 = self.subst;
                var $4044 = self.fresh;
                var $4045 = self.gas;
                var $4046 = self.term;
                var self = $4046;
                switch (self._) {
                    case 'Litereum.Term.run':
                        var $4048 = self.name;
                        var $4049 = self.type;
                        var $4050 = self.expr;
                        var $4051 = self.body;
                        var self = Litereum$run$(Litereum$Runtime$new$($4042, $4043, $4044, $4045, $4050));
                        switch (self._) {
                            case 'Litereum.Runtime.new':
                                var $4053 = self.world;
                                var $4054 = self.subst;
                                var $4055 = self.fresh;
                                var $4056 = self.gas;
                                var $4057 = self.term;
                                var self = $4057;
                                switch (self._) {
                                    case 'Litereum.Term.return':
                                        var $4059 = self.expr;
                                        var $4060 = Litereum$run$(Litereum$Runtime$new$($4053, Map$set$($4048, $4059, $4054), $4055, $4056, $4051));
                                        var $4058 = $4060;
                                        break;
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
                                        var $4061 = Litereum$Runtime$new$($4053, $4054, $4055, $4056, Litereum$Term$run$($4048, $4049, $4057, $4051));
                                        var $4058 = $4061;
                                        break;
                                };
                                var $4052 = $4058;
                                break;
                        };
                        var $4047 = $4052;
                        break;
                    case 'Litereum.Term.bind':
                        var $4062 = self.bond;
                        var $4063 = self.main;
                        var $4064 = self.body;
                        var self = Litereum$get_bond$($4042, $4062);
                        switch (self._) {
                            case 'Maybe.some':
                                var $4066 = self.value;
                                var _bond$11 = $4066;
                                var self = _bond$11;
                                switch (self._) {
                                    case 'Litereum.Bond.new':
                                        var $4068 = self.input_names;
                                        var self = Litereum$normalize$bound$($4068, Litereum$Runtime$new$($4042, $4043, $4044, $4045, $4063));
                                        switch (self._) {
                                            case 'Litereum.Runtime.new':
                                                var $4070 = self.world;
                                                var $4071 = self.subst;
                                                var $4072 = self.fresh;
                                                var $4073 = self.gas;
                                                var $4074 = self.term;
                                                var _new_entry$23 = Litereum$Entry$bond$((() => {
                                                    var self = _bond$11;
                                                    switch (self._) {
                                                        case 'Litereum.Bond.new':
                                                            var $4076 = self.name;
                                                            var $4077 = self.input_names;
                                                            var $4078 = self.input_types;
                                                            var $4079 = self.output_type;
                                                            var $4080 = self.owners;
                                                            var $4081 = Litereum$Bond$new$($4076, $4077, $4078, $4079, $4074, $4080);
                                                            return $4081;
                                                    };
                                                })());
                                                var self = $4070;
                                                switch (self._) {
                                                    case 'Litereum.World.new':
                                                        var $4082 = self.name_count;
                                                        var $4083 = self.name_to_index;
                                                        var $4084 = self.index_to_name;
                                                        var $4085 = Litereum$World$new$($4082, $4083, $4084, Map$set$($4062, _new_entry$23, (() => {
                                                            var self = $4070;
                                                            switch (self._) {
                                                                case 'Litereum.World.new':
                                                                    var $4086 = self.entry;
                                                                    var $4087 = $4086;
                                                                    return $4087;
                                                            };
                                                        })()));
                                                        var _new_world$24 = $4085;
                                                        break;
                                                };
                                                var $4075 = Litereum$run$(Litereum$Runtime$new$(_new_world$24, $4071, $4072, $4073, $4064));
                                                var $4069 = $4075;
                                                break;
                                        };
                                        var $4067 = $4069;
                                        break;
                                };
                                var $4065 = $4067;
                                break;
                            case 'Maybe.none':
                                var $4088 = _state$1;
                                var $4065 = $4088;
                                break;
                        };
                        var $4047 = $4065;
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
                        var $4089 = Litereum$Runtime$new$($4042, $4043, $4044, $4045, $4046);
                        var $4047 = $4089;
                        break;
                };
                var $4041 = $4047;
                break;
        };
        return $4041;
    };
    const Litereum$run = x0 => Litereum$run$(x0);

    function Litereum$show$type$(_world$1, _type$2) {
        var self = _type$2;
        switch (self._) {
            case 'Litereum.Type.data':
                var $4091 = self.name;
                var $4092 = $4091;
                var $4090 = $4092;
                break;
            case 'Litereum.Type.effect':
                var $4093 = self.rety;
                var $4094 = ("& " + Litereum$show$type$(_world$1, $4093));
                var $4090 = $4094;
                break;
            case 'Litereum.Type.word':
                var $4095 = "#word";
                var $4090 = $4095;
                break;
        };
        return $4090;
    };
    const Litereum$show$type = x0 => x1 => Litereum$show$type$(x0, x1);

    function Word$show$(_size$1, _a$2) {
        var $4096 = Nat$show$(Word$to_nat$(_a$2));
        return $4096;
    };
    const Word$show = x0 => x1 => Word$show$(x0, x1);
    const U64$show = a0 => (String(a0));

    function String$is_empty$(_str$1) {
        var self = _str$1;
        if (self.length === 0) {
            var $4098 = Bool$true;
            var $4097 = $4098;
        } else {
            var $4099 = self.charCodeAt(0);
            var $4100 = self.slice(1);
            var $4101 = Bool$false;
            var $4097 = $4101;
        };
        return $4097;
    };
    const String$is_empty = x0 => String$is_empty$(x0);

    function Litereum$show$term$(_world$1, _term$2) {
        var self = _term$2;
        switch (self._) {
            case 'Litereum.Term.var':
                var $4103 = self.name;
                var $4104 = $4103;
                var $4102 = $4104;
                break;
            case 'Litereum.Term.call':
                var $4105 = self.bond;
                var $4106 = self.args;
                var _bond$5 = $4105;
                var _args$6 = List$map$(Litereum$show$term(_world$1), $4106);
                var $4107 = (_bond$5 + ("(" + (String$join$(",", _args$6) + ")")));
                var $4102 = $4107;
                break;
            case 'Litereum.Term.let':
                var $4108 = self.name;
                var $4109 = self.type;
                var $4110 = self.expr;
                var $4111 = self.body;
                var _name$7 = $4108;
                var _type$8 = Litereum$show$type$(_world$1, $4109);
                var _expr$9 = Litereum$show$term$(_world$1, $4110);
                var _body$10 = Litereum$show$term$(_world$1, $4111);
                var $4112 = ("let " + (_name$7 + (" : " + (_type$8 + (" = " + (_expr$9 + (" " + _body$10)))))));
                var $4102 = $4112;
                break;
            case 'Litereum.Term.create':
                var $4113 = self.ctor;
                var $4114 = self.vals;
                var _vals$5 = List$mapped$($4114, Litereum$show$term(_world$1));
                var $4115 = ($4113 + ("{" + (String$join$(",", _vals$5) + "}")));
                var $4102 = $4115;
                break;
            case 'Litereum.Term.match':
                var $4116 = self.name;
                var $4117 = self.data;
                var $4118 = self.cses;
                var self = Litereum$get_data$(_world$1, $4117);
                switch (self._) {
                    case 'Maybe.some':
                        var $4120 = self.value;
                        var _data$7 = $4120;
                        var self = _data$7;
                        switch (self._) {
                            case 'Litereum.Data.new':
                                var $4122 = self.constructors;
                                var _name$10 = $4116;
                                var _cses$11 = List$zipped_with$($4122, $4118, (_case_ctor$11 => _case_body$12 => {
                                    var $4124 = ((() => {
                                        var self = _case_ctor$11;
                                        switch (self._) {
                                            case 'Litereum.Constructor.new':
                                                var $4125 = self.name;
                                                var $4126 = $4125;
                                                return $4126;
                                        };
                                    })() + (": " + Litereum$show$term$(_world$1, _case_body$12)));
                                    return $4124;
                                }));
                                var $4123 = ("case " + (_name$10 + (" : " + ($4117 + (" { " + (String$join$(", ", _cses$11) + " }"))))));
                                var $4121 = $4123;
                                break;
                        };
                        var $4119 = $4121;
                        break;
                    case 'Maybe.none':
                        var $4127 = "?";
                        var $4119 = $4127;
                        break;
                };
                var $4102 = $4119;
                break;
            case 'Litereum.Term.word':
                var $4128 = self.numb;
                var $4129 = ("#" + (String($4128)));
                var $4102 = $4129;
                break;
            case 'Litereum.Term.compare':
                var $4130 = self.val0;
                var $4131 = self.val1;
                var $4132 = self.iflt;
                var $4133 = self.ifeq;
                var $4134 = self.ifgt;
                var _val0$8 = Litereum$show$term$(_world$1, $4130);
                var _val1$9 = Litereum$show$term$(_world$1, $4131);
                var _iflt$10 = Litereum$show$term$(_world$1, $4132);
                var _ifeq$11 = Litereum$show$term$(_world$1, $4133);
                var _ifgt$12 = Litereum$show$term$(_world$1, $4134);
                var $4135 = ("compare " + (_val0$8 + (" " + (_val1$9 + (" { _<_: " + (_iflt$10 + (" _=_: " + (_ifeq$11 + (" _>_: " + (_ifgt$12 + " }"))))))))));
                var $4102 = $4135;
                break;
            case 'Litereum.Term.operate':
                var $4136 = self.oper;
                var $4137 = self.val0;
                var $4138 = self.val1;
                var self = $4136;
                switch (self._) {
                    case 'Litereum.Operation.add':
                        var $4140 = "+";
                        var _oper$6 = $4140;
                        break;
                    case 'Litereum.Operation.sub':
                        var $4141 = "-";
                        var _oper$6 = $4141;
                        break;
                    case 'Litereum.Operation.mul':
                        var $4142 = "*";
                        var _oper$6 = $4142;
                        break;
                    case 'Litereum.Operation.div':
                        var $4143 = "/";
                        var _oper$6 = $4143;
                        break;
                    case 'Litereum.Operation.mod':
                        var $4144 = "%";
                        var _oper$6 = $4144;
                        break;
                    case 'Litereum.Operation.or':
                        var $4145 = "|";
                        var _oper$6 = $4145;
                        break;
                    case 'Litereum.Operation.and':
                        var $4146 = "&";
                        var _oper$6 = $4146;
                        break;
                    case 'Litereum.Operation.xor':
                        var $4147 = "^";
                        var _oper$6 = $4147;
                        break;
                };
                var _val0$7 = Litereum$show$term$(_world$1, $4137);
                var _val1$8 = Litereum$show$term$(_world$1, $4138);
                var $4139 = (_oper$6 + ("(" + (_val0$7 + ("," + (_val1$8 + ")")))));
                var $4102 = $4139;
                break;
            case 'Litereum.Term.run':
                var $4148 = self.name;
                var $4149 = self.type;
                var $4150 = self.expr;
                var $4151 = self.body;
                var _name$7 = $4148;
                var _type$8 = Litereum$show$type$(_world$1, $4149);
                var _expr$9 = Litereum$show$term$(_world$1, $4150);
                var _body$10 = Litereum$show$term$(_world$1, $4151);
                var self = String$is_empty$(_name$7);
                if (self) {
                    var $4153 = ("run " + (_expr$9 + ("; " + _body$10)));
                    var $4152 = $4153;
                } else {
                    var $4154 = ("run " + (_name$7 + (" : " + (_type$8 + (" = " + (_expr$9 + ("; " + _body$10)))))));
                    var $4152 = $4154;
                };
                var $4102 = $4152;
                break;
            case 'Litereum.Term.bind':
                var $4155 = self.bond;
                var $4156 = self.main;
                var $4157 = self.body;
                var _bond$6 = $4155;
                var _main$7 = Litereum$show$term$(_world$1, $4156);
                var _body$8 = Litereum$show$term$(_world$1, $4157);
                var $4158 = ("bind " + (_bond$6 + (" { " + (_main$7 + (" } " + _body$8)))));
                var $4102 = $4158;
                break;
            case 'Litereum.Term.return':
                var $4159 = self.expr;
                var _expr$4 = Litereum$show$term$(_world$1, $4159);
                var $4160 = ("return " + _expr$4);
                var $4102 = $4160;
                break;
        };
        return $4102;
    };
    const Litereum$show$term = x0 => x1 => Litereum$show$term$(x0, x1);

    function Litereum$transact$(_world$1, _transaction$2) {
        var self = _world$1;
        switch (self._) {
            case 'Litereum.World.new':
                var $4162 = self.name_count;
                var $4163 = self.name_to_index;
                var $4164 = self.index_to_name;
                var $4165 = self.entry;
                var self = _transaction$2;
                switch (self._) {
                    case 'Litereum.Transaction.new_name':
                        var $4167 = self.name;
                        var _name$8 = $4167;
                        var self = Map$get$(_name$8, (() => {
                            var self = _world$1;
                            switch (self._) {
                                case 'Litereum.World.new':
                                    var $4169 = self.name_to_index;
                                    var $4170 = $4169;
                                    return $4170;
                            };
                        })());
                        switch (self._) {
                            case 'Maybe.none':
                                var self = _world$1;
                                switch (self._) {
                                    case 'Litereum.World.new':
                                        var $4172 = self.name_to_index;
                                        var $4173 = self.index_to_name;
                                        var $4174 = self.entry;
                                        var $4175 = Litereum$World$new$(($4162 + 1n), $4172, $4173, $4174);
                                        var _world$9 = $4175;
                                        break;
                                };
                                var self = _world$9;
                                switch (self._) {
                                    case 'Litereum.World.new':
                                        var $4176 = self.name_count;
                                        var $4177 = self.index_to_name;
                                        var $4178 = self.entry;
                                        var $4179 = Litereum$World$new$($4176, Map$set$(_name$8, $4162, $4163), $4177, $4178);
                                        var _world$10 = $4179;
                                        break;
                                };
                                var self = _world$10;
                                switch (self._) {
                                    case 'Litereum.World.new':
                                        var $4180 = self.name_count;
                                        var $4181 = self.name_to_index;
                                        var $4182 = self.entry;
                                        var $4183 = Litereum$World$new$($4180, $4181, Map$set$(Nat$show$($4162), _name$8, $4164), $4182);
                                        var _world$11 = $4183;
                                        break;
                                };
                                var $4171 = Maybe$some$(Pair$new$(_world$11, ("[name] " + _name$8)));
                                var $4168 = $4171;
                                break;
                            case 'Maybe.some':
                                var $4184 = Maybe$none;
                                var $4168 = $4184;
                                break;
                        };
                        var $4166 = $4168;
                        break;
                    case 'Litereum.Transaction.new_data':
                        var $4185 = self.data;
                        var _data$8 = $4185;
                        var self = _data$8;
                        switch (self._) {
                            case 'Litereum.Data.new':
                                var $4187 = self.name;
                                var self = Map$get$($4187, $4165);
                                switch (self._) {
                                    case 'Maybe.none':
                                        var self = _world$1;
                                        switch (self._) {
                                            case 'Litereum.World.new':
                                                var $4190 = self.name_count;
                                                var $4191 = self.name_to_index;
                                                var $4192 = self.index_to_name;
                                                var $4193 = Litereum$World$new$($4190, $4191, $4192, Map$set$($4187, Litereum$Entry$data$(_data$8), $4165));
                                                var _world$11 = $4193;
                                                break;
                                        };
                                        var $4189 = Maybe$some$(Pair$new$(_world$11, ("[data] " + $4187)));
                                        var $4188 = $4189;
                                        break;
                                    case 'Maybe.some':
                                        var $4194 = Maybe$none;
                                        var $4188 = $4194;
                                        break;
                                };
                                var $4186 = $4188;
                                break;
                        };
                        var $4166 = $4186;
                        break;
                    case 'Litereum.Transaction.new_bond':
                        var $4195 = self.bond;
                        var _bond$8 = $4195;
                        var self = _bond$8;
                        switch (self._) {
                            case 'Litereum.Bond.new':
                                var $4197 = self.name;
                                var $4198 = self.input_names;
                                var $4199 = self.input_types;
                                var $4200 = self.output_type;
                                var $4201 = self.main;
                                var self = Map$get$($4197, $4165);
                                switch (self._) {
                                    case 'Maybe.none':
                                        var self = _world$1;
                                        switch (self._) {
                                            case 'Litereum.World.new':
                                                var $4204 = self.name_count;
                                                var $4205 = self.name_to_index;
                                                var $4206 = self.index_to_name;
                                                var $4207 = Litereum$World$new$($4204, $4205, $4206, Map$set$($4197, Litereum$Entry$bond$(_bond$8), $4165));
                                                var _world$15 = $4207;
                                                break;
                                        };
                                        var _context$16 = Litereum$extend$(Map$from_list$(List$nil), $4198, $4199);
                                        var self = Litereum$check$(_context$16, _world$15, $4201, $4200);
                                        if (self) {
                                            var $4208 = Maybe$some$(Pair$new$(_world$15, ("[bond] " + $4197)));
                                            var $4203 = $4208;
                                        } else {
                                            var $4209 = Maybe$none;
                                            var $4203 = $4209;
                                        };
                                        var $4202 = $4203;
                                        break;
                                    case 'Maybe.some':
                                        var $4210 = Maybe$none;
                                        var $4202 = $4210;
                                        break;
                                };
                                var $4196 = $4202;
                                break;
                        };
                        var $4166 = $4196;
                        break;
                    case 'Litereum.Transaction.new_eval':
                        var $4211 = self.eval;
                        var _eval$8 = $4211;
                        var self = _eval$8;
                        switch (self._) {
                            case 'Litereum.Eval.new':
                                var $4213 = self.term;
                                var $4214 = self.type;
                                var self = Litereum$check$(Map$from_list$(List$nil), _world$1, $4213, $4214);
                                if (self) {
                                    var _fresh$11 = 0n;
                                    var self = Litereum$sanitize$(_world$1, Map$from_list$(List$nil), _fresh$11, $4213);
                                    switch (self._) {
                                        case 'Pair.new':
                                            var $4217 = self.fst;
                                            var $4218 = self.snd;
                                            var self = $4214;
                                            switch (self._) {
                                                case 'Litereum.Type.word':
                                                case 'Litereum.Type.data':
                                                    var $4220 = Litereum$normalize$(Litereum$Runtime$new$(_world$1, Map$from_list$(List$nil), $4217, 0n, $4218));
                                                    var self = $4220;
                                                    break;
                                                case 'Litereum.Type.effect':
                                                    var $4221 = Litereum$normalize$(Litereum$run$(Litereum$Runtime$new$(_world$1, Map$from_list$(List$nil), $4217, 0n, $4218)));
                                                    var self = $4221;
                                                    break;
                                            };
                                            switch (self._) {
                                                case 'Litereum.Runtime.new':
                                                    var $4222 = self.world;
                                                    var $4223 = self.term;
                                                    var $4224 = Maybe$some$(Pair$new$($4222, ("[eval] " + Litereum$show$term$($4222, $4223))));
                                                    var $4219 = $4224;
                                                    break;
                                            };
                                            var $4216 = $4219;
                                            break;
                                    };
                                    var $4215 = $4216;
                                } else {
                                    var $4225 = Maybe$none;
                                    var $4215 = $4225;
                                };
                                var $4212 = $4215;
                                break;
                        };
                        var $4166 = $4212;
                        break;
                };
                var $4161 = $4166;
                break;
        };
        return $4161;
    };
    const Litereum$transact = x0 => x1 => Litereum$transact$(x0, x1);

    function Litereum$api$run$go$transactions$(_world$1, _block_number$2, _code$3, _transactions$4) {
        var self = _transactions$4;
        switch (self._) {
            case 'List.cons':
                var $4227 = self.head;
                var $4228 = self.tail;
                var self = Litereum$transact$(_world$1, $4227);
                switch (self._) {
                    case 'Maybe.some':
                        var $4230 = self.value;
                        var self = $4230;
                        switch (self._) {
                            case 'Pair.new':
                                var $4232 = self.fst;
                                var $4233 = self.snd;
                                var $4234 = IO$monad$((_m$bind$10 => _m$pure$11 => {
                                    var $4235 = _m$bind$10;
                                    return $4235;
                                }))(IO$print$(("- " + $4233)))((_$10 => {
                                    var $4236 = Litereum$api$run$go$transactions$($4232, _block_number$2, _code$3, $4228);
                                    return $4236;
                                }));
                                var $4231 = $4234;
                                break;
                        };
                        var $4229 = $4231;
                        break;
                    case 'Maybe.none':
                        var $4237 = IO$monad$((_m$bind$7 => _m$pure$8 => {
                            var $4238 = _m$bind$7;
                            return $4238;
                        }))(IO$print$("- [fail]"))((_$7 => {
                            var $4239 = Litereum$api$run$go$transactions$(_world$1, _block_number$2, _code$3, $4228);
                            return $4239;
                        }));
                        var $4229 = $4237;
                        break;
                };
                var $4226 = $4229;
                break;
            case 'List.nil':
                var $4240 = IO$monad$((_m$bind$5 => _m$pure$6 => {
                    var $4241 = _m$bind$5;
                    return $4241;
                }))(IO$print$(""))((_$5 => {
                    var $4242 = Litereum$api$run$go$(_world$1, Nat$succ$(_block_number$2), _code$3);
                    return $4242;
                }));
                var $4226 = $4240;
                break;
        };
        return $4226;
    };
    const Litereum$api$run$go$transactions = x0 => x1 => x2 => x3 => Litereum$api$run$go$transactions$(x0, x1, x2, x3);

    function Litereum$api$run$go$(_world$1, _block_number$2, _code$3) {
        var _parsed$4 = Litereum$parse$block$(_world$1)(Parser$State$new$(Maybe$none, "", 0n, 0n, _code$3));
        var self = _parsed$4;
        switch (self._) {
            case 'Parser.Reply.error':
                var $4244 = self.err;
                var self = $4244;
                switch (self._) {
                    case 'Parser.Error.new':
                        var $4246 = self.nam;
                        var $4247 = self.ini;
                        var $4248 = self.idx;
                        var $4249 = self.msg;
                        var self = ($4248 < String$length$(_code$3));
                        if (self) {
                            var _err$10 = ($4249 + (() => {
                                var self = $4246;
                                if (self.length === 0) {
                                    var $4252 = "";
                                    return $4252;
                                } else {
                                    var $4253 = self.charCodeAt(0);
                                    var $4254 = self.slice(1);
                                    var $4255 = (" Inside " + ($4246 + ":"));
                                    return $4255;
                                };
                            })());
                            var _hig$11 = Kind$Code$highlight$(_code$3, $4247, $4248, Nat$succ$($4248));
                            var _str$12 = String$flatten$(List$cons$(_err$10, List$cons$("\u{a}", List$cons$(_hig$11, List$nil))));
                            var $4251 = IO$monad$((_m$bind$13 => _m$pure$14 => {
                                var $4256 = _m$bind$13;
                                return $4256;
                            }))(IO$print$(("Error parsing block #" + Nat$show$(_block_number$2))))((_$13 => {
                                var $4257 = IO$print$(_str$12);
                                return $4257;
                            }));
                            var $4250 = $4251;
                        } else {
                            var $4258 = IO$print$("Done.");
                            var $4250 = $4258;
                        };
                        var $4245 = $4250;
                        break;
                };
                var $4243 = $4245;
                break;
            case 'Parser.Reply.value':
                var $4259 = self.pst;
                var $4260 = self.val;
                var _block$7 = $4260;
                var $4261 = IO$monad$((_m$bind$8 => _m$pure$9 => {
                    var $4262 = _m$bind$8;
                    return $4262;
                }))(IO$print$(("Block #" + Nat$show$(_block_number$2))))((_$8 => {
                    var _bits_0$9 = Litereum$serialize$block$(_world$1, _block$7);
                    var _bits_1$10 = Litereum$serialize$block$(_world$1, (() => {
                        var self = Litereum$deserialize$block$(_world$1, _bits_0$9);
                        switch (self._) {
                            case 'Pair.new':
                                var $4264 = self.snd;
                                var $4265 = $4264;
                                return $4265;
                        };
                    })());
                    var $4263 = IO$monad$((_m$bind$11 => _m$pure$12 => {
                        var $4266 = _m$bind$11;
                        return $4266;
                    }))(IO$print$(("$ " + (Bits$hex$encode$(_bits_0$9) + (" " + (() => {
                        var self = (_bits_1$10 === _bits_0$9);
                        if (self) {
                            var $4267 = "ok";
                            return $4267;
                        } else {
                            var $4268 = "bad_serialization";
                            return $4268;
                        };
                    })())))))((_$11 => {
                        var $4269 = Litereum$api$run$go$transactions$(_world$1, _block_number$2, (() => {
                            var self = $4259;
                            switch (self._) {
                                case 'Parser.State.new':
                                    var $4270 = self.str;
                                    var $4271 = $4270;
                                    return $4271;
                            };
                        })(), _block$7);
                        return $4269;
                    }));
                    return $4263;
                }));
                var $4243 = $4261;
                break;
        };
        return $4243;
    };
    const Litereum$api$run$go = x0 => x1 => x2 => Litereum$api$run$go$(x0, x1, x2);
    const Litereum$genesis = Litereum$World$new$(1n, Map$from_list$(List$cons$(Pair$new$("", 0n), List$nil)), Map$from_list$(List$cons$(Pair$new$("0", ""), List$nil)), Map$from_list$(List$nil));

    function Litereum$api$run$(_code$1) {
        var $4272 = Litereum$api$run$go$(Litereum$genesis, 0n, _code$1);
        return $4272;
    };
    const Litereum$api$run = x0 => Litereum$api$run$(x0);
    const Litereum = (() => {
        var _x$1 = Litereum$api$run;
        var $4273 = IO$monad$((_m$bind$2 => _m$pure$3 => {
            var $4274 = _m$pure$3;
            return $4274;
        }))(Unit$new);
        return $4273;
    })();
    return {
        '$main$': () => run(Litereum),
        'run': run,
        'Parser.Reply': Parser$Reply,
        'List': List,
        'Parser.Reply.error': Parser$Reply$error,
        'Bool.false': Bool$false,
        'Bool.true': Bool$true,
        'Nat.gtn': Nat$gtn,
        'Parser.Error.combine': Parser$Error$combine,
        'List.cons': List$cons,
        'Parser.Reply.value': Parser$Reply$value,
        'List.reverse.go': List$reverse$go,
        'List.nil': List$nil,
        'List.reverse': List$reverse,
        'Parser.until.go': Parser$until$go,
        'Parser.until': Parser$until,
        'Parser.many.go': Parser$many$go,
        'Parser.many': Parser$many,
        'Parser.Error.new': Parser$Error$new,
        'Parser.Reply.fail': Parser$Reply$fail,
        'Maybe.some': Maybe$some,
        'Maybe': Maybe,
        'Maybe.none': Maybe$none,
        'Parser.Error.maybe_combine': Parser$Error$maybe_combine,
        'Parser.State.new': Parser$State$new,
        'Parser.choice': Parser$choice,
        'Parser': Parser,
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
        'Pair': Pair,
        'Litereum.Type.effect': Litereum$Type$effect,
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
        'Cmp.as_ltn': Cmp$as_ltn,
        'Word.ltn': Word$ltn,
        'U16.ltn': U16$ltn,
        'U16.cmp': U16$cmp,
        'String.cmp': String$cmp,
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
        'Nat.apply': Nat$apply,
        'Word': Word,
        'Word.e': Word$e,
        'Word.i': Word$i,
        'Word.o': Word$o,
        'Word.inc': Word$inc,
        'Word.zero': Word$zero,
        'Nat.to_word': Nat$to_word,
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
        'Litereum.parse.block': Litereum$parse$block,
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
        'Word.adder': Word$adder,
        'Word.add': Word$add,
        'U16.add': U16$add,
        'Pair.fst': Pair$fst,
        'Nat.div': Nat$div,
        'Bits.i': Bits$i,
        'Litereum.serialize.fixlen': Litereum$serialize$fixlen,
        'Word.fold': Word$fold,
        'Word.to_nat': Word$to_nat,
        'U16.to_nat': U16$to_nat,
        'Bits.concat': Bits$concat,
        'Litereum.serialize.name.new': Litereum$serialize$name$new,
        'Litereum.serialize.varlen.go': Litereum$serialize$varlen$go,
        'Litereum.serialize.varlen': Litereum$serialize$varlen,
        'Litereum.serialize.name': Litereum$serialize$name,
        'Litereum.serialize.list': Litereum$serialize$list,
        'Litereum.serialize.type': Litereum$serialize$type,
        'Litereum.serialize.constructor': Litereum$serialize$constructor,
        'Litereum.serialize.data': Litereum$serialize$data,
        'List.find_index.go': List$find_index$go,
        'List.find_index': List$find_index,
        'String.eql': String$eql,
        'Litereum.serialize.name.local': Litereum$serialize$name$local,
        'List.map': List$map,
        'List.concat': List$concat,
        'Litereum.serialize.cases': Litereum$serialize$cases,
        'Maybe.default': Maybe$default,
        'Litereum.get_constructors': Litereum$get_constructors,
        'U64.to_nat': U64$to_nat,
        'Litereum.get_bond': Litereum$get_bond,
        'Litereum.serialize.term': Litereum$serialize$term,
        'Litereum.serialize.bond': Litereum$serialize$bond,
        'Litereum.serialize.eval': Litereum$serialize$eval,
        'Litereum.serialize.transaction': Litereum$serialize$transaction,
        'Litereum.serialize.block': Litereum$serialize$block,
        'Bits.is_empty': Bits$is_empty,
        'Litereum.deserialize.fixlen': Litereum$deserialize$fixlen,
        'U16.from_nat': U16$from_nat,
        'Litereum.deserialize.name.new': Litereum$deserialize$name$new,
        'Litereum.deserialize.varlen.go': Litereum$deserialize$varlen$go,
        'Nat.sub': Nat$sub,
        'Litereum.deserialize.varlen': Litereum$deserialize$varlen,
        'Litereum.deserialize.name': Litereum$deserialize$name,
        'Litereum.deserialize.list': Litereum$deserialize$list,
        'Litereum.deserialize.type': Litereum$deserialize$type,
        'Litereum.deserialize.constructor': Litereum$deserialize$constructor,
        'Litereum.deserialize.data': Litereum$deserialize$data,
        'U64.from_nat': U64$from_nat,
        'List.get': List$get,
        'Litereum.deserialize.name.local': Litereum$deserialize$name$local,
        'Litereum.deserialize.cases': Litereum$deserialize$cases,
        'Litereum.deserialize.term': Litereum$deserialize$term,
        'Litereum.deserialize.bond': Litereum$deserialize$bond,
        'Litereum.deserialize.eval': Litereum$deserialize$eval,
        'Litereum.deserialize.transaction': Litereum$deserialize$transaction,
        'Litereum.deserialize.block': Litereum$deserialize$block,
        'Bits.hex.encode': Bits$hex$encode,
        'Bits.eql': Bits$eql,
        'BBT': BBT,
        'Map': Map,
        'Litereum.World.new': Litereum$World$new,
        'BBT.bin': BBT$bin,
        'U32.new': U32$new,
        'Nat.to_u32': Nat$to_u32,
        'BBT.tip': BBT$tip,
        'BBT.singleton': BBT$singleton,
        'BBT.size': BBT$size,
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
        'Litereum.Entry.data': Litereum$Entry$data,
        'Litereum.Entry.bond': Litereum$Entry$bond,
        'Litereum.extend': Litereum$extend,
        'Pair.snd': Pair$snd,
        'BBT.from_list.go': BBT$from_list$go,
        'BBT.from_list': BBT$from_list,
        'Map.from_list': Map$from_list,
        'Litereum.equal': Litereum$equal,
        'List.zip': List$zip,
        'List.all': List$all,
        'Maybe.mapped': Maybe$mapped,
        'List.ifind.go': List$ifind$go,
        'List.ifind': List$ifind,
        'Litereum.get_constructor_value': Litereum$get_constructor_value,
        'List.length': List$length,
        'List.zip_with': List$zip_with,
        'List.zipped_with': List$zipped_with,
        'List.and': List$and,
        'Litereum.check': Litereum$check,
        'Litereum.sanitize.many': Litereum$sanitize$many,
        'Triple.new': Triple$new,
        'Litereum.rename': Litereum$rename,
        'List.for': List$for,
        'Litereum.sanitize.cases': Litereum$sanitize$cases,
        'Triple': Triple,
        'Litereum.rename.many': Litereum$rename$many,
        'Litereum.sanitize': Litereum$sanitize,
        'Litereum.Runtime': Litereum$Runtime,
        'Litereum.Runtime.new': Litereum$Runtime$new,
        'Litereum.get_constructor_index': Litereum$get_constructor_index,
        'U64.ltn': U64$ltn,
        'U64.eql': U64$eql,
        'U64.cmp': U64$cmp,
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
        'Litereum.reduce': Litereum$reduce,
        'Litereum.normalize.many': Litereum$normalize$many,
        'Litereum.normalize.cases': Litereum$normalize$cases,
        'Litereum.normalize.bound': Litereum$normalize$bound,
        'Litereum.normalize': Litereum$normalize,
        'Litereum.run': Litereum$run,
        'Litereum.show.type': Litereum$show$type,
        'Word.show': Word$show,
        'U64.show': U64$show,
        'String.is_empty': String$is_empty,
        'Litereum.show.term': Litereum$show$term,
        'Litereum.transact': Litereum$transact,
        'Litereum.api.run.go.transactions': Litereum$api$run$go$transactions,
        'Litereum.api.run.go': Litereum$api$run$go,
        'Litereum.genesis': Litereum$genesis,
        'Litereum.api.run': Litereum$api$run,
        'Litereum': Litereum,
    };
})();
module.exports['$main$']();