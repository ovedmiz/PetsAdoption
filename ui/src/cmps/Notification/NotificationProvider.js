import React, { createContext, useContext, useReducer } from 'react'
import { v4 as uuidv4 } from 'uuid';
import Notification from './Notification';
import './NotificationProvider.css'

const NotificationContext = createContext()

const NotificationProvider = (props) => {
    const [state, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case 'ADD_NOTIFICATION':
                return [...state, { ...action.payload }]
            case 'REMOVE_NOTIFICATION':
                return state.filter(note => note.id !== action.id)
            default:
                return state;
        }
    }, [])


    return (
        <NotificationContext.Provider value={dispatch}>
            <div className="notification-wrapper">
                {state.map(note => {
                    return <Notification dispatch={dispatch} key={note.id} {...note} />
                })}
            </div>
            {props.children}
        </NotificationContext.Provider>
    )
}

export const useNotification = () => {
    const notificationDispatch = useContext(NotificationContext)

    return (props) => {
        notificationDispatch({
            type: 'ADD_NOTIFICATION',
            payload: {
                id: uuidv4(),
                ...props
            }
        })
    }

}

export default NotificationProvider