<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item label="类型名称" prop="typeName">
        <el-input
          v-model="queryParams.typeName"
          placeholder="请输入类型名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['cases:type:add']"
        >新增</el-button>
      </el-form-item>
    </el-form>


    <el-table
      v-loading="loading"
      :data="typeList"
      row-key="id"
      default-expand-all
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <!--<el-table-column label="类型编号" prop="id"></el-table-column>-->
      <el-table-column label="类型名称" prop="typeName"></el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['cases:type:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-plus"
            @click="handleAdd(scope.row)"
            v-hasPermi="['cases:type:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['cases:type:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--<pagination-->
      <!--v-show="total>0"-->
      <!--:total="total"-->
      <!--:page.sync="queryParams.pageNum"-->
      <!--:limit.sync="queryParams.pageSize"-->
      <!--@pagination="getList"-->
    <!--/>-->

    <!-- 添加或修改问诊问答类型对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上级类型" prop="pid">
          <treeselect
            v-model="form.pid"
            :options="typeOptions"
            :show-count="true"
            placeholder="选择上级类型" />
        </el-form-item>
        <el-form-item label="类型名称" prop="typeName">
          <el-input v-model="form.typeName" placeholder="请输入类型名称" />
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listType,treeselect, getType, delType, addType, updateType, exportType } from "@/api/cases/type";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "Type",
  components: { Treeselect },
  data() {
    return {
      loading: true,
      ids: [],
      // single: true,
      // multiple: true,
      // total: 0,
      typeList: [],
      typeOptions: [],
      title: "",
      open: false,
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
        typeName: undefined,
        // pid: undefined
      },
      form: {},
      rules: {
        typeName: [
          { required: true, message: "类型名称不能为空", trigger: "blur" }
        ],

      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.loading = true;
      listType(this.queryParams).then(response => {
        this.typeList = response.data;
        this.loading = false;
      });
    },

    getTreeselect() {
      treeselect().then(response => {

        this.typeOptions = [];
        const t = { id: 0, label: '大类', children: [] };
        t.children = response.data;
        this.typeOptions.push(t);
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        id: undefined,
        typeName: undefined,
        pid: 0
      };
      this.resetForm("form");
    },
    handleQuery() {
      // this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // handleSelectionChange(selection) {
    //   this.ids = selection.map(item => item.id)
    //   this.single = selection.length!=1
    //   this.multiple = !selection.length
    // },
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      if (row != null) {
        this.form.pid = row.id;
      }
      this.open = true;
      this.title = "添加问诊问答所属类型";
    },
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      getType(row.id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改问诊问答所属类型";
      });
    },
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateType(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addType(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("新增成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          }
        }
      });
    },
    handleDelete(row) {
      // const ids = row.id || this.ids;
      this.$confirm('是否确认删除类型名称为"' + row.typeName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delType(row.id);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有问诊问答所属类型数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportType(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};


</script>
