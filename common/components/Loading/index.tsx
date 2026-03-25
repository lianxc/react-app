import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import LoadingElem from './loading';

interface LoadingOptions {
  visible: boolean;
}

class LoadingManager {
  private container: HTMLDivElement | null = null;
  private root: ReturnType<typeof createRoot> | null = null;
  private setLoadingOptions: React.Dispatch<React.SetStateAction<LoadingOptions | null>> | null = null;

  constructor() {
    this.init();
  }

  private init() {
    if (!this.container) {
      this.container = document.createElement('div');
      document.body.appendChild(this.container);

      const LoadingController: React.FC = () => {
        const [loading, setLoading] = useState<LoadingOptions | null>(null);
        this.setLoadingOptions = setLoading;

        return (
          <LoadingElem
            visible={loading?.visible || false}
          />
        );
      };
      this.root = createRoot(this.container);
      this.root?.render(<LoadingController />);
    }
  }

  showLoading(visible: boolean) {
    this.setLoadingOptions?.({ visible });
  }
}

const loadingManager = new LoadingManager();

export default function loading(
  visible: boolean
): void {
  loadingManager.showLoading(visible);
}