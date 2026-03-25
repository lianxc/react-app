// TodoList.jsx
import React, { useState, useRef, useCallback } from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import './group.css';

function TodoList() {
  const [items, setItems] = useState([
    { id: 1, text: '任务1' },
    { id: 2, text: '任务2' }
  ]);
  const nodeRefs = useRef({}); // 存储每个项的 ref
  const nextId = useRef(3); // 下一个可用的 ID

  // 添加任务 - 用 useCallback 优化性能
  const addItem = useCallback(() => {
    const newItem = {
      id: nextId.current++,
      text: `任务${nextId.current - 1}`
    };
    setItems(prevItems => [...prevItems, newItem]);
  }, []);

  // 删除任务
  const removeItem = useCallback((id) => {
    setItems(prevItems => prevItems.filter(item => item.id !== id));
    // 清理对应的 ref（可选，不清理也没关系）
    delete nodeRefs.current[id];
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <button 
        onClick={addItem}
        style={{
          padding: '10px 20px',
          background: '#4a90e2',
          color: 'white',
          border: 'none',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          marginBottom: '20px'
        }}
      >
        ➕ 添加任务
      </button>

      <TransitionGroup component="ul" className="todo-list">
        {items.map(item => {
          // 为每个项创建或获取 ref
          if (!nodeRefs.current[item.id]) {
            nodeRefs.current[item.id] = React.createRef();
          }
          
          return (
            <CSSTransition
              key={item.id} // ✅ 使用稳定的 ID 作为 key
              nodeRef={nodeRefs.current[item.id]}
              timeout={500}
              className="todo"
            >
              <li 
                ref={nodeRefs.current[item.id]} 
                onClick={() => removeItem(item.id)}
                style={{ cursor: 'pointer' }}
                title="点击删除"
              >
                {item.text}
              </li>
            </CSSTransition>
          );
        })}
      </TransitionGroup>
      
      {items.length === 0 && (
        <p style={{ 
          color: '#999', 
          textAlign: 'center', 
          marginTop: '20px',
          padding: '20px',
          background: '#f5f5f5',
          borderRadius: '4px'
        }}>
          暂无任务，点击上方按钮添加
        </p>
      )}
    </div>
  );
}

export default TodoList;