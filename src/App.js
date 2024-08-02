import { useEffect, useRef, useState } from 'react';
import './App.css';

function App() {
  const inputRef = useRef(null);
  const [todos, setTodos] = useState([]);

  const formLock = (e) => { // form 초기화 방지
    e.preventDefault();
  }

  const inputActionHandler = () => {
    inputRef.current.value = '';
    inputRef.current.focus();
  }
  
  return (
    <div className='todolist'>
      <h1>TodoList</h1>
      <form onSubmit={formLock}>
        <input type='text' ref={inputRef} />
        <button
          type='submit'
          className='add-btn'
          onClick={() => {
            const newTodo = {id: Number(new Date()), content: inputRef.current.value}
            const newTodos = [newTodo, ...todos];
            setTodos(newTodos);
            inputActionHandler();
          }}
        >
          추가
        </button>
      </form>
      <ul className='todos'>
        {
          todos.map((todo) => {
            return (
              <Todo key={todo.id} todo={todo} setTodos={setTodos} />
            )
          })
        }
      </ul>
      <Clock />
      <StopWatch />
      <WiseSaying />
    </div>
  );
}

export default App;

function Todo({ todo, setTodos }) {
  const [editInputValue, setEditInputValue] = useState("");
  const [editInputStatus, setEditInputStatus] = useState(false);
  const [completeStatus,setCompleteStatus] = useState(false);
  const editChangeInput = (event) => {
    setEditInputValue(event.target.value);
  }

  return (
    <li>
      <p className={completeStatus ? 'content complete' : 'content'}>{todo.content}</p>
      {
        editInputStatus ?
        <input
          type='text'
          className='edit-inp'
          value={editInputValue}
          onChange={editChangeInput}
        /> : null
      }
      
      <div className='btn-box'>
        <EditBtn
          todo={todo}
          setTodos={setTodos}
          editInputValue={editInputValue}
          editInputStatus={editInputStatus}
          setEditInputStatus={setEditInputStatus}
        />
        <DelBtn todo={todo} setTodos={setTodos} />
        <Complete setCompleteStatus={setCompleteStatus} />
      </div>
    </li>
  )
}

function EditBtn({ todo, setTodos, editInputValue, editInputStatus, setEditInputStatus }) {
  return (
    <button
      type='button'
      onClick={() => {
        setTodos((prev) => {
          return prev.map((e) => {
            return e.id === todo.id ? {...e, content: editInputValue} : e;
          })
        })
        setEditInputStatus((prev) => !prev);
      }}
    >
      {editInputStatus ? '수정완료' : '수정'}
    </button>
  )
}

function DelBtn({ todo, setTodos }) {
  return (
    <button
      type='button'
      onClick={() => {
        setTodos((prev) => {
          return prev.filter((e) => {
            return todo.id !== e.id
          });
        })
      }}
    >
      삭제
    </button>
  )
}

function Complete({ setCompleteStatus }) {
  return (
    <button
      type='button'
      onClick={() => {
        setCompleteStatus((prev) => !prev)
      }}
    >
      완료
    </button>
  )
}

function Clock() {
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    setInterval(() => {
      setClock(new Date());
    }, 1000);
  }, []);

  return (
    <div>현재시간: {clock.toLocaleTimeString()}</div>
  )
}

function StopWatch() {
  const [stopWatch, setStopWatch] = useState(3599);
  const [isOn, setIsOn] = useState(false);
  const timerRef = useRef(null); 

  useEffect(() => {
    if (isOn) {
      const timer = setInterval(() => {
        setStopWatch((prev) => {
          return prev + 1;
        })
      }, 1000);
      timerRef.current = timer;
    } else {
      clearInterval(timerRef.current);
    }
    
  }, [isOn]);

  return (
    <>
      <div>{FormatTime(stopWatch)}</div>
      <button onClick={() => {
        setIsOn((prev) => !prev)
      }}>
        { isOn ? 'Off' : 'On' }
      </button>
      <button onClick={() => {
        setStopWatch(0);
        setIsOn(false);
      }}>
        Reset
      </button>
    </>
  )
}

function WiseSaying() {
  const {isLoading, data} = useFetch("https://korean-advice-open-api.vercel.app/api/advice");
  console.log(data)

  return (
    <div>
      {
        isLoading ? 'loading' : `${data.author}: ${data.message}`
      }
    </div>
  )
}

function useFetch(url) { // custom hook
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then((response) => {
        setData(response);
        setIsLoading(false);
      });
  }, [url]);
  
  return {isLoading, data}
}

function FormatTime(seconds) { // 시간 포맷 함수
  const hour = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const minute = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const second = String(Math.floor(seconds % 60)).padStart(2, '0');
  const timeString = `${hour}:${minute}:${second}`;
  return timeString;
}