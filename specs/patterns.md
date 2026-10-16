# Shared patterns

PATTERN: Command-line error
RULE:    One line on standard error per problem: `<command>: ` then what
         happened, then what to do, under 80 characters. A usage line may
         follow. Nothing on standard output. Exit 2 for a usage error
         (wrong arguments), 1 for input that can't be used. Never echo the
         input back (it can be long or hold control bytes). No colour codes.
WHY:     Scripts capture standard output, so errors never mix with results;
         the exit code tells a caller which mistake was made.
USED BY: (the screens or commands that point here)
EXCEPTIONS: none
