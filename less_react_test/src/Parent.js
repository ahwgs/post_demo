import React from 'react';
import Child from './Child'
import styles from './Parent.less'


function Parent() {
  return (
    <div className={styles.parent}>
        <Child/>
        <div className={styles.component}>css modules parent</div>
    </div>
  );
}

export default Parent;
