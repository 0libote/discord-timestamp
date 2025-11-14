import {
    useFloating,
    autoUpdate,
    offset,
    flip,
    shift,
    useHover,
    useFocus,
    useDismiss,
    useRole,
    useInteractions,
    useMergeRefs,
    FloatingPortal,
  } from '@floating-ui/react';
  import { createContext, forwardRef, useContext, useMemo, useState } from 'react';
  
  const TooltipContext = createContext(null);
  
  export const useTooltip = () => {
    const context = useContext(TooltipContext);
  
    if (context == null) {
      throw new Error('Tooltip components must be wrapped in <Tooltip />');
    }
  
    return context;
  };
  
  export function Tooltip({ children, ...options }) {
    const tooltip = useTooltipState(options);
    return <TooltipContext.Provider value={tooltip}>{children}</TooltipContext.Provider>;
  }
  
  export const TooltipTrigger = forwardRef(function TooltipTrigger(
    { children, asChild = false, ...props },
    propRef
  ) {
    const context = useTooltip();
    const childrenRef = children.ref;
    const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef]);
  
    if (asChild) {
      return React.cloneElement(
        children,
        context.getReferenceProps({
          ref,
          ...props,
          ...children.props,
          'data-state': context.open ? 'open' : 'closed',
        })
      );
    }
  
    return (
      <button ref={ref} data-state={context.open ? 'open' : 'closed'} {...context.getReferenceProps(props)}>
        {children}
      </button>
    );
  });
  
  export const TooltipContent = forwardRef(function TooltipContent({ style, ...props }, propRef) {
    const context = useTooltip();
    const ref = useMergeRefs([context.refs.setFloating, propRef]);
  
    if (!context.open) return null;
  
    return (
      <FloatingPortal>
        <div
          ref={ref}
          style={{
            ...context.floatingStyles,
            ...style,
          }}
          {...context.getFloatingProps(props)}
        />
      </FloatingPortal>
    );
  });
  
  export const useTooltipState = (options = {}) => {
    const {
      initialOpen = false,
      placement = 'top',
      open: controlledOpen,
      onOpenChange: setControlledOpen,
    } = options;
  
    const [uncontrolledOpen, setUncontrolledOpen] = useState(initialOpen);
  
    const open = controlledOpen ?? uncontrolledOpen;
    const setOpen = setControlledOpen ?? setUncontrolledOpen;
  
    const data = useFloating({
      placement,
      open,
      onOpenChange: setOpen,
      whileElementsMounted: autoUpdate,
      middleware: [offset(5), flip(), shift()],
    });
  
    const context = data.context;
  
    const hover = useHover(context, {
      move: false,
      enabled: controlledOpen == null,
    });
    const focus = useFocus(context, {
      enabled: controlledOpen == null,
    });
    const dismiss = useDismiss(context);
    const role = useRole(context, { role: 'tooltip' });
  
    const interactions = useInteractions([hover, focus, dismiss, role]);
  
    return useMemo(
      () => ({
        open,
        setOpen,
        ...interactions,
        ...data,
      }),
      [open, setOpen, interactions, data]
    );
  };
