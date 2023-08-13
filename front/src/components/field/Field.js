import React from 'react';
import styles from './Field.module.css';

const Field = ({ children, ...props }) => {
  return (
    <div className={styles.main} {...props}>
      {children}
    </div>
  );
};

export default Field;