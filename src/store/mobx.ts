// store/counterStore.js
import { makeAutoObservable } from 'mobx';

class MobXStore {
  // 状态
  count = 0;
  name = 'MobX 计数器';

  constructor() {
    // 关键！让整个实例变成可观察的
    makeAutoObservable(this);
  }

  // 动作（Actions）
  increment() {
    this.count += 1;
  }

  decrement() {
    this.count -= 1;
  }

  reset() {
    this.count = 0;
  }

  // 计算值（Computed）- 用 get 定义
  get doubleCount() {
    return this.count * 2;
  }

  get status() {
    return this.count === 0 ? '零' : this.count > 0 ? '正数' : '负数';
  }
}

// 创建单例实例并导出
const mobXStore = new MobXStore();

export default mobXStore;