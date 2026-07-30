import React from 'react';
import styles from './header.scss';

export default function Header({ title }) {
    return (
        <header className={styles.header}>
            <h1>{title}</h1>
        </header>
    );
}