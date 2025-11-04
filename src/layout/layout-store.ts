export interface LayoutItems {
  layoutType: 'tree' | 'mindmap' | 'force';
  direction: 'TB' | 'BT' | 'LR' | 'RL' | undefined;
  treeType: 'left' | 'right' | 'both' | undefined;
}

export class LayoutStore {
  /** 全局 layout 配置对象 */
  private static _layoutOptions: LayoutItems = {
    layoutType: 'tree',
    treeType: 'right',
    direction: 'TB',
  };

  /** 获取全局 layoutOptions */
  static get layoutOptions(): LayoutItems {
    return this._layoutOptions;
  }

  /** 设置 layoutOptions */
  static set layoutOptions(options: LayoutItems) {
    this._layoutOptions = options;
  }

  /** 当前 layoutType */
  static get layoutType(): LayoutItems['layoutType'] {
    return this._layoutOptions.layoutType;
  }

  /** 通用方向字段 */
  static get direction(): string | undefined {
    return this._layoutOptions.direction;
  }

  /** 仅 tree 布局下存在 treeType */
  static get treeType(): 'left' | 'right' | 'both' | undefined {
    return this._layoutOptions.layoutType === 'tree' ? this._layoutOptions.treeType : undefined;
  }

  /** 局部更新（类型安全） */
  static updatePartial(options: Partial<LayoutItems>) {
    this._layoutOptions = { ...this._layoutOptions, ...options };
  }

  /** 重置布局为默认 tree */
  static reset() {
    this._layoutOptions = {
      layoutType: 'tree',
      treeType: 'right',
      direction: 'TB',
    };
  }
}
