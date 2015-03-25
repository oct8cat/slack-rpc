TEST_DIR = test
NODE_MODULES_DIR = node_modules
NODE_MODULES_BIN_DIR = $(NODE_MODULES_DIR)/.bin
BIN_DIR = bin
LIB_DIR = lib

MOCHA = $(NODE_MODULES_BIN_DIR)/mocha
JSHINT = $(NODE_MODULES_BIN_DIR)/jshint

test:
	$(MOCHA) $(TEST_DIR)/unit.js
	$(MOCHA) $(TEST_DIR)/e2e.js
.PHONY: test

jshint:
	$(JSHINT) $(BIN_DIR) $(LIB_DIR) $(TEST_DIR) index.js
