# Pomodoro

Pomodoro app synched between all devices.


# Project Tracking

[Trello](https://trello.com/b/88dIdyVg/pomodoro)

# States

- WB(N) -> tick -> WB(N - 1)
- WB(0) -> finish -> Paused[BW(Max)]
- WB(N) -> pause -> Paused[WB(N)]
- Paused[WB(N)] -> resume -> WB(N)
- WB(N) -> restart -> W(Max)



# App

```
                 +-------+
                 | Init  |
                 +---+---+
                     |
                     | +-----+
                     | |     |
                 +---v-v-+   | Reset
   Stop/Resume   |       +---+
            +----> Work  |
+------+    |    |       <---------------+
|      |    |    +---+---+               |
| Stop <----+        |                   |
|      |    |        | after 25 min      | After 5 min
+------+    |        |                   | or Reset
            |    +---v---+               |
            +----> Break +---------------+
                 +-------+
````
