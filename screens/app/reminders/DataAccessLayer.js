import SQLite from "react-native-sqlite-storage";
import { jsCoreDateCreator, scheduleNotification, scheduleReminders } from "./RemindersSchedule";
import moment from "moment";

SQLite.enablePromise(false);
SQLite.DEBUG(true);

Number.prototype.padLeft = function (base, chr) {
  var len = (String(base || 10).length - String(this).length) + 1;
  return len > 0 ? new Array(len).join(chr || '0') + this : this;
}

const formatDate = (d) => {
  d = new Date(jsCoreDateCreator(d.toString()));
  return [d.getFullYear(), (d.getMonth() + 1).padLeft(),
  d.getDate().padLeft()
  ].join('-') + ' ' +
    [d.getHours().padLeft(),
    d.getMinutes().padLeft(),
    d.getSeconds().padLeft()].join(':');
};

const db = SQLite.openDatabase(
  {
    name: "StgNotificationDB",
    location: "default",
  },
  () => {},
  (error) => {
    console.log(error);
  }
);

export const createTables = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS " +
      "Reminders " +
      "(ReminderID INTEGER PRIMARY KEY, Title TEXT, StartDate datetime, EndDate datetime, frequency INTEGER, UserID INTEGER);"
    );
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS " +
      "Schedules " +
      "(ScheduleID TEXT PRIMARY KEY, Time datetime, ReminderID INTEGER REFERENCES Reminders(ID));"
    );
  });
};

export const selectRemindersToSchedule = (count, callback) => {
  db.transaction((tx) => {
    tx.executeSql(
      "SELECT  * FROM Schedules INNER JOIN Reminders ON Schedules.ReminderID = Reminders.ReminderID ORDER BY Time ASC LIMIT " +
      count +
      ";",
      [],
      (_, { rows }) => {
        var temp = [];

        for (let i = 0; i < rows.length; i++) {
          temp.push(rows.item(i));
        }
        // alert(JSON.stringify(temp.map(n => { return { "Title": n.Title, "Date": new Date(jsCoreDateCreator(n.Time)) } })));

        temp.forEach((data) => {
          if (data.ScheduleID.split("_")[2] == "last")
            data.Title = `The Reminder ${data.Title} has been expired.`;

          if (new Date(jsCoreDateCreator(data.Time)) > new Date())
            scheduleNotification(
              data.UserID,
              data.UserID + "_" + data.ScheduleID,
              data.Title,
              data.Time
            );
        });
        if (callback) callback();
      }
    );
  });
};

export const removeDeliveredReminders = () => {
  db.transaction((tx) => {
    tx.executeSql(
      "DELETE FROM Schedules WHERE Time < '" + moment().format('YYYY-MM-DD HH:MM:SS') + "';"
      , [], () => {
        db.transaction((tx) => {
          tx.executeSql(
            `DELETE FROM Reminders WHERE NOT EXISTS (
            SELECT * FROM Schedules
            WHERE  Schedules.ReminderID = Reminders.ReminderID
            ); `
          );
        });
      }
    );
  });
};

