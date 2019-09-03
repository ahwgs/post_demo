import React from 'react';
import styles from './Child.less'

function Child() {
    return (
        <div className={styles.child}>
            <div className={styles.component}>
                css modules child
            </div>
        </div>
    );
}

export default Child
