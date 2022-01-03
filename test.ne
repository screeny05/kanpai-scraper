main -> (element {% id %} | array):* {% id %}

element -> identifier ";" {% id %}
array -> identifier "[]" ";" {% id %}

identifier -> [a-zA-Z]:* {% ([_]) => _.join('') %}