export const addReminderToDB = (reminder, callback) => {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO Reminders (ReminderID, Title, StartDate, EndDate, frequency, UserID) VALUES (?,?,?,?,?,?)",
        [
          reminder.reminder_id,
          reminder.reminder_title,
          formatDate(
            moment(reminder.start_date).format("YYYY-MM-DD H:mm:ss")
          ),
          formatDate(
            moment(reminder.end_date).format("YYYY-MM-DD H:mm:ss")
          ),
          // moment(reminder.start_date, "YYYY-MM-DD hh:mm a").format("YYYY-MM-DDTHH:mm:ss"),
          // moment(reminder.end_date, "YYYY-MM-DD hh:mm a").format("YYYY-MM-DDTHH:mm:ss"),
          reminder.frequency_per_day,
          reminder.user_id,
        ],
        (tx, rs) => {
          addSchedulesToDB(reminder, callback);
        },
        (err) => {
          console.log(err);
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};

export const addRemindersToDB = (reminderRows, ScheduleRows, callback) => {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO Reminders (ReminderID, Title, StartDate, EndDate, frequency, UserID) VALUES " +
        reminderRows +
        ";",
        [],
        (tx, rs) => {
          addSchedulesListToDB(ScheduleRows, callback);
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};

const addSchedulesListToDB = (ScheduleRows, callback) => {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO Schedules (ScheduleID, Time, ReminderID) VALUES " +
        ScheduleRows +
        ";",
        [],
        (tx, rs) => {
          scheduleReminders(callback);
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};

const addSchedulesToDB = (reminder, callback) => {
  let schedules = reminder.schedules || reminder.schedueles;
  let rowsToInsert = schedules
    .map((schedule) => {
      return `('${schedule.schedule_id}', '${formatDate(
        moment(schedule.schedule_time).format("YYYY-MM-DD H:mm:ss")
      )}', ${reminder.reminder_id})`;
    })
    .join(",");
  rowsToInsert += `,('${reminder.user_id}_${reminder.reminder_id
    }_last', '${formatDate(moment(schedules[0].schedule_time).format("YYYY-MM-DD H:mm:ss"))}', ${reminder.reminder_id
    })`;
  try {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO Schedules (ScheduleID, Time, ReminderID) VALUES " +
        rowsToInsert +
        ";",
        [],
        (tx, rs) => {
          scheduleReminders(callback);
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};

export const addRemindersListToDB = (remindersList, callback) => {
  if (!remindersList.length) return;
  let schedulesRowsToAdd = "";
  let remindersRowsToAdd = remindersList
    .map((reminder) => {
      let schedules = reminder.schedules || reminder.schedueles;
      schedulesRowsToAdd += schedulesRowsToAdd.length ? "," : "";
      schedulesRowsToAdd += schedules
        .map((schedule) => {
          return `('${schedule.schedule_id}', '${formatDate(
            moment(schedule.schedule_time).format("YYYY-MM-DD H:mm:ss")
          )}', ${reminder.reminder_id})`;
        })
        .join(",");
      schedulesRowsToAdd += `,('${reminder.user_id}_${reminder.reminder_id
        }_last', '${formatDate(
          moment(schedules[0].schedule_time).format("YYYY-MM-DD H:mm:ss")
        )}', ${reminder.reminder_id})`;
      return `(${reminder.reminder_id},'${reminder.reminder_title
        }','${formatDate(moment(reminder.start_date).format("YYYY-MM-DD H:mm:ss"))}','${formatDate(
          moment(reminder.end_date).format("YYYY-MM-DD H:mm:ss")
        )}',${reminder.frequency_per_day},${reminder.user_id})`;
    })
    .join(",");

  addRemindersToDB(remindersRowsToAdd, schedulesRowsToAdd, callback);
};

export const deleteReminderFromDB = (reminder, callback) => {
  let schedules = reminder.schedules || reminder.schedueles;
  let rowsToDelete = schedules
    .map((schedule) => {
      return `"${schedule.schedule_id}"`;
    })
    .join(",");
  rowsToDelete += `,"${reminder.user_id}_${reminder.reminder_id}_last"`;

  try {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM Schedules " +
        "WHERE ScheduleID IN (" +
        rowsToDelete +
        ");",
        [],
        (tx, rs) => {
          deleteReminder(reminder.reminder_id, callback);
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteReminder = (reminderID, callback) => {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM Reminders " + "WHERE ReminderID =  " + reminderID + ";",
        [],
        () => {
          callback();
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};

export const deleteUserRemindersListFromDB = (userID, callback) => {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        `DELETE FROM Schedules
        WHERE Schedules.ReminderID IN (
          SELECT s.ReminderID FROM Schedules s
          INNER JOIN Reminders r
            ON (s.ReminderID = r.ReminderID)
          WHERE r.UserID =  ` +
        userID +
        `);`,
        [],
        () => {
          deleteUserReminders(userID, callback);
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};

const deleteUserReminders = (userID, callback) => {
  try {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM Reminders " + "WHERE UserID = " + userID + ";",
        [],
        () => {
          callback();
        }
      );
    });
  } catch (error) {
    console.log(error);
  }
};