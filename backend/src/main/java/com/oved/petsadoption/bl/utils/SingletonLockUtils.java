package com.oved.petsadoption.bl.utils;

import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

public class SingletonLockUtils {
    private Lock lock = new ReentrantLock();

    private SingletonLockUtils() {

    }

    public static SingletonLockUtils getInstance() {
        return Instance.singletonLock;
    }

    public Lock getLock() {
        return lock;
    }

    private static class Instance {
        private static SingletonLockUtils singletonLock = new SingletonLockUtils();
    }
}
