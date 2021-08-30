<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" label-width="108px">
      <el-form-item label="学习项目名称" prop="learningName">
        <el-input
          v-model="queryParams.learningName"
          placeholder="请输入学习项目名称"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <!--<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['learning:learning:add']"
        >新增</el-button>
      </el-form-item>
    </el-form>


      <el-table
        v-loading="loading"
        :data="learningList"
        row-key="learningId"
        default-expand-all
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      >
        <el-table-column label="学习项目名称"  prop="learningName" ></el-table-column>
        <!--<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="学习项目ID" align="center" prop="learningId" />
      <el-table-column label="学习项目名称" align="center" prop="learningName" />
      <el-table-column label="所属学习项目ID" align="center" prop="pid" />-->
      <el-table-column label="详细信息" align="justify" width="1300" prop="result" />
      <el-table-column label="操作" align="center"  class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['learning:learning:edit']"
          >修改</el-button>
          <el-button
            type="text"
            icon="el-icon-plus"
            size="mini"
            @click="handleAdd(scope.row)"
            v-hasPermi="['learning:learning:add']"
          >新增</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['learning:learning:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>


    <!-- 添加或修改学习项目对话框 -->

    <el-dialog :title="title" :visible.sync="open" width="500px">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学习项目名称" prop="learningName">
          <el-input v-model="form.learningName" placeholder="请输入学习项目名称" />
        </el-form-item>
        <!--<el-form-item label="所属项目ID" prop="pid">
          <el-input v-model="form.pid" placeholder="请输入所属项目ID" />
        </el-form-item>-->
        <el-form-item label="所属项目ID" prop="pid">
          <treeselect
            v-model="form.pid"
            :options="learningOptions"
            :show-count="true"
            placeholder="选择上级项目" />
        </el-form-item>
        <el-form-item label="详细信息" prop="result">
          <el-input v-model="form.result" type="textarea" placeholder="请输入内容" />
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
import { listLearning, treeselect ,getLearning, delLearning, addLearning, updateLearning, exportLearning } from "@/api/cases/learning";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  components: { Treeselect},
  name:"Learning",
  data() {
    return {
      loading: true,
      ids: [],
      single: true,
      multiple: true,
      total: 0,
      learningList: [],
      learningOptions: [],
      title: "",
      open: false,
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
        learningName: undefined,
        // pid: undefined
      },
      form: {},
      rules: {
        learningName: [
          { required: true, message: "学习项目名称不能为空", trigger: "blur" }
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
      listLearning(this.queryParams).then(response => {
        this.learningList = response.data;
        // this.total = response.total;
        this.loading = false;
      });
    },
    getTreeselect() {
      treeselect().then(response => {

        this.learningOptions = [];
        const t = { id: 0, label: '项目', children: [] };
        t.children = response.data;
        this.learningOptions.push(t);
      });
    },
    cancel() {
      this.open = false;
      this.reset();
    },
    reset() {
      this.form = {
        learningId: undefined,
        learningName: undefined,
        pid: 0,
        result: undefined,
        /*createBy: undefined,
        createTime: undefined,
        updateBy: undefined,
        updateTime: undefined*/
      };
      this.resetForm("form");
    },
    handleQuery() {
      //this.queryParams.pageNum = 1;
      this.getList();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.learningId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    handleAdd(row) {
      this.reset();
      this.getTreeselect();
      console.log(row)
      if (row != null) {
        this.form.pid = row.learningId;
      }
      this.open = true;
      this.title = "添加学习项目";
    },
    handleUpdate(row) {
      this.reset();
      this.getTreeselect();
      // const learningId = row.learningId || this.ids
      getLearning(row.learningId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改学习项目";
      });
    },
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.learningId != undefined) {
            updateLearning(this.form).then(response => {
              if (response.code === 200) {
                this.msgSuccess("修改成功");
                this.open = false;
                this.getList();
              } else {
                this.msgError(response.msg);
              }
            });
          } else {
            addLearning(this.form).then(response => {
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
      this.$confirm('是否确认删除学习项目名称为"' + row.learningName + '"的数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return delLearning(row.learningId);
        }).then(() => {
          this.getList();
          this.msgSuccess("删除成功");
        }).catch(function() {});
    },
    handleExport() {
      const queryParams = this.queryParams;
      this.$confirm('是否确认导出所有学习项目数据项?', "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(function() {
          return exportLearning(queryParams);
        }).then(response => {
          this.download(response.msg);
        }).catch(function() {});
    }
  }
};
</script>
