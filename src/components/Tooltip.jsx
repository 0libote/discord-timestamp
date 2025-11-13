import React from 'react';
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
  FloatingPortal,
} from '@floating-ui/react';
import { motion, AnimatePresence } from 'framer-motion';

export function useTooltip({
  initialOpen = false,
  placement = 'top',
  open: controlledOpen,
  onOpenChange: setControlledOpen,
} = {}) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(initialOpen);

  const open = controlledOpen ?? uncontrolledOpen;
  const setOpen = setControlledOpen ?? setUncontrolledOpen;

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'start',
        padding: 5,
      }),
      shift({ padding: 5 }),
    ],
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

  return React.useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
    }),
    [open, setOpen, interactions, data],
  );
}

const TooltipContext = React.createContext(null);

export const useTooltipContext = () => {
  const context = React.useContext(TooltipContext);
  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />');
  }
  return context;
};

export function Tooltip({ children, ...options }) {
  const tooltip = useTooltip(options);
  return (
    <TooltipContext.Provider value={tooltip}>
      {children}
    </TooltipContext.Provider>
  );
}

export const TooltipTrigger = React.forwardRef(function TooltipTrigger({ children, asChild = false, ...props }, propRef) {
  const context = useTooltipContext();
  const childrenRef = (children).ref;
  const ref = React.useMemo(() => {
    if (propRef) {
      if (typeof propRef === 'function') {
        propRef(context.refs.setReference);
      } else {
        propRef.current = context.refs.setReference;
      }
    }
    if (childrenRef) {
      if (typeof childrenRef === 'function') {
        childrenRef(context.refs.setReference);
      } else {
        childrenRef.current = context.refs.setReference;
      }
    }
    return context.refs.setReference;
  }, [context.refs.setReference, propRef, childrenRef]);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(
      children,
      context.getReferenceProps({
        ref,
        ...props,
        ...children.props,
        'data-state': context.open ? 'open' : 'closed',
      }),
    );
  }

  return (
    <button
      ref={ref}
      data-state={context.open ? 'open' : 'closed'}
      {...context.getReferenceProps(props)}
    >
      {children}
    </button>
  );
});

export const TooltipContent = React.forwardRef(function TooltipContent({ style, ...props }, propRef) {
  const context = useTooltipContext();
  const ref = React.useMemo(() => {
    if (propRef) {
      if (typeof propRef === 'function') {
        propRef(context.refs.setFloating);
      } else {
        propRef.current = context.refs.setFloating;
      }
    }
    return context.refs.setFloating;
  }, [context.refs.setFloating, propRef]);

  return (
    <FloatingPortal>
      <AnimatePresence>
        {context.open && (
          <motion.div
            ref={ref}
            style={{
              ...context.floatingStyles,
              ...style,
              zIndex: 50,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            {...context.getFloatingProps(props)}
          />
        )}
      </AnimatePresence>
    </FloatingPortal>
  );
});