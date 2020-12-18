import React, {useCallback, useState, useRef, useEffect, useMemo} from "react";
import {connect} from "react-redux";

import "../style/sidebar.css";
import PersianDate from "persian-date";
import date from "moment-jalaali";
import {PlusOutlined} from "@ant-design/icons";
import "antd/dist/antd.compact.min.css";
import {Button, Container, Modal} from "reactstrap";
import CategoryModal from "./add_category_modal";
import {confirmAlert} from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import {EditSvg, TrashSvg} from "./icons";
import {
  t_find_completed_todos,
  t_find_incompleted_todos,
  t_find_all,
  t_find_important_todo,
  t_find_today_todo,
  t_find_tomorrow_todo,
  t_find_fail_todos,
  t_task_category,
  t_set_category,
  t_delete_category,
  t_find_my_Todos,
} from "../../redux/thunk";

const perDate = new PersianDate();

const Sidebar = React.memo(props => {
  //const preventFromFirstRender = useRef(false);
  const [todos, setTodos] = useState(props.todos);
  const [completed, setCompleted] = useState([]);
  const [incompleted, setInCompleted] = useState([]);
  const [important, setImportant] = useState([]);
  const [allTodos, setAllTodos] = useState(props.todos || []);
  const [todayTodos, setTodayTodos] = useState([]);
  const [tomorrowTodos, setTomorrowTodos] = useState([]);
  const [myTodos, setMyTodos] = useState([]);
  const [failTasks, setFailTasks] = useState([]);
  const linkDetails = useMemo(
    () => [
      {currentTodos: 1, text: " کامل شده", getInfo: completed, dispatchMethod: t_find_completed_todos},
      {currentTodos: 2, text: " کامل نشده", getInfo: incompleted, dispatchMethod: t_find_incompleted_todos},
      {currentTodos: 3, text: " ضروری", getInfo: important, dispatchMethod: t_find_important_todo},
      {currentTodos: 4, text: " امروز", getInfo: todayTodos, dispatchMethod: t_find_today_todo},
      {currentTodos: 5, text: " فردا", getInfo: tomorrowTodos, dispatchMethod: t_find_tomorrow_todo},
      {currentTodos: 6, text: " عقب افتاده", getInfo: failTasks, dispatchMethod: t_find_fail_todos},
      {currentTodos: 7, text: "کارهای من", getInfo: myTodos, dispatchMethod: t_find_my_Todos},
      {currentTodos: -1, text: "همه ی کارها", getInfo: allTodos, dispatchMethod: t_find_all},
    ],
    [completed, completed, incompleted, allTodos, important, todayTodos, tomorrowTodos, failTasks, todos, props.todos]
  );
  useEffect(() => {
    setTodos(props.todos);
  }, [props]);
  useEffect(() => {
    try {
      setAllTodos([...props.todos]);
      setCompleted(props.todos.filter(item => item.todo_completed == true));
      setInCompleted(props.todos.filter(item => item.todo_completed == false));
      setImportant(props.todos.filter(item => item.important == true));
      setMyTodos(props.todos.filter(item => item.assigned_to == localStorage.getItem("X-USER-KEY")));
      setTodayTodos(
        props.todos.filter(item => {
          const m = date(item.deadline, "jYYYY/jM/jD");
          return (
            perDate.calendar().day == parseInt(m.jDate()) &&
            perDate.calendar().month + 1 == parseInt(m.jMonth()) + 1 &&
            perDate.calendar().year == parseInt(m.jYear())
          );
        })
      );
      setTomorrowTodos(
        props.todos.filter(item => {
          const m = date(item.deadline, "jYYYY-jMM-jDD");
          return (
            perDate.calendar().day == parseInt(m.jDate()) - 1 &&
            perDate.calendar().month + 1 == parseInt(m.jMonth()) + 1 &&
            perDate.calendar().year == parseInt(m.jYear())
          );
        })
      );
      setFailTasks(
        props.todos.filter(item => {
          const m = date(item.deadline, "jYYYY-jMM-jDD", "fa");
          if (
            perDate.calendar().day > parseInt(m.jDate()) &&
            perDate.calendar().month + 1 == parseInt(m.jMonth()) + 1 &&
            perDate.calendar().year == parseInt(m.jYear())
          ) {
            return (
              perDate.calendar().day > parseInt(m.jDate()) &&
              perDate.calendar().month + 1 == parseInt(m.jMonth()) + 1 &&
              perDate.calendar().year == parseInt(m.jYear())
            );
          } else if (
            perDate.calendar().day == parseInt(m.jDate()) &&
            perDate.calendar().month + 1 > parseInt(m.jMonth()) + 1 &&
            perDate.calendar().year == parseInt(m.jYear())
          ) {
            return (
              perDate.calendar().day == parseInt(m.jDate()) &&
              perDate.calendar().month + 1 > parseInt(m.jMonth()) + 1 &&
              perDate.calendar().year == parseInt(m.jYear())
            );
          } else if (
            perDate.calendar().day > parseInt(m.jDate()) &&
            perDate.calendar().month + 1 >= parseInt(m.jMonth()) + 1 &&
            perDate.calendar().year >= parseInt(m.jYear())
          ) {
            return (
              perDate.calendar().day > parseInt(m.jDate()) &&
              perDate.calendar().month + 1 >= parseInt(m.jMonth()) + 1 &&
              perDate.calendar().year >= parseInt(m.jYear())
            );
          } else if (
            perDate.calendar().day >= parseInt(m.jDate()) &&
            perDate.calendar().month + 1 > parseInt(m.jMonth()) + 1 &&
            perDate.calendar().year >= parseInt(m.jYear())
          )
            return (
              perDate.calendar().day >= parseInt(m.jDate()) &&
              perDate.calendar().month + 1 > parseInt(m.jMonth()) + 1 &&
              perDate.calendar().year >= parseInt(m.jYear())
            );
          else if (
            perDate.calendar().day >= parseInt(m.jDate()) &&
            perDate.calendar().month + 1 >= parseInt(m.jMonth()) + 1 &&
            perDate.calendar().year > parseInt(m.jYear())
          )
            return (
              perDate.calendar().day >= parseInt(m.jDate()) &&
              perDate.calendar().month + 1 >= parseInt(m.jMonth()) + 1 &&
              perDate.calendar().year > parseInt(m.jYear())
            );
          else
            return (
              perDate.calendar().day == parseInt(m.jDate()) &&
              perDate.calendar().month + 1 == parseInt(m.month()) + 1 &&
              perDate.calendar().year > parseInt(m.jYear())
            );
        })
      );
    } catch (err) {
      console.log(err.message);
    }
  }, [todos, props.todos]);

  return (
    <aside className={`sidebar pl-0 position-relative d-md-block ${props.toggle ? "menu-on" : ""}`}>
      <div className="p-0 h-100">
        <div className="d-flex flex-column align-items-md-stretch justify-content-start justify-content-md-center h-100">
          <SideBarToggle />
          <div className="d-block d-md-none">
            {linkDetails.map((item, i) => (
              <div
                onClick={() => props.dispatch(item.dispatchMethod())}
                key={i}
                className={`sidebar-link dark-link text-right px-3 ${props.currentTodos == item.currentTodos ? "item-active" : ""}`}
                data-count={item.getInfo.length}
              >
                <button className="text-white">{item.text}</button>
              </div>
            ))}
          </div>
          <div className="sidebar-links h-100">
            <Categories categories={props.categories} currentTodos={props.currentTodos} dispatch={props.dispatch} />
          </div>
        </div>
      </div>
    </aside>
  );
});

