#! /bin/sh
echo $@
/home/culacant/go/bin/csvq -f JSON $@
