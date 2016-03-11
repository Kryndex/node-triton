/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/*
 * Copyright 2016 Joyent, Inc.
 *
 * `triton instance ip ...`
 */

var format = require('util').format;

var errors = require('../errors');


function do_ip(subcmd, opts, args, cb) {
    if (opts.help) {
        this.do_help('help', {}, [subcmd], cb);
        return;
    } else if (args.length === 0) {
        cb(new errors.UsageError('missing <inst> argument'));
        return;
    } else if (args.length > 1) {
        cb(new errors.UsageError('too many arguments: ' + args));
        return;
    }

    var cli = this.top;

    cli.tritonapi.getInstance(args[0], function (err, inst) {
        if (err) {
            cb(err);
            return;
        }

        if (!inst.primaryIp) {
            cb(new errors.TritonError(format(
                'primaryIp not found for instance "%s"', args[0])));
            return;
        }

        console.log(inst.primaryIp);
        cb();
    });
}

do_ip.options = [
    {
        names: ['help', 'h'],
        type: 'bool',
        help: 'Show this help.'
    }
];

do_ip.help = [
    /* BEGIN JSSTYLED */
    'Print the primaryIp of the given instance.',
    '',
    'Usage:',
    '     {{name}} ip <inst>',
    '',
    '{{options}}',
    'For example: ssh root@$(triton ip my-instance)'
].join('\n');


do_ip.completionArgtypes = ['tritoninstance', 'none'];

module.exports = do_ip;