const stateToProps = ({hamberger, todos, user}) => {
  return {
    toggle: hamberger.hamberger,
    todos: todos.todo,
    currentTodos: todos.currentTodos,
    categories: todos.categories,
  };
};

export default connect(stateToProps)(Sidebar);

const SideBarToggle = React.memo(() => (
  <div className="sidebar-toggle-btn align-self-end d-none">
    <button>
      <span className="navbar-toggler-icon"> {} </span>
    </button>
  </div>
));

const Categories = React.memo(({categories, currentTodos, dispatch}) => {
  const [modal, setModal] = useState(false);
  const [currentList, setCurrentList] = useState(""); // this state used for delete and editing list
  const deleteList = useCallback(
    id => {
      return confirmAlert({
        customUI: ({onClose}) => {
          return (
            <Container className="border-primary rounded-25 bg-fourth m-5 p-1 text-center">
              <h4 className="text-primary m-2">حذف لیست </h4>
              <p className="w-100 text-right px-3 text-primary m-2"> آیا مطمعنید ؟ </p>
              <div className="w-100 d-flex align-items-center justify-content-around">
                <Button onClick={onClose} className="bg-primary text-danger rounded-25 border-primary px-3 m-2">
                  خیر
                </Button>
                <Button
                  onClick={() => {
                    dispatch(t_delete_category(id));
                    onClose();
                  }}
                  className="bg-primary text-success rounded-25 border-primary px-3 m-2"
                >
                  بلی
                </Button>
              </div>
            </Container>
          );
        },
      });
    },
    [currentList]
  );
  return (
    <>
      <Modal isOpen={modal} className={"add-category-modal bg-fourth rounded"}>
        <CategoryModal modal={modal} setModal={setModal} currentCategory={currentList} dispatch={dispatch} />
      </Modal>
      <div className="text-primary task-category text-center pr-3">
        <div
          className="position-relative text-center"
          onClick={() => {
            dispatch(t_task_category());
          }}
        >
          <h4 className=" text-dark">پروژه ها</h4>
          <div
            className={" text-center bg-r-secondary rounded-pill fill-primary mt-3 mb-2"}
            onClick={() => {
              setCurrentList("");
              setModal(true);
            }}
          >
            <PlusOutlined />
          </div>
        </div>
        <ul className="d-flex flex-column ">
          {categories.map(item => {
            return (
              <li
                key={item.id}
                data-id={item.id}
                id={item.id}
                className={` before-shadow2 text-dark d-flex align-items-center justify-content-between  my-2 ${
                  currentTodos == `0${item?.id}` ? "active-category " : ""
                }`}
                onClick={e => {
                  let id = e.target.getAttribute("data-id");
                  dispatch(t_set_category(`0${id}`));
                }}
              >
                <p id={item.id} data-id={item.id} className="text-dark text-right">
                  {item?.category_name}
                </p>
                <div id={item.id} data-id={item.id} className="px-2 d-flex align-items-center category-actions">
                  <div
                    data-id={item.id}
                    id={item.id}
                    className="mx-1 before-shadow2 svg-secondary"
                    onClick={e => {
                      let id = e.target.getAttribute("data-id");
                      setCurrentList({name: categories.filter(i => parseInt(i.id) == id) || "", id});
                      deleteList(id);
                    }}
                  >
                    <TrashSvg id={item?.id} />
                  </div>
                  <div
                    data-id={item?.id}
                    className="mx-1 before-shadow2 svg-secondary"
                    onClick={e => {
                      let id = e.target.getAttribute("data-id");
                      setCurrentList(categories.filter(i => parseInt(i.id) == id));
                      setModal(true);
                    }}
                  >
                    <EditSvg id={item?.id} />
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
});


