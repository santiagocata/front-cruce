import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";

import Grid from "@mui/material/Grid";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useParams } from "react-router";
import genTurns from "../utils/genTurns";
import Countdown from "react-countdown";
import Swal from "sweetalert2";
//Socket
// import { io } from "socket.io-client";
import axios from "axios";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DatePicker from "@mui/lab/DatePicker";

import { useNavigate, Navigate } from "react-router-dom";

//Socket
// const connectionOptions = {
//   "force new connection": true,
//   reconnectionAttempts: 1,
//   timeout: 10000,
//   transports: ["websocket"],
//   secure: true,
// };

export default function PickTurnSelect({ id }) {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [date, setDate] = useState(tomorrow);
  const [time, setTime] = useState("");
  const [status, setStatus] = useState({});
  const [availability, setAvailability] = useState("");
  const [branch, setBranch] = useState({});
  const [listener, setListener] = useState(false);
  const navigate = useNavigate();

  //Socket
  // const socket = io("http://localhost:3001", connectionOptions);

  // socket.on("submit", (time, message) => {
  //   if (date.toISOString().slice(0, 10) === time) console.log(message);
  // });

  const submitData = () => {
    axios
      .post(`/turn`, {
        branchId: id,
        date: date.toISOString().slice(0, 10),
        time: time,
      })
      .then((data) => {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Turno reservado",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/");
      })
      .catch(() => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: "Ya posee un turno pendiente",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/");
      });
    //Socket
    // socket.emit(
    //   "submit",
    //   date.toISOString().slice(0, 10),
    //   "Un turno ha sido tomado"
    // );
  };

  useEffect(() => {
    axios.get(`/branch/${id}`).then((branch) => {
      setBranch(branch.data);
    });
  }, []);

  useEffect(() => {
    axios
      .get(`/branch/disponibility/${id}/${date.toISOString().slice(0, 10)}`)
      .then((status) => {
        setStatus(status.data);
      });
  }, [date]);

  function disableWeekends(date) {
    return date.getDay() === 0 || date.getDay() === 6;
  }

  if (!branch.turnRange) {
    return null;
  }

  const handleChange = (e) => {
    setDate(e);
    setTime("");
    setAvailability("");
    setListener(true);
  };

  return (
    <>
      <Grid item xs={4}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Elige el día"
            value={date}
            inputFormat="dd/MM/yyyy"
            onChange={(e) => handleChange(e)}
            shouldDisableDate={disableWeekends}
            minDate={tomorrow}
            renderInput={(params) => (
              <TextField sx={{ width: 220 }} {...params} />
            )}
          />
        </LocalizationProvider>
      </Grid>
      <Grid item xs={4}>
        <FormControl>
          <InputLabel>Elige el horario</InputLabel>
          <Select sx={{ width: 220 }} value={time} label="Elige el horario">
            {genTurns(
              JSON.parse(branch.turnRange).open,
              JSON.parse(branch.turnRange).close,
              branch.maxPerTurn,
              status
            ).map((turn, i) => {
              return (
                <MenuItem
                  onClick={() => {
                    setTime(turn.time);
                    setAvailability(turn.available);
                  }}
                  key={i}
                  value={turn.time}
                >
                  {turn.time}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Grid>
      {!time == "" && (
        <Grid item xs={4}>
          <TextField
            sx={{ width: 220 }}
            id="outlined-read-only-input"
            label="Turnos disponibles"
            value={availability}
            color="success"
            disabled
            InputProps={{
              readOnly: true,
            }}
          />
        </Grid>
      )}
      <Grid item xs={4}>
        <Button
          onClick={submitData}
          type="submit"
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={time === ""}
        >
          RESERVAR
        </Button>
      </Grid>
    </>
  );
}
