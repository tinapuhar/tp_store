import React from 'react';
import styles from './button.scss';

export default function Button({ children, onClick, type = 'button' }) {
    return (
        <button type={type} className={styles.btn} onClick={onClick}>
            {children}
        </button>
    );
}