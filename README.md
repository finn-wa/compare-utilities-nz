# compare-utilities-nz

Compares power & gas plans from various providers in NZ, based on my flat's hourly usage data.

Example output for 6 months of data (converted from `console.table` output to markdown tables):

### Electricity Plans

_Std = Standard Use, Low = Low Use, \* = requires bundle_

| name                                              | cost     |
| ------------------------------------------------- | -------- |
| Contact: Electricity - Good Nights (Low)          | $693.21  |
| Electric Kiwi: Prepay 300 (Low)                   | $698.53  |
| Mercury: Electricity - Open Term (Low)            | $720.85  |
| Electric Kiwi: Kiwi (Low)                         | $724.27  |
| Frank: Electricity (Low)                          | $735.33  |
| Flick: Flat (Low)                                 | $736.18  |
| Flick: Off Peak (Low)                             | $736.98  |
| Mercury: Electricity - Open Term (Std)            | $737.13  |
| Electric Kiwi: Prepay 300 (Std)                   | $741.45  |
| Contact: Electricity - Good Nights (Std)          | $759.88  |
| Frank: Electricity (Std)                          | $760.83  |
| Contact: Electricity - Good Weekends (Low)        | $766.98  |
| Flick: Flat (Std)                                 | $783.71  |
| Flick: Off Peak (Std)                             | $784.75  |
| Genesis: Electricity - Energy Plus Bundle (Low)\* | $796.25  |
| Contact: Electricity - Good Weekends (Std)        | $817.40  |
| Electric Kiwi: MoveMaster (Low)                   | $835.37  |
| Genesis: Electricity - Energy Plus Bundle (Std)\* | $839.06  |
| Genesis: Electricity - Energy Plus (Low)          | $839.53  |
| Electric Kiwi: MoveMaster (Std)                   | $883.75  |
| Genesis: Electricity - Energy Plus (Std)          | $884.66  |
| Electric Kiwi: Kiwi (Std)                         | $1190.51 |

### Gas Plans

_Std = Standard Use, Low = Low Use, \* = requires bundle_

| name                                      | cost    |
| ----------------------------------------- | ------- |
| Mercury: Gas - Open Term (Low)\*          | $278.74 |
| Mercury: Gas - Open Term (Std)\*          | $282.26 |
| Contact: Gas - Living Smart               | $287.00 |
| Mercury: Gas - Open Term (Low)            | $298.58 |
| Genesis: Gas - Energy Plus Bundle (Low)\* | $299.01 |
| Genesis: Gas - Energy Plus Bundle (Std)\* | $302.04 |
| Frank: Piped Gas (Bundled)\*              | $303.17 |
| Genesis: Gas - Energy Plus (Low)          | $315.27 |
| Genesis: Gas - Energy Plus (Std)          | $318.46 |
| Frank: Piped Gas (Unbundled)              | $418.21 |

### Internet Plans

_\* = requires bundle_

| name                         | cost   |
| ---------------------------- | ------ |
| Contact: Fast Fibre\*        | $70.00 |
| Quic: Runner                 | $79.00 |
| Electric Kiwi: Sweet Fibre\* | $79.50 |
| Mercury: Fibre Classic\*     | $91.00 |

### Plan Combinations & Provider Bundles

The best bundle from each provider + the best combination of unbundled plans

_Std = Standard Use, Low = Low Use, \* = requires bundle_

| name          | electricity                                       | gas                                       | internet                     | cost     |
| ------------- | ------------------------------------------------- | ----------------------------------------- | ---------------------------- | -------- |
| Contact       | Contact: Electricity - Good Nights (Low)          | Contact: Gas - Living Smart               | Contact: Fast Fibre\*        | $1050.20 |
| Unbundled     | Contact: Electricity - Good Nights (Low)          | Contact: Gas - Living Smart               | Quic: Runner                 | $1059.20 |
| Electric Kiwi | Electric Kiwi: Prepay 300 (Low)                   | Contact: Gas - Living Smart               | Electric Kiwi: Sweet Fibre\* | $1065.03 |
| Mercury       | Mercury: Electricity - Open Term (Low)            | Mercury: Gas - Open Term (Low)\*          | Quic: Runner                 | $1078.59 |
| Frank         | Frank: Electricity (Low)                          | Frank: Piped Gas (Bundled)\*              | Quic: Runner                 | $1117.50 |
| Genesis       | Genesis: Electricity - Energy Plus Bundle (Low)\* | Genesis: Gas - Energy Plus Bundle (Low)\* | Quic: Runner                 | $1174.26 |

## Dev Notes

This was also an experiment with using TypeScript with .js files with jsdocs, rather than .ts files.
For context, I love TypeScript but the tooling gets me down.

### Pros

- No builder dependencies
- No compile step
- No yarn scripts needed
- Speedy startup
- No source maps - easy debugging
- Typechecking works well
- Getting types from libraries works well
- You can run code that doesn't compile in TS if you need to do something quickly

### Cons

- Verbose type definition syntax for interfaces.
  You can use TS syntax but it doesn't get syntax highlighting, or use jsdoc syntax and be prepared to type a lot.
- Verbose function parameter/return type syntax.
  I really missed the TypeScript inline types here.
- The editor actions are lacking - you can't automate adding type definitions using inference like you can when writing in a .ts file.
- No easy way to add types from another file like a top-level import - types are automatically imported on every reference
  You really have to hold the compiler's hand on strict mode, often with more verbosity and if-checks than is strictly necessary.
- No `extends` - the TS compiler doesn't seem to understand the jsdoc `@extends` keyword, the only workaround is to use `&` which is not quite the same.
- No way to tell the TS compiler to chill out - no `as Type`, no `!` suffix.
- No generics apart from in function type definitions (as far as I can tell).
  When combined with the previous point, this can be a real headache.
  Once I ended up just copy-pasting the same code thrice with only the property name (electricity/gas/internet) altered.

### In Summary

In future, I'd use .js files for scripts and projects even smaller than this one.
But if I had to do this project again, I'd probably just use Deno or ts-node so I could write .ts files without configuring a build tool.

### P.S.

I tried yarn PnP (plug-n-play) and it's still not ready for everyday use in my opinion.
Setting it up to work with VS Code is a bit irritating, and it still doesn't work with ES Modules.
I couldn't get the Temporal polyfill to work until I switched to `nodeLinker: node-modules`, then it worked perfectly.
